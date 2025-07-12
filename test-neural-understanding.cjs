/**
 * 🧠 ТЕСТ ПОНИМАНИЯ НЕЙРОСЕТИ
 * Проверяем, понимает ли нейросеть что ей пишут
 */

async function testNeuralUnderstanding() {
  console.log('🧠 Тестирование понимания нейросети...');
  
  try {
    // Проверяем доступность нейросети
    const neuralCore = require('./server/neural-network-core.cjs');
    
    console.log('✅ Нейросеть загружена');
    console.log('📊 Параметры модели:', neuralCore.getModelSummary ? neuralCore.getModelSummary() : 'Не доступно');
    
    // Тест понимания простого текста
    const testInputs = [
      "что такое трава",
      "привет как дела",
      "создай изображение кота",
      "расскажи про космос"
    ];
    
    for (const input of testInputs) {
      console.log(`\n🔍 Тестируем: "${input}"`);
      
      // Проверяем семантическое понимание
      const semanticMemory = require('./server/semantic-memory/index.cjs');
      const analysis = await semanticMemory.analyzeCompleteRequest(input, {});
      
      console.log(`📊 Семантическое понимание: ${analysis.confidence || 'неизвестно'}`);
      console.log(`🎯 Категория: ${analysis.category || 'неопределено'}`);
      console.log(`📝 Ответ: ${analysis.generatedResponse ? analysis.generatedResponse.substring(0, 100) + '...' : 'Нет ответа'}`);
    }
    
    // Проверяем работу neural integration
    try {
      const neuralIntegration = require('./server/neural-integration.cjs');
      console.log('\n🔗 Neural Integration доступен');
      
      const neuralResponse = await neuralIntegration.generateHybridResponse("что такое трава", {});
      console.log('🧠 Нейросеть отвечает:', neuralResponse ? neuralResponse.substring(0, 100) + '...' : 'Нет ответа');
      
    } catch (error) {
      console.log('❌ Neural Integration недоступен:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования нейросети:', error.message);
  }
}

testNeuralUnderstanding();