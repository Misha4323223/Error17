
/**
 * Система визуальной семантики (Фаза 2)
 * Анализирует визуальные элементы и их семантическое значение
 */

const SmartLogger = {
  visual: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎨 [${timestamp}] VISUAL SEMANTICS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

class VisualSemanticAnalyzer {
  constructor() {
    this.initializeVisualSemantics();
  }

  /**
   * Инициализация визуальных семантических правил
   */
  initializeVisualSemantics() {
    // Визуальные концепции и их семантические связи
    this.visualConcepts = {
      color_semantics: {
        red: {
          emotions: ['passion', 'energy', 'danger', 'love'],
          contexts: ['warning', 'emphasis', 'brand_power'],
          associations: ['fire', 'blood', 'roses', 'power'],
          cultural_meanings: { 
            western: 'passion', 
            eastern: 'luck', 
            universal: 'attention' 
          }
        },
        blue: {
          emotions: ['calm', 'trust', 'sadness', 'peace'],
          contexts: ['corporate', 'medical', 'technology'],
          associations: ['sky', 'water', 'stability', 'professionalism'],
          cultural_meanings: { 
            western: 'trust', 
            eastern: 'healing', 
            universal: 'reliability' 
          }
        },
        green: {
          emotions: ['nature', 'growth', 'harmony', 'freshness'],
          contexts: ['environmental', 'health', 'money'],
          associations: ['plants', 'renewal', 'prosperity'],
          cultural_meanings: { 
            western: 'nature', 
            eastern: 'prosperity', 
            universal: 'growth' 
          }
        }
      },

      shape_semantics: {
        circle: {
          meanings: ['unity', 'completeness', 'infinity', 'protection'],
          psychological: ['harmony', 'wholeness', 'community'],
          brand_usage: ['inclusive', 'eternal', 'cycle']
        },
        square: {
          meanings: ['stability', 'order', 'reliability', 'structure'],
          psychological: ['security', 'foundation', 'tradition'],
          brand_usage: ['corporate', 'established', 'solid']
        },
        triangle: {
          meanings: ['direction', 'progress', 'hierarchy', 'dynamic'],
          psychological: ['movement', 'achievement', 'focus'],
          brand_usage: ['innovative', 'forward', 'aspirational']
        }
      },

      composition_semantics: {
        symmetrical: {
          feelings: ['balance', 'formal', 'traditional', 'stable'],
          use_cases: ['corporate', 'institutional', 'classical']
        },
        asymmetrical: {
          feelings: ['dynamic', 'modern', 'creative', 'energetic'],
          use_cases: ['artistic', 'innovative', 'contemporary']
        },
        centered: {
          feelings: ['focus', 'importance', 'unity', 'prominence'],
          use_cases: ['logos', 'hero_elements', 'focal_points']
        }
      },

      style_semantics: {
        minimalist: {
          values: ['simplicity', 'clarity', 'sophistication', 'modern'],
          emotions: ['calm', 'focused', 'premium', 'clean'],
          brand_archetypes: ['luxury', 'tech', 'professional']
        },
        vintage: {
          values: ['nostalgia', 'authenticity', 'craftsmanship', 'heritage'],
          emotions: ['warm', 'trusted', 'established', 'unique'],
          brand_archetypes: ['artisan', 'traditional', 'authentic']
        },
        futuristic: {
          values: ['innovation', 'technology', 'progress', 'cutting_edge'],
          emotions: ['excitement', 'possibility', 'advanced', 'modern'],
          brand_archetypes: ['tech', 'startup', 'revolutionary']
        }
      }
    };

    // Семантические связи между элементами
    this.semanticConnections = {
      complementary_concepts: [
        ['minimalist', 'blue', 'circle', 'trust'],
        ['vintage', 'brown', 'square', 'tradition'],
        ['futuristic', 'silver', 'triangle', 'innovation']
      ],
      conflicting_concepts: [
        ['vintage', 'futuristic'],
        ['minimalist', 'complex'],
        ['formal', 'playful']
      ]
    };
  }

  /**
   * Анализ визуальной семантики изображения/дизайна
   */
  analyzeVisualSemantics(visualData) {
    SmartLogger.visual('Анализирую визуальную семантику', { dataType: typeof visualData });

    const analysis = {
      visual_elements: this.extractVisualElements(visualData),
      semantic_meanings: {},
      emotional_impact: {},
      brand_implications: {},
      cultural_context: {},
      recommendations: []
    };

    // Анализируем каждый визуальный элемент
    analysis.visual_elements.forEach(element => {
      const semantics = this.getElementSemantics(element);
      analysis.semantic_meanings[element.type] = semantics;
    });

    // Оцениваем эмоциональное воздействие
    analysis.emotional_impact = this.calculateEmotionalImpact(analysis.visual_elements);

    // Анализируем брендинговые импликации
    analysis.brand_implications = this.analyzeBrandImplications(analysis.visual_elements);

    // Культурный контекст
    analysis.cultural_context = this.analyzeCulturalContext(analysis.visual_elements);

    // Генерируем рекомендации
    analysis.recommendations = this.generateVisualRecommendations(analysis);

    SmartLogger.visual('Анализ визуальной семантики завершен', {
      elements_count: analysis.visual_elements.length,
      meanings_count: Object.keys(analysis.semantic_meanings).length
    });

    return analysis;
  }

  /**
   * Извлечение визуальных элементов из данных
   */
  extractVisualElements(visualData) {
    const elements = [];

    // Если это описание или промпт изображения
    if (typeof visualData === 'string') {
      const text = visualData.toLowerCase();
      
      // Извлекаем цвета
      Object.keys(this.visualConcepts.color_semantics).forEach(color => {
        if (text.includes(color) || text.includes(this.getColorSynonyms(color))) {
          elements.push({
            type: 'color',
            value: color,
            confidence: 0.8
          });
        }
      });

      // Извлекаем формы
      Object.keys(this.visualConcepts.shape_semantics).forEach(shape => {
        if (text.includes(shape) || text.includes(this.getShapeSynonyms(shape))) {
          elements.push({
            type: 'shape',
            value: shape,
            confidence: 0.7
          });
        }
      });

      // Извлекаем стили
      Object.keys(this.visualConcepts.style_semantics).forEach(style => {
        if (text.includes(style) || text.includes(this.getStyleSynonyms(style))) {
          elements.push({
            type: 'style',
            value: style,
            confidence: 0.9
          });
        }
      });
    }

    return elements;
  }

  /**
   * Получение семантики элемента
   */
  getElementSemantics(element) {
    const conceptCategory = `${element.type}_semantics`;
    const concept = this.visualConcepts[conceptCategory]?.[element.value];
    
    if (!concept) return { meanings: [], confidence: 0 };

    return {
      meanings: concept.meanings || concept.emotions || concept.values || [],
      psychological: concept.psychological || [],
      cultural: concept.cultural_meanings || {},
      confidence: element.confidence || 0.5
    };
  }

  /**
   * Расчет эмоционального воздействия
   */
  calculateEmotionalImpact(visualElements) {
    const emotions = {};
    let totalWeight = 0;

    visualElements.forEach(element => {
      const semantics = this.getElementSemantics(element);
      const weight = element.confidence || 0.5;
      
      semantics.meanings.forEach(meaning => {
        if (!emotions[meaning]) emotions[meaning] = 0;
        emotions[meaning] += weight;
        totalWeight += weight;
      });
    });

    // Нормализуем значения
    Object.keys(emotions).forEach(emotion => {
      emotions[emotion] = emotions[emotion] / Math.max(totalWeight, 1);
    });

    // Определяем доминирующие эмоции
    const sortedEmotions = Object.entries(emotions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      primary_emotions: sortedEmotions,
      emotional_balance: this.calculateEmotionalBalance(emotions),
      overall_tone: this.determineOverallTone(sortedEmotions)
    };
  }

  /**
   * Анализ брендинговых импликаций
   */
  analyzeBrandImplications(visualElements) {
    const brandValues = [];
    const brandArchetypes = [];
    const brandPersonality = {};

    visualElements.forEach(element => {
      const conceptCategory = `${element.type}_semantics`;
      const concept = this.visualConcepts[conceptCategory]?.[element.value];
      
      if (concept) {
        if (concept.brand_usage) brandValues.push(...concept.brand_usage);
        if (concept.brand_archetypes) brandArchetypes.push(...concept.brand_archetypes);
      }
    });

    return {
      brand_values: [...new Set(brandValues)],
      brand_archetypes: [...new Set(brandArchetypes)],
      brand_personality: this.buildBrandPersonality(visualElements),
      market_positioning: this.suggestMarketPositioning(brandValues)
    };
  }

  /**
   * Анализ культурного контекста
   */
  analyzeCulturalContext(visualElements) {
    const culturalMeanings = {
      western: {},
      eastern: {},
      universal: {}
    };

    visualElements.forEach(element => {
      const semantics = this.getElementSemantics(element);
      if (semantics.cultural) {
        Object.keys(culturalMeanings).forEach(culture => {
          if (semantics.cultural[culture]) {
            culturalMeanings[culture][element.value] = semantics.cultural[culture];
          }
        });
      }
    });

    return {
      cultural_meanings: culturalMeanings,
      cultural_sensitivity: this.assessCulturalSensitivity(visualElements),
      global_appeal: this.calculateGlobalAppeal(culturalMeanings)
    };
  }

  /**
   * Генерация визуальных рекомендаций
   */
  generateVisualRecommendations(analysis) {
    const recommendations = [];

    // Рекомендации по цветовой гармонии
    const colorRecommendations = this.generateColorRecommendations(analysis.visual_elements);
    recommendations.push(...colorRecommendations);

    // Рекомендации по композиции
    const compositionRecommendations = this.generateCompositionRecommendations(analysis);
    recommendations.push(...compositionRecommendations);

    // Рекомендации по брендингу
    const brandRecommendations = this.generateBrandRecommendations(analysis.brand_implications);
    recommendations.push(...brandRecommendations);

    return recommendations;
  }

  // Вспомогательные методы
  getColorSynonyms(color) {
    const synonyms = {
      red: 'красный|алый|багровый',
      blue: 'синий|голубой|лазурный',
      green: 'зеленый|изумрудный|салатовый'
    };
    return synonyms[color] || color;
  }

  getShapeSynonyms(shape) {
    const synonyms = {
      circle: 'круг|окружность|кольцо',
      square: 'квадрат|прямоугольник|ромб',
      triangle: 'треугольник|стрела|пирамида'
    };
    return synonyms[shape] || shape;
  }

  getStyleSynonyms(style) {
    const synonyms = {
      minimalist: 'минимализм|простой|лаконичный',
      vintage: 'винтаж|ретро|старинный',
      futuristic: 'футуристический|современный|техно'
    };
    return synonyms[style] || style;
  }

  calculateEmotionalBalance(emotions) {
    const positiveEmotions = ['trust', 'calm', 'growth', 'harmony', 'unity'];
    const negativeEmotions = ['danger', 'sadness', 'conflict'];
    
    let positiveScore = 0;
    let negativeScore = 0;

    Object.entries(emotions).forEach(([emotion, weight]) => {
      if (positiveEmotions.includes(emotion)) positiveScore += weight;
      if (negativeEmotions.includes(emotion)) negativeScore += weight;
    });

    return {
      balance: positiveScore - negativeScore,
      polarity: positiveScore > negativeScore ? 'positive' : 'negative'
    };
  }

  determineOverallTone(sortedEmotions) {
    if (sortedEmotions.length === 0) return 'neutral';
    return sortedEmotions[0][0]; // Возвращаем доминирующую эмоцию
  }

  buildBrandPersonality(visualElements) {
    const personality = {
      sophistication: 0,
      sincerity: 0,
      excitement: 0,
      competence: 0,
      ruggedness: 0
    };

    // Простая система подсчета на основе элементов
    visualElements.forEach(element => {
      if (element.value === 'minimalist' || element.value === 'blue') {
        personality.sophistication += 0.3;
        personality.competence += 0.2;
      }
      if (element.value === 'vintage') {
        personality.sincerity += 0.4;
        personality.ruggedness += 0.2;
      }
      if (element.value === 'red' || element.value === 'triangle') {
        personality.excitement += 0.3;
      }
    });

    return personality;
  }

  suggestMarketPositioning(brandValues) {
    if (brandValues.includes('luxury') || brandValues.includes('premium')) {
      return 'premium_market';
    } else if (brandValues.includes('tech') || brandValues.includes('innovative')) {
      return 'technology_leader';
    } else if (brandValues.includes('traditional') || brandValues.includes('authentic')) {
      return 'heritage_brand';
    }
    return 'mainstream_market';
  }

  assessCulturalSensitivity(visualElements) {
    // Упрощенная оценка культурной чувствительности
    return {
      risk_level: 'low',
      concerns: [],
      recommendations: ['Review with local cultural experts', 'Test with target audience']
    };
  }

  calculateGlobalAppeal(culturalMeanings) {
    const universalCount = Object.keys(culturalMeanings.universal).length;
    const totalCount = Object.keys(culturalMeanings.western).length + 
                      Object.keys(culturalMeanings.eastern).length + universalCount;
    
    return universalCount / Math.max(totalCount, 1);
  }

  generateColorRecommendations(visualElements) {
    const recommendations = [];
    const colors = visualElements.filter(e => e.type === 'color');
    
    if (colors.length < 2) {
      recommendations.push({
        type: 'color_harmony',
        message: 'Рассмотрите добавление дополнительных цветов для создания гармоничной палитры',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  generateCompositionRecommendations(analysis) {
    const recommendations = [];
    
    recommendations.push({
      type: 'composition',
      message: 'Обратите внимание на баланс визуальных элементов в композиции',
      priority: 'medium'
    });

    return recommendations;
  }

  generateBrandRecommendations(brandImplications) {
    const recommendations = [];
    
    if (brandImplications.brand_values.length > 0) {
      recommendations.push({
        type: 'branding',
        message: `Ваш дизайн отражает следующие брендовые ценности: ${brandImplications.brand_values.join(', ')}`,
        priority: 'high'
      });
    }

    return recommendations;
  }
}

module.exports = new VisualSemanticAnalyzer();
