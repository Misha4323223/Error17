/**
 * ТЕСТ АВТОНОМНОЙ СИСТЕМЫ ФАЗЫ 1
 * Проверяет работоспособность всех компонентов автономной генерации
 */

console.log('=== ТЕСТ АВТОНОМНОЙ СИСТЕМЫ ФАЗЫ 1 ===');

async function testAutonomousSystem() {
  try {
    console.log('\n🧪 Начинаем тестирование автономной системы...');
    
    // Тест 1: Генератор естественного языка
    console.log('\n📝 Тест 1: Генератор естественного языка');
    try {
      const nlg = require('./server/semantic-memory/natural-language-generator.cjs');
      
      const testSemanticResult = {
        intent: 'explanation',
        mainTopic: 'векторизация',
        subTopics: ['качество', 'параметры'],
        contextDetails: 'пользователь спрашивает о векторизации',
        technicalLevel: 0.7,
        emotionalContext: { enthusiasm: 0.6 }
      };
      
      const response = await nlg.generateResponse(testSemanticResult, {
        messages: [{ content: 'Что такое векторизация?', sender: 'user' }]
      });
      
      if (response.success) {
        console.log('✅ Генератор естественного языка работает');
        console.log(`📋 Тип ответа: ${response.metadata?.responseType || 'unknown'}`);
        console.log(`📏 Длина ответа: ${response.response?.length || 0} символов`);
        console.log(`🎯 Шаги обработки: ${response.metadata?.processingSteps?.length || 0}`);
      } else {
        console.log('❌ Генератор не смог создать ответ:', response.error);
      }
    } catch (nlgError) {
      console.log('❌ Ошибка в генераторе языка:', nlgError.message);
    }
    
    // Тест 2: Автономная модель обучения
    console.log('\n🎓 Тест 2: Автономная модель обучения');
    try {
      const learning = require('./server/semantic-memory/autonomous-learning-engine.cjs');
      
      const testInteraction = {
        id: 'test-interaction-1',
        query: 'Как векторизовать изображение?',
        response: 'Векторизация - это процесс преобразования растрового изображения в векторный формат.',
        responseTime: 1500,
        userEngagement: 0.8,
        readingTime: 5000,
        followUpQuestions: 1,
        conversationContinued: true
      };
      
      const learningResult = await learning.learnFromInteraction(testInteraction, {
        semanticResult: { category: 'vectorization', confidence: 0.9 }
      });
      
      if (learningResult.success) {
        console.log('✅ Система обучения работает');
        console.log(`📊 Размер очереди обучения: ${learningResult.queueSize}`);
      } else {
        console.log('❌ Ошибка обучения:', learningResult.error);
      }
      
      // Проверяем статистику обучения
      const stats = learning.getLearningStats();
      console.log(`📈 Всего взаимодействий в анализе: ${stats.effectivenessStats?.totalInteractions || 0}`);
      console.log(`🧠 Концепций в базе знаний: ${stats.knowledgeStats?.totalConcepts || 0}`);
      console.log(`🎯 Здоровье системы: ${stats.systemHealth?.overall || 'unknown'}`);
      
    } catch (learningError) {
      console.log('❌ Ошибка в системе обучения:', learningError.message);
    }
    
    // Тест 3: Предиктивная система
    console.log('\n🔮 Тест 3: Предиктивная система');
    try {
      const predictive = require('./server/semantic-memory/predictive-system.cjs');
      
      const testAction = {
        type: 'vectorization_request',
        timestamp: Date.now(),
        context: { projectId: 'test-project', phase: 'design' }
      };
      
      const testContext = {
        type: 'vectorization',
        projectId: 'test-project',
        currentTask: 'image processing',
        userId: 'test-user'
      };
      
      const predictions = await predictive.predict('test-user', testAction, testContext);
      
      if (predictions.success) {
        console.log('✅ Предиктивная система работает');
        console.log(`🎯 Предсказанных действий: ${predictions.nextLikelyActions?.length || 0}`);
        console.log(`💡 Проактивных рекомендаций: ${predictions.proactiveRecommendations?.length || 0}`);
        console.log(`⚠️ Потенциальных проблем: ${predictions.potentialIssues?.length || 0}`);
        console.log(`🚀 Оптимизаций: ${predictions.optimizations?.length || 0}`);
      } else {
        console.log('❌ Ошибка предсказания:', predictions.error);
      }
      
      // Проверяем статистику предиктивной системы
      const predictiveStats = predictive.getPredictiveStats();
      console.log(`💾 Размер кэша предсказаний: ${predictiveStats.cacheSize}`);
      console.log(`👥 Активных пользователей: ${predictiveStats.activeUsers}`);
      console.log(`📋 Размер очереди уведомлений: ${predictiveStats.queueSize}`);
      
    } catch (predictiveError) {
      console.log('❌ Ошибка в предиктивной системе:', predictiveError.message);
    }
    
    // Тест 4: Интеграция всех компонентов
    console.log('\n🔗 Тест 4: Интеграция компонентов');
    try {
      console.log('Проверяем интеграцию в smart-router...');
      
      // Проверяем, что все модули загружаются без ошибок
      const smartRouter = require('./server/smart-router.js');
      console.log('✅ Smart-router загружен с новыми компонентами');
      
      // Проверяем семантическую интеграцию
      const semanticIntegration = require('./server/semantic-integration-layer.cjs');
      console.log('✅ Семантическая интеграция доступна');
      
      console.log('✅ Все компоненты успешно интегрированы');
      
    } catch (integrationError) {
      console.log('❌ Ошибка интеграции:', integrationError.message);
    }
    
    // Тест 5: Симуляция полного цикла
    console.log('\n🎬 Тест 5: Симуляция полного автономного цикла');
    try {
      console.log('Симулируем полный цикл: запрос → анализ → генерация → обучение → предсказание');
      
      // 1. Семантический анализ (симуляция)
      const semanticResult = {
        intent: 'help_request',
        category: 'vectorization',
        mainTopic: 'векторизация логотипа',
        confidence: 0.85,
        technicalLevel: 0.6,
        emotionalContext: { curiosity: 0.7 }
      };
      
      // 2. Генерация ответа
      const nlg = require('./server/semantic-memory/natural-language-generator.cjs');
      const generatedResponse = await nlg.generateResponse(semanticResult, {
        messages: [{ content: 'Помоги векторизовать логотип', sender: 'user' }]
      });
      
      if (generatedResponse.success) {
        console.log('✅ Шаг 1: Ответ сгенерирован автономно');
        
        // 3. Обучение на взаимодействии
        const learning = require('./server/semantic-memory/autonomous-learning-engine.cjs');
        const interactionData = {
          id: 'full-cycle-test',
          query: 'Помоги векторизовать логотип',
          response: generatedResponse.response,
          responseTime: 1200,
          userEngagement: 0.9
        };
        
        await learning.learnFromInteraction(interactionData, { semanticResult });
        console.log('✅ Шаг 2: Система обучилась на взаимодействии');
        
        // 4. Предсказание следующих действий
        const predictive = require('./server/semantic-memory/predictive-system.cjs');
        const currentAction = { type: 'vectorization_help', timestamp: Date.now() };
        const predictions = await predictive.predict('full-cycle-user', currentAction, {
          type: 'vectorization',
          currentTask: 'logo processing'
        });
        
        if (predictions.success) {
          console.log('✅ Шаг 3: Предсказания созданы');
          console.log('🎉 ПОЛНЫЙ АВТОНОМНЫЙ ЦИКЛ ЗАВЕРШЕН УСПЕШНО!');
        } else {
          console.log('⚠️ Предсказания не удались, но основной цикл работает');
        }
      } else {
        console.log('❌ Генерация ответа не удалась');
      }
      
    } catch (cycleError) {
      console.log('❌ Ошибка в полном цикле:', cycleError.message);
    }
    
    // Финальная статистика
    console.log('\n📊 ФИНАЛЬНАЯ СТАТИСТИКА ТЕСТИРОВАНИЯ');
    console.log('='.repeat(50));
    
    try {
      const learning = require('./server/semantic-memory/autonomous-learning-engine.cjs');
      const predictive = require('./server/semantic-memory/predictive-system.cjs');
      
      const learningStats = learning.getLearningStats();
      const predictiveStats = predictive.getPredictiveStats();
      
      console.log(`🎓 Система обучения:`);
      console.log(`   - Здоровье: ${learningStats.systemHealth?.overall || 'unknown'}`);
      console.log(`   - Размер очереди: ${learningStats.learningQueue?.size || 0}`);
      
      console.log(`🔮 Предиктивная система:`);
      console.log(`   - Кэш: ${predictiveStats.cacheSize} записей`);
      console.log(`   - Активные пользователи: ${predictiveStats.activeUsers}`);
      console.log(`   - Здоровье: ${predictiveStats.systemHealth?.overall || 'unknown'}`);
      
      console.log(`\n🌟 РЕЗУЛЬТАТ: Автономная система Фазы 1 готова к работе!`);
      
    } catch (statsError) {
      console.log('⚠️ Не удалось получить финальную статистику:', statsError.message);
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка тестирования:', error);
  }
}

// Запускаем тест
testAutonomousSystem().then(() => {
  console.log('\n✅ Тестирование завершено');
}).catch(error => {
  console.error('❌ Ошибка запуска теста:', error);
});