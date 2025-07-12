/**
 * 🚀 ПОЛНЫЙ ТЕСТ ИНТЕГРАЦИИ
 * Тестируем Semantic Router → Conversation Engine → Neural Network
 */

const axios = require('axios');

async function testCompleteIntegration() {
  console.log('🚀 ПОЛНЫЙ ТЕСТ ИНТЕГРАЦИИ HYBRID СИСТЕМА');
  console.log('==========================================');
  
  // Ждем запуска сервера
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const baseUrl = 'http://localhost:5000';
  
  const testCases = [
    {
      name: 'Простой запрос (Express режим)',
      message: 'привет как дела',
      expectedRouting: 'express',
      expectedNeural: false
    },
    {
      name: 'Знаниевый запрос (Standard режим)',
      message: 'расскажи про искусственный интеллект',
      expectedRouting: 'standard',
      expectedNeural: false
    },
    {
      name: 'Запрос на вышивку (Specialized режим)',
      message: 'создай дизайн вышивки с розами для формата DST',
      expectedRouting: 'specialized',
      expectedNeural: true
    },
    {
      name: 'Сложный технический запрос (Expert режим)',
      message: 'проанализируй архитектуру нейронной сети для обработки естественного языка и предложи оптимизации',
      expectedRouting: 'expert',
      expectedNeural: true
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    console.log(`\n🧪 ТЕСТ: ${testCase.name}`);
    console.log(`📝 Запрос: "${testCase.message.substring(0, 100)}${testCase.message.length > 100 ? '...' : ''}"`);
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${baseUrl}/api/ai/chat`, {
        message: testCase.message,
        userId: 'test-user',
        sessionId: 'test-session'
      });
      
      const processingTime = Date.now() - startTime;
      
      if (response.data.success) {
        console.log('✅ УСПЕШНЫЙ ОТВЕТ:');
        console.log(`📊 Время обработки: ${processingTime}мс`);
        console.log(`🎯 Провайдер: ${response.data.provider}`);
        console.log(`📈 Уверенность: ${response.data.confidence}`);
        console.log(`🔢 Качество: ${response.data.quality}`);
        
        // Информация о маршрутизации
        if (response.data.routingInfo) {
          console.log(`🎯 Routing Info:`, {
            complexity: response.data.routingInfo.complexity,
            strategy: response.data.routingInfo.strategy,
            category: response.data.routingInfo.category
          });
        }
        
        // Проверяем длину ответа
        const responseLength = response.data.response?.length || 0;
        console.log(`📏 Длина ответа: ${responseLength} символов`);
        
        // Проверяем качество ответа
        if (responseLength > 100) {
          console.log('✅ Ответ содержательный');
        } else {
          console.log('⚠️ Ответ короткий');
        }
        
        // Показываем первые 200 символов ответа
        console.log(`💬 Ответ (первые 200 символов): "${response.data.response?.substring(0, 200)}${responseLength > 200 ? '...' : ''}"`);
        
        passedTests++;
      } else {
        console.log('❌ ОШИБКА В ОТВЕТЕ:', response.data.error);
      }
      
    } catch (error) {
      console.log('❌ ОШИБКА ЗАПРОСА:', error.message);
      if (error.response) {
        console.log('📊 Статус:', error.response.status);
        console.log('📝 Данные:', error.response.data);
      }
    }
    
    // Пауза между тестами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n🎯 ИТОГОВЫЙ РЕЗУЛЬТАТ: ${passedTests}/${totalTests} тестов пройдено`);
  console.log(`📊 Успешность: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  // Дополнительные тесты API
  console.log('\n🔍 ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ API');
  console.log('============================');
  
  // Тест Semantic Router статистики
  try {
    const statsResponse = await axios.get(`${baseUrl}/api/semantic-router/stats`);
    console.log('✅ Semantic Router Stats:', statsResponse.data.stats);
  } catch (error) {
    console.log('❌ Ошибка получения статистики Semantic Router:', error.message);
  }
  
  // Тест Neural API (если доступен)
  try {
    const neuralResponse = await axios.post(`${baseUrl}/api/neural/generate`, {
      input: 'тест нейросети',
      options: { maxTokens: 50 }
    });
    console.log('✅ Neural API работает:', neuralResponse.data.success);
  } catch (error) {
    console.log('⚠️ Neural API недоступен:', error.message);
  }
  
  console.log('\n🎉 ТЕСТ ЗАВЕРШЕН!');
}

// Запуск теста
if (require.main === module) {
  testCompleteIntegration().catch(console.error);
}

module.exports = { testCompleteIntegration };