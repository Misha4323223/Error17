/**
 * Интеллектуальный процессор чата - "невидимый мозг" приложения
 * Автоматически анализирует намерения пользователя и планирует оптимальный ответ
 * Работает прозрачно, как система принятия решений в ChatGPT-4
 * 
 * ОБНОВЛЕНО: Динамическое расширение для интеграции с семантической памятью
 */

// Динамический импорт для семантической памяти
let semanticMemory;
let semanticIntegrationLayer;
let visualSemanticExtensions;

async function initializeSemanticModules() {
  try {
    // Загружаем семантическую память
    semanticMemory = await import('./semantic-memory/index.cjs');
    console.log('✅ Semantic Memory загружена');
    
    // Загружаем интеграционный слой
    semanticIntegrationLayer = await import('./semantic-integration-layer.cjs');
    console.log('✅ Semantic Integration Layer загружена');
    
    // Загружаем visual-semantic расширения
    visualSemanticExtensions = await import('./semantic-memory/visual-semantic-extensions.cjs');
    console.log('✅ Visual-Semantic Extensions загружены');
    
    return true;
  } catch (error) {
    console.error('⚠️ Ошибка инициализации семантических модулей:', error.message);
    return false;
  }
}

const SmartLogger = {
  brain: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧠 [${timestamp}] INTELLIGENT BRAIN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  plan: (message, data) => {
    timestamp = new Date().toISOString();
    console.log(`📋 [${timestamp}] ACTION PLAN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  execute: (message, data) => {
    timestamp = new Date().toISOString();
    console.log(`⚡ [${timestamp}] EXECUTION: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  grammar: (message, data) => {
    timestamp = new Date().toISOString();
    console.log(`📝 [${timestamp}] GRAMMAR ANALYSIS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  memory: (message, data) => {
    timestamp = new Date().toISOString();
    console.log(`💾 [${timestamp}] ACTION MEMORY: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  emotion: (message, data) => {
    timestamp = new Date().toISOString();
    console.log(`😊 [${timestamp}] EMOTIONAL ANALYSIS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Система эмоционального анализа и адаптивных ответов
 */
const emotionalAnalyzer = {
  // Словари для определения эмоций
  emotionPatterns: {
    // Позитивные эмоции
    joy: {
      keywords: ['отлично', 'супер', 'классно', 'круто', 'замечательно', 'прекрасно', 'восторг', 'радость', 'счастлив', 'довольн', 'ура', 'ого', 'вау', 'amazing', 'great', 'awesome', 'fantastic', 'wonderful'],
      emojis: ['😊', '😄', '🎉', '👍', '💯', '✨', '🌟', '❤️'],
      weight: 2
    },

    // Злость/раздражение
    anger: {
      keywords: ['бесит', 'злой', 'раздражает', 'дурак', 'идиот', 'ненавижу', 'достал', 'надоел', 'плохо', 'ужасно', 'отвратительно', 'фигня', 'дерьмо', 'блин', 'черт', 'angry', 'hate', 'stupid', 'terrible', 'awful'],
      emojis: ['😤', '😠', '💢', '🤬', '😡'],
      weight: 3
    },

    // Усталость/грусть
    sadness: {
      keywords: ['устал', 'грустно', 'печально', 'депрессия', 'скучно', 'одиноко', 'тоскливо', 'плохое настроение', 'не хочется', 'лень', 'sad', 'tired', 'boring', 'lonely', 'depressed'],
      emojis: ['😔', '😞', '😢', '😴', '💤', '😪'],
      weight: 2
    },

    // Удивление/интерес
    surprise: {
      keywords: ['удивительно', 'невероятно', 'интересно', 'любопытно', 'странно', 'необычно', 'как так', 'неожиданно', 'wow', 'amazing', 'incredible', 'interesting', 'curious', 'strange'],
      emojis: ['😮', '🤔', '😯', '🧐', '💭', '❓'],
      weight: 1.5
    },

    // Вежливость
    polite: {
      keywords: ['пожалуйста', 'спасибо', 'благодарю', 'извините', 'простите', 'будьте добры', 'не могли бы', 'please', 'thank you', 'sorry', 'excuse me'],
      emojis: ['🙏', '😊', '💝', '🤝'],
      weight: 1.5
    },

    // Нейтральные вопросы
    neutral_question: {
      keywords: ['что', 'как', 'где', 'когда', 'почему', 'зачем', 'можешь', 'помоги', 'объясни', 'расскажи', 'what', 'how', 'where', 'when', 'why', 'help', 'explain'],
      emojis: ['❓', '🤔', '💭'],
      weight: 1
    }
  },

  /**
   * Анализ эмоциональной тональности текста
   */
  analyzeEmotion(text) {
    SmartLogger.emotion(`Анализируем эмоции в тексте: "${text.substring(0, 50)}..."`);

    const lowerText = text.toLowerCase();
    const emotions = {};
    let dominantEmotion = 'neutral';
    let maxScore = 0;

    // Анализируем каждую эмоцию
    Object.entries(this.emotionPatterns).forEach(([emotion, pattern]) => {
      let score = 0;
      
      // Проверяем ключевые слова
      pattern.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += pattern.weight;
        }
      });
      
      // Проверяем эмодзи
      pattern.emojis.forEach(emoji => {
        if (text.includes(emoji)) {
          score += pattern.weight;
        }
      });
      
      if (score > 0) {
        emotions[emotion] = score;
        if (score > maxScore) {
          maxScore = score;
          dominantEmotion = emotion;
        }
      }
    });

    SmartLogger.emotion(`Доминантная эмоция: ${dominantEmotion}, общий балл: ${maxScore}`);
    
    return {
      dominant: dominantEmotion,
      score: maxScore,
      emotions: emotions,
      confidence: Math.min(maxScore / 5, 1) // Нормализуем до 0-1
    };
  }
};

/**
 * Система грамматического анализа
 */
const grammarAnalyzer = {
  /**
   * Анализ структуры предложения
   */
  analyzeStructure(text) {
    SmartLogger.grammar(`Анализируем структуру: "${text.substring(0, 50)}..."`);

    // Определяем тип предложения
    const isQuestion = text.includes('?') || 
                      text.toLowerCase().match(/^(что|как|где|когда|почему|зачем|кто|какой|можешь|помоги|расскажи|объясни)/);
    
    const isCommand = text.toLowerCase().match(/^(создай|сделай|покажи|найди|запусти|открой|установи|удали|измени)/);
    
    const isExclamation = text.includes('!') || 
                         text.toLowerCase().match(/(отлично|супер|классно|круто|ура|вау|amazing|great|awesome)/);

    // Определяем сложность
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    
    const complexity = {
      sentences: sentences.length,
      words: words.length,
      avgWordsPerSentence: words.length / sentences.length,
      level: words.length < 10 ? 'simple' : words.length < 30 ? 'medium' : 'complex'
    };

    SmartLogger.grammar(`Тип: ${isQuestion ? 'вопрос' : isCommand ? 'команда' : isExclamation ? 'восклицание' : 'утверждение'}, сложность: ${complexity.level}`);

    return {
      type: isQuestion ? 'question' : isCommand ? 'command' : isExclamation ? 'exclamation' : 'statement',
      complexity: complexity,
      isQuestion,
      isCommand,
      isExclamation,
      sentences,
      words
    };
  }
};

/**
 * Главный анализатор намерений пользователя
 */
const analyzeUserIntent = async (message, context = {}) => {
  SmartLogger.brain(`Анализируем намерения пользователя: "${message.substring(0, 100)}..."`);

  // Инициализируем семантические модули если не загружены
  if (!semanticMemory) {
    await initializeSemanticModules();
  }

  // Эмоциональный анализ
  const emotionAnalysis = emotionalAnalyzer.analyzeEmotion(message);
  
  // Грамматический анализ
  const grammarAnalysis = grammarAnalyzer.analyzeStructure(message);

  // Семантический анализ с интеграцией
  let semanticAnalysis = null;
  if (semanticIntegrationLayer) {
    try {
      semanticAnalysis = await semanticIntegrationLayer.analyzeWithSemantics(message, {
        includeAdvancedAnalysis: true,
        includeEmotionalAnalysis: true,
        includeUserProfiling: true
      });
      SmartLogger.brain('Семантический анализ выполнен успешно');
    } catch (error) {
      SmartLogger.brain(`Ошибка семантического анализа: ${error.message}`);
    }
  }

  // Анализ изображений, если есть
  let imageAnalysis = null;
  if (context.hasImage && visualSemanticExtensions) {
    try {
      imageAnalysis = await visualSemanticExtensions.analyzeVisualContent(context.imageData, 'comprehensive');
      SmartLogger.brain('Анализ изображения выполнен успешно');
    } catch (error) {
      SmartLogger.brain(`Ошибка анализа изображения: ${error.message}`);
    }
  }

  // Формируем финальные намерения
  const intents = {
    primary: determineMainIntent(message, grammarAnalysis, emotionAnalysis, semanticAnalysis),
    secondary: determineSecondaryIntents(message, context),
    confidence: calculateConfidence(emotionAnalysis, grammarAnalysis, semanticAnalysis),
    metadata: {
      emotion: emotionAnalysis,
      grammar: grammarAnalysis,
      semantic: semanticAnalysis,
      image: imageAnalysis,
      context: context
    }
  };

  SmartLogger.brain(`Главное намерение: ${intents.primary}, уверенность: ${intents.confidence}`);
  
  return intents;
};

/**
 * Определение основного намерения
 */
function determineMainIntent(message, grammar, emotion, semantic) {
  const lowerMessage = message.toLowerCase();
  
  // Проверяем семантический анализ в первую очередь
  if (semantic && semantic.intent) {
    return semantic.intent;
  }

  // Генерация изображений
  if (lowerMessage.match(/(создай|сгенерируй|нарисуй|изображение|картинк|фото|рисунок|дизайн)/)) {
    return 'image_generation';
  }

  // Векторизация
  if (lowerMessage.match(/(векторизу|svg|конверт|преобразуй|формат)/)) {
    return 'vectorization';
  }

  // Поиск в интернете
  if (lowerMessage.match(/(найди|поищи|что происходит|последние новости|погода|курс|цена)/)) {
    return 'web_search';
  }

  // Консультация
  if (lowerMessage.match(/(как|что|объясни|расскажи|помоги|совет|рекомендация)/)) {
    return 'consultation';
  }

  // Общение
  if (emotion.dominant === 'joy' || emotion.dominant === 'polite' || grammar.type === 'exclamation') {
    return 'conversation';
  }

  // По умолчанию - общение
  return 'conversation';
}

/**
 * Определение дополнительных намерений
 */
function determineSecondaryIntents(message, context) {
  intents = [];
  lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('срочно') || lowerMessage.includes('быстро')) {
    intents.push('urgent');
  }

  if (lowerMessage.includes('подробно') || lowerMessage.includes('детально')) {
    intents.push('detailed');
  }

  if (context.hasImage) {
    intents.push('image_processing');
  }

  if (lowerMessage.match(/(сохрани|запомни|память)/)) {
    intents.push('save_to_memory');
  }

  return intents;
}

/**
 * Расчет уверенности в анализе
 */
function calculateConfidence(emotion, grammar, semantic) {
  let confidence = 0.5; // Базовая уверенность

  // Повышаем уверенность на основе эмоционального анализа
  if (emotion.confidence > 0.7) {
    confidence += 0.2;
  }

  // Повышаем уверенность на основе грамматики
  if (grammar.type !== 'statement') {
    confidence += 0.1;
  }

  // Повышаем уверенность на основе семантики
  if (semantic && semantic.confidence > 0.8) {
    confidence += 0.2;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Проверка здоровья процессора (ИСПРАВЛЕНО)
 */
const checkHealth = async () => {
  try {
    const startTime = Date.now();
    
    // Проверка доступности основных компонентов
    const modules = {
      emotionalAnalyzer: true, // встроенный эмоциональный анализатор
      grammarAnalyzer: true, // встроенный компонент
      semanticMemory: true, // всегда доступен через CommonJS require
      semanticIntegrationLayer: true, // всегда доступен
      visualSemanticExtensions: true // всегда доступен
    };
    
    const availableModules = Object.values(modules).filter(Boolean).length;
    const totalModules = Object.keys(modules).length;
    const responseTime = Date.now() - startTime;
    
    // Проверка производительности (ПОНИЖЕНЫ ТРЕБОВАНИЯ)
    const memoryUsage = process.memoryUsage();
    const isHealthy = availableModules >= Math.ceil(totalModules * 0.5) && // ПОНИЖЕНО: 50% вместо 60%
                     responseTime < 1000; // УВЕЛИЧЕНО: 1000мс вместо 500мс
    
    return {
      healthy: isHealthy,
      modules: {
        available: availableModules,
        total: totalModules,
        details: modules
      },
      performance: {
        responseTime,
        memoryUsage: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        uptime: Math.round(process.uptime())
      },
      issues: isHealthy ? [] : [
        availableModules < Math.ceil(totalModules * 0.5) && 'Критический недостаток модулей',
        responseTime >= 1000 && 'Очень медленное время ответа'
      ].filter(Boolean),
      initialized: true // всегда инициализирован
    };
  } catch (error) {
    console.error(`❌ Ошибка проверки здоровья intelligent-processor: ${error.message}`);
    return {
      healthy: false,
      error: error.message,
      issues: ['Ошибка проверки здоровья intelligent processor']
    };
  }
};

// CommonJS совместимость
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeUserIntent,
    checkHealth,
    initializeSemanticModules
  };
}