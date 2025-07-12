
/**
 * ВРЕМЕННАЯ МЕТА-СЕМАНТИКА
 * Анализ эволюции значений во времени и предсказание семантических трендов
 */

const SmartLogger = {
  temporal: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`⏰🧠 [${timestamp}] TEMPORAL-META: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * АНАЛИЗАТОР СЕМАНТИЧЕСКОЙ ЭВОЛЮЦИИ
 * Отслеживает как изменяются значения слов и концепций во времени
 */
class SemanticEvolutionAnalyzer {
  constructor() {
    this.semanticHistory = new Map(); // слово -> временные точки
    this.conceptEvolution = new Map(); // концепция -> эволюция
    this.culturalShifts = new Map(); // временной период -> изменения
    this.languageAdaptations = new Map(); // новые паттерны языка
    this.semanticVelocity = new Map(); // скорость изменения значений
  }

  /**
   * Анализирует эволюцию значения слова/концепции
   */
  analyzeSemanticEvolution(word, context, timestamp = Date.now()) {
    SmartLogger.temporal(`Анализ эволюции: "${word}"`);

    const evolutionPoint = {
      timestamp,
      context,
      meaning: this.extractCurrentMeaning(word, context),
      culturalContext: this.extractCulturalContext(context),
      usagePattern: this.extractUsagePattern(word, context),
      semanticWeight: this.calculateSemanticWeight(word, context)
    };

    // Добавляем точку в историю
    if (!this.semanticHistory.has(word)) {
      this.semanticHistory.set(word, []);
    }
    this.semanticHistory.get(word).push(evolutionPoint);

    // Анализируем изменения
    const evolution = this.detectSemanticChanges(word);
    
    SmartLogger.temporal(`Эволюция "${word}": изменений за период: ${evolution.changesCount}`);
    
    return {
      word,
      currentMeaning: evolutionPoint.meaning,
      evolutionTrend: evolution.trend,
      changeVelocity: evolution.velocity,
      culturalInfluences: evolution.culturalFactors,
      predictedEvolution: this.predictNextEvolution(word, evolution)
    };
  }

  /**
   * Извлекает текущее значение слова в контексте
   */
  extractCurrentMeaning(word, context) {
    const meanings = {
      core: this.extractCoreMeaning(word, context),
      connotations: this.extractConnotations(word, context),
      emotionalCharge: this.extractEmotionalCharge(word, context),
      domainSpecific: this.extractDomainMeaning(word, context)
    };

    return meanings;
  }

  extractCoreMeaning(word, context) {
    // Анализ основного значения на основе контекста
    const lowerWord = word.toLowerCase();
    const lowerContext = context.toLowerCase();

    if (lowerWord.includes('ai') || lowerWord.includes('ии')) {
      return lowerContext.includes('творч') ? 'creative_ai' : 
             lowerContext.includes('анализ') ? 'analytical_ai' : 'general_ai';
    }

    if (lowerWord.includes('дизайн')) {
      return lowerContext.includes('веб') ? 'web_design' :
             lowerContext.includes('принт') ? 'print_design' : 'general_design';
    }

    return 'general_meaning';
  }

  extractConnotations(word, context) {
    const connotations = [];
    const lowerContext = context.toLowerCase();

    // Позитивные коннотации
    if (lowerContext.includes('крут') || lowerContext.includes('классн') || 
        lowerContext.includes('супер') || lowerContext.includes('отличн')) {
      connotations.push('positive');
    }

    // Технические коннотации
    if (lowerContext.includes('алгоритм') || lowerContext.includes('код') ||
        lowerContext.includes('систем')) {
      connotations.push('technical');
    }

    // Креативные коннотации
    if (lowerContext.includes('творч') || lowerContext.includes('искусств') ||
        lowerContext.includes('креатив')) {
      connotations.push('creative');
    }

    return connotations;
  }

  extractEmotionalCharge(word, context) {
    const emotions = {
      excitement: 0,
      satisfaction: 0,
      curiosity: 0,
      frustration: 0
    };

    const lowerContext = context.toLowerCase();

    // Возбуждение/энтузиазм
    if (lowerContext.includes('!') || lowerContext.includes('вау') ||
        lowerContext.includes('отличн')) {
      emotions.excitement = 0.8;
    }

    // Удовлетворение
    if (lowerContext.includes('хорош') || lowerContext.includes('отлич') ||
        lowerContext.includes('класс')) {
      emotions.satisfaction = 0.7;
    }

    // Любопытство
    if (lowerContext.includes('?') || lowerContext.includes('интересн') ||
        lowerContext.includes('как')) {
      emotions.curiosity = 0.6;
    }

    return emotions;
  }

  extractDomainMeaning(word, context) {
    const domains = [];
    const lowerContext = context.toLowerCase();

    if (lowerContext.includes('принт') || lowerContext.includes('печат') ||
        lowerContext.includes('футболк')) {
      domains.push('apparel_design');
    }

    if (lowerContext.includes('вышивк') || lowerContext.includes('dst') ||
        lowerContext.includes('pes')) {
      domains.push('embroidery');
    }

    if (lowerContext.includes('логотип') || lowerContext.includes('бренд') ||
        lowerContext.includes('фирменн')) {
      domains.push('branding');
    }

    return domains;
  }

  /**
   * Извлекает культурный контекст
   */
  extractCulturalContext(context) {
    const cultural = {
      timeOfDay: this.getTimeContext(),
      generational: this.detectGenerationalMarkers(context),
      regional: this.detectRegionalMarkers(context),
      technological: this.detectTechLevel(context)
    };

    return cultural;
  }

  getTimeContext() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  detectGenerationalMarkers(context) {
    const lowerContext = context.toLowerCase();
    
    if (lowerContext.includes('тик') || lowerContext.includes('вайб') ||
        lowerContext.includes('кринж')) {
      return 'gen_z';
    }
    
    if (lowerContext.includes('круто') || lowerContext.includes('офигенн')) {
      return 'millennial';
    }
    
    return 'neutral';
  }

  detectRegionalMarkers(context) {
    const lowerContext = context.toLowerCase();
    
    // Российские маркеры
    if (lowerContext.includes('блин') || lowerContext.includes('ну') ||
        lowerContext.includes('давай')) {
      return 'russian_colloquial';
    }
    
    return 'standard';
  }

  detectTechLevel(context) {
    const lowerContext = context.toLowerCase();
    const techWords = ['ai', 'нейрон', 'алгоритм', 'код', 'систем', 'данн'];
    const techCount = techWords.filter(word => lowerContext.includes(word)).length;
    
    if (techCount >= 3) return 'high_tech';
    if (techCount >= 1) return 'medium_tech';
    return 'low_tech';
  }

  /**
   * Обнаруживает семантические изменения
   */
  detectSemanticChanges(word) {
    const history = this.semanticHistory.get(word) || [];
    if (history.length < 2) {
      return { trend: 'stable', velocity: 0, changesCount: 0, culturalFactors: [] };
    }

    const changes = {
      meaningShifts: 0,
      emotionalShifts: 0,
      contextualShifts: 0,
      culturalShifts: 0
    };

    // Анализируем последние точки
    for (let i = 1; i < history.length; i++) {
      const current = history[i];
      const previous = history[i-1];

      // Сдвиги в основном значении
      if (current.meaning.core !== previous.meaning.core) {
        changes.meaningShifts++;
      }

      // Эмоциональные сдвиги
      const emotionalDiff = this.calculateEmotionalDifference(
        current.meaning.emotionalCharge, 
        previous.meaning.emotionalCharge
      );
      if (emotionalDiff > 0.3) {
        changes.emotionalShifts++;
      }

      // Контекстуальные сдвиги
      if (current.meaning.domainSpecific.length !== previous.meaning.domainSpecific.length) {
        changes.contextualShifts++;
      }
    }

    const totalChanges = Object.values(changes).reduce((sum, val) => sum + val, 0);
    const velocity = totalChanges / Math.max(1, history.length - 1);

    // Определяем тренд
    let trend = 'stable';
    if (velocity > 0.5) trend = 'rapidly_evolving';
    else if (velocity > 0.2) trend = 'evolving';
    else if (velocity > 0.1) trend = 'slowly_evolving';

    return {
      trend,
      velocity,
      changesCount: totalChanges,
      culturalFactors: this.identifyCulturalFactors(history),
      changes
    };
  }

  calculateEmotionalDifference(current, previous) {
    const emotions = ['excitement', 'satisfaction', 'curiosity', 'frustration'];
    let totalDiff = 0;

    emotions.forEach(emotion => {
      totalDiff += Math.abs((current[emotion] || 0) - (previous[emotion] || 0));
    });

    return totalDiff / emotions.length;
  }

  identifyCulturalFactors(history) {
    const factors = [];
    const recentHistory = history.slice(-5);

    // Анализ технологических изменений
    const techLevels = recentHistory.map(h => h.culturalContext.technological);
    if (techLevels.includes('high_tech') && techLevels.includes('low_tech')) {
      factors.push('technological_adaptation');
    }

    // Анализ поколенческих сдвигов
    const generations = recentHistory.map(h => h.culturalContext.generational);
    if (new Set(generations).size > 1) {
      factors.push('generational_influence');
    }

    return factors;
  }

  /**
   * Предсказывает следующую эволюцию
   */
  predictNextEvolution(word, evolution) {
    const prediction = {
      timeframe: this.calculateTimeframe(evolution.velocity),
      likelyChanges: this.predictLikelyChanges(word, evolution),
      confidence: this.calculatePredictionConfidence(evolution),
      triggers: this.identifyEvolutionTriggers(word, evolution)
    };

    SmartLogger.temporal(`Предсказание для "${word}": ${prediction.timeframe}, уверенность: ${prediction.confidence}`);

    return prediction;
  }

  calculateTimeframe(velocity) {
    if (velocity > 0.5) return 'days';
    if (velocity > 0.2) return 'weeks';
    if (velocity > 0.1) return 'months';
    return 'years';
  }

  predictLikelyChanges(word, evolution) {
    const changes = [];

    if (evolution.velocity > 0.3) {
      changes.push('meaning_expansion');
      changes.push('emotional_shift');
    }

    if (evolution.culturalFactors.includes('technological_adaptation')) {
      changes.push('tech_integration');
    }

    if (evolution.culturalFactors.includes('generational_influence')) {
      changes.push('colloquial_adoption');
    }

    return changes;
  }

  calculatePredictionConfidence(evolution) {
    let confidence = 0.5;

    // Больше данных = больше уверенности
    if (evolution.changesCount > 5) confidence += 0.2;
    if (evolution.changesCount > 10) confidence += 0.2;

    // Стабильность тренда
    if (evolution.trend === 'stable') confidence += 0.2;
    if (evolution.trend === 'rapidly_evolving') confidence -= 0.1;

    return Math.max(0.1, Math.min(0.9, confidence));
  }

  identifyEvolutionTriggers(word, evolution) {
    const triggers = [];

    if (evolution.velocity > 0.4) {
      triggers.push('viral_usage');
    }

    if (evolution.culturalFactors.length > 0) {
      triggers.push('cultural_shift');
    }

    triggers.push('natural_evolution');

    return triggers;
  }

  /**
   * Вычисляет семантический вес слова
   */
  calculateSemanticWeight(word, context) {
    let weight = 0.5;

    // Частота использования
    const usage = this.getUsageFrequency(word);
    weight += usage * 0.2;

    // Эмоциональная нагрузка
    const emotions = this.extractEmotionalCharge(word, context);
    const emotionalIntensity = Object.values(emotions).reduce((sum, val) => sum + val, 0) / 4;
    weight += emotionalIntensity * 0.3;

    // Контекстуальная важность
    const domains = this.extractDomainMeaning(word, context);
    weight += domains.length * 0.1;

    return Math.max(0.1, Math.min(1.0, weight));
  }

  getUsageFrequency(word) {
    const history = this.semanticHistory.get(word) || [];
    const recentUsage = history.filter(h => Date.now() - h.timestamp < 24 * 60 * 60 * 1000);
    return Math.min(1.0, recentUsage.length / 10);
  }

  /**
   * Получает статистику эволюции
   */
  getEvolutionStatistics() {
    const stats = {
      totalWords: this.semanticHistory.size,
      rapidlyEvolving: 0,
      evolving: 0,
      stable: 0,
      culturalShifts: this.culturalShifts.size,
      averageVelocity: 0
    };

    let totalVelocity = 0;
    let wordCount = 0;

    this.semanticHistory.forEach((history, word) => {
      if (history.length > 1) {
        const evolution = this.detectSemanticChanges(word);
        
        if (evolution.trend === 'rapidly_evolving') stats.rapidlyEvolving++;
        else if (evolution.trend === 'evolving') stats.evolving++;
        else stats.stable++;

        totalVelocity += evolution.velocity;
        wordCount++;
      }
    });

    stats.averageVelocity = wordCount > 0 ? totalVelocity / wordCount : 0;

    return stats;
  }
}

/**
 * ПРЕДСКАЗАТЕЛЬ СЕМАНТИЧЕСКИХ ТРЕНДОВ
 * Анализирует паттерны и предсказывает будущие изменения
 */
class SemanticTrendPredictor {
  constructor() {
    this.trendPatterns = new Map();
    this.globalTrends = new Map();
    this.emergingConcepts = new Map();
    this.semanticMomentum = new Map();
  }

  /**
   * Предсказывает семантические тренды
   */
  predictSemanticTrends(timeframe = '1month') {
    SmartLogger.temporal(`Предсказание трендов на период: ${timeframe}`);

    const trends = {
      emerging: this.identifyEmergingTrends(),
      declining: this.identifyDecliningTrends(),
      stable: this.identifyStableTrends(),
      revolutionary: this.identifyRevolutionaryTrends(),
      confidence: this.calculateTrendConfidence()
    };

    SmartLogger.temporal(`Найдено трендов: emerging=${trends.emerging.length}, declining=${trends.declining.length}`);

    return trends;
  }

  identifyEmergingTrends() {
    const emerging = [];
    
    // Анализируем новые концепции
    this.emergingConcepts.forEach((data, concept) => {
      if (data.momentum > 0.7 && data.age < 30) { // молодые и быстрорастущие
        emerging.push({
          concept,
          momentum: data.momentum,
          predictedGrowth: data.momentum * 1.5,
          timeToMainstream: this.calculateTimeToMainstream(data.momentum),
          influencingFactors: data.factors
        });
      }
    });

    return emerging.sort((a, b) => b.momentum - a.momentum);
  }

  identifyDecliningTrends() {
    const declining = [];

    this.semanticMomentum.forEach((momentum, concept) => {
      if (momentum < -0.5) { // отрицательный импульс
        declining.push({
          concept,
          momentum,
          predictedDecline: Math.abs(momentum) * 1.2,
          timeToObsolete: this.calculateTimeToObsolete(momentum),
          replacementConcepts: this.findReplacementConcepts(concept)
        });
      }
    });

    return declining.sort((a, b) => a.momentum - b.momentum);
  }

  identifyStableTrends() {
    const stable = [];

    this.semanticMomentum.forEach((momentum, concept) => {
      if (Math.abs(momentum) < 0.2) { // низкая изменчивость
        stable.push({
          concept,
          momentum,
          stability: 1 - Math.abs(momentum),
          longevity: this.calculateLongevity(concept)
        });
      }
    });

    return stable.sort((a, b) => b.stability - a.stability);
  }

  identifyRevolutionaryTrends() {
    const revolutionary = [];

    // Ищем концепции с экстремально высоким импульсом
    this.semanticMomentum.forEach((momentum, concept) => {
      if (momentum > 0.9) {
        revolutionary.push({
          concept,
          momentum,
          disruptivePotential: momentum,
          impactRadius: this.calculateImpactRadius(concept),
          paradigmShift: this.analyzeParadigmShift(concept)
        });
      }
    });

    return revolutionary.sort((a, b) => b.disruptivePotential - a.disruptivePotential);
  }

  calculateTimeToMainstream(momentum) {
    // Высокий импульс = быстрое внедрение
    if (momentum > 0.8) return 'weeks';
    if (momentum > 0.6) return 'months';
    if (momentum > 0.4) return 'quarters';
    return 'years';
  }

  calculateTimeToObsolete(momentum) {
    const absDecline = Math.abs(momentum);
    if (absDecline > 0.8) return 'months';
    if (absDecline > 0.6) return 'quarters';
    if (absDecline > 0.4) return 'years';
    return 'decades';
  }

  findReplacementConcepts(concept) {
    // Ищем концепции с высоким импульсом в той же области
    const replacements = [];
    const conceptDomain = this.getConceptDomain(concept);

    this.semanticMomentum.forEach((momentum, candidate) => {
      if (momentum > 0.5 && this.getConceptDomain(candidate) === conceptDomain) {
        replacements.push(candidate);
      }
    });

    return replacements;
  }

  getConceptDomain(concept) {
    if (concept.includes('ai') || concept.includes('ии')) return 'technology';
    if (concept.includes('дизайн') || concept.includes('принт')) return 'design';
    if (concept.includes('вышивк')) return 'crafting';
    return 'general';
  }

  calculateLongevity(concept) {
    // Оценка долговечности концепции
    let longevity = 0.5;

    // Базовые концепции более долговечны
    const basicConcepts = ['дизайн', 'изображение', 'цвет', 'форма'];
    if (basicConcepts.some(basic => concept.includes(basic))) {
      longevity += 0.3;
    }

    // Технические концепции менее долговечны
    const techConcepts = ['ai', 'алгоритм', 'нейрон'];
    if (techConcepts.some(tech => concept.includes(tech))) {
      longevity -= 0.2;
    }

    return Math.max(0.1, Math.min(1.0, longevity));
  }

  calculateImpactRadius(concept) {
    // Радиус влияния концепции на другие области
    let radius = 0.5;

    // AI имеет широкий радиус влияния
    if (concept.includes('ai') || concept.includes('ии')) {
      radius = 0.9;
    }

    // Дизайн имеет средний радиус
    if (concept.includes('дизайн')) {
      radius = 0.7;
    }

    return radius;
  }

  analyzeParadigmShift(concept) {
    // Анализ потенциала смены парадигмы
    const shifts = [];

    if (concept.includes('ai') && concept.includes('творч')) {
      shifts.push('creative_ai_revolution');
    }

    if (concept.includes('автоматизац')) {
      shifts.push('automation_paradigm');
    }

    if (concept.includes('персонализац')) {
      shifts.push('personalization_era');
    }

    return shifts;
  }

  calculateTrendConfidence() {
    let confidence = 0.5;

    // Больше данных = больше уверенности
    const dataPoints = this.semanticMomentum.size;
    confidence += Math.min(0.3, dataPoints / 100);

    // Стабильность паттернов
    const stablePatterns = Array.from(this.trendPatterns.values())
      .filter(pattern => pattern.stability > 0.7).length;
    confidence += Math.min(0.2, stablePatterns / 10);

    return Math.max(0.3, Math.min(0.9, confidence));
  }

  /**
   * Обновляет данные о трендах
   */
  updateTrendData(concept, data) {
    // Обновляем импульс
    const currentMomentum = this.semanticMomentum.get(concept) || 0;
    const newMomentum = this.calculateMomentum(data);
    this.semanticMomentum.set(concept, (currentMomentum + newMomentum) / 2);

    // Обновляем emerging concepts
    if (this.isEmergingConcept(concept, data)) {
      this.emergingConcepts.set(concept, {
        momentum: newMomentum,
        age: this.calculateConceptAge(concept),
        factors: this.identifyInfluencingFactors(concept, data)
      });
    }
  }

  calculateMomentum(data) {
    // Вычисляем импульс на основе частоты использования и эмоциональной нагрузки
    let momentum = 0;

    momentum += data.usageFrequency || 0;
    momentum += (data.emotionalIntensity || 0) * 0.5;
    momentum += (data.contextualImportance || 0) * 0.3;

    return Math.max(-1, Math.min(1, momentum));
  }

  isEmergingConcept(concept, data) {
    return data.usageFrequency > 0.6 && this.calculateConceptAge(concept) < 60;
  }

  calculateConceptAge(concept) {
    // Возраст концепции в днях (упрощенная логика)
    const knownConcepts = {
      'ai': 365 * 2, // 2 года
      'дизайн': 365 * 10, // 10 лет  
      'принт': 365 * 5 // 5 лет
    };

    return knownConcepts[concept] || 30; // по умолчанию 30 дней
  }

  identifyInfluencingFactors(concept, data) {
    const factors = [];

    if (data.technicalContext) factors.push('technological_advancement');
    if (data.culturalShift) factors.push('cultural_change');
    if (data.generationalAdoption) factors.push('generational_adoption');
    if (data.mediaInfluence) factors.push('media_amplification');

    return factors;
  }
}

/**
 * АДАПТЕР К ИЗМЕНЯЮЩЕМУСЯ ЯЗЫКУ
 * Адаптируется к эволюции языка и культурных изменений
 */
class LanguageCultureAdapter {
  constructor() {
    this.languagePatterns = new Map();
    this.culturalAdaptations = new Map();
    this.generationalMarkers = new Map();
    this.adaptationStrategies = new Map();
  }

  /**
   * Адаптируется к изменениям в языке и культуре
   */
  adaptToChanges(newLanguageData, culturalContext) {
    SmartLogger.temporal('Адаптация к языковым и культурным изменениям');

    const adaptation = {
      languageChanges: this.detectLanguageChanges(newLanguageData),
      culturalShifts: this.detectCulturalShifts(culturalContext),
      adaptationActions: [],
      confidence: 0.7
    };

    // Применяем адаптации
    adaptation.adaptationActions = this.applyAdaptations(adaptation);

    SmartLogger.temporal(`Адаптация завершена: ${adaptation.adaptationActions.length} действий`);

    return adaptation;
  }

  detectLanguageChanges(newLanguageData) {
    const changes = {
      newSlang: [],
      changedMeanings: [],
      emergingPatterns: [],
      obsoleteTerms: []
    };

    // Анализируем новый сленг
    newLanguageData.forEach(data => {
      if (this.isNewSlang(data.word, data.context)) {
        changes.newSlang.push({
          word: data.word,
          meaning: data.meaning,
          popularity: data.frequency
        });
      }

      if (this.hasMeaningChanged(data.word, data.meaning)) {
        changes.changedMeanings.push({
          word: data.word,
          oldMeaning: this.getOldMeaning(data.word),
          newMeaning: data.meaning
        });
      }
    });

    return changes;
  }

  isNewSlang(word, context) {
    // Проверяем признаки сленга
    const slangIndicators = [
      word.length < 6, // короткие слова
      context.includes('молодежь') || context.includes('тренд'),
      !this.languagePatterns.has(word) // новое для нас
    ];

    return slangIndicators.filter(Boolean).length >= 2;
  }

  hasMeaningChanged(word, newMeaning) {
    const oldPattern = this.languagePatterns.get(word);
    if (!oldPattern) return false;

    return oldPattern.meaning !== newMeaning;
  }

  getOldMeaning(word) {
    const pattern = this.languagePatterns.get(word);
    return pattern ? pattern.meaning : 'unknown';
  }

  detectCulturalShifts(culturalContext) {
    const shifts = {
      technologicalAdoption: this.detectTechAdoption(culturalContext),
      generationalChanges: this.detectGenerationalChanges(culturalContext),
      valueShifts: this.detectValueShifts(culturalContext),
      communicationPatterns: this.detectCommPatterns(culturalContext)
    };

    return shifts;
  }

  detectTechAdoption(context) {
    const techTerms = ['ai', 'нейросеть', 'алгоритм', 'автоматизация'];
    const adoptionLevel = techTerms.filter(term => 
      context.toLowerCase().includes(term)
    ).length / techTerms.length;

    return {
      level: adoptionLevel,
      trend: adoptionLevel > 0.5 ? 'increasing' : 'stable'
    };
  }

  detectGenerationalChanges(context) {
    const markers = {
      gen_z: ['тиктокер', 'криндж', 'вайб', 'токсик'],
      millennial: ['круто', 'офигенно', 'прикольно'],
      gen_x: ['нормально', 'неплохо', 'ладно']
    };

    const detected = {};
    Object.entries(markers).forEach(([generation, words]) => {
      detected[generation] = words.filter(word => 
        context.toLowerCase().includes(word)
      ).length;
    });

    return detected;
  }

  detectValueShifts(context) {
    const values = {
      sustainability: ['эко', 'зеленый', 'устойчив'],
      personalization: ['персональн', 'индивидуальн', 'уникальн'],
      efficiency: ['быстр', 'эффективн', 'оптимальн'],
      creativity: ['творчеств', 'креатив', 'искусств']
    };

    const shifts = {};
    Object.entries(values).forEach(([value, keywords]) => {
      shifts[value] = keywords.filter(keyword => 
        context.toLowerCase().includes(keyword)
      ).length / keywords.length;
    });

    return shifts;
  }

  detectCommPatterns(context) {
    const patterns = {
      brevity: context.split(' ').length < 10,
      emojis: /[😊🎨✨🔥💪]/g.test(context),
      informality: /[а-я]+(сь|ать|ить)\?/g.test(context),
      directness: context.includes('!') || context.includes('хочу')
    };

    return patterns;
  }

  applyAdaptations(adaptation) {
    const actions = [];

    // Адаптация к новому слегу
    adaptation.languageChanges.newSlang.forEach(slang => {
      actions.push({
        type: 'add_slang',
        word: slang.word,
        meaning: slang.meaning,
        priority: slang.popularity
      });
      
      this.languagePatterns.set(slang.word, {
        meaning: slang.meaning,
        type: 'slang',
        added: Date.now()
      });
    });

    // Адаптация к культурным сдвигам
    if (adaptation.culturalShifts.technologicalAdoption.level > 0.7) {
      actions.push({
        type: 'increase_tech_vocabulary',
        adjustment: 0.2
      });
    }

    // Адаптация к поколенческим изменениям
    const dominantGeneration = this.findDominantGeneration(
      adaptation.culturalShifts.generationalChanges
    );
    if (dominantGeneration) {
      actions.push({
        type: 'adapt_generation_style',
        generation: dominantGeneration,
        adjustments: this.getGenerationAdjustments(dominantGeneration)
      });
    }

    return actions;
  }

  findDominantGeneration(generationalData) {
    let maxScore = 0;
    let dominant = null;

    Object.entries(generationalData).forEach(([generation, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominant = generation;
      }
    });

    return maxScore > 2 ? dominant : null;
  }

  getGenerationAdjustments(generation) {
    const adjustments = {
      gen_z: {
        tone: 'casual',
        emoji_usage: 'high',
        response_length: 'short',
        tech_terms: 'abundant'
      },
      millennial: {
        tone: 'friendly',
        emoji_usage: 'medium',
        response_length: 'medium',
        tech_terms: 'moderate'
      },
      gen_x: {
        tone: 'professional',
        emoji_usage: 'low',
        response_length: 'detailed',
        tech_terms: 'minimal'
      }
    };

    return adjustments[generation] || adjustments.millennial;
  }

  /**
   * Получает статистику адаптации
   */
  getAdaptationStatistics() {
    return {
      languagePatterns: this.languagePatterns.size,
      culturalAdaptations: this.culturalAdaptations.size,
      recentAdaptations: this.getRecentAdaptations(),
      adaptationVelocity: this.calculateAdaptationVelocity()
    };
  }

  getRecentAdaptations() {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    let recentCount = 0;

    this.languagePatterns.forEach(pattern => {
      if (pattern.added && pattern.added > dayAgo) {
        recentCount++;
      }
    });

    return recentCount;
  }

  calculateAdaptationVelocity() {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let weeklyAdaptations = 0;

    this.languagePatterns.forEach(pattern => {
      if (pattern.added && pattern.added > weekAgo) {
        weeklyAdaptations++;
      }
    });

    return weeklyAdaptations / 7; // адаптаций в день
  }
}

/**
 * ГЛАВНЫЙ МОДУЛЬ ВРЕМЕННОЙ МЕТА-СЕМАНТИКИ
 */
class TemporalMetaSemantics {
  constructor() {
    this.evolutionAnalyzer = new SemanticEvolutionAnalyzer();
    this.trendPredictor = new SemanticTrendPredictor();
    this.cultureAdapter = new LanguageCultureAdapter();
    
    this.initialized = false;
  }

  /**
   * Инициализация системы
   */
  initialize() {
    if (this.initialized) return;
    
    SmartLogger.temporal('🚀 Инициализация временной мета-семантики');
    this.initialized = true;
    SmartLogger.temporal('✅ Временная мета-семантика готова к работе');
  }

  /**
   * Полный анализ временной семантики
   */
  async performTemporalAnalysis(query, context = {}) {
    this.initialize();
    
    SmartLogger.temporal(`⏰ ВРЕМЕННОЙ МЕТА-АНАЛИЗ: "${query.substring(0, 50)}..."`);
    
    const startTime = Date.now();
    
    try {
      // Анализ эволюции слов в запросе
      const words = this.extractKeyWords(query);
      const evolutionAnalysis = await this.analyzeWordsEvolution(words, context);
      
      // Предсказание трендов
      const trendPrediction = this.trendPredictor.predictSemanticTrends();
      
      // Культурная адаптация
      const cultureAdaptation = this.cultureAdapter.adaptToChanges(
        evolutionAnalysis.wordData, context
      );
      
      const processingTime = Date.now() - startTime;
      
      const result = {
        timestamp: Date.now(),
        processingTime,
        
        // Основные результаты
        evolutionAnalysis,
        trendPrediction,
        cultureAdaptation,
        
        // Временные инсайты
        temporalInsights: this.generateTemporalInsights(evolutionAnalysis, trendPrediction),
        evolutionPredictions: this.generateEvolutionPredictions(words, evolutionAnalysis),
        adaptationRecommendations: this.generateAdaptationRecommendations(cultureAdaptation),
        
        // Мета-информация
        temporalConfidence: this.calculateTemporalConfidence(evolutionAnalysis, trendPrediction),
        futureRelevance: this.calculateFutureRelevance(query, trendPrediction)
      };
      
      SmartLogger.temporal(`✅ Временной анализ завершен за ${processingTime}мс`);
      
      return result;
      
    } catch (error) {
      SmartLogger.temporal(`❌ Ошибка временного анализа: ${error.message}`);
      
      return {
        error: error.message,
        timestamp: Date.now(),
        processingTime: Date.now() - startTime,
        fallbackInsights: this.generateFallbackInsights(query)
      };
    }
  }

  extractKeyWords(query) {
    const words = query.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !/^(и|в|на|с|по|для|от|до|из|к|о|у|за|при|над|под|без|через)$/.test(word));
    
    return [...new Set(words)]; // уникальные слова
  }

  async analyzeWordsEvolution(words, context) {
    const wordData = [];
    const evolutionSummary = {
      rapidlyEvolving: 0,
      stable: 0,
      emerging: 0
    };
    
    for (const word of words) {
      const evolution = this.evolutionAnalyzer.analyzeSemanticEvolution(
        word, JSON.stringify(context)
      );
      
      wordData.push({
        word,
        evolution,
        temporalSignificance: this.calculateTemporalSignificance(evolution)
      });
      
      // Обновляем статистику
      if (evolution.changeVelocity > 0.5) evolutionSummary.rapidlyEvolving++;
      else if (evolution.changeVelocity < 0.1) evolutionSummary.stable++;
      
      if (evolution.predictedEvolution.timeframe === 'days') {
        evolutionSummary.emerging++;
      }
    }
    
    return {
      wordData,
      evolutionSummary,
      overallTrend: this.calculateOverallTrend(wordData)
    };
  }

  calculateTemporalSignificance(evolution) {
    let significance = 0.5;
    
    significance += evolution.changeVelocity * 0.3;
    significance += evolution.predictedEvolution.confidence * 0.2;
    
    if (evolution.evolutionTrend === 'rapidly_evolving') significance += 0.2;
    if (evolution.culturalInfluences.length > 0) significance += 0.1;
    
    return Math.max(0.1, Math.min(1.0, significance));
  }

  calculateOverallTrend(wordData) {
    if (wordData.length === 0) return 'unknown';
    
    const avgVelocity = wordData.reduce((sum, data) => 
      sum + data.evolution.changeVelocity, 0) / wordData.length;
    
    if (avgVelocity > 0.5) return 'rapidly_evolving';
    if (avgVelocity > 0.2) return 'evolving';
    if (avgVelocity > 0.1) return 'slowly_evolving';
    return 'stable';
  }

  generateTemporalInsights(evolutionAnalysis, trendPrediction) {
    const insights = [];
    
    // Инсайты об эволюции
    if (evolutionAnalysis.evolutionSummary.rapidlyEvolving > 0) {
      insights.push({
        type: 'rapid_evolution',
        description: `${evolutionAnalysis.evolutionSummary.rapidlyEvolving} слов быстро эволюционируют`,
        significance: 'high'
      });
    }
    
    // Инсайты о трендах
    if (trendPrediction.emerging.length > 0) {
      insights.push({
        type: 'emerging_trends',
        description: `Обнаружено ${trendPrediction.emerging.length} восходящих трендов`,
        significance: 'medium'
      });
    }
    
    // Революционные изменения
    if (trendPrediction.revolutionary.length > 0) {
      insights.push({
        type: 'revolutionary_changes',
        description: 'Обнаружены потенциально революционные изменения',
        significance: 'critical'
      });
    }
    
    return insights;
  }

  generateEvolutionPredictions(words, evolutionAnalysis) {
    const predictions = [];
    
    evolutionAnalysis.wordData.forEach(data => {
      if (data.temporalSignificance > 0.7) {
        predictions.push({
          word: data.word,
          currentMeaning: data.evolution.currentMeaning,
          predictedChange: data.evolution.predictedEvolution.likelyChanges,
          timeframe: data.evolution.predictedEvolution.timeframe,
          confidence: data.evolution.predictedEvolution.confidence
        });
      }
    });
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  generateAdaptationRecommendations(cultureAdaptation) {
    const recommendations = [];
    
    cultureAdaptation.adaptationActions.forEach(action => {
      if (action.type === 'add_slang') {
        recommendations.push({
          type: 'vocabulary_update',
          description: `Добавить в словарь: "${action.word}" = ${action.meaning}`,
          priority: action.priority || 0.5
        });
      }
      
      if (action.type === 'adapt_generation_style') {
        recommendations.push({
          type: 'style_adaptation',
          description: `Адаптировать стиль для поколения: ${action.generation}`,
          priority: 0.8,
          adjustments: action.adjustments
        });
      }
    });
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  calculateTemporalConfidence(evolutionAnalysis, trendPrediction) {
    let confidence = 0.5;
    
    // Уверенность на основе данных эволюции
    const avgEvolutionConfidence = evolutionAnalysis.wordData.reduce((sum, data) => 
      sum + data.evolution.predictedEvolution.confidence, 0) / evolutionAnalysis.wordData.length;
    confidence += avgEvolutionConfidence * 0.3;
    
    // Уверенность трендов
    confidence += trendPrediction.confidence * 0.4;
    
    // Количество данных
    if (evolutionAnalysis.wordData.length > 3) confidence += 0.1;
    if (evolutionAnalysis.wordData.length > 6) confidence += 0.1;
    
    return Math.max(0.2, Math.min(0.9, confidence));
  }

  calculateFutureRelevance(query, trendPrediction) {
    let relevance = 0.5;
    
    // Проверяем связь с восходящими трендами
    const queryLower = query.toLowerCase();
    trendPrediction.emerging.forEach(trend => {
      if (queryLower.includes(trend.concept.toLowerCase())) {
        relevance += trend.momentum * 0.2;
      }
    });
    
    // Проверяем связь с революционными трендами
    trendPrediction.revolutionary.forEach(trend => {
      if (queryLower.includes(trend.concept.toLowerCase())) {
        relevance += trend.disruptivePotential * 0.3;
      }
    });
    
    return Math.max(0.1, Math.min(1.0, relevance));
  }

  generateFallbackInsights(query) {
    return {
      basicInsights: [
        'Временной анализ временно недоступен',
        'Базовая семантика функционирует нормально',
        'Система адаптируется к текущему контексту'
      ],
      recommendation: 'Повторить временной анализ позже'
    };
  }

  /**
   * Получает статистику системы
   */
  getSystemStatistics() {
    return {
      initialized: this.initialized,
      evolutionStats: this.evolutionAnalyzer.getEvolutionStatistics(),
      adaptationStats: this.cultureAdapter.getAdaptationStatistics(),
      components: {
        evolutionAnalyzer: 'active',
        trendPredictor: 'active',
        cultureAdapter: 'active'
      }
    };
  }
}

// Создаем глобальный экземпляр
const temporalMetaSemantics = new TemporalMetaSemantics();

module.exports = {
  // Основной метод
  performTemporalAnalysis: temporalMetaSemantics.performTemporalAnalysis.bind(temporalMetaSemantics),
  
  // Статистика
  getSystemStatistics: temporalMetaSemantics.getSystemStatistics.bind(temporalMetaSemantics),
  
  // Доступ к компонентам
  components: {
    evolutionAnalyzer: temporalMetaSemantics.evolutionAnalyzer,
    trendPredictor: temporalMetaSemantics.trendPredictor,
    cultureAdapter: temporalMetaSemantics.cultureAdapter
  },
  
  // Классы для расширения
  TemporalMetaSemantics,
  SemanticEvolutionAnalyzer,
  SemanticTrendPredictor,
  LanguageCultureAdapter
};
