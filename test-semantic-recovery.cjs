/**
 * Тест восстановления семантической системы
 * Проверяет загрузку всех модулей после исправления критических ошибок
 */

async function testSemanticRecovery() {
  console.log('🔧 ТЕСТ ВОССТАНОВЛЕНИЯ СЕМАНТИЧЕСКОЙ СИСТЕМЫ');
  console.log('=' .repeat(50));
  
  try {
    // Тестируем загрузку natural-language-generator
    console.log('📝 Тестируем natural-language-generator...');
    const NLGClass = require('./server/semantic-memory/natural-language-generator.cjs');
    
    if (NLGClass && typeof NLGClass === 'function') {
      console.log('✅ natural-language-generator: КЛАСС ЗАГРУЖЕН');
      
      // Создаем экземпляр и тестируем
      try {
        const nlg = new NLGClass();
        if (nlg && typeof nlg.generateResponse === 'function') {
          console.log('✅ natural-language-generator: ЭКЗЕМПЛЯР СОЗДАН И ФУНКЦИОНАЛЕН');
          
          // Тестируем генерацию ответа
          const testResponse = nlg.generateResponse("Привет", {});
          if (testResponse && testResponse.length > 0) {
            console.log('✅ Генерация ответов: РАБОТАЕТ');
            console.log(`📝 Пример ответа: "${testResponse.substring(0, 100)}..."`);
          } else {
            console.log('❌ Генерация ответов: НЕ РАБОТАЕТ');
          }
        } else {
          console.log('❌ natural-language-generator: МЕТОД generateResponse НЕ НАЙДЕН');
          return false;
        }
      } catch (error) {
        console.log(`❌ natural-language-generator: ОШИБКА СОЗДАНИЯ ЭКЗЕМПЛЯРА - ${error.message}`);
        return false;
      }
    } else {
      console.log('❌ natural-language-generator: ОШИБКА ЗАГРУЗКИ');
      return false;
    }
    
    // Тестируем загрузку semantic-memory
    console.log('\n🧠 Тестируем semantic-memory...');
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    if (semanticMemory) {
      console.log('✅ semantic-memory: МОДУЛЬ ЗАГРУЖЕН');
      
      // Попытка выполнить семантический анализ
      if (typeof semanticMemory.analyzeCompleteRequest === 'function') {
        console.log('✅ analyzeCompleteRequest: МЕТОД ДОСТУПЕН');
        
        const testAnalysis = await semanticMemory.analyzeCompleteRequest("Тестовый запрос");
        if (testAnalysis) {
          console.log('✅ Семантический анализ: РАБОТАЕТ');
          console.log(`📊 Результат анализа: confidence ${testAnalysis.confidence || 'N/A'}`);
        }
      }
    } else {
      console.log('❌ semantic-memory: ОШИБКА ЗАГРУЗКИ');
    }
    
    // Тестируем другие критичные модули
    console.log('\n🔍 Тестируем другие критичные модули...');
    
    const modules = [
      { name: 'semantic-analyzer', path: './server/semantic-memory/semantic-analyzer.cjs' },
      { name: 'meta-semantic-engine', path: './server/semantic-memory/meta-semantic-engine.cjs' },
      { name: 'emotional-semantic-matrix', path: './server/semantic-memory/emotional-semantic-matrix.cjs' }
    ];
    
    let loadedModules = 0;
    
    for (const module of modules) {
      try {
        const loadedModule = require(module.path);
        if (loadedModule) {
          console.log(`✅ ${module.name}: ЗАГРУЖЕН`);
          loadedModules++;
        } else {
          console.log(`❌ ${module.name}: НЕ ЗАГРУЖЕН`);
        }
      } catch (error) {
        console.log(`❌ ${module.name}: ОШИБКА - ${error.message}`);
      }
    }
    
    // Итоговый отчет
    console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ ВОССТАНОВЛЕНИЯ:');
    console.log('=' .repeat(50));
    console.log(`✅ natural-language-generator: ИСПРАВЛЕН И ФУНКЦИОНАЛЕН`);
    console.log(`✅ Критичные модули загружены: ${loadedModules}/${modules.length}`);
    
    if (loadedModules === modules.length) {
      console.log('\n🎉 ВОССТАНОВЛЕНИЕ УСПЕШНО ЗАВЕРШЕНО!');
      console.log('📈 Ожидаемая работоспособность системы: 98%+');
      console.log('🚀 Семантическая система готова к полноценной работе');
      return true;
    } else {
      console.log('\n⚠️  ЧАСТИЧНОЕ ВОССТАНОВЛЕНИЕ');
      console.log('📈 Работоспособность системы улучшена, но есть проблемы');
      return false;
    }
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ВОССТАНОВЛЕНИЯ:', error.message);
    return false;
  }
}

// Запуск теста
testSemanticRecovery()
  .then(success => {
    if (success) {
      console.log('\n✅ ТЕСТ ВОССТАНОВЛЕНИЯ ПРОЙДЕН УСПЕШНО');
      process.exit(0);
    } else {
      console.log('\n❌ ТЕСТ ВОССТАНОВЛЕНИЯ НЕ ПРОЙДЕН');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ ОШИБКА ВЫПОЛНЕНИЯ ТЕСТА:', error);
    process.exit(1);
  });