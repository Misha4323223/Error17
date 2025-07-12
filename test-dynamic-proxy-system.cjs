#!/usr/bin/env node

/**
 * Тест системы динамического расширения Visual-Semantic Proxy
 * Проверяет работоспособность JS-мостиков к CJS расширениям
 */

console.log('🌉 Тестирование системы динамического расширения...\n');

async function testDynamicProxySystem() {
  const results = {
    proxy: false,
    advancedImageAnalyzer: false,
    smartVisionAnalyzer: false,
    smartObjectDetector: false,
    comprehensive: false
  };

  // Тест 1: Visual-Semantic Proxy
  try {
    console.log('📋 Тест 1: Visual-Semantic Proxy');
    const proxy = require('./server/visual-semantic-proxy.cjs');
    console.log('   ✅ Visual-Semantic Proxy загружен');
    results.proxy = true;
    
    // Проверяем методы
    console.log('   📋 Доступные методы:');
    console.log('   - getAdvancedImageAnalyzer:', typeof proxy.getAdvancedImageAnalyzer);
    console.log('   - getSmartVisionAnalyzer:', typeof proxy.getSmartVisionAnalyzer);
    console.log('   - getSmartObjectDetector:', typeof proxy.getSmartObjectDetector);
    console.log('   - analyzeVisualContent:', typeof proxy.analyzeVisualContent);
    console.log('   - checkHealth:', typeof proxy.checkHealth);
    
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 2: Advanced Image Analyzer через JS-мостик
  try {
    console.log('\n📋 Тест 2: Advanced Image Analyzer (JS Bridge)');
    const analyzer = require('./server/advanced-image-analyzer.js');
    console.log('   ✅ Advanced Image Analyzer загружен через JS-мостик');
    results.advancedImageAnalyzer = true;
    
    // Тестируем анализ
    const analysisResult = await analyzer.analyzeImage('test-image-data');
    console.log('   📊 Результат анализа:', analysisResult.status);
    console.log('   📊 Уверенность:', analysisResult.confidence);
    
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 3: Smart Vision Analyzer через JS-мостик
  try {
    console.log('\n📋 Тест 3: Smart Vision Analyzer (JS Bridge)');
    const analyzer = require('./server/smart-vision-analyzer.js');
    console.log('   ✅ Smart Vision Analyzer загружен через JS-мостик');
    results.smartVisionAnalyzer = true;
    
    // Тестируем анализ зрения
    const visionResult = await analyzer.analyzeVision('test-vision-data');
    console.log('   📊 Результат анализа зрения:', visionResult.confidence);
    console.log('   📊 Обнаружено лиц:', visionResult.faces?.faces_detected || 0);
    
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 4: Smart Object Detector через JS-мостик
  try {
    console.log('\n📋 Тест 4: Smart Object Detector (JS Bridge)');
    const detector = require('./server/smart-object-detector.js');
    console.log('   ✅ Smart Object Detector загружен через JS-мостик');
    results.smartObjectDetector = true;
    
    // Тестируем детекцию объектов
    const detectionResult = await detector.detectObjects('test-detection-data');
    console.log('   📊 Результат детекции:', detectionResult.confidence);
    console.log('   📊 Обнаружено объектов:', detectionResult.objects?.length || 0);
    
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Тест 5: Комплексный анализ через прокси
  try {
    console.log('\n📋 Тест 5: Комплексный анализ через прокси');
    const proxy = require('./server/visual-semantic-proxy.cjs');
    
    const comprehensiveResult = await proxy.analyzeVisualContent('test-comprehensive-data', 'comprehensive');
    console.log('   ✅ Комплексный анализ выполнен через прокси');
    console.log('   📊 Общий балл:', comprehensiveResult.comprehensive_score);
    console.log('   📊 Тип анализа:', comprehensiveResult.analysis_type);
    results.comprehensive = true;
    
  } catch (error) {
    console.log('   ❌ Ошибка:', error.message);
  }

  // Результаты
  console.log('\n🎯 Результаты тестирования:');
  const successful = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([module, success]) => {
    console.log(`   ${success ? '✅' : '❌'} ${module}`);
  });

  console.log(`\n📊 Успешность: ${successful}/${total} (${((successful/total)*100).toFixed(1)}%)`);
  
  if (successful === total) {
    console.log('🎉 Система динамического расширения работает идеально!');
    console.log('🌉 JS-мостики успешно перенаправляют все вызовы на CJS расширения');
    console.log('🔧 Проблема ES modules решена через динамическое расширение');
    return true;
  } else {
    console.log('⚠️ Некоторые компоненты требуют дополнительной настройки');
    return false;
  }
}

// Запуск теста
testDynamicProxySystem()
  .then(success => {
    if (success) {
      console.log('\n🚀 Динамическое расширение готово к использованию!');
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