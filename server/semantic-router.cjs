/**
 * 🎯 SEMANTIC ROUTER - УМНЫЙ ДИСПЕТЧЕР ЗАПРОСОВ
 * Анализирует сложность запросов и выбирает оптимальную стратегию обработки
 * Интегрируется с существующей архитектурой как pre-processor
 */

const SmartLogger = {
  router: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎯 [${timestamp}] SEMANTIC-ROUTER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  analysis: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`📊 [${timestamp}] COMPLEXITY-ANALYSIS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  decision: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] ROUTING-DECISION: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

class SemanticRouter {
  constructor() {
    this.name = 'SemanticRouter';
    this.version = '1.0.0';
    this.isInitialized = false;
    
    // Конфигурация анализа сложности
    this.complexityConfig = {
      // Простые запросы (0.0-0.3)
      simple: {
        keywords: ['привет', 'как дела', 'спасибо', 'пока', 'да', 'нет', 'ок'],
        patterns: [/^.{1,20}$/, /^(привет|здравствуйте|спасибо|пока)$/i],
        timeLimit: 500,
        preferredProviders: ['Chat-Memory', 'ChatFree'],
        skipProviders: ['ConversationEngine-Semantic', 'Neural-Integration']
      },
      
      // Средние запросы (0.3-0.7)
      medium: {
        keywords: ['расскажи', 'объясни', 'помоги', 'создай', 'сделай'],
        patterns: [/^.{20,100}$/, /\b(как|что|где|когда|почему)\b/i],
        timeLimit: 5000,
        preferredProviders: ['ConversationEngine-Semantic', 'Intelligent-Processor'],
        skipProviders: []
      },
      
      // Сложные запросы (0.7-1.0)
      complex: {
        keywords: ['анализ', 'исследование', 'проектирование', 'оптимизация', 'алгоритм'],
        patterns: [/^.{100,}$/, /\b(анализ|исследование|проект|система|архитектура)\b/i],
        timeLimit: 30000,
        preferredProviders: ['ConversationEngine-Semantic', 'Intelligent-Processor', 'Neural-Integration'],
        requireAllProviders: true,
        useNeural: true
      }
    };
    
    // Специальные категории
    this.specialCategories = {
      embroidery: {
        keywords: ['вышивка', 'dst', 'pes', 'jef', 'вышивальная', 'стежок'],
        complexity: 0.8,
        preferredProviders: ['ConversationEngine-Semantic'],
        useNeural: true
      },
      
      vectorization: {
        keywords: ['svg', 'векторизация', 'вектор', 'контур', 'path'],
        complexity: 0.7,
        preferredProviders: ['ConversationEngine-Semantic'],
        useNeural: false
      },
      
      generation: {
        keywords: ['создай изображение', 'нарисуй', 'сгенерируй', 'картинка'],
        complexity: 0.6,
        preferredProviders: ['Intelligent-Processor'],
        useNeural: false
      },
      
      knowledge: {
        keywords: ['расскажи про', 'что такое', 'как работает', 'объясни'],
        complexity: 0.5,
        preferredProviders: ['ConversationEngine-Semantic'],
        useNeural: true
      }
    };
    
    this.isInitialized = true;
    SmartLogger.router('Semantic Router инициализирован');
  }

  /**
   * Главный метод анализа и маршрутизации
   */
  async analyzeAndRoute(query, options = {}) {
    SmartLogger.router(`Анализ запроса: "${query.substring(0, 100)}${query.length > 100 ? '...' : ''}"`);
    
    try {
      // 1. Анализ сложности
      const complexity = this.analyzeComplexity(query);
      SmartLogger.analysis(`Сложность запроса: ${complexity.toFixed(2)}`);
      
      // 2. Определение специальной категории
      const specialCategory = this.detectSpecialCategory(query);
      if (specialCategory) {
        SmartLogger.analysis(`Специальная категория: ${specialCategory.name}`);
      }
      
      // 3. Выбор стратегии маршрутизации
      const routingStrategy = this.selectRoutingStrategy(complexity, specialCategory, options);
      SmartLogger.decision(`Стратегия: ${routingStrategy.mode}`, routingStrategy);
      
      // 4. Создание routing hints
      const routingHints = this.createRoutingHints(complexity, specialCategory, routingStrategy);
      
      const result = {
        complexity,
        specialCategory: specialCategory?.name || null,
        routingStrategy: routingStrategy.mode,
        routingHints,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - Date.now() // Будет обновлено
      };
      
      SmartLogger.router('Маршрутизация завершена', result);
      return result;
      
    } catch (error) {
      SmartLogger.router('Ошибка анализа:', error.message);
      
      // Fallback стратегия
      return {
        complexity: 0.5,
        specialCategory: null,
        routingStrategy: 'standard',
        routingHints: {
          preferredProviders: ['ConversationEngine-Semantic'],
          timeLimit: 10000,
          useNeural: false,
          mode: 'standard'
        },
        error: error.message
      };
    }
  }

  /**
   * Анализ сложности запроса (0.0 - 1.0)
   */
  analyzeComplexity(query) {
    let complexity = 0.0;
    const lowerQuery = query.toLowerCase();
    
    // Базовая сложность по длине
    if (query.length < 20) complexity += 0.1;
    else if (query.length < 50) complexity += 0.3;
    else if (query.length < 100) complexity += 0.5;
    else complexity += 0.7;
    
    // Анализ по ключевым словам
    Object.entries(this.complexityConfig).forEach(([level, config]) => {
      const keywordMatches = config.keywords.filter(keyword => 
        lowerQuery.includes(keyword)
      ).length;
      
      const patternMatches = config.patterns.filter(pattern => 
        pattern.test(query)
      ).length;
      
      if (keywordMatches > 0) {
        if (level === 'simple') complexity = Math.max(0.1, complexity - 0.2);
        else if (level === 'medium') complexity = Math.max(0.3, complexity);
        else if (level === 'complex') complexity = Math.max(0.7, complexity + 0.2);
      }
      
      if (patternMatches > 0) {
        if (level === 'simple') complexity = Math.max(0.1, complexity - 0.1);
        else if (level === 'medium') complexity = Math.max(0.3, complexity);
        else if (level === 'complex') complexity = Math.max(0.7, complexity + 0.1);
      }
    });
    
    // Анализ грамматической сложности
    const sentences = query.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const averageWordsPerSentence = query.split(/\s+/).length / Math.max(sentences.length, 1);
    
    if (averageWordsPerSentence > 15) complexity += 0.1;
    if (sentences.length > 3) complexity += 0.1;
    
    // Анализ специальных символов и форматирования
    if (/[{}[\]()"]/.test(query)) complexity += 0.1;
    if (query.includes('```') || query.includes('```')) complexity += 0.2;
    
    return Math.min(1.0, Math.max(0.0, complexity));
  }

  /**
   * Определение специальной категории запроса
   */
  detectSpecialCategory(query) {
    const lowerQuery = query.toLowerCase();
    
    for (const [categoryName, config] of Object.entries(this.specialCategories)) {
      const matches = config.keywords.filter(keyword => 
        lowerQuery.includes(keyword)
      ).length;
      
      if (matches > 0) {
        return {
          name: categoryName,
          ...config,
          matches
        };
      }
    }
    
    return null;
  }

  /**
   * Выбор стратегии маршрутизации
   */
  selectRoutingStrategy(complexity, specialCategory, options) {
    // Приоритет специальной категории
    if (specialCategory) {
      return {
        mode: 'specialized',
        category: specialCategory.name,
        complexity: specialCategory.complexity,
        reasoning: `Специализированная обработка для категории: ${specialCategory.name}`
      };
    }
    
    // Выбор по сложности
    if (complexity < 0.3) {
      return {
        mode: 'express',
        complexity,
        reasoning: 'Простой запрос - быстрая обработка'
      };
    }
    
    if (complexity > 0.7) {
      return {
        mode: 'expert',
        complexity,
        reasoning: 'Сложный запрос - полная обработка с нейросетью'
      };
    }
    
    return {
      mode: 'standard',
      complexity,
      reasoning: 'Стандартная обработка'
    };
  }

  /**
   * Создание routing hints для smart-router
   */
  createRoutingHints(complexity, specialCategory, routingStrategy) {
    const hints = {
      complexity,
      mode: routingStrategy.mode,
      preferredProviders: [],
      skipProviders: [],
      useNeural: false,
      timeLimit: 10000,
      reasoning: routingStrategy.reasoning
    };
    
    // Настройка по специальной категории
    if (specialCategory) {
      hints.preferredProviders = specialCategory.preferredProviders || [];
      hints.useNeural = specialCategory.useNeural || false;
      hints.timeLimit = specialCategory.timeLimit || 10000;
      return hints;
    }
    
    // Настройка по сложности
    if (complexity < 0.3) {
      hints.preferredProviders = ['Chat-Memory', 'ChatFree'];
      hints.skipProviders = ['ConversationEngine-Semantic', 'Neural-Integration'];
      hints.timeLimit = 1000;
      hints.useNeural = false;
    } else if (complexity < 0.7) {
      hints.preferredProviders = ['ConversationEngine-Semantic', 'Intelligent-Processor'];
      hints.timeLimit = 5000;
      hints.useNeural = false;
    } else {
      hints.preferredProviders = ['ConversationEngine-Semantic', 'Intelligent-Processor'];
      hints.requireAllProviders = true;
      hints.timeLimit = 30000;
      hints.useNeural = true;
    }
    
    return hints;
  }

  /**
   * Получение статистики работы
   */
  getStats() {
    return {
      name: this.name,
      version: this.version,
      isInitialized: this.isInitialized,
      categoriesCount: Object.keys(this.specialCategories).length,
      complexityLevels: Object.keys(this.complexityConfig).length
    };
  }
}

// Создаем глобальный экземпляр
const globalSemanticRouter = new SemanticRouter();

// Экспорты
module.exports = {
  SemanticRouter,
  globalSemanticRouter,
  analyzeAndRoute: (query, options) => globalSemanticRouter.analyzeAndRoute(query, options),
  analyzeComplexity: (query) => globalSemanticRouter.analyzeComplexity(query),
  getStats: () => globalSemanticRouter.getStats()
};

SmartLogger.router('Semantic Router модуль загружен');