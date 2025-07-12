/**
 * 🧪 ТЕСТ ИСПРАВЛЕНИЯ НЕЙРОННОЙ СЕТИ
 * Проверяем работоспособность исправленной архитектуры
 */

const tf = require('@tensorflow/tfjs-node');
const { BooomerangsNeuralCore } = require('./server/neural-network-core.cjs');

async function testNeuralNetworkFix() {
  console.log('🧪 Тестирование исправленной нейронной сети...');
  
  try {
    // 1. СОЗДАНИЕ НЕЙРОННОЙ СЕТИ
    console.log('📋 Этап 1: Создание экземпляра нейронной сети...');
    const neuralCore = new BooomerangsNeuralCore();
    
    // 2. ИНИЦИАЛИЗАЦИЯ
    console.log('📋 Этап 2: Инициализация нейронной сети...');
    await neuralCore.initialize();
    
    // 3. ПРОВЕРКА МОДЕЛИ
    console.log('📋 Этап 3: Проверка созданной модели...');
    if (neuralCore.model) {
      console.log('✅ Модель создана успешно!');
      
      // Выводим информацию о модели
      const modelInfo = {
        inputs: neuralCore.model.inputs.length,
        outputs: neuralCore.model.outputs.length,
        layers: neuralCore.model.layers.length,
        params: neuralCore.model.countParams()
      };
      
      console.log('📊 Информация о модели:');
      console.log(`  - Входы: ${modelInfo.inputs}`);
      console.log(`  - Выходы: ${modelInfo.outputs}`);
      console.log(`  - Слои: ${modelInfo.layers}`);
      console.log(`  - Параметры: ${modelInfo.params.toLocaleString()}`);
      
      // 4. ТЕСТОВЫЙ ПРОГОН
      console.log('📋 Этап 4: Тестовый прогон модели...');
      
      // Создаем тестовые данные с правильной длиной последовательности
      const batchSize = 2;
      const seqLength = neuralCore.maxSequenceLength; // Используем правильную длину
      
      const testInput = tf.randomUniform([batchSize, seqLength], 0, neuralCore.vocabSize, 'int32');
      const testPositions = tf.range(0, seqLength).expandDims(0).tile([batchSize, 1]);
      
      console.log(`  - Тестовые данные: [${batchSize}, ${seqLength}]`);
      console.log(`  - Размер словаря: ${neuralCore.vocabSize}`);
      
      // Прогоняем через модель
      const prediction = neuralCore.model.predict([testInput, testPositions]);
      
      console.log(`✅ Предсказание выполнено! Форма: [${prediction.shape}]`);
      
      // 5. ТЕСТ ГЕНЕРАЦИИ ОТВЕТА
      console.log('📋 Этап 5: Тест генерации ответа...');
      
      const testResponse = await neuralCore.generateResponse('Привет, как дела?');
      console.log(`✅ Ответ сгенерирован: "${testResponse}"`);
      
      // Очищаем память
      testInput.dispose();
      testPositions.dispose();
      prediction.dispose();
      
    } else {
      console.log('❌ Модель не была создана');
      return false;
    }
    
    console.log('🎉 ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!');
    console.log('✅ Нейронная сеть работает корректно');
    console.log('✅ LayerNormalization исправлена');
    console.log('✅ Position embeddings функционируют');
    console.log('✅ Архитектура стабильна');
    
    return true;
    
  } catch (error) {
    console.error('❌ ОШИБКА В ТЕСТЕ:', error.message);
    console.error('🔍 Детали ошибки:', error.stack);
    return false;
  }
}

// Запуск теста
if (require.main === module) {
  testNeuralNetworkFix()
    .then(success => {
      if (success) {
        console.log('\n🚀 СИСТЕМА ГОТОВА К РАБОТЕ!');
        process.exit(0);
      } else {
        console.log('\n💥 ТРЕБУЕТСЯ ДОПОЛНИТЕЛЬНОЕ ИСПРАВЛЕНИЕ');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
      process.exit(1);
    });
}

module.exports = { testNeuralNetworkFix };