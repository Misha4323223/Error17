/**
 * Быстрый тест нейросетевой интеграции
 */

async function testNeuralIntegration() {
  console.log('🧪 Быстрый тест нейросетевой интеграции...');
  
  try {
    // Тестируем напрямую через модуль
    const { NeuralIntegrationLayer } = require('./server/neural-integration.cjs');
    const neuralIntegration = new NeuralIntegrationLayer();
    
    console.log('📋 Инициализация нейросетевой интеграции...');
    await neuralIntegration.initialize();
    
    console.log('🔄 Тестирование генерации ответа...');
    const response = await neuralIntegration.generateHybridResponse('что такое трава');
    
    console.log('📊 Результат:', response);
    
    // Проверяем качество ответа
    if (response && response.length > 50) {
      console.log('✅ Интеграция работает корректно');
    } else {
      console.log('❌ Интеграция не дает полных ответов');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testNeuralIntegration();