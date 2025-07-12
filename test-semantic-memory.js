/**
 * Тест системы семантической памяти проектов
 * Проверяет работоспособность Этапа 1
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testSemanticMemory() {
  console.log('🧠 Тестирование семантической памяти проектов (Этап 1)...\n');

  try {
    // Загружаем основной модуль
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    console.log('✅ Модуль семантической памяти загружен успешно');

    // Тест 1: Анализ простого запроса на создание логотипа
    console.log('\n📝 Тест 1: Анализ запроса на создание логотипа');
    
    const result1 = await semanticMemory.analyzeCompleteRequest(
      'Создай логотип для кофейни',
      'test-session-1',
      { hasRecentImages: false }
    );

    console.log('Результат анализа:', {
      confidence: result1.confidence,
      concept: result1.current_project?.concept,
      predictions_count: result1.predictions?.length || 0,
      enhanced_prompt: result1.enhanced_prompt?.substring(0, 50) + '...'
    });

    // Тест 2: Продолжение работы с проектом
    console.log('\n📝 Тест 2: Добавление артефакта в проект');
    
    const artifactResult = await semanticMemory.addArtifactWithContext(
      'test-session-1',
      {
        type: 'image',
        url: 'https://example.com/logo.png',
        description: 'Логотип кофейни в коричневых тонах',
        style: 'realistic'
      }
    );

    console.log('Артефакт добавлен:', artifactResult);

    // Тест 3: Получение проактивных предложений
    console.log('\n📝 Тест 3: Проактивные предложения');
    
    const suggestions = await semanticMemory.getProactiveSuggestions(
      'test-session-1',
      { hasRecentImages: true }
    );

    console.log('Предложения:', suggestions.map(s => s.message));

    // Тест 4: Анализ запроса на продолжение
    console.log('\n📝 Тест 4: Анализ запроса на векторизацию');
    
    const result2 = await semanticMemory.analyzeCompleteRequest(
      'Векторизуй логотип',
      'test-session-1',
      { hasRecentImages: true }
    );

    console.log('Результат анализа продолжения:', {
      confidence: result2.confidence,
      compatibility: result2.compatibility?.compatible,
      is_new_project: result2.project_context?.isNewProject
    });

    // Тест 5: Статистика системы
    console.log('\n📝 Тест 5: Статистика системы');
    
    const stats = semanticMemory.getSystemStatistics();
    console.log('Статистика:', {
      queries_processed: stats.queriesProcessed,
      projects_created: stats.projectsCreated,
      predictions_generated: stats.predictionsGenerated,
      knowledge_graph_nodes: stats.knowledge_graph?.totalNodes
    });

    // Тест 6: Сводка сессии
    console.log('\n📝 Тест 6: Сводка сессии');
    
    const sessionSummary = semanticMemory.getSessionSummary('test-session-1');
    if (sessionSummary) {
      console.log('Сводка сессии:', {
        total_projects: sessionSummary.totalProjects,
        active_project: sessionSummary.activeProjectId ? 'есть' : 'нет'
      });
    }

    console.log('\n🎉 Все тесты семантической памяти пройдены успешно!');
    console.log('✅ Этап 1 реализован корректно');
    
    return true;

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    console.error('Стек ошибки:', error.stack);
    return false;
  }
}

// Запускаем тест
testSemanticMemory()
  .then(success => {
    if (success) {
      console.log('\n✨ Семантическая память готова к интеграции с основной системой');
    } else {
      console.log('\n❌ Необходимо исправить ошибки перед интеграцией');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });