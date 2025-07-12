/**
 * Простое обучение нейросети с правильной компиляцией
 */

async function trainSimple() {
  console.log('🚀 Простое обучение LITE нейросети...');
  
  try {
    // Загружаем neural integration
    const { getGlobalNeuralIntegration } = require('./server/neural-integration.cjs');
    const neuralIntegration = getGlobalNeuralIntegration();
    
    // Инициализируем если нужно
    if (!neuralIntegration.isInitialized) {
      await neuralIntegration.initializeLite();
    }
    
    const neuralLite = neuralIntegration.neuralLite;
    console.log('✅ Neural Lite получен');
    
    // Подготавливаем простые обучающие данные
    const trainingData = [
      { input: 'Привет', output: 'Привет! Рад тебя видеть! Я BOOOMERANGS AI' },
      { input: 'Как дела', output: 'У меня все отлично! Готов к новым задачам' },
      { input: 'Что умеешь', output: 'Я умею создавать изображения и работать с графикой' },
      { input: 'Создай картинку', output: 'Отличная идея! Опиши что именно хочешь увидеть' },
      { input: 'Спасибо', output: 'Пожалуйста! Мне приятно быть полезным' }
    ];
    
    console.log(`📚 Подготовлено ${trainingData.length} примеров для обучения`);
    
    // Проверяем что модель скомпилирована
    if (neuralLite.model && neuralLite.model.optimizer) {
      console.log('✅ Модель уже скомпилирована');
    } else if (neuralLite.model) {
      console.log('🔧 Компилируем модель...');
      neuralLite.model.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy']
      });
      console.log('✅ Модель скомпилирована');
    } else {
      throw new Error('Модель не инициализирована');
    }
    
    // Запускаем обучение через встроенный метод
    await neuralLite.trainOnDialogues(trainingData);
    
    console.log('🎉 Обучение завершено!');
    
    // Тестируем обученную модель
    console.log('\n🧪 Тестирование обученной модели:');
    const testInputs = ['Привет', 'Что умеешь', 'Создай кота'];
    
    for (const input of testInputs) {
      try {
        const response = await neuralLite.generateResponse(input, {
          maxTokens: 30,
          temperature: 0.8
        });
        console.log(`"${input}" → "${response}"`);
      } catch (error) {
        console.log(`"${input}" → Ошибка: ${error.message}`);
      }
    }
    
    // Сохраняем обученную модель
    await neuralLite.saveModel();
    console.log('💾 Обученная модель сохранена');
    
  } catch (error) {
    console.error('❌ Ошибка обучения:', error);
    throw error;
  }
}

trainSimple().then(() => {
  console.log('✅ Простое обучение завершено успешно!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});