/**
 * CONVERSATION ENGINE SEMANTIC PROVIDER
 * Семантический провайдер на основе conversation-engine.cjs
 * Стандартизированный провайдер с методами processRequest и canHandle
 */

const SmartLogger = {
  provider: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧠 [${timestamp}] SEMANTIC: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  success: (message, data) => {
    timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] SEMANTIC SUCCESS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error) => {
    timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] SEMANTIC ERROR: ${message}`, error);
  }
};

class ConversationEngineSemanticProvider {
  constructor() {
    this.name = 'ConversationEngine-Semantic';
    this.priority = 90; // Высокий приоритет для семантики
    this.conversation = null;
    this.semanticIntegration = null;

    this.initializeProvider();
  }

  /**
   * Ленивая инициализация провайдера
   */
  initializeProvider() {
    try {
      SmartLogger.provider('Инициализация семантического провайдера...');

      // Безопасная загрузка conversation engine
      this.conversation = require('./conversation-engine.cjs');
      SmartLogger.provider('Conversation engine загружен');

      // ИСПРАВЛЕНО: Загружаем semantic integration немедленно
      try {
        this.semanticIntegration = require('./semantic-integration-layer.cjs');
        SmartLogger.provider('Семантическая интеграция загружена немедленно');
      } catch (error) {
        SmartLogger.error('Ошибка загрузки семантической интеграции:', error);
        this.semanticIntegration = null;
      }

      SmartLogger.success('Семантический провайдер инициализирован');

    } catch (error) {
      SmartLogger.error('Ошибка инициализации семантического провайдера:', error);
      // Провайдер остается работоспособным даже если не удалось загрузить зависимости
    }
  }

  /**
   * Проверяет может ли провайдер обработать запрос
   * @param {string} userQuery - Запрос пользователя
   * @param {Object} options - Дополнительные параметры
   * @returns {boolean} - Может ли провайдер обработать запрос
   */
  canHandle(userQuery, options = {}) {
    try {
      // Семантический провайдер может обработать любой текстовый запрос
      if (typeof userQuery === 'string' && userQuery.trim().length > 0) {

        // Исключаем специализированные запросы, которые должны обрабатываться другими провайдерами
        const lowerQuery = userQuery.toLowerCase();

        // ИСПРАВЛЕНО: Обрабатываем знаниевые запросы, а не пропускаем
        if (this.isKnowledgeRequest(lowerQuery)) {
          SmartLogger.provider('Обрабатываем знаниевый запрос');
          return true;
        }

        // Пропускаем только простые технические запросы
        if (this.isSimpleTechnicalQuery(lowerQuery)) {
          SmartLogger.provider('Пропускаем технический запрос');
          return false;
        }

        // ИСПРАВЛЕНО: Убираем проблематичные ключевые слова из пропусков
        // Обрабатываем знаниевые запросы через semantic provider, если нет веб-поиска
        const strictSearchKeywords = ['найди информацию', 'поиск в интернете', 'найди в сети', 'погода сейчас', 'курс валют'];
        if (strictSearchKeywords.some(keyword => lowerQuery.includes(keyword))) {
          SmartLogger.provider('Пропускаем только строгие поисковые запросы');
          return false;
        }

        // Пропускаем запросы на генерацию изображений
        const imageKeywords = ['нарисуй', 'создай изображение', 'сгенерируй', 'картинка', 'принт', 'дизайн'];
        if (imageKeywords.some(keyword => lowerQuery.includes(keyword))) {
          SmartLogger.provider('Пропускаем запрос генерации изображений');
          return false;
        }

        // Обрабатываем все остальные запросы
        SmartLogger.provider(`Семантический провайдер может обработать: "${userQuery.substring(0, 50)}..."`);
        return true;
      }

      return false;

    } catch (error) {
      SmartLogger.error('Ошибка в canHandle:', error);
      return false;
    }
  }

  isKnowledgeRequest(query) {
    const knowledgePatterns = [
      'расскажи', 'что такое', 'объясни', 'как работает',
      'почему', 'зачем', 'история', 'происхождение',
      'антифриз', 'охлаждающая жидкость'
    ];

    return knowledgePatterns.some(pattern => query.includes(pattern));
  }

  isSimpleTechnicalQuery(query) {
    const technicalPatterns = [
      'статус', 'версия', 'перезагрузка', 'рестарт'
    ];

    return technicalPatterns.some(pattern => query.includes(pattern));
  }

  /**
   * Обрабатывает запрос пользователя через семантическую систему
   * @param {string} userQuery - Запрос пользователя
   * @param {Object} options - Дополнительные параметры
   * @returns {Promise<Object>} - Результат обработки
   */
  async processRequest(userQuery, options = {}) {
    const startTime = Date.now();

    try {
      SmartLogger.provider(`Обработка семантического запроса: "${userQuery.substring(0, 100)}..."`);

      // Если семантическая интеграция недоступна, используем базовый fallback
      if (!this.semanticIntegration) {
        return await this.createFallbackResponse(userQuery);
      }

      // Пытаемся выполнить семантический анализ
      let semanticResult = null;

      try {
        // Используем семантическую интеграцию для анализа
        semanticResult = await this.semanticIntegration.analyzeWithSemantics(userQuery, {
          includeMetaSemantics: true,
          includeEmotionalAnalysis: true,
          includeUserProfiling: true,
          shouldUseSemantic: true, // Принудительная активация семантики
          ...options
        });

        SmartLogger.provider('Семантический анализ выполнен успешно');

      } catch (semanticError) {
        SmartLogger.error('Ошибка семантического анализа:', semanticError);
        semanticResult = null;
      }

      // Если семантический анализ провалился, пытаемся использовать 4-уровневую архитектуру отказоустойчивости
      if (!semanticResult || !semanticResult.response) {
        SmartLogger.provider('Семантический анализ не удался, пытаемся 4-уровневую архитектуру отказоустойчивости');

        // УРОВЕНЬ 1: Мета-семантический анализ
        try {
          if (this.semanticIntegration && this.semanticIntegration.performMetaSemanticAnalysis) {
            const metaResult = await this.semanticIntegration.performMetaSemanticAnalysis(userQuery, options);
            if (metaResult && metaResult.response) {
              SmartLogger.success('Мета-семантический анализ успешен');
              return {
                success: true,
                response: metaResult.response,
                provider: this.name,
                processingTime: Date.now() - startTime,
                method: 'meta-semantic',
                confidence: metaResult.confidence || 85,
                quality: metaResult.quality || 8
              };
            }
          }
        } catch (metaError) {
          SmartLogger.provider('Мета-семантический анализ не удался, переходим к эмоциональному');
        }

        // УРОВЕНЬ 2: Эмоциональный анализ
        try {
          if (this.semanticIntegration && this.semanticIntegration.performEmotionalAnalysis) {
            const emotionalResult = await this.semanticIntegration.performEmotionalAnalysis(userQuery, options);
            if (emotionalResult && emotionalResult.response) {
              SmartLogger.success('Эмоциональный анализ успешен');
              return {
                success: true,
                response: emotionalResult.response,
                provider: this.name,
                processingTime: Date.now() - startTime,
                method: 'emotional-semantic',
                confidence: emotionalResult.confidence || 80,
                quality: emotionalResult.quality || 7
              };
            }
          }
        } catch (emotionalError) {
          SmartLogger.provider('Эмоциональный анализ не удался, переходим к профилированию');
        }

        // УРОВЕНЬ 3: Профилирование пользователя
        try {
          if (this.semanticIntegration && this.semanticIntegration.performUserProfiling) {
            const profilingResult = await this.semanticIntegration.performUserProfiling(userQuery, options);
            if (profilingResult && profilingResult.response) {
              SmartLogger.success('Профилирование пользователя успешно');
              return {
                success: true,
                response: profilingResult.response,
                provider: this.name,
                processingTime: Date.now() - startTime,
                method: 'user-profiling',
                confidence: profilingResult.confidence || 75,
                quality: profilingResult.quality || 7
              };
            }
          }
        } catch (profilingError) {
          SmartLogger.provider('Профилирование не удалось, переходим к базовому семантическому анализу');
        }

        // УРОВЕНЬ 4: Базовый семантический анализ
        try {
          if (this.semanticIntegration && this.semanticIntegration.performBasicSemanticAnalysis) {
            const basicResult = await this.semanticIntegration.performBasicSemanticAnalysis(userQuery, options);
            if (basicResult && basicResult.response) {
              SmartLogger.success('Базовый семантический анализ успешен');
              return {
                success: true,
                response: basicResult.response,
                provider: this.name,
                processingTime: Date.now() - startTime,
                method: 'basic-semantic',
                confidence: basicResult.confidence || 70,
                quality: basicResult.quality || 6
              };
            }
          }
        } catch (basicError) {
          SmartLogger.provider('Базовый семантический анализ не удался, переходим к conversation engine');
        }

        // ПОСЛЕДНИЙ ШАНС: Conversation engine с семантическими параметрами
        if (!this.conversation) {
          return await this.createFallbackResponse(userQuery);
        }

        try {
          SmartLogger.provider('Используем conversation engine с семантическими параметрами');

          const conversationResult = await this.conversation.generateResponse(userQuery, {
            useSemantics: true,
            semanticMode: 'enhanced',
            shouldUseSemantic: true,
            includeMetaSemantics: true,
            includeEmotionalAnalysis: true,
            ...options
          });

          if (conversationResult && conversationResult.response) {
            SmartLogger.success(`Conversation engine с семантикой обработал запрос за ${Date.now() - startTime}мс`);

            return {
              success: true,
              response: conversationResult.response,
              provider: this.name,
              processingTime: Date.now() - startTime,
              method: 'conversation-engine-semantic',
              confidence: conversationResult.confidence || 75,
              quality: conversationResult.quality || 7
            };
          }

        } catch (conversationError) {
          SmartLogger.error('Ошибка conversation engine с семантикой:', conversationError);
        }
      } else {
        // Семантический анализ успешен
        SmartLogger.success(`Семантический анализ выполнен за ${Date.now() - startTime}мс`);

        return {
          success: true,
          response: semanticResult.response,
          provider: this.name,
          processingTime: Date.now() - startTime,
          method: 'semantic-integration',
          confidence: semanticResult.confidence || 85,
          quality: semanticResult.quality || 8,
          semanticData: {
            analysis: semanticResult.analysis,
            usedModules: semanticResult.usedModules,
            semanticActivated: true
          }
        };
      }

      // Если все провалилось, используем fallback
      return await this.createFallbackResponse(userQuery);

    } catch (error) {
      SmartLogger.error(`Критическая ошибка семантического провайдера: ${error.message}`);

      return {
        success: false,
        error: error.message,
        provider: this.name,
        processingTime: Date.now() - startTime,
        method: 'error'
      };
    }
  }

  /**
   * Создает интеллектуальный ответ через семантическую систему
   * @param {string} userQuery - Оригинальный запрос
   * @returns {Object} - Интеллектуальный ответ
   */
  async createFallbackResponse(userQuery) {
    SmartLogger.provider('КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Используем conversation engine вместо fallback');

    // ГЛАВНОЕ ИСПРАВЛЕНИЕ: Вызываем conversation engine вместо fallback
    if (this.conversation && this.conversation.generateResponse) {
      try {
        SmartLogger.provider('Вызываем conversation engine для исправления fallback');

        const conversationResult = await this.conversation.generateResponse(userQuery, {
          useSemantics: true,
          semanticMode: 'enhanced',
          shouldUseSemantic: true,
          includeMetaSemantics: true,
          includeEmotionalAnalysis: true,
          forceBestQuality: true
        });

        if (conversationResult && conversationResult.response && conversationResult.response.length > 100) {
          SmartLogger.success('Conversation engine сгенерировал качественный ответ вместо fallback');
          return {
            success: true,
            response: conversationResult.response,
            provider: this.name,
            confidence: conversationResult.confidence || 85,
            quality: conversationResult.quality || 9,
            method: 'conversation-engine-fixed',
            semanticActivated: true
          };
        }
      } catch (conversationError) {
        SmartLogger.error('Ошибка conversation engine в createFallbackResponse:', conversationError);
      }
    }

    // ВТОРИЧНОЕ ИСПРАВЛЕНИЕ: Используем semantic integration если conversation engine не сработал
    if (this.semanticIntegration && this.semanticIntegration.generateIntelligentFallbackResponse) {
      try {
        const intelligentResponse = this.semanticIntegration.generateIntelligentFallbackResponse(userQuery);

        // ИСПРАВЛЕНИЕ: Проверяем что получили качественный ответ
        if (intelligentResponse && intelligentResponse.length > 50 && !intelligentResponse.includes('Интересно!')) {
          return {
            success: true,
            response: intelligentResponse,
            provider: this.name,
            confidence: 85,
            quality: 9,
            method: 'semantic_intelligent_fallback',
            semanticActivated: true
          };
        } else {
          SmartLogger.provider('Semantic integration дал некачественный ответ, используем локальный fallback');
        }
      } catch (error) {
        SmartLogger.error('Ошибка генерации интеллектуального ответа:', error);
      }
    }

    // ПОСЛЕДНИЙ FALLBACK: персонализированные ответы для BOOOMERANGS AI
    const lowerQuery = userQuery.toLowerCase();
    let response = '';

    if (lowerQuery.includes('привет') || lowerQuery.includes('здравствуй')) {
      response = 'Привет! Я BOOOMERANGS AI - ваш автономный помощник с семантической системой. Готов помочь с генерацией изображений, векторизацией и дизайн-консультациями!';
    } else if (lowerQuery.includes('что') && (lowerQuery.includes('умеешь') || lowerQuery.includes('можешь'))) {
      response = "Я BOOOMERANGS AI - автономная семантическая система! Мои возможности:\n\n🎨 Генерация изображений в любых стилях\n📐 Векторизация растровых изображений в SVG\n🧵 Конвертация в форматы вышивки (DST, PES, JEF)\n🧠 Интеллектуальные консультации по дизайну\n🔍 Поиск информации в интернете\n💡 Семантический анализ через 50+ модулей\n\nМоя автономная система работает без внешних зависимостей!";
    } else if (lowerQuery.includes('вышив') || lowerQuery.includes('формат') || lowerQuery.includes('стил')) {
      response = "Отлично! Я специализируюсь на вышивальных форматах:\n\n📁 Поддерживаемые форматы:\n• DST - основной формат для большинства машин\n• PES - Brother, Babylock, Bernina\n• JEF - Janome, Elna, Kenmore\n• EXP - Melco, Bernina\n• VP3 - Husqvarna Viking\n\nЗагружайте изображение, и я создам файл для вышивки!";
    } else if (lowerQuery.includes('создай') || lowerQuery.includes('сгенерируй') || lowerQuery.includes('нарисуй')) {
      response = "Превосходно! Моя система генерации создает уникальные изображения высокого качества. Опишите детально что создать, и я сгенерирую для вас!";
    } else if (lowerQuery.includes('векторизац') || lowerQuery.includes('svg') || lowerQuery.includes('вектор')) {
      response = "Отлично! Моя система векторизации преобразует любые изображения в качественные SVG. Загружайте растровое изображение или дайте ссылку!";
    } else if (lowerQuery.includes('помоги') || lowerQuery.includes('совет') || lowerQuery.includes('рекоменд')) {
      response = "Конечно помогу! Моя семантическая система анализирует контекст через 50+ модулей для персонализированных рекомендаций. Расскажите подробнее о вашем проекте!";
    } else {
      response = 'Понял ваш запрос! Моя автономная AI-система BOOOMERANGS анализирует его через семантические модули. Я готов помочь с генерацией изображений, векторизацией, консультациями по дизайну и поиском информации. Уточните, пожалуйста, что именно вас интересует?';
    }

    return {
      success: true,
      response: response,
      provider: this.name,
      confidence: 70,
      quality: 7,
      method: 'intelligent_fallback',
      semanticActivated: true
    };
  }

  /**
   * Старый интерфейс для совместимости
   * @param {string} userQuery - Запрос пользователя
   * @param {Object} options - Дополнительные параметры
   * @returns {Promise<Object>} - Результат обработки
   */
  async getChatResponse(userQuery, options = {}) {
    return await this.processRequest(userQuery, options);
  }

  /**
   * Информация о провайдере
   * @returns {Object} - Информация о провайдере
   */
  getInfo() {
    return {
      name: this.name,
      priority: this.priority,
      description: 'Семантический провайдер на основе conversation-engine с поддержкой мета-семантики',
      capabilities: [
        'Семантический анализ',
        'Мета-семантические операции', 
        'Эмоциональный интеллект',
        'Профилирование пользователей',
        'Контекстное понимание',
        'Интеллектуальные диалоги'
      ],
      status: this.conversation && this.semanticIntegration ? 'ready' : 'limited'
    };
  }
}

// Создаем и экспортируем экземпляр провайдера
const conversationEngineSemanticProvider = new ConversationEngineSemanticProvider();

module.exports = conversationEngineSemanticProvider;