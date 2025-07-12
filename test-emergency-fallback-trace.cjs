/**
 * EMERGENCY ТРАССИРОВКА ИСТОЧНИКА FALLBACK ОТВЕТА
 * Находим где именно генерируется "Интересно! Расскажи больше"
 */

const { exec } = require('child_process');
const fs = require('fs');

console.log('🚨 EMERGENCY ТРАССИРОВКА FALLBACK ОТВЕТА');
console.log('🔍 Ищем точный источник "Интересно! Расскажи больше"');

async function traceEmergencyFallback() {
  try {
    // Имитируем РЕАЛЬНЫЙ запрос пользователя через систему
    console.log('📤 Отправляем тестовый запрос "сучка" через семантическую систему...');
    
    // Импортируем smart-router как единую точку входа
    const smartRouter = require('./server/smart-router.js');
    
    if (smartRouter && smartRouter.getChatResponse) {
      console.log('✅ Smart router загружен');
      
      // Делаем РЕАЛЬНЫЙ запрос через систему
      const result = await smartRouter.getChatResponse('сучка', {
        userId: 'trace_test',
        sessionId: 999
      });
      
      console.log('🎯 РЕЗУЛЬТАТ СИСТЕМЫ:');
      console.log('📝 Ответ:', result.response);
      console.log('🔧 Провайдер:', result.provider);
      console.log('⚙️ Метод:', result.method);
      console.log('🔍 Confidence:', result.confidence);
      
      // Проверяем содержит ли ответ проблемную фразу
      if (result.response && result.response.includes('Интересно')) {
        console.log('🚨 НАЙДЕН ИСТОЧНИК ПРОБЛЕМЫ!');
        console.log('🔍 Полный ответ:', JSON.stringify(result, null, 2));
        
        // Если это от semantic провайдера - проверяем его логику
        if (result.provider && result.provider.includes('Semantic')) {
          console.log('🎯 Проблема в семантическом провайдере');
          console.log('📁 Проверьте conversation-engine-semantic-provider.cjs');
        }
        
        if (result.method) {
          console.log('🎯 Метод генерации:', result.method);
        }
        
      } else {
        console.log('✅ Проблемный ответ НЕ найден в этом тесте');
        console.log('💡 Возможно проблема только в веб-интерфейсе');
      }
      
    } else {
      console.log('❌ Smart router не найден или не имеет getChatResponse');
    }
    
  } catch (error) {
    console.error('❌ Ошибка трассировки:', error.message);
    console.error('📍 Stack:', error.stack);
  }
}

async function searchInAllFiles() {
  console.log('\n🔍 ГЛОБАЛЬНЫЙ ПОИСК ПО ВСЕМ ФАЙЛАМ...');
  
  // Ищем точный текст из браузера
  const searchTexts = [
    'расскажи больше - я готов помочь',
    'готов помочь или просто поболтать',
    'Расскажи больше'
  ];
  
  for (const searchText of searchTexts) {
    console.log(`\n🔍 Ищем: "${searchText}"`);
    
    try {
      const grepCmd = `find server -name "*.js" -o -name "*.cjs" | xargs grep -l "${searchText}" 2>/dev/null || true`;
      
      exec(grepCmd, (error, stdout, stderr) => {
        if (stdout.trim()) {
          console.log(`✅ НАЙДЕНО в файлах:`);
          console.log(stdout.trim());
        } else {
          console.log(`❌ НЕ найдено: "${searchText}"`);
        }
      });
      
    } catch (error) {
      console.log(`⚠️ Ошибка поиска "${searchText}": ${error.message}`);
    }
  }
}

// Запускаем трассировку
console.log('🚀 НАЧИНАЕМ EMERGENCY ТРАССИРОВКУ...\n');

traceEmergencyFallback()
  .then(() => {
    console.log('\n✅ Трассировка завершена');
    searchInAllFiles();
  })
  .catch(error => {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
  });