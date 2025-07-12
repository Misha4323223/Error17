/**
 * Отладка семантической интеграции
 * Находим точную причину ошибки в analyzeWithSemantics
 */

async function debugSemanticIntegration() {
  console.log('🔧 ОТЛАДКА СЕМАНТИЧЕСКОЙ ИНТЕГРАЦИИ');
  console.log('=' .repeat(50));
  
  try {
    // Загружаем semantic-integration-layer
    console.log('📦 Загружаем semantic-integration-layer...');
    const semanticIntegrationLayer = require('./server/semantic-integration-layer.cjs');
    
    if (!semanticIntegrationLayer) {
      console.log('❌ semantic-integration-layer НЕ ЗАГРУЖЕН');
      return false;
    }
    
    console.log('✅ semantic-integration-layer загружен');
    
    // Проверяем analyzeWithSemantics метод
    if (typeof semanticIntegrationLayer.analyzeWithSemantics !== 'function') {
      console.log('❌ Метод analyzeWithSemantics НЕ НАЙДЕН');
      console.log('📋 Доступные методы:', Object.keys(semanticIntegrationLayer));
      return false;
    }
    
    console.log('✅ Метод analyzeWithSemantics найден');
    
    // Тестируем простой запрос
    console.log('\n🧪 ТЕСТИРУЕМ analyzeWithSemantics...');
    const testInput = "Что такое огонь?";
    const userContext = {
      userId: 'test-user',
      sessionId: 'test-session',
      fullAnalysis: true,
      activateAllModules: true
    };
    
    console.log(`📝 Входной запрос: "${testInput}"`);
    console.log('⏱️  Таймаут: 10 секунд');
    
    const analysisPromise = semanticIntegrationLayer.analyzeWithSemantics(testInput, userContext);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Таймаут анализа (10 сек)')), 10000);
    });
    
    try {
      const result = await Promise.race([analysisPromise, timeoutPromise]);
      
      console.log('✅ АНАЛИЗ ЗАВЕРШЕН УСПЕШНО');
      console.log('📊 Структура результата:');
      
      if (result) {
        console.log(`  • shouldUseSemantic: ${result.shouldUseSemantic || 'undefined'}`);
        console.log(`  • semanticResult: ${result.semanticResult ? 'есть' : 'НЕТ'}`);
        
        if (result.semanticResult) {
          console.log(`    • intent: ${result.semanticResult.intent || 'undefined'}`);
          console.log(`    • confidence: ${result.semanticResult.confidence || 'undefined'}`);
          console.log(`    • category: ${result.semanticResult.category || 'undefined'}`);
        }
        
        console.log(`📊 Общий размер результата: ${JSON.stringify(result).length} символов`);
        return true;
      } else {
        console.log('❌ РЕЗУЛЬТАТ NULL ИЛИ UNDEFINED');
        return false;
      }
      
    } catch (analysisError) {
      console.log('❌ ОШИБКА В analyzeWithSemantics:');
      console.error('   Сообщение:', analysisError.message);
      console.error('   Стек:', analysisError.stack?.split('\n').slice(0, 5).join('\n'));
      
      // Детализируем тип ошибки
      if (analysisError.message.includes('Cannot read properties')) {
        console.log('🔍 ТИП ОШИБКИ: Обращение к свойству null/undefined объекта');
      } else if (analysisError.message.includes('is not a function')) {
        console.log('🔍 ТИП ОШИБКИ: Вызов несуществующей функции');
      } else if (analysisError.message.includes('Таймаут')) {
        console.log('🔍 ТИП ОШИБКИ: Превышение времени ожидания');
      } else {
        console.log('🔍 ТИП ОШИБКИ: Неизвестная ошибка');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ОТЛАДКИ:', error.message);
    console.error('❌ Стек:', error.stack?.split('\n').slice(0, 5).join('\n'));
    return false;
  }
}

// Запуск диагностики
debugSemanticIntegration()
  .then(success => {
    console.log('\n📊 РЕЗУЛЬТАТ ОТЛАДКИ:');
    console.log('=' .repeat(50));
    
    if (success) {
      console.log('✅ СЕМАНТИЧЕСКАЯ ИНТЕГРАЦИЯ РАБОТАЕТ');
      console.log('🔍 Проблема НЕ в analyzeWithSemantics');
      console.log('💡 Нужно проверить другие части conversation-engine');
    } else {
      console.log('❌ ОБНАРУЖЕНА ПРОБЛЕМА В СЕМАНТИЧЕСКОЙ ИНТЕГРАЦИИ');
      console.log('🔧 analyzeWithSemantics требует исправления');
      console.log('💡 Это источник fallback ошибок в live системе');
    }
    
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ ФАТАЛЬНАЯ ОШИБКА ОТЛАДКИ:', error);
    process.exit(1);
  });