/**
 * Visual-Semantic Proxy - Динамическое расширение
 * Перенаправляет все обращения к .js файлам visual-semantic анализаторов
 * на централизованную систему расширений
 */

const visualSemanticExtensions = require('./semantic-memory/visual-semantic-extensions.cjs');

/**
 * Прокси для advanced-image-analyzer.js
 * Использует advancedImageAnalyzer из visual-semantic-extensions
 */
const advancedImageAnalyzer = {
  analyzeImage: async (imageData) => {
    return await visualSemanticExtensions.advancedImageAnalyzer.analyzeImage(imageData);
  },
  
  analyzeImageFromUrl: async (imageUrl) => {
    return await visualSemanticExtensions.advancedImageAnalyzer.analyzeImage(imageUrl);
  },
  
  // Дополнительные методы для совместимости
  checkHealth: () => {
    return visualSemanticExtensions.advancedImageAnalyzer.checkHealth();
  }
};

/**
 * Прокси для smart-vision-analyzer.js
 * Использует smartVisionAnalyzer из visual-semantic-extensions
 */
const smartVisionAnalyzer = {
  analyzeVision: async (imageData) => {
    return await visualSemanticExtensions.smartVisionAnalyzer.analyzeVision(imageData);
  },
  
  analyzeImageContent: async (imageData) => {
    return await visualSemanticExtensions.smartVisionAnalyzer.analyzeVision(imageData);
  },
  
  // Дополнительные методы для совместимости
  checkHealth: () => {
    return visualSemanticExtensions.smartVisionAnalyzer.checkHealth();
  }
};

/**
 * Прокси для smart-object-detector.js
 * Использует smartObjectDetector из visual-semantic-extensions
 */
const smartObjectDetector = {
  detectObjects: async (imageData) => {
    return await visualSemanticExtensions.smartObjectDetector.detectObjects(imageData);
  },
  
  detectAndAnalyze: async (imageData) => {
    return await visualSemanticExtensions.smartObjectDetector.detectObjects(imageData);
  },
  
  // Дополнительные методы для совместимости
  checkHealth: () => {
    return visualSemanticExtensions.smartObjectDetector.checkHealth();
  }
};

// Экспортируем прокси-объекты
module.exports = {
  advancedImageAnalyzer,
  smartVisionAnalyzer,
  smartObjectDetector,
  
  // Методы для получения отдельных анализаторов
  getAdvancedImageAnalyzer: () => advancedImageAnalyzer,
  getSmartVisionAnalyzer: () => smartVisionAnalyzer,
  getSmartObjectDetector: () => smartObjectDetector,
  
  // Комплексный анализ
  analyzeVisualContent: async (imageData, analysisType = 'comprehensive') => {
    return await visualSemanticExtensions.analyzeVisualContent(imageData, analysisType);
  },
  
  // Проверка здоровья всех модулей
  checkHealth: () => {
    return visualSemanticExtensions.checkHealth();
  }
};