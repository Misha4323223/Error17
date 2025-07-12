/**
 * ФИНАЛЬНАЯ ВАЛИДАЦИЯ ИСПРАВЛЕННОЙ СЕМАНТИЧЕСКОЙ СИСТЕМЫ
 * Проверяет полную цепочку обработки без fallback ответов
 */

async function validateSemanticSystem() {
  console.log('🎯 ФИНАЛЬНАЯ ВАЛИДАЦИЯ СЕМАНТИЧЕСКОЙ СИСТЕМЫ BOOOMERANGS');
  console.log('=' .repeat(65));

  try {
    // Загрузка исправленного модуля
    const semanticIntegrationLayer = require('./server/semantic-integration-layer.cjs');
    
    console.log('✅ Семантический интеграционный слой загружен');

    // Тестовые сценарии различных типов запросов
    const testScenarios = [
      {
        name: 'Приветствие',
        input: 'Привет! Как дела?',
        expectedAnalysis: 'greeting'
      },
      {
        name: 'Запрос возможностей',
        input: 'Расскажи о своих возможностях',
        expectedAnalysis: 'capabilities'
      },
      {
        name: 'Креативный запрос',
        input: 'Создай логотип в современном стиле',
        expectedAnalysis: 'creative'
      },
      {
        name: 'Технический вопрос',
        input: 'Как работает векторизация изображений?',
        expectedAnalysis: 'technical'
      },
      {
        name: 'Эмоциональный запрос',
        input: 'Мне грустно, подними настроение',
        expectedAnalysis: 'emotional'
      }
    ];

    let successCount = 0;
    let totalTests = testScenarios.length;

    for (let i = 0; i < testScenarios.length; i++) {
      const scenario = testScenarios[i];
      
      console.log(`\n🧪 ТЕСТ ${i + 1}/${totalTests}: ${scenario.name}`);
      console.log(`   Запрос: "${scenario.input}"`);

      try {
        const result = await semanticIntegrationLayer.analyzeWithSemantics(
          scenario.input,
          {
            sessionId: `test-${i + 1}`,
            conversationHistory: [],
            hasRecentImages: false
          }
        );

        console.log(`   📊 shouldUseSemantic: ${result.shouldUseSemantic}`);
        console.log(`   📊 reason: ${result.reason}`);
        console.log(`   📊 confidence: ${result.confidence}`);

        if (result.semanticResult) {
          console.log(`   📊 intent: ${result.semanticResult.intent}`);
          console.log(`   📊 fallback: ${result.semanticResult.fallback || false}`);
          
          // Проверяем, что НЕ используется emergency fallback
          if (!result.semanticResult.fallback && result.shouldUseSemantic) {
            console.log(`   ✅ Семантический анализ успешен`);
            successCount++;
          } else {
            console.log(`   ⚠️ Используется fallback`);
          }
        } else {
          console.log(`   ❌ Нет семантического результата`);
        }

      } catch (error) {
        console.log(`   ❌ Ошибка: ${error.message}`);
      }
    }

    // Итоговая статистика
    console.log('\n' + '=' .repeat(65));
    console.log('📈 ИТОГОВАЯ СТАТИСТИКА ВАЛИДАЦИИ');
    console.log(`   • Успешных тестов: ${successCount}/${totalTests}`);
    console.log(`   • Процент успеха: ${Math.round((successCount / totalTests) * 100)}%`);
    
    if (successCount === totalTests) {
      console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');
      console.log('🚀 Семантическая система BOOOMERANGS полностью функциональна');
      console.log('✅ Fallback ответы заменены на полную семантическую обработку');
    } else if (successCount > totalTests / 2) {
      console.log('\n✅ БОЛЬШИНСТВО ТЕСТОВ ПРОЙДЕНО');
      console.log('🔧 Система работает, но есть возможности для улучшения');
    } else {
      console.log('\n⚠️ ТРЕБУЕТСЯ ДОПОЛНИТЕЛЬНАЯ РАБОТА');
      console.log('🔧 Система нуждается в дополнительных исправлениях');
    }

    // Проверка метода генерации ответов
    console.log('\n🧠 ТЕСТ ГЕНЕРАЦИИ ОТВЕТОВ');
    
    try {
      const generateResult = await semanticIntegrationLayer.generateSmartResponse(
        'Привет, BOOOMERANGS!',
        {
          sessionId: 'test-generate',
          conversationHistory: []
        }
      );

      if (generateResult && generateResult.response) {
        console.log('✅ Генерация ответов работает');
        console.log(`   Ответ: "${generateResult.response.substring(0, 100)}..."`);
        console.log(`   Генератор: ${generateResult.metadata?.generatedBy || 'unknown'}`);
      } else {
        console.log('❌ Проблема с генерацией ответов');
      }
    } catch (error) {
      console.log(`❌ Ошибка генерации: ${error.message}`);
    }

    console.log('\n' + '=' .repeat(65));
    console.log('🎯 ВАЛИДАЦИЯ ЗАВЕРШЕНА');

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА ВАЛИДАЦИИ:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Запуск валидации
if (require.main === module) {
  validateSemanticSystem().catch(console.error);
}

module.exports = { validateSemanticSystem };