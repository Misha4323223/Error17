/**
 * ЕДИНЫЙ МОДУЛЬ "СОЗНАНИЕ" - Центральная система диалогов BOOOMERANGS AI
 * Объединяет все 50+ семантических модулей в единый интерфейс обработки
 * 
 * Архитектура: вход → анализ → генерация → рефлексия → ответ
 */

// Импортируем существующие модули через require (CommonJS совместимость)
const semanticMemory = require('./semantic-memory/index.cjs');
const intelligentChatProcessor = require('./intelligent-chat-processor.cjs');
const semanticIntegrationLayer = require('./semantic-integration-layer.cjs');
const NaturalLanguageGeneratorClass = require('./semantic-memory/natural-language-generator.cjs');
const naturalLanguageGenerator = new NaturalLanguageGeneratorClass();
const autonomousLearningEngine = require('./semantic-memory/autonomous-learning-engine.cjs');
const metaSemanticEngine = require('./semantic-memory/meta-semantic-engine.cjs');
const emotionalSemanticMatrix = require('./semantic-memory/emotional-semantic-matrix.cjs');
const userProfiler = require('./semantic-memory/user-profiler.cjs');
const predictiveSystem = require('./semantic-memory/predictive-system.cjs');

// Интеграция с нейросетью и Hot Swap
let neuralCore = null;
let neuralIntegration = null;
try {
  neuralCore = require('./neural-network-core.cjs');
  neuralIntegration = require('./neural-integration.cjs');
  console.log('🧠 Нейросеть успешно интегрирована в conversation-engine');

  // Получаем глобальную интеграцию для Hot Swap
  const { getGlobalNeuralIntegration } = require('./neural-integration.cjs');
  neuralIntegration = getGlobalNeuralIntegration();

} catch (error) {
  console.warn(`⚠️ Нейросеть недоступна: ${error.message}`);
}

// Импортируем биомиметическую семантику
let biomimeticSemantics = null;
try {
  const { BiomimeticSemantics } = require('./semantic-memory/biomimetic-semantics.cjs');
  biomimeticSemantics = new BiomimeticSemantics();
  console.log('🦋 Биомиметическая семантика успешно инициализирована');
} catch (error) {
  console.warn(`⚠️ Биомиметическая семантика недоступна: ${error.message}`);
}

// Импортируем новые модули
const { generatePersonaStylePrompt } = require('./persona.cjs');
const { semanticQualityScore, refineResponse } = require('./self-evaluator.cjs');

// Определения типов (заменяем TypeScript интерфейсы на JSDoc)

/**
 * @typedef {Object} UserContext
 * @property {string} [userId]
 * @property {string} [sessionId]
 * @property {Array} [conversationHistory]
 * @property {Object} [userProfile]
 * @property {Object} [sessionContext]
 * @property {string} [tone]
 * @property {string} [role]
 * @property {Object} [preferences]
 */

/**
 * @typedef {Object} ThoughtProcess
 * @property {string} input
 * @property {Object} meta
 * @property {Object} emotion
 * @property {Object} memory
 * @property {Object} persona
 * @property {UserContext} context
 */

/**
 * @typedef {Object} ProcessedResponse
 * @property {string} reply
 * @property {number} confidence
 * @property {number} quality
 * @property {Object} metadata
 * @property {string[]} metadata.modulesUsed
 * @property {number} metadata.processingTime
 * @property {number} metadata.iterationCount
 * @property {number} metadata.semanticDepth
 * @property {boolean} metadata.learningUpdated
 * @property {boolean} metadata.predictionsGenerated
 */

/**
 * ГЛАВНАЯ ФУНКЦИЯ СОЗНАНИЯ
 * Центральная точка обработки всех диалогов
 * @param {string} input - Пользовательский ввод
 * @param {UserContext} userContext - Контекст пользователя
 * @returns {Promise<ProcessedResponse>} Обработанный ответ
 */
