/**
 * Граф знаний для семантической памяти
 * Управляет связями между концепциями, объектами и процессами
 */

const SmartLogger = {
  graph: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🕸️ [${timestamp}] KNOWLEDGE GRAPH: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Узел в графе знаний
 */
class KnowledgeNode {
  constructor(id, type, data) {
    this.id = id;
    this.type = type; // concept, object, process, attribute
    this.data = data;
    this.connections = new Map(); // id -> {type, strength, metadata}
    this.metadata = {
      created: Date.now(),
      accessed: Date.now(),
      accessCount: 0,
      importance: 0.5
    };
  }

  addConnection(targetId, connectionType, strength = 1.0, metadata = {}) {
    this.connections.set(targetId, {
      type: connectionType,
      strength: strength,
      metadata: metadata,
      created: Date.now()
    });
  }

  getConnections(connectionType = null) {
    if (!connectionType) {
      return Array.from(this.connections.entries());
    }
    
    return Array.from(this.connections.entries())
      .filter(([, conn]) => conn.type === connectionType);
  }

  updateAccess() {
    this.metadata.accessed = Date.now();
    this.metadata.accessCount++;
    this.updateImportance();
  }

  updateImportance() {
    // Важность растет с частотой использования и количеством связей
    const recencyFactor = Math.max(0, 1 - (Date.now() - this.metadata.accessed) / (7 * 24 * 60 * 60 * 1000));
    const connectionFactor = Math.min(1, this.connections.size / 10);
    const accessFactor = Math.min(1, this.metadata.accessCount / 100);
    
    this.metadata.importance = (recencyFactor + connectionFactor + accessFactor) / 3;
  }
}

/**
 * Основной класс графа знаний
 */
class KnowledgeGraph {
  constructor() {
    this.nodes = new Map(); // id -> KnowledgeNode
    this.initializeBaseKnowledge();
  }

  initializeBaseKnowledge() {
    SmartLogger.graph('Инициализация базового графа знаний');

    // Создаем основные концепции
    this.addConcept('logo', {
      name: 'Логотип',
      description: 'Графический знак, эмблема или символ',
      domain: 'branding',
      requirements: ['масштабируемость', 'узнаваемость', 'простота']
    });

    this.addConcept('print', {
      name: 'Принт',
      description: 'Дизайн для печати на ткани',
      domain: 'apparel',
      requirements: ['контрастность', 'стойкость красок', 'читаемость']
    });

    this.addConcept('embroidery', {
      name: 'Вышивка',
      description: 'Дизайн для машинной вышивки',
      domain: 'textile',
      requirements: ['упрощение деталей', 'ограничение цветов', 'толщина линий']
    });

    this.addConcept('character', {
      name: 'Персонаж',
      description: 'Художественный персонаж или маскот',
      domain: 'illustration',
      requirements: ['эмоциональность', 'узнаваемость', 'versatility']
    });

    // 📚 Образовательные концепции
    this.addConcept('educational_content', {
      name: 'Образовательный контент',
      description: 'Материалы для обучения и передачи знаний',
      domain: 'education',
      requirements: ['структурированность', 'понятность', 'интерактивность']
    });

    this.addConcept('knowledge_testing', {
      name: 'Тестирование знаний',
      description: 'Проверка и оценка уровня знаний',
      domain: 'education',
      requirements: ['объективность', 'адаптивность', 'обратная связь']
    });

    // 📊 Аналитические концепции
    this.addConcept('data_analysis', {
      name: 'Анализ данных',
      description: 'Извлечение инсайтов из больших массивов данных',
      domain: 'analytics',
      requirements: ['точность', 'визуализация', 'интерпретация']
    });

    this.addConcept('business_intelligence', {
      name: 'Бизнес-аналитика',
      description: 'Стратегический анализ для принятия решений',
      domain: 'business',
      requirements: ['релевантность', 'actionable insights', 'KPI tracking']
    });

    // 💻 Программистские концепции
    this.addConcept('software_development', {
      name: 'Разработка ПО',
      description: 'Создание программных решений',
      domain: 'technology',
      requirements: ['качество кода', 'масштабируемость', 'maintainability']
    });

    this.addConcept('code_optimization', {
      name: 'Оптимизация кода',
      description: 'Улучшение производительности и качества кода',
      domain: 'technology',
      requirements: ['производительность', 'читаемость', 'безопасность']
    });

    // ✍️ Контентные концепции
    this.addConcept('copywriting', {
      name: 'Копирайтинг',
      description: 'Создание продающих и убеждающих текстов',
      domain: 'marketing',
      requirements: ['конверсия', 'целевая аудитория', 'психология']
    });

    this.addConcept('content_marketing', {
      name: 'Контент-маркетинг',
      description: 'Привлечение аудитории через ценный контент',
      domain: 'marketing',
      requirements: ['ценность', 'регулярность', 'engagement']
    });

    // Добавляем процессы
    this.addProcess('vectorization', {
      name: 'Векторизация',
      description: 'Преобразование растрового изображения в векторное',
      input: ['raster_image'],
      output: ['vector_image'],
      tools: ['imagetracer', 'illustrator', 'inkscape']
    });

    this.addProcess('color_optimization', {
      name: 'Цветовая оптимизация',
      description: 'Настройка цветов для конкретного применения',
      input: ['image'],
      output: ['optimized_image'],
      variants: ['cmyk_conversion', 'color_reduction', 'contrast_enhancement']
    });

    // Новые процессы для расширенных направлений
    this.addProcess('content_analysis', {
      name: 'Анализ контента',
      description: 'Исследование эффективности и качества контента',
      input: ['text', 'metrics'],
      output: ['insights', 'recommendations'],
      tools: ['analytics', 'nlp', 'sentiment_analysis']
    });

    this.addProcess('knowledge_structuring', {
      name: 'Структурирование знаний',
      description: 'Организация информации для эффективного обучения',
      input: ['raw_information'],
      output: ['structured_content'],
      variants: ['lesson_plan', 'course_curriculum', 'learning_path']
    });

    this.addProcess('code_review', {
      name: 'Ревью кода',
      description: 'Проверка качества и соответствия стандартам',
      input: ['source_code'],
      output: ['feedback', 'improvements'],
      tools: ['static_analysis', 'peer_review', 'automated_testing']
    });

    this.addProcess('market_research', {
      name: 'Маркетинговое исследование',
      description: 'Анализ рынка и целевой аудитории',
      input: ['market_data', 'customer_data'],
      output: ['market_insights', 'strategy'],
      variants: ['competitor_analysis', 'customer_journey', 'trend_analysis']
    });

    // Добавляем атрибуты
    this.addAttribute('scalability', {
      name: 'Масштабируемость',
      description: 'Способность изображения сохранять качество при изменении размера',
      importance: 'high',
      applicable_to: ['logo', 'vector_graphics']
    });

    // Создаем базовые связи
    this.createBaseConnections();
  }

  createBaseConnections() {
    // Связи концепций с процессами
    this.addConnection('logo', 'vectorization', 'requires', 0.9, {
      reason: 'Логотипы должны быть векторными для масштабируемости'
    });

    this.addConnection('print', 'color_optimization', 'requires', 0.8, {
      reason: 'Принты требуют цветовой оптимизации для печати'
    });

    this.addConnection('embroidery', 'color_optimization', 'requires', 0.95, {
      reason: 'Вышивка критически зависит от ограничения цветов'
    });

    // Связи между концепциями
    this.addConnection('logo', 'print', 'can_become', 0.7, {
      reason: 'Логотипы часто используются в принтах'
    });

    this.addConnection('character', 'embroidery', 'can_become', 0.6, {
      reason: 'Персонажи могут быть адаптированы для вышивки'
    });

    // Связи атрибутов
    this.addConnection('logo', 'scalability', 'has_attribute', 1.0);
    this.addConnection('vectorization', 'scalability', 'provides', 1.0);

    // Связи новых концепций и процессов
    // Образовательные связи
    this.addConnection('educational_content', 'knowledge_structuring', 'requires', 0.9, {
      reason: 'Образовательный контент требует структурирования для эффективности'
    });

    this.addConnection('knowledge_testing', 'educational_content', 'validates', 0.8, {
      reason: 'Тестирование проверяет усвоение образовательного контента'
    });

    // Аналитические связи
    this.addConnection('data_analysis', 'business_intelligence', 'feeds_into', 0.85, {
      reason: 'Анализ данных формирует основу для бизнес-аналитики'
    });

    this.addConnection('market_research', 'business_intelligence', 'enhances', 0.7, {
      reason: 'Маркетинговые исследования обогащают бизнес-аналитику'
    });

    // Программистские связи
    this.addConnection('software_development', 'code_review', 'requires', 0.95, {
      reason: 'Разработка ПО критически нуждается в ревью кода'
    });

    this.addConnection('code_optimization', 'software_development', 'improves', 0.8, {
      reason: 'Оптимизация улучшает качество разработки'
    });

    // Контентные связи
    this.addConnection('copywriting', 'content_analysis', 'benefits_from', 0.75, {
      reason: 'Копирайтинг улучшается благодаря анализу контента'
    });

    this.addConnection('content_marketing', 'market_research', 'requires', 0.8, {
      reason: 'Контент-маркетинг основывается на исследовании рынка'
    });

    // Междисциплинарные связи
    this.addConnection('educational_content', 'copywriting', 'can_use', 0.6, {
      reason: 'Образовательный контент может использовать копирайтинг техники'
    });

    this.addConnection('data_analysis', 'educational_content', 'can_enhance', 0.5, {
      reason: 'Анализ данных может обогатить образовательные материалы'
    });
  }

  /**
   * Добавление концепции
   */
  addConcept(id, data) {
    const node = new KnowledgeNode(id, 'concept', data);
    this.nodes.set(id, node);
    SmartLogger.graph(`Добавлена концепция: ${id}`);
    return node;
  }

  /**
   * Добавление процесса
   */
  addProcess(id, data) {
    const node = new KnowledgeNode(id, 'process', data);
    this.nodes.set(id, node);
    SmartLogger.graph(`Добавлен процесс: ${id}`);
    return node;
  }

  /**
   * Добавление атрибута
   */
  addAttribute(id, data) {
    const node = new KnowledgeNode(id, 'attribute', data);
    this.nodes.set(id, node);
    SmartLogger.graph(`Добавлен атрибут: ${id}`);
    return node;
  }

  /**
   * Добавление объекта
   */
  addObject(id, data) {
    const node = new KnowledgeNode(id, 'object', data);
    this.nodes.set(id, node);
    SmartLogger.graph(`Добавлен объект: ${id}`);
    return node;
  }

  /**
   * Создание связи между узлами
   */
  addConnection(fromId, toId, connectionType, strength = 1.0, metadata = {}) {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);

    if (!fromNode || !toNode) {
      SmartLogger.graph(`Ошибка: не найден узел для связи ${fromId} -> ${toId}`);
      return false;
    }

    fromNode.addConnection(toId, connectionType, strength, metadata);
    
    // Добавляем обратную связь если нужно
    if (this.isSymmetricConnection(connectionType)) {
      const reverseType = this.getReverseConnectionType(connectionType);
      toNode.addConnection(fromId, reverseType, strength, metadata);
    }

    SmartLogger.graph(`Создана связь: ${fromId} -[${connectionType}]-> ${toId} (${strength})`);
    return true;
  }

  /**
   * Поиск связанных концепций
   */
  findRelatedConcepts(conceptId, maxDepth = 2, minStrength = 0.3) {
    const visited = new Set();
    const results = [];

    this.exploreConnections(conceptId, 0, maxDepth, minStrength, visited, results);

    // Сортируем по релевантности
    results.sort((a, b) => b.relevance - a.relevance);

    SmartLogger.graph(`Найдено связанных концепций для ${conceptId}: ${results.length}`);
    return results;
  }

  exploreConnections(nodeId, currentDepth, maxDepth, minStrength, visited, results) {
    if (currentDepth >= maxDepth || visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.updateAccess();

    // Получаем все связи узла
    const connections = node.getConnections();
    
    for (const [targetId, connection] of connections) {
      if (connection.strength >= minStrength && !visited.has(targetId)) {
        const targetNode = this.nodes.get(targetId);
        if (targetNode) {
          // Вычисляем релевантность
          const relevance = this.calculateRelevance(connection, currentDepth, targetNode);
          
          results.push({
            id: targetId,
            node: targetNode,
            connection: connection,
            depth: currentDepth + 1,
            relevance: relevance,
            path: this.getPath(nodeId, targetId)
          });

          // Рекурсивно исследуем дальше
          this.exploreConnections(targetId, currentDepth + 1, maxDepth, minStrength, visited, results);
        }
      }
    }
  }

  /**
   * Вычисление релевантности связи
   */
  calculateRelevance(connection, depth, targetNode) {
    const strengthFactor = connection.strength;
    const depthPenalty = Math.pow(0.7, depth); // Снижаем релевантность с глубиной
    const importanceFactor = targetNode.metadata.importance;
    const accessFactor = Math.min(1, targetNode.metadata.accessCount / 10);

    return strengthFactor * depthPenalty * importanceFactor * (1 + accessFactor);
  }

  /**
   * Поиск оптимального пути между концепциями
   */
  findPath(fromId, toId, maxDepth = 4) {
    const queue = [{ id: fromId, path: [fromId], depth: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current.id === toId) {
        return current.path;
      }

      if (current.depth >= maxDepth || visited.has(current.id)) {
        continue;
      }

      visited.add(current.id);
      const node = this.nodes.get(current.id);
      if (!node) continue;

      const connections = node.getConnections();
      for (const [targetId] of connections) {
        if (!visited.has(targetId)) {
          queue.push({
            id: targetId,
            path: [...current.path, targetId],
            depth: current.depth + 1
          });
        }
      }
    }

    return null; // Путь не найден
  }

  /**
   * Получение краткого пути (для отображения)
   */
  getPath(fromId, toId) {
    const fullPath = this.findPath(fromId, toId, 3);
    if (!fullPath || fullPath.length <= 2) {
      return [fromId, toId];
    }
    
    // Возвращаем сокращенный путь
    return [fullPath[0], '...', fullPath[fullPath.length - 1]];
  }

  /**
   * Анализ применимости процесса к концепции
   */
  analyzeProcessApplicability(conceptId, processId) {
    const concept = this.nodes.get(conceptId);
    const process = this.nodes.get(processId);

    if (!concept || !process) {
      return { applicable: false, confidence: 0 };
    }

    // Прямая связь
    const directConnection = concept.connections.get(processId);
    if (directConnection) {
      return {
        applicable: true,
        confidence: directConnection.strength,
        reason: directConnection.metadata.reason || 'Прямая связь в графе знаний',
        type: 'direct'
      };
    }

    // Поиск через связанные концепции
    const relatedConcepts = this.findRelatedConcepts(conceptId, 2, 0.4);
    
    for (const related of relatedConcepts) {
      const relatedConnection = related.node.connections.get(processId);
      if (relatedConnection) {
        const inheritedConfidence = related.relevance * relatedConnection.strength * 0.7;
        
        return {
          applicable: inheritedConfidence > 0.3,
          confidence: inheritedConfidence,
          reason: `Применимо через связанную концепцию: ${related.node.data.name}`,
          type: 'inherited',
          via: related.id
        };
      }
    }

    return { applicable: false, confidence: 0 };
  }

  /**
   * Предложение процессов для концепции
   */
  suggestProcesses(conceptId, context = {}) {
    SmartLogger.graph(`Предложение процессов для концепции: ${conceptId}`);

    const suggestions = [];
    const concept = this.nodes.get(conceptId);
    if (!concept) return suggestions;

    // Получаем все процессы
    const processes = Array.from(this.nodes.values())
      .filter(node => node.type === 'process');

    for (const process of processes) {
      const applicability = this.analyzeProcessApplicability(conceptId, process.id);
      
      if (applicability.applicable) {
        // Корректируем уверенность на основе контекста
        let adjustedConfidence = applicability.confidence;
        
        if (context.hasImages && process.data.input?.includes('raster_image')) {
          adjustedConfidence += 0.2;
        }
        
        if (context.targetFormat && process.data.output?.includes(context.targetFormat)) {
          adjustedConfidence += 0.3;
        }

        suggestions.push({
          processId: process.id,
          process: process.data,
          confidence: Math.min(adjustedConfidence, 1.0),
          reason: applicability.reason,
          type: applicability.type,
          priority: this.calculateProcessPriority(process, context)
        });
      }
    }

    // Сортируем по уверенности и приоритету
    suggestions.sort((a, b) => (b.confidence + b.priority) - (a.confidence + a.priority));

    SmartLogger.graph(`Предложено процессов: ${suggestions.length}`, suggestions.slice(0, 3));
    return suggestions;
  }

  /**
   * Вычисление приоритета процесса
   */
  calculateProcessPriority(process, context) {
    let priority = 0.5;

    // Высокий приоритет для критических процессов
    const criticalProcesses = ['vectorization', 'color_optimization'];
    if (criticalProcesses.includes(process.id)) {
      priority += 0.3;
    }

    // Приоритет на основе частоты использования
    priority += Math.min(0.2, process.metadata.accessCount / 100);

    // Приоритет на основе контекста
    if (context.urgency === 'high') {
      // Быстрые процессы получают приоритет
      const fastProcesses = ['color_optimization', 'resize'];
      if (fastProcesses.includes(process.id)) {
        priority += 0.2;
      }
    }

    return Math.min(priority, 1.0);
  }

  /**
   * Обновление графа на основе пользовательских действий
   */
  updateFromUserAction(action, context = {}) {
    SmartLogger.graph(`Обновление графа на основе действия: ${action.type}`);

    if (action.type === 'image_generation') {
      this.reinforceConnection(action.concept, 'image_creation', 0.1);
    }

    if (action.type === 'vectorization') {
      this.reinforceConnection(action.fromConcept, 'vectorization', 0.2);
    }

    if (action.type === 'format_conversion') {
      this.reinforceConnection(action.fromFormat, action.toFormat, 0.15);
    }

    // Ослабляем неиспользуемые связи
    this.decayUnusedConnections();
  }

  /**
   * Усиление связи
   */
  reinforceConnection(fromId, toId, increment) {
    const fromNode = this.nodes.get(fromId);
    if (fromNode && fromNode.connections.has(toId)) {
      const connection = fromNode.connections.get(toId);
      connection.strength = Math.min(1.0, connection.strength + increment);
      connection.lastReinforced = Date.now();
    }
  }

  /**
   * Ослабление неиспользуемых связей
   */
  decayUnusedConnections() {
    const decayRate = 0.001; // Небольшое ослабление за каждый день
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    for (const node of this.nodes.values()) {
      for (const [targetId, connection] of node.connections) {
        const daysSinceUse = (now - (connection.lastReinforced || connection.created)) / dayInMs;
        const decay = decayRate * daysSinceUse;
        connection.strength = Math.max(0.1, connection.strength - decay);
      }
    }
  }

  /**
   * Вспомогательные методы для типов связей
   */
  isSymmetricConnection(connectionType) {
    const symmetricTypes = ['related_to', 'similar_to', 'compatible_with'];
    return symmetricTypes.includes(connectionType);
  }

  getReverseConnectionType(connectionType) {
    const reverseMap = {
      'requires': 'required_by',
      'produces': 'produced_by',
      'enables': 'enabled_by',
      'related_to': 'related_to',
      'similar_to': 'similar_to'
    };
    
    return reverseMap[connectionType] || connectionType;
  }

  /**
   * Экспорт графа для анализа
   */
  exportGraph() {
    const exportData = {
      nodes: [],
      connections: []
    };

    for (const [id, node] of this.nodes) {
      exportData.nodes.push({
        id,
        type: node.type,
        data: node.data,
        metadata: node.metadata
      });

      for (const [targetId, connection] of node.connections) {
        exportData.connections.push({
          from: id,
          to: targetId,
          type: connection.type,
          strength: connection.strength,
          metadata: connection.metadata
        });
      }
    }

    return exportData;
  }

  /**
   * Получение статистики графа
   */
  getStatistics() {
    const stats = {
      totalNodes: this.nodes.size,
      nodeTypes: {},
      totalConnections: 0,
      averageConnections: 0,
      strongConnections: 0
    };

    for (const node of this.nodes.values()) {
      stats.nodeTypes[node.type] = (stats.nodeTypes[node.type] || 0) + 1;
      stats.totalConnections += node.connections.size;
      
      for (const connection of node.connections.values()) {
        if (connection.strength > 0.7) {
          stats.strongConnections++;
        }
      }
    }

    stats.averageConnections = stats.totalConnections / stats.totalNodes;

    return stats;
  }
}

// Создаем глобальный экземпляр
const knowledgeGraph = new KnowledgeGraph();

module.exports = {
  findRelatedConcepts: knowledgeGraph.findRelatedConcepts.bind(knowledgeGraph),
  suggestProcesses: knowledgeGraph.suggestProcesses.bind(knowledgeGraph),
  analyzeProcessApplicability: knowledgeGraph.analyzeProcessApplicability.bind(knowledgeGraph),
  updateFromUserAction: knowledgeGraph.updateFromUserAction.bind(knowledgeGraph),
  findPath: knowledgeGraph.findPath.bind(knowledgeGraph),
  addConcept: knowledgeGraph.addConcept.bind(knowledgeGraph),
  addConnection: knowledgeGraph.addConnection.bind(knowledgeGraph),
  exportGraph: knowledgeGraph.exportGraph.bind(knowledgeGraph),
  getStatistics: knowledgeGraph.getStatistics.bind(knowledgeGraph),
  
  // Экспортируем классы
  KnowledgeGraph,
  KnowledgeNode
};