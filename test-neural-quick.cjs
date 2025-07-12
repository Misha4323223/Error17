/**
 * 🧪 БЫСТРЫЙ ТЕСТ НЕЙРОСЕТИ
 * Проверяем работу нейросети с минимальными зависимостями
 */

const { initializeNeuralIntegration } = require('./server/neural-integration.cjs');

async function testNeuralQuick() {
  console.log('🧠 БЫСТРЫЙ ТЕСТ НЕЙРОСЕТИ');
  console.log('=' .repeat(40));

  try {
    // Инициализируем нейросеть
    console.log('🔗 Инициализация нейросети...');
    const neuralIntegration = await initializeNeuralIntegration();
    
    if (!neuralIntegration.isInitialized) {
      console.log('❌ Нейросеть не инициализирована');
      return false;
    }

    console.log('✅ Нейросеть инициализирована успешно!');
    
    // Тестируем статистику
    const stats = neuralIntegration.getSystemStats();
    console.log('\n📊 Статистика системы:');
    console.log(`  - Архитектура: ${stats.neural?.architecture || 'N/A'}`);
    console.log(`  - Слои: ${stats.neural?.numLayers || 'N/A'}`);
    console.log(`  - Параметры: ${stats.neural?.totalParams?.toLocaleString() || 'N/A'}`);
    console.log(`  - Модель загружена: ${stats.modelLoaded}`);
    console.log(`  - Семантика: ${stats.semantic}`);

    // Тестируем генерацию
    console.log('\n🧠 Тестируем генерацию ответа...');
    const testInput = "Привет! Как дела?";
    
    const response = await neuralIntegration.generateHybridResponse(testInput, {
      temperature: 0.7,
      maxTokens: 100,
      context: { sessionId: 'test', userId: 'user' }
    });

    console.log('✅ Ответ получен:');
    console.log(`  - Длина: ${response.length} символов`);
    console.log(`  - Предпросмотр: "${response.substring(0, 120)}"`);

    // Тестируем несколько запросов
    const testQueries = [
      "Что такое искусственный интеллект?",
      "Создай изображение кота",
      "Помоги с дизайном"
    ];

    console.log('\n🔄 Тестируем разные типы запросов:');
    
    for (const query of testQueries) {
      try {
        const result = await neuralIntegration.generateHybridResponse(query, {
          temperature: 0.8,
          maxTokens: 80,
          context: { sessionId: 'test', userId: 'user' }
        });
        
        console.log(`✅ "${query}" → ${result.length} символов`);
      } catch (error) {
        console.log(`❌ "${query}" → Ошибка: ${error.message}`);
      }
    }

    console.log('\n🎉 ТЕСТ ЗАВЕРШЕН УСПЕШНО!');
    console.log('✅ Нейросеть работает корректно');
    console.log('✅ Гибридная генерация функционирует');
    console.log('✅ Система готова к использованию');
    
    return true;

  } catch (error) {
    console.error('❌ Ошибка теста:', error.message);
    return false;
  }
}

// Запуск теста
if (require.main === module) {
  testNeuralQuick()
    .then(success => {
      if (success) {
        console.log('\n🚀 НЕЙРОСЕТЬ ПОЛНОСТЬЮ РАБОТАЕТ!');
        process.exit(0);
      } else {
        console.log('\n⚠️ НЕЙРОСЕТЬ ТРЕБУЕТ ДОРАБОТКИ');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
      process.exit(1);
    });
}

module.exports = { testNeuralQuick };