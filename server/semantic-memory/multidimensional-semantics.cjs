
/**
 * МНОГОМЕРНЫЕ СЕМАНТИЧЕСКИЕ ПРОСТРАНСТВА
 * Революционная система для работы с концептами в n-мерном пространстве
 * 
 * Принцип: Каждый концепт существует не в плоском пространстве, а в многомерном
 * континууме с различными измерениями: эмоциональное, временное, логическое,
 * интуитивное, творческое, практическое, философское, и другие
 */

const SmartLogger = {
  multidimensional: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🌐📐 [${timestamp}] MULTIDIMENSIONAL: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * ИЗМЕРЕНИЯ СЕМАНТИЧЕСКОГО ПРОСТРАНСТВА
 */
const SEMANTIC_DIMENSIONS = {
  LOGICAL: 'logical',           // Логическое измерение
  EMOTIONAL: 'emotional',       // Эмоциональное измерение
  TEMPORAL: 'temporal',         // Временное измерение
  SPATIAL: 'spatial',           // Пространственное измерение
  CREATIVE: 'creative',         // Творческое измерение
  PRACTICAL: 'practical',       // Практическое измерение
  PHILOSOPHICAL: 'philosophical', // Философское измерение
  INTUITIVE: 'intuitive',       // Интуитивное измерение
  SOCIAL: 'social',             // Социальное измерение
  AESTHETIC: 'aesthetic',       // Эстетическое измерение
  MORAL: 'moral',               // Моральное измерение
  QUANTUM: 'quantum',           // Квантовое измерение
  FRACTAL: 'fractal',           // Фрактальное измерение
  HOLOGRAPHIC: 'holographic',   // Голографическое измерение
  NARRATIVE: 'narrative'        // Нарративное измерение
};

/**
 * МНОГОМЕРНЫЙ СЕМАНТИЧЕСКИЙ ВЕКТОР
 * Представляет позицию концепта в многомерном пространстве
 */
class MultidimensionalSemanticVector {
  constructor(concept, dimensions = 15) {
    this.concept = concept;
    this.dimensions = dimensions;
    this.coordinates = this.generateCoordinates();
    this.magnitude = this.calculateMagnitude();
    this.direction = this.calculateDirection();
    this.entropy = this.calculateEntropy();
    this.informationContent = this.calculateInformationContent();
    this.createdAt = Date.now();
  }

  /**
   * Генерирует координаты в многомерном пространстве
   */
  generateCoordinates() {
    const coordinates = {};
    const hash = this.hashString(this.concept);
    
    let dimensionIndex = 0;
    for (const dimension of Object.values(SEMANTIC_DIMENSIONS)) {
      // Используем различные функции для разных измерений
      const seed = hash + dimensionIndex * 1000;
      coordinates[dimension] = this.generateDimensionCoordinate(dimension, seed);
      dimensionIndex++;
    }
    
    return coordinates;
  }

  /**
   * Генерирует координату для конкретного измерения
   */
  generateDimensionCoordinate(dimension, seed) {
    const conceptLength = this.concept.length;
    const conceptComplexity = this.calculateConceptComplexity();
    
    switch (dimension) {
      case SEMANTIC_DIMENSIONS.LOGICAL:
        return Math.cos(seed / 1000) * conceptComplexity;
      
      case SEMANTIC_DIMENSIONS.EMOTIONAL:
        return Math.sin(seed / 1000) * this.getEmotionalIntensity();
      
      case SEMANTIC_DIMENSIONS.TEMPORAL:
        return Math.tan(seed / 2000) * this.getTemporalRelevance();
      
      case SEMANTIC_DIMENSIONS.CREATIVE:
        return Math.sin(seed / 500) * Math.cos(seed / 1500) * this.getCreativeEnergy();
      
      case SEMANTIC_DIMENSIONS.PRACTICAL:
        return Math.log(Math.abs(seed) + 1) * this.getPracticalValue();
      
      case SEMANTIC_DIMENSIONS.PHILOSOPHICAL:
        return Math.sqrt(Math.abs(seed)) * this.getPhilosophicalDepth();
      
      case SEMANTIC_DIMENSIONS.INTUITIVE:
        return Math.sin(seed / 777) * this.getIntuitiveResonance();
      
      case SEMANTIC_DIMENSIONS.SOCIAL:
        return Math.cos(seed / 888) * this.getSocialRelevance();
      
      case SEMANTIC_DIMENSIONS.AESTHETIC:
        return Math.sin(seed / 333) * Math.cos(seed / 666) * this.getAestheticValue();
      
      case SEMANTIC_DIMENSIONS.MORAL:
        return Math.atan(seed / 10000) * this.getMoralWeight();
      
      case SEMANTIC_DIMENSIONS.QUANTUM:
        return Math.sin(seed / 137) * Math.cos(seed / 273) * this.getQuantumCoherence();
      
      case SEMANTIC_DIMENSIONS.FRACTAL:
        return this.generateFractalCoordinate(seed);
      
      case SEMANTIC_DIMENSIONS.HOLOGRAPHIC:
        return this.generateHolographicCoordinate(seed);
      
      case SEMANTIC_DIMENSIONS.NARRATIVE:
        return Math.sin(seed / 999) * this.getNarrativeStrength();
      
      default:
        return Math.sin(seed / 1000) * Math.cos(seed / 2000);
    }
  }

  /**
   * Вычисляет сложность концепта
   */
  calculateConceptComplexity() {
    return Math.log(this.concept.length + 1) * 0.5;
  }

  /**
   * Получает эмоциональную интенсивность
   */
  getEmotionalIntensity() {
    const emotionalWords = ['любовь', 'радость', 'грусть', 'страх', 'гнев', 'удивление', 'отвращение'];
    let intensity = 0.5;
    
    for (const word of emotionalWords) {
      if (this.concept.toLowerCase().includes(word)) {
        intensity += 0.3;
      }
    }
    
    return Math.min(1, intensity);
  }

  /**
   * Получает временную релевантность
   */
  getTemporalRelevance() {
    const temporalWords = ['сейчас', 'вчера', 'завтра', 'всегда', 'никогда', 'будущее', 'прошлое'];
    let relevance = 0.5;
    
    for (const word of temporalWords) {
      if (this.concept.toLowerCase().includes(word)) {
        relevance += 0.2;
      }
    }
    
    return Math.min(1, relevance);
  }

  /**
   * Получает творческую энергию
   */
  getCreativeEnergy() {
    const creativeWords = ['создай', 'придумай', 'сгенерируй', 'творчество', 'искусство', 'дизайн'];
    let energy = 0.3;
    
    for (const word of creativeWords) {
      if (this.concept.toLowerCase().includes(word)) {
        energy += 0.4;
      }
    }
    
    return Math.min(1, energy);
  }

  /**
   * Получает практическую ценность
   */
  getPracticalValue() {
    const practicalWords = ['сделай', 'исправь', 'оптимизируй', 'решение', 'задача', 'проблема'];
    let value = 0.4;
    
    for (const word of practicalWords) {
      if (this.concept.toLowerCase().includes(word)) {
        value += 0.3;
      }
    }
    
    return Math.min(1, value);
  }

  /**
   * Получает философскую глубину
   */
  getPhilosophicalDepth() {
    const philosophicalWords = ['смысл', 'истина', 'бытие', 'сущность', 'природа', 'реальность'];
    let depth = 0.2;
    
    for (const word of philosophicalWords) {
      if (this.concept.toLowerCase().includes(word)) {
        depth += 0.5;
      }
    }
    
    return Math.min(1, depth);
  }

  /**
   * Получает интуитивный резонанс
   */
  getIntuitiveResonance() {
    const hash = this.hashString(this.concept);
    return Math.sin(hash / 777) * 0.5 + 0.5;
  }

  /**
   * Получает социальную релевантность
   */
  getSocialRelevance() {
    const socialWords = ['люди', 'общество', 'команда', 'группа', 'сообщество', 'коллектив'];
    let relevance = 0.3;
    
    for (const word of socialWords) {
      if (this.concept.toLowerCase().includes(word)) {
        relevance += 0.4;
      }
    }
    
    return Math.min(1, relevance);
  }

  /**
   * Получает эстетическую ценность
   */
  getAestheticValue() {
    const aestheticWords = ['красивый', 'элегантный', 'стильный', 'прекрасный', 'гармонично'];
    let value = 0.3;
    
    for (const word of aestheticWords) {
      if (this.concept.toLowerCase().includes(word)) {
        value += 0.4;
      }
    }
    
    return Math.min(1, value);
  }

  /**
   * Получает моральный вес
   */
  getMoralWeight() {
    const moralWords = ['добро', 'зло', 'справедливость', 'честность', 'правда', 'ложь'];
    let weight = 0.2;
    
    for (const word of moralWords) {
      if (this.concept.toLowerCase().includes(word)) {
        weight += 0.5;
      }
    }
    
    return Math.min(1, weight);
  }

  /**
   * Получает квантовую когерентность
   */
  getQuantumCoherence() {
    const hash = this.hashString(this.concept);
    return Math.abs(Math.sin(hash / 137) * Math.cos(hash / 273));
  }

  /**
   * Генерирует фрактальную координату
   */
  generateFractalCoordinate(seed) {
    let value = 0;
    let scale = 1;
    
    for (let i = 0; i < 5; i++) {
      value += Math.sin(seed * scale) / scale;
      scale *= 2;
    }
    
    return value;
  }

  /**
   * Генерирует голографическую координату
   */
  generateHolographicCoordinate(seed) {
    // Каждая часть содержит информацию о целом
    const parts = this.concept.split('');
    let holographicValue = 0;
    
    for (let i = 0; i < parts.length; i++) {
      const partHash = this.hashString(parts[i]);
      holographicValue += Math.sin(partHash * seed / 10000) / (i + 1);
    }
    
    return holographicValue;
  }

  /**
   * Получает нарративную силу
   */
  getNarrativeStrength() {
    const narrativeWords = ['история', 'рассказ', 'сюжет', 'персонаж', 'драма', 'повествование'];
    let strength = 0.3;
    
    for (const word of narrativeWords) {
      if (this.concept.toLowerCase().includes(word)) {
        strength += 0.4;
      }
    }
    
    return Math.min(1, strength);
  }

  /**
   * Вычисляет величину вектора
   */
  calculateMagnitude() {
    let sumOfSquares = 0;
    for (const coordinate of Object.values(this.coordinates)) {
      sumOfSquares += coordinate * coordinate;
    }
    return Math.sqrt(sumOfSquares);
  }

  /**
   * Вычисляет направление вектора
   */
  calculateDirection() {
    const direction = {};
    for (const [dimension, coordinate] of Object.entries(this.coordinates)) {
      direction[dimension] = coordinate / this.magnitude;
    }
    return direction;
  }

  /**
   * Вычисляет энтропию
   */
  calculateEntropy() {
    const probabilities = Object.values(this.coordinates).map(coord => 
      Math.abs(coord) / this.magnitude
    );
    
    let entropy = 0;
    for (const prob of probabilities) {
      if (prob > 0) {
        entropy -= prob * Math.log2(prob);
      }
    }
    
    return entropy;
  }

  /**
   * Вычисляет информационное содержание
   */
  calculateInformationContent() {
    return this.concept.length * this.entropy * this.magnitude;
  }

  /**
   * Вычисляет расстояние до другого вектора
   */
  distanceTo(otherVector) {
    let sumOfSquares = 0;
    
    for (const dimension of Object.keys(this.coordinates)) {
      const diff = this.coordinates[dimension] - (otherVector.coordinates[dimension] || 0);
      sumOfSquares += diff * diff;
    }
    
    return Math.sqrt(sumOfSquares);
  }

  /**
   * Вычисляет скалярное произведение
   */
  dotProduct(otherVector) {
    let product = 0;
    
    for (const dimension of Object.keys(this.coordinates)) {
      product += this.coordinates[dimension] * (otherVector.coordinates[dimension] || 0);
    }
    
    return product;
  }

  /**
   * Вычисляет косинус угла между векторами
   */
  cosineDistance(otherVector) {
    const dotProd = this.dotProduct(otherVector);
    return dotProd / (this.magnitude * otherVector.magnitude);
  }

  /**
   * Проецирует вектор на другой вектор
   */
  projectOnto(otherVector) {
    const scalar = this.dotProduct(otherVector) / (otherVector.magnitude * otherVector.magnitude);
    const projectedCoordinates = {};
    
    for (const [dimension, coordinate] of Object.entries(otherVector.coordinates)) {
      projectedCoordinates[dimension] = coordinate * scalar;
    }
    
    return new MultidimensionalSemanticVector(
      `projection_${this.concept}_onto_${otherVector.concept}`,
      this.dimensions
    );
  }

  /**
   * Нормализует вектор
   */
  normalize() {
    const normalizedCoordinates = {};
    
    for (const [dimension, coordinate] of Object.entries(this.coordinates)) {
      normalizedCoordinates[dimension] = coordinate / this.magnitude;
    }
    
    return normalizedCoordinates;
  }

  /**
   * Экспортирует вектор
   */
  export() {
    return {
      concept: this.concept,
      coordinates: this.coordinates,
      magnitude: this.magnitude,
      direction: this.direction,
      entropy: this.entropy,
      informationContent: this.informationContent,
      dimensionCount: Object.keys(this.coordinates).length,
      dominantDimension: this.getDominantDimension(),
      age: Date.now() - this.createdAt
    };
  }

  /**
   * Получает доминирующее измерение
   */
  getDominantDimension() {
    let maxValue = -Infinity;
    let dominantDimension = null;
    
    for (const [dimension, value] of Object.entries(this.coordinates)) {
      if (Math.abs(value) > maxValue) {
        maxValue = Math.abs(value);
        dominantDimension = dimension;
      }
    }
    
    return dominantDimension;
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
 * МНОГОМЕРНОЕ СЕМАНТИЧЕСКОЕ ПРОСТРАНСТВО
 * Управляет коллекцией векторов и их взаимодействиями
 */
class MultidimensionalSemanticSpace {
  constructor(dimensionCount = 15) {
    this.dimensionCount = dimensionCount;
    this.vectors = new Map();
    this.clusters = new Map();
    this.hyperplanes = new Map();
    this.manifolds = new Map();
    this.topology = 'euclidean'; // euclidean, hyperbolic, spherical
    this.curvature = 0; // Кривизна пространства
    this.metric = 'euclidean'; // Метрика пространства
    this.symmetries = [];
    this.invariants = [];
    this.createdAt = Date.now();
  }

  /**
   * Добавляет вектор в пространство
   */
  addVector(concept) {
    const vector = new MultidimensionalSemanticVector(concept, this.dimensionCount);
    this.vectors.set(concept, vector);
    
    SmartLogger.multidimensional(`📍 Добавлен вектор: ${concept} (величина: ${vector.magnitude.toFixed(3)}, доминирующее измерение: ${vector.getDominantDimension()})`);
    
    // Обновляем кластеры
    this.updateClusters(vector);
    
    return vector;
  }

  /**
   * Обновляет кластеры
   */
  updateClusters(newVector) {
    const clusterThreshold = 2.0;
    let assignedToCluster = false;
    
    for (const [clusterId, cluster] of this.clusters) {
      const centroid = cluster.centroid;
      const distance = newVector.distanceTo(centroid);
      
      if (distance < clusterThreshold) {
        cluster.vectors.push(newVector);
        cluster.centroid = this.calculateCentroid(cluster.vectors);
        assignedToCluster = true;
        SmartLogger.multidimensional(`🎯 Вектор ${newVector.concept} добавлен в кластер ${clusterId}`);
        break;
      }
    }
    
    if (!assignedToCluster) {
      const newClusterId = `cluster_${this.clusters.size + 1}`;
      this.clusters.set(newClusterId, {
        id: newClusterId,
        vectors: [newVector],
        centroid: newVector,
        createdAt: Date.now()
      });
      SmartLogger.multidimensional(`🆕 Создан новый кластер: ${newClusterId}`);
    }
  }

  /**
   * Вычисляет центроид кластера
   */
  calculateCentroid(vectors) {
    if (vectors.length === 0) return null;
    
    const centroidCoordinates = {};
    
    // Инициализируем нулевыми значениями
    for (const dimension of Object.values(SEMANTIC_DIMENSIONS)) {
      centroidCoordinates[dimension] = 0;
    }
    
    // Суммируем все векторы
    for (const vector of vectors) {
      for (const [dimension, coordinate] of Object.entries(vector.coordinates)) {
        centroidCoordinates[dimension] += coordinate;
      }
    }
    
    // Делим на количество векторов
    for (const dimension of Object.keys(centroidCoordinates)) {
      centroidCoordinates[dimension] /= vectors.length;
    }
    
    // Создаем новый вектор-центроид
    const centroid = new MultidimensionalSemanticVector('centroid', this.dimensionCount);
    centroid.coordinates = centroidCoordinates;
    centroid.magnitude = centroid.calculateMagnitude();
    centroid.direction = centroid.calculateDirection();
    
    return centroid;
  }

  /**
   * Находит ближайшие векторы
   */
  findNearestVectors(concept, count = 5) {
    const targetVector = this.vectors.get(concept);
    if (!targetVector) return [];
    
    const distances = [];
    
    for (const [otherConcept, otherVector] of this.vectors) {
      if (otherConcept === concept) continue;
      
      const distance = targetVector.distanceTo(otherVector);
      distances.push({
        concept: otherConcept,
        vector: otherVector,
        distance: distance,
        similarity: targetVector.cosineDistance(otherVector)
      });
    }
    
    return distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count);
  }

  /**
   * Создает гиперплоскость
   */
  createHyperplane(normalVector, point) {
    const hyperplaneId = `hyperplane_${this.hyperplanes.size + 1}`;
    
    this.hyperplanes.set(hyperplaneId, {
      id: hyperplaneId,
      normal: normalVector,
      point: point,
      equation: this.calculateHyperplaneEquation(normalVector, point),
      createdAt: Date.now()
    });
    
    SmartLogger.multidimensional(`🔷 Создана гиперплоскость: ${hyperplaneId}`);
    return hyperplaneId;
  }

  /**
   * Вычисляет уравнение гиперплоскости
   */
  calculateHyperplaneEquation(normal, point) {
    // n · (x - p) = 0, где n - нормаль, p - точка
    const constant = normal.dotProduct(point);
    return {
      normal: normal.coordinates,
      constant: constant,
      representation: 'n·x = c'
    };
  }

  /**
   * Проецирует вектор на гиперплоскость
   */
  projectOntoHyperplane(vector, hyperplaneId) {
    const hyperplane = this.hyperplanes.get(hyperplaneId);
    if (!hyperplane) return null;
    
    const normal = hyperplane.normal;
    const point = hyperplane.point;
    
    // Вектор от точки на плоскости к нашему вектору
    const toVector = this.subtractVectors(vector, point);
    
    // Проекция на нормаль
    const projectionOnNormal = toVector.projectOnto(normal);
    
    // Вычитаем проекцию на нормаль из исходного вектора
    return this.subtractVectors(vector, projectionOnNormal);
  }

  /**
   * Вычитает два вектора
   */
  subtractVectors(vector1, vector2) {
    const resultCoordinates = {};
    
    for (const dimension of Object.keys(vector1.coordinates)) {
      resultCoordinates[dimension] = vector1.coordinates[dimension] - (vector2.coordinates[dimension] || 0);
    }
    
    const result = new MultidimensionalSemanticVector(`subtraction_result`, this.dimensionCount);
    result.coordinates = resultCoordinates;
    result.magnitude = result.calculateMagnitude();
    result.direction = result.calculateDirection();
    
    return result;
  }

  /**
   * Выполняет многомерный анализ концепта
   */
  performMultidimensionalAnalysis(concept) {
    const vector = this.vectors.get(concept) || this.addVector(concept);
    
    const analysis = {
      concept: concept,
      vector: vector.export(),
      nearestNeighbors: this.findNearestVectors(concept, 5),
      clusterMembership: this.getClusterMembership(vector),
      dimensionalProfile: this.getDimensionalProfile(vector),
      geometricProperties: this.getGeometricProperties(vector),
      topologicalProperties: this.getTopologicalProperties(vector),
      informationTheoreticProperties: this.getInformationTheoreticProperties(vector)
    };
    
    SmartLogger.multidimensional(`🔍 Многомерный анализ завершен для: ${concept}`);
    
    return analysis;
  }

  /**
   * Получает принадлежность к кластеру
   */
  getClusterMembership(vector) {
    for (const [clusterId, cluster] of this.clusters) {
      if (cluster.vectors.includes(vector)) {
        return {
          clusterId: clusterId,
          clusterSize: cluster.vectors.length,
          distanceToCenter: vector.distanceTo(cluster.centroid)
        };
      }
    }
    return null;
  }

  /**
   * Получает профиль по измерениям
   */
  getDimensionalProfile(vector) {
    const profile = {};
    const coordinates = Object.entries(vector.coordinates);
    
    // Сортируем по абсолютной величине
    coordinates.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    
    profile.dominantDimensions = coordinates.slice(0, 5).map(([dim, val]) => ({
      dimension: dim,
      value: val,
      percentage: Math.abs(val) / vector.magnitude * 100
    }));
    
    profile.weakestDimensions = coordinates.slice(-3).map(([dim, val]) => ({
      dimension: dim,
      value: val,
      percentage: Math.abs(val) / vector.magnitude * 100
    }));
    
    return profile;
  }

  /**
   * Получает геометрические свойства
   */
  getGeometricProperties(vector) {
    return {
      magnitude: vector.magnitude,
      direction: vector.direction,
      normalizedVector: vector.normalize(),
      orthogonalComponents: this.getOrthogonalComponents(vector),
      angles: this.calculateAngles(vector)
    };
  }

  /**
   * Получает ортогональные компоненты
   */
  getOrthogonalComponents(vector) {
    const components = {};
    
    for (const [dimension, coordinate] of Object.entries(vector.coordinates)) {
      components[dimension] = {
        parallel: coordinate,
        orthogonal: Math.sqrt(vector.magnitude * vector.magnitude - coordinate * coordinate)
      };
    }
    
    return components;
  }

  /**
   * Вычисляет углы
   */
  calculateAngles(vector) {
    const angles = {};
    
    for (const [dimension, coordinate] of Object.entries(vector.coordinates)) {
      angles[dimension] = Math.acos(coordinate / vector.magnitude) * 180 / Math.PI;
    }
    
    return angles;
  }

  /**
   * Получает топологические свойства
   */
  getTopologicalProperties(vector) {
    return {
      connectivity: this.calculateConnectivity(vector),
      density: this.calculateLocalDensity(vector),
      curvature: this.calculateLocalCurvature(vector),
      manifoldPosition: this.getManifoldPosition(vector)
    };
  }

  /**
   * Вычисляет связность
   */
  calculateConnectivity(vector) {
    const neighbors = this.findNearestVectors(vector.concept, 10);
    return neighbors.length;
  }

  /**
   * Вычисляет локальную плотность
   */
  calculateLocalDensity(vector) {
    const radius = 1.0;
    let count = 0;
    
    for (const [concept, otherVector] of this.vectors) {
      if (concept === vector.concept) continue;
      
      if (vector.distanceTo(otherVector) <= radius) {
        count++;
      }
    }
    
    return count / (Math.PI * radius * radius);
  }

  /**
   * Вычисляет локальную кривизну
   */
  calculateLocalCurvature(vector) {
    // Упрощенная мера кривизны
    return this.curvature * vector.magnitude;
  }

  /**
   * Получает позицию на многообразии
   */
  getManifoldPosition(vector) {
    // Проецируем на различные многообразия
    return {
      spherical: this.projectOntoSphere(vector),
      cylindrical: this.projectOntoCylinder(vector),
      toroidal: this.projectOntoTorus(vector)
    };
  }

  /**
   * Проецирует на сферу
   */
  projectOntoSphere(vector) {
    const normalized = vector.normalize();
    return {
      coordinates: normalized,
      sphericalCoordinates: this.toSphericalCoordinates(normalized)
    };
  }

  /**
   * Проецирует на цилиндр
   */
  projectOntoCylinder(vector) {
    const coords = vector.coordinates;
    const x = coords[SEMANTIC_DIMENSIONS.LOGICAL] || 0;
    const y = coords[SEMANTIC_DIMENSIONS.EMOTIONAL] || 0;
    const z = coords[SEMANTIC_DIMENSIONS.TEMPORAL] || 0;
    
    const r = Math.sqrt(x*x + y*y);
    const theta = Math.atan2(y, x);
    
    return {
      radius: r,
      angle: theta,
      height: z
    };
  }

  /**
   * Проецирует на тор
   */
  projectOntoTorus(vector) {
    const coords = vector.coordinates;
    const x = coords[SEMANTIC_DIMENSIONS.LOGICAL] || 0;
    const y = coords[SEMANTIC_DIMENSIONS.EMOTIONAL] || 0;
    const z = coords[SEMANTIC_DIMENSIONS.CREATIVE] || 0;
    const w = coords[SEMANTIC_DIMENSIONS.PRACTICAL] || 0;
    
    const R = 2; // Большой радиус
    const r = 1; // Малый радиус
    
    const phi = Math.atan2(y, x);
    const theta = Math.atan2(w, z);
    
    return {
      majorRadius: R,
      minorRadius: r,
      majorAngle: phi,
      minorAngle: theta
    };
  }

  /**
   * Преобразует в сферические координаты
   */
  toSphericalCoordinates(normalizedCoords) {
    const coords = Object.values(normalizedCoords);
    const r = 1; // Нормализованный радиус
    
    const angles = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const sum = coords.slice(i).reduce((a, b) => a + b*b, 0);
      angles.push(Math.acos(coords[i] / Math.sqrt(sum)));
    }
    
    return {
      radius: r,
      angles: angles
    };
  }

  /**
   * Получает информационно-теоретические свойства
   */
  getInformationTheoreticProperties(vector) {
    return {
      entropy: vector.entropy,
      informationContent: vector.informationContent,
      complexity: this.calculateComplexity(vector),
      compression: this.calculateCompression(vector),
      redundancy: this.calculateRedundancy(vector)
    };
  }

  /**
   * Вычисляет сложность
   */
  calculateComplexity(vector) {
    return vector.entropy * Math.log(vector.magnitude + 1);
  }

  /**
   * Вычисляет сжатие
   */
  calculateCompression(vector) {
    const nonZeroCount = Object.values(vector.coordinates).filter(coord => Math.abs(coord) > 0.001).length;
    return nonZeroCount / this.dimensionCount;
  }

  /**
   * Вычисляет избыточность
   */
  calculateRedundancy(vector) {
    return 1 - (vector.entropy / Math.log2(this.dimensionCount));
  }

  /**
   * Получает статистику пространства
   */
  getSpaceStatistics() {
    const vectors = Array.from(this.vectors.values());
    const clusters = Array.from(this.clusters.values());
    
    return {
      vectorCount: vectors.length,
      clusterCount: clusters.length,
      dimensionCount: this.dimensionCount,
      averageMagnitude: vectors.reduce((sum, v) => sum + v.magnitude, 0) / vectors.length || 0,
      averageEntropy: vectors.reduce((sum, v) => sum + v.entropy, 0) / vectors.length || 0,
      spaceCurvature: this.curvature,
      topology: this.topology,
      hyperplaneCount: this.hyperplanes.size,
      manifoldCount: this.manifolds.size,
      dominantDimensions: this.getDominantDimensions(vectors),
      spaceAge: Date.now() - this.createdAt
    };
  }

  /**
   * Получает доминирующие измерения
   */
  getDominantDimensions(vectors) {
    const dimensionSums = {};
    
    for (const dimension of Object.values(SEMANTIC_DIMENSIONS)) {
      dimensionSums[dimension] = 0;
    }
    
    for (const vector of vectors) {
      for (const [dimension, coordinate] of Object.entries(vector.coordinates)) {
        dimensionSums[dimension] += Math.abs(coordinate);
      }
    }
    
    const sorted = Object.entries(dimensionSums).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 5).map(([dim, sum]) => ({
      dimension: dim,
      totalMagnitude: sum,
      averageMagnitude: sum / vectors.length
    }));
  }
}

module.exports = {
  MultidimensionalSemanticSpace,
  MultidimensionalSemanticVector,
  SEMANTIC_DIMENSIONS
};
