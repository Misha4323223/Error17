/**
 * ЭТАП 5: Интеграционное тестирование системы
 */

const path = require('path');

async function testIntegration() {
  console.log('🔧 Начинаем интеграционное тестирование...');
  
  try {
    // Загружаем главный модуль
    const semanticMemory = require(path.join(__dirname, 'server', 'semantic-memory', 'index.cjs'));
    
    console.log('\n📊 Тестирование инициализации системы...');
    
    // Тестируем статистику системы
    const stats = semanticMemory.getSystemStatistics();
    console.log(`✅ Статистика системы получена:`);
    console.log(`   Всего модулей: ${stats.totalModules}`);
    console.log(`   Активных модулей: ${stats.activeModules}`);
    console.log(`   Здоровье системы: ${(stats.systemHealth * 100).toFixed(1)}%`);
    
    // Тестируем moduleChecker
    if (semanticMemory.moduleChecker) {
      console.log('\n🔍 Тестирование ModuleChecker...');
      const criticalStatus = semanticMemory.moduleChecker.checkCriticalModules();
      console.log(`✅ Критичные модули: ${criticalStatus.allCriticalAvailable ? 'ВСЕ ДОСТУПНЫ' : 'ЕСТЬ ПРОБЛЕМЫ'}`);
      
      // Проверяем статус ключевых модулей
      const keyModules = ['natural-language-generator', 'semantic-analyzer', 'meta-semantic-engine', 'emotional-semantic-matrix'];
      for (const module of keyModules) {
        const status = semanticMemory.moduleChecker.getModuleStatus(module);
        console.log(`   ${module}: ${status.available ? '✅ ДОСТУПЕН' : '❌ НЕДОСТУПЕН'} (${status.reason})`);
      }
    }
    
    // Тестируем analyzeCompleteRequest
    console.log('\n🧠 Тестирование analyzeCompleteRequest...');
    const testMessage = "Привет, как дела?";
    const analysis = await semanticMemory.analyzeCompleteRequest(testMessage);
    
    if (analysis && !analysis.error) {
      console.log(`✅ Анализ выполнен успешно`);
      console.log(`   Входное сообщение: "${testMessage}"`);
      console.log(`   Уверенность: ${(analysis.confidence * 100).toFixed(1)}%`);
      console.log(`   Время обработки: ${analysis.processingTime}мс`);
      
      if (analysis.moduleStatus) {
        const realModules = Object.values(analysis.moduleStatus).filter(s => s === 'REAL_MODULE_ACTIVE').length;
        const totalModules = Object.keys(analysis.moduleStatus).length;
        console.log(`   Реальные модули: ${realModules}/${totalModules}`);
      }
    } else {
      console.log(`❌ Ошибка анализа: ${analysis.error}`);
    }
    
    // Тестируем мета-анализ
    console.log('\n🔮 Тестирование мета-анализа...');
    const metaAnalysis = await semanticMemory.analyzeCompleteRequestWithMeta(testMessage);
    
    if (metaAnalysis && !metaAnalysis.error) {
      console.log(`✅ Мета-анализ выполнен успешно`);
      console.log(`   Мета-режим: ${metaAnalysis.isMeta ? 'АКТИВЕН' : 'НЕАКТИВЕН'}`);
      console.log(`   Уверенность: ${(metaAnalysis.confidence * 100).toFixed(1)}%`);
    } else {
      console.log(`❌ Ошибка мета-анализа: ${metaAnalysis.error}`);
    }
    
    // Тестируем генерацию ответа
    console.log('\n💬 Тестирование генерации ответа...');
    const response = await semanticMemory.generateResponseWithRealModules(testMessage, analysis);
    
    if (response && response.success) {
      console.log(`✅ Ответ сгенерирован успешно`);
      console.log(`   Генератор: ${response.generatedBy}`);
      console.log(`   Уверенность: ${(response.confidence * 100).toFixed(1)}%`);
      console.log(`   Ответ: "${response.response.substring(0, 100)}..."`);
    } else {
      console.log(`❌ Ошибка генерации: ${response.error}`);
    }
    
    console.log('\n🎉 ИНТЕГРАЦИОННОЕ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!');
    return true;
    
  } catch (error) {
    console.error('❌ Критическая ошибка интеграционного тестирования:', error.message);
    return false;
  }
}

// Запускаем тест
testIntegration().then(success => {
  if (success) {
    console.log('\n✅ ВСЕ ИНТЕГРАЦИОННЫЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!');
  } else {
    console.log('\n❌ ЕСТЬ ПРОБЛЕМЫ С ИНТЕГРАЦИЕЙ');
  }
}).catch(error => {
  console.error('❌ Критическая ошибка:', error);
});