
/**
 * ЭТАП 7: Модуль параллельной обработки семантических модулей
 * Оптимизирует производительность через параллельное выполнение
 */

const { createLogger } = require('./semantic-logger.cjs');
const logger = createLogger('SEMANTIC-PARALLEL-PROCESSOR');

class SemanticParallelProcessor {
  constructor() {
    this.criticalModules = [
      'semantic-analyzer',
      'natural-language-generator',
      'emotional-semantic-matrix'
    ];
    
    this.importantModules = [
      'meta-semantic-engine',
      'project-manager',
      'user-profiler'
    ];
    
    this.optionalModules = [
      'biomimetic-semantics',
      'divine-semantics',
      'cognitive-dna-profiler',
      'business-context-analyzer',
      'collective-semantic-wisdom',
      'creative-semantic-engine',
      'cross-contextual-semantics',
      'autonomous-learning-engine'
    ];
    
    this.processingStats = {
      totalRequests: 0,
      parallelSuccesses: 0,
      parallelFailures: 0,
      averageProcessingTime: 0,
      modulePerformance: {}
    };
    
    logger.info('Модуль параллельной обработки инициализирован');
  }

  /**
   * Параллельная обработка запроса через все модули
   */
  async processRequestParallel(userMessage, context = {}, moduleChecker) {
    const startTime = Date.now();
    logger.info(`🚀 Начинаем параллельную обработку: "${userMessage.substring(0, 50)}..."`);
    
    try {
      // 1. КРИТИЧНЫЕ МОДУЛИ (синхронно, обязательно)
      const criticalResults = await this.processCriticalModules(userMessage, context, moduleChecker);
      
      // 2. ВАЖНЫЕ МОДУЛИ (параллельно, желательно)
      const importantPromises = this.processImportantModules(userMessage, context, moduleChecker, criticalResults);
      
      // 3. ОПЦИОНАЛЬНЫЕ МОДУЛИ (параллельно, дополнительно)
      const optionalPromises = this.processOptionalModules(userMessage, context, moduleChecker, criticalResults);
      
      // Ожидаем завершения всех важных и опциональных модулей
      const [importantResults, optionalResults] = await Promise.allSettled([
        Promise.allSettled(importantPromises),
        Promise.allSettled(optionalPromises)
      ]);
      
      // Собираем результаты
      const finalResults = this.combineResults(criticalResults, importantResults, optionalResults);
      
      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime, true);
      
      logger.info(`✅ Параллельная обработка завершена за ${processingTime}мс`);
      
      return {
        success: true,
        results: finalResults,
        processingTime,
        parallelProcessing: true,
        moduleStats: this.getModuleStats(finalResults)
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime, false);
      
      logger.error(`❌ Ошибка параллельной обработки: ${error.message}`);
      throw error;
    }
  }

  /**
   * Обработка критичных модулей (синхронно)
   */
  async processCriticalModules(userMessage, context, moduleChecker) {
    logger.info('🔥 Обрабатываем критичные модули синхронно...');
    
    const results = {
      semanticAnalysis: null,
      emotionalAnalysis: null,
      nlgResult: null
    };
    
    // Семантический анализ
    const semanticModule = moduleChecker.getModule('semantic-analyzer');
    if (semanticModule) {
      const startTime = Date.now();
      try {
        results.semanticAnalysis = await semanticModule.analyzeSemantics(userMessage, context);
        this.recordModulePerformance('semantic-analyzer', Date.now() - startTime, true);
        logger.info('✅ Семантический анализ завершен');
      } catch (error) {
        this.recordModulePerformance('semantic-analyzer', Date.now() - startTime, false);
        logger.error(`❌ Ошибка семантического анализа: ${error.message}`);
      }
    }
    
    // Эмоциональный анализ
    const emotionalModule = moduleChecker.getModule('emotional-semantic-matrix');
    if (emotionalModule) {
      const startTime = Date.now();
      try {
        results.emotionalAnalysis = await emotionalModule.analyzeEmotionalContext(userMessage, context);
        this.recordModulePerformance('emotional-semantic-matrix', Date.now() - startTime, true);
        logger.info('✅ Эмоциональный анализ завершен');
      } catch (error) {
        this.recordModulePerformance('emotional-semantic-matrix', Date.now() - startTime, false);
        logger.error(`❌ Ошибка эмоционального анализа: ${error.message}`);
      }
    }
    
    return results;
  }

  /**
   * Обработка важных модулей (параллельно)
   */
  processImportantModules(userMessage, context, moduleChecker, criticalResults) {
    logger.info('⚡ Запускаем важные модули параллельно...');
    
    const promises = [];
    
    // Мета-семантический анализ
    const metaModule = moduleChecker.getModule('meta-semantic-engine');
    if (metaModule) {
      promises.push(
        this.executeModuleWithTracking('meta-semantic-engine', async () => {
          return await metaModule.analyze({
            userMessage,
            context,
            semanticAnalysis: criticalResults.semanticAnalysis,
            emotionalAnalysis: criticalResults.emotionalAnalysis
          });
        })
      );
    }
    
    // Проектный менеджер
    const projectModule = moduleChecker.getModule('project-manager');
    if (projectModule) {
      promises.push(
        this.executeModuleWithTracking('project-manager', async () => {
          return await projectModule.analyzeProject?.({
            userMessage,
            context,
            semantics: criticalResults.semanticAnalysis,
            emotions: criticalResults.emotionalAnalysis
          });
        })
      );
    }
    
    // Профилировщик пользователя
    const userProfilerModule = moduleChecker.getModule('user-profiler');
    if (userProfilerModule) {
      promises.push(
        this.executeModuleWithTracking('user-profiler', async () => {
          return await userProfilerModule.analyzeUser?.({
            userMessage,
            context,
            semantics: criticalResults.semanticAnalysis,
            emotions: criticalResults.emotionalAnalysis
          });
        })
      );
    }
    
    return promises;
  }

  /**
   * Обработка опциональных модулей (параллельно)
   */
  processOptionalModules(userMessage, context, moduleChecker, criticalResults) {
    logger.info('🌟 Запускаем опциональные модули параллельно...');
    
    const promises = [];
    
    this.optionalModules.forEach(moduleName => {
      const module = moduleChecker.getModule(moduleName);
      if (module) {
        promises.push(
          this.executeModuleWithTracking(moduleName, async () => {
            // Универсальный метод для всех опциональных модулей
            if (typeof module.analyze === 'function') {
              return await module.analyze({
                userMessage,
                context,
                semanticAnalysis: criticalResults.semanticAnalysis,
                emotionalAnalysis: criticalResults.emotionalAnalysis
              });
            } else if (typeof module.process === 'function') {
              return await module.process(userMessage, context);
            } else {
              return { status: 'no_compatible_method', moduleName };
            }
          })
        );
      }
    });
    
    return promises;
  }

  /**
   * Выполнение модуля с отслеживанием производительности
   */
  async executeModuleWithTracking(moduleName, moduleFunction) {
    const startTime = Date.now();
    
    try {
      const result = await moduleFunction();
      const processingTime = Date.now() - startTime;
      
      this.recordModulePerformance(moduleName, processingTime, true);
      
      return {
        moduleName,
        result,
        success: true,
        processingTime
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.recordModulePerformance(moduleName, processingTime, false);
      
      logger.error(`❌ Ошибка в модуле ${moduleName}: ${error.message}`);
      
      return {
        moduleName,
        error: error.message,
        success: false,
        processingTime
      };
    }
  }

  /**
   * Объединение результатов всех модулей
   */
  combineResults(criticalResults, importantResults, optionalResults) {
    const combined = {
      critical: criticalResults,
      important: {},
      optional: {},
      summary: {
        criticalModulesCount: Object.keys(criticalResults).filter(key => criticalResults[key] !== null).length,
        importantModulesCount: 0,
        optionalModulesCount: 0,
        totalSuccessfulModules: 0
      }
    };
    
    // Обрабатываем важные модули
    if (importantResults.status === 'fulfilled' && importantResults.value) {
      importantResults.value.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          combined.important[result.value.moduleName] = result.value;
          if (result.value.success) {
            combined.summary.importantModulesCount++;
          }
        }
      });
    }
    
    // Обрабатываем опциональные модули
    if (optionalResults.status === 'fulfilled' && optionalResults.value) {
      optionalResults.value.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          combined.optional[result.value.moduleName] = result.value;
          if (result.value.success) {
            combined.summary.optionalModulesCount++;
          }
        }
      });
    }
    
    combined.summary.totalSuccessfulModules = 
      combined.summary.criticalModulesCount + 
      combined.summary.importantModulesCount + 
      combined.summary.optionalModulesCount;
    
    return combined;
  }

  /**
   * Записывает производительность модуля
   */
  recordModulePerformance(moduleName, processingTime, success) {
    if (!this.processingStats.modulePerformance[moduleName]) {
      this.processingStats.modulePerformance[moduleName] = {
        executions: 0,
        totalTime: 0,
        averageTime: 0,
        successCount: 0,
        errorCount: 0,
        successRate: 0
      };
    }
    
    const stats = this.processingStats.modulePerformance[moduleName];
    stats.executions++;
    stats.totalTime += processingTime;
    stats.averageTime = stats.totalTime / stats.executions;
    
    if (success) {
      stats.successCount++;
    } else {
      stats.errorCount++;
    }
    
    stats.successRate = (stats.successCount / stats.executions) * 100;
  }

  /**
   * Получает статистику модулей
   */
  getModuleStats(results) {
    const stats = {
      criticalModules: Object.keys(results.critical).length,
      importantModules: Object.keys(results.important).length,
      optionalModules: Object.keys(results.optional).length,
      totalModules: results.summary.totalSuccessfulModules,
      performance: this.processingStats.modulePerformance
    };
    
    return stats;
  }

  /**
   * Обновляет общую статистику
   */
  updateStats(processingTime, success) {
    this.processingStats.totalRequests++;
    
    if (success) {
      this.processingStats.parallelSuccesses++;
    } else {
      this.processingStats.parallelFailures++;
    }
    
    // Обновляем среднее время обработки
    const totalTime = this.processingStats.averageProcessingTime * (this.processingStats.totalRequests - 1) + processingTime;
    this.processingStats.averageProcessingTime = totalTime / this.processingStats.totalRequests;
  }

  /**
   * Получает статистику производительности
   */
  getPerformanceStats() {
    return {
      ...this.processingStats,
      successRate: this.processingStats.totalRequests > 0 
        ? (this.processingStats.parallelSuccesses / this.processingStats.totalRequests) * 100 
        : 0
    };
  }
}

module.exports = {
  SemanticParallelProcessor
};
