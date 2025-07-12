
/**
 * 🧠 MEMORY MONITOR - Система управления памятью для нейросети
 * Проверка доступной памяти и автоматический выбор lite/full режима
 */

const os = require('os');

class MemoryMonitor {
  constructor() {
    this.memoryThresholds = {
      critical: 0.9,     // 90% - критический уровень
      warning: 0.8,      // 80% - предупреждение
      safe: 0.6,         // 60% - безопасный уровень
      liteMode: 0.7      // 70% - переключение на LITE режим
    };
    
    this.monitoring = false;
    this.monitoringInterval = null;
    this.memoryHistory = [];
    this.maxHistoryLength = 20;
    
    console.log('🧠 Memory Monitor инициализирован');
  }

  /**
   * Получает текущее состояние памяти
   */
  getCurrentMemoryStatus() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercent = usedMemory / totalMemory;
    
    return {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      usagePercent: usagePercent,
      totalMB: Math.round(totalMemory / (1024 * 1024)),
      freeMB: Math.round(freeMemory / (1024 * 1024)),
      usedMB: Math.round(usedMemory / (1024 * 1024)),
      usagePercentFormatted: `${(usagePercent * 100).toFixed(1)}%`
    };
  }

  /**
   * Проверяет, достаточно ли памяти для полной нейросети
   */
  canLoadFullNeural() {
    const memStatus = this.getCurrentMemoryStatus();
    
    // Полная нейросеть требует ~441MB + буфер
    const fullNeuralRequirement = 500; // MB
    const availableMemory = memStatus.freeMB;
    
    console.log(`🔍 Проверка памяти для FULL нейросети:`);
    console.log(`   Доступно: ${availableMemory}MB`);
    console.log(`   Требуется: ${fullNeuralRequirement}MB`);
    console.log(`   Использование: ${memStatus.usagePercentFormatted}`);
    
    const canLoad = availableMemory >= fullNeuralRequirement && 
                   memStatus.usagePercent < this.memoryThresholds.liteMode;
    
    console.log(`   Результат: ${canLoad ? '✅ Можно загрузить FULL' : '⚡ Только LITE режим'}`);
    
    return canLoad;
  }

  /**
   * Автоматически выбирает режим нейросети
   */
  recommendNeuralMode() {
    const memStatus = this.getCurrentMemoryStatus();
    
    if (memStatus.usagePercent > this.memoryThresholds.critical) {
      return {
        mode: 'emergency',
        reason: 'Критический уровень памяти',
        action: 'Не загружать нейросеть'
      };
    }
    
    if (memStatus.usagePercent > this.memoryThresholds.liteMode || !this.canLoadFullNeural()) {
      return {
        mode: 'lite',
        reason: 'Недостаточно памяти для полной версии',
        action: 'Загрузить LITE нейросеть'
      };
    }
    
    return {
      mode: 'full',
      reason: 'Достаточно памяти для полной версии',
      action: 'Загрузить FULL нейросеть'
    };
  }

  /**
   * Запускает мониторинг памяти
   */
  startMonitoring(callback = null) {
    if (this.monitoring) {
      console.log('⚠️ Мониторинг уже запущен');
      return;
    }
    
    console.log('🔄 Запуск мониторинга памяти...');
    this.monitoring = true;
    
    this.monitoringInterval = setInterval(() => {
      const memStatus = this.getCurrentMemoryStatus();
      
      // Добавляем в историю
      this.memoryHistory.push({
        timestamp: Date.now(),
        ...memStatus
      });
      
      // Ограничиваем историю
      if (this.memoryHistory.length > this.maxHistoryLength) {
        this.memoryHistory.shift();
      }
      
      // Проверяем критические уровни
      if (memStatus.usagePercent > this.memoryThresholds.critical) {
        console.log(`🚨 КРИТИЧЕСКИЙ уровень памяти: ${memStatus.usagePercentFormatted}`);
        if (callback) callback('critical', memStatus);
      } else if (memStatus.usagePercent > this.memoryThresholds.warning) {
        console.log(`⚠️ Высокий уровень памяти: ${memStatus.usagePercentFormatted}`);
        if (callback) callback('warning', memStatus);
      }
      
    }, 5000); // Проверяем каждые 5 секунд
    
    console.log('✅ Мониторинг памяти запущен (интервал: 5 сек)');
  }

  /**
   * Останавливает мониторинг
   */
  stopMonitoring() {
    if (!this.monitoring) return;
    
    clearInterval(this.monitoringInterval);
    this.monitoring = false;
    console.log('🛑 Мониторинг памяти остановлен');
  }

  /**
   * Принудительная очистка памяти
   */
  forceGarbageCollection() {
    console.log('🗑️ Принудительная очистка памяти...');
    
    if (global.gc) {
      global.gc();
      console.log('✅ Garbage collection выполнен');
    } else {
      console.log('⚠️ Garbage collection недоступен (запустите с --expose-gc)');
    }
    
    // Дополнительная очистка для Node.js
    if (process.memoryUsage) {
      const beforeCleanup = process.memoryUsage();
      
      // Очищаем возможные кеши
      if (require.cache) {
        Object.keys(require.cache).forEach(key => {
          if (key.includes('temp') || key.includes('cache')) {
            delete require.cache[key];
          }
        });
      }
      
      const afterCleanup = process.memoryUsage();
      const freedMB = (beforeCleanup.heapUsed - afterCleanup.heapUsed) / (1024 * 1024);
      
      console.log(`🔄 Освобождено heap памяти: ${freedMB.toFixed(2)}MB`);
    }
  }

  /**
   * Проверяет безопасность загрузки с заданным размером
   */
  isSafeToLoad(estimatedSizeMB) {
    const memStatus = this.getCurrentMemoryStatus();
    const afterLoadUsage = (memStatus.usedMB + estimatedSizeMB) / memStatus.totalMB;
    
    return {
      safe: afterLoadUsage < this.memoryThresholds.safe,
      warning: afterLoadUsage < this.memoryThresholds.warning,
      critical: afterLoadUsage < this.memoryThresholds.critical,
      estimatedUsage: afterLoadUsage,
      estimatedUsagePercent: `${(afterLoadUsage * 100).toFixed(1)}%`
    };
  }

  /**
   * Получает детальную статистику
   */
  getDetailedStats() {
    const current = this.getCurrentMemoryStatus();
    const recommendation = this.recommendNeuralMode();
    
    return {
      current: current,
      recommendation: recommendation,
      monitoring: this.monitoring,
      history: this.memoryHistory.slice(-10), // Последние 10 записей
      thresholds: this.memoryThresholds,
      processMemory: process.memoryUsage ? process.memoryUsage() : null
    };
  }

  /**
   * Создает паузу для освобождения event loop
   */
  async createEventLoopBreak(durationMs = 100) {
    return new Promise(resolve => setTimeout(resolve, durationMs));
  }

  /**
   * Проверяет тренд использования памяти
   */
  getMemoryTrend() {
    if (this.memoryHistory.length < 3) {
      return { trend: 'insufficient_data', direction: 'unknown' };
    }
    
    const recent = this.memoryHistory.slice(-3);
    const trend = recent[2].usagePercent - recent[0].usagePercent;
    
    return {
      trend: trend > 0.05 ? 'increasing' : trend < -0.05 ? 'decreasing' : 'stable',
      direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
      changePercent: (trend * 100).toFixed(2)
    };
  }
}

// Создаем глобальный экземпляр
const globalMemoryMonitor = new MemoryMonitor();

// Автоматически запускаем мониторинг
globalMemoryMonitor.startMonitoring((level, status) => {
  if (level === 'critical') {
    console.log('🚨 АВТОМАТИЧЕСКАЯ ОЧИСТКА ПАМЯТИ');
    globalMemoryMonitor.forceGarbageCollection();
  }
});

module.exports = {
  MemoryMonitor,
  getGlobalMemoryMonitor: () => globalMemoryMonitor
};
