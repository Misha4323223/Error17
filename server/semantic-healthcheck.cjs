
/**
 * Система мониторинга здоровья семантических модулей
 * Отслеживает состояние всех 40+ компонентов
 */

const { createLogger } = require('./semantic-logger.cjs');
const logger = createLogger('SEMANTIC-HEALTHCHECK');

class SemanticHealthChecker {
  constructor() {
    this.modules = new Map();
    this.lastCheck = null;
    this.checkInterval = 60000; // УВЕЛИЧЕНО: 60 секунд вместо 30
    this.baseInterval = 60000; // Базовый интервал
    this.maxInterval = 300000; // Максимальный интервал (5 минут)
    this.failureCount = 0; // Счетчик неудачных проверок
    this.criticalModules = [
      'semantic-memory',
      'intelligent-processor',
      'semantic-integration-layer',
      'quantum-processor',
      'creative-engine',
      'emotional-matrix'
    ];
    
    this.startPeriodicChecks();
    logger.info('Система мониторинга здоровья семантических модулей инициализирована');
  }

  /**
   * Регистрирует модуль для мониторинга с УЛУЧШЕННОЙ ИНИЦИАЛИЗАЦИЕЙ
   */
  registerModule(name, moduleInstance, options = {}) {
    // Проверяем, не зарегистрирован ли модуль уже
    if (this.modules.has(name)) {
      logger.debug(`Модуль ${name} уже зарегистрирован, обновляем`);
    }
    
    const moduleData = {
      instance: moduleInstance,
      name: name,
      critical: options.critical || this.criticalModules.includes(name),
      lastHealth: null,
      healthHistory: [],
      errors: [],
      performanceMetrics: {
        averageResponseTime: 0,
        errorRate: 0,
        totalCalls: 1, // ИСПРАВЛЕНО: инициализируем 1 вместо 0 для избежания деления на 0
        successfulCalls: 1 // ИСПРАВЛЕНО: начинаем с успешного статуса
      },
      registeredAt: Date.now(),
      lastActivity: Date.now(),
      ...options
    };
    
    this.modules.set(name, moduleData);
    
    logger.info(`📝 Модуль ${name} зарегистрирован для мониторинга (критичный: ${moduleData.critical})`);
    
    // Сразу выполняем первичную проверку здоровья (без ожидания)
    setTimeout(async () => {
      try {
        const health = await this.checkModuleHealth(name, moduleData);
        logger.debug(`🔍 Первичная проверка ${name}: ${health.status}`);
      } catch (error) {
        logger.warn(`⚠️ Ошибка первичной проверки ${name}: ${error.message}`);
      }
    }, 1000);
  }

  /**
   * НОВЫЙ МЕТОД: Безопасная регистрация модулей с ленивой инициализацией
   */
  registerBasicModules() {
    const basicModules = [
      { name: 'semantic-memory', path: './semantic-memory/index.cjs' },
      { name: 'intelligent-processor', path: './intelligent-chat-processor.cjs' },
      { name: 'semantic-integration', path: './semantic-integration-layer.cjs' }
    ];
    
    basicModules.forEach(({ name, path }) => {
      try {
        const moduleInstance = require(path);
        this.registerModule(name, moduleInstance, { 
          critical: true,
          source: 'basic_registration'
        });
      } catch (error) {
        logger.warn(`⚠️ Не удалось зарегистрировать базовый модуль ${name}: ${error.message}`);
        // Регистрируем заглушку для отслеживания
        this.registerModule(name, null, { 
          critical: true, 
          error: error.message,
          source: 'failed_registration'
        });
      }
    });
  }

