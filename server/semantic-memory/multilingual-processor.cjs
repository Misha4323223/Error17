
/**
 * Система мультиязычности для семантической памяти (Фаза 3)
 */

const SmartLogger = {
  lang: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🌍 [${timestamp}] MULTILINGUAL: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

class MultilingualProcessor {
  constructor() {
    this.initializeLanguageSupport();
  }

  /**
   * Инициализация поддержки языков
   */
  initializeLanguageSupport() {
    this.supportedLanguages = {
      'ru': {
        name: 'Русский',
        direction: 'ltr',
        family: 'cyrillic',
        cultural_context: 'eastern_european',
        formality_levels: ['informal', 'formal', 'official']
      },
      'en': {
        name: 'English',
        direction: 'ltr',
        family: 'latin',
        cultural_context: 'western',
        formality_levels: ['casual', 'formal', 'business']
      },
      'zh': {
        name: '中文',
        direction: 'ltr',
        family: 'sino_tibetan',
        cultural_context: 'eastern_asian',
        formality_levels: ['informal', 'formal', 'honorific']
      },
      'es': {
        name: 'Español',
        direction: 'ltr',
        family: 'latin',
        cultural_context: 'hispanic',
        formality_levels: ['tú', 'usted', 'formal']
      },
      'fr': {
        name: 'Français',
        direction: 'ltr',
        family: 'latin',
        cultural_context: 'western_european',
        formality_levels: ['tu', 'vous', 'formal']
      },
      'de': {
        name: 'Deutsch',
        direction: 'ltr',
        family: 'germanic',
        cultural_context: 'central_european',
        formality_levels: ['du', 'sie', 'formal']
      },
      'ja': {
        name: '日本語',
        direction: 'ltr',
        family: 'japonic',
        cultural_context: 'eastern_asian',
        formality_levels: ['casual', 'polite', 'formal', 'honorific']
      },
      'ar': {
        name: 'العربية',
        direction: 'rtl',
        family: 'semitic',
        cultural_context: 'middle_eastern',
        formality_levels: ['informal', 'formal', 'classical']
      }
    };

    // Семантические переводы концепций
    this.conceptTranslations = {
      'branding': {
        'ru': 'брендинг',
        'en': 'branding',
        'zh': '品牌',
        'es': 'marca',
        'fr': 'image de marque',
        'de': 'markenbildung',
        'ja': 'ブランディング',
        'ar': 'العلامة التجارية'
      },
      'logo': {
        'ru': 'логотип',
        'en': 'logo',
        'zh': '标志',
        'es': 'logotipo',
        'fr': 'logo',
        'de': 'logo',
        'ja': 'ロゴ',
        'ar': 'شعار'
      },
      'design': {
        'ru': 'дизайн',
        'en': 'design',
        'zh': '设计',
        'es': 'diseño',
        'fr': 'conception',
        'de': 'design',
        'ja': 'デザイン',
        'ar': 'تصميم'
      }
    };

    // Культурные адаптации
    this.culturalAdaptations = {
      'colors': {
        'western': {
          'red': { meaning: 'passion', context: 'love_danger' },
          'white': { meaning: 'purity', context: 'wedding_peace' },
          'black': { meaning: 'elegance', context: 'formal_mystery' }
        },
        'eastern_asian': {
          'red': { meaning: 'luck', context: 'celebration_prosperity' },
          'white': { meaning: 'mourning', context: 'death_sadness' },
          'black': { meaning: 'formal', context: 'business_serious' }
        },
        'middle_eastern': {
          'green': { meaning: 'islam', context: 'religious_nature' },
          'blue': { meaning: 'protection', context: 'safety_trust' },
          'gold': { meaning: 'wealth', context: 'luxury_divine' }
        }
      },
      'symbols': {
        'western': {
          'owl': 'wisdom',
          'dove': 'peace',
          'lion': 'strength'
        },
        'eastern_asian': {
          'dragon': 'power_luck',
          'crane': 'longevity',
          'lotus': 'purity'
        },
        'middle_eastern': {
          'crescent': 'islam',
          'palm': 'victory',
          'star': 'guidance'
        }
      }
    };
  }

  /**
   * Определение языка текста
   */
  detectLanguage(text) {
    SmartLogger.lang('Определяю язык текста', { textLength: text.length });

    const detection = {
      primary_language: 'ru',
      confidence: 0.5,
      alternatives: [],
      script_type: 'cyrillic',
      mixed_language: false
    };

    // Простая эвристика определения языка
    const cyrillicPattern = /[а-яё]/i;
    const latinPattern = /[a-z]/i;
    const chinesePattern = /[\u4e00-\u9fff]/;
    const arabicPattern = /[\u0600-\u06ff]/;
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;

    const patterns = [
      { pattern: cyrillicPattern, lang: 'ru', script: 'cyrillic' },
      { pattern: latinPattern, lang: 'en', script: 'latin' },
      { pattern: chinesePattern, lang: 'zh', script: 'chinese' },
      { pattern: arabicPattern, lang: 'ar', script: 'arabic' },
      { pattern: japanesePattern, lang: 'ja', script: 'japanese' }
    ];

    const matches = [];
    patterns.forEach(({ pattern, lang, script }) => {
      const match = text.match(pattern);
      if (match) {
        matches.push({
          language: lang,
          script: script,
          match_count: match.length,
          confidence: Math.min(match.length / text.length * 2, 1.0)
        });
      }
    });

    if (matches.length > 0) {
      // Сортируем по уверенности
      matches.sort((a, b) => b.confidence - a.confidence);
      detection.primary_language = matches[0].language;
      detection.confidence = matches[0].confidence;
      detection.script_type = matches[0].script;
      detection.alternatives = matches.slice(1);
      detection.mixed_language = matches.length > 1;
    }

    // Дополнительные эвристики для латинских языков
    if (detection.primary_language === 'en' && detection.script_type === 'latin') {
      detection.primary_language = this.refineLatinLanguage(text);
    }

    SmartLogger.lang('Язык определен', {
      language: detection.primary_language,
      confidence: detection.confidence,
      mixed: detection.mixed_language
    });

    return detection;
  }

  /**
   * Культурная адаптация контента
   */
  adaptToculture(content, targetLanguage, culturalContext = null) {
    SmartLogger.lang('Адаптирую контент к культуре', {
      targetLang: targetLanguage,
      context: culturalContext
    });

    const langInfo = this.supportedLanguages[targetLanguage];
    if (!langInfo) {
      return { content, adaptations: [] };
    }

    const adaptedContent = { ...content };
    const adaptations = [];

    // Адаптируем цвета
    if (content.colors && content.colors.length > 0) {
      const colorAdaptations = this.adaptColors(
        content.colors, 
        langInfo.cultural_context
      );
      adaptedContent.colors = colorAdaptations.colors;
      adaptations.push(...colorAdaptations.changes);
    }

    // Адаптируем символы и элементы
    if (content.elements) {
      const elementAdaptations = this.adaptElements(
        content.elements,
        langInfo.cultural_context
      );
      adaptedContent.elements = elementAdaptations.elements;
      adaptations.push(...elementAdaptations.changes);
    }

    // Адаптируем стиль общения
    if (content.communication_style) {
      const styleAdaptation = this.adaptCommunicationStyle(
        content.communication_style,
        targetLanguage
      );
      adaptedContent.communication_style = styleAdaptation.style;
      adaptations.push(...styleAdaptation.changes);
    }

    return {
      content: adaptedContent,
      adaptations: adaptations,
      cultural_context: langInfo.cultural_context
    };
  }

  /**
   * Перевод семантических концепций
   */
  translateSemanticConcepts(concepts, targetLanguage) {
    SmartLogger.lang('Перевожу семантические концепции', {
      conceptsCount: concepts.length,
      targetLang: targetLanguage
    });

    const translations = [];

    concepts.forEach(concept => {
      const translation = {
        original: concept,
        translated: concept, // По умолчанию без изменений
        confidence: 0.5,
        cultural_notes: []
      };

      // Ищем прямой перевод
      if (this.conceptTranslations[concept.toLowerCase()]) {
        const conceptTranslation = this.conceptTranslations[concept.toLowerCase()][targetLanguage];
        if (conceptTranslation) {
          translation.translated = conceptTranslation;
          translation.confidence = 0.9;
        }
      }

      // Добавляем культурные заметки
      const culturalNotes = this.getCulturalNotes(concept, targetLanguage);
      translation.cultural_notes = culturalNotes;

      translations.push(translation);
    });

    return translations;
  }

  /**
   * Локализация интерфейса
   */
  localizeInterface(interfaceElements, targetLanguage) {
    const localized = {};
    const langInfo = this.supportedLanguages[targetLanguage];

    // Базовые элементы интерфейса
    const uiTranslations = {
      'ru': {
        'create': 'Создать',
        'edit': 'Редактировать',
        'save': 'Сохранить',
        'cancel': 'Отмена',
        'delete': 'Удалить',
        'settings': 'Настройки',
        'help': 'Помощь'
      },
      'en': {
        'create': 'Create',
        'edit': 'Edit',
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'settings': 'Settings',
        'help': 'Help'
      },
      'zh': {
        'create': '创建',
        'edit': '编辑',
        'save': '保存',
        'cancel': '取消',
        'delete': '删除',
        'settings': '设置',
        'help': '帮助'
      }
    };

    const translations = uiTranslations[targetLanguage] || uiTranslations['en'];

    Object.keys(interfaceElements).forEach(key => {
      localized[key] = translations[key] || interfaceElements[key];
    });

    // Добавляем информацию о направлении текста
    localized._meta = {
      direction: langInfo.direction,
      language: targetLanguage,
      formality_levels: langInfo.formality_levels
    };

    return localized;
  }

  /**
   * Генерация мультиязычных промптов
   */
  generateMultilingualPrompts(basePrompt, targetLanguages) {
    SmartLogger.lang('Генерирую мультиязычные промпты', {
      basePrompt: basePrompt.substring(0, 50) + '...',
      languages: targetLanguages
    });

    const multilingualPrompts = {};

    targetLanguages.forEach(lang => {
      const langInfo = this.supportedLanguages[lang];
      if (!langInfo) return;

      let adaptedPrompt = basePrompt;

      // Переводим ключевые концепции
      const concepts = this.extractConcepts(basePrompt);
      const translatedConcepts = this.translateSemanticConcepts(concepts, lang);

      translatedConcepts.forEach(({ original, translated }) => {
        adaptedPrompt = adaptedPrompt.replace(
          new RegExp(original, 'gi'),
          translated
        );
      });

      // Добавляем культурный контекст
      const culturalContext = this.getCulturalPromptAdditions(lang);
      if (culturalContext) {
        adaptedPrompt += ` ${culturalContext}`;
      }

      multilingualPrompts[lang] = {
        prompt: adaptedPrompt,
        cultural_context: langInfo.cultural_context,
        formality: this.suggestFormality(basePrompt, lang),
        additional_notes: this.getLanguageSpecificNotes(lang)
      };
    });

    return multilingualPrompts;
  }

  // Вспомогательные методы

  refineLatinLanguage(text) {
    // Простая эвристика для различения латинских языков
    const spanishIndicators = ['el ', 'la ', 'de ', 'en ', 'con ', 'que ', 'es ', 'un ', 'una '];
    const frenchIndicators = ['le ', 'la ', 'de ', 'et ', 'en ', 'du ', 'des ', 'une ', 'est '];
    const germanIndicators = ['der ', 'die ', 'das ', 'und ', 'ist ', 'mit ', 'für ', 'ein ', 'eine '];

    const lowerText = text.toLowerCase();
    
    const spanishCount = spanishIndicators.filter(ind => lowerText.includes(ind)).length;
    const frenchCount = frenchIndicators.filter(ind => lowerText.includes(ind)).length;
    const germanCount = germanIndicators.filter(ind => lowerText.includes(ind)).length;

    if (spanishCount > frenchCount && spanishCount > germanCount) return 'es';
    if (frenchCount > germanCount) return 'fr';
    if (germanCount > 0) return 'de';
    
    return 'en'; // По умолчанию английский
  }

  adaptColors(colors, culturalContext) {
    const adaptations = { colors: [...colors], changes: [] };
    const colorMappings = this.culturalAdaptations.colors[culturalContext];

    if (!colorMappings) return adaptations;

    colors.forEach((color, index) => {
      const colorInfo = colorMappings[color.toLowerCase()];
      if (colorInfo && colorInfo.meaning) {
        adaptations.changes.push({
          type: 'color_meaning',
          original: color,
          cultural_meaning: colorInfo.meaning,
          context: colorInfo.context,
          suggestion: `В этой культуре ${color} ассоциируется с ${colorInfo.meaning}`
        });
      }
    });

    return adaptations;
  }

  adaptElements(elements, culturalContext) {
    const adaptations = { elements: [...elements], changes: [] };
    const symbolMappings = this.culturalAdaptations.symbols[culturalContext];

    if (!symbolMappings) return adaptations;

    elements.forEach((element, index) => {
      const elementName = element.toLowerCase();
      if (symbolMappings[elementName]) {
        adaptations.changes.push({
          type: 'symbol_meaning',
          original: element,
          cultural_meaning: symbolMappings[elementName],
          suggestion: `В этой культуре ${element} символизирует ${symbolMappings[elementName]}`
        });
      }
    });

    return adaptations;
  }

  adaptCommunicationStyle(style, targetLanguage) {
    const langInfo = this.supportedLanguages[targetLanguage];
    const adaptation = { style: style, changes: [] };

    // Адаптируем уровень формальности
    if (langInfo.formality_levels) {
      const suggestedFormality = this.mapFormalityLevel(style, langInfo.formality_levels);
      if (suggestedFormality) {
        adaptation.style = suggestedFormality;
        adaptation.changes.push({
          type: 'formality_adaptation',
          original: style,
          adapted: suggestedFormality,
          reason: `Адаптация под формальность ${targetLanguage}`
        });
      }
    }

    return adaptation;
  }

  getCulturalNotes(concept, targetLanguage) {
    const notes = [];
    const langInfo = this.supportedLanguages[targetLanguage];
    
    if (langInfo.cultural_context === 'eastern_asian' && concept === 'logo') {
      notes.push('В восточной культуре важна симметрия и гармония в логотипах');
    }
    
    if (langInfo.cultural_context === 'middle_eastern' && concept === 'design') {
      notes.push('Учитывайте направление чтения справа налево');
    }

    return notes;
  }

  extractConcepts(text) {
    const concepts = [];
    const conceptKeys = Object.keys(this.conceptTranslations);
    
    conceptKeys.forEach(concept => {
      if (text.toLowerCase().includes(concept)) {
        concepts.push(concept);
      }
    });

    return concepts;
  }

  getCulturalPromptAdditions(language) {
    const additions = {
      'zh': ', учитывая восточные традиции дизайна',
      'ar': ', с учетом арабской каллиграфии и направления справа налево',
      'ja': ', в японском минималистичном стиле',
      'es': ', с яркими и теплыми цветами латиноамериканской культуры'
    };

    return additions[language] || '';
  }

  suggestFormality(basePrompt, targetLanguage) {
    const formal_indicators = ['официальный', 'деловой', 'корпоративный'];
    const informal_indicators = ['дружеский', 'неформальный', 'casual'];
    
    const lowerPrompt = basePrompt.toLowerCase();
    
    if (formal_indicators.some(ind => lowerPrompt.includes(ind))) {
      return this.supportedLanguages[targetLanguage].formality_levels.slice(-1)[0]; // Самый формальный
    }
    
    if (informal_indicators.some(ind => lowerPrompt.includes(ind))) {
      return this.supportedLanguages[targetLanguage].formality_levels[0]; // Самый неформальный
    }

    // Средний уровень формальности
    const levels = this.supportedLanguages[targetLanguage].formality_levels;
    return levels[Math.floor(levels.length / 2)];
  }

  getLanguageSpecificNotes(language) {
    const notes = {
      'zh': ['Используйте четные числа для удачи', 'Избегайте число 4'],
      'ar': ['Учитывайте направление RTL', 'Избегайте изображения живых существ в религиозном контексте'],
      'ja': ['Минимализм высоко ценится', 'Качество важнее количества'],
      'de': ['Точность и функциональность приоритетны', 'Избегайте излишней декоративности']
    };

    return notes[language] || [];
  }

  mapFormalityLevel(originalLevel, targetLevels) {
    const formalityMap = {
      'informal': targetLevels[0],
      'formal': targetLevels[Math.floor(targetLevels.length / 2)],
      'official': targetLevels[targetLevels.length - 1]
    };

    return formalityMap[originalLevel] || targetLevels[0];
  }
}

module.exports = new MultilingualProcessor();
