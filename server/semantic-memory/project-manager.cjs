/**
 * Менеджер семантических проектов
 * Анализирует контекст проектов и управляет их состоянием
 */

const SmartLogger = require('./smart-logger.cjs');

class SemanticProjectManager {
  constructor() {
    this.projects = new Map();
    this.contextCache = new Map();
    SmartLogger.project('SemanticProjectManager initialized');
  }

  /**
   * Анализирует проект на основе данных
   */
  async analyzeProject(projectData) {
    try {
      const { userMessage, entities, semantics, context } = projectData;
      
      // Извлекаем ключевые компоненты проекта
      const projectContext = this.extractProjectContext(userMessage, entities, semantics);
      
      // Определяем тип проекта
      const projectType = this.determineProjectType(projectContext);
      
      // Анализируем сложность
      const complexity = this.analyzeComplexity(projectContext);
      
      // Создаем результат анализа
      const analysis = {
        projectType,
        complexity,
        context: projectContext,
        requirements: this.extractRequirements(userMessage, entities),
        timeline: this.estimateTimeline(complexity),
        resources: this.identifyResources(projectContext),
        confidence: this.calculateConfidence(projectContext)
      };
      
      SmartLogger.project(`Project analysis completed: ${projectType}`, {
        complexity: complexity.level,
        confidence: analysis.confidence
      });
      
      return analysis;
    } catch (error) {
      SmartLogger.project(`Error in project analysis: ${error.message}`);
      return {
        projectType: 'unknown',
        complexity: { level: 'low', score: 0 },
        context: {},
        requirements: [],
        timeline: 'undefined',
        resources: [],
        confidence: 0
      };
    }
  }

  /**
   * Извлекает контекст проекта из входных данных
   */
  extractProjectContext(userMessage, entities, semantics) {
    const context = {
      domain: this.identifyDomain(userMessage),
      technologies: this.extractTechnologies(userMessage, entities),
      objectives: this.extractObjectives(userMessage),
      constraints: this.identifyConstraints(userMessage),
      stakeholders: this.identifyStakeholders(userMessage)
    };
    
    return context;
  }

  /**
   * Определяет тип проекта
   */
  determineProjectType(context) {
    const { domain, technologies, objectives } = context;
    
    if (domain.includes('image') || domain.includes('visual')) {
      return 'image_generation';
    } else if (domain.includes('vector') || domain.includes('svg')) {
      return 'vectorization';
    } else if (domain.includes('chat') || domain.includes('conversation')) {
      return 'conversation';
    } else if (domain.includes('analysis')) {
      return 'analysis';
    } else {
      return 'general';
    }
  }

  /**
   * Анализирует сложность проекта
   */
  analyzeComplexity(context) {
    let complexityScore = 0;
    
    // Оценка по количеству технологий
    complexityScore += context.technologies.length * 0.2;
    
    // Оценка по количеству целей
    complexityScore += context.objectives.length * 0.3;
    
    // Оценка по ограничениям
    complexityScore += context.constraints.length * 0.1;
    
    // Оценка по заинтересованным сторонам
    complexityScore += context.stakeholders.length * 0.2;
    
    let level = 'low';
    if (complexityScore > 2) level = 'high';
    else if (complexityScore > 1) level = 'medium';
    
    return {
      level,
      score: complexityScore,
      factors: Object.keys(context).length
    };
  }

  /**
   * Извлекает требования из сообщения
   */
  extractRequirements(userMessage, entities) {
    const requirements = [];
    
    // Функциональные требования
    if (userMessage.includes('создать') || userMessage.includes('сделать')) {
      requirements.push('functional_creation');
    }
    
    // Качественные требования
    if (userMessage.includes('качественно') || userMessage.includes('хорошо')) {
      requirements.push('quality_assurance');
    }
    
    // Временные требования
    if (userMessage.includes('быстро') || userMessage.includes('срочно')) {
      requirements.push('time_constraint');
    }
    
    return requirements;
  }

  /**
   * Оценивает временные рамки
   */
  estimateTimeline(complexity) {
    switch (complexity.level) {
      case 'low': return 'short_term';
      case 'medium': return 'medium_term';
      case 'high': return 'long_term';
      default: return 'undefined';
    }
  }

  /**
   * Идентифицирует необходимые ресурсы
   */
  identifyResources(context) {
    const resources = [];
    
    if (context.domain.includes('image')) {
      resources.push('image_generation_service');
    }
    
    if (context.domain.includes('vector')) {
      resources.push('vectorization_service');
    }
    
    if (context.technologies.length > 0) {
      resources.push('technical_expertise');
    }
    
    return resources;
  }

  /**
   * Рассчитывает уверенность в анализе
   */
  calculateConfidence(context) {
    let confidence = 0;
    
    // Базовая уверенность
    confidence += 30;
    
    // Бонус за количество данных
    confidence += Object.keys(context).length * 10;
    
    // Бонус за специфичность
    if (context.domain.length > 0) confidence += 20;
    if (context.technologies.length > 0) confidence += 15;
    if (context.objectives.length > 0) confidence += 15;
    
    return Math.min(confidence, 100);
  }

  /**
   * Идентифицирует домен проекта
   */
  identifyDomain(userMessage) {
    const domains = [];
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('изображение') || lowerMessage.includes('картинка')) {
      domains.push('image');
    }
    
    if (lowerMessage.includes('вектор') || lowerMessage.includes('svg')) {
      domains.push('vector');
    }
    
    if (lowerMessage.includes('чат') || lowerMessage.includes('общение')) {
      domains.push('chat');
    }
    
    return domains;
  }

  /**
   * Извлекает технологии из сообщения
   */
  extractTechnologies(userMessage, entities) {
    const technologies = [];
    
    // Анализ на основе ключевых слов
    const techKeywords = ['ai', 'ml', 'svg', 'vector', 'image', 'chat'];
    
    techKeywords.forEach(keyword => {
      if (userMessage.toLowerCase().includes(keyword)) {
        technologies.push(keyword);
      }
    });
    
    return technologies;
  }

  /**
   * Извлекает цели из сообщения
   */
  extractObjectives(userMessage) {
    const objectives = [];
    
    if (userMessage.includes('создать') || userMessage.includes('сделать')) {
      objectives.push('create');
    }
    
    if (userMessage.includes('улучшить') || userMessage.includes('оптимизировать')) {
      objectives.push('improve');
    }
    
    if (userMessage.includes('анализировать') || userMessage.includes('проанализировать')) {
      objectives.push('analyze');
    }
    
    return objectives;
  }

  /**
   * Идентифицирует ограничения
   */
  identifyConstraints(userMessage) {
    const constraints = [];
    
    if (userMessage.includes('бюджет') || userMessage.includes('дешево')) {
      constraints.push('budget');
    }
    
    if (userMessage.includes('время') || userMessage.includes('быстро')) {
      constraints.push('time');
    }
    
    if (userMessage.includes('качество') || userMessage.includes('хорошо')) {
      constraints.push('quality');
    }
    
    return constraints;
  }

  /**
   * Идентифицирует заинтересованные стороны
   */
  identifyStakeholders(userMessage) {
    const stakeholders = [];
    
    if (userMessage.includes('клиент') || userMessage.includes('заказчик')) {
      stakeholders.push('client');
    }
    
    if (userMessage.includes('команда') || userMessage.includes('разработчики')) {
      stakeholders.push('development_team');
    }
    
    if (userMessage.includes('пользователь') || userMessage.includes('юзер')) {
      stakeholders.push('end_users');
    }
    
    return stakeholders;
  }
}

module.exports = SemanticProjectManager;