/**
 * Отладочный тест для выяснения источника ответа "Интересный вопрос! 🤔"
 */

const path = require('path');

async function debugResponseSource() {
  console.log('🔍 ОТЛАДКА ИСТОЧНИКА ОТВЕТОВ');
  console.log('===============================\n');

  try {
    // 1. Тестируем conversation-engine-semantic-provider
    console.log('1️⃣ Тестируем conversation-engine-semantic-provider...');
    
    try {
      const semanticProvider = require('./server/conversation-engine-semantic-provider.cjs');
      
      const testQuery = "Что такое любовь";
      console.log(`📝 Запрос: "${testQuery}"`);
      
      const result = await semanticProvider.processRequest(testQuery);
      
      console.log('\n📊 РЕЗУЛЬТАТ ОТ SEMANTIC PROVIDER:');
      console.log('Success:', result.success);
      console.log('Method:', result.method);
      console.log('Provider:', result.provider);
      console.log('Confidence:', result.confidence);
      console.log('Response length:', result.response?.length || 0);
      console.log('Response preview:', result.response?.substring(0, 200) + '...');
      
      if (result.response?.includes('Интересный вопрос')) {
        console.log('❌ НАЙДЕН ИСТОЧНИК: conversation-engine-semantic-provider');
      }
      
    } catch (error) {
      console.log('❌ Ошибка semantic provider:', error.message);
    }

    // 2. Тестируем semantic-integration-layer напрямую
    console.log('\n\n2️⃣ Тестируем semantic-integration-layer...');
    
    try {
      const semanticIntegration = require('./server/semantic-integration-layer.cjs');
      
      if (semanticIntegration.generateIntelligentFallbackResponse) {
        const fallbackResponse = semanticIntegration.generateIntelligentFallbackResponse("Что такое любовь");
        
        console.log('\n📊 РЕЗУЛЬТАТ ОТ SEMANTIC INTEGRATION FALLBACK:');
        console.log('Response length:', fallbackResponse?.length || 0);
        console.log('Response preview:', fallbackResponse?.substring(0, 200) + '...');
        
        if (fallbackResponse?.includes('Интересный вопрос')) {
          console.log('❌ НАЙДЕН ИСТОЧНИК: semantic-integration-layer.generateIntelligentFallbackResponse');
        }
      }
      
    } catch (error) {
      console.log('❌ Ошибка semantic integration:', error.message);
    }

    // 3. Тестируем conversation-engine напрямую
    console.log('\n\n3️⃣ Тестируем conversation-engine...');
    
    try {
      const conversationEngine = require('./server/conversation-engine.cjs');
      
      if (conversationEngine.generateResponse) {
        const engineResponse = await conversationEngine.generateResponse("Что такое любовь", {
          useSemantics: true,
          semanticMode: 'enhanced'
        });
        
        console.log('\n📊 РЕЗУЛЬТАТ ОТ CONVERSATION ENGINE:');
        console.log('Response type:', typeof engineResponse);
        console.log('Response length:', engineResponse?.response?.length || engineResponse?.length || 0);
        console.log('Response preview:', (engineResponse?.response || engineResponse || '').substring(0, 200) + '...');
        
        if ((engineResponse?.response || engineResponse || '').includes('Интересный вопрос')) {
          console.log('❌ НАЙДЕН ИСТОЧНИК: conversation-engine');
        }
      }
      
    } catch (error) {
      console.log('❌ Ошибка conversation engine:', error.message);
    }

    // 4. Тестируем smart-router напрямую
    console.log('\n\n4️⃣ Тестируем smart-router...');
    
    try {
      const smartRouter = require('./server/smart-router.js');
      
      if (smartRouter.getAIResponseWithSearch) {
        const routerResponse = await smartRouter.getAIResponseWithSearch("Что такое любовь");
        
        console.log('\n📊 РЕЗУЛЬТАТ ОТ SMART ROUTER:');
        console.log('Response type:', typeof routerResponse);
        console.log('Response length:', routerResponse?.response?.length || routerResponse?.length || 0);
        console.log('Response preview:', (routerResponse?.response || routerResponse || '').substring(0, 200) + '...');
        
        if ((routerResponse?.response || routerResponse || '').includes('Интересный вопрос')) {
          console.log('❌ НАЙДЕН ИСТОЧНИК: smart-router');
        }
      }
      
    } catch (error) {
      console.log('❌ Ошибка smart router:', error.message);
    }

    // 5. Проверяем API endpoint
    console.log('\n\n5️⃣ Тестируем API endpoint...');
    
    try {
      const axios = require('axios');
      
      const apiResponse = await axios.post('http://localhost:5000/api/ai/chat', {
        message: "Что такое любовь"
      });
      
      console.log('\n📊 РЕЗУЛЬТАТ ОТ API:');
      console.log('Status:', apiResponse.status);
      console.log('Response length:', apiResponse.data?.response?.length || 0);
      console.log('Response preview:', (apiResponse.data?.response || '').substring(0, 200) + '...');
      
      if ((apiResponse.data?.response || '').includes('Интересный вопрос')) {
        console.log('❌ НАЙДЕН ИСТОЧНИК: API endpoint');
      }
      
    } catch (error) {
      console.log('❌ Ошибка API:', error.message);
    }

    console.log('\n\n🎯 АНАЛИЗ ЗАВЕРШЕН');
    console.log('===================');

  } catch (error) {
    console.error('💥 Критическая ошибка отладки:', error);
  }
}

// Запускаем отладку
debugResponseSource().catch(console.error);