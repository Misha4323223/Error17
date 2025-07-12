/**
 * ЭТАП 6: Веб-dashboard для мониторинга всех 50+ семантических модулей
 * Показывает состояние, статистику, алерты в реальном времени
 */

const { createLogger } = require('./semantic-logger.cjs');
const { globalHealthChecker } = require('./semantic-healthcheck.cjs');
const logger = createLogger('SEMANTIC-DASHBOARD');

// Отложенная инициализация для избежания циклических зависимостей
let healthCheckerReady = false;
setTimeout(() => {
  try {
    if (typeof globalHealthChecker.registerBasicModules === 'function') {
      globalHealthChecker.registerBasicModules();
    }
    healthCheckerReady = true;
    logger.info('🎛️ Health checker готов для dashboard');
  } catch (error) {
    logger.warn('Отложенная инициализация health checker:', error.message);
  }
}, 150);

class SemanticMonitorDashboard {
  constructor() {
    this.moduleStats = new Map();
    this.alerts = [];
    this.performanceHistory = [];
    this.startTime = Date.now();
    this.updateInterval = 5000; // 5 секунд

    this.initializeModuleTracking();
    this.startPeriodicUpdates();
    logger.info('🎛️ Semantic Monitor Dashboard инициализирован');
  }

  /**
   * Инициализация отслеживания модулей
   */
  initializeModuleTracking() {
    const knownModules = [
      // Критичные модули
      'semantic-memory', 'intelligent-processor', 'semantic-integration-layer',
      'natural-language-generator', 'semantic-analyzer', 'meta-semantic-engine',
      'emotional-semantic-matrix', 'conversation-engine',

      // Основные модули
      'project-manager', 'entity-extractor', 'project-predictor', 'knowledge-graph',
      'user-profiler', 'learning-system', 'predictive-system',

      // Расширенные модули
      'biomimetic-semantics', 'divine-semantics', 'cognitive-dna-profiler',
      'business-context-analyzer', 'collective-semantic-wisdom', 'creative-semantic-engine',
      'cross-contextual-semantics', 'autonomous-learning-engine', 'quantum-semantic-processor',
      'recursive-self-modeler', 'cognitive-fingerprinter', 'dynamic-neural-architect',
      'semantic-telepathy', 'temporal-semantic-machine', 'universal-semantic-theory',
      'image-consultation-semantic', 'visual-semantic-integration', 'semantic-alchemy',

      // Специализированные модули
      'multilingual-processor', 'realtime-processor', 'external-knowledge-integrator',
      'semantic-reality-engine', 'semantic-intuition', 'semantic-synesthesia',
      'semantic-black-holes', 'interdimensional-semantics', 'multidimensional-semantics',
      'quantum-temporal-semantics', 'temporal-meta-semantics', 'swarm-semantic-intelligence',
      'semantic-topology-explorer', 'temporal-machine-core', 'temporal-machine-engine',
      'temporal-machine-integration', 'user-memory-manager'
    ];

    knownModules.forEach(moduleName => {
      this.moduleStats.set(moduleName, {
        name: moduleName,
        status: 'unknown',
        lastCheck: null,
        responseTime: 0,
        errorCount: 0,
        successCount: 0,
        uptime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        isCritical: this.isCriticalModule(moduleName),
        healthHistory: [],
        lastError: null,
        performanceScore: 100
      });
    });
  }

  /**
   * Проверяет является ли модуль критичным
   */
  isCriticalModule(moduleName) {
    const criticalModules = [
      'semantic-memory', 'intelligent-processor', 'semantic-integration-layer',
      'natural-language-generator', 'semantic-analyzer', 'meta-semantic-engine',
      'emotional-semantic-matrix', 'conversation-engine'
    ];
    return criticalModules.includes(moduleName);
  }

