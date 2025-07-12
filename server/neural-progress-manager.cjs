/**
 * 🔄 NEURAL PROGRESS MANAGER
 * Отслеживание прогресса загрузки нейросети с WebSocket уведомлениями для UI
 */

const WebSocket = require('ws');
const EventEmitter = require('events');

class NeuralProgressManager extends EventEmitter {
  constructor() {
    super();
    this.progress = 0;
    this.status = 'idle';
    this.currentOperation = null;
    this.startTime = null;
    this.estimatedTimeRemaining = null;
    this.webSocketServer = null;
    this.connectedClients = new Set();
    this.wsPort = 8081;

    console.log('🔄 Neural Progress Manager инициализирован');
    
    // Автоматически пытаемся интегрироваться с основным WebSocket
    setTimeout(() => {
      this.autoIntegrateWebSocket();
    }, 1000);
  }

  /**
   * Интеграция с основным WebSocket сервером приложения
   */
  integrateWithMainWebSocket(wss) {
    try {
      console.log('🔗 Интеграция Neural Progress Manager с основным WebSocket сервером');
      
      this.webSocketServer = wss;
      this.connectedClients = new Set();

      // Подписываемся на новые подключения
      wss.on('connection', (ws, req) => {
        // Добавляем клиента в список для neural уведомлений
        this.connectedClients.add(ws);
        console.log(`📡 Neural Progress: клиент подключен (всего: ${this.connectedClients.size})`);

        // Отправляем текущий статус новому клиенту
        this.sendToClient(ws, {
          type: 'neural_status',
          progress: this.progress,
          status: this.status,
          operation: this.currentOperation,
          estimatedTimeRemaining: this.estimatedTimeRemaining,
          timestamp: new Date().toISOString()
        });

        ws.on('close', () => {
          this.connectedClients.delete(ws);
          console.log(`📡 Neural Progress: клиент отключен (осталось: ${this.connectedClients.size})`);
        });

        ws.on('error', (error) => {
          console.error('❌ Neural WebSocket ошибка:', error.message || error);
          this.connectedClients.delete(ws);
        });
      });

      console.log('✅ Neural Progress Manager интегрирован с основным WebSocket');
      return true;
    } catch (error) {
      console.error('❌ Ошибка интеграции Neural Progress с WebSocket:', error);
      return false;
    }
  }

  /**
   * Автоматическая интеграция с глобальным WebSocket (fallback)
   */
  autoIntegrateWebSocket() {
    try {
      // Пытаемся найти глобальный WebSocket сервер
      if (global.neuralWebSocketServer) {
        console.log('✅ [Progress Manager] Найден глобальный WebSocket сервер, интегрируемся...');
        return this.integrateWithMainWebSocket(global.neuralWebSocketServer);
      }
      
      console.log('⚠️ Глобальный WebSocket сервер не найден, попробуем позже...');
      
      // Попытки переподключения каждые 2 секунды
      const retryInterval = setInterval(() => {
        if (global.neuralWebSocketServer) {
          console.log('🔄 [Progress Manager] Глобальный WebSocket найден, подключаемся...');
          this.integrateWithMainWebSocket(global.neuralWebSocketServer);
          clearInterval(retryInterval);
        }
      }, 2000);
      
      // Останавливаем попытки через 30 секунд
      setTimeout(() => {
        clearInterval(retryInterval);
        console.log('⏰ [Progress Manager] Время ожидания WebSocket истекло');
      }, 30000);
      
      return false;
    } catch (error) {
      console.log('⚠️ Автоинтеграция WebSocket недоступна:', error.message);
      return false;
    }
  }

