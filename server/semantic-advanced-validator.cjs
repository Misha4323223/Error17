
/**
 * Продвинутая система валидации для семантических модулей
 * Проверяет и предсказывает проблемы во всех 40+ компонентах
 */

const { createLogger } = require('./semantic-logger.cjs');
const logger = createLogger('SEMANTIC-ADVANCED-VALIDATOR');

class SemanticAdvancedValidator {
  constructor() {
    this.validationRules = new Map();
    this.validationHistory = [];
    this.patterns = new Map();
    this.stats = {
      totalValidations: 0,
      successfulValidations: 0,
      warningsGenerated: 0,
      errorsDetected: 0,
      predictionsAccurate: 0,
      totalPredictions: 0
    };

    this.initializeDefaultRules();
    logger.info('Система продвинутой валидации семантических модулей инициализирована');
  }

  /**
   * Инициализирует правила валидации по умолчанию
   */
  initializeDefaultRules() {
    // Правила для запросов
    this.addValidationRule('request_length', {
      check: (data) => data.userQuery && data.userQuery.length > 0 && data.userQuery.length < 10000,
      level: 'error',
      message: 'Запрос должен быть от 1 до 10000 символов'
    });

    this.addValidationRule('request_content', {
      check: (data) => data.userQuery && typeof data.userQuery === 'string',
      level: 'error',
      message: 'Запрос должен быть строкой'
    });

    // Правила для контекста
    this.addValidationRule('context_structure', {
      check: (data) => !data.context || typeof data.context === 'object',
      level: 'warning',
      message: 'Контекст должен быть объектом'
    });

    // Правила для семантического анализа
    this.addValidationRule('semantic_context', {
      check: (data, context) => {
        if (context.type === 'semantic_analysis' && context.hasRecentImages && 
            data.userQuery.toLowerCase().includes('анализ') && 
            data.userQuery.length < 20) {
          return false;
        }
        return true;
      },
      level: 'warning',
      message: 'Запрос на анализ изображения слишком короткий'
    });

    // Правила для производительности
    this.addValidationRule('performance_context', {
      check: (data) => {
        const memoryUsage = process.memoryUsage();
        return memoryUsage.heapUsed < 500 * 1024 * 1024; // 500MB
      },
      level: 'warning',
      message: 'Высокое использование памяти может влиять на производительность'
    });

    logger.info(`Инициализировано ${this.validationRules.size} правил валидации`);
  }

  /**
   * Добавляет новое правило валидации
   */
  addValidationRule(name, rule) {
    this.validationRules.set(name, {
      name,
      check: rule.check,
      level: rule.level || 'warning',
      message: rule.message || `Нарушение правила: ${name}`,
      category: rule.category || 'general',
      active: rule.active !== false
    });

    logger.debug(`Добавлено правило валидации: ${name}`);
  }

  /**
   * Выполняет валидацию в контексте
   */
  validateInContext(data, context = {}) {
    this.stats.totalValidations++;
    const startTime = Date.now();

    const result = {
      valid: true,
      warnings: [],
      errors: [],
      info: [],
      context: context,
      timestamp: startTime,
      validationId: `val_${startTime}_${Math.random().toString(36).substr(2, 9)}`
    };

    logger.debug(`Начинаем валидацию ${result.validationId} с контекстом:`, context);

    let rulesChecked = 0;
    let rulesPassed = 0;

    // Проверяем все активные правила
    for (const [ruleName, rule] of this.validationRules.entries()) {
      if (!rule.active) continue;

      rulesChecked++;

      try {
        const ruleResult = rule.check(data, context);

        if (ruleResult === true) {
          rulesPassed++;
        } else {
          const violation = {
            rule: ruleName,
            level: rule.level,
            message: rule.message,
            category: rule.category,
            timestamp: Date.now()
          };

          if (rule.level === 'error') {
            result.errors.push(violation);
            result.valid = false;
            this.stats.errorsDetected++;
          } else if (rule.level === 'warning') {
            result.warnings.push(violation);
            this.stats.warningsGenerated++;
          } else {
            result.info.push(violation);
          }

          logger.debug(`Нарушение правила ${ruleName}: ${rule.message}`);
        }

      } catch (error) {
        logger.error(`Ошибка проверки правила ${ruleName}:`, error);
        result.warnings.push({
          rule: ruleName,
          level: 'warning',
          message: `Ошибка проверки правила: ${error.message}`,
          category: 'validation_error',
          timestamp: Date.now()
        });
      }
    }

    // Финализируем результат
    const duration = Date.now() - startTime;
    result.duration = duration;
    result.rulesChecked = rulesChecked;
    result.rulesPassed = rulesPassed;
    result.success = result.valid && result.warnings.length === 0;

    if (result.success) {
      this.stats.successfulValidations++;
    }

    // Сохраняем в историю
    this.validationHistory.push({
      id: result.validationId,
      timestamp: startTime,
      duration: duration,
      valid: result.valid,
      warningsCount: result.warnings.length,
      errorsCount: result.errors.length,
      context: context
    });

    // Ограничиваем историю
    if (this.validationHistory.length > 1000) {
      this.validationHistory = this.validationHistory.slice(-500);
    }

    logger.info(`Валидация ${result.validationId} завершена за ${duration}мс: ${result.success ? 'УСПЕХ' : 'ПРОБЛЕМЫ'} (${rulesPassed}/${rulesChecked} правил)`);

    return result;
  }

