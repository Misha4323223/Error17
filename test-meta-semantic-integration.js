/**
 * Тест интеграции мета-семантического движка
 * Проверяет работоспособность всех компонентов ФАЗЫ 2
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testMetaSemanticIntegration() {
  console.log('🧠🔮 Тестирование мета-семантической интеграции (ФАЗА 2)...\n');

  try {
    // Загружаем обновленные модули
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    const semanticIntegration = require('./server/semantic-integration-layer.cjs');
    const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');
    
    console.log('✅ Все модули мета-семантики загружены успешно\n');

    // ТЕСТ 1: Базовый мета-семантический анализ
    console.log('🧪 ТЕСТ 1: Мета-семантический анализ сложного запроса');
    console.log('Запрос: "Проанализируй детально это изображение и предложи варианты улучшения для коммерческого использования"');
    
    const complexQuery = 'Проанализируй детально это изображение и предложи варианты улучшения для коммерческого использования';
    
    const result1 = await semanticMemory.analyzeCompleteRequestWithMeta(
      complexQuery,
      'meta-test-session-1',
      { 
        hasRecentImages: true,
        sessionId: 'meta-test-session-1',
        requestType: 'analysis_consultation' 
      }
    );

    console.log('Результат мета-анализа:');
    console.log('  📊 Качество:', result1.quality_score || 'не определено');
    console.log('  🎯 Мета-уверенность:', result1.enhanced_confidence ? `${(result1.enhanced_confidence * 100).toFixed(1)}%` : 'не определена');
    console.log('  🧠 Мета-инсайтов:', result1.meta_insights?.length || 0);
    console.log('  🎓 Системных обучений:', result1.system_learnings?.length || 0);
    console.log('  ⚡ Время обработки:', `${result1.total_processing_time || 0}мс`);
    console.log('  🔄 Fallback режим:', result1.fallback_mode ? 'ДА' : 'НЕТ');
    
    if (result1.meta_semantic) {
      console.log('  🔮 Мета-семантика активна: ДА');
      console.log('  📈 Рекомендаций:', result1.enhanced_recommendations?.length || 0);
      console.log('  🔭 Предсказаний:', result1.enhanced_predictions?.length || 0);
    } else {
      console.log('  🔮 Мета-семантика активна: НЕТ (возможно ошибка)');
    }

    // ТЕСТ 2: Интеграция с семантическим слоем
    console.log('\n🧪 ТЕСТ 2: Интеграция с семантическим слоем интеграции');
    console.log('Запрос: "Создай логотип для кофейни, учитывая современные тренды дизайна"');
    
    const designQuery = 'Создай логотип для кофейни, учитывая современные тренды дизайна';
    
    const result2 = await semanticIntegration.analyzeWithSemantics(
      designQuery,
      {
        sessionId: 'meta-test-session-2',
        hasRecentImages: false,
        requestType: 'creative_generation'
      }
    );

    console.log('Результат интеграционного анализа:');
    console.log('  🎯 Использует семантику:', result2.shouldUseSemantic ? 'ДА' : 'НЕТ');
    console.log('  📋 Причина решения:', result2.reason);
    console.log('  🔮 Мета-данные:', result2.metaSemanticData ? 'ПРИСУТСТВУЮТ' : 'отсутствуют');
    
    if (result2.metaSemanticData) {
      console.log('  📊 Мета-качество:', result2.metaSemanticData.qualityScore);
      console.log('  🎯 Мета-уверенность:', `${(result2.metaSemanticData.metaConfidence * 100).toFixed(1)}%`);
      console.log('  💡 Мета-инсайтов:', result2.metaSemanticData.metaInsights?.length || 0);
    }

    // ТЕСТ 3: Создание мета-семантического ответа
    console.log('\n🧪 ТЕСТ 3: Создание мета-семантического ответа');
    
    if (result2.shouldUseSemantic && result2.semanticResult) {
      const response3 = await semanticIntegration.createSemanticResponse(
        result2.semanticResult,
        designQuery,
        { sessionId: 'meta-test-session-2' }
      );

      console.log('Семантический ответ:');
      console.log('  ✅ Успешность:', response3.success ? 'ДА' : 'НЕТ');
      console.log('  📝 Длина ответа:', response3.response?.length || 0, 'символов');
      console.log('  🔮 Мета-данные:', response3.semanticData ? 'включены' : 'отсутствуют');
      
      if (response3.success && response3.response) {
        console.log('  📄 Превью ответа:', response3.response.substring(0, 100) + '...');
      }
    } else {
      console.log('  ⚠️  Семантический ответ не создан (семантика не активна)');
    }

    // ТЕСТ 4: Интеграция с интеллектуальным процессором
    console.log('\n🧪 ТЕСТ 4: Интеграция с интеллектуальным процессором');
    console.log('Запрос: "Помоги мне выбрать лучший вариант цветовой схемы для моего проекта"');
    
    const consultationQuery = 'Помоги мне выбрать лучший вариант цветовой схемы для моего проекта';
    
    const result4 = await intelligentProcessor.analyzeUserIntent(
      consultationQuery,
      {
        sessionId: 'meta-test-session-3',
        hasRecentImages: true,
        chatContext: { context: 'У пользователя есть изображения проекта' }
      }
    );

    console.log('Результат интеллектуального процессора:');
    console.log('  ✅ Успешность:', result4.success ? 'ДА' : 'НЕТ');
    console.log('  📋 Категория:', result4.category || 'не определена');
    console.log('  🎯 Уверенность:', result4.confidence ? `${result4.confidence.toFixed(1)}%` : 'не определена');
    console.log('  🧠 Семантический контекст:', result4.semanticContext ? 'ПРИСУТСТВУЕТ' : 'отсутствует');
    
    if (result4.semanticContext && result4.semanticContext.meta_semantic) {
      console.log('  🔮 Мета-семантика в процессоре: АКТИВНА');
      console.log('  📊 Качество мета-анализа:', result4.semanticContext.meta_semantic.qualityScore);
    }

    // ТЕСТ 5: Статистика мета-семантической системы
    console.log('\n🧪 ТЕСТ 5: Статистика мета-семантической системы');
    
    const stats = semanticMemory.getMetaSemanticStatistics();
    console.log('Статистика системы:');
    console.log('  📊 Обработано запросов:', stats.queriesProcessed);
    console.log('  🎯 Создано проектов:', stats.projectsCreated);
    console.log('  🔮 Мета-семантика инициализирована:', stats.meta_semantic?.initialized ? 'ДА' : 'НЕТ');
    
    if (stats.meta_semantic) {
      console.log('  🧠 Мета-анализов выполнено:', stats.meta_semantic.totalAnalyses || 0);
      console.log('  ⚡ Оптимизаций применено:', stats.meta_semantic.optimizationsApplied || 0);
      console.log('  🔭 Прогнозов сгенерировано:', stats.meta_semantic.predictionsGenerated || 0);
      console.log('  📈 Среднее улучшение качества:', `${(stats.meta_semantic.averageQualityImprovement || 0).toFixed(1)}%`);
    }

    // ТЕСТ 6: Проверка всех компонентов мета-семантики
    console.log('\n🧪 ТЕСТ 6: Проверка компонентов мета-семантического движка');
    
    const metaEngine = semanticMemory.components.metaSemanticEngine;
    if (metaEngine) {
      const engineStats = metaEngine.getSystemStatistics();
      console.log('Статистика мета-семантического движка:');
      console.log('  🔧 Рефлексивный анализатор:', engineStats.components?.reflectiveAnalyzer || 'неизвестно');
      console.log('  ✅ Семантический валидатор:', engineStats.components?.semanticValidator || 'неизвестно');
      console.log('  🎯 Адаптивный оптимизатор:', engineStats.components?.adaptiveOptimizer || 'неизвестно');
      console.log('  🔮 Предиктивный модуль:', engineStats.components?.predictiveModule || 'неизвестно');
      console.log('  📊 Всего анализов:', engineStats.totalAnalyses || 0);
    } else {
      console.log('  ❌ Мета-семантический движок недоступен');
    }

    // ИТОГОВАЯ ОЦЕНКА
    console.log('\n📋 ИТОГОВАЯ ОЦЕНКА ИНТЕГРАЦИИ:');
    
    let successCount = 0;
    let totalTests = 6;
    
    if (result1.quality_score && result1.enhanced_confidence) successCount++;
    if (result2.shouldUseSemantic && result2.metaSemanticData) successCount++;
    if (stats.meta_semantic && stats.meta_semantic.initialized) successCount++;
    if (metaEngine && metaEngine.getSystemStatistics) successCount++;
    
    const successRate = (successCount / totalTests * 100).toFixed(1);
    
    console.log(`🎯 Успешность интеграции: ${successCount}/${totalTests} (${successRate}%)`);
    
    if (successRate > 80) {
      console.log('✅ МЕТА-СЕМАНТИЧЕСКАЯ ИНТЕГРАЦИЯ УСПЕШНА!');
      console.log('🚀 Система готова к использованию мета-семантических возможностей');
    } else if (successRate > 60) {
      console.log('⚠️  Мета-семантическая интеграция частично успешна');
      console.log('🔧 Требуется дополнительная настройка некоторых компонентов');
    } else {
      console.log('❌ Мета-семантическая интеграция требует исправлений');
      console.log('🛠️  Необходимо проверить конфигурацию системы');
    }

    console.log('\n🎊 Тестирование мета-семантической интеграции завершено!');

  } catch (error) {
    console.error('❌ Критическая ошибка при тестировании мета-семантики:', error.message);
    console.error('📍 Стек ошибки:', error.stack);
  }
}

// Запуск тестирования
testMetaSemanticIntegration();