  /**
   * Обновляет статистику модуля
   */
  updateModuleStats(moduleName, stats) {
    const moduleData = this.moduleStats.get(moduleName);
    if (!moduleData) return;

    const previousStatus = moduleData.status;

    // Обновляем статистику
    Object.assign(moduleData, {
      ...stats,
      lastCheck: Date.now(),
      uptime: moduleData.status === 'healthy' ? moduleData.uptime + this.updateInterval : 0
    });

    // Добавляем в историю
    moduleData.healthHistory.push({
      timestamp: Date.now(),
      status: stats.status,
      responseTime: stats.responseTime || 0,
      errorCount: stats.errorCount || 0
    });

    // Ограничиваем историю
    if (moduleData.healthHistory.length > 50) {
      moduleData.healthHistory = moduleData.healthHistory.slice(-25);
    }

    // Проверяем изменение статуса
    if (previousStatus !== stats.status) {
      this.handleStatusChange(moduleName, previousStatus, stats.status);
    }

    // Обновляем счетчик производительности
    this.updatePerformanceScore(moduleName);
  }

  /**
   * Обрабатывает изменение статуса модуля
   */
  handleStatusChange(moduleName, oldStatus, newStatus) {
    const moduleData = this.moduleStats.get(moduleName);
    const alertLevel = this.getAlertLevel(newStatus, moduleData.isCritical);

    const alert = {
      id: Date.now(),
      timestamp: Date.now(),
      moduleName: moduleName,
      type: 'status_change',
      level: alertLevel,
      message: `${moduleName}: ${oldStatus} → ${newStatus}`,
      critical: moduleData.isCritical && (newStatus === 'critical' || newStatus === 'unavailable'),
      resolved: false
    };

    this.alerts.unshift(alert);

    // Ограничиваем количество алертов
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 50);
    }

    logger.warn(`🚨 [ALERT] ${alert.message} (${alertLevel})`);
  }

  /**
   * Определяет уровень алерта
   */
  getAlertLevel(status, isCritical) {
    if (status === 'unavailable') return isCritical ? 'critical' : 'high';
    if (status === 'critical') return 'critical';
    if (status === 'degraded') return isCritical ? 'high' : 'medium';
    if (status === 'healthy') return 'info';
    return 'low';
  }

  /**
   * Обновляет счетчик производительности
   */
  updatePerformanceScore(moduleName) {
    const moduleData = this.moduleStats.get(moduleName);
    if (!moduleData) return;

    let score = 100;

    // Снижаем за ошибки
    const errorRate = moduleData.errorCount / (moduleData.successCount + moduleData.errorCount || 1);
    score -= errorRate * 30;

    // Снижаем за время ответа
    if (moduleData.responseTime > 1000) {
      score -= Math.min(20, (moduleData.responseTime - 1000) / 100);
    }

    // Снижаем за статус
    switch (moduleData.status) {
      case 'critical': score -= 50; break;
      case 'degraded': score -= 25; break;
      case 'unavailable': score -= 70; break;
    }

    moduleData.performanceScore = Math.max(0, Math.round(score));
  }

  /**
   * Запускает периодические обновления (ASYNC)
   */
  startPeriodicUpdates() {
    const performUpdate = async () => {
      try {
        await this.collectSystemMetrics();
        this.updateOverallSystemHealth();
      } catch (error) {
        logger.warn(`⚠️ Ошибка обновления dashboard: ${error.message}`);
      }
    };
    
    // Запускаем с задержкой в 15 секунд для избежания конфликтов с health checker
    setTimeout(() => {
      performUpdate();
      setInterval(performUpdate, this.updateInterval);
    }, 15000);
    
    logger.info(`🎛️ Dashboard будет обновляться каждые ${this.updateInterval/1000}сек (запуск через 15сек)`);
  }

  /**
   * Собирает метрики системы (ASYNC)
   */
  async collectSystemMetrics() {
    try {
      // Проверяем готовность healthChecker для избежания циклических зависимостей
      if (!healthCheckerReady) {
        logger.debug('Health checker не готов, пропускаем сбор метрик');
        return;
      }

      const healthCheck = await globalHealthChecker.checkSystemHealth();

      // Обновляем статистику модулей на основе health check
      for (const [moduleName, moduleHealth] of Object.entries(healthCheck.modules)) {
        this.updateModuleStats(moduleName, {
          status: moduleHealth.status,
          responseTime: moduleHealth.metrics?.averageResponseTime || 0,
          errorCount: moduleHealth.metrics?.totalCalls - moduleHealth.metrics?.successfulCalls || 0,
          successCount: moduleHealth.metrics?.successfulCalls || 0,
          memoryUsage: moduleHealth.metrics?.memoryUsage || 0,
          lastError: moduleHealth.issues?.[0] || null
        });
      }

      // Добавляем общую производительность в историю
      this.performanceHistory.push({
        timestamp: Date.now(),
        systemStatus: healthCheck.status,
        healthyModules: healthCheck.summary.healthy,
        totalModules: healthCheck.summary.total,
        memoryUsage: process.memoryUsage().heapUsed,
        uptime: process.uptime()
      });

      // Ограничиваем историю производительности
      if (this.performanceHistory.length > 288) { // 24 часа при обновлении каждые 5 минут
        this.performanceHistory = this.performanceHistory.slice(-144); // оставляем 12 часов
      }

    } catch (error) {
      logger.error('Ошибка сбора метрик системы:', error);
    }
  }

  /**
   * Обновляет общее состояние системы
   */
  updateOverallSystemHealth() {
    const stats = this.getSystemStatistics();

    // Проверяем критичные модули
    const criticalModulesDown = stats.modules.filter(m => 
      m.isCritical && (m.status === 'critical' || m.status === 'unavailable')
    ).length;

    if (criticalModulesDown > 2) {
      this.createSystemAlert('critical', `${criticalModulesDown} критичных модулей недоступны`);
    }

    // Проверяем общую производительность
    const avgPerformance = stats.avgPerformanceScore;
    if (avgPerformance < 50) {
      this.createSystemAlert('high', `Низкая производительность системы: ${avgPerformance.toFixed(1)}%`);
    }
  }

  /**
   * Создает системный алерт
   */
  createSystemAlert(level, message) {
    const existingAlert = this.alerts.find(a => 
      a.type === 'system' && a.message === message && !a.resolved
    );

    if (existingAlert) return; // Не дублируем алерты

    const alert = {
      id: Date.now(),
      timestamp: Date.now(),
      moduleName: 'SYSTEM',
      type: 'system',
      level: level,
      message: message,
      critical: level === 'critical',
      resolved: false
    };

    this.alerts.unshift(alert);
    logger.error(`🚨 [SYSTEM ALERT] ${message}`);
  }

  /**
   * Получает статистику системы для dashboard
   */
  getSystemStatistics() {
    const modules = Array.from(this.moduleStats.values());

    const healthyModules = modules.filter(m => m.status === 'healthy').length;
    const criticalModules = modules.filter(m => m.status === 'critical' || m.status === 'unavailable').length;
    const degradedModules = modules.filter(m => m.status === 'degraded').length;

    const avgResponseTime = modules.reduce((sum, m) => sum + m.responseTime, 0) / modules.length;
    const avgPerformanceScore = modules.reduce((sum, m) => sum + m.performanceScore, 0) / modules.length;

    const totalErrors = modules.reduce((sum, m) => sum + m.errorCount, 0);
    const totalSuccess = modules.reduce((sum, m) => sum + m.successCount, 0);

    return {
      systemUptime: Date.now() - this.startTime,
      totalModules: modules.length,
      healthyModules,
      criticalModules,
      degradedModules,
      avgResponseTime: Math.round(avgResponseTime),
      avgPerformanceScore,
      totalErrors,
      totalSuccess,
      errorRate: totalErrors / (totalErrors + totalSuccess || 1),
      modules: modules,
      alerts: this.alerts.filter(a => !a.resolved).slice(0, 10),
      performanceHistory: this.performanceHistory.slice(-24) // последние 2 часа
    };
  }

  /**
   * Получить статистику системы
   */
  getSystemStats() {
    const stats = {
      totalModules: Object.keys(this.moduleStats).length,
      healthyModules: Object.values(this.moduleStats).filter(m => m.status === 'healthy').length,
      degradedModules: Object.values(this.moduleStats).filter(m => m.status === 'degraded').length,
      errorModules: Object.values(this.moduleStats).filter(m => m.status === 'error').length,
      totalRequests: Object.values(this.moduleStats).reduce((sum, m) => sum + m.requestCount, 0),
      totalErrors: Object.values(this.moduleStats).reduce((sum, m) => sum + m.errorCount, 0),
      averageResponseTime: this.calculateAverageResponseTime(),
      uptime: Date.now() - this.startTime
    };

    // ЭТАП 7: Добавляем статистику производительности
    stats.performance = this.getPerformanceStats();
    stats.cache = this.getCacheStats();
    stats.parallel = this.getParallelProcessingStats();

    return stats;
  }

  /**
   * ЭТАП 7: Получить статистику производительности
   */
  getPerformanceStats() {
    try {
      const { globalPerformanceOptimizer } = require('./semantic-performance-optimizer.cjs');
      return globalPerformanceOptimizer.getMetrics();
    } catch (error) {
      return {
        error: 'Performance optimizer недоступен',
        available: false
      };
    }
  }

  /**
   * ЭТАП 7: Получить статистику кэша
   */
  getCacheStats() {
    try {
      const { globalSemanticCache } = require('./semantic-cache.cjs');
      return globalSemanticCache.getStats();
    } catch (error) {
      return {
        error: 'Semantic cache недоступен',
        available: false
      };
    }
  }

  /**
   * ЭТАП 7: Получить статистику параллельной обработки
   */
  getParallelProcessingStats() {
    try {
      const { SemanticParallelProcessor } = require('./semantic-parallel-processor.cjs');
      // Глобальный экземпляр может быть недоступен, возвращаем базовую информацию
      return {
        available: true,
        implementation: 'SemanticParallelProcessor',
        status: 'active'
      };
    } catch (error) {
      return {
        error: 'Parallel processor недоступен',
        available: false
      };
    }
  }

  /**
   * Получает данные для веб-интерфейса
   */
  getDashboardData() {
    const stats = this.getSystemStatistics();

    return {
      timestamp: Date.now(),
      system: {
        status: this.getOverallSystemStatus(stats),
        uptime: stats.systemUptime,
        performance: stats.avgPerformanceScore
      },
      modules: stats.modules.map(m => ({
        name: m.name,
        status: m.status,
        isCritical: m.isCritical,
        responseTime: m.responseTime,
        performanceScore: m.performanceScore,
        errorCount: m.errorCount,
        successCount: m.successCount,
        lastCheck: m.lastCheck,
        uptime: m.uptime
      })),
      alerts: stats.alerts,
      metrics: {
        totalModules: stats.totalModules,
        healthyModules: stats.healthyModules,
        criticalModules: stats.criticalModules,
        degradedModules: stats.degradedModules,
        avgResponseTime: stats.avgResponseTime,
        errorRate: (stats.errorRate * 100).toFixed(2)
      },
      performance: stats.performanceHistory
    };
  }

  /**
   * Определяет общий статус системы
   */
  getOverallSystemStatus(stats) {
    if (stats.criticalModules > 2) return 'critical';
    if (stats.criticalModules > 0 || stats.degradedModules > 5) return 'degraded';
    if (stats.healthyModules / stats.totalModules > 0.9) return 'optimal';
    return 'healthy';
  }

  /**
   * Отмечает алерт как решенный
   */
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      logger.info(`✅ Алерт ${alertId} отмечен как решенный`);
    }
  }

  /**
   * Сбрасывает статистику модуля
   */
  resetModuleStats(moduleName) {
    const moduleData = this.moduleStats.get(moduleName);
    if (moduleData) {
      moduleData.errorCount = 0;
      moduleData.successCount = 0;
      moduleData.performanceScore = 100;
      moduleData.healthHistory = [];
      logger.info(`🔄 Статистика модуля ${moduleName} сброшена`);
    }
  }
}

// Создаем глобальный экземпляр dashboard
const globalDashboard = new SemanticMonitorDashboard();

module.exports = {
  globalDashboard,
  SemanticMonitorDashboard
};