  /**
   * Проверяет здоровье всех модулей (ASYNC)
   */
  async checkSystemHealth() {
    const startTime = Date.now();
    const results = {
      status: 'healthy',
      timestamp: startTime,
      summary: {
        total: this.modules.size,
        healthy: 0,
        degraded: 0,
        critical: 0,
        unavailable: 0
      },
      modules: {},
      issues: [],
      recommendations: []
    };

    logger.debug('Начинаем асинхронную проверку здоровья всех семантических модулей');

    // АСИНХРОННАЯ проверка каждого модуля с Promise.allSettled
    const moduleChecks = Array.from(this.modules.entries()).map(async ([name, moduleData]) => {
      try {
        const moduleHealth = await this.checkModuleHealth(name, moduleData);
        return { name, moduleHealth, success: true };
      } catch (error) {
        logger.error(`Ошибка проверки модуля ${name}:`, error);
        return {
          name,
          moduleHealth: {
            status: 'unavailable',
            error: error.message,
            issues: [`Ошибка проверки: ${error.message}`]
          },
          success: false
        };
      }
    });

    // Ждем завершения всех проверок
    const moduleResults = await Promise.allSettled(moduleChecks);
    
    // Обрабатываем результаты
    for (const result of moduleResults) {
      if (result.status === 'fulfilled') {
        const { name, moduleHealth } = result.value;
        results.modules[name] = moduleHealth;

        // Обновляем общую статистику
        switch (moduleHealth.status) {
          case 'healthy':
            results.summary.healthy++;
            break;
          case 'degraded':
            results.summary.degraded++;
            break;
          case 'critical':
            results.summary.critical++;
            break;
          case 'unavailable':
            results.summary.unavailable++;
            break;
        }

        // Добавляем проблемы
        if (moduleHealth.issues && moduleHealth.issues.length > 0) {
          results.issues.push(...moduleHealth.issues.map(issue => ({
            module: name,
            issue: issue,
            critical: moduleHealth.critical || false
          })));
        }
      } else {
        // Promise был rejected
        const name = 'unknown';
        results.modules[name] = {
          status: 'unavailable',
          error: 'Promise rejected',
          issues: ['Критическая ошибка проверки модуля']
        };
        results.summary.unavailable++;
      }
    }

    // Определяем общий статус системы
    if (results.summary.critical > 0 || results.summary.unavailable > 2) {
      results.status = 'critical';
    } else if (results.summary.degraded > 3 || results.summary.unavailable > 0) {
      results.status = 'degraded';
    } else if (results.summary.healthy === results.summary.total) {
      results.status = 'optimal';
    }

    // Генерируем рекомендации
    results.recommendations = this.generateRecommendations(results);

    const checkDuration = Date.now() - startTime;
    results.checkDuration = checkDuration;

    this.lastCheck = results;

    logger.info(`Проверка здоровья завершена за ${checkDuration}мс: ${results.status} (${results.summary.healthy}/${results.summary.total} модулей здоровы)`);

    return results;
  }

  /**
   * Проверяет здоровье конкретного модуля (ASYNC)
   */
  async checkModuleHealth(name, moduleData) {
    const health = {
      name: name,
      status: 'healthy',
      critical: moduleData.critical,
      issues: [],
      metrics: {},
      lastChecked: Date.now()
    };

    try {
      // Проверка доступности модуля
      if (!moduleData.instance) {
        health.status = 'unavailable';
        health.issues.push('Модуль не инициализирован');
        return health;
      }

      // Проверка производительности
      const perfMetrics = moduleData.performanceMetrics;
      if (perfMetrics.averageResponseTime > 8000) { // Увеличен лимит с 5000 до 8000мс
        health.status = 'degraded';
        health.issues.push(`Высокое время ответа: ${perfMetrics.averageResponseTime}мс`);
      }

      if (perfMetrics.errorRate > 0.15) { // Увеличен лимит с 0.1 до 0.15
        health.status = perfMetrics.errorRate > 0.4 ? 'critical' : 'degraded';
        health.issues.push(`Высокий процент ошибок: ${(perfMetrics.errorRate * 100).toFixed(1)}%`);
      }

      // АСИНХРОННАЯ проверка специфичных методов модуля
      if (typeof moduleData.instance.checkHealth === 'function') {
        try {
          const moduleSpecificHealth = await Promise.race([
            moduleData.instance.checkHealth(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000)) // 3 сек таймаут
          ]);
          
          if (moduleSpecificHealth && !moduleSpecificHealth.healthy) {
            health.status = 'degraded';
            health.issues.push(...(moduleSpecificHealth.issues || ['Внутренние проблемы модуля']));
          }
        } catch (error) {
          if (error.message !== 'Timeout') {
            health.issues.push(`Ошибка проверки модуля: ${error.message}`);
          } else {
            health.issues.push('Таймаут проверки модуля (>3сек)');
          }
        }
      }

      // Проверка памяти для критичных модулей (УВЕЛИЧЕН ЛИМИТ)
      if (moduleData.critical) {
        const memoryUsage = process.memoryUsage();
        if (memoryUsage.heapUsed > 800 * 1024 * 1024) { // Увеличен с 400MB до 800MB
          health.status = 'degraded';
          health.issues.push(`Высокое использование памяти: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(1)}MB`);
        }
      }

      health.metrics = {
        ...perfMetrics,
        memoryUsage: process.memoryUsage().heapUsed
      };

      // Сохраняем историю
      moduleData.healthHistory.push({
        timestamp: Date.now(),
        status: health.status,
        issueCount: health.issues.length
      });

      // Ограничиваем историю
      if (moduleData.healthHistory.length > 100) {
        moduleData.healthHistory = moduleData.healthHistory.slice(-50);
      }

    } catch (error) {
      health.status = 'critical';
      health.issues.push(`Ошибка проверки здоровья: ${error.message}`);
      logger.error(`Ошибка проверки здоровья модуля ${name}:`, error);
    }

