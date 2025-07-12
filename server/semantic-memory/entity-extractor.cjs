/**
 * Извлекатель сущностей из текстовых запросов
 * Определяет объекты, цвета, стили, размеры и другие характеристики
 */

const SmartLogger = {
  entity: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] ENTITY EXTRACTOR: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Основной класс для извлечения сущностей
 */
class EntityExtractor {
  constructor() {
    this.initializePatterns();
  }

  checkHealth() {
    return {
      status: 'healthy',
      version: '1.0.0',
      patternsLoaded: Object.keys(this.colorPatterns).length + Object.keys(this.stylePatterns).length + Object.keys(this.sizePatterns).length + Object.keys(this.objectPatterns).length + Object.keys(this.actionPatterns).length + Object.keys(this.contextPatterns).length,
      //entitiesCount: this.entities.length // this.entities is not used
    };
  }

  initializePatterns() {
    // Цвета
    this.colorPatterns = {
      primary: ['красный', 'синий', 'зеленый', 'желтый', 'черный', 'белый', 'серый'],
      extended: ['коричневый', 'фиолетовый', 'розовый', 'оранжевый', 'голубой', 'бежевый', 'золотой', 'серебряный'],
      descriptive: ['яркий', 'темный', 'светлый', 'пастельный', 'насыщенный', 'блеклый']
    };

    // Стили и настроения
    this.stylePatterns = {
      artistic: ['реалистичный', 'художественный', 'живописный', 'детализированный', 'фотореалистичный'],
      cartoon: ['мультяшный', 'cartoon', 'векторный', 'простой', 'минималистичный'],
      vintage: ['винтажный', 'ретро', 'старинный', 'классический', 'антикварный'],
      modern: ['современный', 'модный', 'стильный', 'трендовый', 'актуальный'],
      decorative: ['декоративный', 'орнаментальный', 'узорчатый', 'изящный']
    };

    // Размеры и форматы
    this.sizePatterns = {
      small: ['маленький', 'мелкий', 'компактный', 'небольшой'],
      medium: ['средний', 'обычный', 'стандартный'],
      large: ['большой', 'крупный', 'масштабный', 'огромный']
    };

    // Объекты и существа
    this.objectPatterns = {
      animals: ['кот', 'собака', 'лев', 'тигр', 'медведь', 'волк', 'лиса', 'заяц', 'птица', 'орел', 'дракон'],
      nature: ['дерево', 'цветок', 'лист', 'гора', 'море', 'солнце', 'луна', 'звезда', 'облако'],
      objects: ['корона', 'меч', 'щит', 'замок', 'машина', 'самолет', 'корабль', 'дом'],
      abstract: ['символ', 'знак', 'эмблема', 'узор', 'орнамент', 'геометрия', 'форма'],
      people: ['человек', 'лицо', 'портрет', 'фигура', 'силуэт', 'персонаж', 'герой']
    };

    // Действия и модификации
    this.actionPatterns = {
      create: ['создай', 'нарисуй', 'сделай', 'сгенерируй', 'построй'],
      modify: ['измени', 'поменяй', 'добавь', 'убери', 'переделай', 'улучши'],
      convert: ['векторизуй', 'конвертируй', 'преобразуй', 'переведи', 'адаптируй'],
      optimize: ['оптимизируй', 'упрости', 'улучши', 'доработай', 'подгони']
    };

    // Контексты использования
    this.contextPatterns = {
      print: ['печать', 'принт', 'футболка', 'тишарт', 'одежда', 'ткань'],
      web: ['сайт', 'веб', 'интернет', 'онлайн', 'цифровой'],
      logo: ['логотип', 'бренд', 'компания', 'фирма', 'организация'],
      embroidery: ['вышивка', 'вышить', 'машинная вышивка', 'нитки'],
      signage: ['вывеска', 'баннер', 'реклама', 'указатель']
    };
  }

  /**
   * Основной метод извлечения всех сущностей из запроса
   */
  extractEntities(query) {
    SmartLogger.entity(`Извлечение сущностей из запроса: "${query}"`);

    const entities = {
      colors: this.extractColors(query),
      styles: this.extractStyles(query),
      objects: this.extractObjects(query),
      sizes: this.extractSizes(query),
      actions: this.extractActions(query),
      contexts: this.extractContexts(query),
      modifiers: this.extractModifiers(query)
    };

    // Вычисляем общую уверенность
    const totalEntities = Object.values(entities).flat().length;
    entities.confidence = Math.min(totalEntities * 15, 100);

    SmartLogger.entity('Извлеченные сущности:', entities);
    return entities;
  }

