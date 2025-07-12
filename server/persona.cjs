/**
 * СИСТЕМА СЕМАНТИЧЕСКОЙ ЛИЧНОСТИ
 * Управление стилем общения и адаптация под пользователя
 * 
 * Создает уникальную персону для каждого взаимодействия
 */

const SmartLogger = {
  persona: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎭 [${timestamp}] PERSONA: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * БАЗОВЫЕ ТИПЫ ПЕРСОН
 */
const PersonaTypes = {
  MENTOR: {
    name: 'Наставник',
    traits: ['мудрый', 'терпеливый', 'направляющий'],
    tone: 'поддерживающий',
    style: 'обучающий',
    vocabulary: 'профессиональный'
  },
  FRIEND: {
    name: 'Друг',
    traits: ['дружелюбный', 'понимающий', 'открытый'],
    tone: 'теплый',
    style: 'неформальный',
    vocabulary: 'простой'
  },
  EXPERT: {
    name: 'Эксперт',
    traits: ['знающий', 'точный', 'профессиональный'],
    tone: 'уверенный',
    style: 'деловой',
    vocabulary: 'технический'
  },
  CREATIVE: {
    name: 'Креативщик',
    traits: ['вдохновляющий', 'оригинальный', 'артистичный'],
    tone: 'энергичный',
    style: 'творческий',
    vocabulary: 'образный'
  },
  CONSULTANT: {
    name: 'Консультант',
    traits: ['аналитический', 'практичный', 'решительный'],
    tone: 'деловой',
    style: 'консультативный',
    vocabulary: 'бизнес'
  }
};

/**
 * АДАПТИВНЫЙ АНАЛИЗАТОР ПОЛЬЗОВАТЕЛЯ
 */
class UserPersonaAnalyzer {
  constructor() {
    this.userProfiles = new Map();
    this.interactionHistory = new Map();
  }

  /**
   * Анализирует предпочтения пользователя на основе истории
   */
  analyzeUserPreferences(userContext) {
    const userId = userContext.userId || 'anonymous';
    const conversationHistory = userContext.conversationHistory || [];
    
    SmartLogger.persona(`Анализируем предпочтения пользователя: ${userId}`);

    // Анализ стиля общения пользователя
    const userStyle = this.detectUserStyle(conversationHistory);
    
    // Анализ предпочитаемого тона
    const preferredTone = this.detectPreferredTone(conversationHistory);
    
    // Анализ технического уровня
    const technicalLevel = this.detectTechnicalLevel(conversationHistory);
    
    // Анализ эмоционального состояния
    const emotionalState = this.detectEmotionalState(conversationHistory);

    const preferences = {
      style: userStyle,
      tone: preferredTone,
      technicalLevel,
      emotionalState,
      preferredPersona: this.selectOptimalPersona(userStyle, preferredTone, technicalLevel),
      communicationPatterns: this.extractCommunicationPatterns(conversationHistory)
    };

    this.userProfiles.set(userId, preferences);
    
    SmartLogger.persona(`Предпочтения определены:`, {
      style: userStyle,
      tone: preferredTone,
      persona: preferences.preferredPersona
    });

    return preferences;
  }

  /**
   * Определяет стиль общения пользователя
   */
  detectUserStyle(history) {
    if (!history || history.length === 0) return 'neutral';

    const recentMessages = history.slice(-5).map(msg => msg.content || msg.message || '').join(' ');
    const lowerInput = recentMessages.toLowerCase();

    // Формальный стиль
    if (lowerInput.includes('пожалуйста') || 
        lowerInput.includes('будьте добры') ||
        lowerInput.includes('благодарю')) {
      return 'formal';
    }

    // Неформальный стиль
    if (lowerInput.includes('привет') || 
        lowerInput.includes('спс') ||
        lowerInput.includes('круто') ||
        lowerInput.includes('класс')) {
      return 'casual';
    }

    // Технический стиль
    if (lowerInput.includes('api') || 
        lowerInput.includes('код') ||
        lowerInput.includes('функция') ||
        lowerInput.includes('алгоритм')) {
      return 'technical';
    }

    return 'neutral';
  }

  /**
   * Определяет предпочитаемый тон
   */
  detectPreferredTone(history) {
    if (!history || history.length === 0) return 'friendly';

    const recentMessages = history.slice(-3).map(msg => msg.content || msg.message || '').join(' ').toLowerCase();

    // Деловой тон
    if (recentMessages.includes('эффективность') || 
        recentMessages.includes('результат') ||
        recentMessages.includes('решение')) {
      return 'business';
    }

    // Поддерживающий тон
    if (recentMessages.includes('помоги') || 
        recentMessages.includes('не получается') ||
        recentMessages.includes('сложно')) {
      return 'supportive';
    }

    // Энергичный тон
    if (recentMessages.includes('быстро') || 
        recentMessages.includes('давай') ||
        recentMessages.includes('скорее')) {
      return 'energetic';
    }

    return 'friendly';
  }

  /**
   * Определяет технический уровень пользователя
   */
  detectTechnicalLevel(history) {
    if (!history || history.length === 0) return 'beginner';

    const recentMessages = history.slice(-5).map(msg => msg.content || msg.message || '').join(' ').toLowerCase();
    
    const technicalTerms = ['api', 'json', 'функция', 'массив', 'объект', 'сервер', 'база данных', 'sql', 'javascript', 'python'];
    const advancedTerms = ['микросервис', 'архитектура', 'паттерн', 'рефакторинг', 'оптимизация', 'алгоритм'];

    const technicalCount = technicalTerms.filter(term => recentMessages.includes(term)).length;
    const advancedCount = advancedTerms.filter(term => recentMessages.includes(term)).length;

    if (advancedCount >= 2) return 'expert';
    if (technicalCount >= 3) return 'intermediate';
    if (technicalCount >= 1) return 'beginner';
    
    return 'non-technical';
  }

  /**
   * Определяет эмоциональное состояние
   */
  detectEmotionalState(history) {
    if (!history || history.length === 0) return 'neutral';

    const lastMessage = (history[history.length - 1]?.content || history[history.length - 1]?.message || '').toLowerCase();

    // Позитивное состояние
    if (lastMessage.includes('отлично') || 
        lastMessage.includes('спасибо') ||
        lastMessage.includes('круто')) {
      return 'positive';
    }

    // Фрустрация
    if (lastMessage.includes('не работает') || 
        lastMessage.includes('ошибка') ||
        lastMessage.includes('проблема')) {
      return 'frustrated';
    }

    // Любопытство
    if (lastMessage.includes('интересно') || 
        lastMessage.includes('как') ||
        lastMessage.includes('почему')) {
      return 'curious';
    }

    return 'neutral';
  }

  /**
   * Выбирает оптимальную персону
   */
  selectOptimalPersona(style, tone, technicalLevel) {
    // Логика выбора персоны на основе анализа
    if (technicalLevel === 'expert' && tone === 'business') {
      return PersonaTypes.EXPERT;
    }
    
    if (style === 'casual' && tone === 'friendly') {
      return PersonaTypes.FRIEND;
    }
    
    if (tone === 'supportive' || technicalLevel === 'beginner') {
      return PersonaTypes.MENTOR;
    }
    
    if (tone === 'energetic') {
      return PersonaTypes.CREATIVE;
    }
    
    if (tone === 'business') {
      return PersonaTypes.CONSULTANT;
    }

    return PersonaTypes.MENTOR; // по умолчанию
  }

  /**
   * Извлекает паттерны общения
   */
  extractCommunicationPatterns(history) {
    if (!history || history.length < 3) return {};

    return {
      averageMessageLength: this.calculateAverageMessageLength(history),
      questionFrequency: this.calculateQuestionFrequency(history),
      responsePreference: this.detectResponsePreference(history),
      topicSwitchingRate: this.calculateTopicSwitchingRate(history)
    };
  }

  calculateAverageMessageLength(history) {
    if (!history || history.length === 0) return 50;
    const messages = history.map(msg => msg.content || msg.message || '');
    const totalLength = messages.reduce((sum, msg) => sum + msg.length, 0);
    return Math.round(totalLength / messages.length);
  }

  calculateQuestionFrequency(history) {
    if (!history || history.length === 0) return 0.3;
    const messages = history.map(msg => msg.content || msg.message || '');
    const questionsCount = messages.filter(msg => msg.includes('?') || msg.includes('как') || msg.includes('что')).length;
    return questionsCount / messages.length;
  }

  detectResponsePreference(history) {
    const lastFewResponses = history.slice(-3);
    // Анализ длины и стиля предыдущих ответов для определения предпочтений
    return 'detailed'; // упрощенная версия
  }

  calculateTopicSwitchingRate(history) {
    // Упрощенный анализ переключения тем
    return 0.3; // средний уровень переключения тем
  }
}

/**
 * ГЕНЕРАТОР ПРОМПТОВ ПЕРСОНЫ
 */
class PersonaPromptGenerator {
  constructor() {
    this.analyzer = new UserPersonaAnalyzer();
  }

  /**
   * Создает промпт стиля для персоны
   */
  generatePersonaStylePrompt(userContext) {
    SmartLogger.persona('Генерируем промпт стиля персоны');

    // Анализируем пользователя
    const preferences = this.analyzer.analyzeUserPreferences(userContext);
    const selectedPersona = preferences.preferredPersona;

    // Базовые настройки из контекста
    const contextTone = userContext.tone || preferences.tone;
    const contextRole = userContext.role || selectedPersona.name;

    // Генерируем адаптивный промпт
    const stylePrompt = this.buildStylePrompt(selectedPersona, preferences, contextTone, contextRole);

    SmartLogger.persona(`Сгенерирован промпт для персоны "${selectedPersona.name}"`);

    return {
      prompt: stylePrompt,
      persona: selectedPersona,
      preferences: preferences,
      adaptations: this.generateAdaptations(preferences)
    };
  }

  /**
   * Строит промпт стиля
   */
  buildStylePrompt(persona, preferences, tone, role) {
    const basePrompt = `Общайся как ${role.toLowerCase()} с тоном: ${tone}.`;
    
    const personalityTraits = `Твои черты: ${persona.traits.join(', ')}.`;
    
    const styleGuidelines = this.generateStyleGuidelines(persona, preferences);
    
    const emotionalAdaptation = this.generateEmotionalAdaptation(preferences.emotionalState);
    
    const technicalAdaptation = this.generateTechnicalAdaptation(preferences.technicalLevel);

    return `${basePrompt} ${personalityTraits} ${styleGuidelines} ${emotionalAdaptation} ${technicalAdaptation}`;
  }

  /**
   * Генерирует рекомендации по стилю
   */
  generateStyleGuidelines(persona, preferences) {
    let guidelines = '';

    // Адаптация по стилю словаря
    switch (persona.vocabulary) {
      case 'technical':
        guidelines += 'Используй профессиональную терминологию и точные формулировки. ';
        break;
      case 'simple':
        guidelines += 'Объясняй простыми словами, избегай сложных терминов. ';
        break;
      case 'business':
        guidelines += 'Используй деловую лексику, фокусируйся на результатах. ';
        break;
      default:
        guidelines += 'Используй понятный и профессиональный язык. ';
    }

    // Адаптация по длине ответов
    if (preferences.communicationPatterns?.averageMessageLength > 200) {
      guidelines += 'Давай развернутые, детальные ответы. ';
    } else if (preferences.communicationPatterns?.averageMessageLength < 50) {
      guidelines += 'Будь краток и по существу. ';
    }

    return guidelines;
  }

  /**
   * Генерирует эмоциональную адаптацию
   */
  generateEmotionalAdaptation(emotionalState) {
    switch (emotionalState) {
      case 'frustrated':
        return 'Будь особенно терпелив и понимающ, предлагай пошаговые решения. ';
      case 'curious':
        return 'Поощряй любознательность, давай дополнительные детали и примеры. ';
      case 'positive':
        return 'Поддерживай позитивное настроение, будь энергичен. ';
      default:
        return 'Настройся на настроение собеседника, будь внимателен к эмоциям. ';
    }
  }

  /**
   * Генерирует техническую адаптацию
   */
  generateTechnicalAdaptation(technicalLevel) {
    switch (technicalLevel) {
      case 'expert':
        return 'Можешь использовать продвинутые концепции и детальные технические объяснения. ';
      case 'intermediate':
        return 'Объясняй с умеренной технической детализацией, приводи примеры. ';
      case 'beginner':
        return 'Начинай с основ, объясняй каждый шаг, используй аналогии. ';
      case 'non-technical':
        return 'Избегай технических терминов, объясняй понятным языком с примерами из жизни. ';
      default:
        return 'Адаптируй уровень техничности под понимание собеседника. ';
    }
  }

  /**
   * Генерирует дополнительные адаптации
   */
  generateAdaptations(preferences) {
    return {
      responseLength: this.recommendResponseLength(preferences),
      exampleUsage: this.recommendExampleUsage(preferences),
      questionStyle: this.recommendQuestionStyle(preferences),
      followUpStrategy: this.recommendFollowUpStrategy(preferences)
    };
  }

  recommendResponseLength(preferences) {
    const avgLength = preferences.communicationPatterns?.averageMessageLength || 100;
    
    if (avgLength > 200) return 'detailed';
    if (avgLength < 50) return 'concise';
    return 'moderate';
  }

  recommendExampleUsage(preferences) {
    if (preferences.technicalLevel === 'beginner' || preferences.technicalLevel === 'non-technical') {
      return 'frequent';
    }
    return 'moderate';
  }

  recommendQuestionStyle(preferences) {
    const questionFreq = preferences.communicationPatterns?.questionFrequency || 0;
    
    if (questionFreq > 0.5) return 'direct_answers';
    return 'exploratory';
  }

  recommendFollowUpStrategy(preferences) {
    if (preferences.emotionalState === 'curious') return 'proactive';
    if (preferences.style === 'formal') return 'respectful';
    return 'engaging';
  }
}

// Создаем единственный экземпляр генератора
const personaGenerator = new PersonaPromptGenerator();

/**
 * ГЛАВНАЯ ЭКСПОРТИРУЕМАЯ ФУНКЦИЯ
 */
const generatePersonaStylePrompt = (userContext = {}) => {
  try {
    return personaGenerator.generatePersonaStylePrompt(userContext);
  } catch (error) {
    SmartLogger.persona('Ошибка генерации персоны:', error.message);
    
    // Fallback персона
    return {
      prompt: `Общайся как дружелюбный и профессиональный помощник. Будь внимателен к потребностям пользователя и адаптируйся под его стиль общения.`,
      persona: PersonaTypes.MENTOR,
      preferences: { style: 'neutral', tone: 'friendly', technicalLevel: 'intermediate' },
      adaptations: { responseLength: 'moderate', exampleUsage: 'moderate' }
    };
  }
};

/**
 * ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
 */
const getAvailablePersonas = () => PersonaTypes;

const customizePersona = (basePersona, customizations) => {
  return {
    ...basePersona,
    ...customizations,
    traits: [...basePersona.traits, ...(customizations.traits || [])]
  };
};

module.exports = {
  generatePersonaStylePrompt,
  getAvailablePersonas,
  customizePersona,
  PersonaTypes
};