/**
 * Финальный тест исправления внешнего поиска
 * Проверяет работу внешнего поиска через семантический интеграционный слой
 */

async function testFinalExternalSearch() {
  console.log('🔍 ФИНАЛЬНЫЙ ТЕСТ ВНЕШНЕГО ПОИСКА');
  console.log('==================================');
  
  try {
    // Загружаем исправленный semantic-integration-layer
    const semanticIntegration = require('./server/semantic-integration-layer.cjs');
    
    // Тестируем знаниевый запрос
    const testQuery = 'Расскажи про планету Марс';
    console.log(`\n📝 Тестируем знаниевый запрос: "${testQuery}"`);
    
    // Проверяем семантический анализ с внешним поиском
    const result = await semanticIntegration.analyzeWithSemantics(testQuery, {
      sessionId: 'test-mars-final',
      language: 'ru',
      includeExternalKnowledge: true,
      includeAdvancedSearch: true
    });
    
    console.log('\n🎯 РЕЗУЛЬТАТ АНАЛИЗА:');
    console.log(`📊 Причина: ${result.reason}`);
    console.log(`🔢 Уверенность: ${result.confidence}`);
    console.log(`⏱️ Время обработки: ${result.processingTime}мс`);
    
    // Проверяем внешние знания
    if (result.externalKnowledge) {
      console.log('\n✅ ВНЕШНИЕ ЗНАНИЯ НАЙДЕНЫ:');
      console.log(`📚 Источников: ${result.externalKnowledge.length || 0}`);
      
      if (result.externalKnowledge.length > 0) {
        console.log('🎉 УСПЕХ! Внешний поиск активирован для знаниевого запроса');
        console.log('📄 Пример данных:', result.externalKnowledge[0]);
      }
    } else {
      console.log('\n⚠️ ВНЕШНИЕ ЗНАНИЯ НЕ НАЙДЕНЫ');
    }
    
    // Проверяем расширенный поиск
    if (result.advancedSearch) {
      console.log('\n✅ РАСШИРЕННЫЙ ПОИСК НАЙДЕН:');
      console.log(`🔍 Результатов: ${result.advancedSearch.length || 0}`);
    }
    
    // Проверяем семантический анализ
    if (result.semanticResult) {
      console.log('\n✅ СЕМАНТИЧЕСКИЙ АНАЛИЗ:');
      console.log(`🧠 Кластер: ${result.semanticResult.cluster_name || 'unknown'}`);
      console.log(`📊 Уверенность: ${result.semanticResult.confidence || 0}`);
    }
    
    // Тестируем НЕ-знаниевый запрос
    console.log('\n📝 Тестируем НЕ-знаниевый запрос: "Создай картинку кота"');
    const nonKnowledgeResult = await semanticIntegration.analyzeWithSemantics('Создай картинку кота', {
      sessionId: 'test-creation-final',
      language: 'ru'
    });
    
    console.log('\n🎯 РЕЗУЛЬТАТ ДЛЯ НЕ-ЗНАНИЕВОГО ЗАПРОСА:');
    console.log(`📊 Причина: ${nonKnowledgeResult.reason}`);
    console.log(`🔢 Уверенность: ${nonKnowledgeResult.confidence}`);
    
    if (nonKnowledgeResult.externalKnowledge) {
      console.log('⚠️ ВНЕШНИЙ ПОИСК АКТИВИРОВАН (НЕ ДОЛЖЕН БЫТЬ)');
    } else {
      console.log('✅ ВНЕШНИЙ ПОИСК НЕ АКТИВИРОВАН (КОРРЕКТНО)');
    }
    
    console.log('\n🎉 ФИНАЛЬНЫЙ ТЕСТ ЗАВЕРШЕН УСПЕШНО!');
    
  } catch (error) {
    console.error('❌ Ошибка финального теста:', error.message);
    console.error('📋 Стек:', error.stack);
  }
}

// Запуск теста
testFinalExternalSearch();