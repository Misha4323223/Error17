/**
 * 🔄 CUSTOM RoPE LAYER - Rotary Position Embeddings
 * Полная реализация RoPE для TensorFlow.js без lambda layers
 */

const tf = require('@tensorflow/tfjs-node');

class RoPELayer extends tf.layers.Layer {
  constructor(config) {
    super(config);
    this.embeddingDim = config.embeddingDim;
    this.maxSeqLength = config.maxSeqLength;
    this.name = config.name || 'rope_layer';
    
    // Проверяем, что embedding dimension четное
    if (this.embeddingDim % 2 !== 0) {
      throw new Error('Embedding dimension must be even for RoPE');
    }
    
    console.log(`✅ RoPE Layer создан: embeddingDim=${this.embeddingDim}, maxSeqLength=${this.maxSeqLength}`);
  }

  build(inputShape) {
    console.log('🔧 Building RoPE Layer...');
    
    // Создаем frequency weights для RoPE
    const halfDim = Math.floor(this.embeddingDim / 2);
    
    this.freqWeights = this.addWeight(
      'rope_frequencies',
      [this.maxSeqLength, halfDim],
      'float32',
      tf.initializers.glorotUniform(),
      null,
      true // trainable
    );
    
    console.log(`✅ RoPE weights created: [${this.maxSeqLength}, ${halfDim}]`);
    super.build(inputShape);
  }

  computeOutputShape(inputShape) {
    // RoPE не меняет размерность - возвращаем форму embeddings
    return inputShape[0]; // Первый input - embeddings
  }

  call(inputs, kwargs) {
    return tf.tidy(() => {
      const [embeddings, positions] = inputs;
      
      console.log('🔄 Applying RoPE transformation...');
      
      // Получаем размеры
      const batchSize = embeddings.shape[0];
      const seqLength = embeddings.shape[1];
      const embeddingDim = embeddings.shape[2];
      
      // Создаем позиционные индексы если не переданы
      let positionIndices;
      if (positions) {
        positionIndices = positions;
      } else {
        positionIndices = tf.range(0, seqLength).expandDims(0).tile([batchSize, 1]);
      }
      
      // Вычисляем частоты
      const frequencies = tf.matMul(
        tf.cast(positionIndices, 'float32'),
        this.freqWeights.read()
      );
      
      // Создаем cos/sin компоненты
      const cosFreq = tf.cos(frequencies);
      const sinFreq = tf.sin(frequencies);
      
      // Расширяем до полной размерности embedding
      const cosExpanded = tf.concat([cosFreq, cosFreq], -1);
      const sinExpanded = tf.concat([sinFreq, sinFreq], -1);
      
      // Применяем rotation
      const rotatedEmbeddings = tf.add(
        tf.mul(embeddings, cosExpanded),
        tf.mul(this.rotateHalf(embeddings), sinExpanded)
      );
      
      console.log('✅ RoPE transformation applied');
      return rotatedEmbeddings;
    });
  }

  rotateHalf(x) {
    // Реализует rotation на половину embedding dimension
    const halfDim = Math.floor(this.embeddingDim / 2);
    
    // Разделяем на две половины
    const x1 = x.slice([0, 0, 0], [-1, -1, halfDim]);
    const x2 = x.slice([0, 0, halfDim], [-1, -1, halfDim]);
    
    // Возвращаем [-x2, x1] конкатенированные
    return tf.concat([tf.neg(x2), x1], -1);
  }

  getConfig() {
    const config = {
      embeddingDim: this.embeddingDim,
      maxSeqLength: this.maxSeqLength,
      name: this.name
    };
    const baseConfig = super.getConfig();
    return {...baseConfig, ...config};
  }

  static get className() {
    return 'RoPELayer';
  }
}

// Регистрируем класс в TensorFlow.js
tf.serialization.registerClass(RoPELayer);

module.exports = { RoPELayer };