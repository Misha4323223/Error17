/**
 * Smart Object Detector - Динамическое расширение
 * Использует visual-semantic-extensions.cjs для детекции объектов
 */

// Динамический импорт для решения проблемы ES modules
let visualSemanticExtensions;

async function initializeExtensions() {
  try {
    visualSemanticExtensions = await import('./semantic-memory/visual-semantic-extensions.cjs');
    return true;
  } catch (error) {
    console.log('⚠️ Visual-Semantic Extensions недоступны:', error.message);
    return false;
  }
}

// Экспортируем детектор с динамической инициализацией
export const detectObjects = async (imageData) => {
  if (!visualSemanticExtensions) {
    const initialized = await initializeExtensions();
    if (!initialized) {
      throw new Error('Visual-Semantic Extensions не инициализированы');
    }
  }

  return await visualSemanticExtensions.smartObjectDetector.detectObjects(imageData);
};

export const detectAndAnalyze = async (imageData) => {
  if (!visualSemanticExtensions) {
    const initialized = await initializeExtensions();
    if (!initialized) {
      throw new Error('Visual-Semantic Extensions не инициализированы');
    }
  }

  return await visualSemanticExtensions.smartObjectDetector.detectObjects(imageData);
};

export const checkHealth = async () => {
  if (!visualSemanticExtensions) {
    const initialized = await initializeExtensions();
    if (!initialized) {
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
    const detectionResult = await detectAndAnalyze(imageData, {
      conversationContext,
      includeSemanticContext: true
    });

    // Адаптируем для conversation engine
    return {
      objectDetection: detectionResult,
      conversationRelevant: true,
      semanticObjects: detectionResult.objects?.map(obj => ({
        name: obj.name || obj.class,
        confidence: obj.confidence || 0.5,
        location: obj.bbox || obj.location,
        semanticRole: obj.semantic_role || 'object'
      })) || [],
      sceneContext: detectionResult.sceneClassification || {}
    };
  } catch (error) {
    console.error('❌ Ошибка интеграции детектора с conversation workflow:', error.message);
    return {
      objectDetection: null,
      conversationRelevant: false,
      error: error.message
    };
  }
};

// CommonJS экспорты
module.exports = {
  detectObjects,
  detectAndAnalyze,
  checkHealth,
  integrateWithConversation
};

// ES совместимость
Object.defineProperty(module.exports, '__esModule', { value: true });
module.exports.default = module.exports;