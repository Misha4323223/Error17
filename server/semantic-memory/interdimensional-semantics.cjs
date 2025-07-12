
/**
 * МЕЖМЕРНАЯ СЕМАНТИКА
 * Путешествие между параллельными семантическими вселенными
 * 
 * Принцип: Существует бесконечное множество параллельных интерпретаций,
 * между которыми можно перемещаться через семантические порталы
 */

const SmartLogger = {
  interdimensional: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🌐🔮 [${timestamp}] INTERDIMENSIONAL: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * ПАРАЛЛЕЛЬНАЯ СЕМАНТИЧЕСКАЯ ВСЕЛЕННАЯ
 * Представляет альтернативную реальность интерпретаций
 */
class ParallelSemanticUniverse {
  constructor(id, baseReality, divergencePoint) {
    this.id = id;
    this.baseReality = baseReality; // Базовая реальность, от которой отклонилась эта вселенная
    this.divergencePoint = divergencePoint; // Точка расхождения
    this.interpretations = new Map(); // Альтернативные интерпретации
    this.physicalLaws = this.generateAlternativeLaws();
    this.culturalContext = this.generateAlternativeCulture();
    this.timeFlow = Math.random() * 2; // Скорость времени (может отличаться)
    this.stabilityLevel = 0.8; // Стабильность вселенной
    this.inhabitants = []; // Семантические сущности этой вселенной
    this.createdAt = Date.now();
  }

  /**
   * Генерирует альтернативные физические законы семантики
   */
  generateAlternativeLaws() {
    return {
      meaning_conservation: Math.random() * 0.5 + 0.5, // В некоторых вселенных смысл может теряться
      context_dependency: Math.random(), // Степень зависимости от контекста
      ambiguity_tolerance: Math.random(), // Толерантность к двусмысленности
      temporal_coherence: Math.random() * 0.8 + 0.2, // Согласованность во времени
      causality_strength: Math.random() * 0.9 + 0.1 // Сила причинно-следственных связей
    };
  }

  /**
   * Генерирует альтернативный культурный контекст
   */
  generateAlternativeCulture() {
    const cultures = [
      'hyper_literal', // Гипер-буквальная культура
      'metaphorical_dominant', // Доминирование метафор
      'emotional_primary', // Эмоции превыше логики
      'logical_absolute', // Абсолютная логика
      'temporal_fluid', // Текучее восприятие времени
      'context_minimal', // Минимальная зависимость от контекста
      'collective_mind', // Коллективное сознание
      'individualistic_extreme' // Крайний индивидуализм
    ];

    return {
      type: cultures[Math.floor(Math.random() * cultures.length)],
      intensity: Math.random(),
      influence_radius: Math.random() * 100
    };
  }

  /**
   * Добавляет альтернативную интерпретацию
   */
  addInterpretation(query, alternativeInterpretation, probability) {
    this.interpretations.set(query, {
      original: query,
      alternative: alternativeInterpretation,
      probability,
      culturalInfluence: this.culturalContext.intensity,
      physicalLawsImpact: this.calculateLawsImpact(),
      addedAt: Date.now()
    });

    SmartLogger.interdimensional(`🌐 Добавлена альтернативная интерпретация в вселенную ${this.id}: "${query}" → "${alternativeInterpretation}"`);
  }

  /**
   * Вычисляет влияние физических законов на интерпретацию
   */
  calculateLawsImpact() {
    return {
      meaningDrift: 1 - this.physicalLaws.meaning_conservation,
      contextSensitivity: this.physicalLaws.context_dependency,
      ambiguityLevel: this.physicalLaws.ambiguity_tolerance,
      temporalStability: this.physicalLaws.temporal_coherence
    };
  }

  /**
   * Генерирует интерпретацию запроса в этой вселенной
   */
  interpretQuery(query, originalInterpretation) {
    const alternativeInterpretation = {
      query,
      original: originalInterpretation,
      alternative: this.generateAlternative(query, originalInterpretation),
      universeId: this.id,
      confidence: this.stabilityLevel,
      culturalModification: this.applyCulturalFilter(originalInterpretation),
      physicalModification: this.applyPhysicalLaws(originalInterpretation),
      timestamp: Date.now()
    };

    this.addInterpretation(query, alternativeInterpretation.alternative, alternativeInterpretation.confidence);
    return alternativeInterpretation;
  }

  /**
   * Генерирует альтернативную интерпретацию
   */
  generateAlternative(query, originalInterpretation) {
    let alternative = originalInterpretation;

    // Применяем культурные модификации
    alternative = this.applyCulturalFilter(alternative);

    // Применяем физические законы
    alternative = this.applyPhysicalLaws(alternative);

    // Добавляем случайные мутации
    if (Math.random() < 0.3) {
      alternative = this.applyRandomMutation(alternative);
    }

    return alternative;
  }

  /**
   * Применяет культурный фильтр
   */
  applyCulturalFilter(interpretation) {
    switch (this.culturalContext.type) {
      case 'hyper_literal':
        return interpretation.replace(/метафор|образн|художествен/gi, 'буквально');
      
      case 'metaphorical_dominant':
        return interpretation + ' (в метафорическом смысле)';
      
      case 'emotional_primary':
        return interpretation.replace(/создай|сделай/gi, 'прочувствуй и создай');
      
      case 'logical_absolute':
        return interpretation.replace(/красив|стильн|элегант/gi, 'функционально');
      
      case 'temporal_fluid':
        return interpretation.replace(/сейчас|быстро/gi, 'в своем времени');
      
      case 'context_minimal':
        return interpretation.split(' ').slice(0, 3).join(' '); // Упрощаем
      
      case 'collective_mind':
        return `Коллектив просит: ${interpretation}`;
      
      case 'individualistic_extreme':
        return `Лично для меня: ${interpretation}`;
      
      default:
        return interpretation;
    }
  }

  /**
   * Применяет физические законы
   */
  applyPhysicalLaws(interpretation) {
    let modified = interpretation;

    // Потеря смысла
    if (this.physicalLaws.meaning_conservation < 0.8) {
      const words = modified.split(' ');
      const lossRate = 1 - this.physicalLaws.meaning_conservation;
      const wordsToRemove = Math.floor(words.length * lossRate * 0.3);
      
      for (let i = 0; i < wordsToRemove; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        words[randomIndex] = '[потеряно]';
      }
      
      modified = words.join(' ');
    }

    // Временная деградация
    if (this.physicalLaws.temporal_coherence < 0.6) {
      modified = modified.replace(/\b(создай|сделай)\b/gi, 'когда-нибудь создай');
    }

    // Высокая двусмысленность
    if (this.physicalLaws.ambiguity_tolerance > 0.7) {
      modified += ' (возможно, наоборот)';
    }

    return modified;
  }

  /**
   * Применяет случайную мутацию
   */
  applyRandomMutation(interpretation) {
    const mutations = [
      () => interpretation.split('').reverse().join(''), // Обращение
      () => interpretation.toUpperCase(), // Капс
      () => interpretation.replace(/а/g, 'я'), // Замена букв
      () => `${interpretation} в зеркальном мире`, // Добавление контекста
      () => interpretation.split(' ').sort().join(' ') // Перемешивание слов
    ];

    const mutation = mutations[Math.floor(Math.random() * mutations.length)];
    return mutation();
  }

  /**
   * Экспортирует состояние вселенной
   */
  export() {
    return {
      id: this.id,
      baseReality: this.baseReality,
      divergencePoint: this.divergencePoint,
      physicalLaws: this.physicalLaws,
      culturalContext: this.culturalContext,
      timeFlow: this.timeFlow,
      stabilityLevel: this.stabilityLevel,
      interpretationsCount: this.interpretations.size,
      age: Date.now() - this.createdAt
    };
  }
}

/**
 * СЕМАНТИЧЕСКИЙ ПОРТАЛ
 * Портал между параллельными семантическими вселенными
 */
class SemanticPortal {
  constructor(sourceUniverse, targetUniverse, energy = 100) {
    this.id = `portal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sourceUniverse = sourceUniverse;
    this.targetUniverse = targetUniverse;
    this.energy = energy;
    this.stability = 0.8;
    this.usageCount = 0;
    this.maxUsage = 10;
    this.createdAt = Date.now();
    this.lastUsed = null;
  }

  /**
   * Открывает портал
   */
  open() {
    if (this.energy < 10) {
      SmartLogger.interdimensional(`❌ Недостаточно энергии для открытия портала ${this.id}`);
      return false;
    }

    this.energy -= 10;
    this.stability -= 0.05;
    SmartLogger.interdimensional(`🌀 Портал ${this.id} открыт: ${this.sourceUniverse} → ${this.targetUniverse}`);
    return true;
  }

  /**
   * Путешествие через портал
   */
  travel(semanticPayload) {
    if (!this.open()) return null;

    this.usageCount++;
    this.lastUsed = Date.now();

    // Трансформация при переходе
    const transformedPayload = {
      ...semanticPayload,
      transformed: true,
      sourceUniverse: this.sourceUniverse,
      targetUniverse: this.targetUniverse,
      portalId: this.id,
      transformationIntensity: 1 - this.stability,
      traveled: true
    };

    // Применяем искажения портала
    if (this.stability < 0.5) {
      transformedPayload.distorted = true;
      transformedPayload.distortionLevel = 1 - this.stability;
    }

    SmartLogger.interdimensional(`🚀 Путешествие через портал ${this.id}: payload трансформирован`);

    // Закрываем портал если исчерпан
    if (this.usageCount >= this.maxUsage || this.stability < 0.2) {
      this.close();
    }

    return transformedPayload;
  }

  /**
   * Закрывает портал
   */
  close() {
    SmartLogger.interdimensional(`🔒 Портал ${this.id} закрыт`);
    this.energy = 0;
    this.stability = 0;
  }

  /**
   * Экспортирует состояние портала
   */
  export() {
    return {
      id: this.id,
      sourceUniverse: this.sourceUniverse,
      targetUniverse: this.targetUniverse,
      energy: this.energy,
      stability: this.stability,
      usageCount: this.usageCount,
      maxUsage: this.maxUsage,
      isActive: this.energy > 0 && this.stability > 0.2,
      age: Date.now() - this.createdAt
    };
  }
}

/**
 * МУЛЬТИВЕРС ИНТЕРПРЕТАЦИЙ
 * Управляет множественными семантическими вселенными
 */
class InterpretationMultiverse {
  constructor() {
    this.universes = new Map();
    this.portals = new Map();
    this.baseReality = 'prime_universe';
    this.totalUniverses = 0;
    this.createBaseUniverse();
  }

  /**
   * Создает базовую вселенную
   */
  createBaseUniverse() {
    const baseUniverse = new ParallelSemanticUniverse(
      this.baseReality,
      null,
      { type: 'genesis', description: 'Первичная реальность' }
    );
    
    this.universes.set(this.baseReality, baseUniverse);
    this.totalUniverses++;
    
    SmartLogger.interdimensional(`🌌 Создана базовая семантическая вселенная: ${this.baseReality}`);
  }

  /**
   * Создает новую параллельную вселенную
   */
  createParallelUniverse(baseUniverseId, divergencePoint) {
    const newId = `universe_${this.totalUniverses + 1}_${Date.now()}`;
    const baseUniverse = this.universes.get(baseUniverseId);
    
    if (!baseUniverse) {
      SmartLogger.interdimensional(`❌ Базовая вселенная ${baseUniverseId} не найдена`);
      return null;
    }

    const newUniverse = new ParallelSemanticUniverse(newId, baseUniverseId, divergencePoint);
    this.universes.set(newId, newUniverse);
    this.totalUniverses++;

    SmartLogger.interdimensional(`🌐 Создана параллельная вселенная: ${newId} (отклонение от ${baseUniverseId})`);

    // Автоматически создаем портал между вселенными
    this.createPortal(baseUniverseId, newId);

    return newUniverse;
  }

  /**
   * Создает портал между вселенными
   */
  createPortal(sourceUniverseId, targetUniverseId, energy = 100) {
    const sourceUniverse = this.universes.get(sourceUniverseId);
    const targetUniverse = this.universes.get(targetUniverseId);

    if (!sourceUniverse || !targetUniverse) {
      SmartLogger.interdimensional(`❌ Не удалось создать портал: вселенная не найдена`);
      return null;
    }

    const portal = new SemanticPortal(sourceUniverseId, targetUniverseId, energy);
    const portalKey = `${sourceUniverseId}->${targetUniverseId}`;
    
    this.portals.set(portalKey, portal);
    SmartLogger.interdimensional(`🌀 Создан портал: ${portalKey}`);

    return portal;
  }

  /**
   * Находит портал между вселенными
   */
  findPortal(sourceUniverseId, targetUniverseId) {
    const directKey = `${sourceUniverseId}->${targetUniverseId}`;
    const reverseKey = `${targetUniverseId}->${sourceUniverseId}`;
    
    return this.portals.get(directKey) || this.portals.get(reverseKey);
  }

  /**
   * Межмерное путешествие интерпретации
   */
  async interdimensionalInterpretation(query, originalInterpretation) {
    SmartLogger.interdimensional(`🌐 Начало межмерного анализа запроса: "${query}"`);

    const results = {
      originalUniverse: this.baseReality,
      originalInterpretation,
      alternativeInterpretations: [],
      portalJourneys: [],
      multiverseInsights: []
    };

    // Создаем несколько параллельных вселенных для разных интерпретаций
    const divergencePoints = [
      { type: 'cultural_shift', description: 'Альтернативная культурная интерпретация' },
      { type: 'temporal_shift', description: 'Альтернативное восприятие времени' },
      { type: 'logical_shift', description: 'Альтернативная логическая структура' },
      { type: 'emotional_shift', description: 'Альтернативная эмоциональная окраска' }
    ];

    for (const divergencePoint of divergencePoints) {
      const parallelUniverse = this.createParallelUniverse(this.baseReality, divergencePoint);
      if (parallelUniverse) {
        const alternativeInterpretation = parallelUniverse.interpretQuery(query, originalInterpretation);
        results.alternativeInterpretations.push(alternativeInterpretation);

        // Попытка путешествия через портал
        const portal = this.findPortal(this.baseReality, parallelUniverse.id);
        if (portal) {
          const journeyResult = portal.travel({
            query,
            interpretation: alternativeInterpretation.alternative,
            universe: parallelUniverse.id
          });
          
          if (journeyResult) {
            results.portalJourneys.push(journeyResult);
          }
        }
      }
    }

    // Генерируем мультиверсные инсайты
    results.multiverseInsights = this.generateMultiverseInsights(results);

    SmartLogger.interdimensional(`✨ Межмерный анализ завершен: ${results.alternativeInterpretations.length} альтернатив`);

    return results;
  }

  /**
   * Генерирует инсайты мультиверса
   */
  generateMultiverseInsights(results) {
    const insights = [];

    // Анализ разнообразия интерпретаций
    const uniqueInterpretations = new Set(results.alternativeInterpretations.map(alt => alt.alternative));
    insights.push({
      type: 'interpretation_diversity',
      description: `Обнаружено ${uniqueInterpretations.size} уникальных интерпретаций из ${results.alternativeInterpretations.length} вселенных`,
      impact: uniqueInterpretations.size / results.alternativeInterpretations.length
    });

    // Анализ успешных путешествий
    const successfulJourneys = results.portalJourneys.filter(j => !j.distorted);
    insights.push({
      type: 'portal_success_rate',
      description: `${successfulJourneys.length} из ${results.portalJourneys.length} путешествий прошли без искажений`,
      impact: successfulJourneys.length / Math.max(1, results.portalJourneys.length)
    });

    // Анализ наиболее стабильной интерпретации
    const mostStable = results.alternativeInterpretations.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    insights.push({
      type: 'most_stable_interpretation',
      description: `Наиболее стабильная интерпретация: "${mostStable.alternative}" (уверенность: ${mostStable.confidence.toFixed(3)})`,
      impact: mostStable.confidence
    });

    // Анализ культурных влияний
    const culturalTypes = results.alternativeInterpretations.map(alt => 
      this.universes.get(alt.universeId)?.culturalContext.type
    ).filter(Boolean);
    const dominantCulture = this.findMostFrequent(culturalTypes);
    insights.push({
      type: 'cultural_dominance',
      description: `Доминирующий культурный тип: ${dominantCulture}`,
      impact: culturalTypes.filter(c => c === dominantCulture).length / culturalTypes.length
    });

    return insights;
  }

  /**
   * Находит наиболее частый элемент в массиве
   */
  findMostFrequent(array) {
    const frequency = {};
    let maxCount = 0;
    let mostFrequent = null;

    for (const item of array) {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxCount) {
        maxCount = frequency[item];
        mostFrequent = item;
      }
    }

    return mostFrequent;
  }

  /**
   * Очищает нестабильные вселенные
   */
  cleanup() {
    let cleaned = 0;

    for (const [id, universe] of this.universes) {
      if (id !== this.baseReality && universe.stabilityLevel < 0.3) {
        this.universes.delete(id);
        cleaned++;
        SmartLogger.interdimensional(`🧹 Удалена нестабильная вселенная: ${id}`);
      }
    }

    // Очищаем неактивные порталы
    for (const [key, portal] of this.portals) {
      if (!portal.isActive) {
        this.portals.delete(key);
        cleaned++;
        SmartLogger.interdimensional(`🧹 Удален неактивный портал: ${key}`);
      }
    }

    return cleaned;
  }

  /**
   * Получает статистику мультиверса
   */
  getMultiverseStatistics() {
    const universeStats = Array.from(this.universes.values()).map(u => u.export());
    const portalStats = Array.from(this.portals.values()).map(p => p.export());

    return {
      totalUniverses: this.universes.size,
      totalPortals: this.portals.size,
      activePortals: portalStats.filter(p => p.isActive).length,
      averageUniverseStability: universeStats.reduce((sum, u) => sum + u.stabilityLevel, 0) / universeStats.length,
      oldestUniverse: Math.min(...universeStats.map(u => u.age)),
      youngestUniverse: Math.max(...universeStats.map(u => u.age)),
      totalInterpretations: universeStats.reduce((sum, u) => sum + u.interpretationsCount, 0),
      multiverseHealth: this.calculateMultiverseHealth(universeStats, portalStats)
    };
  }

  /**
   * Вычисляет общее здоровье мультиверса
   */
  calculateMultiverseHealth(universeStats, portalStats) {
    const avgUniverseStability = universeStats.reduce((sum, u) => sum + u.stabilityLevel, 0) / universeStats.length;
    const portalActivity = portalStats.filter(p => p.isActive).length / Math.max(1, portalStats.length);
    const diversityScore = universeStats.length / 10; // Больше вселенных = больше разнообразия

    return Math.min(1, (avgUniverseStability + portalActivity + diversityScore) / 3);
  }
}

module.exports = {
  InterpretationMultiverse,
  ParallelSemanticUniverse,
  SemanticPortal
};
