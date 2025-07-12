/**
 * 🚀 ПРОСТОЙ ТЕСТ СЕРВЕРА
 * Минимальная версия для тестирования интеграции
 */

const http = require('http');

// Тест HTTP API
function testAPI() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5000/api/neural/status', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('✅ API работает:', parsed);
          resolve(parsed);
        } catch (error) {
          console.log('✅ API отвечает (не JSON):', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ API ошибка:', error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error('❌ API таймаут');
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

// Тест WebSocket
function testWebSocket() {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    const ws = new WebSocket('ws://localhost:5000/api/ws');

    let connected = false;

    ws.on('open', () => {
      console.log('✅ WebSocket подключен');
      connected = true;
      
      // Отправляем тестовое сообщение
      ws.send(JSON.stringify({
        type: 'ping',
        timestamp: new Date().toISOString()
      }));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('📨 WebSocket сообщение:', message);
        
        if (message.type === 'connection_established') {
          console.log('✅ Подтверждение подключения получено');
        }
      } catch (error) {
        console.log('📨 WebSocket данные:', data.toString());
      }
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket закрыт');
      if (connected) {
        resolve(true);
      } else {
        reject(new Error('WebSocket closed before connecting'));
      }
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket ошибка:', error.message);
      reject(error);
    });

    // Закрываем через 3 секунды
    setTimeout(() => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    }, 3000);
  });
}

// Тест Neural API
function testNeuralInit() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/neural/initialize-lite',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('✅ Neural Init результат:', parsed);
          resolve(parsed);
        } catch (error) {
          console.log('✅ Neural Init ответ:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Neural Init ошибка:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Запуск всех тестов
async function runTests() {
  console.log('🧪 Запуск комплексного теста сервера...\n');

  try {
    console.log('1️⃣ Тестируем основной API...');
    await testAPI();
    console.log('');

    console.log('2️⃣ Тестируем WebSocket...');
    await testWebSocket();
    console.log('');

    console.log('3️⃣ Тестируем Neural API...');
    await testNeuralInit();
    console.log('');

    console.log('🎉 Все тесты пройдены успешно!');

  } catch (error) {
    console.error('💥 Тест провалился:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { testAPI, testWebSocket, testNeuralInit };