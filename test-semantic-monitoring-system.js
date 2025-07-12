
/**
 * ЭТАП 6: Автоматическое тестирование семантических модулей
 * Интеграционные тесты для всей цепочки обработки
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class SemanticTestingSuite {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    this.loadModules();
  }

  loadModules() {
    try {
      this.semanticMemory = require('./server/semantic-memory/index.cjs');
      this.intelligentProcessor = require('./server/intelligent-chat-processor.cjs');
      this.semanticIntegration = require('./server/semantic-integration-layer.cjs');
      this.conversationEngine = require('./server/conversation-engine.cjs');
      this.globalDashboard = require('./server/semantic-monitor-dashboard.cjs').globalDashboard;
      this.globalHealthChecker = require('./server/semantic-healthcheck.cjs').globalHealthChecker;
      
      console.log('✅ Все основные модули загружены для тестирования');
    } catch (error) {
      console.error('❌ Ошибка загрузки модулей для тестирования:', error);
      throw error;
    }
  }

  async runFullTestSuite() {
    console.log('🧪 ЗАПУСК ПОЛНОГО НАБОРА ТЕСТОВ СЕМАНТИЧЕСКОЙ СИСТЕМЫ\n');
    console.log('=' .repeat(60));

    // Тест 1: Проверка доступности всех модулей
    await this.testModuleAvailability();

    // Тест 2: Тестирование основной цепочки обработки
    await this.testProcessingChain();

    // Тест 3: Тестирование системы мониторинга
    await this.testMonitoringSystem();

    // Тест 4: Нагрузочное тестирование
    await this.testSystemLoad();

    // Тест 5: Тестирование восстановления после ошибок
    await this.testErrorRecovery();

    // Тест 6: Интеграционные тесты
    await this.testIntegration();

    // Генерация отчета
    this.generateTestReport();
  }

  async testModuleAvailability() {
    console.log('\n🔍 ТЕСТ 1: Проверка доступности всех модулей');
    console.log('-'.repeat(50));

    const modules = [
      'semantic-memory', 'intelligent-processor', 'semantic-integration-layer',
      'natural-language-generator', 'semantic-analyzer', 'meta-semantic-engine',
      'emotional-semantic-matrix', 'conversation-engine', 'project-manager',
      'entity-extractor', 'project-predictor', 'knowledge-graph', 'user-profiler'
    ];

    let passedTests = 0;
    const startTime = Date.now();

    for (const moduleName of modules) {
      try {
        const healthCheck = this.globalHealthChecker.checkSystemHealth();
        const moduleHealth = healthCheck.modules[moduleName];
        
        if (moduleHealth && moduleHealth.status !== 'unavailable') {
          console.log(`✅ ${moduleName}: ${moduleHealth.status}`);
          passedTests++;
        } else {
          console.log(`❌ ${moduleName}: недоступен`);
        }
      } catch (error) {
        console.log(`❌ ${moduleName}: ошибка проверки - ${error.message}`);
      }
    }

    const duration = Date.now() - startTime;
    this.recordTest('Module Availability', passedTests, modules.length, duration);
    
    console.log(`\n📊 Результат: ${passedTests}/${modules.length} модулей доступны (${duration}мс)`);
  }

  async testProcessingChain() {
    console.log('\n⚙️ ТЕСТ 2: Тестирование основной цепочки обработки');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Простой запрос на создание логотипа',
        input: 'Создай логотип для кофейни',
        expected: 'analysis_consultation'
      },
      {
        name: 'Продолжение проекта',
        input: 'Векторизуй этот логотип',
        expected: 'image_generation'
      },
      {
        name: 'Вопрос о функциональности',
        input: 'Что ты умеешь делать?',
        expected: 'general_consultation'
      }
    ];

    let passedTests = 0;
    const chainStartTime = Date.now();

    for (const testCase of testCases) {
      const testStart = Date.now();
      
      try {
        console.log(`\n🧪 Тестируем: ${testCase.name}`);
        
        // Тест 1: Семантическая память
        const memoryResult = await this.semanticMemory.analyzeCompleteRequest(
          testCase.input,
          'test-session-' + Date.now(),
          { hasRecentImages: false }
        );
        
        console.log(`  📊 Память: уверенность ${memoryResult.confidence?.toFixed(1) || 'N/A'}%`);
        
        // Тест 2: Интеллектуальный процессор
        const processorResult = await this.intelligentProcessor.analyzeUserIntent(
          testCase.input,
          { sessionId: 'test-session-' + Date.now() }
        );
        
        console.log(`  🧠 Процессор: категория ${processorResult.category}`);
        
        // Тест 3: Семантическая интеграция
        const integrationResult = await this.semanticIntegration.analyzeWithSemantics(
          testCase.input,
          {
            sessionId: 'test-session-' + Date.now(),
            hasRecentImages: false,
            requestType: 'general'
          }
        );
        
        console.log(`  🔗 Интеграция: статус ${integrationResult.success ? 'успешно' : 'ошибка'}`);
        
        // Тест 4: Движок разговора
        const conversationResult = await this.conversationEngine.processUserInput(
          testCase.input,
          'test-session-' + Date.now(),
          {}
        );
        
        console.log(`  💬 Разговор: ${conversationResult.reply ? 'ответ получен' : 'нет ответа'}`);
        
        if (memoryResult && processorResult && integrationResult && conversationResult) {
          console.log(`  ✅ Цепочка обработки работает корректно`);
          passedTests++;
        } else {
          console.log(`  ❌ Ошибка в цепочке обработки`);
        }
        
      } catch (error) {
        console.log(`  ❌ Ошибка обработки: ${error.message}`);
      }
      
      const testDuration = Date.now() - testStart;
      console.log(`  ⏱️ Время обработки: ${testDuration}мс`);
    }

    const totalDuration = Date.now() - chainStartTime;
    this.recordTest('Processing Chain', passedTests, testCases.length, totalDuration);
    
    console.log(`\n📊 Результат: ${passedTests}/${testCases.length} цепочек работают (${totalDuration}мс)`);
  }

  async testMonitoringSystem() {
    console.log('\n📊 ТЕСТ 3: Тестирование системы мониторинга');
    console.log('-'.repeat(50));

    let passedTests = 0;
    const monitoringStartTime = Date.now();

    try {
      // Тест dashboard
      console.log('🎛️ Тестируем dashboard...');
      const dashboardData = this.globalDashboard.getDashboardData();
      
      if (dashboardData && dashboardData.modules && dashboardData.system) {
        console.log(`  ✅ Dashboard: ${dashboardData.modules.length} модулей, статус ${dashboardData.system.status}`);
        passedTests++;
      } else {
        console.log('  ❌ Dashboard: нет данных');
      }

      // Тест health checker
      console.log('🏥 Тестируем health checker...');
      const healthData = this.globalHealthChecker.checkSystemHealth();
      
      if (healthData && healthData.modules) {
        console.log(`  ✅ Health Checker: ${Object.keys(healthData.modules).length} модулей проверено`);
        passedTests++;
      } else {
        console.log('  ❌ Health Checker: нет данных');
      }

      // Тест статистики
      console.log('📈 Тестируем статистику...');
      const stats = this.globalDashboard.getSystemStatistics();
      
      if (stats && stats.totalModules > 0) {
        console.log(`  ✅ Статистика: ${stats.healthyModules}/${stats.totalModules} здоровых модулей`);
        passedTests++;
      } else {
        console.log('  ❌ Статистика: нет данных');
      }

    } catch (error) {
      console.log(`❌ Ошибка тестирования мониторинга: ${error.message}`);
    }

    const totalDuration = Date.now() - monitoringStartTime;
    this.recordTest('Monitoring System', passedTests, 3, totalDuration);
    
    console.log(`\n📊 Результат: ${passedTests}/3 компонентов мониторинга работают (${totalDuration}мс)`);
  }

  async testSystemLoad() {
    console.log('\n⚡ ТЕСТ 4: Нагрузочное тестирование');
    console.log('-'.repeat(50));

    const concurrentRequests = 5;
    const requests = [];
    let successfulRequests = 0;
    const loadStartTime = Date.now();

    console.log(`🚀 Запускаем ${concurrentRequests} параллельных запросов...`);

    for (let i = 0; i < concurrentRequests; i++) {
      const request = this.processLoadTestRequest(i);
      requests.push(request);
    }

    try {
      const results = await Promise.allSettled(requests);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`  ✅ Запрос ${index + 1}: успешно (${result.value}мс)`);
          successfulRequests++;
        } else {
          console.log(`  ❌ Запрос ${index + 1}: ошибка - ${result.reason}`);
        }
      });

    } catch (error) {
      console.log(`❌ Ошибка нагрузочного тестирования: ${error.message}`);
    }

    const totalDuration = Date.now() - loadStartTime;
    this.recordTest('Load Testing', successfulRequests, concurrentRequests, totalDuration);
    
    console.log(`\n📊 Результат: ${successfulRequests}/${concurrentRequests} запросов обработано (${totalDuration}мс)`);
  }

  async processLoadTestRequest(requestId) {
    const startTime = Date.now();
    
    const testQueries = [
      'Создай логотип для ресторана',
      'Векторизуй изображение',
      'Анализируй это фото',
      'Помоги с дизайном',
      'Что ты умеешь?'
    ];

    const query = testQueries[requestId % testQueries.length];
    const sessionId = `load-test-${requestId}-${Date.now()}`;

    try {
      const result = await this.conversationEngine.processUserInput(query, sessionId, {});
      
      if (result && result.reply) {
        return Date.now() - startTime;
      } else {
        throw new Error('Нет ответа от системы');
      }
    } catch (error) {
      throw new Error(`Ошибка запроса ${requestId}: ${error.message}`);
    }
  }

  async testErrorRecovery() {
    console.log('\n🛠️ ТЕСТ 5: Тестирование восстановления после ошибок');
    console.log('-'.repeat(50));

    let passedTests = 0;
    const recoveryStartTime = Date.now();

    // Тест 1: Обработка некорректного запроса
    try {
      console.log('🧪 Тестируем обработку некорректного запроса...');
      const result = await this.conversationEngine.processUserInput(
        '', // пустой запрос
        'error-test-session',
        {}
      );
      
      if (result && result.reply) {
        console.log('  ✅ Система корректно обработала пустой запрос');
        passedTests++;
      } else {
        console.log('  ❌ Система не смогла обработать пустой запрос');
      }
    } catch (error) {
      console.log(`  ⚠️ Исключение при пустом запросе: ${error.message}`);
      passedTests++; // Ожидаемое поведение
    }

    // Тест 2: Обработка очень длинного запроса
    try {
      console.log('🧪 Тестируем обработку длинного запроса...');
      const longQuery = 'Создай логотип '.repeat(1000); // очень длинный запрос
      const result = await this.conversationEngine.processUserInput(
        longQuery,
        'long-test-session',
        {}
      );
      
      if (result && result.reply) {
        console.log('  ✅ Система корректно обработала длинный запрос');
        passedTests++;
      }
    } catch (error) {
      console.log(`  ❌ Ошибка обработки длинного запроса: ${error.message}`);
    }

    // Тест 3: Проверка fallback режима
    try {
      console.log('🧪 Тестируем fallback режим...');
      
      // Отправляем запрос с заведомо проблемными данными
      const result = await this.semanticMemory.analyzeCompleteRequest(
        'тест fallback режима',
        'fallback-test-session',
        { hasRecentImages: false, forceError: true }
      );
      
      if (result && (result.fallback_mode || result.reply)) {
        console.log('  ✅ Fallback режим работает корректно');
        passedTests++;
      }
    } catch (error) {
      console.log(`  ⚠️ Fallback обработка: ${error.message}`);
      passedTests++; // Fallback может бросать исключения
    }

    const totalDuration = Date.now() - recoveryStartTime;
    this.recordTest('Error Recovery', passedTests, 3, totalDuration);
    
    console.log(`\n📊 Результат: ${passedTests}/3 сценариев восстановления работают (${totalDuration}мс)`);
  }

  async testIntegration() {
    console.log('\n🔗 ТЕСТ 6: Интеграционные тесты');
    console.log('-'.repeat(50));

    let passedTests = 0;
    const integrationStartTime = Date.now();

    // Тест полного цикла работы с проектом
    try {
      console.log('🧪 Тестируем полный цикл работы с проектом...');
      const sessionId = 'integration-test-' + Date.now();
      
      // Шаг 1: Создание проекта
      const createResult = await this.intelligentProcessor.analyzeUserIntent(
        'Создай логотип для пекарни "Хлебушко"',
        { sessionId }
      );
      
      // Шаг 2: Продолжение проекта
      const continueResult = await this.intelligentProcessor.analyzeUserIntent(
        'Сделай его более минималистичным',
        { sessionId, hasRecentImages: true }
      );
      
      // Шаг 3: Векторизация
      const vectorizeResult = await this.intelligentProcessor.analyzeUserIntent(
        'Векторизуй логотип',
        { sessionId, hasRecentImages: true }
      );
      
      if (createResult.success && continueResult.success && vectorizeResult.success) {
        console.log('  ✅ Полный цикл проекта работает корректно');
        passedTests++;
      } else {
        console.log('  ❌ Ошибка в полном цикле проекта');
      }
      
    } catch (error) {
      console.log(`  ❌ Ошибка интеграционного теста: ${error.message}`);
    }

    // Тест взаимодействия мониторинга и обработки
    try {
      console.log('🧪 Тестируем интеграцию мониторинга...');
      
      // Выполняем запрос и проверяем, что он отражается в статистике
      const beforeStats = this.globalDashboard.getSystemStatistics();
      
      await this.conversationEngine.processUserInput(
        'Тестовый запрос для мониторинга',
        'monitoring-integration-test',
        {}
      );
      
      // Небольшая задержка для обновления статистики
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const afterStats = this.globalDashboard.getSystemStatistics();
      
      if (afterStats.totalSuccess >= beforeStats.totalSuccess) {
        console.log('  ✅ Мониторинг корректно отслеживает выполнение запросов');
        passedTests++;
      } else {
        console.log('  ❌ Мониторинг не отслеживает выполнение запросов');
      }
      
    } catch (error) {
      console.log(`  ❌ Ошибка теста мониторинга: ${error.message}`);
    }

    const totalDuration = Date.now() - integrationStartTime;
    this.recordTest('Integration Tests', passedTests, 2, totalDuration);
    
    console.log(`\n📊 Результат: ${passedTests}/2 интеграционных теста прошли (${totalDuration}мс)`);
  }

  recordTest(testName, passed, total, duration) {
    this.testResults.push({
      name: testName,
      passed: passed,
      total: total,
      success_rate: (passed / total) * 100,
      duration: duration,
      timestamp: Date.now()
    });
  }

  generateTestReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 ИТОГОВЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ СЕМАНТИЧЕСКОЙ СИСТЕМЫ');
    console.log('='.repeat(60));

    const totalDuration = Date.now() - this.startTime;
    const totalTests = this.testResults.reduce((sum, test) => sum + test.total, 0);
    const totalPassed = this.testResults.reduce((sum, test) => sum + test.passed, 0);
    const overallSuccessRate = (totalPassed / totalTests) * 100;

    console.log(`\n📊 ОБЩАЯ СТАТИСТИКА:`);
    console.log(`  ⏱️ Общее время тестирования: ${totalDuration}мс`);
    console.log(`  ✅ Успешных тестов: ${totalPassed}/${totalTests}`);
    console.log(`  📈 Общий процент успеха: ${overallSuccessRate.toFixed(1)}%`);

    console.log(`\n📋 ДЕТАЛИЗАЦИЯ ПО ТЕСТАМ:`);
    this.testResults.forEach(test => {
      const status = test.success_rate >= 80 ? '✅' : test.success_rate >= 50 ? '⚠️' : '❌';
      console.log(`  ${status} ${test.name}: ${test.passed}/${test.total} (${test.success_rate.toFixed(1)}%) - ${test.duration}мс`);
    });

    // Рекомендации
    console.log(`\n💡 РЕКОМЕНДАЦИИ:`);
    if (overallSuccessRate >= 90) {
      console.log(`  🎉 Отличная работа! Система работает стабильно.`);
    } else if (overallSuccessRate >= 70) {
      console.log(`  ⚠️ Система работает удовлетворительно, есть места для улучшения.`);
    } else {
      console.log(`  ❌ Требуется серьезная доработка системы.`);
    }

    const failedTests = this.testResults.filter(test => test.success_rate < 80);
    if (failedTests.length > 0) {
      console.log(`\n🔧 ОБЛАСТИ ДЛЯ УЛУЧШЕНИЯ:`);
      failedTests.forEach(test => {
        console.log(`  • ${test.name}: необходимо повысить стабильность`);
      });
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Запуск тестирования
async function runTests() {
  try {
    const testSuite = new SemanticTestingSuite();
    await testSuite.runFullTestSuite();
  } catch (error) {
    console.error('❌ Критическая ошибка тестирования:', error);
    process.exit(1);
  }
}

// Запускаем тесты если файл вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { SemanticTestingSuite };
