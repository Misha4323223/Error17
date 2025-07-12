/**
 * Advanced Image Analyzer - Динамическое расширение
 * Использует visual-semantic-extensions.cjs для анализа изображений
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

// Экспортируем анализатор с динамической инициализацией
export const analyzeImage = async (imageData) => {
  if (!visualSemanticExtensions) {
    const initialized = await initializeExtensions();
    if (!initialized) {
      throw new Error('Visual-Semantic Extensions не инициализированы');
    }
  }

  return await visualSemanticExtensions.advancedImageAnalyzer.analyzeImage(imageData);
};

export const analyzeImageFromUrl = async (imageUrl) => {
  if (!visualSemanticExtensions) {
    const initialized = await initializeExtensions();
    if (!initialized) {
      throw new Error('Visual-Semantic Extensions не инициализированы');
    }
  }

  return await visualSemanticExtensions.advancedImageAnalyzer.analyzeImage(imageUrl);
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
    const analysisResult = await analyzeImage(imageData, {
      conversationContext,
      includeSemanticContext: true
    });

    // Адаптируем результат для conversation engine
    return {
      visualAnalysis: analysisResult,
      conversationRelevant: true,
      semanticEnhancement: {
        visualElements: analysisResult.objects || [],
        colorAnalysis: analysisResult.color_analysis || {},
        composition: analysisResult.composition || {},
        style: analysisResult.style_analysis || {}
      }
    };
  } catch (error) {
    console.error('❌ Ошибка интеграции с conversation workflow:', error.message);
    return {
      visualAnalysis: null,
      conversationRelevant: false,
      error: error.message
    };
  }
};

// CommonJS экспорты для совместимости
module.exports = {
  analyzeImage,
  analyzeImageFromUrl,
  checkHealth,
  integrateWithConversation
};

// ES экспорты для обратной совместимости (через Object.defineProperty)
Object.defineProperty(module.exports, '__esModule', { value: true });
module.exports.default = module.exports;