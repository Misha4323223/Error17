/**
 * Профилировщик пользователей для персонализации взаимодействий
 * Анализирует стиль общения, предпочтения и эмоциональные паттерны
 * ФАЗА 1: Эмоциональный интеллект и персонализация
 */

// Используем динамический импорт для ES модулей
let storage = null;

async function getStorage() {
  if (!storage) {
    try {
      const storageModule = await import('../storage.ts');
      storage = storageModule.storage;
    } catch (error) {
      console.error("Ошибка при импорте storage.ts:", error);
      // Предлагаем fallback или обработку ошибки
      storage = {
        getUserProfile: async () => {console.warn("getUserProfile не реализован, используя fallback"); return null;},
        updateUserProfile: async () => {console.warn("updateUserProfile не реализован, используя fallback"); return null;},
        createUserProfile: async () => {console.warn("createUserProfile не реализован, используя fallback"); return null;}
      };
    }
  }
  return storage;
}

const SmartLogger = {
  profiler: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`👤📊 [${timestamp}] USER PROFILER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Класс для профилирования пользователей и персонализации
 */
class UserProfiler {
  constructor() {
    this.initialized = false;
    this.initializeProfilingRules();
  }

  /**
   * Инициализация правил профилирования
   */
  initializeProfilingRules() {
    // Паттерны стилей общения
    this.communicationPatterns = {
      formal: {
        keywords: ['пожалуйста', 'благодарю', 'извините', 'будьте добры', 'не могли бы вы'],
        phrases: ['формально', 'официально', 'деловой стиль'],
        punctuation: ['!', '.', ','],
        weight: 1.0
      },

      friendly: {
        keywords: ['спасибо', 'привет', 'классно', 'круто', 'давай', 'можешь'],
        phrases: ['дружески', 'неформально', 'по-дружески'],
        punctuation: ['!', '😀'],
        weight: 1.0
      },

      brief: {
        keywords: ['коротко', 'кратко', 'быстро', 'сжато'],
        phrases: ['без деталей', 'в двух словах', 'вкратце'],
        avgWordCount: { min: 1, max: 10 },
        weight: 0.8
      },

      detailed: {
        keywords: ['подробно', 'детально', 'расскажи', 'объясни', 'опиши'],
        phrases: ['во всех подробностях', 'с деталями', 'максимально подробно'],
        avgWordCount: { min: 20, max: 100 },
        weight: 0.9
      }
    };

    // Паттерны дизайн-предпочтений
    this.designPatterns = {
      minimalist: {
        keywords: ['минимализм', 'простой', 'чистый', 'лаконичный', 'без лишнего'],
        antiKeywords: ['сложный', 'детальный', 'много элементов'],
        weight: 1.2
      },

      vintage: {
        keywords: ['винтаж', 'ретро', 'старинный', 'классический', 'винтажный'],
        timeIndicators: ['50-е', '60-е', '70-е', '80-е', '90-е'],
        weight: 1.0
      },

      modern: {
        keywords: ['современный', 'модный', 'актуальный', 'трендовый', 'свежий'],
        timeIndicators: ['2020', '2024', 'текущий', 'новый'],
        weight: 1.0
      },

      artistic: {
        keywords: ['художественный', 'артистичный', 'творческий', 'авангард', 'экспрессивный'],
        techniques: ['акварель', 'масло', 'граффити', 'абстракция'],
        weight: 1.1
      }
    };

    // Эмоциональные паттерны
    this.emotionalPatterns = {
      enthusiastic: {
        keywords: ['отлично', 'супер', 'потрясающе', 'восхитительно', 'обожаю'],
        emojis: ['!', '!!!', '😊', '🎉', '👍', '💯', '✨', '🌟', '❤️'],
        capsWords: ['СУПЕР', 'ОТЛИЧНО', 'ВАУ'],
        weight: 1.3
      },

      calm: {
        keywords: ['спокойно', 'размеренно', 'без спешки', 'обдуманно'],
        phrases: ['не торопясь', 'взвешенно', 'продуманно'],
        punctuation: ['.', ','],
        weight: 0.8
      },

      professional: {
        keywords: ['профессионально', 'качественно', 'компетентно', 'экспертно'],
        phrases: ['на профессиональном уровне', 'бизнес-качество'],
        weight: 1.0
      },

      creative: {
        keywords: ['креативно', 'творчески', 'нестандартно', 'оригинально'],
        phrases: ['out of the box', 'творческий подход', 'креативное решение'],
        weight: 1.2
      }
    };
  }

  /**
   * Анализирует стиль общения пользователя
   */
  analyzeCommunicationStyle(input) {
    const lowerInput = input.toLowerCase();

    const style = {
      formality: 'neutral',
      emotional_tone: 'neutral',
      verbosity: 'medium',
      technical_level: 'basic',
      preferred_approach: 'conversational'
    };

    // Анализ формальности
    if (lowerInput.includes('пожалуйста') || lowerInput.includes('благодарю') || lowerInput.includes('извините')) {
      style.formality = 'formal';
    } else if (lowerInput.includes('привет') || lowerInput.includes('йоу') || lowerInput.includes('хай')) {
      style.formality = 'informal';
    }

    // Анализ эмоционального тона
    if (lowerInput.includes('!') || lowerInput.includes('круто') || lowerInput.includes('супер')) {
      style.emotional_tone = 'enthusiastic';
    } else if (lowerInput.includes('плохо') || lowerInput.includes('не работает')) {
      style.emotional_tone = 'frustrated';
    }

    // Анализ многословности
    if (input.length > 200) {
      style.verbosity = 'high';
    } else if (input.length < 50) {
      style.verbosity = 'low';
    }

    // Анализ технического уровня
    if (lowerInput.includes('апи') || lowerInput.includes('json') || lowerInput.includes('код')) {
      style.technical_level = 'advanced';
    }

    return style;
  }

  /**
   * Анализирует дизайнерские предпочтения
   */
  analyzeDesignPreferences(input) {
    const lowerInput = input.toLowerCase();

    const preferences = {
      style_preference: 'modern',
      color_preference: 'balanced',
      complexity: 'medium',
      purpose: 'general'
    };

    // Анализ стилевых предпочтений
    if (lowerInput.includes('минимал') || lowerInput.includes('простой')) {
      preferences.style_preference = 'minimalist';
    } else if (lowerInput.includes('винтаж') || lowerInput.includes('ретро')) {
      preferences.style_preference = 'vintage';
    }

    // Анализ цветовых предпочтений
    if (lowerInput.includes('яркий') || lowerInput.includes('красочный')) {
      preferences.color_preference = 'vibrant';
    } else if (lowerInput.includes('спокойный') || lowerInput.includes('пастель')) {
      preferences.color_preference = 'muted';
    }

    return preferences;
  }

  /**
   * Анализирует эмоциональное состояние пользователя
   */
  analyzeEmotionalState(input, conversationHistory = []) {
    const lowerInput = input.toLowerCase();

    const emotionalState = {
      current_mood: 'neutral',
      engagement_level: 'medium',
      satisfaction: 'neutral',
      energy_level: 'medium'
    };

    // Анализ настроения
    if (lowerInput.includes('отлично') || lowerInput.includes('супер') || lowerInput.includes('класс')) {
      emotionalState.current_mood = 'positive';
      emotionalState.satisfaction = 'high';
    } else if (lowerInput.includes('плохо') || lowerInput.includes('ужасно') || lowerInput.includes('не нравится')) {
      emotionalState.current_mood = 'negative';
      emotionalState.satisfaction = 'low';
    }

    // Анализ уровня вовлеченности
    if (input.length > 100 || lowerInput.includes('?')) {
      emotionalState.engagement_level = 'high';
    } else if (input.length < 20) {
      emotionalState.engagement_level = 'low';
    }

    return emotionalState;
  }

  /**
   * Адаптирует ответ под профиль пользователя
   */
  adaptResponseToProfile(response, userProfile, emotionalContext) {
    let adaptedResponse = response;

    // Адаптация под стиль общения
    if (userProfile.communicationStyle?.formality === 'formal') {
      adaptedResponse = adaptedResponse.replace(/привет/gi, 'Здравствуйте');
      adaptedResponse = adaptedResponse.replace(/классно/gi, 'превосходно');
    } else if (userProfile.communicationStyle?.formality === 'informal') {
      adaptedResponse = adaptedResponse.replace(/Здравствуйте/gi, 'Привет');
    }

    // Адаптация под эмоциональное состояние
    if (emotionalContext?.primary_emotion === 'frustrated') {
      adaptedResponse = 'Понимаю ваше беспокойство. ' + adaptedResponse;
    } else if (emotionalContext?.primary_emotion === 'enthusiastic') {
      adaptedResponse = adaptedResponse + ' 🌟';
    }

    return adaptedResponse;
  }

  /**
   * Создает персонализированный профиль пользователя
   */
  async createPersonalizedProfile(userId, analysisData) {
    try {
      // Временная заглушка для базы данных
      const db = null;
      if (!db) {
          console.error("База данных не инициализирована.");
          return null;
      }

      let existingProfile = null;
      try {
        existingProfile = await db.getUserProfile(userId);
      } catch (error) {
        console.warn("Таблица user_profiles не существует или недоступна:", error.message);
        return null;
      }

      const profileData = {
        userId: userId,
        communicationStyle: analysisData.communicationStyle?.dominantStyle || 'friendly',
        preferredLanguage: 'ru', // TODO: добавить определение языка
        responseLength: this.determinePreferredLength(analysisData.communicationStyle),
        favoriteColors: analysisData.designPreferences?.colors || [],
        preferredStyles: Object.keys(analysisData.designPreferences?.styles || {}),
        designComplexity: analysisData.designPreferences?.complexity || 'medium',
        emotionalTone: analysisData.emotionalState?.currentEmotion || 'neutral',
        feedbackStyle: this.determineFeedbackStyle(analysisData.emotionalState),
        learningProgress: JSON.stringify({}),
        successPatterns: JSON.stringify({}),
        totalInteractions: existingProfile ? (existingProfile.totalInteractions || 0) + 1 : 1
      };

      let profile;
      if (existingProfile) {
        profile = await db.updateUserProfile(userId, profileData);
      } else {
        profile = await db.createUserProfile(profileData);
      }

      SmartLogger.profiler(`Персонализированный профиль ${existingProfile ? 'обновлен' : 'создан'}`, {
        userId,
        style: profileData.communicationStyle,
        emotion: profileData.emotionalTone
      });

      return profile;
    } catch (error) {
      SmartLogger.profiler(`Ошибка при создании профиля: ${error.message}`);
      return null;
    }
  }

  /**
   * Адаптация ответа под профиль пользователя
   */
  adaptResponseToProfile(baseResponse, userProfile, emotionalState) {
    if (!userProfile) return baseResponse;

    adaptedResponse = baseResponse;

    // Адаптируем стиль общения
    adaptedResponse = this.adaptCommunicationStyle(adaptedResponse, userProfile.communicationStyle);

    // Адаптируем длину ответа
    adaptedResponse = this.adaptResponseLength(adaptedResponse, userProfile.responseLength);

    // Адаптируем эмоциональный тон
    adaptedResponse = this.adaptEmotionalTone(adaptedResponse, userProfile.emotionalTone, emotionalState);

    // Добавляем персональные элементы
    adaptedResponse = this.addPersonalElements(adaptedResponse, userProfile);

    SmartLogger.profiler('Ответ адаптирован под профиль пользователя', {
      style: userProfile.communicationStyle,
      length: userProfile.responseLength,
      tone: userProfile.emotionalTone
    });

    return adaptedResponse;
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  extractColors(message) {
    const colorKeywords = {
      'красный': '#FF0000', 'синий': '#0000FF', 'зеленый': '#00FF00',
      'желтый': '#FFFF00', 'оранжевый': '#FFA500', 'фиолетовый': '#800080',
      'розовый': '#FFC0CB', 'коричневый': '#A52A2A', 'серый': '#808080',
      'черный': '#000000', 'белый': '#FFFFFF', 'золотой': '#FFD700',
      'серебряный': '#C0C0C0', 'бирюзовый': '#40E0D0', 'лимонный': '#FFFACD'
    };

    const foundColors = [];
    for (const [colorName, colorCode] of Object.entries(colorKeywords)) {
      if (message.includes(colorName)) {
        foundColors.push(colorName);
      }
    }
    return foundColors;
  }

  analyzeEmotionalContext(sessionHistory) {
    if (!sessionHistory || sessionHistory.length === 0) return null;

    // Анализируем последние 3 сообщения для выявления изменений настроения
    const recentMessages = sessionHistory.slice(-3);
    let emotionalTrajectory = 'stable';

    // Упрощенный анализ тренда (можно расширить)
    if (recentMessages.length >= 2) {
      const lastMessage = recentMessages[recentMessages.length - 1];
      const prevMessage = recentMessages[recentMessages.length - 2];

      if (this.containsPositiveWords(lastMessage) && this.containsNegativeWords(prevMessage)) {
        emotionalTrajectory = 'improving';
      } else if (this.containsNegativeWords(lastMessage) && this.containsPositiveWords(prevMessage)) {
        emotionalTrajectory = 'declining';
      }
    }

    return emotionalTrajectory;
  }

  containsPositiveWords(message) {
    const positiveWords = ['отлично', 'супер', 'классно', 'хорошо', 'замечательно', 'спасибо'];
    return positiveWords.some(word => message.toLowerCase().includes(word));
  }

  containsNegativeWords(message) {
    const negativeWords = ['плохо', 'ужасно', 'не нравится', 'разочарован', 'проблема'];
    return negativeWords.some(word => message.toLowerCase().includes(word));
  }

  determinePreferredLength(communicationStyle) {
    if (!communicationStyle) return 'medium';

    if (communicationStyle.scores?.brief > 1) return 'short';
    if (communicationStyle.scores?.detailed > 1) return 'detailed';
    return 'medium';
  }

  determineFeedbackStyle(emotionalState) {
    if (!emotionalState) return 'encouraging';

    if (emotionalState.currentEmotion === 'professional') return 'direct';
    if (emotionalState.currentEmotion === 'enthusiastic') return 'encouraging';
    if (emotionalState.currentEmotion === 'calm') return 'detailed';
    return 'encouraging';
  }

  adaptCommunicationStyle(response, style) {
    switch (style) {
      case 'formal':
        return response.replace(/давай/g, 'предлагаю').replace(/можешь/g, 'не могли бы вы');
      case 'brief':
        return response.split('.').slice(0, 2).join('.') + '.';
      case 'friendly':
        return response + ' 😊';
      default:
        return response;
    }
  }

  adaptResponseLength(response, preferredLength) {
    switch (preferredLength) {
      case 'short':
        return response.split('.').slice(0, 1).join('.') + '.';
      case 'detailed':
        return response; // базовый ответ уже детальный
      default:
        return response;
    }
  }

  adaptEmotionalTone(response, profileTone, currentEmotion) {
    if (currentEmotion?.currentEmotion === 'enthusiastic') {
      return response.replace(/\./g, '!');
    }

    if (profileTone === 'professional') {
      return response.replace(/!/g, '.');
    }

    return response;
  }

  addPersonalElements(response, userProfile) {
    // Добавляем элементы на основе предпочтений
    if (userProfile.preferredStyles?.includes('minimalist')) {
      response += '\n\nПо вашему стилю: чистые линии и минимализм будут идеальны.';
    }

    if (userProfile.favoriteColors?.length > 0) {
      const colors = userProfile.favoriteColors.slice(0, 2).join(' и ');
      response += `\n\nС учетом ваших предпочтений: ${colors} отлично подойдут.`;
    }

    return response;
  }

  /**
   * ✅ ИСПРАВЛЕНИЕ: Реализация отсутствующего метода performUserProfiling
   * Выполняет профилирование пользователя на основе ввода
   */
  async performUserProfiling(userInput, context = {}) {
    console.log(`👤 [USER-PROFILING] Начинаем профилирование: "${userInput.substring(0, 50)}"`);

    // Объявляем переменные в нужной области видимости
    let communicationAnalysis = null;
    let designPreferences = {};
    let emotionalState = {};

    try {
      // Используем this вместо userProfiler для избежания циклических ссылок
      if (this && typeof this.analyzeCommunicationStyle === 'function') {
        communicationAnalysis = this.analyzeCommunicationStyle(userInput);
        designPreferences = this.analyzeDesignPreferences ? 
                           this.analyzeDesignPreferences(userInput) : {};
        emotionalState = this.analyzeEmotionalState ? 
                        this.analyzeEmotionalState(userInput, context.sessionHistory) : {};

        console.log(`✅ [USER-PROFILING] Профилирование завершено успешно`);
        
        return {
          communicationAnalysis,
          designPreferences,
          emotionalState,
          confidence: 0.8,
          processingTime: Date.now()
        };
      } else {
        console.warn("Методы профилирования недоступны");
        
        // Fallback анализ
        return {
          communicationAnalysis: this.analyzeCommunicationStyle(userInput),
          designPreferences: this.analyzeDesignPreferences(userInput),
          emotionalState: this.analyzeEmotionalState(userInput, context.sessionHistory),
          confidence: 0.5,
          processingTime: Date.now(),
          fallback: true
        };
      }
    } catch (error) {
      console.error(`❌ [USER-PROFILING] Ошибка профилирования: ${error.message}`);
      
      // Возвращаем минимальный результат
      return {
        communicationAnalysis: communicationAnalysis || { formality: 'neutral', tone: 'neutral' },
        designPreferences: designPreferences || {},
        emotionalState: emotionalState || { mood: 'neutral' },
        confidence: 0.3,
        error: error.message
      };
    }
  }
}

// Создаем экземпляр и экспортируем его с методами
const userProfilerInstance = new UserProfiler();

module.exports = {
  // Экспортируем все методы экземпляра
  analyzeCommunicationStyle: userProfilerInstance.analyzeCommunicationStyle.bind(userProfilerInstance),
  analyzeDesignPreferences: userProfilerInstance.analyzeDesignPreferences.bind(userProfilerInstance),
  analyzeEmotionalState: userProfilerInstance.analyzeEmotionalState.bind(userProfilerInstance),
  createPersonalizedProfile: userProfilerInstance.createPersonalizedProfile.bind(userProfilerInstance),
  adaptResponseToProfile: userProfilerInstance.adaptResponseToProfile.bind(userProfilerInstance),

  // Также экспортируем сам экземпляр для обратной совместимости
  instance: userProfilerInstance,

  // Экспортируем класс
  UserProfiler: UserProfiler
};