const processUserInput = async (input, userContext = {}) => {
  const startTime = Date.now();
  let iterationCount = 0;

  console.log('🧠 АКТИВАЦИЯ ЕДИНОГО МОДУЛЯ СОЗНАНИЯ');
  console.log(`📝 Входной запрос: "${input.substring(0, 100)}..."`);

  // 🎯 НОВОЕ: Проверяем routing hints от semantic router
  const routingHints = userContext.routingHints;
  if (routingHints) {
    console.log('🎯 Semantic Router рекомендации:', {
      complexity: routingHints.complexity,
      mode: routingHints.mode,
      useNeural: routingHints.useNeural,
      preferredProviders: routingHints.preferredProviders
    });
  }

  // 🧠 ПРИОРИТЕТ: Всегда пытаемся подключить нейросеть
  let neuralIntegration = null;
  let neuralResponse = null;
  
  try {
    const { getGlobalNeuralIntegration } = require('./neural-integration.cjs');
    neuralIntegration = getGlobalNeuralIntegration();
    
    if (neuralIntegration && (neuralIntegration.isInitialized || neuralIntegration.mode === 'lite')) {
      console.log(`🧠 Neural Integration активна в режиме ${neuralIntegration.mode} - генерируем нейросетевой ответ`);
      
      // Генерируем реальный ответ от нейросети
      try {
        neuralResponse = await neuralIntegration.generateHybridResponse(input, {
          maxTokens: 150,
          temperature: 0.9,
          userId: userContext.userId,
          sessionId: userContext.sessionId,
          userContext: userContext
        });
        
        console.log(`✅ Нейросеть (${neuralIntegration.mode}) сгенерировала ответ:`, neuralResponse?.substring(0, 100));
        
        // Если нейросеть дала ответ, проверяем качество
        if (neuralResponse && neuralResponse.length > 10) {
          // Удаляем служебные маркеры из ответа
          const cleanedResponse = neuralResponse
            .replace(/\n\n_.*Generated by.*_$/g, '')
            .replace(/⚡ Generated by Neural Lite/g, '')
            .replace(/🧠 Generated by Neural Full/g, '')
            .trim();
          
          // Проверяем качество: если много <UNK> токенов, используем семантическую систему
          const unkCount = (cleanedResponse.match(/<UNK>/g) || []).length;
          const wordCount = cleanedResponse.split(' ').length;
          const unkRatio = unkCount / wordCount;
          
          if (unkRatio < 0.3 && cleanedResponse.length > 20 && !cleanedResponse.includes('не удалось сгенерировать')) {
            console.log('🎯 Используем качественный neural response');
            return {
              reply: cleanedResponse,
              confidence: 0.95,
              quality: 9,
              metadata: {
                modulesUsed: ['neural-integration'],
                processingTime: Date.now() - startTime,
                iterationCount: 1,
                semanticDepth: 0,
                learningUpdated: false,
                predictionsGenerated: false,
                neuralMode: neuralIntegration.mode,
                provider: `BOOOMERANGS-Neural-${neuralIntegration.mode}`
              }
            };
          } else {
            console.log(`⚠️ Neural response низкого качества (${(unkRatio * 100).toFixed(1)}% UNK tokens), переключаемся на семантику`);
          }
        }
      } catch (neuralError) {
        console.log('⚠️ Neural generation error:', neuralError.message);
      }
    } else {
      console.log('⚠️ Neural Integration не инициализирована или не готова');
    }
  } catch (error) {
    console.log('⚠️ Neural Integration недоступна:', error.message);
  }

  // ===== СИСТЕМА ВОССТАНОВЛЕНИЯ: Инициализация =====
  const processingStages = {
    metaAnalysis: { status: 'pending', error: null, data: null, duration: 0 },
    emotionalAnalysis: { status: 'pending', error: null, data: null, duration: 0 },
    memoryRetrieval: { status: 'pending', error: null, data: null, duration: 0 },
    personaGeneration: { status: 'pending', error: null, data: null, duration: 0 },
    responseGeneration: { status: 'pending', error: null, data: null, duration: 0 },
    qualityEvaluation: { status: 'pending', error: null, data: null, duration: 0 }
  };

  try {
    // ===== ЭТАП 1: МЕТА-СЕМАНТИЧЕСКИЙ АНАЛИЗ С ТАЙМАУТОМ =====
    console.log('🔍 ЭТАП 1: Мета-семантический анализ...');
    const metaStartTime = Date.now();
    let meta = null;

    try {
      // 🎯 НОВОЕ: Адаптируем анализ под routing hints
      const analysisOptions = {
        ...userContext,
        fullAnalysis: true,
        activateAllModules: true
      };

      // Если semantic router рекомендует express режим - упрощаем анализ
      if (routingHints?.mode === 'express') {
        analysisOptions.fullAnalysis = false;
        analysisOptions.activateAllModules = false;
        console.log('⚡ Express режим: упрощенный анализ');
      }

      // Если expert режим - активируем все модули
      if (routingHints?.mode === 'expert') {
        analysisOptions.fullAnalysis = true;
        analysisOptions.activateAllModules = true;
        console.log('🎓 Expert режим: полный анализ');
      }

      // ✅ ИСПРАВЛЕНО: Добавлен таймаут для предотвращения зависания
      const metaAnalysisPromise = semanticIntegrationLayer.analyzeWithSemantics(input, analysisOptions);

      // Динамический таймаут на основе routing hints
      const timeout = routingHints?.timeLimit || 5000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Таймаут мета-анализа (${timeout/1000} сек)`)), timeout);
      });

      meta = await Promise.race([metaAnalysisPromise, timeoutPromise]);

      // ✅ ИСПРАВЛЕНО: Проверяем корректность структуры
      if (!meta || !meta.semanticResult) {
        throw new Error('Некорректная структура результата мета-анализа');
      }

      processingStages.metaAnalysis.status = 'success';
      processingStages.metaAnalysis.data = meta;
      processingStages.metaAnalysis.duration = Date.now() - metaStartTime;
      console.log(`✅ ЭТАП 1: Мета-анализ успешен (${processingStages.metaAnalysis.duration}мс)`);
    } catch (metaError) {
      processingStages.metaAnalysis.status = 'failed';
      processingStages.metaAnalysis.error = metaError.message;
      processingStages.metaAnalysis.duration = Date.now() - metaStartTime;
      console.log(`❌ ЭТАП 1: Мета-анализ не удался (${metaError.message}), используем fallback`);

      // ✅ ИСПРАВЛЕНО: Правильная структура fallback
      meta = {
        shouldUseSemantic: true,
        semanticResult: {
          intent: 'general_conversation',
          confidence: 0.4,
          semantic_depth_level: 1,
          category: 'conversation',
          query_type: 'dialog',
          dialog_category: 'general_chat',
          semantic_analysis: {
            query_type: 'dialog',
            dialog_category: 'general_chat',
            semantic_cluster: { name: 'conversation', confidence: 40 },
            intentions: [],
            context_clues: {}
          },
          fallback: true
        }
      };
    }

    // ===== ЭТАП 2: ЭМОЦИОНАЛЬНЫЙ АНАЛИЗ =====
    console.log('😊 ЭТАП 2: Эмоциональная матрица...');
    const emotionStartTime = Date.now();
    let emotion = {};

    try {
      if (emotionalSemanticMatrix && typeof emotionalSemanticMatrix.analyzeEmotionalContext === 'function') {
        emotion = await emotionalSemanticMatrix.analyzeEmotionalContext(input, {
          userHistory: userContext.conversationHistory || [],
          userProfile: userContext.userProfile
        });
        processingStages.emotionalAnalysis.status = 'success';
        processingStages.emotionalAnalysis.data = emotion;
        console.log(`✅ ЭТАП 2: Эмоциональный анализ успешен`);
      } else {
        throw new Error('emotionalSemanticMatrix.analyzeEmotionalContext недоступна');
      }
    } catch (emotionError) {
      processingStages.emotionalAnalysis.status = 'failed';
      processingStages.emotionalAnalysis.error = emotionError.message;
      console.log(`❌ ЭТАП 2: Эмоциональный анализ не удался (${emotionError.message}), используем fallback`);

      // Fallback эмоциональный анализ
      emotion = {
        primary_emotion: 'neutral',
        confidence: 0.7,
        emotional_context: 'general conversation',
        fallback: true
      };
    }
    processingStages.emotionalAnalysis.duration = Date.now() - emotionStartTime;
    console.log(`⏱️ ЭТАП 2: завершен за ${processingStages.emotionalAnalysis.duration}мс`);

    // ===== ЭТАП 3: ИЗВЛЕЧЕНИЕ ПАМЯТИ =====
    console.log('💾 ЭТАП 3: Семантическая память...');
    const memoryStartTime = Date.now();
    let memory = null;

    try {
      memory = await semanticMemory.analyzeCompleteRequest(input, {
        conversationHistory: userContext.conversationHistory || [],
        userProfile: userContext.userProfile || null,
        sessionContext: userContext.sessionContext || {}
      });
      processingStages.memoryRetrieval.status = 'success';
      processingStages.memoryRetrieval.data = memory;
      console.log(`✅ ЭТАП 3: Семантическая память успешно извлечена`);
    } catch (memoryError) {
      processingStages.memoryRetrieval.status = 'failed';
      processingStages.memoryRetrieval.error = memoryError.message;
      console.log(`❌ ЭТАП 3: Семантическая память не удалась (${memoryError.message}), используем fallback`);

      // Fallback память
      memory = {
        semantic_analysis: { intent: 'general', confidence: 0.5 },
        entities: [],
        context: userContext.sessionContext || {},
        fallback: true
      };
    }
    processingStages.memoryRetrieval.duration = Date.now() - memoryStartTime;
    console.log(`⏱️ ЭТАП 3: завершен за ${processingStages.memoryRetrieval.duration}мс`);

    // ===== ЭТАП 4: ПРОФИЛИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ =====
    console.log('🎭 ЭТАП 4: Профилирование пользователя...');
    const personaStartTime = Date.now();
    let persona = null;
    let userProfile = null;

    try {
      // ✅ ИСПРАВЛЕНО: Добавлен таймаут для профилирования
      const profilingPromise = (async () => {
        // Анализируем стиль общения пользователя
        const communicationStyle = userProfiler.analyzeCommunicationStyle(input);
        const designPreferences = userProfiler.analyzeDesignPreferences(input);
        const emotionalState = userProfiler.analyzeEmotionalState(input, userContext.conversationHistory || []);

        // Создаем или обновляем профиль пользователя
        userProfile = await userProfiler.createPersonalizedProfile(
          userContext.userId || 'anonymous',
          {
            communicationStyle,
            designPreferences,
            emotionalState
          }
        );

        // Генерируем персону на основе анализа
        persona = generatePersonaStylePrompt({
          ...userContext,
          userProfile,
          communicationStyle,
          emotionalState
        });

        return { persona, userProfile };
      })();

      const profilingTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Таймаут профилирования (3 сек)')), 3000);
      });

      const profilingResult = await Promise.race([profilingPromise, profilingTimeoutPromise]);
      persona = profilingResult.persona;
      userProfile = profilingResult.userProfile;

      processingStages.personaGeneration.status = 'success';
      processingStages.personaGeneration.data = { persona, userProfile };
      console.log(`✅ ЭТАП 4: Профилирование успешно завершено`);
    } catch (personaError) {
      processingStages.personaGeneration.status = 'failed';
      processingStages.personaGeneration.error = personaError.message;
      console.log(`❌ ЭТАП 4: Профилирование не удалось (${personaError.message}), используем fallback`);

      // Fallback персона
      persona = {
        style: 'friendly',
        tone: 'helpful',
        approach: 'conversational',
        fallback: true
      };
    }
    processingStages.personaGeneration.duration = Date.now() - personaStartTime;
    console.log(`⏱️ ЭТАП 4: завершен за ${processingStages.personaGeneration.duration}мс`);

    // ===== ЭТАП 5: ПРОВЕРКА НА ЗНАНИЕВЫЕ ЗАПРОСЫ И ОБОГАЩЕНИЕ =====
    console.log('🧠 ЭТАП 5: Анализ на знаниевые запросы...');
    let externalKnowledge = null;

    // Проверяем, является ли запрос знаниевым
    const isKnowledgeRequest = 
      (meta.semanticResult?.semantic_analysis?.semantic_cluster?.name === 'knowledge_request') ||
      (meta.semanticResult?.semantic_analysis?.dialog_category === 'knowledge_sharing') ||
      (meta.semanticResult?.query_type === 'information_request');

    if (isKnowledgeRequest) {
      console.log('📚 ОБНАРУЖЕН ЗНАНИЕВЫЙ ЗАПРОС - активируем внешние знания...');

      try {
        // Динамический импорт для избежания циклических зависимостей
        const externalKnowledgeIntegrator = require('./semantic-memory/external-knowledge-integrator.cjs');

        // Обогащаем запрос внешними знаниями
        externalKnowledge = await externalKnowledgeIntegrator.enrichWithExternalKnowledge(input, {
          userContext,
          semanticContext: meta.semanticResult,
          emotionalContext: emotion
        });

        console.log(`✅ Внешние знания получены: ${externalKnowledge.wikipediaResults?.count || 0} Wikipedia + ${externalKnowledge.scientificResults?.count || 0} научных источников`);

      } catch (knowledgeError) {
        console.log(`⚠️ Ошибка получения внешних знаний: ${knowledgeError.message}`);
        externalKnowledge = null;
      }
    }

    // ===== ЭТАП 6: БИОМИМЕТИЧЕСКИЙ АНАЛИЗ =====
    console.log('🦋 ЭТАП 6: Биомиметический анализ...');
    let biomimeticAnalysis = null;

    if (biomimeticSemantics) {
      try {
        biomimeticAnalysis = await biomimeticSemantics.analyzeWithBiomimetics(input, {
          semanticContext: meta.semanticResult,
          emotionalContext: emotion,
          userContext
        });
        console.log(`✅ Биомиметический анализ завершен (уверенность: ${(biomimeticAnalysis.biomimeticAnalysis.confidence * 100).toFixed(1)}%)`);
      } catch (bioError) {
        console.log(`⚠️ Ошибка биомиметического анализа: ${bioError.message}`);
      }
    }

    // ===== ЭТАП 7: ПОСТРОЕНИЕ МЫСЛИ =====
    console.log('💭 ЭТАП 7: Построение мыслительного процесса...');
    const thought = {
      input,                    // ✅ Сохраняем исходный запрос
      originalInput: input,     // ✅ Дублируем для гарантии
      meta: meta.semanticResult || meta,
      emotion,
      memory,
      persona,
      userProfile,              // ✅ Добавляем профиль пользователя
      context: userContext,
      externalKnowledge,        // ✅ Добавляем внешние знания
      isKnowledgeRequest,       // ✅ Флаг знаниевого запроса
      biomimeticAnalysis        // ✅ Биомиметический анализ
    };

    // ===== ЭТАП 8: ГЕНЕРАЦИЯ ОТВЕТА С СИСТЕМОЙ ВОССТАНОВЛЕНИЯ =====
    console.log('🔄 ЭТАП 8: Итеративная генерация ответа...');
    const responseStartTime = Date.now();
    let rawResponse = null;

    try {
      // Формируем расширенный контекст для генератора
      const generationContext = {
        messages: userContext.conversationHistory || [],
        userProfile: userContext.userProfile,
        sessionId: userContext.sessionId,
        emotionalContext: thought.emotion,
        personaStyle: thought.persona,
        semanticContext: thought.meta,
        memoryContext: thought.memory,
        externalKnowledge: thought.externalKnowledge,  // ✅ Передаем внешние знания
        isKnowledgeRequest: thought.isKnowledgeRequest  // ✅ Флаг типа запроса
      };

      // 🧠 НОВОЕ: Гибридная генерация с Hot Swap поддержкой
      if (neuralIntegration && (routingHints?.useNeural !== false)) {
        console.log('🧠 ИСПОЛЬЗУЕМ ГИБРИДНУЮ ГЕНЕРАЦИЮ: семантика + нейросеть');

        // Проверяем готовность нейросети
        const neuralStatus = neuralIntegration.getStatusForConversationEngine();
        console.log(`🧠 Статус нейросети: ${neuralStatus.mode} (ready: ${neuralStatus.isReady})`);

        // Параллельная генерация с адаптацией
        const [semanticResult, neuralResult] = await Promise.allSettled([
          naturalLanguageGenerator.generateResponse(input, generationContext),
          neuralIntegration.adaptForConversationEngine(input, generationContext)
        ]);

        // Объединяем результаты
        const semanticResponse = semanticResult.status === 'fulfilled' ? semanticResult.value : null;
        const neuralResponse = neuralResult.status === 'fulfilled' ? neuralResult.value : null;

        if (semanticResponse && neuralResponse) {
          // Выбираем лучший ответ с учетом режима нейросети
          const semanticLength = semanticResponse.response?.length || 0;
          const neuralLength = typeof neuralResponse.response === 'string' ? neuralResponse.response.length : 0;

          // Предпочитаем нейросеть в full режиме
          const preferNeural = neuralStatus.mode === 'full' || neuralLength > semanticLength;

          rawResponse = {
            response: preferNeural ? neuralResponse.response : semanticResponse.response,
            confidence: preferNeural ? neuralResponse.confidence : (semanticResponse.confidence || 0.7),
            metadata: {
              ...semanticResponse.metadata,
              generationType: 'neural_semantic_hybrid',
              neuralMode: neuralStatus.mode,
              neuralContribution: neuralLength > 0,
              semanticLength,
              neuralLength,
              preferredSource: preferNeural ? 'neural' : 'semantic'
            }
          };
          console.log(`✅ ГИБРИДНАЯ ГЕНЕРАЦИЯ: ${preferNeural ? 'нейросеть' : 'семантика'} (${neuralStatus.mode})`);
        } else if (semanticResponse) {
          rawResponse = semanticResponse;
          console.log('✅ Используем семантический ответ (нейросеть недоступна)');
        } else if (neuralResponse) {
          rawResponse = {
            response: neuralResponse.response,
            confidence: neuralResponse.confidence,
            metadata: { 
              generationType: 'neural_only',
              neuralMode: neuralStatus.mode
            }
          };
          console.log('✅ Используем нейросетевой ответ (семантика недоступна)');
        } else {
          throw new Error('Ни семантическая, ни нейросетевая генерация не работают');
        }
      } else if (neuralIntegration && neuralIntegration.isInitialized) {
        // Если нейросеть готова, но routing hints не настроены - используем нейросеть
        console.log('🧠 ИСПОЛЬЗУЕМ НЕЙРОСЕТЬ (routing hints не настроены)');
        try {
          const neuralResult = await neuralIntegration.adaptForConversationEngine(input, generationContext);
          rawResponse = {
            response: neuralResult.response,
            confidence: neuralResult.confidence,
            metadata: { 
              generationType: 'neural_fallback',
              neuralMode: neuralIntegration.mode
            }
          };
        } catch (neuralError) {
          console.log('⚠️ Neural fallback failed:', neuralError.message);
          console.log('🧠 ИСПОЛЬЗУЕМ СТАНДАРТНУЮ СЕМАНТИЧЕСКУЮ ГЕНЕРАЦИЮ');
          rawResponse = await naturalLanguageGenerator.generateResponse(input, generationContext);
        }
      } else {
        // Стандартная семантическая генерация
        console.log('🧠 ИСПОЛЬЗУЕМ СТАНДАРТНУЮ СЕМАНТИЧЕСКУЮ ГЕНЕРАЦИЮ');
        rawResponse = await naturalLanguageGenerator.generateResponse(input, generationContext);
      }

      iterationCount++;
      processingStages.responseGeneration.status = 'success';
      processingStages.responseGeneration.data = rawResponse;
      console.log(`✅ ЭТАП 7: Ответ успешно сгенерирован`);
    } catch (responseError) {
      processingStages.responseGeneration.status = 'failed';
      processingStages.responseGeneration.error = responseError.message;
      console.log(`❌ ЭТАП 7: Генерация ответа не удалась`);
      console.log(`❌ Ошибка: ${responseError.message}`);
      console.log(`❌ Стек: ${responseError.stack}`);
      console.log(`❌ Входные данные: ${JSON.stringify({ input: input.substring(0, 100), contextKeys: Object.keys(userContext) })}`);
      console.log(`🔄 Переходим к intelligent fallback генерации...`);

      // Intelligent fallback с сохранением контекста
      rawResponse = await generateContextualFallback(input, thought, userContext);
      iterationCount++;
    }
    processingStages.responseGeneration.duration = Date.now() - responseStartTime;
    console.log(`⏱️ ЭТАП 7: завершен за ${processingStages.responseGeneration.duration}мс`);

    // ===== ЭТАП 9: ОЦЕНКА КАЧЕСТВА И РЕФИНИРОВАНИЕ =====
    console.log('✨ ЭТАП 9: Оценка качества и рефинирование...');
    let responseQuality = semanticQualityScore(rawResponse.response, thought.meta);

    // Итеративное улучшение (как в GPT-4)
    while (responseQuality < 7 && iterationCount < 3) {
      console.log(`🔄 Качество ${responseQuality}/10 недостаточно, улучшаем... (итерация ${iterationCount})`);

      // Добавить проверку на улучшение
      const previousQuality = responseQuality;

      const refinedThought = await refineResponse(thought, rawResponse, responseQuality);
      rawResponse = await naturalLanguageGenerator.generateResponse(
        input,  // ✅ ИСПРАВЛЕНО: передаем исходный запрос
        {
          ...refinedThought.context,
          refinedThought: true,
          previousQuality: responseQuality,
          iterationCount,
          semanticContext: refinedThought.meta || thought.meta,
          memoryContext: refinedThought.memory || thought.memory
        }
      );

      const newQuality = semanticQualityScore(rawResponse.response, thought.meta);

      // Если качество не улучшается, прерываем цикл
      if (newQuality <= previousQuality + 0.1) {
        console.log(`🛑 Качество не улучшается (${newQuality} <= ${previousQuality + 0.1}), прерываем цикл`);
        break;
      }

      responseQuality = newQuality;
      iterationCount++;
    }

    // ===== ЭТАП 10: ФИНАЛЬНАЯ ВАЛИДАЦИЯ И АДАПТАЦИЯ =====
    console.log('🎯 ЭТАП 10: Финальная валидация и персонализация...');
    let finalResponse;
    try {
      // Сначала адаптируем ответ под профиль пользователя
      let adaptedResponse = rawResponse.response;
      if (userProfile && typeof userProfiler.adaptResponseToProfile === 'function') {
        try {
          adaptedResponse = userProfiler.adaptResponseToProfile(
            rawResponse.response,
            userProfile,
            thought.emotion
          );
          console.log('✅ Ответ адаптирован под профиль пользователя');
        } catch (adaptError) {
          console.log('⚠️ Не удалось адаптировать ответ:', adaptError.message);
        }
      }

      // Затем выполняем мета-валидацию
      if (metaSemanticEngine && typeof metaSemanticEngine.performMetaSemanticAnalysis === 'function') {
        const metaValidation = await metaSemanticEngine.performMetaSemanticAnalysis(
          input,
          thought.meta,
          {
            originalInput: input,
            processingSteps: ['meta', 'emotion', 'memory', 'persona', 'generation', 'refinement', 'adaptation'],
            qualityScore: responseQuality
          }
        );
        finalResponse = {
          validatedResponse: adaptedResponse,
          confidence: metaValidation.confidence || rawResponse.confidence || 0.8,
          metaAnalysis: metaValidation
        };
      } else {
        // Fallback валидация без мета-анализа
        finalResponse = {
          validatedResponse: adaptedResponse,
          confidence: rawResponse.confidence || 0.8,
          metaAnalysis: null
        };
      }
    } catch (validationError) {
      console.log('⚠️ Мета-валидация недоступна:', validationError.message);
      finalResponse = {
        validatedResponse: rawResponse.response,
        confidence: rawResponse.confidence || 0.8,
        metaAnalysis: null
      };
    }

    // ===== ЭТАП 11: АВТОНОМНОЕ ОБУЧЕНИЕ =====
    console.log('🎓 ЭТАП 11: Автономное обучение...');
    let learningUpdated = false;
    try {
      // Используем правильный метод learnFromInteraction
      await autonomousLearningEngine.learnFromInteraction({
        userQuery: input,
        response: finalResponse.validatedResponse || rawResponse.response,
        timestamp: Date.now(),
        userEngagement: finalResponse.confidence || rawResponse.confidence || 0.8,
        query: input
      }, {
        semanticAnalysis: thought.meta,
        qualityScore: responseQuality,
        userContext: userContext,
        biomimeticInsights: thought.biomimeticAnalysis
      });
      learningUpdated = true;
    } catch (learningError) {
      console.log('⚠️ Автономное обучение временно недоступно:', learningError.message);
    }

    // ===== ЭТАП 12: ПРЕДИКТИВНЫЕ ПРЕДЛОЖЕНИЯ =====
    console.log('🔮 ЭТАП 12: Предиктивная система...');
    let predictionsGenerated = false;
    try {
      // Используем правильный метод predict
      await predictiveSystem.predict(userContext.userId || 'anonymous', {
        type: 'conversation',
        timestamp: Date.now()
      }, {
        type: 'conversation',
        query: input,
        response: finalResponse.validatedResponse || rawResponse.response,
        projectId: userContext.projectId,
        phase: thought.meta?.phase || 'general'
      });
      predictionsGenerated = true;
    } catch (predictionError) {
      console.log('⚠️ Предиктивная система временно недоступна:', predictionError.message);
    }

    const processingTime = Date.now() - startTime;

    // ===== СИСТЕМА ВОССТАНОВЛЕНИЯ: Анализ успешности =====
    const successfulStages = Object.values(processingStages).filter(stage => stage.status === 'success').length;
    const totalStages = Object.keys(processingStages).length;
    const systemHealthScore = (successfulStages / totalStages) * 100;

    console.log(`📊 СИСТЕМА ВОССТАНОВЛЕНИЯ: ${successfulStages}/${totalStages} этапов успешно (${systemHealthScore.toFixed(1)}%)`);

    // Детальный отчет по этапам
    Object.entries(processingStages).forEach(([stageName, stage]) => {
      const statusIcon = stage.status === 'success' ? '✅' : stage.status === 'failed' ? '❌' : '⏳';
      console.log(`${statusIcon} ${stageName}: ${stage.status} (${stage.duration}мс)${stage.error ? ` - ${stage.error}` : ''}`);
    });

    console.log(`🧠 СОЗНАНИЕ ЗАВЕРШИЛО ОБРАБОТКУ за ${processingTime}мс (${iterationCount} итераций, здоровье: ${systemHealthScore.toFixed(1)}%)`);

    return {
      reply: finalResponse.validatedResponse || rawResponse.response,
      confidence: finalResponse.confidence || rawResponse.confidence || 0.8,
      quality: responseQuality,
      metadata: {
        modulesUsed: Object.keys(thought.memory || {}).concat(['meta', 'emotion', 'persona']),
        processingTime,
        iterationCount,
        semanticDepth: thought.meta?.semantic_depth_level || 1,
        learningUpdated,
        predictionsGenerated,
        // ===== НОВЫЕ МЕТРИКИ СИСТЕМЫ ВОССТАНОВЛЕНИЯ =====
        systemHealth: {
          score: systemHealthScore,
          successfulStages: successfulStages,
          totalStages: totalStages,
          stageDetails: processingStages
        }
      }
    };

  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА МОДУЛЯ СОЗНАНИЯ:', error);
    console.error('❌ Стек ошибки:', error.stack);
    console.error('❌ Входные данные:', { 
      input: input.substring(0, 100), 
      userContextKeys: Object.keys(userContext),
      userId: userContext.userId,
      sessionId: userContext.sessionId,
      timestamp: new Date().toISOString()
    });

    // Более детальная информация об ошибке
    let stage = 'unknown';
    if (error.message.includes('analyzeEmotionalContext')) stage = 'emotional-analysis';
    if (error.message.includes('analyzeCompleteRequest')) stage = 'semantic-memory';
    if (error.message.includes('generateResponse')) stage = 'response-generation';
    if (error.message.includes('generatePersonaStylePrompt')) stage = 'persona-generation';

    console.error(`❌ Этап ошибки: ${stage}`);

    // 🧠 EMERGENCY: Попытка использовать нейросеть в случае критической ошибки
    if (neuralResponse && neuralResponse.length > 20) {
      console.log('🚨 Используем neural emergency response');
      return {
        reply: neuralResponse,
        confidence: 0.7,
        quality: 6,
        metadata: {
          modulesUsed: ['neural-emergency'],
          processingTime: Date.now() - startTime,
          iterationCount: 0,
          semanticDepth: 0,
          learningUpdated: false,
          predictionsGenerated: false,
          emergencyMode: true,
          provider: 'BOOOMERANGS-Neural-Emergency'
        }
      };
    }

    // Fallback для критических ошибок
    return {
      reply: `Извините, произошла внутренняя ошибка в системе сознания. Модули семантики временно недоступны. Попробуйте переформулировать запрос.`,
      confidence: 0.1,
      quality: 1,
      metadata: {
        modulesUsed: ['fallback'],
        processingTime: Date.now() - startTime,
        iterationCount: 0,
        semanticDepth: 0,
        learningUpdated: false,
        predictionsGenerated: false
      }
    };
  }
};

/**
 * EXPRESS ENDPOINT для REST API
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const chatEndpoint = async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Поле message обязательно для заполнения'
      });
    }

    const result = await processUserInput(message, context);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ Ошибка в chat endpoint:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      message: error.message
    });
  }
};

/**
 * WEBSOCKET ОБРАБОТЧИК для real-time чата
 * @param {Object} ws - WebSocket соединение
 * @param {string} message - Сообщение
 */
const handleWebSocketMessage = async (ws, message) => {
  try {
    const { input, context = {} } = JSON.parse(message);

    if (!input) {
      ws.send(JSON.stringify({
        error: 'Поле input обязательно для заполнения'
      }));
      return;
    }

    // Отправляем статус начала обработки
    ws.send(JSON.stringify({
      type: 'processing_start',
      message: 'Активация модуля сознания...'
    }));

    const result = await processUserInput(input, context);

    // Отправляем финальный результат
    ws.send(JSON.stringify({
      type: 'response',
      ...result
    }));

  } catch (error) {
    console.error('❌ Ошибка в WebSocket обработчике:', error);
    ws.send(JSON.stringify({
      type: 'error',
      error: 'Внутренняя ошибка сервера',
      message: error.message
    }));
  }
};

/**
 * КОНТЕКСТУАЛЬНЫЙ FALLBACK ГЕНЕРАТОР с сохранением качества ответов
 * @param {string} input - Пользовательский ввод
 * @param {Object} thought - Объект мысли с контекстом
 * @param {Object} userContext - Контекст пользователя
 * @returns {Object} Contextual ответ в формате response object
 */
const generateContextualFallback = async (input, thought, userContext) => {
  console.log('🧠 АКТИВАЦИЯ КОНТЕКСТУАЛЬНОГО FALLBACK ГЕНЕРАТОРА');  try {
    // Пытаемся использовать доступные семантические данные
    const availableContext = {
      query: input,
      emotion: thought.emotion?.primary_emotion || 'neutral',
      intent: thought.meta?.semanticResult?.intent || 'general',
      hasExternalKnowledge: thought.externalKnowledge ? true : false,
      isKnowledgeRequest: thought.isKnowledgeRequest || false
    };

    console.log('🔍 Доступный контекст для fallback:', availableContext);

    // Если это знаниевый запрос с внешними данными
    if (availableContext.isKnowledgeRequest && thought.externalKnowledge) {
      console.log('📚 Генерируем ответ на основе внешних знаний');
      return await generateKnowledgeBasedResponse(input, thought.externalKnowledge, availableContext);
    }

    // ГИБРИДНАЯ СИСТЕМА: Семантика + Нейросеть
    console.log('🧠 АКТИВИРУЕМ ГИБРИДНУЮ AI СИСТЕМУ');

    // Сначала пробуем нейросеть для сложных запросов
    if (neuralIntegration && (input.length > 50 || availableContext.isKnowledgeRequest)) {
      try {
        console.log('🧠 Используем нейросеть для сложного запроса');

        const neuralResponse = await neuralIntegration.generateHybridResponse(input, {
          semanticContext: thought?.semanticResult,
          emotionalContext: thought.emotion,
          externalKnowledge: thought.externalKnowledge,
          userContext: userContext
        });

        if (neuralResponse && neuralResponse.length > 100) {
          console.log('✅ Нейросеть сгенерировала качественный ответ');
          return {
            response: neuralResponse,
            confidence: 0.9,
            metadata: {
              approach: 'neural_generation',
              semanticDepth: 'neural_processing',
              generationType: 'hybrid_neural'
            }
          };
        }
      } catch (neuralError) {
        console.log('⚠️ Нейросеть недоступна:', neuralError.message);
      }
    }

    // Fallback к семантическому генератору
    try {
      const { naturalLanguageGenerator } = require('./semantic-memory/index.cjs');

      if (naturalLanguageGenerator && typeof naturalLanguageGenerator.generateResponse === 'function') {
        console.log('✅ Используем семантический генератор');

        const generationContext = {
          semanticContext: thought?.semanticResult,
          emotionalContext: thought.emotion,
          externalKnowledge: thought.externalKnowledge,
          isKnowledgeRequest: availableContext.isKnowledgeRequest,
          userContext: userContext
        };

        const aiResponse = await naturalLanguageGenerator.generateResponse(input, generationContext);

        return {
          response: aiResponse.response,
          confidence: aiResponse.confidence || 0.8,
          metadata: {
            approach: 'semantic_generation',
            semanticDepth: aiResponse.semanticDepth || 'high',
            generationType: 'semantic_processor'
          }
        };
      }
    } catch (generatorError) {
      console.log('⚠️ Семантический генератор недоступен:', generatorError.message);
    }

    // Fallback только если локальный генератор недоступен  
    console.log('💬 Используем fallback генерацию');
    return generateQualityGeneralResponse(input, availableContext);

  } catch (error) {
    console.log(`❌ Ошибка контекстуального fallback: ${error.message}`);
    return generateMinimalResponse(input);
  }
};

/**
 * Генерация ответа на основе внешних знаний
 */
async function generateKnowledgeBasedResponse(input, externalKnowledge, context) {
  let response = '';

  if (externalKnowledge.searchResults && externalKnowledge.searchResults.length > 0) {
    const firstResult = externalKnowledge.searchResults[0];
    response = `Вот что я нашел по вашему запросу:\n\n`;
    response += `${firstResult.snippet || firstResult.title || 'Информация найдена'}\n\n`;

    if (externalKnowledge.searchResults.length > 1) {
      response += `Есть еще ${externalKnowledge.searchResults.length - 1} источников с дополнительной информацией.`;
    }
  } else {
    response = `Ищу информацию по вашему запросу "${input}". К сожалению, подробные данные сейчас недоступны, но я готов обсудить эту тему на основе общих знаний.`;
  }

  return {
    response: response,
    confidence: 0.8,
    metadata: { 
      approach: 'knowledge_based_fallback',
      hasExternalData: true,
      sourcesCount: externalKnowledge.searchResults?.length || 0
    }
  };
}

/**
 * Генерация ответа на основе семантического анализа
 */
async function generateSemanticBasedResponse(input, semanticResult, context) {
  const intent = semanticResult.intent || 'general';
  const confidence = semanticResult.confidence || 0.5;
  const inputLower = input.toLowerCase();

  let response = '';

  // СПЕЦИАЛИЗИРОВАННЫЕ ОТВЕТЫ НА ОСНОВЕ АНАЛИЗА ЗАПРОСА

  // Запросы о возможностях и функционале
  if (inputLower.includes('что') && (inputLower.includes('умеешь') || inputLower.includes('можешь'))) {
    response = "Я BOOOMERANGS AI - автономная семантическая система! Мои возможности:\n\n" +
               "🎨 Генерация изображений в любых стилях\n" +
               "📐 Векторизация растровых изображений в SVG\n" +
               "🧵 Конвертация в форматы вышивки (DST, PES, JEF)\n" +
               "🧠 Интеллектуальные консультации по дизайну\n" +
               "🔍 Поиск информации в интернете\n" +
               "💡 Семантический анализ через 50+ модулей\n\n" +
               "Моя автономная система работает без внешних зависимостей!";
  }

  // Вопросы о вышивке и форматах
  else if (inputLower.includes('вышив') || inputLower.includes('формат') || inputLower.includes('стил')) {
    response = "Отлично! Я специализируюсь на вышивальных форматах:\n\n" +
               "📁 Поддерживаемые форматы:\n" +
               "• DST - основной формат для большинства машин\n" +
               "• PES - Brother, Babylock, Bernina\n" +
               "• JEF - Janome, Elna, Kenmore\n" +
               "• EXP - Melco, Bernina\n" +
               "• VP3 - Husqvarna Viking\n\n" +
               "🎨 Стили вышивки:\n" +
               "• Сатиновый стежок для заливки\n" +
               "• Бэкстич для контуров\n" +
               "• Французские узелки для текстуры\n" +
               "• Ришелье для ажурных работ\n\n" +
               "Загружайте изображение, и я создам файл для вышивки!";
  }

  // Запросы о генерации изображений
  else if (inputLower.includes('создай') || inputLower.includes('сгенерируй') || inputLower.includes('нарисуй') || inputLower.includes('изображени')) {
    response = "Превосходно! Моя система генерации создает уникальные изображения:\n\n" +
               "🎨 Доступные стили:\n" +
               "• Реалистичный - фотографическое качество\n" +
               "• Художественный - живописные эффекты\n" +
               "• Аниме - японский стиль анимации\n" +
               "• Минималистичный - простые формы\n" +
               "• Абстрактный - современное искусство\n\n" +
               "📐 Параметры:\n" +
               "• Разрешение до 1024x1024\n" +
               "• Настройка цветовой палитры\n" +
               "• Контроль композиции\n\n" +
               "Опишите детально что создать, и я сгенерирую для вас!";
  }

  // Запросы о векторизации
  else if (inputLower.includes('векторизац') || inputLower.includes('svg') || inputLower.includes('вектор')) {
    response = "Отлично! Моя система векторизации преобразует любые изображения:\n\n" +
               "🔧 Возможности векторизации:\n" +
               "• Автоматическая трассировка контуров\n" +
               "• Оптимизация цветовой палитры до 15 цветов\n" +
               "• Создание масштабируемых SVG файлов\n" +
               "• Сглаживание и упрощение путей\n\n" +
               "📊 Преимущества:\n" +
               "• Бесконечное масштабирование без потери качества\n" +
               "• Малый размер файлов\n" +
               "• Совместимость с Adobe Illustrator\n" +
               "• Готовность к печати и вышивке\n\n" +
               "Загружайте растровое изображение или дайте ссылку!";
  }

  // Консультационные запросы
  else if (inputLower.includes('помоги') || inputLower.includes('совет') || inputLower.includes('рекоменд') || inputLower.includes('выбор')) {
    response = "Конечно помогу! Моя семантическая система анализирует контекст:\n\n" +
               "💡 Консультации по:\n" +
               "• Выбору цветовых схем и палитр\n" +
               "• Композиции и стилистике дизайна\n" +
               "• Оптимизации для печати и вышивки\n" +
               "• Техническим параметрам проектов\n\n" +
               "🔍 Мой подход:\n" +
               "• Анализ через 50+ семантических модулей\n" +
               "• Учет контекста и предпочтений\n" +
               "• Персонализированные рекомендации\n\n" +
               "Расскажите подробнее о вашем проекте!";
  }

  // Стандартная обработка по интенту
  else {
    switch (intent) {
      case 'greeting':
        response = "Привет! Я BOOOMERANGS AI - ваш автономный помощник с семантической системой. Готов помочь с генерацией изображений, векторизацией и дизайн-консультациями!";
        break;
      case 'question':
        // ИСПРАВЛЕНО: Анализируем вопрос и даем конкретный ответ
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('муравей')) {
          response = `Муравей - удивительное насекомое! 🐜

**Основные факты:**
• Муравьи живут колониями от нескольких сотен до миллионов особей
• Существует более 15,000 видов муравьев по всему миру
• Могут поднимать вес в 10-50 раз больше собственного
• Общаются с помощью феромонов - химических сигналов

**Интересные способности:**
• Строят сложные подземные города
• Ведут сельское хозяйство (выращивают грибы)
• Координируют действия без центрального управления
• Живут в среднем 1-3 года (матки до 30 лет)

Муравьи - одни из самых социально развитых существ на планете!`;
        } else if (lowerInput.includes('вода')) {
          response = `Вода - основа всей жизни на Земле! 💧

**Химические свойства:**
• Формула H₂O - два атома водорода и один кислорода
• Температура кипения: 100°C, замерзания: 0°C
• Универсальный растворитель

**Роль в природе:**
• Покрывает 71% поверхности Земли
• 97% - соленая вода океанов, 3% - пресная вода
• Участвует во всех биологических процессах

**Значение для человека:**
• Составляет 60-70% массы тела
• Необходима для всех метаболических процессов
• Регулирует температуру тела

Без воды жизнь невозможна!`;
        } else if (lowerInput.includes('погода') && lowerInput.includes('москв')) {
          response = `Для получения актуальной погоды в Москве рекомендую проверить метеосводки! 🌤️

**Климат Москвы:**
• Умеренно-континентальный климат
• Зима: -6°C до -10°C (декабрь-февраль)
• Лето: +18°C до +24°C (июнь-август)

**Характерные особенности:**
• Снег обычно с ноября по март
• Самый холодный месяц - январь
• Самый теплый - июль

Для точного прогноза советую gismeteo.ru или yandex.ru/pogoda!`;
        } else if (lowerInput.includes('трава')) {
          response = `Трава - это большая группа растений семейства злаковых! 🌱

**Основные характеристики:**
• Узкие длинные листья
• Мочковатая корневая система
• Быстрый рост и восстановление
• Образует дернину

**Типы трав:**
• **Культурные злаки** - пшеница, рис, кукуруза
• **Газонные травы** - мятлик, овсяница, райграс
• **Луговые травы** - тимофеевка, клевер
• **Декоративные** - пампасная трава, мискантус

**Экологическое значение:**
• Предотвращает эрозию почвы
• Поглощает углекислый газ
• Создает кислород
• Служит пищей для животных

Травы - основа большинства экосистем планеты!`;
        } else if (lowerInput.includes('любовь')) {
          response = `Любовь - одно из самых сложных и прекрасных человеческих чувств! ❤️

**Типы любви:**
• **Эрос** - страстная романтическая любовь
• **Филия** - дружеская любовь и привязанность
• **Сторге** - семейная любовь
• **Агапе** - безусловная любовь и забота

**Психология любви:**
• Активирует центры удовольствия в мозге
• Выделяются гормоны: дофамин, окситоцин, серотонин
• Влияет на принятие решений и поведение
• Может быть как источником счастья, так и страданий

**Проявления любви:**
• Забота и внимание к другому
• Желание делиться радостями и печалями
• Готовность к компромиссам и жертвам
• Стремление к близости и пониманию

Любовь делает нашу жизнь более яркой и наполненной смыслом!`;
        } else {
          // Общий ответ для других вопросов
          response = `Хороший вопрос! Моя семантическая система BOOOMERANGS готова обсуждать любые темы.

Я специализируюсь на:
🎨 Творческих задачах и дизайне
🧠 Объяснении сложных концепций
🌍 Знаниях о мире и науке
💡 Решении практических проблем

${input.includes('?') ? 'Уточните что именно вас интересует, и я дам развернутый ответ!' : 'Готов предоставить детальную информацию по вашему запросу.'}`;
        }
        break;
      case 'help_request':
        response = "Обязательно помогу! Моя автономная система специализируется на творческих задачах. Опишите что нужно - создать, векторизовать или получить консультацию.";
        break;
      default:
        response = `Понимаю ваш запрос. Готов обсудить эту тему подробнее!`;
        break;
    }
  }

  return {
    response: response,
    confidence: Math.max(confidence, 0.6),
    metadata: { 
      approach: 'semantic_based_fallback',
      detectedIntent: intent,
      semanticConfidence: confidence
    }
  };
}

/**
 * Качественный общий ответ
 */
function generateQualityGeneralResponse(input, context) {
  inputLower = input.toLowerCase();
  response = '';

  if (inputLower.includes('привет') || inputLower.includes('здравств')) {
    response = "Привет! Приятно познакомиться. Я готов помочь с различными задачами!";
  } else if (inputLower.includes('спасибо')) {
    response = "Пожалуйста! Рад быть полезным. Если есть еще вопросы - обращайтесь!";
  } else if (inputLower.includes('?')) {
    // ИСПРАВЛЕНО: Анализируем конкретные вопросы
    if (inputLower.includes('что такое') || inputLower.includes('чьо такое') || inputLower.includes('что это')) {
      response = "Готов объяснить! Уточните что именно вас интересует - я дам подробный ответ с примерами и фактами.";
    } else {
      response = "Интересный вопрос! Готов обсудить это подробнее. Что именно вас интересует?";
    }
  } else {
    response = "Понял! Готов помочь и обсудить эту тему. Расскажите больше деталей.";
  }

  return {
    response: response,
    confidence: 0.7,
    metadata: { 
      approach: 'quality_general_fallback',
      emotion: context.emotion
    }
  };
}

/**
 * Минимальный ответ для критических ситуаций
 */
function generateMinimalResponse(input) {
  return {
    response: "Извините, произошла техническая ошибка. Попробуйте переформулировать запрос.",
    confidence: 0.3,
    metadata: { approach: 'minimal_emergency_fallback' }
  };
}

/**
 * ПРОСТОЙ FALLBACK ГЕНЕРАТОР для критических ситуаций
 * @param {string} input - Пользовательский ввод
 * @returns {string} Fallback ответ
 */
const generateFallbackResponse = (input) => {
  const lowerInput = input.toLowerCase();

  // Приветствие
  if (lowerInput.includes('привет') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Привет! Я BOOOMERANGS AI - ваш интеллектуальный помощник. Система сознания работает в упрощенном режиме, но я готов помочь! Чем могу быть полезен?";
  }

  // Вопросы о системе
  if (lowerInput.includes('кто ты') || lowerInput.includes('что ты')) {
    return "Я BOOOMERANGS AI - продвинутая система искусственного интеллекта с семантической обработкой. В данный момент работаю в режиме восстановления, но готов общаться и помогать с различными задачами!";
  }

  // Возможности
  if (lowerInput.includes('что ты умеешь') || lowerInput.includes('возможности')) {
    return "Даже в режиме восстановления я могу: общаться на любые темы, помогать с творческими задачами, отвечать на вопросы, поддерживать интересную беседу. Полная семантическая система скоро будет восстановлена!";
  }

  // Общие вопросы
  if (lowerInput.includes('как дела') || lowerInput.includes('что нового')) {
    return "Дела идут хорошо! Система сознания BOOOMERANGS восстанавливается. Семантические модули проходят диагностику. Я все еще готов помочь и пообщаться!";
  }

  // Помощь
  if (lowerInput.includes('помоги') || lowerInput.includes('help')) {
    return "Конечно, помогу! Хотя система работает в упрощенном режиме, я готов обсудить ваш вопрос и предложить решения. Расскажите подробнее, что вас интересует?";
  }

  // ИСПРАВЛЕНО: Анализируем запрос и даем конкретный ответ
  if (lowerInput.includes('что такое') || lowerInput.includes('чьо такое')) {
    return "Готов рассказать! Система BOOOMERANGS может объяснить практически любую тему. Уточните что именно хотите узнать - дам развернутый ответ с фактами и примерами.";
  }

  // Универсальный ответ
  return "Понял ваш запрос! Система BOOOMERANGS готова помочь и обсудить эту тему. Расскажите подробнее что вас интересует - постараюсь дать полезный ответ!";
};

// ✅ ИСПРАВЛЕНО: Улучшенная проверка инициализации модулей с таймаутами
const initializeSemanticModules = async () => {
  const initializationPromises = [];

  // Проверяем доступность системы
  if (!semanticMemory || typeof semanticMemory.analyzeCompleteRequest !== 'function') {
    console.error('❌ CRITICAL: Семантическая память не инициализирована');
    throw new Error('CRITICAL: Семантическая память не инициализирована');
  }

  // Проверяем и инициализируем критичные модули с таймаутами
  try {
    if (naturalLanguageGenerator && !naturalLanguageGenerator.isAvailable()) {
      console.log('⚠️ Генератор естественного языка не готов, инициализируем...');
      const nlgPromise = Promise.race([
        naturalLanguageGenerator.initialize(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Таймаут инициализации NLG')), 2000))
      ]).catch(error => {
        console.error('❌ Не удалось инициализировать NLG:', error.message);
      });
      initializationPromises.push(nlgPromise);
    }

    if (metaSemanticEngine && !metaSemanticEngine.isAvailable()) {
      console.log('⚠️ Мета-семантический движок не готов, инициализируем...');
      const metaPromise = Promise.race([
        metaSemanticEngine.initialize(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Таймаут инициализации Meta')), 2000))
      ]).catch(error => {
        console.error('❌ Не удалось инициализировать Meta-движок:', error.message);
      });
      initializationPromises.push(metaPromise);
    }

    // Ждем завершения инициализации (но не более 5 секунд)
    if (initializationPromises.length > 0) {
      try {
        await Promise.all(initializationPromises);
        console.log('✅ Все модули семантической памяти инициализированы');
      } catch (error) {
        console.error(`❌ Ошибка инициализации модулей: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`❌ Ошибка инициализации модулей: ${error.message}`);
  }
};

