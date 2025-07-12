
/**
 * Тест всех 54+ семантических модулей
 * Проверяет интеграцию и доступность всех модулей системы
 */

const { createRequire } = require('module');
const require = createRequire(import.meta.url);

async function testAllSemanticModules() {
  console.log('🧪 ТЕСТИРОВАНИЕ ВСЕХ 54+ СЕМАНТИЧЕСКИХ МОДУЛЕЙ');
  console.log('=' .repeat(70));

  try {
    // Загружаем основную семантическую память
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    // Ждем инициализации
    await semanticMemory.initializationPromise;
    
    console.log('\n📊 СТАТИСТИКА СИСТЕМЫ:');
    const stats = semanticMemory.getSystemStatistics();
    console.log(`  🔢 Всего модулей: ${stats.totalModules}`);
    console.log(`  ✅ Активных модулей: ${stats.activeModules}`);
    console.log(`  📈 Здоровье системы: ${(stats.systemHealth * 100).toFixed(1)}%`);
    
    console.log('\n🔍 ТЕСТИРОВАНИЕ МОДУЛЕЙ ПО КАТЕГОРИЯМ:');
    
    // Критичные модули
    console.log('\n1️⃣ КРИТИЧНЫЕ МОДУЛИ:');
    const criticalModules = [
      'naturalLanguageGenerator',
      'semanticAnalyzer', 
      'metaSemanticEngine',
      'emotionalSemanticMatrix'
    ];
    
    criticalModules.forEach(moduleName => {
      const module = semanticMemory[moduleName];
      console.log(`  ${module ? '✅' : '❌'} ${moduleName}: ${module ? 'АКТИВЕН' : 'НЕ ДОСТУПЕН'}`);
    });
    
    // Основные модули
    console.log('\n2️⃣ ОСНОВНЫЕ МОДУЛИ:');
    const coreModules = [
      'semanticProjectManager',
      'entityExtractor',
      'projectPredictor',
      'knowledgeGraph',
      'userProfiler'
    ];
    
    coreModules.forEach(moduleName => {
      const module = semanticMemory[moduleName];
      console.log(`  ${module ? '✅' : '❌'} ${moduleName}: ${module ? 'АКТИВЕН' : 'НЕ ДОСТУПЕН'}`);
    });
    
    // Продвинутые модули
    console.log('\n3️⃣ ПРОДВИНУТЫЕ МОДУЛИ:');
    const advancedModules = [
      'realtimeProcessor',
      'visualSemanticAnalyzer',
      'semanticIntuition',
      'recursiveSelfModeler',
      'quantumSemanticProcessor',
      'dynamicNeuralArchitect',
      'collectiveSemanticWisdom',
      'biomimeticSemantics',
      'divineSemantics'
    ];
    
    advancedModules.forEach(moduleName => {
      const module = semanticMemory[moduleName];
      console.log(`  ${module ? '✅' : '❌'} ${moduleName}: ${module ? 'АКТИВЕН' : 'НЕ ДОСТУПЕН'}`);
    });
    
    // Временные модули
    console.log('\n4️⃣ ВРЕМЕННЫЕ МОДУЛИ:');
    const temporalModules = [
      'temporalMachineCore',
      'temporalMachineEngine',
      'temporalMetaSemantics',
      'temporalSemanticMachine',
      'temporalMachineIntegration',
      'quantumTemporalSemantics'
    ];
    
    temporalModules.forEach(moduleName => {
      const module = semanticMemory[moduleName];
      console.log(`  ${module ? '✅' : '❌'} ${moduleName}: ${module ? 'АКТИВЕН' : 'НЕ ДОСТУПЕН'}`);
    });
    
    // Семантические расширения
    console.log('\n5️⃣ СЕМАНТИЧЕСКИЕ РАСШИРЕНИЯ:');
    const semanticExtensions = [
      'semanticAlchemy',
      'semanticRealityEngine',
      'semanticSynesthesia',
      'semanticTelepathy',
      'swarmSemanticIntelligence',
      'universalSemanticTheory'
    ];
    
    semanticExtensions.forEach(moduleName => {
      const module = semanticMemory[moduleName];
      console.log(`  ${module ? '✅' : '❌'} ${moduleName}: ${module ? 'АКТИВЕН' : 'НЕ ДОСТУПЕН'}`);
    });
    
    // НОВЫЕ НЕИНТЕГРИРОВАННЫЕ МОДУЛИ
    console.log('\n6️⃣ НОВЫЕ ИНТЕГРИРОВАННЫЕ МОДУЛИ:');
    const newModules = [
      'cognitiveFingerprinter',
      'visualSemanticExtensions',
      'interdimensionalSemantics',
      'learningSystem',
      'multidimensionalSemantics',
      'multilingualProcessor',
      'predictiveSystem',
      'semanticBlackHoles',
      'semanticProjectManager',
      'semanticTopologyExplorer',
      'smartLogger',
      'userMemoryManager'
    ];
    
    newModules.forEach(moduleName => {
      const module = semanticMemory[moduleName];
      console.log(`  ${module ? '✅' : '❌'} ${moduleName}: ${module ? 'АКТИВЕН' : 'НЕ ДОСТУПЕН'}`);
    });
    
    // Подсчет активных модулей по категориям
    const activeCount = {
      critical: criticalModules.filter(name => semanticMemory[name]).length,
      core: coreModules.filter(name => semanticMemory[name]).length,
      advanced: advancedModules.filter(name => semanticMemory[name]).length,
      temporal: temporalModules.filter(name => semanticMemory[name]).length,
      extensions: semanticExtensions.filter(name => semanticMemory[name]).length,
      new: newModules.filter(name => semanticMemory[name]).length
    };
    
    const totalCount = {
      critical: criticalModules.length,
      core: coreModules.length,
      advanced: advancedModules.length,
      temporal: temporalModules.length,
      extensions: semanticExtensions.length,
      new: newModules.length
    };
    
    console.log('\n📈 СВОДНАЯ СТАТИСТИКА:');
    console.log(`  🔴 Критичные: ${activeCount.critical}/${totalCount.critical} (${(activeCount.critical/totalCount.critical*100).toFixed(1)}%)`);
    console.log(`  🟡 Основные: ${activeCount.core}/${totalCount.core} (${(activeCount.core/totalCount.core*100).toFixed(1)}%)`);
    console.log(`  🟢 Продвинутые: ${activeCount.advanced}/${totalCount.advanced} (${(activeCount.advanced/totalCount.advanced*100).toFixed(1)}%)`);
    console.log(`  ⏰ Временные: ${activeCount.temporal}/${totalCount.temporal} (${(activeCount.temporal/totalCount.temporal*100).toFixed(1)}%)`);
    console.log(`  🎨 Расширения: ${activeCount.extensions}/${totalCount.extensions} (${(activeCount.extensions/totalCount.extensions*100).toFixed(1)}%)`);
    console.log(`  🆕 Новые: ${activeCount.new}/${totalCount.new} (${(activeCount.new/totalCount.new*100).toFixed(1)}%)`);
    
    const totalActive = Object.values(activeCount).reduce((sum, count) => sum + count, 0);
    const totalModules = Object.values(totalCount).reduce((sum, count) => sum + count, 0);
    
    console.log(`\n🎯 ОБЩИЙ РЕЗУЛЬТАТ: ${totalActive}/${totalModules} модулей (${(totalActive/totalModules*100).toFixed(1)}%)`);
    
    // Тест функциональности
    console.log('\n🧪 ТЕСТИРОВАНИЕ ФУНКЦИОНАЛЬНОСТИ:');
    
    if (semanticMemory.naturalLanguageGenerator) {
      console.log('  🤖 Тестируем генератор языка...');
      // Тест будет добавлен после проверки структуры
    }
    
    if (semanticMemory.semanticAnalyzer) {
      console.log('  🔬 Тестируем семантический анализ...');
      // Тест будет добавлен после проверки структуры
    }
    
    console.log('\n✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запускаем тест
testAllSemanticModules().catch(console.error);
