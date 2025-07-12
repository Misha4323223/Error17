/**
 * Тест API чата напрямую
 * Проверяет что восстановленная система работает через web интерфейс
 */

const axios = require('axios');

async function testChatAPI() {
  console.log('🔧 ТЕСТ API ЧАТА ПОСЛЕ ВОССТАНОВЛЕНИЯ');
  console.log('=' .repeat(50));
  
  try {
    const testMessage = "Что такое огонь?";
    
    console.log(`📝 Тестируем запрос: "${testMessage}"`);
    console.log('🌐 Отправляем POST /api/ai/chat...');
    
    const response = await axios.post('http://localhost:5000/api/ai/chat', {
      message: testMessage,
      userId: 'test-user',
      sessionId: 'test-session'
    }, {
      timeout: 10000
    });
    
    if (response.status === 200 && response.data) {
      console.log('✅ API ОТВЕТИЛ УСПЕШНО');
      console.log(`📊 Статус: ${response.status}`);
      console.log(`📨 Ответ получен: ${response.data.response ? 'ДА' : 'НЕТ'}`);
      
      if (response.data.response) {
        const responseText = response.data.response;
        console.log(`📝 Длина ответа: ${responseText.length} символов`);
        console.log(`🔍 Тип ответа: ${responseText.includes('системе сознания') ? 'ОШИБКА' : 'НОРМАЛЬНЫЙ'}`);
        console.log(`📖 Фрагмент ответа: "${responseText.substring(0, 150)}..."`);
        
        // Проверяем есть ли ошибки семантической системы
        if (responseText.includes('системе сознания') || responseText.includes('временно недоступны')) {
          console.log('❌ СЕМАНТИЧЕСКАЯ СИСТЕМА НЕ РАБОТАЕТ В LIVE РЕЖИМЕ');
          console.log('🔧 Несмотря на исправления, система все еще генерирует fallback ошибки');
          return false;
        } else if (responseText.length > 50 && !responseText.includes('Извините')) {
          console.log('✅ СЕМАНТИЧЕСКАЯ СИСТЕМА РАБОТАЕТ КОРРЕКТНО');
          console.log('🎉 Система генерирует содержательные ответы');
          return true;
        } else {
          console.log('⚠️  ЧАСТИЧНАЯ РАБОТОСПОСОБНОСТЬ');
          console.log('📈 Система отвечает, но ответы могут быть неполными');
          return false;
        }
      } else {
        console.log('❌ ОТВЕТ ПУСТ');
        return false;
      }
    } else {
      console.log(`❌ API ОШИБКА: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ К API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Сервер не запущен или недоступен на порту 5000');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🔧 Проблема с DNS разрешением localhost');
    } else {
      console.log('🔧 Неизвестная ошибка сети');
    }
    
    return false;
  }
}

// Запуск теста
testChatAPI()
  .then(success => {
    console.log('\n📊 ИТОГОВЫЙ РЕЗУЛЬТАТ:');
    console.log('=' .repeat(50));
    
    if (success) {
      console.log('✅ ТЕСТ УСПЕШЕН - СЕМАНТИЧЕСКАЯ СИСТЕМА РАБОТАЕТ В LIVE РЕЖИМЕ');
      console.log('🚀 Система готова к использованию пользователями');
    } else {
      console.log('❌ ТЕСТ НЕ ПРОЙДЕН - ТРЕБУЕТСЯ ДОПОЛНИТЕЛЬНАЯ ДИАГНОСТИКА');
      console.log('🔧 Необходимо проверить интеграцию между модулями и live системой');
    }
    
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ТЕСТА:', error);
    process.exit(1);
  });