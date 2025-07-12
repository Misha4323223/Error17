/**
 * КОМПЛЕКСНАЯ ПРОВЕРКА AI СИСТЕМЫ
 * Тестирует все критические компоненты для обеспечения настоящего AI генерации
 */

console.log('🔍 КОМПЛЕКСНАЯ ПРОВЕРКА AI СИСТЕМЫ BOOOMERANGS');

async function testComprehensiveAI() {
  try {
    console.log('\n📋 ЭТАП 1: Проверка natural-language-generator...');
    
    const nlgModule = require('./server/semantic-memory/natural-language-generator.cjs');
    console.log('✅ NLG модуль загружен');
    console.log('🔍 Доступные методы:', Object.keys(nlgModule));
    
    if (nlgModule.generateResponse) {
      console.log('🧪 Тестируем прямую генерацию...');
      const testResponse = nlgModule.generateResponse('что такое антифриз', {}, {});
      console.log('📝 Результат генерации:', testResponse);
      
      if (testResponse && testResponse.response && testResponse.response.length > 100) {
        console.log('✅ NLG работает корректно');
      } else {
        console.log('❌ NLG возвращает некачественный ответ');
      }
    } else {
      console.log('❌ Метод generateResponse недоступен');
    }
    
    console.log('\n📋 ЭТАП 2: Проверка semantic-integration-layer...');
    
    const integrationLayer = require('./server/semantic-integration-layer.cjs');
    console.log('✅ Integration layer загружен');
    
    if (integrationLayer.generateIntelligentFallbackResponse) {
      const fallbackResponse = integrationLayer.generateIntelligentFallbackResponse('что такое антифриз');
      console.log('📝 Fallback ответ:', fallbackResponse.substring(0, 150) + '...');
      
      if (fallbackResponse.includes('антифриз') || fallbackResponse.length > 300) {
        console.log('✅ Integration layer генерирует качественные ответы');
      } else {
        console.log('❌ Integration layer использует статичные fallback');
      }
    }
    
    console.log('\n📋 ЭТАП 3: Проверка conversation-engine-semantic-provider...');
    
    const provider = require('./server/conversation-engine-semantic-provider.cjs');
    console.log('✅ Provider загружен');
    
    const testResult = await provider.processRequest('расскажи про антифриз', {
      userId: 'test',
      sessionId: 'test'
    });
    
    console.log('📝 Provider результат:');
    console.log('- Response length:', testResult.response?.length || 0);
    console.log('- Method:', testResult.method);
    console.log('- Confidence:', testResult.confidence);
    console.log('- Response preview:', testResult.response?.substring(0, 150) + '...');
    
    // Проверяем качество ответа
    if (testResult.response && testResult.response.includes('антифриз')) {
      console.log('✅ Provider генерирует контекстные ответы');
    } else if (testResult.response && testResult.response.length > 200) {
      console.log('⚠️ Provider генерирует длинные ответы, но не контекстные');
    } else {
      console.log('❌ Provider использует короткие fallback ответы');
    }
    
    console.log('\n📋 ЭТАП 4: Проверка semantic-memory модулей...');
    
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    if (semanticMemory.modules) {
      console.log('📊 Загруженные модули:', semanticMemory.modules.size);
      
      const nlgFromMemory = semanticMemory.modules.get('natural-language-generator');
      if (nlgFromMemory) {
        console.log('✅ NLG доступен через semantic-memory');
        console.log('🔍 NLG методы:', Object.keys(nlgFromMemory));
      } else {
        console.log('❌ NLG недоступен через semantic-memory');
      }
    }
    
    console.log('\n📋 ЭТАП 5: Тест полной цепочки AI генерации...');
    
    // Тестируем разные типы запросов
    const testQueries = [
      'что такое антифриз',
      'расскажи про космос',
      'как работает двигатель',
      'создай дизайн логотипа'
    ];
    
    for (const query of testQueries) {
      console.log(`\n🧪 Тестируем: "${query}"`);
      
      const result = await provider.processRequest(query, {
        userId: 'test',
        sessionId: 'test'
      });
      
      // Анализируем качество ответа
      const response = result.response || '';
      const isGoodResponse = response.length > 100 && 
                            !response.includes('Понял ваш запрос! Моя автономная') &&
                            !response.includes('Интересно!') &&
                            (response.includes(query.split(' ')[2]) || response.includes(query.split(' ')[1]));
      
      console.log(`${isGoodResponse ? '✅' : '❌'} ${query}: ${isGoodResponse ? 'КАЧЕСТВЕННЫЙ ОТВЕТ' : 'FALLBACK ОТВЕТ'}`);
      console.log(`   Length: ${response.length}, Method: ${result.method}`);
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка теста:', error.message);
    console.error(error.stack);
  }
}

// Запускаем комплексную проверку
testComprehensiveAI();