/**
 * Прямой тест нейросетевой генерации
 */

async function testNeuralDirect() {
  console.log('🧪 Тестируем прямую нейросетевую генерацию...');
  
  try {
    // Получаем neural integration
    const { getGlobalNeuralIntegration } = require('./server/neural-integration.cjs');
    const neuralIntegration = getGlobalNeuralIntegration();
    
    console.log('📊 Статус neural integration:');
    console.log('  Mode:', neuralIntegration.mode);
    console.log('  Initialized:', neuralIntegration.isInitialized);
    console.log('  Neural Core:', !!neuralIntegration.neuralCore);
    console.log('  Neural Lite:', !!neuralIntegration.neuralLite);
    
    // Проверяем текущую модель
    const currentModel = neuralIntegration.getCurrentModel();
    console.log('  Current Model:', !!currentModel);
    
    if (currentModel) {
      console.log('  Model Type:', currentModel.constructor.name);
      
      // Тестируем генерацию
      console.log('\n🤖 Тестируем generateResponse...');
      const testInput = "Привет, как дела?";
      
      try {
        const response = await currentModel.generateResponse(testInput, {
          maxTokens: 50,
          temperature: 0.8
        });
        
        console.log('✅ Ответ модели:', response);
        console.log('✅ Длина ответа:', response?.length || 0);
        
      } catch (genError) {
        console.error('❌ Ошибка генерации:', genError.message);
      }
    }
    
    // Тестируем hybrid response
    console.log('\n🔄 Тестируем generateHybridResponse...');
    try {
      const hybridResponse = await neuralIntegration.generateHybridResponse("Привет нейросеть!", {
        maxTokens: 100,
        temperature: 0.9
      });
      
      console.log('✅ Hybrid ответ:', hybridResponse);
      console.log('✅ Hybrid длина:', hybridResponse?.length || 0);
      
    } catch (hybridError) {
      console.error('❌ Ошибка hybrid генерации:', hybridError.message);
    }
    
    // Тестируем conversation engine
    console.log('\n💬 Тестируем через conversation engine...');
    try {
      const conversationEngine = require('./server/conversation-engine.cjs');
      const convResponse = await conversationEngine.processUserInput("Привет!", {
        userId: 'test',
        sessionId: 'test-session'
      });
      
      console.log('✅ Conversation ответ:', convResponse.reply?.substring(0, 200));
      console.log('✅ Metadata:', convResponse.metadata);
      
    } catch (convError) {
      console.error('❌ Ошибка conversation engine:', convError.message);
    }
    
  } catch (error) {
    console.error('❌ Общая ошибка теста:', error);
    console.error(error.stack);
  }
}

testNeuralDirect().then(() => {
  console.log('\n🎯 Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});