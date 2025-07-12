#!/usr/bin/env node

/**
 * Тест исправления ES модулей
 * Проверяет что все visual-semantic компоненты загружаются корректно
 */

console.log('🔧 Тестирование исправления ES модулей...\n');

async function testESModuleFix() {
  const results = {
    visualSemanticIntegration: false,
    advancedImageAnalyzer: false,
    smartVisionAnalyzer: false,
    smartObjectDetector: false,
    intelligentChatProcessor: false
  };

  // Тест 1: visual-semantic-integration.cjs
  try {
    console.log('📋 Тест 1: visual-semantic-integration.cjs');
    const integration = require('./server/visual-semantic-integration.cjs');
    console.log('   ✅ visual-semantic-integration загружен успешно');
    results.visualSemanticIntegration = true;
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 2: advanced-image-analyzer.cjs
  try {
    console.log('📋 Тест 2: advanced-image-analyzer.cjs');
    const analyzer = require('./server/advanced-image-analyzer.cjs');
    console.log('   ✅ advanced-image-analyzer загружен успешно');
    results.advancedImageAnalyzer = true;
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 3: smart-vision-analyzer.cjs
  try {
    console.log('📋 Тест 3: smart-vision-analyzer.cjs');
    const analyzer = require('./server/smart-vision-analyzer.cjs');
    console.log('   ✅ smart-vision-analyzer загружен успешно');
    results.smartVisionAnalyzer = true;
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 4: smart-object-detector.cjs
  try {
    console.log('📋 Тест 4: smart-object-detector.cjs');
    const detector = require('./server/smart-object-detector.cjs');
    console.log('   ✅ smart-object-detector загружен успешно');
    results.smartObjectDetector = true;
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 5: intelligent-chat-processor.cjs (краткий тест)
  try {
    console.log('📋 Тест 5: intelligent-chat-processor.cjs');
    const processor = require('./server/intelligent-chat-processor.cjs');
    console.log('   ✅ intelligent-chat-processor загружен успешно');
    results.intelligentChatProcessor = true;
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  console.log('\n🎯 Результаты тестирования:');
  const successful = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([module, success]) => {
    console.log(`   ${success ? '✅' : '❌'} ${module}`);
  });

  console.log(`\n📊 Успешность: ${successful}/${total} (${((successful/total)*100).toFixed(1)}%)`);
  
  if (successful === total) {
    console.log('🎉 Все модули загружаются без ошибок ES модулей!');
    return true;
  } else {
    console.log('⚠️ Некоторые модули все еще имеют проблемы с ES модулями');
    return false;
  }
}

// Запуск теста
testESModuleFix()
  .then(success => {
    if (success) {
      console.log('\n🚀 Исправление ES модулей завершено успешно!');
      process.exit(0);
    } else {
      console.log('\n💥 Требуется дополнительная работа');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Критическая ошибка:', error.message);
    process.exit(1);
  });