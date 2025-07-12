/**
 * Тест conversation-engine для поиска источника ошибки
 */

async function testConversationEngine() {
  console.log('🔧 ОТЛАДКА CONVERSATION-ENGINE');
  console.log('=' .repeat(50));
  
  try {
    // Импортируем conversation-engine
    console.log('📦 Загружаем conversation-engine...');
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    if (!conversationEngine) {
      console.log('❌ conversation-engine НЕ ЗАГРУЖЕН');
      return false;
    }
    
    console.log('✅ conversation-engine загружен');
    console.log('📋 Доступные методы:', Object.keys(conversationEngine));
    
    // Проверяем processUserInput
    if (typeof conversationEngine.processUserInput !== 'function') {
      console.log('❌ Метод processUserInput НЕ НАЙДЕН');
      return false;
    }
    
    console.log('✅ Метод processUserInput найден');
    
    // Создаем тестовые данные
    const testInput = "Что такое огонь?";
    const userContext = {
      userId: 'test-user',
      sessionId: 'test-session',
      conversationHistory: [],
      userProfile: null,
      sessionContext: {}
    };
    
    console.log('\n🧪 ТЕСТИРУЕМ processUserInput...');
    console.log(`📝 Входной запрос: "${testInput}"`);
    console.log('⏱️  Таймаут: 15 секунд');
    
    const processPromise = conversationEngine.processUserInput(testInput, userContext);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Таймаут обработки (15 сек)')), 15000);
    });
    
    try {
      const result = await Promise.race([processPromise, timeoutPromise]);
      
      console.log('\n✅ ОБРАБОТКА ЗАВЕРШЕНА');
      console.log('📊 Структура результата:');
      
      if (result) {
        console.log(`  • reply: ${result.reply ? `"${result.reply.substring(0, 100)}..."` : 'undefined'}`);
        console.log(`  • confidence: ${result.confidence || 'undefined'}`);
        console.log(`  • quality: ${result.quality || 'undefined'}`);
        console.log(`  • metadata: ${result.metadata ? 'есть' : 'НЕТ'}`);
        
        if (result.metadata) {
          console.log(`    • modulesUsed: ${result.metadata.modulesUsed || 'undefined'}`);
          console.log(`    • processingTime: ${result.metadata.processingTime || 'undefined'}`);
        }
        
        // Анализируем тип ответа
        if (result.reply && result.reply.includes('системе сознания')) {
          console.log('❌ ПОЛУЧИЛИ FALLBACK ОШИБКУ');
          console.log('🔍 Это означает, что произошло исключение в catch блоке');
          return false;
        } else {
          console.log('✅ ПОЛУЧИЛИ НОРМАЛЬНЫЙ ОТВЕТ');
          return true;
        }
        
      } else {
        console.log('❌ РЕЗУЛЬТАТ NULL ИЛИ UNDEFINED');
        return false;
      }
      
    } catch (processError) {
      console.log('\n❌ ОШИБКА В processUserInput:');
      console.error('   Сообщение:', processError.message);
      console.error('   Стек:', processError.stack?.split('\n').slice(0, 8).join('\n'));
      
      // Детализируем тип ошибки
      if (processError.message.includes('Cannot read properties')) {
        console.log('🔍 ТИП ОШИБКИ: Обращение к свойству null/undefined объекта');
      } else if (processError.message.includes('is not a function')) {
        console.log('🔍 ТИП ОШИБКИ: Вызов несуществующей функции');
      } else if (processError.message.includes('Таймаут')) {
        console.log('🔍 ТИП ОШИБКИ: Превышение времени ожидания');
      } else {
        console.log('🔍 ТИП ОШИБКИ: Неизвестная ошибка');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ЗАГРУЗКИ:', error.message);
    console.error('❌ Стек:', error.stack?.split('\n').slice(0, 5).join('\n'));
    return false;
  }
}

// Запуск диагностики
testConversationEngine()
  .then(success => {
    console.log('\n📊 РЕЗУЛЬТАТ ОТЛАДКИ CONVERSATION-ENGINE:');
    console.log('=' .repeat(50));
    
    if (success) {
      console.log('✅ CONVERSATION-ENGINE РАБОТАЕТ КОРРЕКТНО');
      console.log('🔍 Проблема НЕ в conversation-engine.processUserInput');
      console.log('💡 Нужно проверить маршрутизацию в routes.ts или smart-router');
    } else {
      console.log('❌ ОБНАРУЖЕНА ПРОБЛЕМА В CONVERSATION-ENGINE');
      console.log('🔧 processUserInput падает в fallback');
      console.log('💡 Нужно найти источник исключения в conversation-engine');
    }
    
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ ФАТАЛЬНАЯ ОШИБКА ОТЛАДКИ:', error);
    process.exit(1);
  });