  /**
   * Предиктивная валидация - предсказывает потенциальные проблемы
   */
  predictiveValidate(data, operationType = 'unknown') {
    this.stats.totalPredictions++;
    const startTime = Date.now();

    const prediction = {
      operationType,
      predictions: [],
      recommendations: [],
      riskLevel: 'low',
      confidence: 0,
      timestamp: startTime,
      predictionId: `pred_${startTime}_${Math.random().toString(36).substr(2, 9)}`
    };

    logger.debug(`Начинаем предиктивную валидацию для операции: ${operationType}`);

    try {
      // Анализ исторических паттернов
      const historicalPatterns = this.analyzeHistoricalPatterns(data, operationType);
      
      // Предсказания на основе размера запроса
      if (data.userQuery) {
        if (data.userQuery.length > 5000) {
          prediction.predictions.push({
            type: 'performance',
            message: 'Длинный запрос может вызвать задержки обработки',
            probability: 0.7,
            impact: 'medium'
          });
          prediction.riskLevel = 'medium';
        }

        if (data.userQuery.length < 5) {
          prediction.predictions.push({
            type: 'quality',
            message: 'Короткий запрос может привести к неточному анализу',
            probability: 0.8,
            impact: 'low'
          });
        }
      }

      // Предсказания на основе системных ресурсов
      const memoryUsage = process.memoryUsage();
      if (memoryUsage.heapUsed > 400 * 1024 * 1024) { // 400MB
        prediction.predictions.push({
          type: 'resource',
          message: 'Высокое использование памяти может привести к ошибкам',
          probability: 0.6,
          impact: 'high'
        });
        prediction.riskLevel = 'high';
      }

      // Предсказания на основе типа операции
      if (operationType === 'semantic_analysis') {
        if (data.userQuery && data.userQuery.toLowerCase().includes('анализ') && 
            (!data.context || !data.context.hasRecentImages)) {
          prediction.predictions.push({
            type: 'context',
            message: 'Запрос на анализ без контекста изображений может быть неэффективным',
            probability: 0.9,
            impact: 'medium'
          });
        }
      }

      // Предсказания на основе времени
      const hour = new Date().getHours();
      if (hour >= 2 && hour <= 6) {
        prediction.predictions.push({
          type: 'system',
          message: 'Ночное время может влиять на производительность внешних сервисов',
          probability: 0.4,
          impact: 'low'
        });
      }

      // Генерируем рекомендации
      prediction.recommendations = this.generatePredictiveRecommendations(prediction.predictions);

      // Вычисляем общий уровень риска и уверенность
      prediction.confidence = this.calculatePredictionConfidence(prediction.predictions);
      prediction.riskLevel = this.calculateOverallRisk(prediction.predictions);

      const duration = Date.now() - startTime;
      prediction.duration = duration;

      logger.info(`Предиктивная валидация завершена за ${duration}мс: ${prediction.predictions.length} предсказаний, риск: ${prediction.riskLevel}`);

      return prediction;

    } catch (error) {
      logger.error('Ошибка предиктивной валидации:', error);
      return {
        ...prediction,
        error: error.message,
        predictions: [{
          type: 'error',
          message: 'Ошибка системы предсказаний',
          probability: 1.0,
          impact: 'low'
        }]
      };
    }
  }