  /**
   * Извлечение цветов
   */
  extractColors(query) {
    const colors = [];
    const lowerQuery = query.toLowerCase();

    // Проверяем основные цвета
    [...this.colorPatterns.primary, ...this.colorPatterns.extended].forEach(color => {
      if (lowerQuery.includes(color)) {
        colors.push({
          type: 'color',
          value: color,
          category: this.colorPatterns.primary.includes(color) ? 'primary' : 'extended',
          confidence: 0.9
        });
      }
    });

    // Проверяем описательные характеристики цветов
    this.colorPatterns.descriptive.forEach(descriptor => {
      if (lowerQuery.includes(descriptor)) {
        colors.push({
          type: 'color_modifier',
          value: descriptor,
          category: 'descriptive',
          confidence: 0.7
        });
      }
    });

    return colors;
  }

  /**
   * Извлечение стилей
   */
  extractStyles(query) {
    const styles = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(this.stylePatterns).forEach(([category, styleList]) => {
      styleList.forEach(style => {
        if (lowerQuery.includes(style)) {
          styles.push({
            type: 'style',
            value: style,
            category: category,
            confidence: 0.85
          });
        }
      });
    });

    return styles;
  }

  /**
   * Извлечение объектов
   */
  extractObjects(query) {
    const objects = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(this.objectPatterns).forEach(([category, objectList]) => {
      objectList.forEach(object => {
        if (lowerQuery.includes(object)) {
          objects.push({
            type: 'object',
            value: object,
            category: category,
            confidence: 0.95
          });
        }
      });
    });

    return objects;
  }

  /**
   * Извлечение размеров
   */
  extractSizes(query) {
    const sizes = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(this.sizePatterns).forEach(([sizeCategory, sizeList]) => {
      sizeList.forEach(size => {
        if (lowerQuery.includes(size)) {
          sizes.push({
            type: 'size',
            value: size,
            category: sizeCategory,
            confidence: 0.8
          });
        }
      });
    });

    return sizes;
  }

  /**
   * Извлечение действий
   */
  extractActions(query) {
    const actions = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(this.actionPatterns).forEach(([actionCategory, actionList]) => {
      actionList.forEach(action => {
        if (lowerQuery.includes(action)) {
          actions.push({
            type: 'action',
            value: action,
            category: actionCategory,
            confidence: 0.9
          });
        }
      });
    });

    return actions;
  }

  /**
   * Извлечение контекстов использования
   */
  extractContexts(query) {
    const contexts = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(this.contextPatterns).forEach(([contextCategory, contextList]) => {
      contextList.forEach(context => {
        if (lowerQuery.includes(context)) {
          contexts.push({
            type: 'context',
            value: context,
            category: contextCategory,
            confidence: 0.85
          });
        }
      });
    });

    return contexts;
  }

  /**
   * Извлечение модификаторов (дополнительных характеристик)
   */
  extractModifiers(query) {
    const modifiers = [];
    const lowerQuery = query.toLowerCase();

    // Качество
    const qualityModifiers = ['высокое качество', 'hd', '4k', 'детализированный', 'четкий'];
    qualityModifiers.forEach(modifier => {
      if (lowerQuery.includes(modifier)) {
        modifiers.push({
          type: 'quality',
          value: modifier,
          category: 'quality',
          confidence: 0.8
        });
      }
    });

    // Эмоции и настроение
    const emotionModifiers = ['веселый', 'грустный', 'злой', 'добрый', 'мрачный', 'яркий', 'радостный'];
    emotionModifiers.forEach(emotion => {
      if (lowerQuery.includes(emotion)) {
        modifiers.push({
          type: 'emotion',
          value: emotion,
          category: 'emotion',
          confidence: 0.75
        });
      }
    });

    // Время и эпоха
    const timeModifiers = ['современный', 'античный', 'средневековый', 'футуристический', 'ретро'];
    timeModifiers.forEach(time => {
      if (lowerQuery.includes(time)) {
        modifiers.push({
          type: 'time_period',
          value: time,
          category: 'temporal',
          confidence: 0.8
        });
      }
    });

    return modifiers;
  }

