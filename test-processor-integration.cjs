/**
 * Тестирование интеграции интеллектуального процессора
 */

async function testProcessorIntegration() {
  console.log('🧠 Тестирование интеграции интеллектуального процессора...\n');
  
  try {
    // Тестируем загрузку модуля
    console.log('1. Загружаем интеллектуальный процессор...');
    const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');
    console.log('✅ Модуль загружен успешно');
    
    // Тестируем основные функции
    console.log('\n2. Тестируем функцию analyzeUserIntent...');
    const testQuery = "Привет, как дела?";
    const result = await intelligentProcessor.analyzeUserIntent(testQuery, {
      sessionId: 'test-session'
    });
    
    console.log('✅ Результат анализа:', {
      success: result.success,
      category: result.category,
      provider: result.provider,
      shouldFallback: result.shouldFallback
    });
    
    if (result.response) {
      console.log('📄 Ответ процессора:', result.response.substring(0, 100) + '...');
    }
    
    // Тестируем smart-router интеграцию
    console.log('\n3. Тестируем интеграцию со smart-router...');
    const smartRouter = require('./server/smart-router');
    const routerResult = await smartRouter.getChatResponse(testQuery, {
      sessionId: 'test-session'
    });
    
    console.log('✅ Результат smart-router:', {
      success: routerResult.success,
      provider: routerResult.provider,
      hasResponse: !!routerResult.response
    });
    
    console.log('\n🎯 Тестирование завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testProcessorIntegration();