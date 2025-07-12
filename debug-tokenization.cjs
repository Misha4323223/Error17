
/**
 * 🔍 ДИАГНОСТИКА ПРОБЛЕМ ТОКЕНИЗАЦИИ
 * Анализ и исправление проблем с UNK токенами
 */

const { BooomerangsNeuralCore } = require('./server/neural-network-core.cjs');

async function debugTokenization() {
  console.log('🔍 Запуск диагностики токенизации...');
  
  try {
    const neural = new BooomerangsNeuralCore();
    await neural.initialize();
    
    // Тестовые фразы
    const testPhrases = [
      'что такое свежость',
      'как дела',
      'создай изображение',
      'booomerangs ai система'
    ];
    
    console.log('\n📝 Тестирование токенизации...');
    
    for (const phrase of testPhrases) {
      console.log(`\n🎯 Фраза: "${phrase}"`);
      
      // Токенизация
      const tokens = neural.tokenize(phrase);
      console.log(`📊 Токены: [${tokens.join(', ')}]`);
      
      // Детокенизация
      const detokenized = neural.detokenize(tokens);
      console.log(`🔄 Детокенизация: "${detokenized}"`);
      
      // Анализ UNK токенов
      const unkCount = detokenized.split('<UNK>').length - 1;
      const totalWords = phrase.split(' ').length;
      const unkRatio = unkCount / totalWords;
      
      console.log(`📈 UNK анализ: ${unkCount}/${totalWords} (${(unkRatio * 100).toFixed(1)}%)`);
      
      if (unkRatio > 0.3) {
        console.log('❌ Высокий процент UNK токенов!');
      } else {
        console.log('✅ UNK токены в норме');
      }
    }
    
    // Статистика словарей
    console.log('\n📚 Статистика словарей:');
    console.log(`   vocabulary размер: ${neural.vocabulary.size}`);
    console.log(`   reverseVocabulary размер: ${neural.reverseVocabulary.size}`);
    console.log(`   vocabSize: ${neural.vocabSize}`);
    
    // Проверка первых 10 токенов
    console.log('\n🔍 Первые 10 токенов:');
    for (let i = 0; i < 10; i++) {
      const word = neural.reverseVocabulary.get(i);
      const index = neural.vocabulary.get(word);
      console.log(`   ${i}: "${word}" -> ${index} ${index === i ? '✅' : '❌'}`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка диагностики:', error);
  }
}

// Запуск диагностики
debugTokenization();
