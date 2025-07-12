/**
 * БЫСТРЫЙ ТЕСТ СИСТЕМЫ ЧАТА
 * Найдем где реально происходит fallback
 */

async function testChatSystem() {
  console.log('🔍 БЫСТРЫЙ ТЕСТ СИСТЕМЫ ЧАТА');
  console.log('='.repeat(50));
  
  try {
    // Тестируем direct smart-router
    console.log('\n1️⃣ ТЕСТИРУЕМ SMART-ROUTER НАПРЯМУЮ...');
    
    const smartRouter = require('./server/smart-router.js');
    
    // Проверим что экспортирует smart-router
    console.log('✅ Методы smart-router:', Object.keys(smartRouter));
    
    if (smartRouter.getChatResponse) {
      console.log('📞 Вызываем getChatResponse...');
      
      const result = await smartRouter.getChatResponse("Привет, расскажи про искусственный интеллект", {
        userId: 'test',
        sessionId: 'test-session'
      });
      
      console.log('📋 РЕЗУЛЬТАТ ОТ SMART-ROUTER:');
      console.log('- Провайдер:', result?.provider || 'НЕ УКАЗАН');
      console.log('- Длина ответа:', result?.response?.length || 0);
      console.log('- Первые 100 символов:', result?.response?.substring(0, 100) || 'ПУСТОЙ');
      console.log('- Содержит fallback?:', result?.response?.includes('Интересно! Расскажи больше') ? '🚨 ДА!' : '✅ НЕТ');
    } else {
      console.log('❌ getChatResponse НЕ НАЙДЕН');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testChatSystem().then(() => {
  console.log('\n🏁 ТЕСТ ЗАВЕРШЕН');
}).catch(error => {
  console.error('💥 ТЕСТ УПАЛ:', error);
});