  /**
   * Анализирует исторические паттерны
   */
  analyzeHistoricalPatterns(data, operationType) {
    const relevantHistory = this.validationHistory
      .filter(h => h.context && h.context.type === operationType)
      .slice(-100); // Последние 100 записей

    if (relevantHistory.length === 0) {
      return { hasPatterns: false };
    }

    const avgDuration = relevantHistory.reduce((sum, h) => sum + h.duration, 0) / relevantHistory.length;
    const errorRate = relevantHistory.filter(h => h.errorsCount > 0).length / relevantHistory.length;
    const warningRate = relevantHistory.filter(h => h.warningsCount > 0).length / relevantHistory.length;

    return {
      hasPatterns: true,
      avgDuration,
      errorRate,
      warningRate,
      sampleSize: relevantHistory.length
    };
  }

  /**
   * Генерирует рекомендации на основе предсказаний
   */
  generatePredictiveRecommendations(predictions) {
    const recommendations = [];

    const performanceIssues = predictions.filter(p => p.type === 'performance');
    if (performanceIssues.length > 0) {
      recommendations.push({
        category: 'performance',
        action: 'Рассмотрите оптимизацию запроса или использование кэширования',
        priority: 'medium'
      });
    }

    const resourceIssues = predictions.filter(p => p.type === 'resource');
    if (resourceIssues.length > 0) {
      recommendations.push({
        category: 'resources',
        action: 'Освободите память или отложите выполнение ресурсоемких операций',
        priority: 'high'
      });
    }

    const contextIssues = predictions.filter(p => p.type === 'context');
    if (contextIssues.length > 0) {
      recommendations.push({
        category: 'context',
        action: 'Проверьте наличие необходимого контекста для операции',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Вычисляет уверенность в предсказаниях
   */
  calculatePredictionConfidence(predictions) {
    if (predictions.length === 0) return 0;

    const avgProbability = predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length;
    const highConfidencePredictions = predictions.filter(p => p.probability > 0.7).length;
    const confidenceBonus = (highConfidencePredictions / predictions.length) * 0.2;

    return Math.min(1, avgProbability + confidenceBonus);
  }

  /**
   * Вычисляет общий уровень риска
   */
  calculateOverallRisk(predictions) {
    if (predictions.length === 0) return 'low';

    const highImpactCount = predictions.filter(p => p.impact === 'high').length;
    const mediumImpactCount = predictions.filter(p => p.impact === 'medium').length;

    if (highImpactCount > 0) return 'high';
    if (mediumImpactCount > 1) return 'medium';
    return 'low';
  }

  /**
   * Получает статистику валидации
   */
  getValidationStats() {
    const successRate = this.stats.totalValidations > 0 
      ? this.stats.successfulValidations / this.stats.totalValidations 
      : 0;

    const predictionAccuracy = this.stats.totalPredictions > 0
      ? this.stats.predictionsAccurate / this.stats.totalPredictions
      : 0;

    return {
      ...this.stats,
      successRate: parseFloat((successRate * 100).toFixed(2)),
      predictionAccuracy: parseFloat((predictionAccuracy * 100).toFixed(2)),
      activeRules: Array.from(this.validationRules.values()).filter(r => r.active).length,
      totalRules: this.validationRules.size,
      historySize: this.validationHistory.length
    };
  }

  /**
   * Проверяет здоровье системы валидации
   */
  checkHealth() {
    const stats = this.getValidationStats();
    const issues = [];

    if (stats.successRate < 80) {
      issues.push(`Низкая успешность валидации: ${stats.successRate}%`);
    }

    if (stats.activeRules === 0) {
      issues.push('Нет активных правил валидации');
    }

    if (stats.predictionAccuracy < 60 && stats.totalPredictions > 10) {
      issues.push(`Низкая точность предсказаний: ${stats.predictionAccuracy}%`);
    }

    return {
      healthy: issues.length === 0,
      issues,
      stats
    };
  }

  /**
   * Деактивирует правило валидации
   */
  deactivateRule(ruleName) {
    const rule = this.validationRules.get(ruleName);
    if (rule) {
      rule.active = false;
      logger.info(`Правило валидации ${ruleName} деактивировано`);
      return true;
    }
    return false;
  }

  /**
   * Активирует правило валидации
   */
  activateRule(ruleName) {
    const rule = this.validationRules.get(ruleName);
    if (rule) {
      rule.active = true;
      logger.info(`Правило валидации ${ruleName} активировано`);
      return true;
    }
    return false;
  }

  /**
   * Очищает историю валидации
   */
  clearHistory() {
    const oldSize = this.validationHistory.length;
    this.validationHistory = [];
    logger.info(`Очищена история валидации (${oldSize} записей)`);
  }
}

// Создаем глобальный экземпляр
const globalAdvancedValidator = new SemanticAdvancedValidator();

module.exports = {
  globalAdvancedValidator,
  SemanticAdvancedValidator
};