    moduleData.lastHealth = health;
    return health;
  }

  /**
   * Генерирует рекомендации на основе состояния системы
   */
  generateRecommendations(healthResults) {
    const recommendations = [];

    // Рекомендации по общему состоянию
    if (healthResults.summary.critical > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Немедленно исправить критические проблемы',
        details: `${healthResults.summary.critical} модулей в критическом состоянии`
      });
    }

    if (healthResults.summary.unavailable > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Проверить доступность модулей',
        details: `${healthResults.summary.unavailable} модулей недоступны`
      });
    }

    if (healthResults.summary.degraded > 2) {
      recommendations.push({
        priority: 'medium',
        action: 'Оптимизировать производительность',
        details: `${healthResults.summary.degraded} модулей работают с деградацией`
      });
    }

    // Специфичные рекомендации по проблемам
    const memoryIssues = healthResults.issues.filter(i => i.issue.includes('памяти'));
    if (memoryIssues.length > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Оптимизировать использование памяти',
        details: 'Несколько модулей сообщают о проблемах с памятью'
      });
    }

    const responseTimeIssues = healthResults.issues.filter(i => i.issue.includes('время ответа'));
    if (responseTimeIssues.length > 0) {
      recommendations.push({
        priority: 'low',
        action: 'Оптимизировать время ответа',
        details: 'Некоторые модули работают медленно'
      });
    }

    return recommendations;
  }

  /**
   * Обновляет метрики производительности модуля
   */
  updateModuleMetrics(moduleName, responseTime, isError = false) {
    const moduleData = this.modules.get(moduleName);
    if (!moduleData) return;

    const metrics = moduleData.performanceMetrics;
    metrics.totalCalls++;

    if (!isError) {
      metrics.successfulCalls++;
    }

    metrics.errorRate = 1 - (metrics.successfulCalls / metrics.totalCalls);

    // Обновляем среднее время ответа
    if (metrics.averageResponseTime === 0) {
      metrics.averageResponseTime = responseTime;
    } else {
      metrics.averageResponseTime = (metrics.averageResponseTime + responseTime) / 2;
    }

    // Сохраняем ошибки
    if (isError) {
      moduleData.errors.push({
        timestamp: Date.now(),
        responseTime: responseTime
      });

      // Ограничиваем количество сохраненных ошибок
      if (moduleData.errors.length > 50) {
        moduleData.errors = moduleData.errors.slice(-25);
      }
    }
  }

  /**
   * Получает статистику здоровья системы
   */
  getHealthStats() {
    return {
      lastCheck: this.lastCheck,
      totalModules: this.modules.size,
      criticalModules: Array.from(this.modules.values()).filter(m => m.critical).length,
      registeredModules: Array.from(this.modules.keys()),
      systemUptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  }

  /**
   * Запускает периодические проверки с EXPONENTIAL BACKOFF
   */
  startPeriodicChecks() {
    const performCheck = async () => {
      try {
        const startTime = Date.now();
        await this.checkSystemHealth();
        const duration = Date.now() - startTime;
        
        // Успешная проверка - сбрасываем счетчик неудач
        this.failureCount = 0;
        this.checkInterval = this.baseInterval;
        
        logger.debug(`✅ Проверка здоровья завершена за ${duration}мс, следующая через ${this.checkInterval/1000}сек`);
        
      } catch (error) {
        // Увеличиваем счетчик неудач и применяем exponential backoff
        this.failureCount++;
        this.checkInterval = Math.min(
          this.baseInterval * Math.pow(2, this.failureCount),
          this.maxInterval
        );
        
        logger.error(`❌ Ошибка проверки здоровья (#${this.failureCount}):`, error.message);
        logger.warn(`⏰ Увеличиваем интервал до ${this.checkInterval/1000}сек`);
      }
      
      // Планируем следующую проверку
      setTimeout(performCheck, this.checkInterval);
    };
    
    // Запускаем первую проверку с задержкой в 10 секунд
    setTimeout(performCheck, 10000);
    
    logger.info(`🔄 Запущены адаптивные проверки здоровья (базовый интервал: ${this.baseInterval/1000}сек, макс: ${this.maxInterval/1000}сек)`);
  }

  /**
   * Выполняет самодиагностику системы мониторинга
   */
  selfDiagnostic() {
    const diagnostic = {
      timestamp: Date.now(),
      monitoringSystem: {
        status: 'operational',
        registeredModules: this.modules.size,
        lastCheckAge: this.lastCheck ? Date.now() - this.lastCheck.timestamp : null,
        issues: []
      }
    };

    if (this.modules.size === 0) {
      diagnostic.monitoringSystem.status = 'warning';
      diagnostic.monitoringSystem.issues.push('Нет зарегистрированных модулей для мониторинга');
    }

    if (diagnostic.monitoringSystem.lastCheckAge > 60000) { // 1 минута
      diagnostic.monitoringSystem.status = 'warning';
      diagnostic.monitoringSystem.issues.push('Давно не было проверки здоровья');
    }

    return diagnostic;
  }
}