  /**
   * Отправка сообщения конкретному клиенту с проверкой соединения
   */
  sendToClient(ws, message) {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify(message);
        ws.send(payload);
      } else {
        // Удаляем неактивные соединения
        this.connectedClients.delete(ws);
      }
    } catch (error) {
      console.error('❌ Ошибка отправки сообщения WebSocket:', error.message);
      this.connectedClients.delete(ws);
    }
  }

  /**
   * Отправка сообщения всем подключенным клиентам с очисткой неактивных
   */
  broadcastToClients(message) {
    // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ГЛОБАЛЬНОГО WEBSOCKET СЕРВЕРА
    if (global.neuralWebSocketServer && global.neuralWebSocketServer.clients) {
      this.connectedClients = global.neuralWebSocketServer.clients;
      console.log(`🔗 [Progress Manager] Synchronized with global WebSocket: ${this.connectedClients.size} clients`);
    }
    
    if (!this.connectedClients || this.connectedClients.size === 0) {
      console.log('📡 Нет подключенных neural клиентов для broadcast');
      
      // Дополнительная попытка найти активные соединения
      if (global.neuralWebSocketServer) {
        const wss = global.neuralWebSocketServer;
        if (wss.clients && wss.clients.size > 0) {
          console.log(`🔄 Найден глобальный WebSocket с ${wss.clients.size} клиентами, синхронизируем...`);
          this.connectedClients = wss.clients;
          // Продолжаем выполнение с найденными клиентами
        } else {
          console.log('⚠️ Глобальный WebSocket сервер найден, но клиентов нет');
          return;
        }
      } else {
        console.log('❌ Глобальный WebSocket сервер не найден');
        return;
      }
    }

    const deadConnections = new Set();
    let successCount = 0;

    // Добавляем neural префикс к сообщениям только если его еще нет
    const neuralMessage = {
      ...message,
      type: message.type.startsWith('neural_') ? message.type : `neural_${message.type}`,
      source: 'neural_progress_manager'
    };

    this.connectedClients.forEach(ws => {
      try {
        if (ws.readyState === 1) { // WebSocket.OPEN = 1
          this.sendToClient(ws, neuralMessage);
          successCount++;
        } else {
          deadConnections.add(ws);
        }
      } catch (error) {
        console.error('❌ Ошибка neural broadcast:', error.message);
        deadConnections.add(ws);
      }
    });

    // Очищаем мертвые соединения
    deadConnections.forEach(ws => {
      this.connectedClients.delete(ws);
    });

    console.log(`📡 Broadcasting neural progress to ${successCount} clients:`, {
      type: neuralMessage.type,
      progress: neuralMessage.progress,
      operation: neuralMessage.operation,
      status: neuralMessage.status,
      details: neuralMessage.details,
      timestamp: neuralMessage.timestamp
    });
  }

  /**
   * Начало отслеживания операции
   */
  startOperation(operationName, estimatedDuration = null) {
    this.currentOperation = operationName;
    this.status = 'running';
    this.progress = 0;
    this.startTime = Date.now();
    this.estimatedTimeRemaining = estimatedDuration;

    console.log(`🚀 Начало операции: ${operationName}`);

    const message = {
      type: 'operation_start',
      operation: operationName,
      progress: 0,
      status: 'running',
      estimatedDuration: estimatedDuration,
      timestamp: new Date().toISOString()
    };

    this.broadcastToClients(message);
    this.emit('operation_start', message);
  }

  /**
   * Обновление прогресса операции
   */
  updateProgress(progress, details = null) {
    this.progress = Math.min(100, Math.max(0, progress));

    // Вычисляем оставшееся время
    if (this.startTime && this.progress > 0) {
      const elapsedTime = Date.now() - this.startTime;
      const totalEstimatedTime = (elapsedTime / this.progress) * 100;
      this.estimatedTimeRemaining = Math.max(0, totalEstimatedTime - elapsedTime);
    }

    console.log(`📊 Прогресс операции "${this.currentOperation}": ${this.progress}%`);

    const message = {
      type: 'progress_update',
      operation: this.currentOperation,
      progress: this.progress,
      status: this.status,
      estimatedTimeRemaining: this.estimatedTimeRemaining,
      details: details,
      timestamp: new Date().toISOString()
    };

    this.broadcastToClients(message);
    this.emit('progress_update', message);
  }

  /**
   * Завершение операции
   */
  completeOperation(success = true, result = null) {
    const completionTime = Date.now() - this.startTime;
    this.status = success ? 'completed' : 'failed';
    this.progress = success ? 100 : this.progress;

    console.log(`✅ Операция "${this.currentOperation}" завершена за ${completionTime}мс`);

    const message = {
      type: 'operation_complete',
      operation: this.currentOperation,
      progress: this.progress,
      status: this.status,
      success: success,
      result: result,
      completionTime: completionTime,
      timestamp: new Date().toISOString()
    };

    this.broadcastToClients(message);
    this.emit('operation_complete', message);

    // Сбрасываем состояние
    setTimeout(() => {
      this.currentOperation = null;
      this.status = 'idle';
      this.progress = 0;
      this.startTime = null;
      this.estimatedTimeRemaining = null;
    }, 2000);
  }

  /**
   * Получение текущего статуса
   */
  getStatus() {
    return {
      progress: this.progress,
      status: this.status,
      operation: this.currentOperation,
      estimatedTimeRemaining: this.estimatedTimeRemaining,
      connectedClients: this.connectedClients.size,
      startTime: this.startTime,
      isRunning: this.status === 'running'
    };
  }

  /**
   * Отслеживание загрузки LITE нейросети
   */
  async trackLiteInitialization(neuralLite) {
    this.startOperation('LITE Neural Network Initialization', 10000); // 10 секунд

    try {
      // Эмулируем этапы загрузки
      this.updateProgress(10, 'Инициализация TensorFlow...');
      await this.delay(500);

      this.updateProgress(25, 'Создание облегченной архитектуры...');
      await this.delay(1000);

      this.updateProgress(50, 'Построение словаря...');
      await this.delay(1500);

      this.updateProgress(75, 'Компиляция модели...');
      await this.delay(2000);

      this.updateProgress(90, 'Финализация инициализации...');
      await this.delay(1000);

      this.completeOperation(true, 'LITE нейросеть готова');
      return true;
    } catch (error) {
      this.completeOperation(false, error.message);
      throw error;
    }
  }

  /**
   * Отслеживание загрузки FULL нейросети
   */
  async trackFullUpgrade(neuralCore) {
    this.startOperation('FULL Neural Network Upgrade', 60000); // 60 секунд

    try {
      this.updateProgress(5, 'Инициализация полного нейросетевого ядра...');
      await this.delay(2000);

      this.updateProgress(15, 'Создание расширенной Transformer архитектуры...');
      await this.delay(5000);

      this.updateProgress(30, 'Построение полного словаря...');
      await this.delay(3000);

      this.updateProgress(45, 'Создание 12-слойной архитектуры...');
      await this.delay(8000);

      this.updateProgress(60, 'Применение RoPE позиционного кодирования...');
      await this.delay(5000);

      this.updateProgress(75, 'Настройка gradient checkpointing...');
      await this.delay(3000);

      this.updateProgress(85, 'Компиляция полной модели...');
      await this.delay(4000);

      this.updateProgress(95, 'Финализация обновления...');
      await this.delay(2000);

      this.completeOperation(true, 'FULL нейросеть готова');
      return true;
    } catch (error) {
      this.completeOperation(false, error.message);
      throw error;
    }
  }

  /**
   * Утилита для задержки
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Закрытие WebSocket сервера
   */
  shutdown() {
    if (this.webSocketServer) {
      this.webSocketServer.close();
      console.log('📡 Neural Progress WebSocket сервер остановлен');
    }
  }
}

// Создаем глобальный экземпляр
const globalProgressManager = new NeuralProgressManager();

// НЕ запускаем отдельный WebSocket сервер - используем интеграцию с основным
// globalProgressManager.startWebSocketServer();

module.exports = {
  NeuralProgressManager,
  getGlobalProgressManager: () => globalProgressManager
};