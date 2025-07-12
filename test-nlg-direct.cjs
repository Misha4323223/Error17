/**
 * Прямой тест natural-language-generator
 */

console.log('🧠 ПРЯМОЙ ТЕСТ NATURAL-LANGUAGE-GENERATOR');

async function testNLGDirect() {
  try {
    console.log('\n📦 Пытаемся загрузить natural-language-generator...');
    
    const NaturalLanguageGeneratorClass = require('./server/semantic-memory/natural-language-generator.cjs');
    console.log('✅ Класс загружен, тип:', typeof NaturalLanguageGeneratorClass);
    
    const nlg = new NaturalLanguageGeneratorClass();
    console.log('✅ Экземпляр создан');
    
    console.log('\n🧪 Тестируем generateResponse...');
    
    const result = await nlg.generateResponse('Расскажи про планету Марс', {
      intent: 'знаниевый_запрос',
      emotion: 'neutral',
      style: 'friendly'
    });
    
    console.log('\n📋 РЕЗУЛЬТАТ ГЕНЕРАЦИИ:');
    console.log('Response length:', result.response?.length || 0);
    console.log('Response preview:', result.response?.substring(0, 200));
    console.log('Contains "🔬 Науки:":', result.response?.includes('🔬 Науки:'));
    console.log('Contains "Интересный вопрос!":', result.response?.includes('Интересный вопрос!'));
    console.log('Full response:', result.response);
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    console.error('❌ СТЕК:', error.stack?.substring(0, 500));
  }
}

testNLGDirect();