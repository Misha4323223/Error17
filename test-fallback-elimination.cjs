/**
 * ТЕСТ УСТРАНЕНИЯ FALLBACK ОТВЕТОВ - ФИНАЛЬНАЯ ПРОВЕРКА
 * Тестирует полную цепочку обработки после исправлений
 */

console.log('🔍 ТЕСТ УСТРАНЕНИЯ FALLBACK ОТВЕТОВ');

async function testFallbackElimination() {
  try {
    console.log('📋 Загружаем conversation-engine-semantic-provider...');
    
    // Прямой импорт через require
    const provider = require('./server/conversation-engine-semantic-provider.cjs');
    
    console.log('✅ Провайдер загружен');
    console.log('🔍 Доступные методы:', Object.keys(provider));
    
    // Тестируем проблематичные запросы
    const testQueries = [
      'сучка',
      'что такое антифриз',
      'расскажи про космос',
      'дайдай да'
    ];
    
    for (const query of testQueries) {
      console.log(`\n🧪 Тестируем запрос: "${query}"`);
      
      const canHandle = provider.canHandle(query, {});
      console.log('❓ canHandle результат:', canHandle);
      
      if (canHandle) {
        const result = await provider.processRequest(query, {
          userId: 'test',
          sessionId: 'test'
        });
        
        console.log('📝 РЕЗУЛЬТАТ:');
        console.log('Response длина:', result.response?.length || 0);
        console.log('Provider:', result.provider);
        console.log('Method:', result.method);
        console.log('Confidence:', result.confidence);
        
        // ОСНОВНАЯ ПРОВЕРКА - содержит ли ответ fallback фразы
        if (result.response) {
          const response = result.response;
          
          if (response.includes('Интересно!')) {
            console.log('❌ FALLBACK НАЙДЕН: Содержит "Интересно!"');
          } else if (response.includes('поболтать')) {
            console.log('❌ FALLBACK НАЙДЕН: Содержит "поболтать"');
          } else if (response.includes('готов помочь') && response.length < 100) {
            console.log('❌ FALLBACK НАЙДЕН: Короткий ответ с "готов помочь"');
          } else if (response.length < 50) {
            console.log('❌ FALLBACK НАЙДЕН: Слишком короткий ответ');
          } else {
            console.log('✅ КАЧЕСТВЕННЫЙ ОТВЕТ СГЕНЕРИРОВАН');
          }
          
          console.log('📋 Первые 100 символов:', response.substring(0, 100) + '...');
        } else {
          console.log('❌ Пустой ответ');
        }
      } else {
        console.log('⏭️ Провайдер не обрабатывает запрос');
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка теста:', error.message);
  }
}

// Запускаем тест
testFallbackElimination();