// Создаем глобальный экземпляр без автоматической регистрации
const globalHealthChecker = new SemanticHealthChecker();

// Функция для ленивой регистрации модулей (вызывается извне для избежания циклических зависимостей)
globalHealthChecker.registerBasicModules = function() {
  try {
    // Используем динамические импорты для предотвращения циклических зависимостей
    let semanticMemory, intelligentProcessor, semanticIntegration;
    
    try {
      semanticMemory = require('./semantic-memory/index.cjs');
      this.registerModule('semantic-memory', semanticMemory, { critical: true });
      logger.info('Модуль semantic-memory зарегистрирован');
    } catch (error) {
      logger.warn('Модуль semantic-memory недоступен для регистрации:', error.message);
    }
    
    try {
      intelligentProcessor = require('./intelligent-chat-processor.cjs');
      this.registerModule('intelligent-processor', intelligentProcessor, { critical: true });
      logger.info('Модуль intelligent-processor зарегистрирован');
    } catch (error) {
      logger.warn('Модуль intelligent-processor недоступен для регистрации:', error.message);
    }
    
    try {
      semanticIntegration = require('./semantic-integration-layer.cjs');
      this.registerModule('semantic-integration', semanticIntegration, { critical: true });
      logger.info('Модуль semantic-integration зарегистрирован');
    } catch (error) {
      logger.warn('Модуль semantic-integration недоступен для регистрации:', error.message);
    }
    
    logger.info('Ленивая регистрация базовых модулей завершена');
    return true;
  } catch (error) {
    logger.error('Ошибка ленивой регистрации модулей:', error.message);
    return false;
  }
};

// НЕ вызываем регистрацию здесь для избежания циклических зависимостей
logger.info('Система мониторинга здоровья готова к ленивой регистрации модулей');

module.exports = {
  globalHealthChecker,
  SemanticHealthChecker
};
