/**
 * Прямой тест conversation engine с нейросетью
 */

async function testNeuralConversation() {
  console.log('🧪 Тест conversation engine с нейросетью...');
  
  try {
    // Инициализируем neural integration явно
    const { getGlobalNeuralIntegration, initializeNeuralIntegration } = require('./server/neural-integration.cjs');
    
    console.log('🚀 Инициализируем neural integration...');
    let neuralIntegration = getGlobalNeuralIntegration();
    
    // Если не инициализирован, инициализируем
    if (!neuralIntegration.isInitialized) {
      console.log('⚡ Запускаем инициализацию lite модели...');
      await neuralIntegration.initializeLite();
    }
    
    console.log('📊 Статус после инициализации:');
    console.log('  Mode:', neuralIntegration.mode);
    console.log('  Initialized:', neuralIntegration.isInitialized);
    console.log('  Current Model:', !!neuralIntegration.getCurrentModel());
    
    // Прямой тест generateHybridResponse
    console.log('\n🤖 Тест generateHybridResponse...');
    try {
      const hybridResponse = await neuralIntegration.generateHybridResponse('Привет! Как дела?', {
        maxTokens: 100,
        temperature: 0.8
      });
      
      console.log('✅ Hybrid ответ:', hybridResponse);
      console.log('✅ Длина:', hybridResponse?.length || 0);
      
    } catch (hybridError) {
      console.error('❌ Ошибка hybrid:', hybridError.message);
    }
    
    // Тест conversation engine
    console.log('\n💬 Тест conversation engine...');
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    const testMessages = [
      'Привет!',
      'Что ты умеешь?',
      'Создай картинку кота'
    ];
    
    for (const message of testMessages) {
      console.log(`\n📝 Сообщение: "${message}"`);
      
      try {
        const response = await conversationEngine.processUserInput(message, {
          userId: 'test-user',
          sessionId: 'test-session'
        });
        
        console.log('✅ Ответ:', response.reply?.substring(0, 150) + '...');
        console.log('✅ Confidence:', response.confidence);
        console.log('✅ Provider:', response.metadata?.provider || 'unknown');
        console.log('✅ Neural Mode:', response.metadata?.neuralMode || 'none');
        
      } catch (convError) {
        console.error('❌ Ошибка conversation:', convError.message);
      }
    }
    
    console.log('\n✅ Тест завершен успешно');
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    console.error(error.stack);
  }
}

testNeuralConversation().then(() => {
  console.log('\n🎯 Все тесты завершены');
  process.exit(0);
}).catch(error => {
  console.error('❌ Фатальная ошибка:', error);
  process.exit(1);
});