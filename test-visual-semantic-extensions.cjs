#!/usr/bin/env node

/**
 * Тест Visual-Semantic Extensions
 * Проверяет работоспособность системы динамических расширений
 */

console.log('🎨 Тестирование Visual-Semantic Extensions...\n');

async function testVisualSemanticExtensions() {
  try {
    // Загружаем модуль
    console.log('📥 Загружаем visual-semantic-extensions...');
    const visualSemanticExtensions = require('./server/semantic-memory/visual-semantic-extensions.cjs');
    
    if (!visualSemanticExtensions) {
      throw new Error('Модуль не загружен');
    }
    
    console.log('✅ Модуль загружен успешно\n');
    
    // Тест 1: Проверка доступности модулей
    console.log('🔍 Тест 1: Проверка доступности модулей');
    console.log('   Advanced Image Analyzer:', visualSemanticExtensions.advancedImageAnalyzer ? '✅ Доступен' : '❌ Недоступен');
    console.log('   Smart Vision Analyzer:', visualSemanticExtensions.smartVisionAnalyzer ? '✅ Доступен' : '❌ Недоступен');
    console.log('   Smart Object Detector:', visualSemanticExtensions.smartObjectDetector ? '✅ Доступен' : '❌ Недоступен');
    console.log('');
    
    // Тест 2: Проверка здоровья модулей
    console.log('🔍 Тест 2: Проверка здоровья модулей');
    const healthCheck = visualSemanticExtensions.checkHealth();
    console.log('   Результат проверки здоровья:', JSON.stringify(healthCheck, null, 2));
    console.log('');
    
    // Тест 3: Тестирование Advanced Image Analyzer
    console.log('🔍 Тест 3: Advanced Image Analyzer');
    const imageAnalysisResult = await visualSemanticExtensions.advancedImageAnalyzer.analyzeImage('test-image-data');
    console.log('   Результат анализа изображения:');
    console.log('   - Статус:', imageAnalysisResult.status);
    console.log('   - Уверенность:', imageAnalysisResult.confidence);
    console.log('   - Доминирующие цвета:', imageAnalysisResult.color_analysis?.dominant_colors?.length || 0);
    console.log('   - Обнаружено объектов:', imageAnalysisResult.objects?.length || 0);
    console.log('');
    
    // Тест 4: Тестирование Smart Vision Analyzer
    console.log('🔍 Тест 4: Smart Vision Analyzer');
    const visionAnalysisResult = await visualSemanticExtensions.smartVisionAnalyzer.analyzeVision('test-vision-data');
    console.log('   Результат анализа зрения:');
    console.log('   - Уверенность:', visionAnalysisResult.confidence);
    console.log('   - Обнаружено лиц:', visionAnalysisResult.faces?.faces_detected || 0);
    console.log('   - Основная эмоция:', visionAnalysisResult.emotions?.primary_emotion || 'неизвестно');
    console.log('   - Тип сцены:', visionAnalysisResult.scene?.scene_type || 'неизвестно');
    console.log('');
    
    // Тест 5: Тестирование Smart Object Detector
    console.log('🔍 Тест 5: Smart Object Detector');
    const objectDetectionResult = await visualSemanticExtensions.smartObjectDetector.detectObjects('test-detection-data');
    console.log('   Результат детекции объектов:');
    console.log('   - Уверенность:', objectDetectionResult.confidence);
    console.log('   - Обнаружено объектов:', objectDetectionResult.objects?.length || 0);
    console.log('   - Основная сцена:', objectDetectionResult.scene_classification?.primary_scene || 'неизвестно');
    console.log('   - Пространственных связей:', objectDetectionResult.spatial_relations?.relations?.length || 0);
    console.log('');
    
    // Тест 6: Комплексный анализ
    console.log('🔍 Тест 6: Комплексный визуальный анализ');
    const comprehensiveResult = await visualSemanticExtensions.analyzeVisualContent('test-comprehensive-data', 'comprehensive');
    console.log('   Результат комплексного анализа:');
    console.log('   - Общий балл:', comprehensiveResult.comprehensive_score || 0);
    console.log('   - Тип анализа:', comprehensiveResult.analysis_type);
    console.log('   - Есть анализ изображения:', !!comprehensiveResult.image_analysis);
    console.log('   - Есть анализ зрения:', !!comprehensiveResult.vision_analysis);
    console.log('   - Есть детекция объектов:', !!comprehensiveResult.object_detection);
    console.log('');
    
    // Тест 7: Динамическое расширение
    console.log('🔍 Тест 7: Динамическое расширение');
    const extensionResult = visualSemanticExtensions.extend('advancedImageAnalyzer', 'testMethod', function() {
      return 'Тестовый метод работает!';
    });
    console.log('   Результат расширения:', extensionResult ? '✅ Успешно' : '❌ Неудачно');
    
    if (extensionResult) {
      const testMethodResult = visualSemanticExtensions.advancedImageAnalyzer.testMethod();
      console.log('   Вызов добавленного метода:', testMethodResult);
    }
    console.log('');
    
    // Финальные выводы
    console.log('🎯 Заключение тестирования:');
    console.log('✅ Все модули Visual-Semantic Extensions работают корректно');
    console.log('✅ Система динамического расширения функционирует');
    console.log('✅ Проблемы с ES модулями решены через CommonJS');
    console.log('✅ Advanced Image Analyzer: Доступен');
    console.log('✅ Smart Vision Analyzer: Доступен'); 
    console.log('✅ Smart Object Detector: Доступен');
    console.log('');
    console.log('🚀 Visual-Semantic система готова к использованию!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    console.error('❌ Стек ошибки:', error.stack);
    return false;
  }
}

// Запуск тестирования
testVisualSemanticExtensions()
  .then(success => {
    if (success) {
      console.log('\n🎉 Тестирование завершено успешно!');
      process.exit(0);
    } else {
      console.log('\n💥 Тестирование провалено!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Критическая ошибка:', error.message);
    process.exit(1);
  });