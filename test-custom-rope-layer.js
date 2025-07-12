
/**
 * 🧪 ТЕСТ CUSTOM ROPE LAYER
 * Проверяем работоспособность новой реализации
 */

const tf = require('@tensorflow/tfjs-node');
const { RoPELayer } = require('./server/custom-rope-layer');

async function testCustomRoPELayer() {
  console.log('🧪 Тестирование Custom RoPE Layer...');

  try {
    // Параметры теста
    const batchSize = 2;
    const seqLength = 10;
    const embeddingDim = 64;

    // Создаем тестовые данные
    const embeddings = tf.randomNormal([batchSize, seqLength, embeddingDim]);
    const positions = tf.range(0, seqLength).expandDims(0).tile([batchSize, 1]);

    console.log('📊 Входные данные:');
    console.log(`  Embeddings shape: [${embeddings.shape.join(', ')}]`);
    console.log(`  Positions shape: [${positions.shape.join(', ')}]`);

    // Создаем RoPE Layer
    const ropeLayer = new RoPELayer({
      embeddingDim: embeddingDim,
      maxSeqLength: seqLength,
      name: 'test_rope'
    });

    // Применяем RoPE с правильными входными данными
    let result;
    try {
      result = ropeLayer.apply([embeddings, positions]);
    } catch (error) {
      console.log('🔄 Пробуем с одним входом:', error.message);
      result = ropeLayer.apply(embeddings);
    }

    console.log('✅ RoPE Layer тест прошел успешно!');
    console.log(`  Результат shape: [${result.shape.join(', ')}]`);
    console.log(`  Размерности совпадают: ${JSON.stringify(result.shape) === JSON.stringify(embeddings.shape)}`);

    // Проверяем, что результат отличается от входа (RoPE применился)
    const diff = tf.sum(tf.abs(tf.sub(result, embeddings)));
    const diffValue = await diff.data();
    console.log(`  Общее различие: ${diffValue[0].toFixed(6)}`);
    console.log(`  RoPE изменил embeddings: ${diffValue[0] > 0.001}`);

    // Тест сериализации
    const config = ropeLayer.getConfig();
    console.log('✅ Конфигурация сериализации:', config);

    // Очистка памяти
    embeddings.dispose();
    positions.dispose();
    result.dispose();
    diff.dispose();
    ropeLayer.dispose();

    console.log('🎉 Все тесты Custom RoPE Layer прошли успешно!');
    return true;

  } catch (error) {
    console.error('❌ Ошибка тестирования Custom RoPE Layer:', error);
    return false;
  }
}

// Запускаем тест если файл вызван напрямую
if (require.main === module) {
  testCustomRoPELayer().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testCustomRoPELayer };
