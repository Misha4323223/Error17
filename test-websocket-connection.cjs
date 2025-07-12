#!/usr/bin/env node

/**
 * 🧪 ТЕСТ WEBSOCKET ПОДКЛЮЧЕНИЯ
 * Проверяем подключение WebSocket к серверу напрямую
 */

const WebSocket = require('ws');

async function testWebSocketConnection() {
  console.log('🔍 Тестирование WebSocket подключения...');
  
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:5000/api/ws');
    
    const timeout = setTimeout(() => {
      console.log('❌ Таймаут подключения WebSocket');
      ws.close();
      reject(new Error('Connection timeout'));
    }, 10000);
    
    ws.on('open', () => {
      console.log('✅ WebSocket подключен!');
      clearTimeout(timeout);
      
      // Отправляем тестовое сообщение
      const testMessage = {
        type: 'neural_client_ready',
        timestamp: new Date().toISOString(),
        test: true
      };
      
      console.log('📡 Отправляем тестовое сообщение:', testMessage);
      ws.send(JSON.stringify(testMessage));
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('📨 Получено сообщение:', message);
        
        if (message.type === 'connection_established') {
          console.log('🎉 Подключение установлено!');
          console.log('📊 Количество клиентов:', message.clientsCount);
          console.log('🆔 ID сервера:', message.serverId);
        }
      } catch (error) {
        console.error('❌ Ошибка парсинга сообщения:', error);
      }
    });
    
    ws.on('error', (error) => {
      console.error('❌ WebSocket ошибка:', error.message);
      clearTimeout(timeout);
      reject(error);
    });
    
    ws.on('close', (code, reason) => {
      console.log(`🔌 WebSocket закрыт: код ${code}, причина: ${reason?.toString() || 'неизвестно'}`);
      clearTimeout(timeout);
      resolve();
    });
    
    // Закрываем соединение через 5 секунд
    setTimeout(() => {
      console.log('🔄 Закрываем тестовое соединение');
      ws.close();
    }, 5000);
  });
}

// Запускаем тест
testWebSocketConnection()
  .then(() => {
    console.log('✅ Тест WebSocket завершен');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Тест WebSocket провален:', error.message);
    process.exit(1);
  });