
<old_str>/**
 * Smart Vision Analyzer - Динамическое расширение
 * Использует visual-semantic-extensions.cjs для анализа зрения
 */

// Д</old_str>
<new_str>/**
 * Smart Vision Analyzer - Унифицированный CommonJS подход
 * Интегрирован в conversation workflow
 */

// Унифицированный CommonJS подход
const visualSemanticExtensions = require('./semantic-memory/visual-semantic-extensions.cjs');

// Основные функции анализа зрения
const analyzeVision = async (imageData, options = {}) => {
  try {
    if (!visualSemanticExtensions) {
      throw new Error('Visual-Semantic Extensions не загружены');
    }
    
    return await visualSemanticExtensions.smartVisionAnalyzer.analyzeVision(imageData, options);
  } catch (error) {
    console.error('❌ Ошибка анализа зрения:', error.message);
    return {
      confidence: 0.1,
      faces: { faces_detected: 0 },
      emotions: { primary_emotion: 'unknown' },
      scene: { scene_type: 'unknown' },
      error: error.message
    };
  }
};

const checkHealth = () => {
  try {
    if (!visualSemanticExtensions) {
      return { healthy: false, error: 'Extensions не инициализированы' };
    }
    
    return visualSemanticExtensions.checkHealth();
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Интеграция с conversation workflow
const integrateWithConversation = async (imageData, conversationContext = {}) => {
  try {
    const visionResult = await analyzeVision(imageData, {
      conversationContext,
      includeSemanticContext: true
    });
    
    // Адаптируем для conversation engine
    return {
      visionAnalysis: visionResult,
      conversationRelevant: true,
      emotionalContext: visionResult.emotions || {},
      faceAnalysis: visionResult.faces || {},
      sceneAnalysis: visionResult.scene || {}
    };
  } catch (error) {
    console.error('❌ Ошибка интеграции vision analyzer с conversation workflow:', error.message);
    return {
      visionAnalysis: null,
      conversationRelevant: false,
      error: error.message
    };
  }
};

// CommonJS экспорты
module.exports = {
  analyzeVision,
  checkHealth,
  integrateWithConversation
};

// ES совместимость
Object.defineProperty(module.exports, '__esModule', { value: true });
module.exports.default = module.exports;</new_str>
