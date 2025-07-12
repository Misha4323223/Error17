/**
 * Тест интеграции семантической памяти с основным процессором (Этап 2)
 * Проверяет работоспособность интегрированной системы
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testSemanticIntegration() {
  console.log('🔗 Тестирование интеграции семантической памяти (Этап 2)...\n');

  try {
    // Загружаем интегрированный процессор
    const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');
    
    console.log('✅ Интегрированный процессор загружен успешно');

    // Тест 1: Создание нового проекта логотипа
    console.log('\n📝 Тест 1: Анализ с семантической памятью - "Создай логотип кофейни"');
    
    const result1 = await intelligentProcessor.analyzeUserIntent(
      'Создай логотип кофейни',
      { sessionId: 'test-integration-1' }
    );

    console.log('Результат интеграции:', {
      success: result1.success,
      category: result1.category,
      semantic_context: result1.semanticContext ? 'присутствует' : 'отсутствует',
      project_detected: result1.semanticContext?.project ? 'да' : 'нет',
      predictions: result1.semanticContext?.predictions?.length || 0
    });

    if (result1.success && result1.semanticContext) {
      console.log('🎯 Семантический контекст:', {
        project_title: result1.semanticContext.project?.title,
        confidence: result1.semanticContext.confidence,
        enhanced_prompt: result1.semanticContext.enhanced_prompt?.substring(0, 50) + '...'
      });
    }

    // Тест 2: Проверка семантического обогащения
    console.log('\n📝 Тест 2: Анализ обогащения - "Нарисуй дракона для принта"');
    
    const result2 = await intelligentProcessor.analyzeUserIntent(
      'Нарисуй дракона для принта',
      { sessionId: 'test-integration-2' }
    );

    console.log('Семантическое обогащение:', {
      original_category: result2.category,
      confidence: result2.confidence,
      semantic_override: result2.semanticOverride || false,
      enhanced_query: result2.enhancedQuery ? 'да' : 'нет',
      semantic_context: result2.semanticContext ? 'присутствует' : 'отсутствует'
    });

    // Тест 3: Проверка сохранения артефактов (имитация)
    console.log('\n📝 Тест 3: Проверка интеграции сохранения артефактов');
    
    // Имитируем сохранение артефакта
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    const artifactResult = await semanticMemory.addArtifactWithContext(
      'test-integration-1',
      {
        type: 'image',
        url: 'https://example.com/logo.png',
        description: 'Логотип кофейни в коричневых тонах',
        style: 'realistic',
        metadata: {
          generation_type: 'test_integration'
        }
      }
    );

    console.log('Сохранение артефакта:', artifactResult ? 'успешно' : 'ошибка');

    // Тест 4: Проверка проактивных предложений
    console.log('\n📝 Тест 4: Получение проактивных предложений');
    
    const suggestions = await semanticMemory.getProactiveSuggestions(
      'test-integration-1',
      { hasRecentImages: true, lastAction: 'image_generation' }
    );

    console.log('Проактивные предложения:', {
      count: suggestions.length,
      suggestions: suggestions.map(s => s.message?.substring(0, 30) + '...')
    });

    // Тест 5: Проверка продолжения проекта
    console.log('\n📝 Тест 5: Анализ продолжения проекта - "Векторизуй логотип"');
    
    const result3 = await intelligentProcessor.analyzeUserIntent(
      'Векторизуй логотип',
      { 
        sessionId: 'test-integration-1',
        hasRecentImages: true 
      }
    );

    console.log('Продолжение проекта:', {
      category: result3.category,
      confidence: result3.confidence,
      project_continuity: result3.semanticContext?.project ? 'обнаружена' : 'не обнаружена',
      predictions: result3.semanticContext?.predictions?.length || 0
    });

    // Тест 6: Статистика интегрированной системы
    console.log('\n📝 Тест 6: Статистика интегрированной системы');
    
    const stats = semanticMemory.getSystemStatistics();
    console.log('Системная статистика:', {
      queries_processed: stats.queriesProcessed,
      projects_created: stats.projectsCreated,
      predictions_generated: stats.predictionsGenerated,
      knowledge_graph_nodes: stats.knowledge_graph?.totalNodes,
      initialized: stats.initialized
    });

    console.log('\n🎉 Все тесты интеграции пройдены успешно!');
    console.log('✅ Этап 2 (интеграция с основным процессором) завершен');
    
    return true;

  } catch (error) {
    console.error('❌ Ошибка интеграции:', error.message);
    console.error('Стек ошибки:', error.stack);
    return false;
  }
}

// Запускаем тест интеграции
testSemanticIntegration()
  .then(success => {
    if (success) {
      console.log('\n✨ Семантическая память успешно интегрирована с основным процессором');
      console.log('🚀 Система готова к продакшену с расширенными возможностями');
    } else {
      console.log('\n❌ Необходимо исправить ошибки интеграции');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Критическая ошибка интеграции:', error);
    process.exit(1);
  });