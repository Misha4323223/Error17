
/**
 * 🧪⚗️ СЕМАНТИЧЕСКАЯ АЛХИМИЯ
 * Трансформация и синтез семантических элементов
 * Создание новых значений из существующих компонентов
 */

const SmartLogger = {
  alchemy: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧪⚗️ [${timestamp}] SEMANTIC-ALCHEMY: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * СЕМАНТИЧЕСКИЙ ЭЛЕМЕНТ
 * Базовая единица семантической алхимии
 */
class SemanticElement {
  constructor(name, essence, properties = {}) {
    this.name = name;
    this.essence = essence; // Сущность элемента (0-1)
    this.properties = properties;
    this.stability = Math.random(); // Стабильность элемента
    this.reactivity = Math.random(); // Реактивность с другими элементами
    this.purity = 1.0; // Чистота элемента
    this.charge = (Math.random() - 0.5) * 2; // Семантический заряд (-1 до 1)
    this.resonance = new Map(); // Резонанс с другими элементами
    this.transmutationHistory = []; // История трансформаций
    this.bondingCapacity = Math.floor(Math.random() * 5) + 1; // Способность к связям
    this.currentBonds = [];
    this.energyLevel = Math.random(); // Энергетический уровень
  }

  /**
   * Вычисляет совместимость с другим элементом
   */
  calculateCompatibility(otherElement) {
    // Базовая совместимость на основе зарядов
    const chargeCompatibility = 1 - Math.abs(this.charge - otherElement.charge) / 2;
    
    // Совместимость реактивности
    const reactivityCompatibility = 1 - Math.abs(this.reactivity - otherElement.reactivity);
    
    // Энергетическая совместимость
    const energyCompatibility = 1 - Math.abs(this.energyLevel - otherElement.energyLevel);
    
    // Структурная совместимость
    const structuralCompatibility = this.calculateStructuralCompatibility(otherElement);
    
    return {
      total: (chargeCompatibility + reactivityCompatibility + energyCompatibility + structuralCompatibility) / 4,
      charge: chargeCompatibility,
      reactivity: reactivityCompatibility,
      energy: energyCompatibility,
      structural: structuralCompatibility
    };
  }

  /**
   * Вычисляет структурную совместимость
   */
  calculateStructuralCompatibility(otherElement) {
    const thisProps = Object.keys(this.properties);
    const otherProps = Object.keys(otherElement.properties);
    const commonProps = thisProps.filter(prop => otherProps.includes(prop));
    
    if (commonProps.length === 0) return 0.5; // Нейтральная совместимость
    
    let compatibility = 0;
    for (const prop of commonProps) {
      const thisProp = this.properties[prop];
      const otherProp = otherElement.properties[prop];
      
      if (typeof thisProp === 'number' && typeof otherProp === 'number') {
        compatibility += 1 - Math.abs(thisProp - otherProp);
      } else if (thisProp === otherProp) {
        compatibility += 1;
      }
    }
    
    return compatibility / commonProps.length;
  }

  /**
   * Создает связь с другим элементом
   */
  bondWith(otherElement, bondType = 'covalent') {
    if (this.currentBonds.length >= this.bondingCapacity) {
      return { success: false, reason: 'bonding_capacity_exceeded' };
    }
    
    if (otherElement.currentBonds.length >= otherElement.bondingCapacity) {
      return { success: false, reason: 'partner_bonding_capacity_exceeded' };
    }
    
    const compatibility = this.calculateCompatibility(otherElement);
    
    if (compatibility.total < 0.3) {
      return { success: false, reason: 'incompatible_elements' };
    }
    
    const bond = {
      partner: otherElement,
      type: bondType,
      strength: compatibility.total,
      createdAt: Date.now(),
      stability: (this.stability + otherElement.stability) / 2
    };
    
    this.currentBonds.push(bond);
    otherElement.currentBonds.push({
      ...bond,
      partner: this
    });
    
    // Обновляем резонанс
    this.resonance.set(otherElement.name, compatibility.total);
    otherElement.resonance.set(this.name, compatibility.total);
    
    SmartLogger.alchemy(`🔗 Создана связь ${bondType} между ${this.name} и ${otherElement.name} (сила: ${compatibility.total.toFixed(2)})`);
    
    return { success: true, bond, compatibility };
  }

  /**
   * Разрывает связь с элементом
   */
  breakBondWith(otherElement) {
    this.currentBonds = this.currentBonds.filter(bond => bond.partner !== otherElement);
    otherElement.currentBonds = otherElement.currentBonds.filter(bond => bond.partner !== this);
    
    this.resonance.delete(otherElement.name);
    otherElement.resonance.delete(this.name);
    
    SmartLogger.alchemy(`💥 Разорвана связь между ${this.name} и ${otherElement.name}`);
  }

  /**
   * Трансмутирует элемент под воздействием катализатора
   */
  transmute(catalyst, targetProperties = {}) {
    const transmutation = {
      originalName: this.name,
      originalEssence: this.essence,
      originalProperties: { ...this.properties },
      catalyst: catalyst.name,
      timestamp: Date.now()
    };
    
    // Применяем воздействие катализатора
    this.essence = Math.min(1, Math.max(0, this.essence + catalyst.potency * 0.1));
    
    // Изменяем свойства
    for (const [key, value] of Object.entries(targetProperties)) {
      if (typeof value === 'number') {
        this.properties[key] = (this.properties[key] || 0) + value * catalyst.efficiency;
      } else {
        this.properties[key] = value;
      }
    }
    
    // Обновляем характеристики
    this.purity *= (1 - catalyst.impurityIntroduction);
    this.stability += catalyst.stabilityEffect;
    this.stability = Math.min(1, Math.max(0, this.stability));
    
    transmutation.newName = this.name;
    transmutation.newEssence = this.essence;
    transmutation.newProperties = { ...this.properties };
    
    this.transmutationHistory.push(transmutation);
    
    SmartLogger.alchemy(`🔄 Трансмутация ${transmutation.originalName} → ${this.name} с катализатором ${catalyst.name}`);
    
    return transmutation;
  }

  /**
   * Экспортирует состояние элемента
   */
  export() {
    return {
      name: this.name,
      essence: this.essence,
      properties: this.properties,
      stability: this.stability,
      reactivity: this.reactivity,
      purity: this.purity,
      charge: this.charge,
      energyLevel: this.energyLevel,
      bondingCapacity: this.bondingCapacity,
      currentBondsCount: this.currentBonds.length,
      resonanceCount: this.resonance.size,
      transmutations: this.transmutationHistory.length
    };
  }
}

/**
 * АЛХИМИЧЕСКИЙ КАТАЛИЗАТОР
 * Агент, ускоряющий и направляющий семантические трансформации
 */
class AlchemicalCatalyst {
  constructor(name, potency = 0.5, efficiency = 0.7) {
    this.name = name;
    this.potency = potency; // Сила воздействия
    this.efficiency = efficiency; // Эффективность трансформации
    this.selectivity = Math.random(); // Селективность к определенным элементам
    this.durability = Math.random(); // Стойкость катализатора
    this.impurityIntroduction = Math.random() * 0.1; // Внесение примесей
    this.stabilityEffect = (Math.random() - 0.5) * 0.2; // Влияние на стабильность
    this.activationEnergy = Math.random(); // Энергия активации
    this.usageCount = 0;
    this.maxUsages = Math.floor(Math.random() * 50) + 10;
  }

  /**
   * Проверяет, может ли катализатор действовать на элемент
   */
  canCatalyze(element) {
    if (this.usageCount >= this.maxUsages) {
      return { canCatalyze: false, reason: 'catalyst_exhausted' };
    }
    
    if (element.energyLevel < this.activationEnergy) {
      return { canCatalyze: false, reason: 'insufficient_activation_energy' };
    }
    
    const selectivityMatch = this.calculateSelectivityMatch(element);
    
    if (selectivityMatch < 0.3) {
      return { canCatalyze: false, reason: 'selectivity_mismatch' };
    }
    
    return { canCatalyze: true, selectivityMatch };
  }

  /**
   * Вычисляет соответствие селективности
   */
  calculateSelectivityMatch(element) {
    // Упрощенная селективность на основе заряда и реактивности
    const chargeMatch = 1 - Math.abs(this.selectivity - Math.abs(element.charge));
    const reactivityMatch = element.reactivity * this.selectivity;
    
    return (chargeMatch + reactivityMatch) / 2;
  }

  /**
   * Использует катализатор
   */
  use() {
    this.usageCount++;
    this.durability *= 0.99; // Небольшая деградация
    
    if (this.usageCount >= this.maxUsages) {
      SmartLogger.alchemy(`⚠️ Катализатор ${this.name} исчерпан после ${this.usageCount} использований`);
    }
  }

  /**
   * Восстанавливает катализатор
   */
  regenerate(efficiency = 0.8) {
    this.usageCount = Math.floor(this.usageCount * (1 - efficiency));
    this.durability = Math.min(1, this.durability + efficiency * 0.2);
    
    SmartLogger.alchemy(`🔄 Катализатор ${this.name} восстановлен (эффективность: ${efficiency})`);
  }

  /**
   * Экспортирует состояние катализатора
   */
  export() {
    return {
      name: this.name,
      potency: this.potency,
      efficiency: this.efficiency,
      selectivity: this.selectivity,
      durability: this.durability,
      usageCount: this.usageCount,
      maxUsages: this.maxUsages,
      remainingUses: this.maxUsages - this.usageCount
    };
  }
}

/**
 * АЛХИМИЧЕСКАЯ РЕАКЦИЯ
 * Представляет процесс взаимодействия семантических элементов
 */
class AlchemicalReaction {
  constructor(reactants, catalyst = null, conditions = {}) {
    this.reactants = reactants; // Массив входных элементов
    this.catalyst = catalyst;
    this.conditions = conditions; // Условия реакции
    this.products = []; // Продукты реакции
    this.byproducts = []; // Побочные продукты
    this.reactionType = this.determineReactionType();
    this.energyChange = 0; // Изменение энергии
    this.entropy = 0; // Изменение энтропии
    this.reversible = Math.random() > 0.7; // Обратимость реакции
    this.completionRate = 0; // Степень завершенности
    this.reactionTime = 0;
    this.side_effects = [];
  }

  /**
   * Определяет тип реакции
   */
  determineReactionType() {
    if (this.reactants.length === 1) {
      return 'decomposition'; // Разложение
    } else if (this.reactants.length === 2) {
      const compatibility = this.reactants[0].calculateCompatibility(this.reactants[1]);
      if (compatibility.total > 0.7) {
        return 'synthesis'; // Синтез
      } else {
        return 'substitution'; // Замещение
      }
    } else {
      return 'complex'; // Сложная реакция
    }
  }

  /**
   * Запускает реакцию
   */
  async executeReaction() {
    SmartLogger.alchemy(`🧪 Запуск ${this.reactionType} реакции с ${this.reactants.length} реагентами`);
    
    const startTime = Date.now();
    
    // Проверяем условия для реакции
    const conditionsCheck = this.checkReactionConditions();
    if (!conditionsCheck.suitable) {
      return {
        success: false,
        reason: 'unsuitable_conditions',
        details: conditionsCheck.issues
      };
    }
    
    // Применяем катализатор, если есть
    if (this.catalyst) {
      const catalysisResult = this.applyCatalyst();
      if (!catalysisResult.success) {
        return {
          success: false,
          reason: 'catalyst_failure',
          details: catalysisResult.reason
        };
      }
    }
    
    // Выполняем реакцию в зависимости от типа
    let reactionResult;
    switch (this.reactionType) {
      case 'synthesis':
        reactionResult = this.performSynthesis();
        break;
      case 'decomposition':
        reactionResult = this.performDecomposition();
        break;
      case 'substitution':
        reactionResult = this.performSubstitution();
        break;
      case 'complex':
        reactionResult = this.performComplexReaction();
        break;
      default:
        reactionResult = { success: false, reason: 'unknown_reaction_type' };
    }
    
    this.reactionTime = Date.now() - startTime;
    
    // Вычисляем термодинамические параметры
    this.calculateThermodynamics();
    
    // Генерируем побочные эффекты
    this.generateSideEffects();
    
    SmartLogger.alchemy(`✅ Реакция завершена за ${this.reactionTime}мс. Продуктов: ${this.products.length}`);
    
    return {
      success: reactionResult.success,
      products: this.products,
      byproducts: this.byproducts,
      energyChange: this.energyChange,
      entropy: this.entropy,
      completionRate: this.completionRate,
      reactionTime: this.reactionTime,
      sideEffects: this.side_effects,
      reversible: this.reversible
    };
  }

  /**
   * Проверяет условия реакции
   */
  checkReactionConditions() {
    const issues = [];
    
    // Проверяем температуру (энергетический уровень)
    const avgEnergy = this.reactants.reduce((sum, r) => sum + r.energyLevel, 0) / this.reactants.length;
    const requiredEnergy = this.conditions.temperature || 0.5;
    
    if (avgEnergy < requiredEnergy) {
      issues.push('insufficient_energy');
    }
    
    // Проверяем давление (стабильность)
    const avgStability = this.reactants.reduce((sum, r) => sum + r.stability, 0) / this.reactants.length;
    const requiredStability = this.conditions.pressure || 0.3;
    
    if (avgStability < requiredStability) {
      issues.push('insufficient_stability');
    }
    
    // Проверяем чистоту реагентов
    const minPurity = Math.min(...this.reactants.map(r => r.purity));
    const requiredPurity = this.conditions.purity || 0.5;
    
    if (minPurity < requiredPurity) {
      issues.push('insufficient_purity');
    }
    
    return {
      suitable: issues.length === 0,
      issues
    };
  }

  /**
   * Применяет катализатор
   */
  applyCatalyst() {
    for (const reactant of this.reactants) {
      const canCatalyze = this.catalyst.canCatalyze(reactant);
      if (!canCatalyze.canCatalyze) {
        return { success: false, reason: canCatalyze.reason };
      }
    }
    
    // Катализатор ускоряет реакцию и может изменить продукты
    this.catalyst.use();
    
    return { success: true };
  }

  /**
   * Выполняет синтез (объединение элементов)
   */
  performSynthesis() {
    if (this.reactants.length < 2) {
      return { success: false, reason: 'insufficient_reactants_for_synthesis' };
    }
    
    const primaryReactant = this.reactants[0];
    const secondaryReactant = this.reactants[1];
    
    // Создаем новый элемент как комбинацию входных
    const newElement = new SemanticElement(
      `${primaryReactant.name}_${secondaryReactant.name}_compound`,
      (primaryReactant.essence + secondaryReactant.essence) / 2,
      this.combineProperties(primaryReactant.properties, secondaryReactant.properties)
    );
    
    // Наследуем характеристики
    newElement.stability = (primaryReactant.stability + secondaryReactant.stability) / 2;
    newElement.reactivity = Math.max(primaryReactant.reactivity, secondaryReactant.reactivity) * 0.8;
    newElement.purity = Math.min(primaryReactant.purity, secondaryReactant.purity) * 0.9;
    newElement.charge = (primaryReactant.charge + secondaryReactant.charge) / 2;
    newElement.energyLevel = (primaryReactant.energyLevel + secondaryReactant.energyLevel) / 2;
    
    // Добавляем связь между исходными элементами в новом элементе
    newElement.properties.synthesis_components = [primaryReactant.name, secondaryReactant.name];
    
    this.products.push(newElement);
    this.completionRate = 0.8 + Math.random() * 0.2;
    
    return { success: true };
  }

  /**
   * Выполняет разложение элемента
   */
  performDecomposition() {
    const element = this.reactants[0];
    
    // Создаем компоненты разложения
    const components = this.extractComponents(element);
    
    for (const component of components) {
      const newElement = new SemanticElement(
        `${element.name}_${component.name}`,
        element.essence * component.ratio,
        component.properties
      );
      
      newElement.stability = element.stability * 0.7;
      newElement.reactivity = element.reactivity * 1.2;
      newElement.purity = element.purity * 0.95;
      
      this.products.push(newElement);
    }
    
    this.completionRate = 0.6 + Math.random() * 0.3;
    
    return { success: true };
  }

  /**
   * Выполняет замещение
   */
  performSubstitution() {
    const primaryElement = this.reactants[0];
    const substituentElement = this.reactants[1];
    
    // Создаем модифицированный элемент
    const modifiedElement = new SemanticElement(
      `${primaryElement.name}_modified`,
      primaryElement.essence,
      { ...primaryElement.properties }
    );
    
    // Замещаем некоторые свойства
    const substitutionRate = substituentElement.reactivity;
    for (const [key, value] of Object.entries(substituentElement.properties)) {
      if (Math.random() < substitutionRate) {
        modifiedElement.properties[key] = value;
      }
    }
    
    modifiedElement.stability = primaryElement.stability * 0.9;
    modifiedElement.charge = (primaryElement.charge + substituentElement.charge * 0.3);
    
    this.products.push(modifiedElement);
    
    // Создаем побочный продукт
    const byproduct = new SemanticElement(
      `${primaryElement.name}_residue`,
      primaryElement.essence * 0.2,
      {}
    );
    this.byproducts.push(byproduct);
    
    this.completionRate = 0.7 + Math.random() * 0.2;
    
    return { success: true };
  }

  /**
   * Выполняет сложную реакцию
   */
  performComplexReaction() {
    // Сложная реакция с множественными стадиями
    const intermediates = [];
    
    // Стадия 1: парные взаимодействия
    for (let i = 0; i < this.reactants.length - 1; i += 2) {
      const reaction = new AlchemicalReaction([this.reactants[i], this.reactants[i + 1]]);
      const result = reaction.performSynthesis();
      
      if (result.success && reaction.products.length > 0) {
        intermediates.push(reaction.products[0]);
      }
    }
    
    // Стадия 2: взаимодействие промежуточных продуктов
    if (intermediates.length > 1) {
      const finalReaction = new AlchemicalReaction(intermediates);
      const finalResult = finalReaction.performSynthesis();
      
      if (finalResult.success) {
        this.products.push(...finalReaction.products);
      }
    } else if (intermediates.length === 1) {
      this.products.push(intermediates[0]);
    }
    
    this.completionRate = 0.5 + Math.random() * 0.4;
    
    return { success: true };
  }

  /**
   * Объединяет свойства элементов
   */
  combineProperties(props1, props2) {
    const combined = { ...props1 };
    
    for (const [key, value] of Object.entries(props2)) {
      if (combined[key] !== undefined) {
        if (typeof value === 'number' && typeof combined[key] === 'number') {
          combined[key] = (combined[key] + value) / 2;
        }
        // Для нечисловых значений сохраняем первое
      } else {
        combined[key] = value;
      }
    }
    
    return combined;
  }

  /**
   * Извлекает компоненты для разложения
   */
  extractComponents(element) {
    const components = [];
    const properties = Object.keys(element.properties);
    
    // Создаем компоненты на основе свойств
    for (let i = 0; i < Math.min(3, properties.length); i++) {
      const property = properties[i];
      components.push({
        name: property,
        ratio: 0.2 + Math.random() * 0.3,
        properties: { [property]: element.properties[property] }
      });
    }
    
    // Добавляем базовый компонент
    components.push({
      name: 'base',
      ratio: 0.3,
      properties: { base_essence: element.essence }
    });
    
    return components;
  }

  /**
   * Вычисляет термодинамические параметры
   */
  calculateThermodynamics() {
    // Изменение энергии
    const reactantEnergy = this.reactants.reduce((sum, r) => sum + r.energyLevel, 0);
    const productEnergy = this.products.reduce((sum, p) => sum + p.energyLevel, 0);
    this.energyChange = productEnergy - reactantEnergy;
    
    // Изменение энтропии (меры беспорядка)
    const reactantComplexity = this.reactants.reduce((sum, r) => sum + Object.keys(r.properties).length, 0);
    const productComplexity = this.products.reduce((sum, p) => sum + Object.keys(p.properties).length, 0);
    this.entropy = (productComplexity - reactantComplexity) / Math.max(1, reactantComplexity);
  }

  /**
   * Генерирует побочные эффекты
   */
  generateSideEffects() {
    // Нестабильность
    if (this.completionRate < 0.7) {
      this.side_effects.push({
        type: 'instability',
        severity: 1 - this.completionRate,
        description: 'Неполная реакция привела к нестабильности продуктов'
      });
    }
    
    // Загрязнения
    if (this.catalyst && this.catalyst.impurityIntroduction > 0.05) {
      this.side_effects.push({
        type: 'contamination',
        severity: this.catalyst.impurityIntroduction,
        description: 'Катализатор внес примеси в продукты'
      });
    }
    
    // Энергетический дисбаланс
    if (Math.abs(this.energyChange) > 0.5) {
      this.side_effects.push({
        type: 'energy_imbalance',
        severity: Math.abs(this.energyChange),
        description: 'Значительное изменение энергии в системе'
      });
    }
  }

  /**
   * Экспортирует состояние реакции
   */
  export() {
    return {
      reactionType: this.reactionType,
      reactantsCount: this.reactants.length,
      productsCount: this.products.length,
      byproductsCount: this.byproducts.length,
      completionRate: this.completionRate,
      energyChange: this.energyChange,
      entropy: this.entropy,
      reactionTime: this.reactionTime,
      reversible: this.reversible,
      sideEffectsCount: this.side_effects.length,
      catalyst: this.catalyst ? this.catalyst.name : null
    };
  }
}

/**
 * СЕМАНТИЧЕСКАЯ АЛХИМИЯ - ГЛАВНЫЙ КЛАСС
 * Управляет всеми алхимическими процессами
 */
class SemanticAlchemy {
  constructor() {
    this.elements = new Map(); // Семантические элементы
    this.catalysts = new Map(); // Катализаторы
    this.reactions = []; // История реакций
    this.laboratory = new Map(); // Лабораторные условия
    this.formulas = new Map(); // Алхимические формулы
    this.artifacts = []; // Созданные артефакты
    this.masterLevel = 1; // Уровень мастерства алхимика
    this.elementalAffinities = new Map(); // Сродство к элементам
    this.transmutationEnergy = 100; // Энергия для трансмутаций
    this.maxEnergy = 100;
    
    this.initializeBasicElements();
    this.initializeBasicCatalysts();
    this.setupLaboratory();
  }

  /**
   * Инициализирует базовые семантические элементы
   */
  initializeBasicElements() {
    const basicElements = [
      { name: 'intent', essence: 0.8, properties: { purpose: 0.9, clarity: 0.7 } },
      { name: 'context', essence: 0.6, properties: { relevance: 0.8, depth: 0.6 } },
      { name: 'emotion', essence: 0.9, properties: { intensity: 0.8, valence: 0.5 } },
      { name: 'logic', essence: 0.7, properties: { consistency: 0.9, precision: 0.8 } },
      { name: 'creativity', essence: 0.8, properties: { novelty: 0.9, flexibility: 0.7 } },
      { name: 'memory', essence: 0.5, properties: { retention: 0.8, accessibility: 0.6 } },
      { name: 'knowledge', essence: 0.7, properties: { accuracy: 0.9, completeness: 0.6 } },
      { name: 'wisdom', essence: 0.9, properties: { depth: 0.9, applicability: 0.8 } }
    ];

    for (const elementData of basicElements) {
      const element = new SemanticElement(elementData.name, elementData.essence, elementData.properties);
      this.elements.set(element.name, element);
      this.elementalAffinities.set(element.name, Math.random());
    }

    SmartLogger.alchemy(`🧪 Инициализировано ${basicElements.length} базовых семантических элементов`);
  }

  /**
   * Инициализирует базовые катализаторы
   */
  initializeBasicCatalysts() {
    const basicCatalysts = [
      { name: 'attention', potency: 0.8, efficiency: 0.9 },
      { name: 'focus', potency: 0.7, efficiency: 0.8 },
      { name: 'inspiration', potency: 0.9, efficiency: 0.6 },
      { name: 'reflection', potency: 0.6, efficiency: 0.9 },
      { name: 'analysis', potency: 0.8, efficiency: 0.8 },
      { name: 'synthesis', potency: 0.7, efficiency: 0.7 },
      { name: 'intuition', potency: 0.9, efficiency: 0.5 }
    ];

    for (const catalystData of basicCatalysts) {
      const catalyst = new AlchemicalCatalyst(catalystData.name, catalystData.potency, catalystData.efficiency);
      this.catalysts.set(catalyst.name, catalyst);
    }

    SmartLogger.alchemy(`⚗️ Инициализировано ${basicCatalysts.length} базовых катализаторов`);
  }

  /**
   * Настраивает лабораторию
   */
  setupLaboratory() {
    this.laboratory.set('temperature', 0.5); // Энергетический уровень
    this.laboratory.set('pressure', 0.5); // Уровень стабильности
    this.laboratory.set('purity', 0.8); // Чистота среды
    this.laboratory.set('isolation', 0.9); // Изоляция от внешних воздействий
    this.laboratory.set('precision', 0.7); // Точность измерений

    SmartLogger.alchemy(`🏭 Семантическая лаборатория настроена`);
  }

  /**
   * Анализирует запрос для извлечения семантических элементов
   */
  async analyzeQueryForElements(query, context = {}) {
    SmartLogger.alchemy(`🔍 Алхимический анализ запроса: "${query.substring(0, 50)}..."`);

    const extractedElements = [];
    const elementCandidates = this.extractElementCandidates(query, context);

    for (const candidate of elementCandidates) {
      const element = this.createElement(candidate);
      if (element) {
        extractedElements.push(element);
      }
    }

    // Ищем возможные реакции между элементами
    const possibleReactions = this.identifyPossibleReactions(extractedElements);

    // Анализируем алхимический потенциал
    const alchemicalPotential = this.assessAlchemicalPotential(extractedElements, possibleReactions);

    return {
      extractedElements: extractedElements.map(e => e.export()),
      possibleReactions: possibleReactions.map(r => r.export()),
      alchemicalPotential,
      recommendations: this.generateAlchemicalRecommendations(extractedElements, possibleReactions)
    };
  }

  /**
   * Извлекает кандидатов на семантические элементы
   */
  extractElementCandidates(query, context) {
    const candidates = [];
    const words = query.toLowerCase().split(/\s+/);

    // Анализ намерений
    const intentWords = ['создай', 'сделай', 'нарисуй', 'измени', 'улучши'];
    if (intentWords.some(word => words.includes(word))) {
      candidates.push({
        name: 'user_intent',
        essence: 0.8,
        properties: { action_oriented: 0.9, specificity: this.calculateSpecificity(query) }
      });
    }

    // Анализ эмоциональной окраски
    const emotionalWords = ['красиво', 'ужасно', 'прекрасно', 'отлично', 'плохо'];
    const emotionalIntensity = emotionalWords.filter(word => words.includes(word)).length / emotionalWords.length;
    if (emotionalIntensity > 0) {
      candidates.push({
        name: 'emotional_charge',
        essence: emotionalIntensity,
        properties: { intensity: emotionalIntensity, polarity: this.determineEmotionalPolarity(words) }
      });
    }

    // Анализ технических терминов
    const technicalTerms = ['вектор', 'svg', 'пиксель', 'формат', 'оптимизация'];
    const technicalDensity = technicalTerms.filter(term => words.includes(term)).length / technicalTerms.length;
    if (technicalDensity > 0) {
      candidates.push({
        name: 'technical_knowledge',
        essence: technicalDensity,
        properties: { precision: technicalDensity, complexity: this.calculateTechnicalComplexity(words) }
      });
    }

    // Анализ контекста
    if (context.hasRecentImages) {
      candidates.push({
        name: 'visual_context',
        essence: 0.7,
        properties: { continuity: 0.8, relevance: 0.9 }
      });
    }

    if (context.sessionId) {
      candidates.push({
        name: 'session_memory',
        essence: 0.6,
        properties: { persistence: 0.8, coherence: 0.7 }
      });
    }

    return candidates;
  }

  /**
   * Создает семантический элемент
   */
  createElement(candidate) {
    const element = new SemanticElement(candidate.name, candidate.essence, candidate.properties);
    
    // Добавляем уникальный ID
    element.id = `${candidate.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return element;
  }

  /**
   * Идентифицирует возможные реакции
   */
  identifyPossibleReactions(elements) {
    const reactions = [];

    // Проверяем все возможные пары для синтеза
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const compatibility = elements[i].calculateCompatibility(elements[j]);
        
        if (compatibility.total > 0.5) {
          const reaction = new AlchemicalReaction([elements[i], elements[j]]);
          reactions.push(reaction);
        }
      }
    }

    // Проверяем разложение для сложных элементов
    for (const element of elements) {
      if (Object.keys(element.properties).length > 3) {
        const reaction = new AlchemicalReaction([element]);
        reactions.push(reaction);
      }
    }

    return reactions;
  }

  /**
   * Оценивает алхимический потенциал
   */
  assessAlchemicalPotential(elements, reactions) {
    let totalPotential = 0;

    // Потенциал от разнообразия элементов
    const diversityScore = elements.length / 10;
    totalPotential += diversityScore;

    // Потенциал от возможных реакций
    const reactionScore = reactions.length / 5;
    totalPotential += reactionScore;

    // Потенциал от стабильности элементов
    const avgStability = elements.reduce((sum, e) => sum + e.stability, 0) / Math.max(1, elements.length);
    totalPotential += avgStability;

    // Потенциал от энергетического уровня
    const avgEnergy = elements.reduce((sum, e) => sum + e.energyLevel, 0) / Math.max(1, elements.length);
    totalPotential += avgEnergy;

    return Math.min(1, totalPotential / 4);
  }

  /**
   * Генерирует алхимические рекомендации
   */
  generateAlchemicalRecommendations(elements, reactions) {
    const recommendations = [];

    // Рекомендации по синтезу
    const synthesesReactions = reactions.filter(r => r.reactionType === 'synthesis');
    if (synthesesReactions.length > 0) {
      recommendations.push({
        type: 'synthesis_opportunity',
        description: `Обнаружено ${synthesesReactions.length} возможных синтеза`,
        priority: 'high',
        suggestedCatalyst: this.suggestBestCatalyst(synthesesReactions[0])
      });
    }

    // Рекомендации по стабилизации
    const unstableElements = elements.filter(e => e.stability < 0.5);
    if (unstableElements.length > 0) {
      recommendations.push({
        type: 'stabilization_needed',
        description: `${unstableElements.length} элементов требуют стабилизации`,
        priority: 'medium',
        suggestedMethod: 'controlled_cooling'
      });
    }

    // Рекомендации по очистке
    const impureElements = elements.filter(e => e.purity < 0.7);
    if (impureElements.length > 0) {
      recommendations.push({
        type: 'purification_recommended',
        description: `${impureElements.length} элементов имеют низкую чистоту`,
        priority: 'low',
        suggestedMethod: 'crystallization'
      });
    }

    return recommendations;
  }

  /**
   * Предлагает лучший катализатор для реакции
   */
  suggestBestCatalyst(reaction) {
    let bestCatalyst = null;
    let bestScore = 0;

    for (const [name, catalyst] of this.catalysts) {
      const canCatalyze = catalyst.canCatalyze(reaction.reactants[0]);
      if (canCatalyze.canCatalyze) {
        const score = catalyst.efficiency * catalyst.potency * canCatalyze.selectivityMatch;
        if (score > bestScore) {
          bestScore = score;
          bestCatalyst = name;
        }
      }
    }

    return bestCatalyst;
  }

  /**
   * Выполняет алхимическую трансформацию запроса
   */
  async performSemanticTransmutation(query, targetOutcome, context = {}) {
    SmartLogger.alchemy(`🔄 Выполнение семантической трансмутации для: "${query.substring(0, 50)}..."`);

    if (this.transmutationEnergy < 10) {
      return {
        success: false,
        reason: 'insufficient_transmutation_energy',
        currentEnergy: this.transmutationEnergy
      };
    }

    // Анализируем исходные элементы
    const analysisResult = await this.analyzeQueryForElements(query, context);
    const sourceElements = analysisResult.extractedElements.map(data => {
      const element = new SemanticElement(data.name, data.essence, data.properties);
      Object.assign(element, data);
      return element;
    });

    // Определяем целевые свойства
    const targetProperties = this.defineTargetProperties(targetOutcome);

    // Выбираем оптимальный катализатор
    const catalyst = this.selectOptimalCatalyst(sourceElements, targetProperties);

    if (!catalyst) {
      return {
        success: false,
        reason: 'no_suitable_catalyst',
        availableCatalysts: Array.from(this.catalysts.keys())
      };
    }

    // Создаем план трансмутации
    const transmutationPlan = this.createTransmutationPlan(sourceElements, targetProperties, catalyst);

    // Выполняем трансмутацию
    const transmutationResult = await this.executeTransmutationPlan(transmutationPlan);

    // Тратим энергию
    this.transmutationEnergy -= 10;

    // Обновляем мастерство
    if (transmutationResult.success) {
      this.gainMasteryExperience(transmutationResult.complexity);
    }

    SmartLogger.alchemy(`${transmutationResult.success ? '✅' : '❌'} Трансмутация ${transmutationResult.success ? 'успешна' : 'неудачна'}`);

    return {
      success: transmutationResult.success,
      transmutedQuery: transmutationResult.transmutedQuery,
      enhancedProperties: transmutationResult.enhancedProperties,
      energyUsed: 10,
      remainingEnergy: this.transmutationEnergy,
      masteryGained: transmutationResult.masteryGained,
      transmutationPlan: transmutationPlan.export(),
      artifacts: transmutationResult.artifacts
    };
  }

  /**
   * Определяет целевые свойства
   */
  defineTargetProperties(targetOutcome) {
    const properties = {};

    switch (targetOutcome) {
      case 'enhanced_clarity':
        properties.clarity = 0.9;
        properties.precision = 0.8;
        properties.focus = 0.8;
        break;
      case 'increased_creativity':
        properties.novelty = 0.9;
        properties.flexibility = 0.8;
        properties.originality = 0.7;
        break;
      case 'better_specificity':
        properties.specificity = 0.9;
        properties.detail = 0.8;
        properties.actionability = 0.8;
        break;
      case 'emotional_resonance':
        properties.emotional_appeal = 0.8;
        properties.empathy = 0.7;
        properties.engagement = 0.9;
        break;
      default:
        properties.overall_quality = 0.8;
        properties.effectiveness = 0.7;
    }

    return properties;
  }

  /**
   * Выбирает оптимальный катализатор
   */
  selectOptimalCatalyst(elements, targetProperties) {
    let bestCatalyst = null;
    let bestScore = 0;

    for (const [name, catalyst] of this.catalysts) {
      let score = 0;
      let canCatalyzeCount = 0;

      for (const element of elements) {
        const canCatalyze = catalyst.canCatalyze(element);
        if (canCatalyze.canCatalyze) {
          canCatalyzeCount++;
          score += catalyst.efficiency * catalyst.potency;
        }
      }

      if (canCatalyzeCount > 0) {
        score = score / canCatalyzeCount;
        
        // Бонус за соответствие целевым свойствам
        if (targetProperties.clarity && name === 'focus') score *= 1.2;
        if (targetProperties.novelty && name === 'inspiration') score *= 1.2;
        if (targetProperties.precision && name === 'analysis') score *= 1.2;

        if (score > bestScore) {
          bestScore = score;
          bestCatalyst = catalyst;
        }
      }
    }

    return bestCatalyst;
  }

  /**
   * Создает план трансмутации
   */
  createTransmutationPlan(elements, targetProperties, catalyst) {
    return {
      steps: [
        {
          type: 'stabilization',
          elements: elements.filter(e => e.stability < 0.7),
          catalyst: catalyst,
          expectedDuration: 100
        },
        {
          type: 'transmutation',
          elements: elements,
          targetProperties,
          catalyst: catalyst,
          expectedDuration: 200
        },
        {
          type: 'synthesis',
          elements: elements,
          targetProperties,
          catalyst: catalyst,
          expectedDuration: 150
        }
      ],
      totalDuration: 450,
      complexity: this.calculatePlanComplexity(elements, targetProperties),
      riskLevel: this.assessRiskLevel(elements, catalyst),
      export() {
        return {
          stepsCount: this.steps.length,
          totalDuration: this.totalDuration,
          complexity: this.complexity,
          riskLevel: this.riskLevel
        };
      }
    };
  }

  /**
   * Выполняет план трансмутации
   */
  async executeTransmutationPlan(plan) {
    let transmutedQuery = '';
    const enhancedProperties = new Map();
    const artifacts = [];
    let totalComplexity = 0;

    for (const step of plan.steps) {
      const stepResult = await this.executeTransmutationStep(step);
      
      if (stepResult.success) {
        transmutedQuery += stepResult.queryFragment + ' ';
        
        for (const [key, value] of Object.entries(stepResult.properties)) {
          enhancedProperties.set(key, (enhancedProperties.get(key) || 0) + value);
        }
        
        if (stepResult.artifact) {
          artifacts.push(stepResult.artifact);
        }
        
        totalComplexity += stepResult.complexity;
      } else {
        return {
          success: false,
          reason: stepResult.reason,
          failedStep: step.type
        };
      }
    }

    return {
      success: true,
      transmutedQuery: transmutedQuery.trim(),
      enhancedProperties: Object.fromEntries(enhancedProperties),
      artifacts,
      complexity: totalComplexity,
      masteryGained: totalComplexity * 0.1
    };
  }

  /**
   * Выполняет шаг трансмутации
   */
  async executeTransmutationStep(step) {
    switch (step.type) {
      case 'stabilization':
        return this.performStabilization(step);
      case 'transmutation':
        return this.performElementalTransmutation(step);
      case 'synthesis':
        return this.performSynthesis(step);
      default:
        return { success: false, reason: 'unknown_step_type' };
    }
  }

  /**
   * Выполняет стабилизацию
   */
  performStabilization(step) {
    let queryFragment = '';
    const properties = {};
    let complexity = 0;

    for (const element of step.elements) {
      if (element.stability < 0.7) {
        element.stability = Math.min(1, element.stability + 0.2);
        queryFragment += `стабилизированный ${element.name} `;
        properties.stability = (properties.stability || 0) + 0.1;
        complexity += 0.2;
      }
    }

    return {
      success: true,
      queryFragment,
      properties,
      complexity
    };
  }

  /**
   * Выполняет элементную трансмутацию
   */
  performElementalTransmutation(step) {
    let queryFragment = '';
    const properties = {};
    let complexity = 0;

    for (const element of step.elements) {
      const transmutation = element.transmute(step.catalyst, step.targetProperties);
      
      queryFragment += `трансмутированный ${transmutation.newName} `;
      
      for (const [key, value] of Object.entries(step.targetProperties)) {
        properties[key] = (properties[key] || 0) + value * 0.5;
      }
      
      complexity += 0.5;
    }

    return {
      success: true,
      queryFragment,
      properties,
      complexity
    };
  }

  /**
   * Выполняет синтез
   */
  performSynthesis(step) {
    if (step.elements.length < 2) {
      return {
        success: true,
        queryFragment: 'единичный элемент',
        properties: {},
        complexity: 0.1
      };
    }

    const reaction = new AlchemicalReaction(step.elements, step.catalyst);
    const reactionResult = reaction.executeReaction();

    if (reactionResult.success) {
      return {
        success: true,
        queryFragment: `синтезированный композит из ${step.elements.length} элементов`,
        properties: step.targetProperties,
        complexity: 0.8,
        artifact: {
          type: 'synthesis_product',
          products: reactionResult.products.length,
          quality: reactionResult.completionRate
        }
      };
    } else {
      return {
        success: false,
        reason: 'synthesis_failed'
      };
    }
  }

  /**
   * Восстанавливает энергию трансмутации
   */
  restoreTransmutationEnergy(amount = 20) {
    this.transmutationEnergy = Math.min(this.maxEnergy, this.transmutationEnergy + amount);
    SmartLogger.alchemy(`⚡ Восстановлено ${amount} энергии трансмутации. Текущий уровень: ${this.transmutationEnergy}/${this.maxEnergy}`);
  }

  /**
   * Получает опыт мастерства
   */
  gainMasteryExperience(complexityPoints) {
    const experienceGained = complexityPoints * this.masterLevel;
    const experienceNeeded = this.masterLevel * 10;
    
    if (experienceGained >= experienceNeeded) {
      this.masterLevel++;
      SmartLogger.alchemy(`🏆 Повышение уровня мастерства до ${this.masterLevel}!`);
    }
  }

  /**
   * Получает статистику алхимии
   */
  getAlchemyStatistics() {
    return {
      masterLevel: this.masterLevel,
      transmutationEnergy: this.transmutationEnergy,
      maxEnergy: this.maxEnergy,
      totalElements: this.elements.size,
      totalCatalysts: this.catalysts.size,
      totalReactions: this.reactions.length,
      totalArtifacts: this.artifacts.length,
      elementalAffinities: Object.fromEntries(this.elementalAffinities),
      laboratoryConditions: Object.fromEntries(this.laboratory),
      availableFormulas: this.formulas.size
    };
  }

  // Вспомогательные методы
  calculateSpecificity(query) {
    const specificWords = query.split(' ').filter(word => word.length > 6).length;
    return Math.min(1, specificWords / 10);
  }

  determineEmotionalPolarity(words) {
    const positiveWords = ['красиво', 'отлично', 'прекрасно', 'супер'];
    const negativeWords = ['ужасно', 'плохо', 'ужас'];
    
    const positiveCount = positiveWords.filter(word => words.includes(word)).length;
    const negativeCount = negativeWords.filter(word => words.includes(word)).length;
    
    if (positiveCount > negativeCount) return 0.8;
    if (negativeCount > positiveCount) return 0.2;
    return 0.5;
  }

  calculateTechnicalComplexity(words) {
    const complexTerms = ['оптимизация', 'алгоритм', 'векторизация', 'трансформация'];
    return complexTerms.filter(term => words.includes(term)).length / complexTerms.length;
  }

  calculatePlanComplexity(elements, targetProperties) {
    const elementComplexity = elements.reduce((sum, e) => sum + Object.keys(e.properties).length, 0);
    const targetComplexity = Object.keys(targetProperties).length;
    return (elementComplexity + targetComplexity) / 20;
  }

  assessRiskLevel(elements, catalyst) {
    const avgReactivity = elements.reduce((sum, e) => sum + e.reactivity, 0) / elements.length;
    const catalystRisk = catalyst.potency * (1 - catalyst.selectivity);
    return (avgReactivity + catalystRisk) / 2;
  }
}

module.exports = {
  SemanticAlchemy,
  SemanticElement,
  AlchemicalCatalyst,
  AlchemicalReaction
};