/**
 * Intelligent Fallback
 * @param {string} userInput - The input from the user
 * @param {Object} options - Options object
 * @param {Object} options.userProfile - User profile
 * @param {string} options.sessionId - Session ID
 */
const generateIntelligentFallback = async (userInput, options = {}) => {
  try {
    const { globalNaturalLanguageGenerator } = require('./semantic-memory/index.cjs');
    const fallbackResponse = await globalNaturalLanguageGenerator.generateResponse(userInput, {
      fallbackMode: true,
      userProfile: options.userProfile,
      sessionId: options.sessionId
    });

    if (fallbackResponse && fallbackResponse.response) {
      return {
        reply: fallbackResponse.response,
        confidence: 0.5,
        quality: 3,
        metadata: {
          fallback: true,
          fallbackSource: 'naturalLanguageGenerator'
        }
      };
    } else {
      return {
        reply: "Извините, произошла техническая ошибка. Попробуйте переформулировать запрос.",
        confidence: 0.1,
        quality: 1,
        metadata: {
          fallback: true,
          error: 'No response from fallback generator'
        }
      };
    }
  } catch (error) {
      console.error('❌ Ошибка обработки запроса:', error);

      // Попытка получить ответ через резервную систему
      try {
        const { globalNaturalLanguageGenerator } = require('./semantic-memory/index.cjs');
        fallbackResponse = await globalNaturalLanguageGenerator.generateResponse(userInput, {
          fallbackMode: true,
          userProfile: options.userProfile,
          sessionId: options.sessionId
        });

        if (fallbackResponse && fallbackResponse.response) {
          return {
            reply: fallbackResponse.response,
            confidence: 0.5,
            quality: 3,
            metadata: {
              fallback: true,
              fallbackSource: 'naturalLanguageGenerator',
              error: error.message
            }
          };
        }
      } catch (fallbackError) {
        console.error('❌ Ошибка резервной системы:', fallbackError);
      }

      // Последний fallback к простому ответу без шаблонов
      const topics = ['творчестве', 'технологиях', 'науке', 'искусстве', 'бизнесе'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      return {
        reply: `Давайте поговорим о ${randomTopic}! Что вас интересует в этой области?`,
        confidence: 0.2,
        quality: 2,
        metadata: {
          fallback: true,
          fallbackType: 'simple',
          error: error.message
        }
      };
    }
};

/**
 * Compatibility метод generateResponse для совместимости с семантическим провайдером
 * Обертка вокруг processUserInput для стандартизированного интерфейса
 * @param {string} userQuery - Запрос пользователя
 * @param {Object} options - Дополнительные параметры
 * @returns {Promise<Object>} - Результат обработки
 */
const generateResponse = async (userQuery, options = {}) => {
  try {
    console.log('🔄 generateResponse: Вызов compatibility wrapper');

    // Преобразуем options в userContext
    const userContext = {
      sessionId: options.sessionId || 'default',
      userId: options.userId || 'anonymous',
      tone: options.tone || 'friendly',
      useSemantics: options.useSemantics !== false,
      ...options
    };

    // Вызываем основную функцию processUserInput
    result = await processUserInput(userQuery, userContext);

    if (result && result.reply) {
      console.log('✅ generateResponse: Успешный вызов processUserInput');
      return {
        response: result.reply,
        confidence: result.confidence,
        quality: result.quality,
        metadata: result.metadata
      };
    } else {
      console.log('⚠️ generateResponse: processUserInput вернул некорректный результат');
      return {
        response: 'Извините, произошла ошибка при обработке запроса.',
        confidence: 0.3,
        quality: 5,
        metadata: { method: 'fallback' }
      };
    }

  } catch (error) {
    console.error('❌ generateResponse error:', error);
    return {
      response: 'Произошла техническая ошибка. Попробуйте еще раз.',
      confidence: 0.2,
      quality: 3,
      metadata: { method: 'error', error: error.message }
    };
  }
};

module.exports = {
  processUserInput,
  generateResponse, // Новый compatibility метод
  chatEndpoint,
  handleWebSocketMessage,
  generateFallbackResponse,
  generateIntelligentFallback
};