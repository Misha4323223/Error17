
/**
 * Глобальный оптимизатор производительности семантической системы
 * Управляет производительностью всех 40+ семантических модулей
 */

const { createLogger } = require('./semantic-logger.cjs');
const logger = createLogger('SEMANTIC-PERFORMANCE-OPTIMIZER');

class SemanticPerformanceOptimizer {
  constructor() {
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      responseTimes: [],
      errorCount: 0,
      cacheHitRate: 0,
      modulePerformance: {},
      systemLoad: 0
    };
    
    this.thresholds = {
      maxResponseTime: 5000, // 5 секунд
      maxConcurrentRequests: 10,
      maxMemoryUsage: 512 * 1024 * 1024, // 512MB
      minCacheHitRate: 0.3 // 30%
    };
    
    this.activeRequests = new Set();
    this.moduleStats = new Map();
    
    logger.info('Оптимизатор производительности инициализирован');
  }

  /**
   * Оптимизирует выполнение запроса
   */
  async optimizeRequest(requestFunction, options = {}) {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    // Проверяем системную нагрузку
    if (this.activeRequests.size >= this.thresholds.maxConcurrentRequests) {
      logger.warn(`Достигнут лимит одновременных запросов: ${this.activeRequests.size}`);
      
      // Ждем освобождения слота
      await this.waitForSlot();
    }
    
    this.activeRequests.add(requestId);
    this.metrics.requestCount++;
    
    try {
      logger.debug(`Начало выполнения запроса ${requestId}`);
      
      // Выполняем запрос с мониторингом
      const result = await this.executeWithMonitoring(requestFunction, requestId, options);
      
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, false);
      
      logger.info(`Запрос ${requestId} выполнен за ${responseTime}мс`);
      
      return result;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, true);
      
      logger.error(`Ошибка в запросе ${requestId}:`, error);
      throw error;
      
    } finally {
      this.activeRequests.delete(requestId);
    }
  }

  /**
   * Выполняет функцию с мониторингом производительности
   */
  async executeWithMonitoring(requestFunction, requestId, options) {
    const memoryBefore = process.memoryUsage();
    
    try {
      const result = await requestFunction();
      
      const memoryAfter = process.memoryUsage();
      const memoryDelta = memoryAfter.heapUsed - memoryBefore.heapUsed;
      
      // Логируем использование памяти если значительное
      if (memoryDelta > 10 * 1024 * 1024) { // 10MB
        logger.warn(`Запрос ${requestId} использовал ${(memoryDelta / 1024 / 1024).toFixed(1)}MB памяти`);
      }
      
      return result;
      
    } catch (error) {
      logger.error(`Ошибка выполнения в запросе ${requestId}:`, error);
      throw error;
    }
  }

  /**
   * Ожидает освобождения слота для выполнения
   */
  async waitForSlot(timeout = 10000) {
    const startWait = Date.now();
    
    while (this.activeRequests.size >= this.thresholds.maxConcurrentRequests) {
      if (Date.now() - startWait > timeout) {
        throw new Error('Timeout ожидания освобождения слота для выполнения запроса');
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Обновляет метрики производительности
   */
  updateMetrics(responseTime, isError) {
    // Обновляем время ответа
    this.metrics.responseTimes.push(responseTime);
    if (this.metrics.responseTimes.length > 100) {
      this.metrics.responseTimes = this.metrics.responseTimes.slice(-50);
    }
    
    // Вычисляем среднее время ответа
    this.metrics.averageResponseTime = this.metrics.responseTimes.reduce((sum, time) => sum + time, 0) / this.metrics.responseTimes.length;
    
    // Обновляем счетчик ошибок
    if (isError) {
      this.metrics.errorCount++;
    }
    
    // Обновляем системную нагрузку
    this.metrics.systemLoad = this.activeRequests.size / this.thresholds.maxConcurrentRequests;
  }

  /**
   * Оптимизирует выполнение конкретного модуля
   */
  async optimizeModule(moduleName, moduleFunction, input, options = {}) {
    const moduleStartTime = Date.now();
    
    try {
      const result = await moduleFunction(input, options);
      
      const moduleTime = Date.now() - moduleStartTime;
      this.updateModuleStats(moduleName, moduleTime, false);
      
      return result;
      
    } catch (error) {
      const moduleTime = Date.now() - moduleStartTime;
      this.updateModuleStats(moduleName, moduleTime, true);
      
      logger.error(`Ошибка в модуле ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * Обновляет статистику модуля
   */
  updateModuleStats(moduleName, responseTime, isError) {
    if (!this.moduleStats.has(moduleName)) {
      this.moduleStats.set(moduleName, {
        executions: 0,
        totalTime: 0,
        averageTime: 0,
        errors: 0,
        successRate: 1
      });
    }
    
    const stats = this.moduleStats.get(moduleName);
    stats.executions++;
    stats.totalTime += responseTime;
    stats.averageTime = stats.totalTime / stats.executions;
    
    if (isError) {
      stats.errors++;
    }
    
    stats.successRate = (stats.executions - stats.errors) / stats.executions;
    
    this.moduleStats.set(moduleName, stats);
  }

  /**
   * Получает текущие метрики производительности
   */
  getMetrics() {
    return {
      ...this.metrics,
      moduleStats: Object.fromEntries(this.moduleStats),
      currentLoad: this.activeRequests.size,
      maxLoad: this.thresholds.maxConcurrentRequests,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  /**
   * Проверяет состояние производительности системы
   */
  checkPerformanceHealth() {
    const metrics = this.getMetrics();
    const issues = [];
    
    // Проверяем время ответа
    if (metrics.averageResponseTime > this.thresholds.maxResponseTime) {
      issues.push(`Среднее время ответа превышает лимит: ${metrics.averageResponseTime}мс > ${this.thresholds.maxResponseTime}мс`);
    }
    
    // Проверяем использование памяти
    if (metrics.memoryUsage.heapUsed > this.thresholds.maxMemoryUsage) {
      issues.push(`Использование памяти превышает лимит: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)}MB > ${(this.thresholds.maxMemoryUsage / 1024 / 1024).toFixed(1)}MB`);
    }
    
    // Проверяем системную нагрузку
    if (metrics.systemLoad > 0.8) {
      issues.push(`Высокая системная нагрузка: ${(metrics.systemLoad * 100).toFixed(1)}%`);
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      metrics
    };
  }

  /**
   * Оптимизирует систему в реальном времени
   */
  optimizeSystem() {
    const health = this.checkPerformanceHealth();
    
    if (!health.healthy) {
      logger.warn('Обнаружены проблемы производительности:', health.issues);
      
      // Применяем оптимизации
      this.applyOptimizations(health);
    }
    
    return health;
  }

  /**
   * Применяет оптимизации на основе анализа производительности
   */
  applyOptimizations(healthReport) {
    const metrics = healthReport.metrics;
    
    // Если высокая нагрузка - снижаем лимиты
    if (metrics.systemLoad > 0.8) {
      this.thresholds.maxConcurrentRequests = Math.max(3, this.thresholds.maxConcurrentRequests - 2);
      logger.info(`Снижен лимит одновременных запросов до ${this.thresholds.maxConcurrentRequests}`);
    }
    
    // Если высокое время ответа - увеличиваем таймауты
    if (metrics.averageResponseTime > this.thresholds.maxResponseTime) {
      this.thresholds.maxResponseTime = Math.min(10000, this.thresholds.maxResponseTime + 1000);
      logger.info(`Увеличен лимит времени ответа до ${this.thresholds.maxResponseTime}мс`);
    }
    
    // Принудительная очистка памяти если необходимо
    if (metrics.memoryUsage.heapUsed > this.thresholds.maxMemoryUsage) {
      if (global.gc) {
        global.gc();
        logger.info('Выполнена принудительная очистка памяти');
      }
    }
  }
}

// Создаем глобальный экземпляр
const globalPerformanceOptimizer = new SemanticPerformanceOptimizer();

// Запускаем периодическую оптимизацию
setInterval(() => {
  globalPerformanceOptimizer.optimizeSystem();
}, 30000); // Каждые 30 секунд

module.exports = {
  globalPerformanceOptimizer,
  SemanticPerformanceOptimizer
};
