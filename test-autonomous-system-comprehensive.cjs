/**
 * Комплексный тест автономной системы
 * Диагностика всех компонентов и проверка интеграции
 */

const util = require('util');

// Система логирования для теста
const TestLogger = {
  step: (message, data) => {
    console.log(`\n🔍 ТЕСТ: ${message}`);
    if (data) console.log(`   Данные:`, util.inspect(data, { depth: 2, colors: true }));
  },
  success: (message, data) => {
    console.log(`✅ УСПЕХ: ${message}`);
    if (data) console.log(`   Результат:`, util.inspect(data, { depth: 2, colors: true }));
  },
  error: (message, error) => {
    console.log(`❌ ОШИБКА: ${message}`);
    if (error) console.log(`   Детали:`, error.message || error);
  },
  info: (message, data) => {
    console.log(`ℹ️  ИНФО: ${message}`);
    if (data) console.log(`   Данные:`, util.inspect(data, { depth: 1, colors: true }));
  }
};

async function testAutonomousSystem() {
  TestLogger.step('Запуск комплексного теста автономной системы');

  // ==== ЭТАП 1: ПРОВЕРКА ЗАГРУЗКИ МОДУЛЕЙ ====
  TestLogger.step('ЭТАП 1: Проверка загрузки всех модулей');
  
  const modules = {};
  
  try {
    // Основные автономные модули
    modules.nlg = require('./server/semantic-memory/natural-language-generator.cjs');
    TestLogger.success('Генератор естественного языка загружен', Object.keys(modules.nlg));
    
    modules.ale = require('./server/semantic-memory/autonomous-learning-engine.cjs');
    TestLogger.success('Автономная система обучения загружена', Object.keys(modules.ale));
    
    modules.ps = require('./server/semantic-memory/predictive-system.cjs');
    TestLogger.success('Предиктивная система загружена', Object.keys(modules.ps));
    
    // Вспомогательные модули
    modules.healthCheck = require('./server/semantic-healthcheck.cjs');
    TestLogger.success('Система здоровья загружена', Object.keys(modules.healthCheck));
    
    modules.queueManager = require('./server/semantic-queue.cjs');
    TestLogger.success('Менеджер очередей загружен', Object.keys(modules.queueManager));
    
    modules.semanticIntegration = require('./server/semantic-integration-layer.cjs');
    TestLogger.success('Семантическая интеграция загружена', Object.keys(modules.semanticIntegration));
    
  } catch (error) {
    TestLogger.error('Ошибка загрузки модулей', error);
    return false;
  }

  // ==== ЭТАП 2: ПРОВЕРКА ИНИЦИАЛИЗАЦИИ СИСТЕМЫ ====
  TestLogger.step('ЭТАП 2: Проверка инициализации системы здоровья');
  
  try {
    const healthStatus = modules.healthCheck.globalHealthChecker.checkSystemHealth();
    TestLogger.success('Система здоровья инициализирована', {
      status: healthStatus.status,
      summary: healthStatus.summary,
      moduleCount: Object.keys(healthStatus.modules || {}).length
    });
  } catch (error) {
    TestLogger.error('Ошибка инициализации системы здоровья', error);
  }

  // ==== ЭТАП 3: ТЕСТ ГЕНЕРАТОРА ЕСТЕСТВЕННОГО ЯЗЫКА ====
  TestLogger.step('ЭТАП 3: Тест генератора естественного языка');
  
  try {
    // Простой тест
    const simpleResponse = modules.nlg.generateSimpleResponse('Привет');
    TestLogger.success('Простой ответ сгенерирован', {
      length: simpleResponse.length,
      preview: simpleResponse.substring(0, 100) + '...'
    });
    
    // Тест с семантическим результатом
    const mockSemanticResult = {
      mainTopic: 'тестирование',
      intent: 'консультация',
      category: 'general',
      confidence: 85,
      enhanced_prompt: 'Расскажи о тестировании автономных систем',
      system_recommendations: ['Использовать модульный подход', 'Проверять каждый компонент отдельно']
    };
    
    const complexResponse = await modules.nlg.generateResponse(mockSemanticResult, {
      userQuery: 'Как тестировать автономные системы?',
      sessionId: 'test-session'
    });
    
    TestLogger.success('Сложный ответ сгенерирован', {
      success: complexResponse.success,
      length: complexResponse.response?.length || 0,
      preview: complexResponse.response?.substring(0, 100) + '...'
    });
    
  } catch (error) {
    TestLogger.error('Ошибка тестирования генератора языка', error);
  }

  // ==== ЭТАП 4: ТЕСТ СИСТЕМЫ ОБУЧЕНИЯ ====
  TestLogger.step('ЭТАП 4: Тест системы автономного обучения');
  
  try {
    // Создаем фиктивное взаимодействие для обучения
    const mockInteraction = {
      id: 'test-interaction-' + Date.now(),
      query: 'Как тестировать автономные системы?',
      response: 'Тестирование автономных систем требует пошагового подхода...',
      responseTime: 1500,
      context: { sessionId: 'test-session' },
      userProfile: { preferences: { style: 'technical' } }
    };
    
    const learningResult = await modules.ale.learnFromInteraction(mockInteraction, {
      semanticResult: mockSemanticResult
    });
    
    TestLogger.success('Обучение завершено', {
      success: learningResult.success,
      patternsExtracted: learningResult.patternsExtracted,
      improvementsCount: learningResult.improvements?.length || 0
    });
    
    // Получаем рекомендации по улучшению
    const recommendations = modules.ale.getImprovementRecommendations('general');
    TestLogger.success('Рекомендации по улучшению получены', {
      count: recommendations.length,
      categories: recommendations.map(r => r.category).slice(0, 3)
    });
    
  } catch (error) {
    TestLogger.error('Ошибка тестирования системы обучения', error);
  }

  // ==== ЭТАП 5: ТЕСТ ПРЕДИКТИВНОЙ СИСТЕМЫ ====
  TestLogger.step('ЭТАП 5: Тест предиктивной системы');
  
  try {
    const mockAction = {
      type: 'image_generation',
      timestamp: Date.now(),
      context: { sessionId: 'test-session' }
    };
    
    const predictions = await modules.ps.predict('test-user', mockAction, {
      type: 'creative',
      projectId: 'test-project',
      phase: 'initial'
    });
    
    TestLogger.success('Предсказания созданы', {
      nextLikelyActions: predictions.nextLikelyActions?.length || 0,
      recommendations: predictions.recommendations?.length || 0,
      confidence: predictions.confidence
    });
    
  } catch (error) {
    TestLogger.error('Ошибка тестирования предиктивной системы', error);
  }

  // ==== ЭТАП 6: ТЕСТ ИНТЕГРАЦИИ ЧЕРЕЗ SMART-ROUTER ====
  TestLogger.step('ЭТАП 6: Тест интеграции через smart-router');
  
  try {
    // Используем динамический импорт для ES модуля
    const smartRouter = await import('./server/smart-router.js');
    
    TestLogger.success('Smart-router загружен успешно через динамический импорт');
    
    // Пытаемся выполнить простой запрос через систему
    const testOptions = {
      sessionId: 'test-integration-session',
      userId: 'test-user',
      startTime: Date.now(),
      userProfile: { preferences: { style: 'friendly' } }
    };
    
    TestLogger.info('Тест интеграции подготовлен', {
      options: testOptions,
      query: 'Привет! Как дела?'
    });
    
  } catch (error) {
    TestLogger.error('Ошибка тестирования интеграции', error);
  }

  // ==== ЭТАП 7: ИТОГОВЫЙ ОТЧЕТ ====
  TestLogger.step('ЭТАП 7: Итоговый отчет диагностики');
  
  const report = {
    timestamp: new Date().toISOString(),
    modulesLoaded: Object.keys(modules).length,
    systemHealth: 'checking...',
    criticalIssues: [],
    recommendations: []
  };
  
  // Проверяем состояние системы
  try {
    const healthStatus = modules.healthCheck.globalHealthChecker.checkSystemHealth();
    report.systemHealth = healthStatus.status;
    report.healthySystems = healthStatus.summary?.healthy || 0;
    report.totalSystems = healthStatus.summary?.total || 0;
  } catch (error) {
    report.criticalIssues.push('Система здоровья недоступна');
  }
  
  // Проверяем доступность ключевых функций
  const keyFunctions = [
    'generateSimpleResponse',
    'learnFromInteraction', 
    'predict',
    'checkSystemHealth'
  ];
  
  keyFunctions.forEach(func => {
    let available = false;
    try {
      if (func === 'generateSimpleResponse') available = typeof modules.nlg[func] === 'function';
      if (func === 'learnFromInteraction') available = typeof modules.ale[func] === 'function';
      if (func === 'predict') available = typeof modules.ps[func] === 'function';
      if (func === 'checkSystemHealth') available = typeof modules.healthCheck.globalHealthChecker[func] === 'function';
    } catch (e) {
      available = false;
    }
    
    if (!available) {
      report.criticalIssues.push(`Функция ${func} недоступна`);
    }
  });
  
  // Рекомендации по исправлению
  if (report.criticalIssues.length === 0) {
    report.recommendations.push('Система готова к работе');
    report.recommendations.push('Можно переходить к полноценному тестированию');
  } else {
    report.recommendations.push('Необходимо исправить критические проблемы');
    report.recommendations.push('Проверить инициализацию модулей');
  }
  
  TestLogger.success('ИТОГОВЫЙ ОТЧЕТ ДИАГНОСТИКИ', report);
  
  return report;
}

// Запуск теста
if (require.main === module) {
  testAutonomousSystem()
    .then(report => {
      console.log('\n🎯 ДИАГНОСТИКА ЗАВЕРШЕНА');
      console.log(`📊 Модулей загружено: ${report.modulesLoaded}`);
      console.log(`💊 Здоровье системы: ${report.systemHealth}`);
      console.log(`⚠️  Критических проблем: ${report.criticalIssues.length}`);
      
      if (report.criticalIssues.length > 0) {
        console.log('\n🔧 ТРЕБУЮТ ИСПРАВЛЕНИЯ:');
        report.criticalIssues.forEach(issue => console.log(`   - ${issue}`));
      }
      
      process.exit(report.criticalIssues.length === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 КРИТИЧЕСКАЯ ОШИБКА ДИАГНОСТИКИ:', error);
      process.exit(1);
    });
}

module.exports = { testAutonomousSystem };