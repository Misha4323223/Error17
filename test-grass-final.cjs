/**
 * Финальный тест вопроса "что такое трава"
 */

async function testGrassResponse() {
  console.log('🌱 Финальное тестирование ответа о траве...');
  
  try {
    // Импортируем natural-language-generator напрямую
    const NaturalLanguageGenerator = require('./server/semantic-memory/natural-language-generator.cjs');
    const nlg = new NaturalLanguageGenerator();
    
    // Тестируем метод generateNaturalKnowledgeResponse
    const response = nlg.generateNaturalKnowledgeResponse('что такое трава', {});
    
    console.log('📊 Результат:');
    console.log('Длина ответа:', response.length);
    console.log('Ответ:', response);
    
    // Проверяем качество ответа
    if (response && response.length > 200 && response.includes('Трава')) {
      console.log('✅ Система генерирует качественный специфический ответ о траве');
    } else {
      console.log('❌ Система не дает специфического ответа о траве');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testGrassResponse();