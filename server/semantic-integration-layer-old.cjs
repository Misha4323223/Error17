/**
 * Слой интеграции семантической памяти с интеллектуальным процессором
 * Обеспечивает безопасную интеграцию без нарушения существующей архитектуры
 */

const semanticMemory = require('./semantic-memory/index.cjs');
const userMemoryManager = require('./semantic-memory/user-memory-manager.cjs');
const userProfiler = require('./semantic-memory/user-profiler.cjs');
const learningSystem = require('./semantic-memory/learning-system.cjs');

// Подключаем визуально-семантическую интеграцию
let visualSemanticIntegration;
try {
  visualSemanticIntegration = require('./visual-semantic-integration.cjs');
} catch (error) {
  console.log('⚠️ [SEMANTIC] Визуально-семантическая интеграция недоступна:', error.message);
}

const SmartLogger = {
  integration: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔗 [${timestamp}] SEMANTIC INTEGRATION: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Интеграционный анализатор - главный мозг системы
 * Решает, должна ли семантика управлять ответом или использовать fallback
 */
class SemanticIntegrationLayer {
  constructor() {
    
  this.semanticThreshold = 30; // Порог уверенности семантики для управления

    
    this.enabled = true;
  }

  /**
   * ФАЗА 2: Мета-семантическая интеграция с глубоким анализом понимания
   */
  async analyzeWithSemantics(userQuery, options = {}) {
    SmartLogger.integration(`🚀🧠 ФАЗА 2: Мета-семантический анализ запроса: "${userQuery.substring(0, 50)}..."`);

    try {
      if (!this.enabled) {
        SmartLogger.integration('Семантическая интеграция отключена, используем fallback');
        return { shouldUseSemantic: false, reason: 'disabled' };
      }

      // НОВОЕ: Определяем использовать ли мета-семантику
      const useMetaSemantics = this.shouldUseMetaSemantics(userQuery, options);
      
      if (useMetaSemantics) {
        SmartLogger.integration('🔮 Используем МЕТА-СЕМАНТИЧЕСКИЙ анализ');
        return await this.performMetaSemanticAnalysis(userQuery, options);
      } else {
        SmartLogger.integration('🧠 Используем стандартный семантический анализ');
        return await this.performStandardSemanticAnalysis(userQuery, options);
      }

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка семантической интеграции: ${error.message}`);
      return { shouldUseSemantic: false, reason: 'error', error: error.message };
    }
  }

  /**
   * Определяет, следует ли использовать мета-семантику
   */
  shouldUseMetaSemantics(userQuery, options) {
    // Критерии для использования мета-семантики:
    
    // 1. Сложные или неоднозначные запросы
    const isComplex = userQuery.length > 50 || 
                     userQuery.split(' ').length > 8 ||
                     userQuery.includes('?') ||
                     userQuery.includes('или') ||
                     userQuery.includes('maybe') ||
                     userQuery.includes('возможно');
    
    // 2. Критически важные операции
    const isCritical = userQuery.includes('важно') ||
                      userQuery.includes('срочно') ||
                      userQuery.includes('точно') ||
                      userQuery.includes('правильно');
    
    // 3. Проекты с историей
    const hasProjectHistory = options.hasRecentImages || 
                             options.sessionId ||
                             options.chatContext;
    
    // 4. Запросы на анализ или консультацию
    const isAnalytical = userQuery.includes('анализ') ||
                        userQuery.includes('совет') ||
                        userQuery.includes('рекомендации') ||
                        userQuery.includes('варианты');

    const shouldUse = isComplex || isCritical || hasProjectHistory || isAnalytical;
    
    SmartLogger.integration(`Критерии мета-семантики: сложный=${isComplex}, критический=${isCritical}, история=${hasProjectHistory}, аналитический=${isAnalytical} → ${shouldUse ? 'ВКЛЮЧЕНО' : 'выключено'}`);
    
    return shouldUse;
  }

  /**
   * Выполняет мета-семантический анализ
   */
  async performMetaSemanticAnalysis(userQuery, options) {
    SmartLogger.integration(`🔮 Выполнение мета-семантического анализа`);
    
    try {
      // Используем новый мета-семантический метод
      const semanticResult = await semanticMemory.analyzeCompleteRequestWithMeta(
        userQuery,
        options.sessionId || 'default',
        {
          hasRecentImages: options.hasRecentImages || false,
          chatContext: options.chatContext,
          requestType: options.requestType,
          userPreferences: options.userPreferences
        }
      );

      // Анализируем качество мета-семантического результата
      const qualityScore = semanticResult.quality_score || 5;
      const metaConfidence = semanticResult.enhanced_confidence || 0.7;
      
      // Определяем, должна ли семантика управлять ответом
      const shouldUseSemantic = qualityScore > 6 && metaConfidence > 0.65;
      
      SmartLogger.integration(`📊 Мета-качество: ${qualityScore}/10, уверенность: ${(metaConfidence * 100).toFixed(1)}%`);
      SmartLogger.integration(`🎯 Решение: ${shouldUseSemantic ? 'СЕМАНТИКА УПРАВЛЯЕТ' : 'fallback к процессору'}`);

      return {
        shouldUseSemantic,
        reason: shouldUseSemantic ? 'meta_semantic_analysis_success' : 'meta_semantic_quality_low',
        semanticResult,
        
        // Мета-семантические данные
        metaSemanticData: {
          qualityScore,
          metaConfidence,
          metaInsights: semanticResult.meta_insights,
          systemLearnings: semanticResult.system_learnings,
          recommendations: semanticResult.enhanced_recommendations,
          predictions: semanticResult.enhanced_predictions
        },
        
        // Дополнительная информация
        processingTime: semanticResult.total_processing_time,
        fallbackMode: semanticResult.fallback_mode || false
      };

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка мета-семантического анализа: ${error.message}`);
      
      // Fallback к стандартному анализу
      return await this.performStandardSemanticAnalysis(userQuery, options);
    }
  }

  /**
   * Выполняет стандартный семантический анализ
   */
  async performStandardSemanticAnalysis(userQuery, options) {
    SmartLogger.integration(`🧠 Выполнение стандартного семантического анализа`);
    
    try {
      // Используем стандартный метод семантической памяти
      const semanticResult = await semanticMemory.analyzeCompleteRequest(
        userQuery,
        options.sessionId || 'default',
        {
          hasRecentImages: options.hasRecentImages || false,
          chatContext: options.chatContext,
          requestType: options.requestType,
          userPreferences: options.userPreferences
        }
      );

      // Анализируем качество результата
      const confidence = semanticResult.confidence || 0.6;
      const projectRelevance = semanticResult.current_project ? 0.8 : 0.4;
      
      // Определяем общую уверенность
      const overallConfidence = (confidence + projectRelevance) / 2;
      
      // Определяем, должна ли семантика управлять ответом
      const shouldUseSemantic = overallConfidence > this.semanticThreshold / 100;
      
      SmartLogger.integration(`📊 Стандартное качество: уверенность=${(confidence * 100).toFixed(1)}%, релевантность=${(projectRelevance * 100).toFixed(1)}%`);
      SmartLogger.integration(`🎯 Решение: ${shouldUseSemantic ? 'СЕМАНТИКА УПРАВЛЯЕТ' : 'fallback к процессору'}`);

      return {
        shouldUseSemantic,
        reason: shouldUseSemantic ? 'semantic_analysis_success' : 'semantic_confidence_low',
        semanticResult,
        confidence: overallConfidence,
        processingTime: semanticResult.processing_time
      };

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка стандартного семантического анализа: ${error.message}`);
      return { shouldUseSemantic: false, reason: 'semantic_error', error: error.message };
    }
  }

  /**
   * Создает семантический ответ
   */
  async createSemanticResponse(semanticResult, userQuery, options) {

      // === ЭТАП 1: ПЕРСОНАЛИЗАЦИЯ И ПРОФИЛИРОВАНИЕ ===
      SmartLogger.integration('Этап 1: Анализ пользователя и персонализация');
      
      // Получаем или создаем профиль пользователя
      const userProfile = await userMemoryManager.getOrCreateUserProfile(userId);
      
      // Анализируем стиль общения и эмоции
      const communicationAnalysis = userProfiler.analyzeCommunicationStyle(userQuery);
      const designPreferences = userProfiler.analyzeDesignPreferences(userQuery);
      const emotionalState = userProfiler.analyzeEmotionalState(userQuery, options.sessionHistory);

      // === ЭТАП 2: КОНТЕКСТНОЕ ОБУЧЕНИЕ ===
      SmartLogger.integration('Этап 2: Применение контекстного обучения');
      
      // Получаем рекомендации на основе обученных паттернов
      const learningRecommendations = await learningSystem.getLearnedRecommendations(
        userId, userQuery, category
      );

      // === ЭТАП 3: УПРАВЛЕНИЕ ПРОЕКТАМИ ===
      SmartLogger.integration('Этап 3: Анализ контекста проектов');
      
      // Получаем контекст активных проектов
      const projectContext = await userMemoryManager.getUserProjectContext(userId);

      // === ЭТАП 4: АНАЛИЗ ИЗОБРАЖЕНИЙ (ЕСЛИ ПРИСУТСТВУЮТ) ===
      let imageAnalysisResult = null;
      if (options.hasRecentImages && options.recentImageUrl && visualSemanticIntegration) {
        SmartLogger.integration('Этап 4а: Анализ изображений с семантической интеграцией');
        
        imageAnalysisResult = await visualSemanticIntegration.analyzeImageWithSemantics(
          options.recentImageUrl,
          {
            userId: userId,
            sessionId: sessionId,
            category: category,
            userProfile: userProfile
          }
        );
        
        if (imageAnalysisResult.success) {
          SmartLogger.integration('✅ Визуальный анализ успешно завершен', {
            confidence: imageAnalysisResult.confidence_score,
            recommendations: imageAnalysisResult.recommendations?.length || 0
          });
        }
      }

      // === ЭТАП 4б: СЕМАНТИЧЕСКИЙ АНАЛИЗ (ОРИГИНАЛЬНАЯ ЛОГИКА) ===
      SmartLogger.integration('Этап 4б: Семантический анализ');
      
      const semanticResult = await semanticMemory.analyzeCompleteRequest(
        userQuery, 
        sessionId, 
        {
          chatContext: options.chatContext,
          hasRecentImages: options.hasRecentImages,
          userName: options.userName,
          userProfile: userProfile,
          projectContext: projectContext,
          imageAnalysis: imageAnalysisResult // Передаем результат анализа изображения
        }
      );

      if (semanticResult.error) {
        SmartLogger.integration('Семантический анализ завершился с ошибкой, используем fallback');
        return { shouldUseSemantic: false, reason: 'error', error: semanticResult.error };
      }

      // === ЭТАП 5: ИНТЕГРАЦИЯ ВСЕХ КОМПОНЕНТОВ ===
      const confidence = semanticResult.confidence || 0;
      
      // Повышаем уверенность если есть персонализация и обучение
      let adjustedConfidence = confidence;
      if (learningRecommendations) {
        adjustedConfidence += 15; // Бонус за обученные паттерны
      }
      if (userProfile && userProfile.totalInteractions > 5) {
        adjustedConfidence += 10; // Бонус за знание пользователя
      }
      
      adjustedConfidence = Math.min(adjustedConfidence, 100);

      SmartLogger.integration(`Семантическая уверенность: ${confidence}% → ${adjustedConfidence}% (с персонализацией)`);

      // Создаем расширенный результат с данными Фазы 1 и визуального анализа
      const enhancedResult = {
        ...semanticResult,
        
        // Добавляем данные Фазы 1
        phase1Data: {
          userProfile,
          communicationAnalysis,
          designPreferences,
          emotionalState,
          learningRecommendations,
          projectContext
        },
        
        // Добавляем результаты визуального анализа
        imageAnalysis: imageAnalysisResult,
        
        // Обновляем уверенность с учетом визуального анализа
        originalConfidence: confidence,
        adjustedConfidence: this.adjustConfidenceWithImageAnalysis(adjustedConfidence, imageAnalysisResult)
      };

      if (adjustedConfidence >= this.semanticThreshold) {
        SmartLogger.integration(`✅ Расширенная семантика берет управление (уверенность ${adjustedConfidence}% >= ${this.semanticThreshold}%)`);
        
        return {
          shouldUseSemantic: true,
          semanticResult: enhancedResult,
          confidence: adjustedConfidence,
          reason: 'high_confidence_with_personalization'
        };
      } else {
        SmartLogger.integration(`⚠️ Низкая уверенность семантики (${adjustedConfidence}% < ${this.semanticThreshold}%), но передаем данные персонализации`);
        
        return {
          shouldUseSemantic: false,
          semanticResult: enhancedResult, // передаем для обогащения
          confidence: adjustedConfidence,
          reason: 'low_confidence_but_enriched'
        };
      }

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка расширенной семантической интеграции: ${error.message}`);
      return { shouldUseSemantic: false, reason: 'exception', error: error.message };
    }
  }

  /**
   * ФАЗА 1: Создание персонализированного семантически обогащенного ответа
   */
  async createSemanticResponse(semanticResult, userQuery, options = {}) {
    SmartLogger.integration('🎨 ФАЗА 1: Создание персонализированного ответа');

    try {
      const userId = options.userId || 1;
      const category = this.extractCategoryFromSemantic(semanticResult);
      
      // Получаем данные Фазы 1
      const phase1Data = semanticResult.phase1Data || {};
      const { userProfile, communicationAnalysis, designPreferences, emotionalState, learningRecommendations } = phase1Data;

      // === ЭТАП 1: АДАПТАЦИЯ ПРОМПТА С ОБУЧЕНИЕМ ===
      let enhancedPrompt = semanticResult.enhanced_prompt || userQuery;
      
      if (learningRecommendations) {
        SmartLogger.integration('Применение контекстного обучения к промпту');
        const learningAdaptation = await learningSystem.adaptPromptWithLearning(userId, enhancedPrompt, category);
        if (learningAdaptation.adaptedPrompt) {
          enhancedPrompt = learningAdaptation.adaptedPrompt;
        }
      }

      // === ЭТАП 2: ПЕРСОНАЛИЗАЦИЯ ПРОМПТА ===
      if (userProfile && designPreferences) {
        enhancedPrompt = this.personalizePrompt(enhancedPrompt, userProfile, designPreferences);
      }
      
      // Собираем расширенные контекстные данные с персонализацией
      const contextData = {
        currentProject: semanticResult.current_project,
        predictions: semanticResult.predictions || [],
        recommendations: semanticResult.system_recommendations || [],
        compatibility: semanticResult.compatibility,
        userProfile,
        communicationAnalysis,
        designPreferences,
        emotionalState,
        learningRecommendations
      };

      // === ЭТАП 3: СОЗДАНИЕ ПЕРСОНАЛИЗИРОВАННОГО ОТВЕТА ===
      let response = await this.createPersonalizedResponse(enhancedPrompt, category, contextData, options);
      
      // === ЭТАП 4: АДАПТАЦИЯ ПОД ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ===
      if (userProfile && emotionalState) {
        response = userProfiler.adaptResponseToProfile(response, userProfile, emotionalState);
      }

      // === ЭТАП 5: СОХРАНЕНИЕ КОНТЕКСТА ПРОЕКТА ===
      if (category === 'image_generation' || category === 'vectorization') {
        await this.saveProjectContext(userId, options.sessionId, category, userQuery, contextData);
      }

      SmartLogger.integration(`✅ Персонализированный ответ создан для категории: ${category}`);
      
      return {
        success: true,
        response,
        provider: 'SemanticMemoryPhase1',
        category,
        semanticData: {
          confidence: semanticResult.adjustedConfidence || semanticResult.confidence,
          projectId: contextData.currentProject?.id,
          predictionsCount: contextData.predictions.length,
          hasPersonalization: !!userProfile,
          hasLearning: !!learningRecommendations
        },
        phase1Metadata: {
          userId,
          profileId: userProfile?.id,
          communicationStyle: communicationAnalysis?.dominantStyle,
          emotionalTone: emotionalState?.currentEmotion,
          learningConfidence: learningRecommendations?.confidence
        }
      };

    } catch (error) {
      SmartLogger.integration(`❌ Ошибка создания семантического ответа: ${error.message}`);
      return {
        success: false,
        error: error.message,
        shouldFallback: true
      };
    }
  }

  // === ФАЗА 1: НОВЫЕ МЕТОДЫ ===

  /**
   * Персонализация промпта на основе профиля пользователя
   */
  personalizePrompt(prompt, userProfile, designPreferences) {
    let personalizedPrompt = prompt;

    // Добавляем цветовые предпочтения
    if (userProfile.favoriteColors && userProfile.favoriteColors.length > 0) {
      const colors = userProfile.favoriteColors.slice(0, 2).join(' и ');
      personalizedPrompt += ` Учти цветовые предпочтения: ${colors}.`;
    }

    // Добавляем стилевые предпочтения
    if (userProfile.preferredStyles && userProfile.preferredStyles.length > 0) {
      const styles = userProfile.preferredStyles.slice(0, 2).join(' и ');
      personalizedPrompt += ` Предпочитаемые стили: ${styles}.`;
    }

    // Учитываем сложность дизайна
    if (userProfile.designComplexity) {
      const complexityHints = {
        simple: 'минималистичный стиль, чистые линии',
        medium: 'умеренная детализация',
        complex: 'детальный дизайн с множеством элементов'
      };
      personalizedPrompt += ` Уровень сложности: ${complexityHints[userProfile.designComplexity]}.`;
    }

    return personalizedPrompt;
  }

  /**
   * Создание персонализированного ответа
   */
  async createPersonalizedResponse(enhancedPrompt, category, contextData, options) {
    switch (category) {
      case 'image_generation':
        return this.createImageGenerationResponse(enhancedPrompt, contextData, options);
      case 'image_consultation':
        return this.createConsultationResponse(enhancedPrompt, contextData, options);
      case 'vectorization':
        return this.createVectorizationResponse(enhancedPrompt, contextData, options);
      case 'web_search':
        return this.createSearchResponse(enhancedPrompt, contextData, options);
      default:
        return this.createGeneralResponse(enhancedPrompt, contextData, options);
    }
  }

  /**
   * Создание ответа для генерации изображений
   */
  createImageGenerationResponse(prompt, contextData, options) {
    let response = `Создаю изображение с учетом ваших предпочтений: ${prompt}`;

    // Добавляем персональные элементы
    if (contextData.userProfile) {
      if (contextData.designPreferences?.styles) {
        const styles = Object.keys(contextData.designPreferences.styles);
        if (styles.length > 0) {
          response += `\n\nУчитываю ваш стиль: ${styles[0]}.`;
        }
      }
    }

    // Добавляем рекомендации на основе обучения
    if (contextData.learningRecommendations) {
      response += `\n\n💡 На основе предыдущего опыта: ${contextData.learningRecommendations.styleAdjustments?.tone || 'применяю проверенные настройки'}.`;
    }

    return response;
  }

  /**
   * Создание консультационного ответа
   */
  createConsultationResponse(prompt, contextData, options) {
    let response = `Анализирую ваш запрос: ${prompt}`;

    // Адаптируем под стиль общения
    if (contextData.communicationAnalysis?.dominantStyle === 'detailed') {
      response += '\n\nДетальный анализ:\n';
    } else if (contextData.communicationAnalysis?.dominantStyle === 'brief') {
      response = 'Краткий ответ: ';
    }

    return response;
  }

  /**
   * Создание ответа для векторизации
   */
  createVectorizationResponse(prompt, contextData, options) {
    let response = `Векторизую изображение с оптимальными настройками.`;

    if (contextData.userProfile?.designComplexity === 'simple') {
      response += ' Настройки: упрощенная векторизация для чистого результата.';
    } else if (contextData.userProfile?.designComplexity === 'complex') {
      response += ' Настройки: детальная векторизация с сохранением всех элементов.';
    }

    return response;
  }

  /**
   * Создание ответа для поиска
   */
  createSearchResponse(prompt, contextData, options) {
    return `Ищу информацию: ${prompt}`;
  }

  /**
   * Создание общего ответа
   */
  createGeneralResponse(prompt, contextData, options) {
    let response = 'Обрабатываю ваш запрос...';

    // Адаптируем под эмоциональное состояние
    if (contextData.emotionalState?.currentEmotion === 'enthusiastic') {
      response = 'С удовольствием помогу!';
    } else if (contextData.emotionalState?.currentEmotion === 'professional') {
      response = 'Профессионально обрабатываю ваш запрос.';
    }

    return response;
  }

  /**
   * Сохранение контекста проекта
   */
  async saveProjectContext(userId, sessionId, category, userQuery, contextData) {
    try {
      const projectData = {
        projectType: category,
        projectTitle: `${category} - ${new Date().toLocaleDateString()}`,
        description: userQuery,
        userIntent: userQuery,
        domain: this.determineDomain(category),
        semanticTags: this.extractSemanticTags(userQuery),
        concepts: this.extractConcepts(contextData),
        originalQuery: userQuery
      };

      await userMemoryManager.createOrUpdateProject(userId, sessionId, projectData);
      SmartLogger.integration(`Контекст проекта сохранен для категории ${category}`);
    } catch (error) {
      SmartLogger.integration(`Ошибка сохранения контекста проекта: ${error.message}`);
    }
  }

  /**
   * Запись обратной связи для обучения
   */
  async recordInteractionFeedback(userId, sessionId, interactionData) {
    try {
      const {
        userRequest,
        systemResponse,
        userFeedback,
        category,
        responseTime = 0,
        additionalMetrics = {}
      } = interactionData;

      // Анализируем взаимодействие
      const successAnalysis = await learningSystem.analyzeInteractionSuccess(userId, sessionId, {
        userRequest,
        systemResponse,
        userFeedback,
        category,
        responseTime,
        additionalMetrics
      });

      // Обновляем профиль пользователя
      if (successAnalysis.isSuccess) {
        await userMemoryManager.updateUserProfileFromInteraction(userId, {
          responseQuality: 8, // Хорошая оценка
          category,
          preferredColors: additionalMetrics.detectedColors,
          designStyle: additionalMetrics.detectedStyle
        });
      }

      SmartLogger.integration(`Обратная связь записана`, {
        userId,
        category,
        success: successAnalysis.isSuccess
      });

      return successAnalysis;
    } catch (error) {
      SmartLogger.integration(`Ошибка записи обратной связи: ${error.message}`);
      return null;
    }
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  determineDomain(category) {
    const domainMap = {
      'image_generation': 'creative',
      'vectorization': 'technical',
      'web_search': 'information',
      'image_consultation': 'advisory'
    };
    return domainMap[category] || 'general';
  }

  extractSemanticTags(query) {
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);
    return keywords.slice(0, 5); // Первые 5 значимых слов
  }

  extractConcepts(contextData) {
    const concepts = [];
    
    if (contextData.userProfile?.preferredStyles) {
      concepts.push(...contextData.userProfile.preferredStyles);
    }
    
    if (contextData.designPreferences?.styles) {
      concepts.push(...Object.keys(contextData.designPreferences.styles));
    }
    
    return [...new Set(concepts)].slice(0, 5);
  }

  /**
   * Корректировка уверенности с учетом анализа изображений
   */
  adjustConfidenceWithImageAnalysis(currentConfidence, imageAnalysisResult) {
    if (!imageAnalysisResult || !imageAnalysisResult.success) {
      return currentConfidence;
    }

    // Повышаем уверенность если анализ изображения дал хорошие результаты
    const imageConfidence = imageAnalysisResult.confidence_score || 0;
    const bonus = imageConfidence > 0.7 ? 15 : (imageConfidence > 0.5 ? 10 : 5);
    
    SmartLogger.integration(`Бонус уверенности от анализа изображения: +${bonus}% (анализ: ${Math.round(imageConfidence * 100)}%)`);
    
    return Math.min(currentConfidence + bonus, 100);
  }

  /**
   * Обогащение стандартного ответа семантическими данными
   */
  enrichStandardResponse(standardResponse, semanticResult) {
    if (!semanticResult || !standardResponse) return standardResponse;

    SmartLogger.integration('Обогащение стандартного ответа семантическими данными');

    try {
      let enrichedResponse = standardResponse.response || '';

      // Добавляем контекстные улучшения
      if (semanticResult.current_project) {
        const project = semanticResult.current_project;
        enrichedResponse += `\n\n💡 **Контекст проекта**: ${project.title}`;
      }

      // Добавляем предсказания следующих шагов
      if (semanticResult.predictions && semanticResult.predictions.length > 0) {
        const topPrediction = semanticResult.predictions[0];
        if (topPrediction.probability > 0.6) {
          enrichedResponse += `\n\n🔮 **Возможно, далее вам понадобится**: ${topPrediction.description}`;
        }
      }

      // Добавляем системные рекомендации
      if (semanticResult.system_recommendations && semanticResult.system_recommendations.length > 0) {
        const highPriorityRec = semanticResult.system_recommendations.find(r => r.priority === 'high');
        if (highPriorityRec) {
          enrichedResponse += `\n\n⚡ **Рекомендация**: ${highPriorityRec.message}`;
        }
      }

      return {
        ...standardResponse,
        response: enrichedResponse,
        semanticEnriched: true,
        semanticConfidence: semanticResult.confidence
      };

    } catch (error) {
      SmartLogger.integration(`⚠️ Ошибка обогащения ответа: ${error.message}, возвращаем оригинал`);
      return standardResponse;
    }
  }

  /**
   * Извлечение категории из семантического анализа
   */
  extractCategoryFromSemantic(semanticResult) {
    // Анализируем семантический кластер для определения категории
    const cluster = semanticResult.semantic_analysis?.semantic_cluster;
    
    if (cluster) {
      const clusterName = cluster.name;
      
      // Маппинг семантических кластеров в категории
      const clusterMap = {
        'branding': 'image_generation',
        'design': 'image_generation', 
        'print': 'image_generation',
        'vectorization': 'vectorization',
        'research': 'web_search',
        'analysis': 'web_search'
      };
      
      return clusterMap[clusterName] || 'general';
    }

    // Fallback анализ по ключевым словам
    const entities = semanticResult.entities || {};
    if (entities.actions?.some(a => a.category === 'convert')) return 'vectorization';
    if (entities.contexts?.some(c => c.category === 'logo')) return 'image_generation';
    
    return 'general';
  }

  /**
   * Обработчики для разных категорий
   */
  async handleSemanticImageGeneration(prompt, contextData, options) {
    let response = `🎨 Создаю изображение: **${prompt}**`;
    
    // Добавляем контекст проекта
    if (contextData.currentProject) {
      response += `\n\n📋 **Проект**: ${contextData.currentProject.title}`;
      
      // Добавляем цели проекта
      if (contextData.currentProject.progress?.goals) {
        const goals = contextData.currentProject.progress.goals.slice(0, 2);
        response += `\n🎯 **Цели**: ${goals.join(', ')}`;
      }
    }

    return response;
  }

  async handleSemanticVectorization(prompt, contextData, options) {
    let response = `⚡ Векторизую изображение: **${prompt}**`;
    
    // Контекст совместимости с проектом
    if (contextData.compatibility?.compatible) {
      response += `\n\n✅ **Совместимость**: Векторизация дополнит ваш текущий проект`;
    }

    return response;
  }

  async handleSemanticWebSearch(prompt, contextData, options) {
    let response = `🔍 Ищу информацию: **${prompt}**`;
    
    return response;
  }

  async handleSemanticGeneral(prompt, contextData, options) {
    let response = `💭 Обрабатываю запрос: **${prompt}**`;
    
    return response;
  }

  /**
   * Добавление проактивных предложений
   */
  async addProactiveSuggestions(predictions) {
    if (!predictions || predictions.length === 0) return '';

    const topPredictions = predictions.slice(0, 2);
    let suggestions = '\n\n🔮 **Возможные следующие шаги**:';
    
    topPredictions.forEach((prediction, index) => {
      suggestions += `\n${index + 1}️⃣ ${prediction.description} (вероятность: ${Math.round(prediction.probability * 100)}%)`;
    });

    return suggestions;
  }
}

// Создаем глобальный экземпляр
const semanticIntegrationLayer = new SemanticIntegrationLayer();

module.exports = {
  // Основные методы
  analyzeWithSemantics: semanticIntegrationLayer.analyzeWithSemantics.bind(semanticIntegrationLayer),
  createSemanticResponse: semanticIntegrationLayer.createSemanticResponse.bind(semanticIntegrationLayer),
  enrichStandardResponse: semanticIntegrationLayer.enrichStandardResponse.bind(semanticIntegrationLayer),
  
  // Дополнительные методы
  extractCategoryFromSemantic: semanticIntegrationLayer.extractCategoryFromSemantic.bind(semanticIntegrationLayer),
  mapSemanticClusterToCategory: semanticIntegrationLayer.extractCategoryFromSemantic.bind(semanticIntegrationLayer),
  
  // Управление
  setSemanticThreshold: (threshold) => { semanticIntegrationLayer.semanticThreshold = threshold; },
  enableSemantic: () => { semanticIntegrationLayer.enabled = true; },
  disableSemantic: () => { semanticIntegrationLayer.enabled = false; },
  
  // Класс для расширения
  SemanticIntegrationLayer
};