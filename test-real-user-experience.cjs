/**
 * ТЕСТ РЕАЛЬНОГО ПОЛЬЗОВАТЕЛЬСКОГО ОПЫТА
 * Проверяем что именно получает пользователь на фронтенде
 */

async function testRealUserExperience() {
  console.log('🔍 ТЕСТИРУЕМ РЕАЛЬНЫЙ ПОЛЬЗОВАТЕЛЬСКИЙ ОПЫТ');
  console.log('='.repeat(50));
  
  try {
    // Симулируем запрос как делает фронтенд
    const testQuery = "Расскажи про искусственный интеллект";
    console.log(`📝 Пользователь вводит: "${testQuery}"`);
    
    // 1. Проверим smart-router напрямую
    console.log('\n1️⃣ ТЕСТИРУЕМ SMART-ROUTER...');
    const smartRouter = require('./server/smart-router.js');
    
    if (smartRouter.getAIResponseWithSearch) {
      const routerResult = await smartRouter.getAIResponseWithSearch(testQuery, {
        sessionId: 'test-session',
        userId: 1
      });
      
      console.log('📊 РЕЗУЛЬТАТ ОТ SMART-ROUTER:');
      console.log('- Провайдер:', routerResult?.provider || 'НЕ УКАЗАН');
      console.log('- Длина ответа:', routerResult?.response?.length || 0, 'символов');
      console.log('- Первые 100 символов:', routerResult?.response?.substring(0, 100) || 'ПУСТОЙ ОТВЕТ');
      console.log('- Это fallback?:', routerResult?.response?.includes('Базовый семантический анализ') ? 'ДА!' : 'НЕТ');
    }
    
    // 2. Проверим conversation-engine напрямую
    console.log('\n2️⃣ ТЕСТИРУЕМ CONVERSATION-ENGINE...');
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    if (conversationEngine.generateResponse) {
      const engineResult = await conversationEngine.generateResponse(testQuery, {
        sessionId: 'test-session',
        userId: 1
      });
      
      console.log('📊 РЕЗУЛЬТАТ ОТ CONVERSATION-ENGINE:');
      console.log('- Провайдер:', engineResult?.provider || 'НЕ УКАЗАН');
      console.log('- Длина ответа:', engineResult?.response?.length || 0, 'символов');
      console.log('- Первые 100 символов:', engineResult?.response?.substring(0, 100) || 'ПУСТОЙ ОТВЕТ');
      console.log('- Это fallback?:', engineResult?.response?.includes('Базовый семантический анализ') ? 'ДА!' : 'НЕТ');
    }
    
    // 3. Проверим natural-language-generator
    console.log('\n3️⃣ ТЕСТИРУЕМ NATURAL-LANGUAGE-GENERATOR...');
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    if (semanticMemory.naturalLanguageGenerator?.generateResponse) {
      const generatorResult = await semanticMemory.naturalLanguageGenerator.generateResponse(
        testQuery,
        {
          semantic_cluster: { name: 'knowledge_request', confidence: 90 },
          query_type: 'information_request',
          dialog_category: 'knowledge_sharing'
        },
        { autonomousMode: true }
      );
      
      console.log('📊 РЕЗУЛЬТАТ ОТ NATURAL-LANGUAGE-GENERATOR:');
      console.log('- Длина ответа:', generatorResult?.length || 0, 'символов');
      console.log('- Первые 100 символов:', generatorResult?.substring(0, 100) || 'ПУСТОЙ ОТВЕТ');
      console.log('- Это fallback?:', generatorResult?.includes('Базовый семантический анализ') ? 'ДА!' : 'НЕТ');
      console.log('- Это шаблон?:', generatorResult?.includes('{{') ? 'ДА!' : 'НЕТ');
    }
    
    // 4. Проверим что получает routes.ts
    console.log('\n4️⃣ СИМУЛИРУЕМ HTTP ЗАПРОС К /api/chat...');
    const axios = require('axios');
    
    try {
      const httpResponse = await axios.post('http://localhost:5000/api/chat', {
        message: testQuery,
        sessionId: 'test-session'
      }, {
        timeout: 10000
      });
      
      console.log('📊 РЕЗУЛЬТАТ ОТ HTTP API:');
      console.log('- Статус:', httpResponse.status);
      console.log('- Провайдер:', httpResponse.data?.provider || 'НЕ УКАЗАН');
      console.log('- Длина ответа:', httpResponse.data?.response?.length || 0, 'символов');
      console.log('- Первые 100 символов:', httpResponse.data?.response?.substring(0, 100) || 'ПУСТОЙ ОТВЕТ');
      console.log('- Это fallback?:', httpResponse.data?.response?.includes('Базовый семантический анализ') ? 'ДА!' : 'НЕТ');
      
    } catch (error) {
      console.log('❌ Ошибка HTTP запроса:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Запускаем тест
testRealUserExperience().then(() => {
  console.log('\n🏁 ТЕСТ ЗАВЕРШЕН');
}).catch(error => {
  console.error('💥 ТЕСТ УПАЛ:', error);
});