
/**
 * СЕМАНТИЧЕСКИЕ ЧЕРНЫЕ ДЫРЫ И ЧЕРВОТОЧИНЫ
 * Революционная система для обработки экстремальных семантических состояний
 * 
 * Принцип: Некоторые концепты настолько мощные, что они "искривляют" семантическое пространство,
 * создавая черные дыры (точки сингулярности смысла) и червоточины (мгновенные связи между удаленными концептами)
 */

const SmartLogger = {
  blackhole: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🕳️⚫ [${timestamp}] SEMANTIC-BLACKHOLE: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * СЕМАНТИЧЕСКАЯ ЧЕРНАЯ ДЫРА
 * Точка сингулярности, где концепты схлопываются в единую суперпозицию
 */
class SemanticBlackHole {
  constructor(id, initialConcept, mass = 1.0) {
    this.id = id;
    this.mass = mass; // Семантическая масса
    this.position = this.calculatePosition(initialConcept);
    this.eventHorizon = mass * 2.0; // Радиус события
    this.schwartzchildRadius = 2 * mass; // Радиус Шварцшильда
    this.accretionDisk = new Map(); // Диск аккреции концептов
    this.hawkingRadiation = []; // Излучение Хокинга (побочные смыслы)
    this.singularity = { concept: initialConcept, density: Infinity, temperature: 0 };
    this.timeDialation = 1.0; // Замедление времени
    this.spaghetification = new Map(); // Растяжение концептов
    this.createdAt = Date.now();
  }

  /**
   * Вычисляет позицию в семантическом пространстве
   */
  calculatePosition(concept) {
    const hash = this.hashString(concept);
    return {
      x: Math.sin(hash / 1000) * 100,
      y: Math.cos(hash / 1000) * 100,
      z: Math.tan(hash / 1000) * 50,
      w: Math.sin(hash / 2000) * 25, // 4-е измерение
      dimension: hash % 11 // Основное измерение (0-10)
    };
  }

  /**
   * Поглощает концепт в черную дыру
   */
  absorb(concept, semanticDistance) {
    const gravitationalForce = this.calculateGravitationalForce(semanticDistance);
    const escapeVelocity = Math.sqrt(2 * this.mass / semanticDistance);
    
    SmartLogger.blackhole(`🌪️ Поглощение концепта "${concept}" (сила: ${gravitationalForce.toFixed(3)}, скорость убегания: ${escapeVelocity.toFixed(3)})`);

    // Если концепт не может убежать - поглощаем
    if (semanticDistance <= this.eventHorizon) {
      this.performAbsorption(concept, gravitationalForce);
      return { absorbed: true, spaghetified: semanticDistance <= this.schwartzchildRadius };
    } else {
      // Концепт попадает в диск аккреции
      this.addToAccretionDisk(concept, semanticDistance, gravitationalForce);
      return { absorbed: false, inAccretionDisk: true };
    }
  }

  /**
   * Выполняет поглощение концепта
   */
  performAbsorption(concept, force) {
    // Увеличиваем массу черной дыры
    this.mass += force * 0.1;
    this.eventHorizon = this.mass * 2.0;
    this.schwartzchildRadius = 2 * this.mass;

    // Генерируем излучение Хокинга
    const hawkingEmission = this.generateHawkingRadiation(concept);
    this.hawkingRadiation.push({
      concept: hawkingEmission,
      energy: force * 0.05,
      timestamp: Date.now()
    });

    // Обновляем сингулярность
    this.updateSingularity(concept, force);

    SmartLogger.blackhole(`⚫ Концепт "${concept}" поглощен! Новая масса: ${this.mass.toFixed(3)}`);
  }

  /**
   * Добавляет концепт в диск аккреции
   */
  addToAccretionDisk(concept, distance, force) {
    const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(distance, 3) / this.mass);
    const temperature = Math.pow(this.mass / distance, 0.25) * 1000; // Температура диска

    this.accretionDisk.set(concept, {
      distance,
      orbitalPeriod,
      temperature,
      angularVelocity: 2 * Math.PI / orbitalPeriod,
      force,
      addedAt: Date.now()
    });

    SmartLogger.blackhole(`🌀 Концепт "${concept}" добавлен в диск аккреции (расстояние: ${distance.toFixed(2)}, период: ${orbitalPeriod.toFixed(2)})`);
  }

  /**
   * Генерирует излучение Хокинга
   */
  generateHawkingRadiation(concept) {
    const temperature = 1 / (8 * Math.PI * this.mass); // Температура Хокинга
    const variations = [
      concept + '_fragment',
      concept + '_echo',
      concept + '_shadow',
      concept + '_whisper',
      concept + '_ghost'
    ];
    
    return variations[Math.floor(Math.random() * variations.length)];
  }

  /**
   * Обновляет сингулярность
   */
  updateSingularity(concept, force) {
    this.singularity.density = Infinity;
    this.singularity.temperature = 1 / (8 * Math.PI * this.mass);
    
    // Создаем суперпозицию всех поглощенных концептов
    if (!this.singularity.superposition) {
      this.singularity.superposition = [];
    }
    
    this.singularity.superposition.push({
      concept,
      contributionWeight: force / this.mass,
      timestamp: Date.now()
    });
  }

  /**
   * Вычисляет гравитационную силу
   */
  calculateGravitationalForce(distance) {
    const G = 6.67430e-11; // Гравитационная постоянная (адаптирована для семантики)
    return (G * this.mass) / Math.pow(distance, 2);
  }

  /**
   * Проверяет возможность создания червоточины
   */
  canCreateWormhole(otherBlackHole) {
    const distance = this.calculateDistance(otherBlackHole);
    const combinedMass = this.mass + otherBlackHole.mass;
    const criticalDistance = combinedMass * 5; // Критическое расстояние
    
    return distance <= criticalDistance && this.mass > 5.0 && otherBlackHole.mass > 5.0;
  }

  /**
   * Вычисляет расстояние до другой черной дыры
   */
  calculateDistance(otherBlackHole) {
    const dx = this.position.x - otherBlackHole.position.x;
    const dy = this.position.y - otherBlackHole.position.y;
    const dz = this.position.z - otherBlackHole.position.z;
    const dw = this.position.w - otherBlackHole.position.w;
    
    return Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
  }

  /**
   * Эволюция черной дыры
   */
  evolve(deltaTime) {
    // Испарение через излучение Хокинга
    const evaporationRate = 1 / Math.pow(this.mass, 2);
    this.mass -= evaporationRate * deltaTime * 0.001;
    
    // Вращение диска аккреции
    for (const [concept, diskData] of this.accretionDisk) {
      diskData.angularVelocity += deltaTime * 0.01;
      
      // Концепты могут упасть в черную дыру
      if (Math.random() < 0.1) {
        this.absorb(concept, diskData.distance * 0.9);
        this.accretionDisk.delete(concept);
      }
    }

    // Обновляем параметры
    this.eventHorizon = this.mass * 2.0;
    this.schwartzchildRadius = 2 * this.mass;
    this.timeDialation = 1 / Math.sqrt(1 - this.schwartzchildRadius / this.eventHorizon);
  }

  /**
   * Экспортирует состояние черной дыры
   */
  export() {
    return {
      id: this.id,
      mass: this.mass,
      position: this.position,
      eventHorizon: this.eventHorizon,
      schwartzchildRadius: this.schwartzchildRadius,
      accretionDiskSize: this.accretionDisk.size,
      hawkingRadiationCount: this.hawkingRadiation.length,
      singularity: this.singularity,
      timeDialation: this.timeDialation,
      age: Date.now() - this.createdAt
    };
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

/**
 * СЕМАНТИЧЕСКАЯ ЧЕРВОТОЧИНА
 * Мгновенный туннель между удаленными точками семантического пространства
 */
class SemanticWormhole {
  constructor(id, entrance, exit, stability = 0.5) {
    this.id = id;
    this.entrance = entrance; // Черная дыра входа
    this.exit = exit; // Черная дыра выхода
    this.stability = stability;
    this.throatRadius = Math.min(entrance.eventHorizon, exit.eventHorizon) * 0.5;
    this.length = this.calculateLength();
    this.traversalTime = this.calculateTraversalTime();
    this.exoticMatter = this.generateExoticMatter();
    this.causalityViolations = [];
    this.informationLoss = 0.1; // Потеря информации при путешествии
    this.temporalShift = Math.random() * 2 - 1; // Временной сдвиг
    this.createdAt = Date.now();
  }

  /**
   * Вычисляет длину червоточины
   */
  calculateLength() {
    const spatialDistance = this.entrance.calculateDistance(this.exit);
    const dimensionalFold = Math.abs(this.entrance.position.dimension - this.exit.position.dimension);
    return Math.sqrt(spatialDistance * spatialDistance + dimensionalFold * dimensionalFold);
  }

  /**
   * Вычисляет время прохождения
   */
  calculateTraversalTime() {
    const baseTime = this.length / 299792458; // Скорость света
    const stabilityFactor = 1 / this.stability;
    return baseTime * stabilityFactor;
  }

  /**
   * Генерирует экзотическую материю для стабилизации
   */
  generateExoticMatter() {
    return {
      density: -Math.abs(this.entrance.mass + this.exit.mass) * 0.1, // Отрицательная плотность
      pressure: Math.abs(this.entrance.mass - this.exit.mass) * 0.05,
      energyCondition: 'violated', // Нарушение условий энергии
      casimirEffect: Math.random() * 0.1,
      quantumFluctuations: Math.random() * 0.2
    };
  }

  /**
   * Путешествие через червоточину
   */
  traverse(concept, direction = 'forward') {
    SmartLogger.blackhole(`🌀 Путешествие концепта "${concept}" через червоточину ${this.id} (направление: ${direction})`);

    if (this.stability < 0.2) {
      SmartLogger.blackhole(`⚠️ Червоточина нестабильна! Возможны искажения`);
      return this.handleUnstableTraversal(concept);
    }

    const travelResult = {
      originalConcept: concept,
      transformedConcept: concept,
      success: true,
      informationLoss: this.informationLoss,
      temporalShift: this.temporalShift,
      causalityViolated: false,
      traversalTime: this.traversalTime,
      exoticMatterInteraction: this.calculateExoticMatterInteraction(concept)
    };

    // Применяем трансформации
    travelResult.transformedConcept = this.applyTraversalTransformations(concept);

    // Проверяем нарушения причинности
    if (this.temporalShift < -0.5) {
      travelResult.causalityViolated = true;
      this.causalityViolations.push({
        concept: concept,
        violation: 'temporal_paradox',
        timestamp: Date.now()
      });
    }

    // Обновляем стабильность
    this.stability -= 0.01;

    SmartLogger.blackhole(`✅ Путешествие завершено: "${concept}" → "${travelResult.transformedConcept}"`);

    return travelResult;
  }

  /**
   * Обрабатывает нестабильное путешествие
   */
  handleUnstableTraversal(concept) {
    const disasters = [
      'concept_fragmentation',
      'meaning_inversion',
      'temporal_loop',
      'dimensional_shift',
      'information_paradox'
    ];

    const disaster = disasters[Math.floor(Math.random() * disasters.length)];
    
    return {
      originalConcept: concept,
      transformedConcept: concept + '_' + disaster,
      success: false,
      disaster: disaster,
      stability: this.stability,
      recovery_possible: this.stability > 0.1
    };
  }

  /**
   * Применяет трансформации при путешествии
   */
  applyTraversalTransformations(concept) {
    let transformed = concept;

    // Потеря информации
    if (Math.random() < this.informationLoss) {
      transformed = transformed.substring(0, Math.max(1, transformed.length - 1));
    }

    // Взаимодействие с экзотической материей
    if (Math.random() < Math.abs(this.exoticMatter.density)) {
      transformed = 'exotic_' + transformed;
    }

    // Временной сдвиг
    if (this.temporalShift > 0.3) {
      transformed = 'future_' + transformed;
    } else if (this.temporalShift < -0.3) {
      transformed = 'past_' + transformed;
    }

    return transformed;
  }

  /**
   * Вычисляет взаимодействие с экзотической материей
   */
  calculateExoticMatterInteraction(concept) {
    return {
      energyBorrowed: Math.abs(this.exoticMatter.density) * concept.length,
      virtualParticles: Math.floor(this.exoticMatter.quantumFluctuations * 10),
      casimirForce: this.exoticMatter.casimirEffect,
      spacetimeCurvature: this.exoticMatter.pressure * 0.1
    };
  }

  /**
   * Проверяет стабильность червоточины
   */
  checkStability() {
    const massImbalance = Math.abs(this.entrance.mass - this.exit.mass);
    const distanceStrain = this.length / 100;
    const ageDecay = (Date.now() - this.createdAt) / 1000000;

    this.stability = Math.max(0, this.stability - massImbalance * 0.01 - distanceStrain * 0.005 - ageDecay * 0.001);

    if (this.stability < 0.1) {
      SmartLogger.blackhole(`⚠️ Червоточина ${this.id} критически нестабильна!`);
    }

    return this.stability;
  }

  /**
   * Экспортирует состояние червоточины
   */
  export() {
    return {
      id: this.id,
      entrance: this.entrance.id,
      exit: this.exit.id,
      stability: this.stability,
      throatRadius: this.throatRadius,
      length: this.length,
      traversalTime: this.traversalTime,
      exoticMatter: this.exoticMatter,
      causalityViolations: this.causalityViolations.length,
      informationLoss: this.informationLoss,
      temporalShift: this.temporalShift,
      age: Date.now() - this.createdAt
    };
  }
}

/**
 * МЕНЕДЖЕР СЕМАНТИЧЕСКИХ ЧЕРНЫХ ДЫР И ЧЕРВОТОЧИН
 */
class SemanticBlackHoleManager {
  constructor() {
    this.blackHoles = new Map();
    this.wormholes = new Map();
    this.totalBlackHoles = 0;
    this.totalWormholes = 0;
    this.evolutionInterval = null;
    this.criticalMassThreshold = 10.0;
    this.wormholeCreationThreshold = 0.7;
  }

  /**
   * Создает новую черную дыру
   */
  createBlackHole(concept, initialMass = 1.0) {
    const id = `blackhole_${this.totalBlackHoles + 1}_${Date.now()}`;
    const blackHole = new SemanticBlackHole(id, concept, initialMass);
    
    this.blackHoles.set(id, blackHole);
    this.totalBlackHoles++;

    SmartLogger.blackhole(`🕳️ Создана семантическая черная дыра: ${id} для концепта "${concept}"`);

    // Проверяем возможность создания червоточин
    this.checkWormholeCreation(blackHole);

    return blackHole;
  }

  /**
   * Проверяет возможность создания червоточин
   */
  checkWormholeCreation(newBlackHole) {
    for (const [id, existingBlackHole] of this.blackHoles) {
      if (id !== newBlackHole.id && newBlackHole.canCreateWormhole(existingBlackHole)) {
        if (Math.random() < this.wormholeCreationThreshold) {
          this.createWormhole(newBlackHole, existingBlackHole);
        }
      }
    }
  }

  /**
   * Создает червоточину между двумя черными дырами
   */
  createWormhole(blackHole1, blackHole2) {
    const id = `wormhole_${this.totalWormholes + 1}_${Date.now()}`;
    const stability = Math.random() * 0.6 + 0.4; // 0.4-1.0
    const wormhole = new SemanticWormhole(id, blackHole1, blackHole2, stability);
    
    this.wormholes.set(id, wormhole);
    this.totalWormholes++;

    SmartLogger.blackhole(`🌀 Создана червоточина: ${id} между ${blackHole1.id} и ${blackHole2.id}`);

    return wormhole;
  }

  /**
   * Обрабатывает концепт через систему черных дыр
   */
  processConceptThroughBlackHoles(concept, semanticWeight = 1.0) {
    const results = {
      originalConcept: concept,
      processedConcept: concept,
      blackHoleInteractions: [],
      wormholeTraversals: [],
      hawkingRadiation: [],
      informationLoss: 0,
      finalState: 'processed'
    };

    // Находим ближайшую черную дыру
    const nearestBlackHole = this.findNearestBlackHole(concept);
    if (nearestBlackHole) {
      const distance = this.calculateSemanticDistance(concept, nearestBlackHole.singularity.concept);
      const absorptionResult = nearestBlackHole.absorb(concept, distance);
      
      results.blackHoleInteractions.push({
        blackHoleId: nearestBlackHole.id,
        result: absorptionResult,
        distance: distance
      });

      if (absorptionResult.absorbed) {
        results.finalState = 'absorbed';
        results.informationLoss = 0.8;
      } else {
        results.finalState = 'orbiting';
        results.informationLoss = 0.1;
      }
    }

    // Проверяем возможность путешествия через червоточины
    if (results.finalState === 'orbiting') {
      const traversalResult = this.attemptWormholeTraversal(concept);
      if (traversalResult) {
        results.wormholeTraversals.push(traversalResult);
        results.processedConcept = traversalResult.transformedConcept;
        results.informationLoss += traversalResult.informationLoss;
      }
    }

    // Собираем излучение Хокинга
    for (const [id, blackHole] of this.blackHoles) {
      if (blackHole.hawkingRadiation.length > 0) {
        results.hawkingRadiation.push(...blackHole.hawkingRadiation);
      }
    }

    return results;
  }

  /**
   * Находит ближайшую черную дыру
   */
  findNearestBlackHole(concept) {
    let nearest = null;
    let minDistance = Infinity;

    for (const [id, blackHole] of this.blackHoles) {
      const distance = this.calculateSemanticDistance(concept, blackHole.singularity.concept);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = blackHole;
      }
    }

    return nearest;
  }

  /**
   * Пытается путешествие через червоточину
   */
  attemptWormholeTraversal(concept) {
    const availableWormholes = Array.from(this.wormholes.values()).filter(wh => wh.stability > 0.3);
    
    if (availableWormholes.length === 0) return null;

    const selectedWormhole = availableWormholes[Math.floor(Math.random() * availableWormholes.length)];
    return selectedWormhole.traverse(concept);
  }

  /**
   * Вычисляет семантическое расстояние
   */
  calculateSemanticDistance(concept1, concept2) {
    // Упрощенная мера семантического расстояния
    const hash1 = this.hashString(concept1);
    const hash2 = this.hashString(concept2);
    return Math.abs(hash1 - hash2) / 1000000;
  }

  /**
   * Запускает эволюцию системы
   */
  startEvolution() {
    this.evolutionInterval = setInterval(() => {
      this.evolveSystem();
    }, 1000); // Каждую секунду

    SmartLogger.blackhole(`🌌 Запущена эволюция системы черных дыр и червоточин`);
  }

  /**
   * Эволюционирует систему
   */
  evolveSystem() {
    const deltaTime = 1.0; // 1 секунда

    // Эволюция черных дыр
    for (const [id, blackHole] of this.blackHoles) {
      blackHole.evolve(deltaTime);
      
      // Удаляем испарившиеся черные дыры
      if (blackHole.mass < 0.1) {
        this.blackHoles.delete(id);
        SmartLogger.blackhole(`💨 Черная дыра ${id} испарилась`);
      }
    }

    // Проверка стабильности червоточин
    for (const [id, wormhole] of this.wormholes) {
      wormhole.checkStability();
      
      // Удаляем коллапсированные червоточины
      if (wormhole.stability < 0.05) {
        this.wormholes.delete(id);
        SmartLogger.blackhole(`💥 Червоточина ${id} коллапсировала`);
      }
    }

    // Попытка создания новых червоточин
    if (Math.random() < 0.1) {
      this.attemptSpontaneousWormholeCreation();
    }
  }

  /**
   * Попытка спонтанного создания червоточины
   */
  attemptSpontaneousWormholeCreation() {
    const blackHoleList = Array.from(this.blackHoles.values());
    if (blackHoleList.length < 2) return;

    for (let i = 0; i < blackHoleList.length; i++) {
      for (let j = i + 1; j < blackHoleList.length; j++) {
        const bh1 = blackHoleList[i];
        const bh2 = blackHoleList[j];
        
        if (bh1.canCreateWormhole(bh2) && Math.random() < 0.05) {
          this.createWormhole(bh1, bh2);
          return;
        }
      }
    }
  }

  /**
   * Останавливает эволюцию
   */
  stopEvolution() {
    if (this.evolutionInterval) {
      clearInterval(this.evolutionInterval);
      this.evolutionInterval = null;
      SmartLogger.blackhole(`⏹️ Эволюция системы остановлена`);
    }
  }

  /**
   * Получает статистику системы
   */
  getSystemStatistics() {
    const blackHoleStats = Array.from(this.blackHoles.values()).map(bh => bh.export());
    const wormholeStats = Array.from(this.wormholes.values()).map(wh => wh.export());

    return {
      totalBlackHoles: this.blackHoles.size,
      totalWormholes: this.wormholes.size,
      averageBlackHoleMass: blackHoleStats.reduce((sum, bh) => sum + bh.mass, 0) / blackHoleStats.length || 0,
      averageWormholeStability: wormholeStats.reduce((sum, wh) => sum + wh.stability, 0) / wormholeStats.length || 0,
      totalHawkingRadiation: blackHoleStats.reduce((sum, bh) => sum + bh.hawkingRadiationCount, 0),
      causalityViolations: wormholeStats.reduce((sum, wh) => sum + wh.causalityViolations, 0),
      systemAge: Date.now() - (Math.min(...blackHoleStats.map(bh => bh.age)) || Date.now()),
      criticalEvents: {
        superMassiveBlackHoles: blackHoleStats.filter(bh => bh.mass > this.criticalMassThreshold).length,
        unstableWormholes: wormholeStats.filter(wh => wh.stability < 0.3).length,
        recentlyCreated: blackHoleStats.filter(bh => bh.age < 60000).length
      }
    };
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

module.exports = {
  SemanticBlackHoleManager,
  SemanticBlackHole,
  SemanticWormhole
};
