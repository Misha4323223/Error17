/**
 * Менеджер долгосрочной памяти пользователей
 * Управляет проектами, их эволюцией и связями между ними
 * ФАЗА 1: Основной компонент системы персистентной памяти
 */

// Используем динамический импорт для работы с ES модулями
let storage = null;

async function getStorage() {
  if (!storage) {
    const storageModule = await import('../storage.ts');
    storage = storageModule.storage;
  }
  return storage;
}

const SmartLogger = {
  memory: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🧠💾 [${timestamp}] USER MEMORY: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Класс для управления долгосрочной памятью пользователей
 */
class UserMemoryManager {
  constructor() {
    this.initialized = false;
  }

  /**
   * Инициализация менеджера памяти
   */
  initialize() {
    if (this.initialized) return;
    SmartLogger.memory('Инициализация менеджера долгосрочной памяти');
    this.initialized = true;
  }

  /**
   * Получение или создание профиля пользователя
   */
  async getOrCreateUserProfile(userId) {
    this.initialize();
    
    try {
      // Пытаемся получить существующий профиль
      const db = await getStorage();
      let profile = await db.getUserProfile(userId);
      
      if (!profile) {
        SmartLogger.memory(`Создание нового профиля для пользователя ${userId}`);
        
        // Создаем базовый профиль
        const newProfile = {
          userId: userId,
          communicationStyle: 'friendly',
          preferredLanguage: 'ru',
          responseLength: 'medium',
          favoriteColors: [],
          preferredStyles: [],
          designComplexity: 'medium',
          emotionalTone: 'neutral',
          feedbackStyle: 'encouraging',
          learningProgress: '{}',
          successPatterns: '{}',
          totalInteractions: 0
        };
        
        profile = await storage.createUserProfile(newProfile);
        SmartLogger.memory(`Профиль создан для пользователя ${userId}`, { profileId: profile.id });
      }
      
      return profile;
    } catch (error) {
      SmartLogger.memory(`Ошибка при работе с профилем пользователя ${userId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Создание или обновление проекта в памяти
   */
  async createOrUpdateProject(userId, sessionId, projectData) {
    this.initialize();
    
    try {
      SmartLogger.memory(`Создание/обновление проекта для пользователя ${userId}`, {
        type: projectData.projectType,
        title: projectData.projectTitle
      });

      // Ищем существующий активный проект такого же типа
      const existingProjects = await storage.getProjectsByType(userId, projectData.projectType);
      const activeProject = existingProjects.find(p => p.completionStatus === 'active');

      if (activeProject && this.shouldUpdateExistingProject(activeProject, projectData)) {
        // Обновляем существующий проект
        const updates = {
          description: projectData.description || activeProject.description,
          semanticTags: this.mergeTags(activeProject.semanticTags, projectData.semanticTags),
          concepts: this.mergeConcepts(activeProject.concepts, projectData.concepts),
          evolutionStages: this.updateEvolutionStages(activeProject, projectData),
          lastWorkedOn: new Date(),
          sessionId: sessionId
        };

        const updatedProject = await storage.updateProjectMemory(activeProject.id, updates);
        SmartLogger.memory(`Проект обновлен`, { projectId: updatedProject.id });
        return updatedProject;
      } else {
        // Создаем новый проект
        const newProject = {
          userId: userId,
          sessionId: sessionId,
          projectType: projectData.projectType,
          projectTitle: projectData.projectTitle,
          description: projectData.description || '',
          semanticTags: projectData.semanticTags || [],
          concepts: projectData.concepts || [],
          domain: projectData.domain || 'general',
          evolutionStages: JSON.stringify({
            stage1: {
              timestamp: new Date().toISOString(),
              description: 'Проект создан',
              userInput: projectData.originalQuery || ''
            }
          }),
          artifacts: [],
          nextStepsPredictions: '{}',
          userIntent: projectData.userIntent || '',
          satisfactionLevel: null,
          completionStatus: 'active'
        };

        const createdProject = await storage.createProjectMemory(newProject);
        SmartLogger.memory(`Новый проект создан`, { projectId: createdProject.id });
        return createdProject;
      }
    } catch (error) {
      SmartLogger.memory(`Ошибка при создании/обновлении проекта: ${error.message}`);
      return null;
    }
  }

  /**
   * Добавление артефакта к проекту
   */
  async addArtifactToProject(projectId, artifactUrl, artifactType = 'image') {
    try {
      const project = await storage.getProjectMemory(projectId);
      if (!project) return false;

      const currentArtifacts = project.artifacts || [];
      const newArtifacts = [...currentArtifacts, {
        url: artifactUrl,
        type: artifactType,
        createdAt: new Date().toISOString()
      }];

      const evolutionStages = JSON.parse(project.evolutionStages || '{}');
      const stageKey = `stage${Object.keys(evolutionStages).length + 1}`;
      evolutionStages[stageKey] = {
        timestamp: new Date().toISOString(),
        description: `Создан артефакт: ${artifactType}`,
        artifactUrl: artifactUrl
      };

      await storage.updateProjectMemory(projectId, {
        artifacts: newArtifacts,
        evolutionStages: JSON.stringify(evolutionStages),
        lastWorkedOn: new Date()
      });

      SmartLogger.memory(`Артефакт добавлен к проекту ${projectId}`, { artifactUrl, artifactType });
      return true;
    } catch (error) {
      SmartLogger.memory(`Ошибка при добавлении артефакта: ${error.message}`);
      return false;
    }
  }

  /**
   * Получение контекста активных проектов пользователя
   */
  async getUserProjectContext(userId, limit = 5) {
    try {
      const activeProjects = await storage.getActiveProjects(userId);
      const recentProjects = activeProjects.slice(0, limit);

      const context = {
        totalActiveProjects: activeProjects.length,
        recentProjects: recentProjects.map(project => ({
          id: project.id,
          type: project.projectType,
          title: project.projectTitle,
          domain: project.domain,
          concepts: project.concepts,
          lastWorkedOn: project.lastWorkedOn,
          artifacts: project.artifacts?.length || 0
        })),
        dominantDomains: this.extractDominantDomains(activeProjects),
        preferredProjectTypes: this.extractPreferredTypes(activeProjects)
      };

      SmartLogger.memory(`Контекст проектов получен для пользователя ${userId}`, {
        activeProjects: context.totalActiveProjects,
        recentProjects: context.recentProjects.length
      });

      return context;
    } catch (error) {
      SmartLogger.memory(`Ошибка при получении контекста проектов: ${error.message}`);
      return { totalActiveProjects: 0, recentProjects: [], dominantDomains: [], preferredProjectTypes: [] };
    }
  }

  /**
   * Обновление профиля пользователя на основе взаимодействий
   */
  async updateUserProfileFromInteraction(userId, interactionData) {
    try {
      profile = await this.getOrCreateUserProfile(userId);
      if (!profile) return false;

      updates = {
        totalInteractions: profile.totalInteractions + 1,
        lastActive: new Date()
      };

      // Обновляем предпочтения на основе взаимодействия
      if (interactionData.preferredColors) {
        updates.favoriteColors = this.updateColorPreferences(profile.favoriteColors, interactionData.preferredColors);
      }

      if (interactionData.designStyle) {
        updates.preferredStyles = this.updateStylePreferences(profile.preferredStyles, interactionData.designStyle);
      }

      if (interactionData.responseQuality) {
        updates.successPatterns = this.updateSuccessPatterns(profile.successPatterns, interactionData);
      }

      await storage.updateUserProfile(userId, updates);
      SmartLogger.memory(`Профиль пользователя ${userId} обновлен на основе взаимодействия`);
      return true;
    } catch (error) {
      SmartLogger.memory(`Ошибка при обновлении профиля: ${error.message}`);
      return false;
    }
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  shouldUpdateExistingProject(existingProject, newData) {
    // Обновляем, если проект работал недавно (в течение 24 часов)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(existingProject.lastWorkedOn) > dayAgo;
  }

  mergeTags(existingTags, newTags) {
    if (!newTags) return existingTags || [];
    const combined = [...(existingTags || []), ...newTags];
    return [...new Set(combined)]; // убираем дубликаты
  }

  mergeConcepts(existingConcepts, newConcepts) {
    if (!newConcepts) return existingConcepts || [];
    combined = [...(existingConcepts || []), ...newConcepts];
    return [...new Set(combined)]; // убираем дубликаты
  }

  updateEvolutionStages(existingProject, newData) {
    const stages = JSON.parse(existingProject.evolutionStages || '{}');
    stageKey = `stage${Object.keys(stages).length + 1}`;
    
    stages[stageKey] = {
      timestamp: new Date().toISOString(),
      description: newData.stageDescription || 'Проект обновлен',
      userInput: newData.originalQuery || '',
      changes: newData.changes || []
    };

    return JSON.stringify(stages);
  }

  extractDominantDomains(projects) {
    const domainCounts = {};
    projects.forEach(project => {
      if (project.domain) {
        domainCounts[project.domain] = (domainCounts[project.domain] || 0) + 1;
      }
    });

    return Object.entries(domainCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([domain, count]) => ({ domain, count }));
  }

  extractPreferredTypes(projects) {
    const typeCounts = {};
    projects.forEach(project => {
      typeCounts[project.projectType] = (typeCounts[project.projectType] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  }

  updateColorPreferences(existingColors, newColors) {
    if (!newColors || !Array.isArray(newColors)) return existingColors || [];
    
    combined = [...(existingColors || []), ...newColors];
    const colorCounts = {};
    
    combined.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });

    // Возвращаем топ-10 цветов по частоте использования
    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([color]) => color);
  }

  updateStylePreferences(existingStyles, newStyle) {
    if (!newStyle) return existingStyles || [];
    
    const styles = existingStyles || [];
    if (!styles.includes(newStyle)) {
      styles.unshift(newStyle); // добавляем новый стиль в начало
      return styles.slice(0, 5); // оставляем топ-5
    }
    
    // Если стиль уже есть, перемещаем его в начало
    const filtered = styles.filter(s => s !== newStyle);
    return [newStyle, ...filtered].slice(0, 5);
  }

  updateSuccessPatterns(existingPatterns, interactionData) {
    let patterns;
    try {
      patterns = JSON.parse(existingPatterns || '{}');
    } catch {
      patterns = {};
    }

    const category = interactionData.category || 'general';
    if (!patterns[category]) {
      patterns[category] = { successful: [], failed: [] };
    }

    if (interactionData.responseQuality > 7) {
      patterns[category].successful.push({
        pattern: interactionData.requestPattern,
        quality: interactionData.responseQuality,
        timestamp: new Date().toISOString()
      });
      
      // Оставляем только последние 20 успешных паттернов
      patterns[category].successful = patterns[category].successful.slice(-20);
    }

    return JSON.stringify(patterns);
  }
}

const userMemoryManagerInstance = new UserMemoryManager();

module.exports = {
  // Экспортируем все методы экземпляра
  getOrCreateUserProfile: userMemoryManagerInstance.getOrCreateUserProfile.bind(userMemoryManagerInstance),
  createOrUpdateProject: userMemoryManagerInstance.createOrUpdateProject.bind(userMemoryManagerInstance),
  addArtifactToProject: userMemoryManagerInstance.addArtifactToProject.bind(userMemoryManagerInstance),
  getUserProjectContext: userMemoryManagerInstance.getUserProjectContext.bind(userMemoryManagerInstance),
  updateUserProfileFromInteraction: userMemoryManagerInstance.updateUserProfileFromInteraction.bind(userMemoryManagerInstance),

  // Также экспортируем сам экземпляр для обратной совместимости
  instance: userMemoryManagerInstance,

  // Экспортируем класс
  UserMemoryManager: UserMemoryManager
};