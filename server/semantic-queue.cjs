
/**
 * Глобальная система очередей для семантических модулей
 * Управляет выполнением задач всех 40+ компонентов
 */

const { createLogger } = require('./semantic-logger.cjs');
const logger = createLogger('SEMANTIC-QUEUE');

class SemanticQueueManager {
  constructor() {
    this.queues = new Map();
    this.workers = new Map();
    this.stats = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageWaitTime: 0,
      averageExecutionTime: 0
    };
    
    this.config = {
      maxConcurrentTasks: 5,
      maxQueueSize: 100,
      defaultTimeout: 30000, // 30 секунд
      retryAttempts: 3
    };
    
    this.initializeDefaultQueues();
    logger.info('Система семантических очередей инициализирована');
  }

  /**
   * Инициализирует очереди по умолчанию
   */
  initializeDefaultQueues() {
    const defaultQueues = [
      'semantic-analysis',
      'quantum-processing',
      'biomimetic-analysis',
      'creative-engine',
      'emotional-analysis',
      'telepathy-analysis',
      'intuition-analysis',
      'temporal-analysis',
      'universal-analysis',
      'divine-analysis',
      'main-semantic-analysis'
    ];
    
    defaultQueues.forEach(queueName => {
      this.createQueue(queueName, {
        maxConcurrent: 2,
        maxSize: 50
      });
    });
  }

  /**
   * Создает новую очередь
   */
  createQueue(name, options = {}) {
    const queueConfig = {
      maxConcurrent: options.maxConcurrent || 2,
      maxSize: options.maxSize || 20,
      timeout: options.timeout || this.config.defaultTimeout,
      retryAttempts: options.retryAttempts || this.config.retryAttempts
    };
    
    this.queues.set(name, {
      name,
      config: queueConfig,
      tasks: [],
      running: new Set(),
      stats: {
        total: 0,
        completed: 0,
        failed: 0,
        avgWaitTime: 0,
        avgExecutionTime: 0
      }
    });
    
    logger.info(`Создана очередь: ${name} (макс. одновременно: ${queueConfig.maxConcurrent})`);
  }

  /**
   * Добавляет задачу в очередь
   */
  async addTask(queueName, taskFunction, options = {}) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Очередь ${queueName} не существует`);
    }
    
    // Проверяем лимит размера очереди
    if (queue.tasks.length >= queue.config.maxSize) {
      throw new Error(`Очередь ${queueName} переполнена (${queue.tasks.length}/${queue.config.maxSize})`);
    }
    
    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      function: taskFunction,
      options: {
        priority: options.priority || 1,
        timeout: options.timeout || queue.config.timeout,
        retryAttempts: options.retryAttempts || queue.config.retryAttempts,
        ...options
      },
      created: Date.now(),
      attempts: 0,
      promise: null,
      resolve: null,
      reject: null
    };
    
    // Создаем промис для ожидания выполнения
    task.promise = new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
    });
    
    // Вставляем задачу в очередь с учетом приоритета
    this.insertTaskByPriority(queue, task);
    
    queue.stats.total++;
    this.stats.totalTasks++;
    
    logger.debug(`Задача ${task.id} добавлена в очередь ${queueName} (приоритет: ${task.options.priority})`);
    
    // Запускаем обработку очереди
    this.processQueue(queueName);
    
    return task.promise;
  }

  /**
   * Вставляет задачу в очередь с учетом приоритета
   */
  insertTaskByPriority(queue, task) {
    const priority = task.options.priority;
    let insertIndex = queue.tasks.length;
    
    // Ищем позицию для вставки (сортировка по убыванию приоритета)
    for (let i = 0; i < queue.tasks.length; i++) {
      if (queue.tasks[i].options.priority < priority) {
        insertIndex = i;
        break;
      }
    }
    
    queue.tasks.splice(insertIndex, 0, task);
  }

  /**
   * Обрабатывает очередь
   */
  async processQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) return;
    
    // Проверяем, можем ли запустить новые задачи
    if (queue.running.size >= queue.config.maxConcurrent) {
      return;
    }
    
    // Берем следующую задачу
    const task = queue.tasks.shift();
    if (!task) return;
    
    queue.running.add(task.id);
    
    try {
      await this.executeTask(queue, task);
    } catch (error) {
      logger.error(`Ошибка выполнения задачи ${task.id}:`, error);
    } finally {
      queue.running.delete(task.id);
      
      // Запускаем следующую задачу
      setImmediate(() => this.processQueue(queueName));
    }
  }

  /**
   * Выполняет задачу
   */
  async executeTask(queue, task) {
    const startTime = Date.now();
    const waitTime = startTime - task.created;
    
    task.attempts++;
    
    logger.debug(`Выполнение задачи ${task.id} (попытка ${task.attempts}/${task.options.retryAttempts + 1})`);
    
    try {
      // Устанавливаем таймаут
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Task timeout')), task.options.timeout);
      });
      
      // Выполняем задачу с таймаутом
      const result = await Promise.race([
        task.function(),
        timeoutPromise
      ]);
      
      const executionTime = Date.now() - startTime;
      
      // Обновляем статистику
      queue.stats.completed++;
      queue.stats.avgWaitTime = (queue.stats.avgWaitTime + waitTime) / 2;
      queue.stats.avgExecutionTime = (queue.stats.avgExecutionTime + executionTime) / 2;
      
      this.stats.completedTasks++;
      this.stats.averageWaitTime = (this.stats.averageWaitTime + waitTime) / 2;
      this.stats.averageExecutionTime = (this.stats.averageExecutionTime + executionTime) / 2;
      
      logger.debug(`Задача ${task.id} выполнена за ${executionTime}мс (ожидание: ${waitTime}мс)`);
      
      task.resolve(result);
      
    } catch (error) {
      // Повторяем при ошибке
      if (task.attempts <= task.options.retryAttempts) {
        logger.warn(`Повтор задачи ${task.id} (попытка ${task.attempts}/${task.options.retryAttempts + 1}): ${error.message}`);
        
        // Добавляем задачу обратно в очередь с задержкой
        setTimeout(() => {
          this.insertTaskByPriority(queue, task);
          this.processQueue(queue.name);
        }, 1000 * task.attempts); // Экспоненциальная задержка
        
        return;
      }
      
      // Окончательная ошибка
      queue.stats.failed++;
      this.stats.failedTasks++;
      
      logger.error(`Задача ${task.id} окончательно не выполнена: ${error.message}`);
      task.reject(error);
    }
  }

  /**
   * Получает статистику очередей
   */
  getStats() {
    const queueStats = {};
    
    for (const [name, queue] of this.queues.entries()) {
      queueStats[name] = {
        ...queue.stats,
        pending: queue.tasks.length,
        running: queue.running.size,
        maxConcurrent: queue.config.maxConcurrent
      };
    }
    
    return {
      global: this.stats,
      queues: queueStats,
      totalActiveQueues: this.queues.size,
      totalPendingTasks: Array.from(this.queues.values()).reduce((sum, q) => sum + q.tasks.length, 0),
      totalRunningTasks: Array.from(this.queues.values()).reduce((sum, q) => sum + q.running.size, 0)
    };
  }

  /**
   * Проверяет здоровье системы очередей
   */
  checkHealth() {
    const stats = this.getStats();
    const issues = [];
    
    // Проверяем глобальную статистику
    if (stats.global.failedTasks / stats.global.totalTasks > 0.1) {
      issues.push(`Высокий процент ошибок: ${((stats.global.failedTasks / stats.global.totalTasks) * 100).toFixed(1)}%`);
    }
    
    if (stats.global.averageWaitTime > 5000) {
      issues.push(`Высокое время ожидания: ${stats.global.averageWaitTime}мс`);
    }
    
    if (stats.totalPendingTasks > 50) {
      issues.push(`Много ожидающих задач: ${stats.totalPendingTasks}`);
    }
    
    // Проверяем отдельные очереди
    for (const [queueName, queueStats] of Object.entries(stats.queues)) {
      if (queueStats.pending > 20) {
        issues.push(`Очередь ${queueName} переполнена: ${queueStats.pending} задач`);
      }
      
      if (queueStats.failed / queueStats.total > 0.2) {
        issues.push(`Очередь ${queueName} имеет высокий процент ошибок: ${((queueStats.failed / queueStats.total) * 100).toFixed(1)}%`);
      }
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      stats
    };
  }

  /**
   * Очищает очередь
   */
  clearQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) return false;
    
    // Отклоняем все ожидающие задачи
    queue.tasks.forEach(task => {
      task.reject(new Error('Queue cleared'));
    });
    
    queue.tasks = [];
    logger.info(`Очередь ${queueName} очищена`);
    
    return true;
  }

  /**
   * Останавливает все очереди
   */
  shutdown() {
    for (const [queueName] of this.queues.entries()) {
      this.clearQueue(queueName);
    }
    
    logger.info('Система очередей остановлена');
  }
}

// Создаем глобальный экземпляр
const globalQueueManager = new SemanticQueueManager();

module.exports = {
  globalQueueManager,
  SemanticQueueManager
};
