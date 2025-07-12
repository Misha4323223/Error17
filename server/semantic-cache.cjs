
/**
 * Глобальная система кэширования для семантических модулей
 * Оптимизирует производительность всех 40+ компонентов
 */

const { createLogger } = require('./semantic-logger.cjs');
const logger = createLogger('SEMANTIC-CACHE');

class SemanticCache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      totalSize: 0
    };
    
    this.config = {
      maxSize: 1000, // Максимум записей
      maxMemory: 100 * 1024 * 1024, // 100MB
      defaultTTL: 300000, // 5 минут
      cleanupInterval: 60000 // 1 минута
    };
    
    this.startCleanupTimer();
    logger.info('Система семантического кэширования инициализирована');
  }

  /**
   * Получает значение из кэша
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Проверяем срок действия
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      return null;
    }
    
    // Обновляем время последнего доступа
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    
    logger.debug(`Cache HIT для ключа: ${key.substring(0, 50)}...`);
    return entry.value;
  }

  /**
   * Сохраняет значение в кэш
   */
  set(key, value, ttl = this.config.defaultTTL) {
    // Проверяем лимиты памяти
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    
    const entry = {
      value: value,
      created: Date.now(),
      expires: Date.now() + ttl,
      lastAccessed: Date.now(),
      size: this.estimateSize(value),
      accessCount: 0,
      category: this.categorizeValue(value)
    };
    
    this.cache.set(key, entry);
    this.stats.sets++;
    this.stats.totalSize += entry.size;
    
    logger.debug(`Cache SET для ключа: ${key.substring(0, 50)}... (TTL: ${ttl}мс, категория: ${entry.category})`);
    
    return true;
  }

  /**
   * Кэширует результат семантического анализа
   */
  cacheSemanticAnalysis(userMessage, context, result) {
    const key = this.generateSemanticKey(userMessage, context);
    const ttl = 600000; // 10 минут для семантики
    
    this.set(key, {
      type: 'semantic_analysis',
      userMessage,
      context,
      result,
      timestamp: Date.now()
    }, ttl);
    
    logger.info(`📊 Кэшируем семантический анализ для: "${userMessage.substring(0, 30)}..."`);
  }

  /**
   * Получает кэшированный семантический анализ
   */
  getCachedSemanticAnalysis(userMessage, context) {
    const key = this.generateSemanticKey(userMessage, context);
    const cached = this.get(key);
    
    if (cached && cached.type === 'semantic_analysis') {
      logger.info(`🎯 Найден кэшированный семантический анализ для: "${userMessage.substring(0, 30)}..."`);
      return cached.result;
    }
    
    return null;
  }

  /**
   * Кэширует результат модуля
   */
  cacheModuleResult(moduleName, input, result) {
    const key = this.generateModuleKey(moduleName, input);
    const ttl = this.getModuleTTL(moduleName);
    
    this.set(key, {
      type: 'module_result',
      moduleName,
      input,
      result,
      timestamp: Date.now()
    }, ttl);
    
    logger.info(`🔧 Кэшируем результат модуля ${moduleName}`);
  }

  /**
   * Получает кэшированный результат модуля
   */
  getCachedModuleResult(moduleName, input) {
    const key = this.generateModuleKey(moduleName, input);
    const cached = this.get(key);
    
    if (cached && cached.type === 'module_result' && cached.moduleName === moduleName) {
      logger.info(`⚡ Найден кэшированный результат модуля ${moduleName}`);
      return cached.result;
    }
    
    return null;
  }

  /**
   * Кэширует профиль пользователя
   */
  cacheUserProfile(userId, profile) {
    const key = `user_profile:${userId}`;
    const ttl = 3600000; // 1 час для профилей
    
    this.set(key, {
      type: 'user_profile',
      userId,
      profile,
      timestamp: Date.now()
    }, ttl);
    
    logger.info(`👤 Кэшируем профиль пользователя: ${userId}`);
  }

  /**
   * Получает кэшированный профиль пользователя
   */
  getCachedUserProfile(userId) {
    const key = `user_profile:${userId}`;
    const cached = this.get(key);
    
    if (cached && cached.type === 'user_profile') {
      logger.info(`👤 Найден кэшированный профиль пользователя: ${userId}`);
      return cached.profile;
    }
    
    return null;
  }

  /**
   * Кэширует контекст сессии
   */
  cacheSessionContext(sessionId, context) {
    const key = `session_context:${sessionId}`;
    const ttl = 1800000; // 30 минут для контекста сессии
    
    this.set(key, {
      type: 'session_context',
      sessionId,
      context,
      timestamp: Date.now()
    }, ttl);
    
    logger.info(`📋 Кэшируем контекст сессии: ${sessionId}`);
  }

  /**
   * Получает кэшированный контекст сессии
   */
  getCachedSessionContext(sessionId) {
    const key = `session_context:${sessionId}`;
    const cached = this.get(key);
    
    if (cached && cached.type === 'session_context') {
      logger.info(`📋 Найден кэшированный контекст сессии: ${sessionId}`);
      return cached.context;
    }
    
    return null;
  }

  /**
   * Генерирует ключ для семантического анализа
   */
  generateSemanticKey(userMessage, context) {
    const messageHash = this.hashString(userMessage);
    const contextHash = this.hashString(JSON.stringify(context));
    return `semantic:${messageHash}:${contextHash}`;
  }

  /**
   * Генерирует ключ для результата модуля
   */
  generateModuleKey(moduleName, input) {
    const inputHash = this.hashString(JSON.stringify(input));
    return `module:${moduleName}:${inputHash}`;
  }

  /**
   * Простое хеширование строки
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Конвертируем в 32-битное число
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Получает TTL для модуля
   */
  getModuleTTL(moduleName) {
    const moduleConfig = {
      'semantic-analyzer': 600000, // 10 минут
      'emotional-semantic-matrix': 300000, // 5 минут
      'meta-semantic-engine': 900000, // 15 минут
      'natural-language-generator': 180000, // 3 минуты
      'biomimetic-semantics': 1800000, // 30 минут
      'divine-semantics': 3600000, // 1 час
      'cognitive-dna-profiler': 1800000, // 30 минут
      'business-context-analyzer': 600000, // 10 минут
      'collective-semantic-wisdom': 1800000, // 30 минут
      'creative-semantic-engine': 300000, // 5 минут
      'cross-contextual-semantics': 900000, // 15 минут
      'autonomous-learning-engine': 1200000 // 20 минут
    };
    
    return moduleConfig[moduleName] || this.config.defaultTTL;
  }

  /**
   * Категоризирует значение для кэша
   */
  categorizeValue(value) {
    if (value && typeof value === 'object') {
      if (value.type) {
        return value.type;
      } else if (value.semantics) {
        return 'semantic_data';
      } else if (value.emotions) {
        return 'emotional_data';
      } else if (value.profile) {
        return 'user_data';
      } else if (value.context) {
        return 'context_data';
      }
    }
    return 'general';
  }

  /**
   * Удаляет запись из кэша
   */
  delete(key) {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.totalSize -= entry.size;
      this.cache.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Очищает весь кэш
   */
  clear() {
    this.cache.clear();
    this.stats.totalSize = 0;
    this.stats.evictions += this.cache.size;
    logger.info('Кэш полностью очищен');
  }

  /**
   * Удаляет самые старые записи
   */
  evictOldest() {
    const entries = Array.from(this.cache.entries());
    
    // Сортируем по времени последнего доступа
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Удаляем 10% самых старых записей
    const toEvict = Math.max(1, Math.floor(entries.length * 0.1));
    
    for (let i = 0; i < toEvict; i++) {
      const [key, entry] = entries[i];
      this.stats.totalSize -= entry.size;
      this.cache.delete(key);
      this.stats.evictions++;
    }
    
    logger.info(`Удалено ${toEvict} старых записей из кэша`);
  }

  /**
   * Оценивает размер объекта в байтах
   */
  estimateSize(obj) {
    try {
      return JSON.stringify(obj).length * 2; // Приблизительно UTF-16
    } catch (error) {
      return 1024; // Дефолтный размер для сложных объектов
    }
  }

  /**
   * Очищает просроченные записи
   */
  cleanupExpired() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.stats.totalSize -= entry.size;
        this.cache.delete(key);
        this.stats.evictions++;
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      logger.info(`Очищено ${cleaned} просроченных записей`);
    }
  }

  /**
   * Запускает таймер очистки
   */
  startCleanupTimer() {
    setInterval(() => {
      this.cleanupExpired();
    }, this.config.cleanupInterval);
  }

  /**
   * Получает статистику кэша
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? this.stats.hits / (this.stats.hits + this.stats.misses) 
      : 0;
    
    return {
      ...this.stats,
      hitRate: parseFloat((hitRate * 100).toFixed(2)),
      size: this.cache.size,
      memoryUsage: this.stats.totalSize,
      memoryUsageMB: parseFloat((this.stats.totalSize / 1024 / 1024).toFixed(2))
    };
  }

  /**
   * Проверяет здоровье кэша
   */
  checkHealth() {
    const stats = this.getStats();
    const issues = [];
    
    if (stats.hitRate < 30) {
      issues.push(`Низкий hit rate: ${stats.hitRate}%`);
    }
    
    if (stats.memoryUsageMB > 80) {
      issues.push(`Высокое использование памяти: ${stats.memoryUsageMB}MB`);
    }
    
    if (stats.size > this.config.maxSize * 0.9) {
      issues.push(`Кэш почти заполнен: ${stats.size}/${this.config.maxSize}`);
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      stats
    };
  }
}

// Создаем глобальный экземпляр
const globalSemanticCache = new SemanticCache();

module.exports = {
  globalSemanticCache,
  SemanticCache
};
