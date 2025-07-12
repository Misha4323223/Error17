/**
 * ЭТАП 4: Тестирование загрузки всех модулей
 */

const path = require('path');

async function testModuleLoading() {
  console.log('🧪 Начинаем тестирование загрузки всех модулей...');
  
  const problematicModules = [
    'creative-semantic-engine',
    'external-knowledge-integrator',
    'learning-system',
    'meta-semantic-engine'
  ];
  
  let successCount = 0;
  let failureCount = 0;
  
  // Тестируем проблемные модули
  for (const moduleName of problematicModules) {
    try {
      console.log(`\n📦 Тестирование модуля: ${moduleName}`);
      const module = require(path.join(__dirname, 'server', 'semantic-memory', `${moduleName}.cjs`));
      
      if (module && Object.keys(module).length > 0) {
        console.log(`✅ ${moduleName} загружен успешно`);
        console.log(`   Exports: ${Object.keys(module).slice(0, 5).join(', ')}`);
        successCount++;
      } else {
        console.log(`❌ ${moduleName} пуст`);
        failureCount++;
      }
    } catch (error) {
      console.log(`❌ ${moduleName} ошибка: ${error.message}`);
      failureCount++;
    }
  }
  
  // Тестируем главный модуль
  try {
    console.log(`\n📦 Тестирование главного модуля: index.cjs`);
    const mainModule = require(path.join(__dirname, 'server', 'semantic-memory', 'index.cjs'));
    
    const expectedFunctions = [
      'analyzeCompleteRequest',
      'analyzeCompleteRequestWithMeta', 
      'generateResponseWithRealModules',
      'getSystemStatistics',
      'moduleChecker'
    ];
    
    let mainModuleSuccess = true;
    for (const func of expectedFunctions) {
      if (typeof mainModule[func] === 'function' || typeof mainModule[func] === 'object') {
        console.log(`✅ ${func} доступен`);
      } else {
        console.log(`❌ ${func} недоступен`);
        mainModuleSuccess = false;
      }
    }
    
    if (mainModuleSuccess) {
      console.log(`✅ Главный модуль загружен успешно`);
      successCount++;
    } else {
      console.log(`❌ Главный модуль имеет проблемы`);
      failureCount++;
    }
    
  } catch (error) {
    console.log(`❌ Главный модуль ошибка: ${error.message}`);
    failureCount++;
  }
  
  console.log(`\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:`);
  console.log(`✅ Успешно: ${successCount}`);
  console.log(`❌ Неудачно: ${failureCount}`);
  console.log(`📈 Успешность: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`);
  
  return { successCount, failureCount };
}

// Запускаем тест
testModuleLoading().then(result => {
  if (result.failureCount === 0) {
    console.log('\n🎉 ВСЕ МОДУЛИ ЗАГРУЖЕНЫ УСПЕШНО!');
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ С ЗАГРУЗКОЙ МОДУЛЕЙ');
  }
}).catch(error => {
  console.error('❌ Критическая ошибка тестирования:', error);
});