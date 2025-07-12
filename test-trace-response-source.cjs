/**
 * Трассировка источника ответа "Интересный вопрос!"
 * Поиск точного места генерации длинного ответа
 */

console.log('🔍 ТРАССИРОВКА ИСТОЧНИКА ОТВЕТА');

async function traceResponseSource() {
  try {
    console.log('\n🧠 Тестируем conversation-engine.processUserInput...');
    
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    const result = await conversationEngine.processUserInput('Расскажи про планету Марс', {
      userId: 'test-user',
      sessionId: 'test-session'
    });
    
    console.log('\n📋 РЕЗУЛЬТАТ ОТ CONVERSATION-ENGINE:');
    console.log('Response length:', result.reply?.length || 0);
    console.log('First 200 chars:', result.reply?.substring(0, 200));
    console.log('Contains "🔬 Науки:":', result.reply?.includes('🔬 Науки:'));
    console.log('Contains "физика, химия":', result.reply?.includes('физика, химия'));
    console.log('Full response:', result.reply);
    
    console.log('\n📊 МЕТАДАННЫЕ:');
    console.log('Confidence:', result.confidence);
    console.log('Quality:', result.quality);
    console.log('Metadata approach:', result.metadata?.approach);
    console.log('System health:', result.metadata?.systemHealth?.score);
    
  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
    console.error('❌ СТЕК:', error.stack);
  }
}

traceResponseSource();