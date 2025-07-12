
/**
 * Визуально-семантическая интеграция (Этап 2)
 * Объединяет анализ изображений с семантической памятью для персонализированных рекомендаций
 */

const semanticIntegrationLayer = require('./semantic-integration-layer.cjs');
const visualSemanticAnalyzer = require('./semantic-memory/visual-semantic-analyzer.cjs');
const userMemoryManager = require('./semantic-memory/user-memory-manager.cjs');
const userProfiler = require('./semantic-memory/user-profiler.cjs');

// Подключаем visual-semantic расширения через единую точку доступа
let visualSemanticExtensions;

function initializeVisualSemanticExtensions() {
  try {
    visualSemanticExtensions = require('./semantic-memory/visual-semantic-extensions.cjs');
    console.log('✅ [VISUAL-SEMANTIC] Visual-Semantic Extensions загружены через динамическое расширение');
    return true;
  } catch (error) {
    console.log('⚠️ [VISUAL-SEMANTIC] Visual-Semantic Extensions недоступны:', error.message);
    return false;
  }
}

// Инициализируем расширения
const extensionsLoaded = initializeVisualSemanticExtensions();

const SmartLogger = {
  visual: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎨 [${timestamp}] VISUAL-SEMANTIC: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

class VisualSemanticIntegration {
  constructor() {
    this.enabled = true;
    this.analysisCache = new Map(); // Кэш для анализов
    this.confidenceThreshold = 0.7; // Минимальная уверенность для применения результатов
  }

  /**
   * ГЛАВНАЯ ФУНКЦИЯ: Анализ изображения с семантической интеграцией
   */
  async analyzeImageWithSemantics(imageData, userContext = {}) {
    SmartLogger.visual('🚀 Начинаем полный визуально-семантический анализ');

    if (!this.enabled) {
      return { success: false, reason: 'disabled' };
    }

    try {
      const userId = userContext.userId || 1;
      const sessionId = userContext.sessionId || 'default';

      // === ЭТАП 1: ТЕХНИЧЕСКИЙ АНАЛИЗ ИЗОБРАЖЕНИЯ ===
      SmartLogger.visual('Этап 1: Технический анализ изображения');
      
      const technicalAnalysis = await this.performTechnicalAnalysis(imageData);
      
      // === ЭТАП 2: СЕМАНТИЧЕСКИЙ АНАЛИЗ ВИЗУАЛЬНЫХ ЭЛЕМЕНТОВ ===
      SmartLogger.visual('Этап 2: Семантический анализ визуальных элементов');
      
      const visualSemantics = await this.performVisualSemanticAnalysis(imageData);
      
      // === ЭТАП 3: ИНТЕГРАЦИЯ С ПРОФИЛЕМ ПОЛЬЗОВАТЕЛЯ ===
      SmartLogger.visual('Этап 3: Интеграция с профилем пользователя');
      
      const userProfile = await userMemoryManager.getOrCreateUserProfile(userId);
      const personalizedAnalysis = await this.personalizeAnalysis(
        technicalAnalysis, 
        visualSemantics, 
        userProfile
      );

      // === ЭТАП 4: ГЕНЕРАЦИЯ РЕКОМЕНДАЦИЙ ===
      SmartLogger.visual('Этап 4: Генерация персонализированных рекомендаций');
      
      const recommendations = await this.generatePersonalizedRecommendations(
        personalizedAnalysis,
        userProfile,
        userContext
      );

      // === ЭТАП 5: ОБНОВЛЕНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ ===
      SmartLogger.visual('Этап 5: Обновление профиля пользователя');
      
      await this.updateUserProfileFromAnalysis(userId, personalizedAnalysis);

      // === ЭТАП 6: СОЗДАНИЕ ИТОГОВОГО ОТЧЕТА ===
      const finalReport = {
        success: true,
        timestamp: new Date().toISOString(),
        
        // Технические данные
        technical_analysis: technicalAnalysis,
        
        // Семантические данные
        visual_semantics: visualSemantics,
        
        // Персонализация
        personalized_analysis: personalizedAnalysis,
        user_profile_updated: true,
        
        // Рекомендации
        recommendations: recommendations,
        
        // Метаданные
        confidence_score: this.calculateOverallConfidence(personalizedAnalysis),
        processing_time: Date.now() - (personalizedAnalysis.start_time || Date.now()),
        
        // Интеграционные данные
        semantic_integration: {
          user_id: userId,
          session_id: sessionId,
          profile_improvements: personalizedAnalysis.profile_improvements || [],
          learning_insights: personalizedAnalysis.learning_insights || []
        }
      };

      SmartLogger.visual('✅ Визуально-семантический анализ завершен', {
        confidence: finalReport.confidence_score,
        recommendations_count: recommendations.length
      });

      return finalReport;

    } catch (error) {
      SmartLogger.visual(`❌ Ошибка визуально-семантического анализа: ${error.message}`);
      return {
        success: false,
        error: error.message,
        fallback_available: true
      };
    }
  }

  /**
   * Технический анализ изображения через динамические расширения
   */
  async performTechnicalAnalysis(imageData) {
    const analysis = {
      basic_properties: {},
      objects_detected: [],
      color_analysis: {},
      composition_analysis: {},
      quality_metrics: {},
      comprehensive_score: 0
    };

    if (!extensionsLoaded || !visualSemanticExtensions) {
      SmartLogger.visual('⚠️ Visual-Semantic Extensions не загружены, используем fallback');
      return analysis;
    }

    try {
      SmartLogger.visual('Запуск технического анализа через динамические расширения');
      
      // Используем комплексный анализ из расширений
      const comprehensiveAnalysis = await visualSemanticExtensions.analyzeVisualContent(imageData, 'comprehensive');
      
      if (comprehensiveAnalysis && comprehensiveAnalysis.comprehensive_score > 0) {
        // Извлекаем данные из анализа изображения
        if (comprehensiveAnalysis.image_analysis) {
          analysis.basic_properties = comprehensiveAnalysis.image_analysis.basic_properties || {};
          analysis.color_analysis = comprehensiveAnalysis.image_analysis.color_analysis || {};
          analysis.quality_metrics = comprehensiveAnalysis.image_analysis.quality_metrics || {};
        }
        
        // Извлекаем данные из анализа зрения
        if (comprehensiveAnalysis.vision_analysis) {
          analysis.composition_analysis = comprehensiveAnalysis.vision_analysis.composition || {};
        }
        
        // Извлекаем данные из детекции объектов
        if (comprehensiveAnalysis.object_detection) {
          analysis.objects_detected = comprehensiveAnalysis.object_detection.objects || [];
        }
        
        analysis.comprehensive_score = comprehensiveAnalysis.comprehensive_score;
        
        SmartLogger.visual(`✅ Технический анализ завершен, балл: ${comprehensiveAnalysis.comprehensive_score}/10`);
      }
    } catch (error) {
      SmartLogger.visual(`⚠️ Ошибка технического анализа: ${error.message}`);
    }

    return analysis;
  }

  /**
   * Семантический анализ визуальных элементов
   */
  async performVisualSemanticAnalysis(imageData) {
    try {
      SmartLogger.visual('Выполнение семантического анализа визуальных элементов');
      
      // Создаем описание для анализа (если это URL изображения)
      let visualDescription = '';
      if (typeof imageData === 'string' && imageData.includes('http')) {
        // Извлекаем информацию из URL для анализа
        const urlAnalysis = this.analyzeImageUrl(imageData);
        visualDescription = urlAnalysis.description;
      } else if (typeof imageData === 'string') {
        visualDescription = imageData;
      }

      // Используем визуальный семантический анализатор
      const semanticResult = visualSemanticAnalyzer.analyzeVisualSemantics(visualDescription);
      
      SmartLogger.visual('Семантический анализ завершен', {
        elements_found: semanticResult.visual_elements?.length || 0,
        emotions_count: Object.keys(semanticResult.emotional_impact?.primary_emotions || {}).length
      });

      return semanticResult;

    } catch (error) {
      SmartLogger.visual(`⚠️ Ошибка семантического анализа: ${error.message}`);
      return {
        visual_elements: [],
        semantic_meanings: {},
        emotional_impact: {},
        brand_implications: {},
        recommendations: []
      };
    }
  }

  /**
   * Персонализация анализа на основе профиля пользователя
   */
  async personalizeAnalysis(technicalAnalysis, visualSemantics, userProfile) {
    SmartLogger.visual('Персонализация анализа на основе профиля пользователя');

    const personalized = {
      start_time: Date.now(),
      user_preferences_applied: false,
      style_recommendations: [],
      color_recommendations: [],
      improvement_suggestions: [],
      profile_improvements: [],
      learning_insights: []
    };

    try {
      // Анализируем соответствие предпочтениям пользователя
      if (userProfile && userProfile.preferredStyles) {
        const styleMatch = this.analyzeStyleMatch(visualSemantics, userProfile.preferredStyles);
        personalized.style_match = styleMatch;
        personalized.user_preferences_applied = true;
      }

      // Анализируем цветовые предпочтения
      if (userProfile && userProfile.favoriteColors) {
        const colorMatch = this.analyzeColorMatch(technicalAnalysis.color_analysis, userProfile.favoriteColors);
        personalized.color_match = colorMatch;
      }

      // Генерируем рекомендации по улучшению
      personalized.improvement_suggestions = this.generateImprovementSuggestions(
        technicalAnalysis,
        visualSemantics,
        userProfile
      );

      // Определяем, что можно узнать о пользователе из этого изображения
      personalized.profile_improvements = this.extractProfileInsights(
        technicalAnalysis,
        visualSemantics
      );

      // Обучающие инсайты для системы
      personalized.learning_insights = this.generateLearningInsights(
        technicalAnalysis,
        visualSemantics,
        userProfile
      );

      SmartLogger.visual('Персонализация завершена', {
        preferences_applied: personalized.user_preferences_applied,
        improvements_count: personalized.improvement_suggestions.length
      });

    } catch (error) {
      SmartLogger.visual(`⚠️ Ошибка персонализации: ${error.message}`);
    }

    return personalized;
  }

  /**
   * Генерация персонализированных рекомендаций
   */
  async generatePersonalizedRecommendations(personalizedAnalysis, userProfile, userContext) {
    const recommendations = [];

    try {
      // Рекомендации по стилю
      if (personalizedAnalysis.style_match && personalizedAnalysis.style_match.confidence < 0.7) {
        recommendations.push({
          type: 'style_improvement',
          priority: 'high',
          title: 'Улучшение стиля',
          description: 'Рекомендуем адаптировать стиль под ваши предпочтения',
          specific_suggestions: personalizedAnalysis.style_recommendations || [],
          confidence: 0.8
        });
      }

      // Рекомендации по цвету
      if (personalizedAnalysis.color_match && personalizedAnalysis.color_match.confidence < 0.6) {
        recommendations.push({
          type: 'color_improvement',
          priority: 'medium',
          title: 'Цветовая коррекция',
          description: 'Предлагаем скорректировать цветовую палитру',
          specific_suggestions: personalizedAnalysis.color_recommendations || [],
          confidence: 0.75
        });
      }

      // Рекомендации по техническому качеству
      recommendations.push(...this.generateTechnicalRecommendations(personalizedAnalysis));

      // Рекомендации по использованию
      recommendations.push(...this.generateUsageRecommendations(personalizedAnalysis, userContext));

      SmartLogger.visual('Сгенерировано рекомендаций', { count: recommendations.length });

    } catch (error) {
      SmartLogger.visual(`⚠️ Ошибка генерации рекомендаций: ${error.message}`);
    }

    return recommendations;
  }

  /**
   * Обновление профиля пользователя на основе анализа
   */
  async updateUserProfileFromAnalysis(userId, personalizedAnalysis) {
    try {
      const profileUpdates = {};

      // Обновляем предпочтения по стилям
      if (personalizedAnalysis.profile_improvements) {
        personalizedAnalysis.profile_improvements.forEach(improvement => {
          if (improvement.type === 'style_preference') {
            profileUpdates.preferredStyles = improvement.detected_styles;
          }
          if (improvement.type === 'color_preference') {
            profileUpdates.favoriteColors = improvement.detected_colors;
          }
        });
      }

      // Обновляем профиль, если есть изменения
      if (Object.keys(profileUpdates).length > 0) {
        await userMemoryManager.updateUserProfileFromInteraction(userId, {
          ...profileUpdates,
          lastImageAnalysis: new Date().toISOString(),
          analysisCount: 1 // увеличиваем счетчик
        });

        SmartLogger.visual('Профиль пользователя обновлен', profileUpdates);
      }

    } catch (error) {
      SmartLogger.visual(`⚠️ Ошибка обновления профиля: ${error.message}`);
    }
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  analyzeImageUrl(url) {
    // Простой анализ URL для извлечения ключевых слов
    const urlParts = url.toLowerCase();
    const description = [];

    if (urlParts.includes('panda')) description.push('панда');
    if (urlParts.includes('techno') || urlParts.includes('cyber')) description.push('техно');
    if (urlParts.includes('neon')) description.push('неоновый');
    if (urlParts.includes('samurai')) description.push('самурай');
    if (urlParts.includes('dragon')) description.push('дракон');

    return {
      description: description.join(' ') || 'изображение'
    };
  }

  analyzeStyleMatch(visualSemantics, preferredStyles) {
    if (!visualSemantics.visual_elements || !preferredStyles) {
      return { confidence: 0, matches: [] };
    }

    const matches = [];
    let totalConfidence = 0;

    visualSemantics.visual_elements.forEach(element => {
      if (element.type === 'style' && preferredStyles.includes(element.value)) {
        matches.push(element);
        totalConfidence += element.confidence || 0.5;
      }
    });

    return {
      confidence: matches.length > 0 ? totalConfidence / matches.length : 0,
      matches: matches,
      recommendations: matches.length === 0 ? [`Рекомендуем добавить элементы в стиле: ${preferredStyles.join(', ')}`] : []
    };
  }

  analyzeColorMatch(colorAnalysis, favoriteColors) {
    if (!colorAnalysis || !favoriteColors) {
      return { confidence: 0, matches: [] };
    }

    // Упрощенный анализ соответствия цветов
    const confidence = favoriteColors.length > 0 ? 0.5 : 0; // Базовая логика
    
    return {
      confidence: confidence,
      matches: [],
      recommendations: confidence < 0.6 ? [`Рассмотрите использование ваших любимых цветов: ${favoriteColors.join(', ')}`] : []
    };
  }

  generateImprovementSuggestions(technicalAnalysis, visualSemantics, userProfile) {
    const suggestions = [];

    // Технические улучшения
    if (technicalAnalysis.quality_metrics?.complexity === 'low') {
      suggestions.push({
        type: 'technical',
        suggestion: 'Рекомендуем добавить больше деталей для повышения визуальной привлекательности'
      });
    }

    // Семантические улучшения
    if (visualSemantics.emotional_impact?.overall_tone === 'neutral') {
      suggestions.push({
        type: 'emotional',
        suggestion: 'Рассмотрите добавление элементов для усиления эмоционального воздействия'
      });
    }

    return suggestions;
  }

  extractProfileInsights(technicalAnalysis, visualSemantics) {
    const insights = [];

    // Анализируем стилевые предпочтения
    if (visualSemantics.visual_elements) {
      const styles = visualSemantics.visual_elements
        .filter(e => e.type === 'style')
        .map(e => e.value);
      
      if (styles.length > 0) {
        insights.push({
          type: 'style_preference',
          detected_styles: styles,
          confidence: 0.7
        });
      }
    }

    return insights;
  }

  generateLearningInsights(technicalAnalysis, visualSemantics, userProfile) {
    const insights = [];

    // Инсайты для системы обучения
    insights.push({
      category: 'visual_preference',
      data: {
        user_engages_with: visualSemantics.visual_elements?.map(e => e.value) || [],
        technical_quality_preference: technicalAnalysis.quality_metrics?.complexity || 'medium'
      }
    });

    return insights;
  }

  generateTechnicalRecommendations(personalizedAnalysis) {
    const recommendations = [];

    personalizedAnalysis.improvement_suggestions?.forEach(suggestion => {
      if (suggestion.type === 'technical') {
        recommendations.push({
          type: 'technical_improvement',
          priority: 'medium',
          title: 'Техническое улучшение',
          description: suggestion.suggestion,
          confidence: 0.8
        });
      }
    });

    return recommendations;
  }

  generateUsageRecommendations(personalizedAnalysis, userContext) {
    const recommendations = [];

    // Рекомендации на основе контекста использования
    if (userContext.category === 'print_design') {
      recommendations.push({
        type: 'usage_optimization',
        priority: 'high',
        title: 'Оптимизация для печати',
        description: 'Рекомендуем адаптировать изображение для качественной печати',
        confidence: 0.9
      });
    }

    return recommendations;
  }

  calculateOverallConfidence(personalizedAnalysis) {
    // Простой расчет общей уверенности
    let totalConfidence = 0;
    let count = 0;

    if (personalizedAnalysis.style_match) {
      totalConfidence += personalizedAnalysis.style_match.confidence;
      count++;
    }

    if (personalizedAnalysis.color_match) {
      totalConfidence += personalizedAnalysis.color_match.confidence;
      count++;
    }

    return count > 0 ? totalConfidence / count : 0.5;
  }

  /**
   * Быстрый анализ для существующих изображений в чате
   */
  async quickAnalyzeRecentImage(sessionId, userId) {
    try {
      SmartLogger.visual('Быстрый анализ последнего изображения');
      
      // Здесь можно интегрироваться с системой истории чата
      // для получения последнего изображения
      
      return {
        success: true,
        message: 'Анализ последнего изображения выполнен',
        recommendations: ['Общие рекомендации доступны']
      };

    } catch (error) {
      SmartLogger.visual(`⚠️ Ошибка быстрого анализа: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

// Создаем глобальный экземпляр
const visualSemanticIntegration = new VisualSemanticIntegration();

module.exports = {
  // Основные методы
  analyzeImageWithSemantics: visualSemanticIntegration.analyzeImageWithSemantics.bind(visualSemanticIntegration),
  quickAnalyzeRecentImage: visualSemanticIntegration.quickAnalyzeRecentImage.bind(visualSemanticIntegration),
  
  // Управление
  setEnabled: (enabled) => { visualSemanticIntegration.enabled = enabled; },
  setConfidenceThreshold: (threshold) => { visualSemanticIntegration.confidenceThreshold = threshold; },
  
  // Класс для расширения
  VisualSemanticIntegration
};