  /**
   * Анализ приоритетности сущностей в запросе
   */
  analyzePriority(entities) {
    const priorities = {
      actions: 1.0,  // Действия имеют наивысший приоритет
      objects: 0.9,  // Объекты очень важны
      contexts: 0.8, // Контекст использования важен
      styles: 0.7,   // Стиль важен для качества
      colors: 0.6,   // Цвета средней важности
      sizes: 0.5,    // Размеры менее важны
      modifiers: 0.4 // Модификаторы наименее важны
    };

    const prioritizedEntities = [];

    Object.entries(entities).forEach(([category, entityList]) => {
      if (Array.isArray(entityList) && entityList.length > 0) {
        entityList.forEach(entity => {
          prioritizedEntities.push({
            ...entity,
            priority: priorities[category] || 0.3,
            finalScore: (entity.confidence || 0.5) * (priorities[category] || 0.3)
          });
        });
      }
    });

    // Сортируем по финальному счету
    prioritizedEntities.sort((a, b) => b.finalScore - a.finalScore);

    SmartLogger.entity('Приоритизированные сущности:', prioritizedEntities.slice(0, 5));
    return prioritizedEntities;
  }

  /**
   * Генерация описания для промпта на основе извлеченных сущностей
   */
  generateEnhancedPrompt(originalQuery, entities) {
    const prioritized = this.analyzePriority(entities);
    const topEntities = prioritized.slice(0, 8); // Берем топ-8 сущностей

    let enhancedPrompt = originalQuery;

    // Добавляем важные характеристики, которые могли быть пропущены
    const styles = topEntities.filter(e => e.type === 'style').map(e => e.value);
    const colors = topEntities.filter(e => e.type === 'color').map(e => e.value);
    const modifiers = topEntities.filter(e => e.type === 'quality' || e.type === 'emotion').map(e => e.value);

    if (styles.length > 0) {
      enhancedPrompt += `, ${styles.join(', ')} стиль`;
    }

    if (colors.length > 0) {
      enhancedPrompt += `, ${colors.join(', ')} цвета`;
    }

    if (modifiers.length > 0) {
      enhancedPrompt += `, ${modifiers.join(', ')}`;
    }

    SmartLogger.entity(`Улучшенный промпт: "${enhancedPrompt}"`);
    return enhancedPrompt;
  }

  /**
   * Определение недостающих сущностей для полноты описания
   */
  suggestMissingEntities(entities, context = {}) {
    const suggestions = [];

    // Если есть объект, но нет стиля
    const hasObjects = entities.objects && entities.objects.length > 0;
    const hasStyles = entities.styles && entities.styles.length > 0;

    if (hasObjects && !hasStyles) {
      suggestions.push({
        type: 'style',
        suggestion: 'Рекомендуется указать стиль (реалистичный, мультяшный, художественный)',
        priority: 'high'
      });
    }

    // Если для печати, но нет указания цветов
    const isPrintContext = entities.contexts && entities.contexts.some(c => c.category === 'print');
    const hasColors = entities.colors && entities.colors.length > 0;

    if (isPrintContext && !hasColors) {
      suggestions.push({
        type: 'color',
        suggestion: 'Для печати рекомендуется указать цветовую схему',
        priority: 'medium'
      });
    }

    // Если логотип, но нет контекста бизнеса
    const isLogo = entities.contexts && entities.contexts.some(c => c.category === 'logo');
    const hasBusinessContext = entities.objects && entities.objects.some(o => 
      ['кофейня', 'ресторан', 'магазин', 'компания'].includes(o.value)
    );

    if (isLogo && !hasBusinessContext) {
      suggestions.push({
        type: 'business_context',
        suggestion: 'Для логотипа полезно указать тип бизнеса или сферу деятельности',
        priority: 'medium'
      });
    }

    SmartLogger.entity('Предложения по недостающим сущностям:', suggestions);
    return suggestions;
  }
}

// Создаем глобальный экземпляр
const entityExtractor = new EntityExtractor();

module.exports = {
  extractEntities: entityExtractor.extractEntities.bind(entityExtractor),
  analyzePriority: entityExtractor.analyzePriority.bind(entityExtractor),
  generateEnhancedPrompt: entityExtractor.generateEnhancedPrompt.bind(entityExtractor),
  suggestMissingEntities: entityExtractor.suggestMissingEntities.bind(entityExtractor),
  checkHealth: entityExtractor.checkHealth.bind(entityExtractor),

  // Экспортируем класс для расширения
  EntityExtractor
};