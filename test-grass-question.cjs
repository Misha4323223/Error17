/**
 * Тест конкретного вопроса "что такое трава"
 */

async function testGrassQuestion() {
  console.log('🌱 Тестирование вопроса "что такое трава"...');
  
  try {
    // Подключаем conversation engine напрямую
    const ConversationEngine = require('./server/conversation-engine.cjs');
    const conversationEngine = new ConversationEngine();
    
    console.log('📋 Получение ответа от семантической системы...');
    
    const context = {
      sessionId: 'test-session',
      userId: 'test-user',
      timestamp: new Date().toISOString()
    };
    
    const response = await conversationEngine.processUserInput('что такое трава', context);
    
    console.log('📊 Результат:');
    console.log('Ответ:', response?.reply?.substring(0, 300) || 'Нет ответа');
    
    // Проверяем качество ответа
    if (response?.reply && response.reply.length > 50) {
      console.log('✅ Семантическая система генерирует качественные ответы');
    } else {
      console.log('❌ Семантическая система не дает полных ответов');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testGrassQuestion();