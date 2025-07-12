/**
 * ПРОСТОЙ ТЕСТ API МОДУЛЯ СОЗНАНИЯ
 * Проверяем новые endpoints в routes.ts
 */

const http = require('http');

async function testConsciousnessAPI() {
  console.log('🧠 ТЕСТИРОВАНИЕ API МОДУЛЯ СОЗНАНИЯ');
  console.log('=' * 60);

  // Тест 1: Основной endpoint /api/conversation/chat
  console.log('\n🔹 ТЕСТ 1: POST /api/conversation/chat');
  
  const testData = {
    message: 'Привет! Расскажи о своих возможностях в области дизайна.',
    context: {
      userId: 'test_api_user',
      tone: 'friendly'
    }
  };

  try {
    const response = await makeAPIRequest('POST', '/api/conversation/chat', testData);
    
    if (response.success) {
      console.log('✅ API запрос успешен');
      console.log(`📝 Ответ: ${response.reply.substring(0, 150)}...`);
      console.log(`🎯 Уверенность: ${response.confidence}`);
      console.log(`⭐ Качество: ${response.quality}/10`);
      console.log(`⚡ Время обработки: ${response.metadata.processingTime}мс`);
      console.log(`🧠 Система: ${response.metadata.systemName}`);
    } else {
      console.log('❌ API запрос неуспешен:', response);
    }

  } catch (error) {
    console.log('❌ Ошибка API запроса:', error.message);
  }

  // Тест 2: Endpoint оценки качества /api/conversation/evaluate
  console.log('\n🔹 ТЕСТ 2: POST /api/conversation/evaluate');
  
  const evaluationData = {
    text: 'BOOOMERANGS AI - это инновационная платформа для создания дизайна вышивки. Мы предлагаем широкий спектр возможностей для творчества.',
    meta: { type: 'marketing' },
    context: { purpose: 'evaluation' }
  };

  try {
    const evalResponse = await makeAPIRequest('POST', '/api/conversation/evaluate', evaluationData);
    
    if (evalResponse.success) {
      console.log('✅ Оценка качества успешна');
      console.log(`📊 Детальная оценка:`, evalResponse.evaluation);
    } else {
      console.log('❌ Оценка качества неуспешна:', evalResponse);
    }

  } catch (error) {
    console.log('❌ Ошибка оценки качества:', error.message);
  }

  console.log('\n🏁 ТЕСТИРОВАНИЕ API ЗАВЕРШЕНО');
}

// Функция для выполнения HTTP запросов
function makeAPIRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          resolve(jsonResponse);
        } catch (error) {
          reject(new Error(`Ошибка парсинга JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();

    // Таймаут 10 секунд
    setTimeout(() => {
      req.destroy();
      reject(new Error('Таймаут запроса'));
    }, 10000);
  });
}

// Запуск тестов
if (require.main === module) {
  testConsciousnessAPI().then(() => {
    console.log('\n✨ ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ');
    process.exit(0);
  }).catch(error => {
    console.error('\n💥 КРИТИЧЕСКАЯ ОШИБКА ТЕСТОВ:', error);
    process.exit(1);
  });
}

module.exports = { testConsciousnessAPI };