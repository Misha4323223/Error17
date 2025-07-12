/**
 * Семантический менеджер проектов
 * Управляет проектами пользователя с пониманием смысловых связей
 */

const SmartLogger = {
  semantic: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧠 [${timestamp}] SEMANTIC MEMORY: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  project: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`📋 [${timestamp}] PROJECT: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Класс семантического проекта
 */
class SemanticProject {
  constructor(concept, sessionId, initialQuery) {
    this.id = this.generateProjectId();
    this.sessionId = sessionId;
    this.concept = concept; // основная концепция: "логотип", "принт", "персонаж"
    this.title = this.generateTitle(concept, initialQuery);
    this.entities = new Set(); // сущности: цвета, стили, объекты
    this.artifacts = []; // созданные файлы/изображения
    this.relationships = new Map(); // связи между сущностями
    this.goals = this.inferGoals(initialQuery); // цели проекта
    this.context = this.analyzeContext(initialQuery); // контекст использования
    this.timeline = [];
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.isActive = true;

    SmartLogger.project(`Создан новый проект: "${this.title}" (${this.concept})`, {
      projectId: this.id,
      sessionId: this.sessionId,
      goals: this.goals
    });
  }

  generateProjectId() {
    return 'proj_' + Math.random().toString(36).substr(2, 12) + '_' + Date.now();
  }

  generateTitle(concept, query) {
    // Извлекаем ключевые слова для создания осмысленного названия
    const keywords = this.extractKeywords(query);
    const primaryKeyword = keywords[0] || concept;
    
    if (concept === 'logo' || concept === 'логотип') {
      return `Логотип ${primaryKeyword}`;
    } else if (concept === 'print' || concept === 'принт') {
      return `Принт ${primaryKeyword}`;
    } else if (concept === 'character' || concept === 'персонаж') {
      return `Персонаж ${primaryKeyword}`;
    } else if (concept === 'embroidery' || concept === 'вышивка') {
      return `Дизайн вышивки ${primaryKeyword}`;
    }
    
    return `Проект ${primaryKeyword}`;
  }

  extractKeywords(query) {
    const lowerQuery = query.toLowerCase();
    const stopWords = ['создай', 'нарисуй', 'сделай', 'для', 'в', 'на', 'с', 'и', 'а', 'но'];
    
    return lowerQuery
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 3);
  }

  inferGoals(query) {
    const goals = [];
    const lowerQuery = query.toLowerCase();

    // Определяем цели на основе контекста запроса
    if (lowerQuery.includes('логотип') || lowerQuery.includes('logo')) {
      goals.push('создать логотип', 'векторизовать для масштабирования');
    }
    
    if (lowerQuery.includes('принт') || lowerQuery.includes('футболка') || lowerQuery.includes('печать')) {
      goals.push('подготовить для печати', 'оптимизировать цвета');
    }
    
    if (lowerQuery.includes('вышивка') || lowerQuery.includes('embroidery')) {
      goals.push('конвертировать в формат вышивки', 'упростить детали');
    }

    if (goals.length === 0) {
      goals.push('создать изображение');
    }

    return goals;
  }

  analyzeContext(query) {
    const context = {
      businessType: null,
      useCase: null,
      targetFormat: null,
      complexity: 'medium'
    };

    const lowerQuery = query.toLowerCase();

    // Определяем тип бизнеса
    const businessTypes = {
      'кофейня': 'coffee_shop',
      'пиццерия': 'pizzeria', 
      'ресторан': 'restaurant',
      'магазин': 'store',
      'компания': 'company'
    };

    for (const [keyword, type] of Object.entries(businessTypes)) {
      if (lowerQuery.includes(keyword)) {
        context.businessType = type;
        break;
      }
    }

    // Определяем назначение
    if (lowerQuery.includes('футболка') || lowerQuery.includes('принт')) {
      context.useCase = 'apparel_print';
    } else if (lowerQuery.includes('вывеска') || lowerQuery.includes('баннер')) {
      context.useCase = 'signage';
    } else if (lowerQuery.includes('сайт') || lowerQuery.includes('веб')) {
      context.useCase = 'web';
    }

    // Определяем целевой формат
    if (lowerQuery.includes('вектор') || lowerQuery.includes('svg')) {
      context.targetFormat = 'vector';
    } else if (lowerQuery.includes('вышивка')) {
      context.targetFormat = 'embroidery';
    }

    return context;
  }

  addEntity(type, value, confidence = 1.0) {
    const entity = { type, value, confidence, addedAt: Date.now() };
    this.entities.add(JSON.stringify(entity));
    this.updatedAt = Date.now();
    
    SmartLogger.semantic(`Добавлена сущность в проект "${this.title}": ${type} = ${value}`);
  }

  addArtifact(artifact) {
    const artifactWithMeta = {
      ...artifact,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      projectId: this.id
    };
    
    this.artifacts.push(artifactWithMeta);
    this.updatedAt = Date.now();
    
    // Добавляем связанные сущности
    if (artifact.style) {
      this.addEntity('style', artifact.style);
    }
    if (artifact.description) {
      this.extractEntitiesFromDescription(artifact.description);
    }

    SmartLogger.project(`Добавлен артефакт в проект "${this.title}": ${artifact.type}`, artifactWithMeta);
    
    return artifactWithMeta.id;
  }

  extractEntitiesFromDescription(description) {
    const lowerDesc = description.toLowerCase();
    
    // Извлекаем цвета
    const colors = ['красный', 'синий', 'зеленый', 'желтый', 'черный', 'белый', 'коричневый', 'серый'];
    colors.forEach(color => {
      if (lowerDesc.includes(color)) {
        this.addEntity('color', color, 0.8);
      }
    });

    // Извлекаем стили
    const styles = ['реалистичный', 'мультяшный', 'минималистичный', 'винтажный', 'современный'];
    styles.forEach(style => {
      if (lowerDesc.includes(style)) {
        this.addEntity('style', style, 0.9);
      }
    });
  }

  addRelationship(from, to, type, strength = 1.0) {
    const key = `${from}->${to}`;
    this.relationships.set(key, { type, strength, createdAt: Date.now() });
    this.updatedAt = Date.now();
    
    SmartLogger.semantic(`Добавлена связь в проекте "${this.title}": ${from} ${type} ${to}`);
  }

  getRecentArtifacts(count = 3) {
    return this.artifacts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, count);
  }

  getProgressSummary() {
    const completedGoals = this.goals.filter(goal => this.isGoalCompleted(goal));
    
    return {
      projectId: this.id,
      title: this.title,
      concept: this.concept,
      progress: `${completedGoals.length}/${this.goals.length}`,
      completedGoals,
      remainingGoals: this.goals.filter(goal => !this.isGoalCompleted(goal)),
      artifactsCount: this.artifacts.length,
      lastUpdate: this.updatedAt
    };
  }

  isGoalCompleted(goal) {
    // Простая логика определения выполненности цели
    if (goal.includes('векторизовать') && this.artifacts.some(a => a.type === 'vector')) {
      return true;
    }
    if (goal.includes('создать') && this.artifacts.length > 0) {
      return true;
    }
    if (goal.includes('вышивка') && this.artifacts.some(a => a.type === 'embroidery')) {
      return true;
    }
    return false;
  }

  predictNextSteps() {
    const predictions = [];
    const hasImage = this.artifacts.some(a => a.type === 'image');
    const hasVector = this.artifacts.some(a => a.type === 'vector');
    const hasEmbroidery = this.artifacts.some(a => a.type === 'embroidery');

    // Логика предсказаний на основе концепции и существующих артефактов
    if (this.concept === 'logo' || this.concept === 'логотип') {
      if (hasImage && !hasVector) {
        predictions.push({
          action: 'vectorize',
          description: 'Векторизовать логотип для масштабирования',
          confidence: 0.9
        });
      }
      if (hasVector && this.context.useCase === 'apparel_print') {
        predictions.push({
          action: 'optimize_for_print',
          description: 'Оптимизировать для печати на ткани',
          confidence: 0.8
        });
      }
    }

    if (hasImage && this.context.targetFormat === 'embroidery' && !hasEmbroidery) {
      predictions.push({
        action: 'convert_to_embroidery',
        description: 'Конвертировать в формат вышивки',
        confidence: 0.85
      });
    }

    SmartLogger.project(`Предсказания для проекта "${this.title}":`, predictions);
    return predictions;
  }
}

/**
 * Основной менеджер семантической памяти
 */
class SemanticProjectManager {
  constructor() {
    this.projects = new Map(); // sessionId -> Set<SemanticProject>
    this.activeProjects = new Map(); // sessionId -> projectId
    this.conceptExtractor = new ConceptExtractor();
  }

  /**
   * Анализирует запрос в контексте и возвращает семантическую информацию
   */
  async analyzeRequestInContext(userQuery, sessionId, context = {}) {
    SmartLogger.semantic(`Анализ запроса в контексте: "${userQuery.substring(0, 50)}..."`);

    const concept = this.conceptExtractor.extractMainConcept(userQuery);
    const currentProject = this.getCurrentProject(sessionId);
    
    let semanticContext = {
      concept,
      isNewProject: false,
      currentProject: null,
      suggestedActions: [],
      confidence: 0
    };

    // Определяем, создает ли пользователь новый проект или продолжает существующий
    if (this.isNewProjectRequest(userQuery, concept)) {
      SmartLogger.semantic('Обнаружен запрос на создание нового проекта');
      semanticContext.isNewProject = true;
      semanticContext.confidence = 0.8;
    } else if (currentProject && this.isContinuationRequest(userQuery, currentProject)) {
      SmartLogger.semantic(`Продолжение существующего проекта: "${currentProject.title}"`);
      semanticContext.currentProject = currentProject;
      semanticContext.suggestedActions = currentProject.predictNextSteps();
      semanticContext.confidence = 0.9;
    }

    return semanticContext;
  }

  isNewProjectRequest(query, concept) {
    const newProjectKeywords = [
      'создай', 'нарисуй', 'сделай', 'сгенерируй', 'построй',
      'новый', 'другой', 'еще один', 'давай сделаем'
    ];
    
    const lowerQuery = query.toLowerCase();
    return newProjectKeywords.some(keyword => lowerQuery.includes(keyword)) && concept;
  }

  isContinuationRequest(query, project) {
    const continuationKeywords = [
      'сделай его', 'измени', 'добавь', 'убери', 'поменяй',
      'теперь', 'а теперь', 'и еще', 'также', 'векторизуй',
      'для печати', 'для вышивки'
    ];
    
    const lowerQuery = query.toLowerCase();
    return continuationKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  /**
   * Получает или создает проект для текущего запроса
   */
  async getOrCreateProject(userQuery, sessionId, concept = null) {
    const extractedConcept = concept || this.conceptExtractor.extractMainConcept(userQuery);
    
    // Проверяем, есть ли активный проект с таким же концептом
    const currentProject = this.getCurrentProject(sessionId);
    
    if (currentProject && currentProject.concept === extractedConcept) {
      SmartLogger.project(`Используем существующий проект: "${currentProject.title}"`);
      return currentProject;
    }

    // Создаем новый проект
    const newProject = new SemanticProject(extractedConcept, sessionId, userQuery);
    
    // Добавляем в коллекцию проектов сессии
    if (!this.projects.has(sessionId)) {
      this.projects.set(sessionId, new Set());
    }
    this.projects.get(sessionId).add(newProject);
    
    // Устанавливаем как активный проект
    this.activeProjects.set(sessionId, newProject.id);
    
    SmartLogger.project(`Создан и активирован новый проект: "${newProject.title}"`);
    return newProject;
  }

  /**
   * Получает текущий активный проект сессии
   */
  getCurrentProject(sessionId) {
    const activeProjectId = this.activeProjects.get(sessionId);
    if (!activeProjectId) return null;

    const sessionProjects = this.projects.get(sessionId);
    if (!sessionProjects) return null;

    for (const project of sessionProjects) {
      if (project.id === activeProjectId) {
        return project;
      }
    }

    return null;
  }

  /**
   * Добавляет артефакт в текущий проект
   */
  async addArtifactToCurrentProject(sessionId, artifact) {
    const currentProject = this.getCurrentProject(sessionId);
    if (!currentProject) {
      SmartLogger.semantic('Нет активного проекта для добавления артефакта');
      return null;
    }

    const artifactId = currentProject.addArtifact(artifact);
    return { projectId: currentProject.id, artifactId };
  }

  /**
   * Предсказывает следующие шаги для текущего проекта
   */
  async predictNextSteps(sessionId) {
    const currentProject = this.getCurrentProject(sessionId);
    if (!currentProject) return [];

    const predictions = currentProject.predictNextSteps();
    return predictions.map(p => `• ${p.description}`);
  }

  /**
   * Получает сводку по всем проектам сессии
   */
  getSessionSummary(sessionId) {
    const sessionProjects = this.projects.get(sessionId);
    if (!sessionProjects || sessionProjects.size === 0) {
      return null;
    }

    const projectSummaries = Array.from(sessionProjects).map(p => p.getProgressSummary());
    const activeProjectId = this.activeProjects.get(sessionId);

    return {
      totalProjects: sessionProjects.size,
      activeProjectId,
      projects: projectSummaries
    };
  }
}

/**
 * Извлекатель концепций из запросов
 */
class ConceptExtractor {
  constructor() {
    this.conceptMap = {
      // Логотипы и брендинг
      'logo': ['логотип', 'logo', 'эмблема', 'символ', 'знак'],
      'логотип': ['логотип', 'logo', 'эмблема', 'символ', 'знак'],
      
      // Принты и одежда
      'print': ['принт', 'футболка', 'печать', 'тишарт', 'одежда'],
      'принт': ['принт', 'футболка', 'печать', 'тишарт', 'одежда'],
      
      // Персонажи и иллюстрации
      'character': ['персонаж', 'character', 'герой', 'фигура', 'существо'],
      'персонаж': ['персонаж', 'character', 'герой', 'фигура', 'существо'],
      
      // Вышивка
      'embroidery': ['вышивка', 'embroidery', 'вышить', 'машинная вышивка'],
      'вышивка': ['вышивка', 'embroidery', 'вышить', 'машинная вышивка'],
      
      // Иконки и UI элементы
      'icon': ['иконка', 'icon', 'пиктограмма', 'значок'],
      'иконка': ['иконка', 'icon', 'пиктограмма', 'значок']
    };
  }

  extractMainConcept(query) {
    const lowerQuery = query.toLowerCase();
    
    // Ищем наиболее специфичные концепции первыми
    for (const [concept, keywords] of Object.entries(this.conceptMap)) {
      for (const keyword of keywords) {
        if (lowerQuery.includes(keyword)) {
          SmartLogger.semantic(`Извлечена концепция: "${concept}" из ключевого слова: "${keyword}"`);
          return concept;
        }
      }
    }

    // Если специфичная концепция не найдена, определяем по общим паттернам
    if (lowerQuery.includes('создай') || lowerQuery.includes('нарисуй')) {
      SmartLogger.semantic('Определена общая концепция: "image"');
      return 'image';
    }

    SmartLogger.semantic('Концепция не определена, используем "general"');
    return 'general';
  }
}

// Создаем глобальный экземпляр менеджера
const semanticProjectManager = new SemanticProjectManager();

module.exports = {
  analyzeRequestInContext: semanticProjectManager.analyzeRequestInContext.bind(semanticProjectManager),
  getOrCreateProject: semanticProjectManager.getOrCreateProject.bind(semanticProjectManager),
  getCurrentProject: semanticProjectManager.getCurrentProject.bind(semanticProjectManager),
  addArtifactToCurrentProject: semanticProjectManager.addArtifactToCurrentProject.bind(semanticProjectManager),
  predictNextSteps: semanticProjectManager.predictNextSteps.bind(semanticProjectManager),
  getSessionSummary: semanticProjectManager.getSessionSummary.bind(semanticProjectManager),
  
  // Экспортируем классы для расширения
  SemanticProject,
  SemanticProjectManager,
  ConceptExtractor
};
// Удален дублированный блок - остается только основная реализация выше
