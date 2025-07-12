
/**
 * 🕰️🔗 ИНТЕГРАЦИЯ СЕМАНТИЧЕСКОЙ МАШИНЫ ВРЕМЕНИ
 * Подключение темпорального анализа к основной семантической системе
 */

const { SemanticTimeMachine } = require('./temporal-machine-engine.cjs');

const SmartLogger = {
  integration: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🕰️🔗 [${timestamp}] TEMPORAL-INTEGRATION: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * ТЕМПОРАЛЬНЫЙ СЕМАНТИЧЕСКИЙ ИНТЕГРАТОР
 * Интегрирует возможности Машины Времени в основную семантическую систему
 */
class TemporalSemanticIntegrator {
  constructor() {
    this.timeMachine = new SemanticTimeMachine();
    this.integrationLevel = 'full'; // basic, enhanced, full
    this.adaptiveMode = true; // Адаптивное использование темпорального анализа
    
    this.integrationMetrics = {
      totalIntegrations: 0,
      temporallyEnhancedResponses: 0,
      averageEnhancement: 0.0,
      userSatisfactionBoost: 0.0
    };
  }

  /**
   * Главный метод интеграции темпорального анализа
   */
  async integrateTemporalAnalysis(query, context, standardResult) {
    SmartLogger.integration(`🌀 Интеграция темпорального анализа для: "${query.substring(0, 40)}..."`);

    const startTime = Date.now();

    try {
      // Определяем необходимость темпорального анализа
      const needsTemporal = this.assessTemporalNeed(query, context, standardResult);
      
      if (!needsTemporal.required) {
        SmartLogger.integration(`⏩ Темпоральный анализ не требуется: ${needsTemporal.reason}`);
        return this.createSimpleEnhancement(standardResult, needsTemporal);
      }

      SmartLogger.integration(`✅ Темпоральный анализ необходим: ${needsTemporal.reason}`);

      // Выполняем темпоральный анализ
      const temporalResult = await this.timeMachine.performTemporalAnalysis(query, context);

      // Интегрируем результаты
      const integratedResult = await this.synthesizeResults(standardResult, temporalResult, context);

      // Оптимизируем презентацию
      const optimizedResult = await this.optimizePresentation(integratedResult, context);

      const processingTime = Date.now() - startTime;

      const finalResult = {
        ...optimizedResult,
        
        // Метаданные интеграции
        temporalIntegration: {
          enabled: true,
          level: this.integrationLevel,
          processingTime,
          enhancementScore: this.calculateEnhancementScore(standardResult, optimizedResult),
          temporalInsights: temporalResult.temporalInsights || [],
          recommendations: temporalResult.recommendations || []
        },

        // Данные Машины Времени (опционально)
        timeMachineData: this.shouldIncludeTimeMachineData(context) ? {
          archaeological: this.simplifyArchaeological(temporalResult.archaeological),
          futuristic: this.simplifyFuturistic(temporalResult.futuristic),
          restoredMeanings: temporalResult.restoredMeanings?.slice(0, 3) || [], // Топ-3
          temporalMetrics: temporalResult.temporalMetrics
        } : null
      };

      // Обновляем метрики
      this.updateIntegrationMetrics(finalResult);

      SmartLogger.integration(`🎯 Интеграция завершена за ${processingTime}мс, улучшение: ${finalResult.temporalIntegration.enhancementScore.toFixed(2)}`);

      return finalResult;

    } catch (error) {
      SmartLogger.integration(`💥 ОШИБКА интеграции: ${error.message}`);

      // Возвращаем стандартный результат с отметкой об ошибке
      return {
        ...standardResult,
        temporalIntegration: {
          enabled: false,
          error: error.message,
          fallback: true
        }
      };
    }
  }

  /**
   * Оценивает необходимость темпорального анализа
   */
  assessTemporalNeed(query, context, standardResult) {
    const assessment = {
      required: false,
      reason: '',
      confidence: 0.0,
      urgency: 'low'
    };

    // Критерий 1: Сложность запроса
    if (query.length > 50) {
      assessment.required = true;
      assessment.reason = 'complex_query';
      assessment.confidence += 0.3;
    }

    // Критерий 2: Наличие исторического контекста
    if (context.sessionId && context.previousInteractions > 2) {
      assessment.required = true;
      assessment.reason = 'historical_context_available';
      assessment.confidence += 0.4;
    }

    // Критерий 3: Творческие запросы (больше выигрывают от темпорального анализа)
    if (this.isCreativeQuery(query)) {
      assessment.required = true;
      assessment.reason = 'creative_query_enhancement';
      assessment.confidence += 0.3;
      assessment.urgency = 'medium';
    }

    // Критерий 4: Неопределенность в стандартном результате
    if (standardResult.confidence < 0.7) {
      assessment.required = true;
      assessment.reason = 'low_confidence_needs_enhancement';
      assessment.confidence += 0.5;
      assessment.urgency = 'high';
    }

    // Критерий 5: Эволюционирующие концепции
    if (this.containsEvolvingConcepts(query)) {
      assessment.required = true;
      assessment.reason = 'evolving_concepts_detected';
      assessment.confidence += 0.4;
    }

    // Критерий 6: Пользователь явно просит анализ или объяснение
    if (this.isAnalysisRequest(query)) {
      assessment.required = true;
      assessment.reason = 'explicit_analysis_request';
      assessment.confidence += 0.6;
      assessment.urgency = 'high';
    }

    // Адаптивный режим: иногда используем темпоральный анализ для обучения
    if (this.adaptiveMode && Math.random() > 0.7 && !assessment.required) {
      assessment.required = true;
      assessment.reason = 'adaptive_learning_sample';
      assessment.confidence = 0.2;
    }

    return assessment;
  }

  /**
   * Синтезирует стандартные и темпоральные результаты
   */
  async synthesizeResults(standardResult, temporalResult, context) {
    SmartLogger.integration('🧬 Синтез стандартных и темпоральных результатов');

    const synthesis = {
      // Основа - стандартный результат
      ...standardResult,

      // Обогащение от темпорального анализа
      enhanced_interpretation: this.enhanceInterpretation(
        standardResult.interpretation || standardResult.enhanced_prompt || '',
        temporalResult
      ),

      // Археологические инсайты
      archaeological_insights: this.extractArchaeologicalInsights(temporalResult.archaeological),

      // Футуристические предсказания
      future_predictions: this.extractFuturePredictions(temporalResult.futuristic),

      // Восстановленные смыслы
      restored_meanings: this.formatRestoredMeanings(temporalResult.restoredMeanings),

      // Темпоральные рекомендации
      temporal_recommendations: this.formatTemporalRecommendations(temporalResult.recommendations),

      // Улучшенные предсказания
      enhanced_predictions: this.enhancePredictions(
        standardResult.predictions || [],
        temporalResult.futuristic
      ),

      // Обогащенный контекст
      enriched_context: {
        ...standardResult.project_context || {},
        temporal_depth: temporalResult.temporalMetrics?.archaeologicalDepth || 0,
        future_horizon: temporalResult.temporalMetrics?.futuristicHorizon || 0,
        timeline_coherence: temporalResult.integration?.temporalAlignment || 0
      },

      // Улучшенная уверенность
      enhanced_confidence: this.calculateEnhancedConfidence(
        standardResult.confidence || 0.5,
        temporalResult.confidence || 0.5
      )
    };

    return synthesis;
  }

  /**
   * Оптимизирует презентацию результатов
   */
  async optimizePresentation(integratedResult, context) {
    SmartLogger.integration('🎨 Оптимизация презентации результатов');

    // Определяем стиль презентации на основе контекста пользователя
    const presentationStyle = this.determinePresentationStyle(context);

    const optimized = {
      ...integratedResult,

      // Основной ответ с темпоральным улучшением
      primary_response: this.optimizePrimaryResponse(integratedResult, presentationStyle),

      // Археологические находки (если есть ценные)
      archaeological_highlights: this.selectArchaeologicalHighlights(
        integratedResult.archaeological_insights
      ),

      // Футуристические инсайты (наиболее релевантные)
      future_insights: this.selectFutureInsights(
        integratedResult.future_predictions,
        presentationStyle
      ),

      // Практические рекомендации
      actionable_recommendations: this.filterActionableRecommendations(
        integratedResult.temporal_recommendations,
        presentationStyle
      ),

      // Дополнительные возможности (для продвинутых пользователей)
      advanced_options: presentationStyle.showAdvanced ? {
        detailed_archaeology: integratedResult.archaeological_insights,
        full_future_analysis: integratedResult.future_predictions,
        temporal_metrics: integratedResult.enriched_context
      } : null
    };

    return optimized;
  }

  /**
   * Создает простое улучшение без полного темпорального анализа
   */
  createSimpleEnhancement(standardResult, needsAssessment) {
    return {
      ...standardResult,
      temporalIntegration: {
        enabled: false,
        reason: needsAssessment.reason,
        simpleEnhancement: true,
        confidence: needsAssessment.confidence
      },
      // Добавляем минимальные темпоральные инсайты
      temporal_hint: this.generateSimpleTemporalHint(standardResult)
    };
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  isCreativeQuery(query) {
    const creativeWords = ['создай', 'генери', 'нарисуй', 'сделай', 'придумай', 'разработай'];
    return creativeWords.some(word => query.toLowerCase().includes(word));
  }

  containsEvolvingConcepts(query) {
    const evolvingConcepts = ['ии', 'ai', 'нейрон', 'алгоритм', 'технология', 'цифровой'];
    return evolvingConcepts.some(concept => query.toLowerCase().includes(concept));
  }

  isAnalysisRequest(query) {
    const analysisWords = ['анализ', 'объясни', 'расскажи', 'что это', 'как работает', 'почему'];
    return analysisWords.some(word => query.toLowerCase().includes(word));
  }

  enhanceInterpretation(original, temporalResult) {
    let enhanced = original;

    // Добавляем археологические инсайты
    if (temporalResult.restoredMeanings && temporalResult.restoredMeanings.length > 0) {
      const restoration = temporalResult.restoredMeanings[0];
      enhanced += `\n\nИсторический контекст: ${restoration.word} имел дополнительное значение "${restoration.originalMeaning}" в период ${restoration.period}.`;
    }

    // Добавляем футуристические инсайты
    if (temporalResult.futuristic && temporalResult.futuristic.futureIntentions) {
      const topIntention = temporalResult.futuristic.futureIntentions[0];
      if (topIntention && topIntention.probability > 0.7) {
        enhanced += `\n\nПредсказание: вероятно, через ${topIntention.timeframe} потребуется ${topIntention.description}.`;
      }
    }

    return enhanced;
  }

  extractArchaeologicalInsights(archaeological) {
    if (!archaeological || !archaeological.excavations) return [];

    const insights = [];

    for (const excavation of archaeological.excavations) {
      if (excavation.lostMeanings && excavation.lostMeanings.length > 0) {
        insights.push({
          word: excavation.word,
          insight: `Утрачено ${excavation.lostMeanings.length} исторических значений`,
          significance: 'medium',
          details: excavation.lostMeanings.slice(0, 2) // Топ-2
        });
      }

      if (excavation.evolutionPattern && excavation.evolutionPattern.overallDirection) {
        insights.push({
          word: excavation.word,
          insight: `Эволюционное направление: ${excavation.evolutionPattern.overallDirection}`,
          significance: 'low',
          pattern: excavation.evolutionPattern.overallDirection
        });
      }
    }

    return insights.slice(0, 3); // Максимум 3 инсайта
  }

  extractFuturePredictions(futuristic) {
    if (!futuristic) return [];

    const predictions = [];

    // Будущие намерения
    if (futuristic.futureIntentions) {
      for (const intention of futuristic.futureIntentions.slice(0, 2)) {
        predictions.push({
          type: 'intention',
          description: intention.description,
          probability: intention.probability,
          timeframe: intention.timeframe,
          actionable: true
        });
      }
    }

    // Скрытые потребности
    if (futuristic.hiddenNeeds) {
      for (const need of futuristic.hiddenNeeds.slice(0, 1)) {
        predictions.push({
          type: 'hidden_need',
          description: `Скрытая потребность: ${need.need}`,
          urgency: need.urgency,
          satisfaction_method: need.satisfaction_method,
          actionable: true
        });
      }
    }

    return predictions;
  }

  formatRestoredMeanings(restoredMeanings) {
    if (!restoredMeanings || restoredMeanings.length === 0) return [];

    return restoredMeanings.slice(0, 2).map(restoration => ({
      word: restoration.word,
      original_meaning: restoration.originalMeaning,
      period: restoration.period,
      relevance: restoration.contextualRelevance,
      application: restoration.modernApplication,
      confidence: restoration.restorationConfidence
    }));
  }

  formatTemporalRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) return [];

    return recommendations.slice(0, 3).map(rec => ({
      title: rec.title || rec.type,
      description: rec.description,
      priority: rec.priority,
      timeframe: rec.timeframe || rec.impact,
      actionable: true
    }));
  }

  enhancePredictions(standardPredictions, futuristic) {
    const enhanced = [...standardPredictions];

    // Добавляем футуристические предсказания
    if (futuristic && futuristic.anticipatedQueries) {
      for (const query of futuristic.anticipatedQueries.slice(0, 2)) {
        enhanced.push({
          type: 'anticipated_query',
          description: `Возможный следующий запрос: ${query.query}`,
          probability: query.probability,
          timing: query.timing,
          source: 'temporal_analysis'
        });
      }
    }

    return enhanced;
  }

  calculateEnhancedConfidence(standardConfidence, temporalConfidence) {
    // Взвешенное среднее с небольшим бонусом за интеграцию
    const weighted = (standardConfidence * 0.6) + (temporalConfidence * 0.4);
    const integrationBonus = 0.05; // 5% бонус за интеграцию
    
    return Math.min(1.0, weighted + integrationBonus);
  }

  determinePresentationStyle(context) {
    return {
      showAdvanced: context.userLevel === 'advanced' || context.showDetails === true,
      verbosity: context.verbosity || 'medium',
      focusArea: context.focusArea || 'practical',
      includeMetrics: context.includeMetrics || false
    };
  }

  optimizePrimaryResponse(result, style) {
    let response = result.enhanced_interpretation || result.interpretation || '';

    if (style.verbosity === 'concise') {
      // Сокращаем ответ для краткого стиля
      response = response.split('\n').slice(0, 2).join('\n');
    } else if (style.verbosity === 'detailed') {
      // Добавляем больше деталей
      if (result.archaeological_insights?.length > 0) {
        response += '\n\nДополнительная информация из исторического анализа доступна.';
      }
    }

    return response;
  }

  selectArchaeologicalHighlights(insights) {
    if (!insights || insights.length === 0) return [];

    return insights
      .filter(insight => insight.significance === 'high' || insight.significance === 'medium')
      .slice(0, 2);
  }

  selectFutureInsights(predictions, style) {
    if (!predictions || predictions.length === 0) return [];

    let selected = predictions.filter(pred => pred.actionable);

    if (style.focusArea === 'practical') {
      selected = selected.filter(pred => pred.type === 'intention' || pred.type === 'hidden_need');
    }

    return selected.slice(0, 2);
  }

  filterActionableRecommendations(recommendations, style) {
    if (!recommendations || recommendations.length === 0) return [];

    return recommendations
      .filter(rec => rec.actionable && rec.priority > 0.5)
      .slice(0, style.showAdvanced ? 3 : 1);
  }

  generateSimpleTemporalHint(standardResult) {
    if (standardResult.project_context) {
      return 'Доступен углубленный анализ с учетом истории проекта.';
    }
    
    if (standardResult.predictions && standardResult.predictions.length > 0) {
      return 'Возможна более точная интерпретация с использованием временного анализа.';
    }
    
    return 'Системы темпорального анализа готовы к активации.';
  }

  calculateEnhancementScore(standardResult, enhancedResult) {
    let score = 0;

    // Улучшение уверенности
    const confidenceBoost = (enhancedResult.enhanced_confidence || enhancedResult.confidence || 0) - 
                           (standardResult.confidence || 0);
    score += Math.max(0, confidenceBoost) * 2; // *2 для весомости

    // Дополнительные инсайты
    const additionalInsights = (enhancedResult.archaeological_insights?.length || 0) +
                              (enhancedResult.future_predictions?.length || 0) +
                              (enhancedResult.restored_meanings?.length || 0);
    score += additionalInsights * 0.1;

    // Дополнительные предсказания
    const predictionBoost = (enhancedResult.enhanced_predictions?.length || 0) - 
                           (standardResult.predictions?.length || 0);
    score += Math.max(0, predictionBoost) * 0.15;

    // Обогащение контекста
    if (enhancedResult.enriched_context) {
      score += 0.2;
    }

    return Math.min(1.0, score); // Максимум 1.0
  }

  shouldIncludeTimeMachineData(context) {
    return context.includeMetrics || context.userLevel === 'advanced' || context.debugMode;
  }

  simplifyArchaeological(archaeological) {
    if (!archaeological) return null;

    return {
      total_excavations: archaeological.excavations?.length || 0,
      lost_meanings_found: archaeological.excavations?.reduce((sum, exc) => 
        sum + (exc.lostMeanings?.length || 0), 0) || 0,
      cultural_layers: archaeological.culturalLayers?.length || 0
    };
  }

  simplifyFuturistic(futuristic) {
    if (!futuristic) return null;

    return {
      future_intentions: futuristic.futureIntentions?.length || 0,
      hidden_needs: futuristic.hiddenNeeds?.length || 0,
      anticipated_queries: futuristic.anticipatedQueries?.length || 0
    };
  }

  updateIntegrationMetrics(result) {
    this.integrationMetrics.totalIntegrations++;

    if (result.temporalIntegration && result.temporalIntegration.enabled) {
      this.integrationMetrics.temporallyEnhancedResponses++;
      
      const enhancement = result.temporalIntegration.enhancementScore || 0;
      this.integrationMetrics.averageEnhancement = 
        (this.integrationMetrics.averageEnhancement * 0.9) + (enhancement * 0.1);
    }
  }

  /**
   * Получает статистику интеграции
   */
  getIntegrationStatistics() {
    return {
      integrationMetrics: this.integrationMetrics,
      timeMachineStats: this.timeMachine.getTemporalStatistics(),
      integrationLevel: this.integrationLevel,
      adaptiveMode: this.adaptiveMode
    };
  }
}

module.exports = {
  TemporalSemanticIntegrator
};
