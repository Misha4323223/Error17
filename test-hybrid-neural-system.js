/**
 * 🧪 ТЕСТИРОВАНИЕ ГИБРИДНОЙ НЕЙРОСЕТЕВОЙ СИСТЕМЫ
 * Полный набор тестов для проверки lite → full → fallback цепочки
 */

const { initializeNeuralIntegration } = require('./server/neural-integration.cjs');
const { getGlobalMemoryMonitor } = require('./server/memory-monitor.cjs');
const { getGlobalProgressManager } = require('./server/neural-progress-manager.cjs');

class HybridNeuralSystemTester {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    this.neuralIntegration = null;
    this.memoryMonitor = null;
    this.progressManager = null;
  }

  async runFullTestSuite() {
    console.log('🧪 ===== НАЧАЛО ПОЛНОГО ТЕСТИРОВАНИЯ ГИБРИДНОЙ НЕЙРОСЕТЕВОЙ СИСТЕМЫ =====');
    
    try {
      // Инициализация компонентов
      await this.initializeTestComponents();
      
      // Тестовые сценарии
      await this.testScenario1_NormalFlow();
      await this.testScenario2_MemoryLimits();
      await this.testScenario3_StressTest();
      await this.testScenario4_FallbackSystem();
      await this.testScenario5_HotSwapSystem();
      await this.testScenario6_ErrorRecovery();
      
      // Финальный отчет
      this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ Критическая ошибка тестирования:', error);
      this.recordTest('Critical System Error', false, 1, Date.now() - this.startTime);
    }
  }

  async initializeTestComponents() {
    console.log('\n🔧 Инициализация тестовых компонентов...');
    
    try {
      // Инициализация системы мониторинга
      this.memoryMonitor = getGlobalMemoryMonitor();
      this.progressManager = getGlobalProgressManager();
      
      // Запуск Progress Manager WebSocket сервера
      this.progressManager.startWebSocketServer(8082); // Тестовый порт
      
      console.log('✅ Тестовые компоненты инициализированы');
      this.recordTest('Component Initialization', true, 1, 100);
      
    } catch (error) {
      console.error('❌ Ошибка инициализации компонентов:', error);
      this.recordTest('Component Initialization', false, 1, 100);
      throw error;
    }
  }

  async testScenario1_NormalFlow() {
    console.log('\n🎯 СЦЕНАРИЙ 1: Нормальный поток Lite → Full');
    const testStart = Date.now();
    
    try {
      // Тест 1: Инициализация LITE
      console.log('  📋 Тест 1.1: Инициализация LITE режима...');
      this.neuralIntegration = await initializeNeuralIntegration();
      
      if (this.neuralIntegration.mode === 'lite') {
        console.log('  ✅ LITE режим успешно инициализирован');
        this.recordTest('LITE Initialization', true, 1, Date.now() - testStart);
      } else {
        console.log('  ❌ LITE режим не активирован');
        this.recordTest('LITE Initialization', false, 1, Date.now() - testStart);
      }
      
      // Тест 2: Генерация в LITE режиме
      console.log('  📋 Тест 1.2: Генерация ответа в LITE режиме...');
      const liteResponse = await this.neuralIntegration.generateHybridResponse(
        'Привет! Как дела?', 
        { maxTokens: 20, temperature: 0.7 }
      );
      
      if (liteResponse && liteResponse.length > 5) {
        console.log('  ✅ LITE генерация работает:', liteResponse.substring(0, 50) + '...');
        this.recordTest('LITE Generation', true, 1, Date.now() - testStart);
      } else {
        console.log('  ❌ LITE генерация не работает');
        this.recordTest('LITE Generation', false, 1, Date.now() - testStart);
      }
      
      // Тест 3: Проверка памяти для upgrade
      console.log('  📋 Тест 1.3: Проверка возможности upgrade...');
      const canUpgrade = this.memoryMonitor.canLoadFullNeural();
      
      if (canUpgrade) {
        console.log('  ✅ Память позволяет upgrade на FULL');
        this.recordTest('Memory Check for Upgrade', true, 1, Date.now() - testStart);
        
        // Тест 4: Upgrade на FULL
        console.log('  📋 Тест 1.4: Upgrade на FULL режим...');
        const upgradeResult = await this.neuralIntegration.upgradeToFull();
        
        if (upgradeResult.success) {
          console.log('  ✅ Upgrade на FULL успешен');
          this.recordTest('Full Upgrade', true, 1, Date.now() - testStart);
        } else {
          console.log('  ⚠️ Upgrade на FULL не выполнен:', upgradeResult.message);
          this.recordTest('Full Upgrade', false, 1, Date.now() - testStart);
        }
      } else {
        console.log('  ⚠️ Недостаточно памяти для upgrade');
        this.recordTest('Memory Check for Upgrade', false, 1, Date.now() - testStart);
      }
      
    } catch (error) {
      console.error('  ❌ Ошибка в сценарии 1:', error);
      this.recordTest('Scenario 1 Overall', false, 1, Date.now() - testStart);
    }
  }

  async testScenario2_MemoryLimits() {
    console.log('\n🧠 СЦЕНАРИЙ 2: Тестирование лимитов памяти');
    const testStart = Date.now();
    
    try {
      // Получаем текущее состояние памяти
      const memoryStatus = this.memoryMonitor.getCurrentMemoryStatus();
      console.log(`  📊 Текущее использование памяти: ${memoryStatus.usagePercentFormatted}`);
      console.log(`  💾 Доступно: ${memoryStatus.freeMB}MB из ${memoryStatus.totalMB}MB`);
      
      // Тест автоматического выбора режима
      const recommendedMode = this.memoryMonitor.recommendNeuralMode();
      console.log(`  🎯 Рекомендуемый режим: ${recommendedMode.mode}`);
      console.log(`  💡 Причина: ${recommendedMode.reason}`);
      
      // Запуск мониторинга памяти
      this.memoryMonitor.startMemoryMonitoring();
      
      // Ждем несколько секунд сбора данных
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Проверяем историю
      const history = this.memoryMonitor.getMemoryHistory();
      console.log(`  📈 Собрано ${history.length} точек данных мониторинга`);
      
      if (history.length > 0) {
        console.log('  ✅ Система мониторинга памяти работает');
        this.recordTest('Memory Monitoring', true, 1, Date.now() - testStart);
      } else {
        console.log('  ❌ Система мониторинга не работает');
        this.recordTest('Memory Monitoring', false, 1, Date.now() - testStart);
      }
      
    } catch (error) {
      console.error('  ❌ Ошибка в сценарии 2:', error);
      this.recordTest('Scenario 2 Overall', false, 1, Date.now() - testStart);
    }
  }

  async testScenario3_StressTest() {
    console.log('\n⚡ СЦЕНАРИЙ 3: Стресс-тест множественных запросов');
    const testStart = Date.now();
    
    try {
      const requests = [
        'Расскажи о нейросетях',
        'Как работает векторизация?',
        'Создай дизайн вышивки',
        'Анализ цветовой палитры',
        'Что такое семантическая обработка?'
      ];
      
      const results = [];
      const concurrent = 3; // Количество одновременных запросов
      
      console.log(`  🔄 Запуск ${concurrent} параллельных запросов...`);
      
      for (let i = 0; i < requests.length; i += concurrent) {
        const batch = requests.slice(i, i + concurrent);
        const batchPromises = batch.map(async (request, index) => {
          try {
            const response = await this.neuralIntegration.generateHybridResponse(
              request,
              { maxTokens: 30, temperature: 0.8 }
            );
            return { success: true, request, response: response?.substring(0, 100) };
          } catch (error) {
            return { success: false, request, error: error.message };
          }
        });
        
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);
        
        console.log(`  📊 Обработано ${i + batch.length}/${requests.length} запросов`);
      }
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;
      
      console.log(`  ✅ Успешно: ${successful}/${results.length}`);
      console.log(`  ❌ Ошибок: ${failed}/${results.length}`);
      
      const successRate = (successful / results.length) * 100;
      
      if (successRate >= 80) {
        console.log(`  🎉 Стресс-тест пройден: ${successRate.toFixed(1)}% успешности`);
        this.recordTest('Stress Test', true, results.length, Date.now() - testStart);
      } else {
        console.log(`  ⚠️ Стресс-тест не пройден: ${successRate.toFixed(1)}% успешности`);
        this.recordTest('Stress Test', false, results.length, Date.now() - testStart);
      }
      
    } catch (error) {
      console.error('  ❌ Ошибка в сценарии 3:', error);
      this.recordTest('Scenario 3 Overall', false, 1, Date.now() - testStart);
    }
  }

  async testScenario4_FallbackSystem() {
    console.log('\n🛡️ СЦЕНАРИЙ 4: Тестирование системы fallback');
    const testStart = Date.now();
    
    try {
      // Симулируем отказ нейросети
      console.log('  🔧 Симуляция отказа нейросети...');
      
      const originalMode = this.neuralIntegration.mode;
      this.neuralIntegration.mode = 'error';
      
      // Тестируем fallback на семантическую систему
      const fallbackResponse = await this.neuralIntegration.generateHybridResponse(
        'Тестовый запрос для fallback',
        { useFallback: true }
      );
      
      if (fallbackResponse && fallbackResponse.length > 10) {
        console.log('  ✅ Fallback система работает:', fallbackResponse.substring(0, 50) + '...');
        this.recordTest('Fallback System', true, 1, Date.now() - testStart);
      } else {
        console.log('  ❌ Fallback система не работает');
        this.recordTest('Fallback System', false, 1, Date.now() - testStart);
      }
      
      // Восстанавливаем режим
      this.neuralIntegration.mode = originalMode;
      console.log('  🔄 Режим восстановлен');
      
    } catch (error) {
      console.error('  ❌ Ошибка в сценарии 4:', error);
      this.recordTest('Scenario 4 Overall', false, 1, Date.now() - testStart);
    }
  }

  async testScenario5_HotSwapSystem() {
    console.log('\n🔄 СЦЕНАРИЙ 5: Тестирование системы горячей замены');
    const testStart = Date.now();
    
    try {
      // Проверяем текущий режим
      const currentMode = this.neuralIntegration.mode;
      console.log(`  📊 Текущий режим: ${currentMode}`);
      
      // Тестируем метод switchToFullModel
      console.log('  🔄 Тестирование switchToFullModel...');
      const switchResult = await this.neuralIntegration.switchToFullModel();
      
      if (switchResult.success) {
        console.log('  ✅ Hot swap работает:', switchResult.message);
        this.recordTest('Hot Swap System', true, 1, Date.now() - testStart);
      } else {
        console.log('  ⚠️ Hot swap предупреждение:', switchResult.message);
        this.recordTest('Hot Swap System', false, 1, Date.now() - testStart);
      }
      
      // Тестируем отслеживание прогресса
      console.log('  📊 Тестирование Progress Manager...');
      const progressStatus = this.progressManager.getProgressStatus();
      console.log(`  📈 Прогресс: ${progressStatus.progress}%, статус: ${progressStatus.status}`);
      
      if (progressStatus.status !== 'error') {
        console.log('  ✅ Progress Manager работает');
        this.recordTest('Progress Manager', true, 1, Date.now() - testStart);
      } else {
        console.log('  ❌ Progress Manager не работает');
        this.recordTest('Progress Manager', false, 1, Date.now() - testStart);
      }
      
    } catch (error) {
      console.error('  ❌ Ошибка в сценарии 5:', error);
      this.recordTest('Scenario 5 Overall', false, 1, Date.now() - testStart);
    }
  }

  async testScenario6_ErrorRecovery() {
    console.log('\n🚨 СЦЕНАРИЙ 6: Тестирование восстановления после ошибок');
    const testStart = Date.now();
    
    try {
      // Тест 1: Восстановление после ошибки инициализации
      console.log('  🔧 Тест восстановления после ошибки...');
      
      // Симулируем различные типы ошибок
      const errorScenarios = [
        'Некорректный входной параметр',
        '', // Пустая строка
        null, // Null значение
        'Очень длинный текст для проверки лимитов: ' + 'a'.repeat(1000)
      ];
      
      let recoveredCount = 0;
      
      for (const scenario of errorScenarios) {
        try {
          const response = await this.neuralIntegration.generateHybridResponse(
            scenario,
            { maxTokens: 10, temperature: 0.5 }
          );
          
          if (response || response === '') {
            recoveredCount++;
            console.log(`  ✅ Восстановление для: "${scenario?.substring(0, 30)}..."`);
          }
        } catch (error) {
          console.log(`  ⚠️ Не восстановлено для: "${scenario?.substring(0, 30)}..."`);
        }
      }
      
      const recoveryRate = (recoveredCount / errorScenarios.length) * 100;
      
      if (recoveryRate >= 75) {
        console.log(`  🎉 Система восстановления работает: ${recoveryRate.toFixed(1)}%`);
        this.recordTest('Error Recovery', true, errorScenarios.length, Date.now() - testStart);
      } else {
        console.log(`  ⚠️ Система восстановления нестабильна: ${recoveryRate.toFixed(1)}%`);
        this.recordTest('Error Recovery', false, errorScenarios.length, Date.now() - testStart);
      }
      
    } catch (error) {
      console.error('  ❌ Ошибка в сценарии 6:', error);
      this.recordTest('Scenario 6 Overall', false, 1, Date.now() - testStart);
    }
  }

  recordTest(testName, passed, total, duration) {
    this.testResults.push({
      testName,
      passed,
      total,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  generateFinalReport() {
    const totalTime = Date.now() - this.startTime;
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = (passedTests / totalTests) * 100;
    
    console.log('\n📊 ===== ФИНАЛЬНЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ =====');
    console.log(`⏱️  Общее время: ${totalTime}мс`);
    console.log(`📋 Всего тестов: ${totalTests}`);
    console.log(`✅ Пройдено: ${passedTests}`);
    console.log(`❌ Не пройдено: ${failedTests}`);
    console.log(`📈 Успешность: ${successRate.toFixed(1)}%`);
    
    console.log('\n📋 Детальные результаты:');
    this.testResults.forEach((test, index) => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} ${index + 1}. ${test.testName} (${test.duration}мс)`);
    });
    
    // Оценка готовности к продакшену
    if (successRate >= 90) {
      console.log('\n🎉 СИСТЕМА ГОТОВА К ПРОДАКШЕНУ!');
      console.log('✅ Все критические компоненты работают стабильно');
      console.log('✅ Гибридная архитектура функционирует корректно');
      console.log('✅ Системы fallback и восстановления активны');
    } else if (successRate >= 75) {
      console.log('\n⚠️ СИСТЕМА ЧАСТИЧНО ГОТОВА');
      console.log('✅ Основные компоненты работают');
      console.log('⚠️ Требуется дополнительное тестирование');
    } else {
      console.log('\n❌ СИСТЕМА НЕ ГОТОВА К ПРОДАКШЕНУ');
      console.log('❌ Критические проблемы требуют исправления');
    }
    
    return {
      totalTime,
      totalTests,
      passedTests,
      failedTests,
      successRate,
      results: this.testResults
    };
  }
}

// Запуск тестирования
async function runTests() {
  const tester = new HybridNeuralSystemTester();
  
  try {
    await tester.runFullTestSuite();
  } catch (error) {
    console.error('❌ Критическая ошибка тестирования:', error);
  }
}

// Запускаем тесты если модуль вызван напрямую
if (require.main === module) {
  runTests();
}

module.exports = { HybridNeuralSystemTester, runTests };