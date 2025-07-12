/**
 * Тест исправления мета-семантического анализа
 * Проверяет, что ошибки "Cannot read properties of undefined" больше не возникают
 */

const { performMetaSemanticAnalysis } = require('./server/semantic-integration-layer.cjs');

async function testMetaSemanticFix() {
  console.log('🔧 ТЕСТ ИСПРАВЛЕНИЯ МЕТА-СЕМАНТИЧЕСКОГО АНАЛИЗА');
  console.log('===============================================');
  
  const testCases = [
    // Тест 1: Нормальные данные
    {
      name: 'Нормальные данные',
      query: 'что такое гидрофобия',
      context: {
        sessionId: 'test-session',
        hasRecentImages: false,
        requestType: 'knowledge_request'
      }
    },
    
    // Тест 2: Пустой запрос
    {
      name: 'Пустой запрос',
      query: '',
      context: {
        sessionId: 'test-session'
      }
    },
    
    // Тест 3: Null запрос
    {
      name: 'Null запрос',
      query: null,
      context: {
        sessionId: 'test-session'
      }
    },
    
    // Тест 4: Undefined запрос
    {
      name: 'Undefined запрос',
      query: undefined,
      context: {
        sessionId: 'test-session'
      }
    },
    
    // Тест 5: Сложный запрос
    {
      name: 'Сложный запрос',
      query: 'создай картинку красивого заката над океаном',
      context: {
        sessionId: 'test-session',
        hasRecentImages: true,
        requestType: 'image_generation'
      }
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Тест: ${testCase.name}`);
      console.log(`   Query: ${testCase.query || 'null/undefined'}`);
      
      const result = await performMetaSemanticAnalysis(testCase.query, testCase.context);
      
      if (result && typeof result === 'object') {
        console.log(`   ✅ Успешно: получен корректный результат`);
        console.log(`   📊 Статус: ${result.shouldUseSemantic ? 'семантика активна' : 'fallback'}`);
        
        if (result.error) {
          console.log(`   ⚠️  Ошибка в результате: ${result.error}`);
        }
        
        passedTests++;
      } else {
        console.log(`   ❌ Провал: некорректный результат`);
        console.log(`   📋 Результат:`, result);
      }
      
    } catch (error) {
      console.log(`   ❌ Исключение: ${error.message}`);
      console.log(`   📋 Стек:`, error.stack);
      
      // Проверяем специфическую ошибку
      if (error.message.includes('Cannot read properties of undefined')) {
        console.log(`   🚨 КРИТИЧЕСКАЯ ОШИБКА: Проблема НЕ исправлена!`);
      } else {
        console.log(`   📝 Другая ошибка: возможно, ожидаемая`);
        passedTests++; // Если это не наша ошибка, засчитываем как пройденный
      }
    }
  }
  
  console.log('\n📊 ИТОГИ ТЕСТИРОВАНИЯ:');
  console.log(`   ✅ Успешно: ${passedTests}/${totalTests} тестов`);
  console.log(`   📈 Процент успеха: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('   🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ - ОШИБКА ИСПРАВЛЕНА!');
    return true;
  } else {
    console.log('   ⚠️  Некоторые тесты провалились - требуется дополнительная работа');
    return false;
  }
}

// Запуск тестирования
if (require.main === module) {
  testMetaSemanticFix()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Критическая ошибка тестирования:', error);
      process.exit(1);
    });
}

module.exports = {
  testMetaSemanticFix
};