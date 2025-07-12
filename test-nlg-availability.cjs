/**
 * Тест доступности natural-language-generator после исправления
 */

console.log('🔍 ТЕСТ ДОСТУПНОСТИ NATURAL-LANGUAGE-GENERATOR');

async function testNLGAvailability() {
  try {
    console.log('\n📦 Тестируем semantic-memory модуль...');
    
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    console.log('\n🧪 Проверяем доступность natural-language-generator...');
    
    // Даем время для инициализации
    setTimeout(async () => {
      try {
        const result = await semanticMemory.analyzeCompleteRequest('Расскажи про планету Марс', {
          userId: 'test-user',
          includeAdvancedSemantics: true
        });
        
        console.log('\n📋 РЕЗУЛЬТАТ SEMANTIC-MEMORY:');
        console.log('🔍 Полная структура результата:', JSON.stringify(result, null, 2));
        
        // Пытаемся найти ответ в разных полях
        const responseText = result.response || 
                           result.generatedResponse?.response || 
                           result.analysis?.generatedResponse?.response ||
                           result.reply ||
                           result.message;
        
        console.log('Response length:', responseText?.length || 0);
        console.log('Response preview:', responseText?.substring(0, 200) || 'НЕТ ОТВЕТА');
        console.log('Contains "Интересный вопрос!":', responseText?.includes('Интересный вопрос!'));
        console.log('Contains "Марс":', responseText?.includes('Марс'));
        console.log('Confidence:', result.confidence);
        console.log('Method used:', result.method);
        console.log('Response generated:', result.responseGenerated);
        console.log('NLG Module Status:', result.moduleStatus?.naturalLanguageGenerator);
        
      } catch (error) {
        console.error('❌ ОШИБКА SEMANTIC-MEMORY:', error.message);
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    console.error('❌ СТЕК:', error.stack?.substring(0, 500));
  }
}

testNLGAvailability();