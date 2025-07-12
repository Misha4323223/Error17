/**
 * ПРЯМАЯ ТРАССИРОВКА ИСТОЧНИКА FALLBACK ОТВЕТА
 * Обходим smart-router и напрямую тестируем conversation-engine-semantic-provider
 */

console.log('🚨 ПРЯМАЯ ТРАССИРОВКА FALLBACK ОТВЕТА');

async function traceDirectProvider() {
  try {
    console.log('📁 Пытаемся загрузить conversation-engine-semantic-provider...');
    
    // Прямой импорт через dynamic import
    const providerModule = await import('./server/conversation-engine-semantic-provider.cjs');
    
    console.log('✅ Провайдер загружен');
    console.log('🔍 Доступные методы:', Object.keys(providerModule));
    
    if (providerModule.canHandle && providerModule.processRequest) {
      console.log('🎯 Тестируем обработку запроса "сучка"...');
      
      const canHandle = providerModule.canHandle('сучка', {});
      console.log('❓ canHandle результат:', canHandle);
      
      if (canHandle) {
        const result = await providerModule.processRequest('сучка', {
          userId: 'test',
          sessionId: 'test'
        });
        
        console.log('📝 РЕЗУЛЬТАТ ОБРАБОТКИ:');
        console.log('Response:', result.response);
        console.log('Provider:', result.provider);
        console.log('Method:', result.method);
        console.log('Confidence:', result.confidence);
        
        // Проверяем содержит ли ответ проблемную фразу
        if (result.response && result.response.includes('Интересно')) {
          console.log('🚨 НАЙДЕН ИСТОЧНИК В CONVERSATION-ENGINE-SEMANTIC-PROVIDER!');
          
          if (result.response.includes('поболтать')) {
            console.log('💀 ПОЛНОЕ СОВПАДЕНИЕ С ПРОБЛЕМНЫМ ОТВЕТОМ!');
          }
        } else {
          console.log('✅ Не содержит проблемную фразу');
        }
      } else {
        console.log('❌ Провайдер не может обработать запрос');
      }
    } else {
      console.log('❌ Провайдер не имеет нужных методов');
    }
    
  } catch (error) {
    console.error('❌ Ошибка загрузки провайдера:', error.message);
    
    // Пробуем через require
    try {
      console.log('🔄 Пробуем через require...');
      const provider = require('./server/conversation-engine-semantic-provider.cjs');
      console.log('✅ Загружен через require');
      console.log('🔍 Методы:', Object.keys(provider));
    } catch (requireError) {
      console.error('❌ Require тоже не работает:', requireError.message);
    }
  }
}

// Запускаем трассировку
traceDirectProvider();