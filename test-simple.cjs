/**
 * Простой тест анализа намерений
 */

async function testIntentAnalysis() {
  console.log('🧠 Тестирование анализа намерений...\n');
  
  // Имитируем простой анализ
  const testQueries = [
    'Какая погода в Москве?',
    'Нарисуй красивую собаку', 
    'Привет, как дела?',
    'Который сейчас час?'
  ];
  
  for (const query of testQueries) {
    console.log(`📝 Анализирую: "${query}"`);
    
    const intent = analyzeIntent(query);
    console.log(`   Категория: ${intent.category}`);
    console.log(`   Уверенность: ${intent.confidence}%\n`);
  }
}

function analyzeIntent(query) {
  const q = query.toLowerCase();
  
  if (q.includes('погода') || q.includes('курс') || q.includes('новости')) {
    return { category: 'web_search', confidence: 85 };
  }
  
  if (q.includes('нарисуй') || q.includes('изображение') || q.includes('картинку')) {
    return { category: 'image_generation', confidence: 90 };
  }
  
  if (q.includes('время') || q.includes('час') || q.includes('дата')) {
    return { category: 'time_date', confidence: 95 };
  }
  
  if (q.includes('привет') || q.includes('как дела') || q.includes('спасибо')) {
    return { category: 'conversation', confidence: 80 };
  }
  
  return { category: 'conversation', confidence: 30 };
}

testIntentAnalysis();