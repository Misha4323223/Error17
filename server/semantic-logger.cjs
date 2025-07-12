
/**
 * Оптимизированная система логирования для семантических модулей
 * Убирает 80% шума при сохранении важной информации
 */

// Уровни логирования
const LOG_LEVELS = {
  ERROR: 0,    // Только критические ошибки
  WARN: 1,     // Предупреждения
  INFO: 2,     // Важная информация
  DEBUG: 3,    // Отладочная информация
  TRACE: 4     // Детальная трассировка
};

// Текущий уровень (можно менять через переменные окружения)
const CURRENT_LEVEL = process.env.SEMANTIC_LOG_LEVEL ? 
  parseInt(process.env.SEMANTIC_LOG_LEVEL) : LOG_LEVELS.WARN;

// Флаги для отключения шумных модулей
const MODULE_FLAGS = {
  QUANTUM: process.env.DEBUG_QUANTUM === 'true',
  BIOMIMETIC: process.env.DEBUG_BIOMIMETIC === 'true', 
  TELEPATHY: process.env.DEBUG_TELEPATHY === 'true',
  NEURAL: process.env.DEBUG_NEURAL === 'true',
  TEMPORAL: process.env.DEBUG_TEMPORAL === 'true'
};

class OptimizedSemanticLogger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.messageCount = 0;
    this.startTime = Date.now();
  }

  // Критические ошибки - всегда показываем
  error(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
      const timestamp = new Date().toISOString();
      console.error(`❌ [${timestamp}] ${this.moduleName}: ${message}`, data || '');
    }
  }

  // Предупреждения - показываем по умолчанию
  warn(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
      const timestamp = new Date().toISOString();
      console.warn(`⚠️ [${timestamp}] ${this.moduleName}: ${message}`, data || '');
    }
  }

  // Важная информация - показываем только основное
  info(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      this.messageCount++;
      // Ограничиваем количество информационных сообщений
      if (this.messageCount <= 5 || this.messageCount % 10 === 0) {
        const timestamp = new Date().toISOString();
        console.log(`ℹ️ [${timestamp}] ${this.moduleName}: ${message}`, data || '');
      }
    }
  }

  // Отладка - только при явном включении
  debug(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] ${this.moduleName}: ${message}`, data || '');
    }
  }

  // Детальная трассировка - только для разработки
  trace(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.TRACE) {
      const timestamp = new Date().toISOString();
      console.log(`🔬 [${timestamp}] ${this.moduleName}: ${message}`, data || '');
    }
  }

  // Специальные методы для семантических модулей
  semantic(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      const timestamp = new Date().toISOString();
      console.log(`🧠 [${timestamp}] SEMANTIC-${this.moduleName}: ${message}`, data || '');
    }
  }

  quantum(message, data) {
    if (MODULE_FLAGS.QUANTUM && CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`⚛️ [${timestamp}] QUANTUM-${this.moduleName}: ${message}`, data || '');
    }
  }

  biomimetic(message, data) {
    if (MODULE_FLAGS.BIOMIMETIC && CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`🦋 [${timestamp}] BIOMIMETIC-${this.moduleName}: ${message}`, data || '');
    }
  }

  telepathy(message, data) {
    if (MODULE_FLAGS.TELEPATHY && CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`🔮 [${timestamp}] TELEPATHY-${this.moduleName}: ${message}`, data || '');
    }
  }

  neural(message, data) {
    if (MODULE_FLAGS.NEURAL && CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`🧠⚡ [${timestamp}] NEURAL-${this.moduleName}: ${message}`, data || '');
    }
  }

  temporal(message, data) {
    if (MODULE_FLAGS.TEMPORAL && CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`⚡ [${timestamp}] TEMPORAL-${this.moduleName}: ${message}`, data || '');
    }
  }

  // Специальный метод для интеграционных сообщений
  integration(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      const timestamp = new Date().toISOString();
      console.log(`🔗 [${timestamp}] INTEGRATION-${this.moduleName}: ${message}`, data || '');
    }
  }

  // Сводка использования логгера
  getSummary() {
    const runtime = Date.now() - this.startTime;
    return {
      module: this.moduleName,
      messageCount: this.messageCount,
      runtime: `${runtime}ms`,
      level: Object.keys(LOG_LEVELS)[CURRENT_LEVEL]
    };
  }
}

// Фабрика логгеров
function createLogger(moduleName) {
  return new OptimizedSemanticLogger(moduleName);
}

// Экспорт
module.exports = {
  createLogger,
  LOG_LEVELS,
  CURRENT_LEVEL,
  MODULE_FLAGS,
  OptimizedSemanticLogger
};
