/**
 * ДЕТЕКТОР FALLBACK ОТВЕТОВ
 * Найдем где именно система выдает fallback вместо настоящих ответов
 */

async function testFallbackDetection() {
  console.log('🔍 ДЕТЕКТОР FALLBACK ОТВЕТОВ');
  console.log('='.repeat(50));
  
  try {
    // 1. Проверим conversation-engine напрямую
    console.log('\n1️⃣ ТЕСТИРУЕМ CONVERSATION-ENGINE...');
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    const testQuery = "Расскажи про искусственный интеллект";
    console.log(`📝 Тестовый запрос: "${testQuery}"`);
    
    if (conversationEngine.generateResponse) {
      const result = await conversationEngine.generateResponse(testQuery, {
        sessionId: 'test-session',
        userId: 1
      });
      
      console.log('\n📊 РЕЗУЛЬТАТ ОТ CONVERSATION-ENGINE:');
      console.log('✅ Провайдер:', result?.provider || 'НЕ УКАЗАН');
      console.log('✅ Длина ответа:', result?.response?.length || 0, 'символов');
      console.log('✅ Первые 150 символов:', result?.response?.substring(0, 150) || 'ПУСТОЙ ОТВЕТ');
      
      // Проверяем на fallback паттерны
      const response = result?.response || '';
      const isFallback = 
        response.includes('Базовый семантический анализ') ||
        response.includes('семантических модулей') ||
        response.includes('Интересно! Расскажи больше') ||
        response.includes('готов помочь') ||
        response.length < 50;
        
      console.log('🎯 Это fallback?:', isFallback ? '🚨 ДА!' : '✅ НЕТ');
      
      if (isFallback) {
        console.log('❌ ПРОБЛЕМА НАЙДЕНА: Система выдает fallback ответ!');
        
        // Проверим где именно происходит fallback
        console.log('\n🔍 АНАЛИЗИРУЕМ ПУТЬ FALLBACK...');
        
        // Тестируем прямой вызов семантической генерации
        const semanticMemory = require('./server/semantic-memory/index.cjs');
        
        if (semanticMemory.naturalLanguageGenerator) {
          console.log('📝 Тестируем natural-language-generator...');
          
          const semanticData = {
            semantic_cluster: { name: 'knowledge_request', confidence: 90 },
            query_type: 'information_request',
            dialog_category: 'knowledge_sharing'
          };
          
          const directResponse = await semanticMemory.naturalLanguageGenerator.generateResponse(
            testQuery,
            semanticData,
            { autonomousMode: true }
          );
          
          console.log('✅ Прямой ответ от NLG:', directResponse?.substring(0, 150) || 'ПУСТОЙ');
          console.log('🎯 NLG fallback?:', directResponse?.includes('Базовый семантический анализ') ? '🚨 ДА!' : '✅ НЕТ');
        }
      } else {
        console.log('🎉 ОТЛИЧНО! Система генерирует настоящие ответы!');
      }
    }
    
    // 2. Проверим semantic-integration-layer
    console.log('\n2️⃣ ТЕСТИРУЕМ SEMANTIC-INTEGRATION-LAYER...');
    const semanticIntegration = require('./server/semantic-integration-layer.cjs');
    
    if (semanticIntegration.analyzeWithSemantics) {
      const semanticResult = await semanticIntegration.analyzeWithSemantics(testQuery, {
        sessionId: 'test-session',
        userId: 1
      });
      
      console.log('📊 РЕЗУЛЬТАТ ОТ SEMANTIC-INTEGRATION:');
      console.log('✅ Есть результат:', !!semanticResult);
      console.log('✅ Уверенность:', semanticResult?.confidence || 0);
      console.log('✅ Метод:', semanticResult?.method || 'НЕ УКАЗАН');
      
      if (semanticResult?.response) {
        console.log('✅ Длина ответа:', semanticResult.response.length, 'символов');
        console.log('✅ Первые 150 символов:', semanticResult.response.substring(0, 150));
        
        const isSemanticFallback = semanticResult.response.includes('Базовый семантический анализ');
        console.log('🎯 Semantic fallback?:', isSemanticFallback ? '🚨 ДА!' : '✅ НЕТ');
      }
    }
    
    // 3. Найдем где именно происходит fallback
    console.log('\n3️⃣ ИЩЕМ ИСТОЧНИК FALLBACK...');
    
    // Проверим routes.ts fallback
    console.log('🔍 Проверяем routes.ts fallback функции...');
    
    const fs = require('fs');
    const routesContent = fs.readFileSync('./server/routes.ts', 'utf8');
    
    if (routesContent.includes('generateFriendlyFallbackResponse')) {
      console.log('⚠️ НАЙДЕН generateFriendlyFallbackResponse в routes.ts');
    }
    
    if (routesContent.includes('Базовый семантический анализ')) {
      console.log('🚨 НАЙДЕН текст "Базовый семантический анализ" в routes.ts!');
    }
    
    if (routesContent.includes('Интересно! Расскажи больше')) {
      console.log('🚨 НАЙДЕН текст "Интересно! Расскажи больше" в routes.ts!');
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Запускаем детектор
testFallbackDetection().then(() => {
  console.log('\n🏁 ДЕТЕКЦИЯ ЗАВЕРШЕНА');
}).catch(error => {
  console.error('💥 ДЕТЕКТОР УПАЛ:', error);
});