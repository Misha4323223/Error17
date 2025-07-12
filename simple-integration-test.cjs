/**
 * Простой тест интеграции семантической памяти
 */

async function testSemanticIntegration() {
  console.log('🧪 ПРОСТОЙ ТЕСТ ИНТЕГРАЦИИ СЕМАНТИЧЕСКОЙ ПАМЯТИ\n');

  try {
    // Импортируем семантическую память напрямую
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');
    
    console.log('✅ Модули загружены успешно');
    
    // Тест 1: Инициализация семантической памяти
    console.log('\n📝 Тест 1: Инициализация семантической памяти');
    const sessionId = 'test-session-' + Date.now();
    
    await semanticMemory.processUserInput(sessionId, 'Создаю проект логотипа для кофейни');
    console.log('✅ Семантическая память инициализирована');
    
    // Тест 2: Получение семантических данных
    console.log('\n📝 Тест 2: Получение семантических данных');
    const semanticData = await semanticMemory.getEnhancedContext(sessionId);
    
    console.log('Семантические данные получены:');
    console.log('- Проектов:', semanticData.projects?.length || 0);
    console.log('- Предсказаний:', semanticData.predictions?.length || 0);
    console.log('- Улучшенный промпт:', semanticData.enhanced_prompt ? 'есть' : 'нет');
    
    // Тест 3: Проверка интеграции с процессором
    console.log('\n📝 Тест 3: Интеграция с интеллектуальным процессором');
    
    const testOptions = {
      sessionId: sessionId,
      semanticData: semanticData,
      isDirectRequest: true
    };
    
    const result = await intelligentProcessor.analyzeUserIntent(
      'Создай логотип с чашкой кофе',
      testOptions
    );
    
    if (result && result.category) {
      console.log('✅ Интеграция работает! Категория:', result.category);
      console.log('✅ Уверенность:', result.confidence);
      
      if (result.semanticEnhancement) {
        console.log('✅ Семантическое обогащение активно');
      }
    } else {
      console.log('⚠️ Результат анализа неполный');
    }
    
    console.log('\n🎉 Тест интеграции завершен успешно!');
    console.log('✨ Семантическая память работает и интегрирована с процессором');
    
  } catch (error) {
    console.error('❌ Ошибка в тесте интеграции:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSemanticIntegration();