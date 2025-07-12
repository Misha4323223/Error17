/**
 * ПРЕДИКТИВНАЯ СИСТЕМА
 * Предсказывает следующие потребности пользователя и предлагает проактивную помощь
 * Фаза 1: Упреждающий интеллект
 */

const SmartLogger = {
  predict: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔮📊 [${timestamp}] PREDICTIVE: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * АНАЛИЗАТОР ПОВЕДЕНЧЕСКИХ ПАТТЕРНОВ
 * Отслеживает последовательности действий и выявляет повторяющиеся сценарии
 */
class BehavioralPatternAnalyzer {
  constructor() {
    this.userSessions = new Map();
    this.actionSequences = new Map();
    this.timePatterns = new Map();
    this.projectPatterns = new Map();
    this.contextualPatterns = new Map();
  }

  /**
   * Анализирует поведенческие паттерны пользователя
   */
  analyzeUserBehavior(userId, currentAction, context = {}) {
    SmartLogger.predict('Анализируем поведенческие паттерны пользователя', { userId, action: currentAction.type });
    
    // Получаем или создаем сессию пользователя
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, {
        actions: [],
        sessions: [],
        patterns: new Map(),
        preferences: {},
        lastActivity: null
      });
    }
    
    const userSession = this.userSessions.get(userId);
    
    // Добавляем текущее действие
    const actionWithContext = {
      ...currentAction,
      timestamp: Date.now(),
      context: context,
      sessionId: context.sessionId || this.generateSessionId()
    };
    
    userSession.actions.push(actionWithContext);
    userSession.lastActivity = actionWithContext.timestamp;
    
    // Анализируем последовательности
    this.analyzeActionSequences(userId, userSession);
    
    // Анализируем временные паттерны
    this.analyzeTimePatterns(userId, userSession);
    
    // Анализируем проектные паттерны
    this.analyzeProjectPatterns(userId, userSession, context);
    
    // Анализируем контекстуальные паттерны
    this.analyzeContextualPatterns(userId, userSession, context);
    
    return this.extractBehavioralInsights(userId, userSession);
  }

  /**
   * Генерирует ID сессии
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Анализирует последовательности действий
   */
  analyzeActionSequences(userId, userSession) {
    const recentActions = userSession.actions.slice(-10); // Последние 10 действий
    
    // Ищем паттерны в последовательностях действий
    for (let i = 2; i <= Math.min(5, recentActions.length); i++) {
      const sequence = recentActions.slice(-i).map(action => action.type).join(' → ');
      
      if (!this.actionSequences.has(userId)) {
        this.actionSequences.set(userId, new Map());
      }
      
      const userSequences = this.actionSequences.get(userId);
      const currentCount = userSequences.get(sequence) || 0;
      userSequences.set(sequence, currentCount + 1);
      
      // Сохраняем контекст для последовательности
      if (currentCount === 0) {
        userSequences.set(sequence + '_contexts', []);
      }
      
      const contexts = userSequences.get(sequence + '_contexts');
      contexts.push({
        timestamp: Date.now(),
        context: recentActions[recentActions.length - 1].context,
        outcome: this.determineActionOutcome(recentActions[recentActions.length - 1])
      });
    }
  }

  /**
   * Определяет результат действия
   */
  determineActionOutcome(action) {
    // Упрощенная логика определения успешности действия
    const context = action.context || {};
    
    if (context.success === true) return 'success';
    if (context.success === false) return 'failure';
    if (context.userSatisfaction > 0.7) return 'success';
    if (context.userSatisfaction < 0.3) return 'failure';
    
    return 'neutral';
  }

  /**
   * Анализирует временные паттерны
   */
  analyzeTimePatterns(userId, userSession) {
    const recentActions = userSession.actions.slice(-50); // Последние 50 действий
    
    if (!this.timePatterns.has(userId)) {
      this.timePatterns.set(userId, {
        dailyPatterns: new Map(),
        weeklyPatterns: new Map(),
        sessionDurations: [],
        peakTimes: [],
        activityFrequency: new Map()
      });
    }
    
    const timeData = this.timePatterns.get(userId);
    
    recentActions.forEach(action => {
      const date = new Date(action.timestamp);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      
      // Дневные паттерны
      const dailyKey = `${hour}:${action.type}`;
      timeData.dailyPatterns.set(dailyKey, (timeData.dailyPatterns.get(dailyKey) || 0) + 1);
      
      // Недельные паттерны
      const weeklyKey = `${dayOfWeek}:${action.type}`;
      timeData.weeklyPatterns.set(weeklyKey, (timeData.weeklyPatterns.get(weeklyKey) || 0) + 1);
    });
    
    // Анализируем длительность сессий
    this.analyzeSessionDurations(userId, userSession, timeData);
    
    // Выявляем пиковые времена активности
    this.identifyPeakTimes(userId, timeData);
  }

  /**
   * Анализирует длительность сессий
   */
  analyzeSessionDurations(userId, userSession, timeData) {
    const sessions = this.groupActionsBySessions(userSession.actions);
    
    sessions.forEach(session => {
      if (session.length > 1) {
        const duration = session[session.length - 1].timestamp - session[0].timestamp;
        timeData.sessionDurations.push({
          duration: duration,
          actionCount: session.length,
          types: [...new Set(session.map(action => action.type))],
          timestamp: session[0].timestamp
        });
      }
    });
    
    // Ограничиваем историю последними 20 сессиями
    if (timeData.sessionDurations.length > 20) {
      timeData.sessionDurations = timeData.sessionDurations.slice(-20);
    }
  }

  /**
   * Группирует действия по сессиям
   */
  groupActionsBySessions(actions) {
    const sessions = [];
    let currentSession = [];
    let lastTimestamp = 0;
    
    const sessionGap = 30 * 60 * 1000; // 30 минут
    
    actions.forEach(action => {
      if (lastTimestamp === 0 || action.timestamp - lastTimestamp < sessionGap) {
        currentSession.push(action);
      } else {
        if (currentSession.length > 0) {
          sessions.push([...currentSession]);
        }
        currentSession = [action];
      }
      lastTimestamp = action.timestamp;
    });
    
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }
    
    return sessions;
  }

  /**
   * Выявляет пиковые времена активности
   */
  identifyPeakTimes(userId, timeData) {
    const hourlyActivity = new Map();
    
    // Подсчитываем активность по часам
    timeData.dailyPatterns.forEach((count, key) => {
      const hour = parseInt(key.split(':')[0]);
      hourlyActivity.set(hour, (hourlyActivity.get(hour) || 0) + count);
    });
    
    // Сортируем часы по активности
    const sortedHours = Array.from(hourlyActivity.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    timeData.peakTimes = sortedHours.map(([hour, count]) => ({
      hour: hour,
      activity: count,
      period: this.getTimePeriodName(hour)
    }));
  }

  /**
   * Получает название периода времени
   */
  getTimePeriodName(hour) {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Анализирует проектные паттерны
   */
  analyzeProjectPatterns(userId, userSession, context) {
    if (!context.projectId && !context.currentProject) return;
    
    const projectId = context.projectId || context.currentProject;
    
    if (!this.projectPatterns.has(userId)) {
      this.projectPatterns.set(userId, new Map());
    }
    
    const userProjects = this.projectPatterns.get(userId);
    
    if (!userProjects.has(projectId)) {
      userProjects.set(projectId, {
        actions: [],
        phases: [],
        timeSpent: 0,
        completionRate: 0,
        commonWorkflows: new Map(),
        stuckPoints: []
      });
    }
    
    const projectData = userProjects.get(projectId);
    const lastAction = userSession.actions[userSession.actions.length - 1];
    
    projectData.actions.push({
      type: lastAction.type,
      timestamp: lastAction.timestamp,
      context: lastAction.context
    });
    
    // Анализируем фазы проекта
    this.analyzeProjectPhases(projectData, lastAction);
    
    // Анализируем рабочие процессы
    this.analyzeProjectWorkflows(projectData);
    
    // Выявляем точки застревания
    this.identifyStuckPoints(projectData);
  }

  /**
   * Анализирует фазы проекта
   */
  analyzeProjectPhases(projectData, currentAction) {
    const phaseIndicators = {
      'planning': ['планирование', 'концепция', 'идея', 'requirements'],
      'design': ['дизайн', 'макет', 'прототип', 'layout'],
      'development': ['создание', 'разработка', 'implementation', 'coding'],
      'testing': ['тест', 'проверка', 'validation', 'review'],
      'optimization': ['оптимизация', 'улучшение', 'optimization', 'refinement'],
      'completion': ['финал', 'завершение', 'completion', 'delivery']
    };
    
    const actionType = currentAction.type.toLowerCase();
    const actionContext = JSON.stringify(currentAction.context).toLowerCase();
    
    let detectedPhase = 'unknown';
    
    Object.entries(phaseIndicators).forEach(([phase, indicators]) => {
      if (indicators.some(indicator => 
        actionType.includes(indicator) || actionContext.includes(indicator)
      )) {
        detectedPhase = phase;
      }
    });
    
    // Добавляем фазу если она изменилась
    const lastPhase = projectData.phases[projectData.phases.length - 1];
    if (!lastPhase || lastPhase.phase !== detectedPhase) {
      projectData.phases.push({
        phase: detectedPhase,
        startTime: currentAction.timestamp,
        actions: []
      });
    }
    
    // Добавляем действие к текущей фазе
    if (projectData.phases.length > 0) {
      projectData.phases[projectData.phases.length - 1].actions.push(currentAction);
    }
  }

  /**
   * Анализирует рабочие процессы проекта
   */
  analyzeProjectWorkflows(projectData) {
    const recentActions = projectData.actions.slice(-10);
    
    // Ищем повторяющиеся последовательности в рамках проекта
    for (let i = 2; i <= Math.min(4, recentActions.length); i++) {
      const workflow = recentActions.slice(-i).map(action => action.type).join(' → ');
      const currentCount = projectData.commonWorkflows.get(workflow) || 0;
      projectData.commonWorkflows.set(workflow, currentCount + 1);
    }
  }

  /**
   * Выявляет точки застревания
   */
  identifyStuckPoints(projectData) {
    const recentActions = projectData.actions.slice(-5);
    
    // Ищем повторяющиеся неуспешные действия
    const actionTypes = recentActions.map(action => action.type);
    const repeatedActions = actionTypes.filter((type, index) => 
      actionTypes.indexOf(type) !== index
    );
    
    if (repeatedActions.length > 0) {
      const stuckPoint = {
        actions: repeatedActions,
        timestamp: Date.now(),
        context: recentActions[recentActions.length - 1].context,
        phase: this.getCurrentPhase(projectData)
      };
      
      projectData.stuckPoints.push(stuckPoint);
      
      // Ограничиваем историю
      if (projectData.stuckPoints.length > 10) {
        projectData.stuckPoints.shift();
      }
    }
  }

  /**
   * Получает текущую фазу проекта
   */
  getCurrentPhase(projectData) {
    if (projectData.phases.length > 0) {
      return projectData.phases[projectData.phases.length - 1].phase;
    }
    return 'unknown';
  }

  /**
   * Анализирует контекстуальные паттерны
   */
  analyzeContextualPatterns(userId, userSession, context) {
    if (!this.contextualPatterns.has(userId)) {
      this.contextualPatterns.set(userId, {
        devicePatterns: new Map(),
        locationPatterns: new Map(),
        moodPatterns: new Map(),
        workloadPatterns: new Map()
      });
    }
    
    const contextData = this.contextualPatterns.get(userId);
    
    // Анализируем паттерны устройств
    if (context.device) {
      const deviceKey = `${context.device}:${userSession.actions[userSession.actions.length - 1].type}`;
      contextData.devicePatterns.set(deviceKey, (contextData.devicePatterns.get(deviceKey) || 0) + 1);
    }
    
    // Анализируем локационные паттерны
    if (context.location) {
      const locationKey = `${context.location}:${userSession.actions[userSession.actions.length - 1].type}`;
      contextData.locationPatterns.set(locationKey, (contextData.locationPatterns.get(locationKey) || 0) + 1);
    }
    
    // Анализируем паттерны настроения
    if (context.mood || context.userMood) {
      const mood = context.mood || context.userMood;
      const moodKey = `${mood}:${userSession.actions[userSession.actions.length - 1].type}`;
      contextData.moodPatterns.set(moodKey, (contextData.moodPatterns.get(moodKey) || 0) + 1);
    }
    
    // Анализируем паттерны рабочей нагрузки
    if (context.workload) {
      const workloadKey = `${context.workload}:${userSession.actions[userSession.actions.length - 1].type}`;
      contextData.workloadPatterns.set(workloadKey, (contextData.workloadPatterns.get(workloadKey) || 0) + 1);
    }
  }

  /**
   * Извлекает поведенческие инсайты
   */
  extractBehavioralInsights(userId, userSession) {
    const insights = {
      userId: userId,
      timestamp: Date.now(),
      
      // Основные паттерны
      topActionSequences: this.getTopActionSequences(userId),
      preferredTimes: this.getPreferredTimes(userId),
      projectWorkflows: this.getProjectWorkflows(userId),
      contextualPreferences: this.getContextualPreferences(userId),
      
      // Предсказания
      nextLikelyActions: this.predictNextActions(userId),
      optimalTiming: this.predictOptimalTiming(userId),
      potentialStuckPoints: this.predictStuckPoints(userId),
      
      // Рекомендации
      proactiveRecommendations: this.generateProactiveRecommendations(userId),
      optimizationSuggestions: this.generateOptimizationSuggestions(userId)
    };
    
    return insights;
  }

  /**
   * Получает топ последовательностей действий
   */
  getTopActionSequences(userId) {
    const userSequences = this.actionSequences.get(userId);
    if (!userSequences) return [];
    
    return Array.from(userSequences.entries())
      .filter(([key]) => !key.endsWith('_contexts'))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sequence, count]) => ({
        sequence: sequence,
        frequency: count,
        contexts: userSequences.get(sequence + '_contexts') || []
      }));
  }

  /**
   * Получает предпочтительные времена
   */
  getPreferredTimes(userId) {
    const timeData = this.timePatterns.get(userId);
    if (!timeData) return {};
    
    return {
      peakTimes: timeData.peakTimes || [],
      averageSessionDuration: this.calculateAverageSessionDuration(timeData.sessionDurations),
      mostActiveDay: this.getMostActiveDay(timeData.weeklyPatterns),
      preferredTimeBlocks: this.getPreferredTimeBlocks(timeData.dailyPatterns)
    };
  }

  /**
   * Вычисляет среднюю длительность сессии
   */
  calculateAverageSessionDuration(sessionDurations) {
    if (sessionDurations.length === 0) return 0;
    
    const totalDuration = sessionDurations.reduce((sum, session) => sum + session.duration, 0);
    return Math.round(totalDuration / sessionDurations.length);
  }

  /**
   * Получает самый активный день
   */
  getMostActiveDay(weeklyPatterns) {
    const dayActivity = new Map();
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    
    weeklyPatterns.forEach((count, key) => {
      const day = parseInt(key.split(':')[0]);
      dayActivity.set(day, (dayActivity.get(day) || 0) + count);
    });
    
    const mostActiveDay = Array.from(dayActivity.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mostActiveDay) {
      return {
        day: dayNames[mostActiveDay[0]],
        activity: mostActiveDay[1]
      };
    }
    
    return null;
  }

  /**
   * Получает предпочтительные временные блоки
   */
  getPreferredTimeBlocks(dailyPatterns) {
    const timeBlocks = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };
    
    dailyPatterns.forEach((count, key) => {
      const hour = parseInt(key.split(':')[0]);
      
      if (hour >= 6 && hour < 12) timeBlocks.morning += count;
      else if (hour >= 12 && hour < 17) timeBlocks.afternoon += count;
      else if (hour >= 17 && hour < 22) timeBlocks.evening += count;
      else timeBlocks.night += count;
    });
    
    return Object.entries(timeBlocks)
      .sort((a, b) => b[1] - a[1])
      .map(([period, activity]) => ({ period, activity }));
  }

  /**
   * Получает рабочие процессы проектов
   */
  getProjectWorkflows(userId) {
    const userProjects = this.projectPatterns.get(userId);
    if (!userProjects) return [];
    
    const workflows = [];
    
    userProjects.forEach((projectData, projectId) => {
      const topWorkflows = Array.from(projectData.commonWorkflows.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      workflows.push({
        projectId: projectId,
        phases: projectData.phases,
        topWorkflows: topWorkflows,
        stuckPoints: projectData.stuckPoints
      });
    });
    
    return workflows;
  }

  /**
   * Получает контекстуальные предпочтения
   */
  getContextualPreferences(userId) {
    const contextData = this.contextualPatterns.get(userId);
    if (!contextData) return {};
    
    return {
      preferredDevices: this.getTopContextPattern(contextData.devicePatterns),
      preferredLocations: this.getTopContextPattern(contextData.locationPatterns),
      moodInfluences: this.getTopContextPattern(contextData.moodPatterns),
      workloadPatterns: this.getTopContextPattern(contextData.workloadPatterns)
    };
  }

  /**
   * Получает топ контекстуальных паттернов
   */
  getTopContextPattern(patternMap) {
    return Array.from(patternMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pattern, count]) => {
        const [context, action] = pattern.split(':');
        return { context, action, frequency: count };
      });
  }

  /**
   * Предсказывает следующие действия
   */
  predictNextActions(userId) {
    const userSequences = this.actionSequences.get(userId);
    if (!userSequences) return [];
    
    const userSession = this.userSessions.get(userId);
    const recentActions = userSession.actions.slice(-3).map(action => action.type);
    
    const predictions = [];
    
    // Ищем последовательности, которые начинаются с недавних действий
    userSequences.forEach((count, sequence) => {
      if (sequence.endsWith('_contexts')) return;
      
      const sequenceActions = sequence.split(' → ');
      
      // Проверяем, подходит ли начало последовательности к недавним действиям
      for (let i = 1; i <= Math.min(recentActions.length, sequenceActions.length - 1); i++) {
        const recentSubseq = recentActions.slice(-i);
        const seqStart = sequenceActions.slice(0, i);
        
        if (JSON.stringify(recentSubseq) === JSON.stringify(seqStart)) {
          const nextAction = sequenceActions[i];
          if (nextAction) {
            predictions.push({
              action: nextAction,
              confidence: count / 10, // Нормализуем уверенность
              basedOnSequence: sequence,
              frequency: count
            });
          }
        }
      }
    });
    
    // Сортируем по уверенности и возвращаем топ-5
    return predictions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  /**
   * Предсказывает оптимальное время
   */
  predictOptimalTiming(userId) {
    const timeData = this.timePatterns.get(userId);
    if (!timeData || !timeData.peakTimes.length) return null;
    
    const currentHour = new Date().getHours();
    const nextPeakTime = timeData.peakTimes.find(peak => peak.hour > currentHour) ||
                        timeData.peakTimes[0]; // Первый пик завтра
    
    return {
      nextOptimalHour: nextPeakTime.hour,
      period: nextPeakTime.period,
      expectedActivity: nextPeakTime.activity,
      suggestion: this.generateTimingSuggestion(nextPeakTime, currentHour)
    };
  }

  /**
   * Генерирует предложение по времени
   */
  generateTimingSuggestion(nextPeak, currentHour) {
    const hourDiff = nextPeak.hour > currentHour ? 
      nextPeak.hour - currentHour : 
      (24 - currentHour) + nextPeak.hour;
    
    if (hourDiff <= 2) {
      return `Скоро ваше активное время (через ${hourDiff} ч.)`;
    } else if (hourDiff <= 6) {
      return `Рекомендую вернуться через ${hourDiff} часов`;
    } else {
      return `Завтра в ${nextPeak.hour}:00 вы обычно наиболее активны`;
    }
  }

  /**
   * Предсказывает потенциальные точки застревания
   */
  predictStuckPoints(userId) {
    const userProjects = this.projectPatterns.get(userId);
    if (!userProjects) return [];
    
    const stuckPredictions = [];
    
    userProjects.forEach((projectData, projectId) => {
      // Анализируем исторические точки застревания
      const stuckHistory = projectData.stuckPoints;
      const currentPhase = this.getCurrentPhase(projectData);
      
      // Ищем паттерны застревания в текущей фазе
      const phaseStuckPoints = stuckHistory.filter(point => point.phase === currentPhase);
      
      if (phaseStuckPoints.length > 0) {
        const commonStuckActions = this.findCommonStuckActions(phaseStuckPoints);
        
        stuckPredictions.push({
          projectId: projectId,
          phase: currentPhase,
          riskLevel: this.calculateStuckRisk(phaseStuckPoints, projectData.actions),
          commonIssues: commonStuckActions,
          preventionSuggestions: this.generatePreventionSuggestions(commonStuckActions)
        });
      }
    });
    
    return stuckPredictions;
  }

  /**
   * Находит общие действия застревания
   */
  findCommonStuckActions(stuckPoints) {
    const actionCounts = new Map();
    
    stuckPoints.forEach(point => {
      point.actions.forEach(action => {
        actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
      });
    });
    
    return Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([action, count]) => ({ action, frequency: count }));
  }

  /**
   * Вычисляет риск застревания
   */
  calculateStuckRisk(stuckHistory, recentActions) {
    if (stuckHistory.length === 0) return 0;
    
    const recentActionTypes = recentActions.slice(-5).map(action => action.type);
    const stuckActionTypes = stuckHistory.flatMap(point => point.actions);
    
    const overlapCount = recentActionTypes.filter(action => 
      stuckActionTypes.includes(action)
    ).length;
    
    return Math.min(1.0, overlapCount / recentActionTypes.length);
  }

  /**
   * Генерирует предложения по предотвращению
   */
  generatePreventionSuggestions(commonStuckActions) {
    const suggestions = [];
    
    commonStuckActions.forEach(({ action, frequency }) => {
      if (action.includes('векторизация')) {
        suggestions.push('Попробуйте изменить параметры качества векторизации');
      } else if (action.includes('цвет')) {
        suggestions.push('Рассмотрите альтернативные цветовые схемы');
      } else if (action.includes('дизайн')) {
        suggestions.push('Возможно, стоит упростить дизайн или разбить на этапы');
      } else {
        suggestions.push(`Избегайте повторения "${action}" - попробуйте другой подход`);
      }
    });
    
    return suggestions;
  }

  /**
   * Генерирует проактивные рекомендации
   */
  generateProactiveRecommendations(userId) {
    const insights = this.extractBehavioralInsights(userId);
    const recommendations = [];
    
    // Рекомендации на основе предсказанных действий
    insights.nextLikelyActions.forEach(prediction => {
      if (prediction.confidence > 0.5) {
        recommendations.push({
          type: 'next_action',
          priority: 'high',
          message: `Возможно, вам понадобится "${prediction.action}"`,
          confidence: prediction.confidence,
          action: prediction.action
        });
      }
    });
    
    // Рекомендации на основе времени
    if (insights.optimalTiming) {
      recommendations.push({
        type: 'timing',
        priority: 'medium',
        message: insights.optimalTiming.suggestion,
        timing: insights.optimalTiming
      });
    }
    
    // Рекомендации по предотвращению застревания
    insights.potentialStuckPoints.forEach(stuckPoint => {
      if (stuckPoint.riskLevel > 0.6) {
        recommendations.push({
          type: 'stuck_prevention',
          priority: 'high',
          message: `Внимание: высокий риск застревания в фазе "${stuckPoint.phase}"`,
          suggestions: stuckPoint.preventionSuggestions,
          riskLevel: stuckPoint.riskLevel
        });
      }
    });
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Генерирует предложения по оптимизации
   */
  generateOptimizationSuggestions(userId) {
    const insights = this.extractBehavioralInsights(userId);
    const suggestions = [];
    
    // Оптимизация времени
    const timePrefs = insights.preferredTimes;
    if (timePrefs.averageSessionDuration > 0) {
      const optimalDuration = timePrefs.averageSessionDuration;
      suggestions.push({
        type: 'time_optimization',
        message: `Ваши оптимальные сессии длятся ~${Math.round(optimalDuration / 60000)} минут`,
        suggestion: 'Планируйте задачи под эту длительность'
      });
    }
    
    // Оптимизация рабочих процессов
    insights.projectWorkflows.forEach(workflow => {
      if (workflow.topWorkflows.length > 0) {
        const mostCommon = workflow.topWorkflows[0];
        suggestions.push({
          type: 'workflow_optimization',
          message: `В проекте "${workflow.projectId}" чаще всего используете: ${mostCommon[0]}`,
          suggestion: 'Создать шаблон для этого рабочего процесса'
        });
      }
    });
    
    // Контекстуальная оптимизация
    const contextPrefs = insights.contextualPreferences;
    if (contextPrefs.preferredDevices && contextPrefs.preferredDevices.length > 0) {
      const topDevice = contextPrefs.preferredDevices[0];
      suggestions.push({
        type: 'context_optimization',
        message: `Вы наиболее продуктивны на устройстве: ${topDevice.context}`,
        suggestion: 'Планируйте важные задачи на это устройство'
      });
    }
    
    return suggestions;
  }
}

/**
 * КОНТЕКСТНЫЙ ПРЕДИКТОР
 * Учитывает текущий проект и стадию работы для предсказаний
 */
class ContextualPredictor {
  constructor() {
    this.projectContexts = new Map();
    this.workflowContexts = new Map();
    this.domainKnowledge = this.initializeDomainKnowledge();
  }

  /**
   * Инициализация знаний о предметных областях
   */
  initializeDomainKnowledge() {
    return {
      vectorization: {
        typical_sequence: ['upload_image', 'choose_settings', 'vectorize', 'review_result', 'adjust_settings', 'export'],
        common_issues: ['quality_too_low', 'too_many_colors', 'missing_details'],
        success_indicators: ['clean_vectors', 'appropriate_colors', 'scalable_result']
      },
      embroidery: {
        typical_sequence: ['vectorize_image', 'optimize_colors', 'generate_embroidery', 'review_pattern', 'adjust_settings', 'export_files'],
        common_issues: ['color_count_too_high', 'pattern_too_complex', 'thread_breaks'],
        success_indicators: ['embroidery_ready', 'color_count_optimal', 'machine_compatible']
      },
      design: {
        typical_sequence: ['concept', 'sketch', 'refine', 'color_scheme', 'finalize', 'export'],
        common_issues: ['unclear_concept', 'color_mismatch', 'scale_problems'],
        success_indicators: ['clear_design', 'good_composition', 'brand_aligned']
      }
    };
  }

  /**
   * Предсказывает следующие шаги на основе контекста
   */
  predictContextualSteps(userId, currentContext) {
    SmartLogger.predict('Предсказываем контекстуальные шаги', { userId, context: currentContext.type });
    
    const predictions = {
      nextSteps: [],
      potentialIssues: [],
      optimizations: [],
      contextualTips: []
    };
    
    // Определяем предметную область
    const domain = this.identifyDomain(currentContext);
    
    if (domain && this.domainKnowledge[domain]) {
      // Предсказываем следующие шаги
      predictions.nextSteps = this.predictDomainSteps(domain, currentContext);
      
      // Предсказываем потенциальные проблемы
      predictions.potentialIssues = this.predictDomainIssues(domain, currentContext);
      
      // Предлагаем оптимизации
      predictions.optimizations = this.suggestDomainOptimizations(domain, currentContext);
      
      // Генерируем контекстуальные советы
      predictions.contextualTips = this.generateContextualTips(domain, currentContext);
    }
    
    // Учитываем историю пользователя
    this.enhanceWithUserHistory(userId, predictions, currentContext);
    
    return predictions;
  }

  /**
   * Определяет предметную область
   */
  identifyDomain(context) {
    const contextStr = JSON.stringify(context).toLowerCase();
    
    if (contextStr.includes('vector') || contextStr.includes('svg')) return 'vectorization';
    if (contextStr.includes('embroidery') || contextStr.includes('вышивка')) return 'embroidery';
    if (contextStr.includes('design') || contextStr.includes('дизайн')) return 'design';
    
    return null;
  }

  /**
   * Предсказывает шаги в предметной области
   */
  predictDomainSteps(domain, currentContext) {
    const domainData = this.domainKnowledge[domain];
    const currentStep = this.identifyCurrentStep(domain, currentContext);
    
    const currentIndex = domainData.typical_sequence.indexOf(currentStep);
    const nextSteps = [];
    
    if (currentIndex >= 0 && currentIndex < domainData.typical_sequence.length - 1) {
      // Следующий шаг в последовательности
      nextSteps.push({
        step: domainData.typical_sequence[currentIndex + 1],
        confidence: 0.8,
        type: 'sequential',
        description: this.getStepDescription(domain, domainData.typical_sequence[currentIndex + 1])
      });
      
      // Альтернативные шаги
      if (currentIndex < domainData.typical_sequence.length - 2) {
        nextSteps.push({
          step: domainData.typical_sequence[currentIndex + 2],
          confidence: 0.4,
          type: 'alternative',
          description: this.getStepDescription(domain, domainData.typical_sequence[currentIndex + 2])
        });
      }
    }
    
    return nextSteps;
  }

  /**
   * Определяет текущий шаг
   */
  identifyCurrentStep(domain, context) {
    const contextStr = JSON.stringify(context).toLowerCase();
    const domainData = this.domainKnowledge[domain];
    
    // Ищем соответствие текущего контекста шагам
    for (const step of domainData.typical_sequence) {
      const stepKeywords = step.split('_');
      if (stepKeywords.some(keyword => contextStr.includes(keyword))) {
        return step;
      }
    }
    
    return domainData.typical_sequence[0]; // Первый шаг по умолчанию
  }

  /**
   * Получает описание шага
   */
  getStepDescription(domain, step) {
    const descriptions = {
      vectorization: {
        upload_image: 'Загрузка изображения для векторизации',
        choose_settings: 'Выбор параметров векторизации',
        vectorize: 'Запуск процесса векторизации',
        review_result: 'Просмотр и оценка результата',
        adjust_settings: 'Корректировка параметров',
        export: 'Экспорт векторного файла'
      },
      embroidery: {
        vectorize_image: 'Векторизация исходного изображения',
        optimize_colors: 'Оптимизация цветовой палитры',
        generate_embroidery: 'Генерация схемы вышивки',
        review_pattern: 'Просмотр схемы стежков',
        adjust_settings: 'Настройка параметров вышивки',
        export_files: 'Экспорт файлов для машины'
      },
      design: {
        concept: 'Разработка концепции дизайна',
        sketch: 'Создание эскиза',
        refine: 'Доработка и уточнение',
        color_scheme: 'Выбор цветовой схемы',
        finalize: 'Финализация дизайна',
        export: 'Экспорт готового дизайна'
      }
    };
    
    return descriptions[domain]?.[step] || step;
  }

  /**
   * Предсказывает проблемы в предметной области
   */
  predictDomainIssues(domain, currentContext) {
    const domainData = this.domainKnowledge[domain];
    const currentStep = this.identifyCurrentStep(domain, currentContext);
    
    const potentialIssues = [];
    
    // Общие проблемы для предметной области
    domainData.common_issues.forEach(issue => {
      potentialIssues.push({
        issue: issue,
        probability: this.calculateIssueProbability(issue, currentStep, currentContext),
        prevention: this.getPreventionTip(domain, issue),
        step: currentStep
      });
    });
    
    // Проблемы, специфичные для текущего шага
    const stepSpecificIssues = this.getStepSpecificIssues(domain, currentStep);
    potentialIssues.push(...stepSpecificIssues);
    
    return potentialIssues.filter(issue => issue.probability > 0.3);
  }

  /**
   * Вычисляет вероятность проблемы
   */
  calculateIssueProbability(issue, currentStep, context) {
    let probability = 0.5; // Базовая вероятность
    
    // Увеличиваем вероятность на основе контекста
    const contextStr = JSON.stringify(context).toLowerCase();
    
    if (issue.includes('quality') && contextStr.includes('low')) probability += 0.3;
    if (issue.includes('color') && contextStr.includes('many')) probability += 0.4;
    if (issue.includes('complex') && contextStr.includes('detailed')) probability += 0.3;
    
    return Math.min(1.0, probability);
  }

  /**
   * Получает совет по предотвращению
   */
  getPreventionTip(domain, issue) {
    const tips = {
      vectorization: {
        quality_too_low: 'Увеличьте разрешение исходного изображения',
        too_many_colors: 'Уменьшите количество цветов в настройках',
        missing_details: 'Попробуйте настройки с более высокой детализацией'
      },
      embroidery: {
        color_count_too_high: 'Ограничьте палитру до 15 цветов',
        pattern_too_complex: 'Упростите дизайн или увеличьте размер',
        thread_breaks: 'Проверьте натяжение и скорость машины'
      },
      design: {
        unclear_concept: 'Определите ключевое сообщение дизайна',
        color_mismatch: 'Используйте цветовой круг для гармонии',
        scale_problems: 'Тестируйте дизайн в разных размерах'
      }
    };
    
    return tips[domain]?.[issue] || 'Обратитесь за помощью';
  }

  /**
   * Получает проблемы, специфичные для шага
   */
  getStepSpecificIssues(domain, step) {
    const stepIssues = {
      vectorization: {
        choose_settings: [
          { issue: 'wrong_color_count', probability: 0.6, prevention: 'Начните с 8-12 цветов' },
          { issue: 'unsuitable_quality', probability: 0.4, prevention: 'Выберите качество исходя из назначения' }
        ],
        review_result: [
          { issue: 'unsatisfactory_result', probability: 0.5, prevention: 'Настройте параметры качества' }
        ]
      }
    };
    
    return stepIssues[domain]?.[step] || [];
  }

  /**
   * Предлагает оптимизации для предметной области
   */
  suggestDomainOptimizations(domain, currentContext) {
    const optimizations = [];
    
    switch (domain) {
      case 'vectorization':
        optimizations.push({
          type: 'quality',
          suggestion: 'Используйте качество "печать" для логотипов',
          benefit: 'Лучше подходит для масштабирования'
        });
        break;
        
      case 'embroidery':
        optimizations.push({
          type: 'efficiency',
          suggestion: 'Группируйте цвета для уменьшения смены нитей',
          benefit: 'Ускоряет процесс вышивки'
        });
        break;
        
      case 'design':
        optimizations.push({
          type: 'workflow',
          suggestion: 'Создайте несколько вариантов цветовых схем',
          benefit: 'Больше вариантов для выбора'
        });
        break;
    }
    
    return optimizations;
  }

  /**
   * Генерирует контекстуальные советы
   */
  generateContextualTips(domain, currentContext) {
    const tips = [];
    
    // Советы на основе времени
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      tips.push({
        type: 'timing',
        tip: 'Утреннее время идеально для творческих задач',
        relevance: 'high'
      });
    }
    
    // Советы на основе предметной области
    switch (domain) {
      case 'vectorization':
        tips.push({
          type: 'technical',
          tip: 'Сохраняйте промежуточные результаты',
          relevance: 'medium'
        });
        break;
        
      case 'embroidery':
        tips.push({
          type: 'practical',
          tip: 'Тестируйте на образце ткани перед основной вышивкой',
          relevance: 'high'
        });
        break;
    }
    
    return tips;
  }

  /**
   * Улучшает предсказания на основе истории пользователя
   */
  enhanceWithUserHistory(userId, predictions, currentContext) {
    // Здесь можно интегрировать с BehavioralPatternAnalyzer
    // для учета персональной истории пользователя
    
    // Пример: корректировка уверенности на основе успешности прошлых действий
    predictions.nextSteps.forEach(step => {
      // Логика корректировки на основе истории
      if (this.hasUserSuccessWithStep(userId, step.step)) {
        step.confidence = Math.min(1.0, step.confidence + 0.1);
      }
    });
  }

  /**
   * Проверяет успешность пользователя с определенным шагом
   */
  hasUserSuccessWithStep(userId, step) {
    // Заглушка - в реальной системе здесь был бы анализ истории
    return Math.random() > 0.5;
  }
}

/**
 * ПРОАКТИВНЫЙ ДВИЖОК
 * Генерирует своевременные предложения и подготавливает ресурсы
 */
class ProactiveEngine {
  constructor() {
    this.activeRecommendations = new Map();
    this.scheduledSuggestions = new Map();
    this.resourcePreparation = new Map();
    this.notificationQueue = [];
  }

  /**
   * Генерирует проактивные предложения
   */
  generateProactiveSuggestions(userId, behavioralInsights, contextPredictions) {
    SmartLogger.predict('Генерируем проактивные предложения', { userId });
    
    const suggestions = {
      immediate: [],
      scheduled: [],
      conditional: [],
      preparatory: []
    };
    
    // Немедленные предложения на основе паттернов
    suggestions.immediate = this.generateImmediateSuggestions(behavioralInsights);
    
    // Запланированные предложения на основе времени
    suggestions.scheduled = this.generateScheduledSuggestions(behavioralInsights);
    
    // Условные предложения на основе контекста
    suggestions.conditional = this.generateConditionalSuggestions(contextPredictions);
    
    // Подготовительные действия
    suggestions.preparatory = this.generatePreparatorySuggestions(contextPredictions);
    
    // Сохраняем предложения для пользователя
    this.activeRecommendations.set(userId, suggestions);
    
    return suggestions;
  }

  /**
   * Генерирует немедленные предложения
   */
  generateImmediateSuggestions(insights) {
    const immediate = [];
    
    // Предложения на основе предсказанных действий
    insights.nextLikelyActions.forEach(prediction => {
      if (prediction.confidence > 0.7) {
        immediate.push({
          type: 'next_action',
          priority: 'high',
          message: `Готов помочь с "${prediction.action}"`,
          action: prediction.action,
          confidence: prediction.confidence,
          preparationTime: 0
        });
      }
    });
    
    // Предложения на основе проектных паттернов
    insights.projectWorkflows.forEach(workflow => {
      workflow.stuckPoints.forEach(stuckPoint => {
        if (Date.now() - stuckPoint.timestamp < 3600000) { // Последний час
          immediate.push({
            type: 'assistance',
            priority: 'high',
            message: `Нужна помощь с "${stuckPoint.actions[0]}"?`,
            assistance: this.generateAssistanceOptions(stuckPoint),
            preparationTime: 0
          });
        }
      });
    });
    
    return immediate;
  }

  /**
   * Генерирует варианты помощи
   */
  generateAssistanceOptions(stuckPoint) {
    const options = [];
    
    // Безопасная проверка наличия actions
    const actions = stuckPoint.actions || [];
    
    actions.forEach(action => {
      if (action && typeof action === 'string') {
        if (action.includes('векторизация')) {
          options.push('Попробовать другие параметры векторизации');
          options.push('Предварительно обработать изображение');
        } else if (action.includes('цвет')) {
          options.push('Автоматически оптимизировать палитру');
          options.push('Показать альтернативные цветовые схемы');
        }
      }
    });
    
    // Если нет действий, добавляем общие варианты помощи
    if (options.length === 0) {
      options.push('Попробовать альтернативный подход');
      options.push('Обратиться за персональной консультацией');
    }
    
    return options;
  }

  /**
   * Генерирует запланированные предложения
   */
  generateScheduledSuggestions(insights) {
    const scheduled = [];
    
    // Предложения на основе оптимального времени
    if (insights.optimalTiming) {
      const optimalTime = insights.optimalTiming;
      const timeUntilOptimal = this.calculateTimeUntilOptimal(optimalTime.nextOptimalHour);
      
      if (timeUntilOptimal > 0 && timeUntilOptimal < 24 * 60 * 60 * 1000) { // В течение суток
        scheduled.push({
          type: 'timing_reminder',
          priority: 'medium',
          message: `Через ${Math.round(timeUntilOptimal / 3600000)} часов ваше оптимальное время для работы`,
          scheduledTime: Date.now() + timeUntilOptimal,
          action: 'remind_optimal_time'
        });
      }
    }
    
    // Предложения на основе проектных фаз
    insights.projectWorkflows.forEach(workflow => {
      const lastPhase = workflow.phases[workflow.phases.length - 1];
      if (lastPhase) {
        const phaseTime = Date.now() - lastPhase.startTime;
        const avgPhaseTime = this.calculateAveragePhaseTime(workflow.phases);
        
        if (phaseTime > avgPhaseTime * 1.5) {
          scheduled.push({
            type: 'phase_transition',
            priority: 'medium',
            message: `Возможно, пора переходить к следующей фазе проекта`,
            scheduledTime: Date.now() + 1800000, // Через 30 минут
            action: 'suggest_phase_transition',
            projectId: workflow.projectId
          });
        }
      }
    });
    
    return scheduled;
  }

  /**
   * Вычисляет время до оптимального часа
   */
  calculateTimeUntilOptimal(optimalHour) {
    const now = new Date();
    const currentHour = now.getHours();
    
    let hoursUntil;
    if (optimalHour > currentHour) {
      hoursUntil = optimalHour - currentHour;
    } else {
      hoursUntil = 24 - currentHour + optimalHour;
    }
    
    return hoursUntil * 60 * 60 * 1000; // В миллисекундах
  }

  /**
   * Вычисляет среднее время фазы
   */
  calculateAveragePhaseTime(phases) {
    if (phases.length < 2) return 3600000; // 1 час по умолчанию
    
    const phaseDurations = [];
    for (let i = 1; i < phases.length; i++) {
      const duration = phases[i].startTime - phases[i - 1].startTime;
      phaseDurations.push(duration);
    }
    
    return phaseDurations.reduce((sum, duration) => sum + duration, 0) / phaseDurations.length;
  }

  /**
   * Генерирует условные предложения
   */
  generateConditionalSuggestions(contextPredictions) {
    const conditional = [];
    
    // Условия на основе следующих шагов
    contextPredictions.nextSteps.forEach(step => {
      conditional.push({
        type: 'conditional_help',
        priority: 'medium',
        condition: `when_user_starts_${step.step}`,
        message: `Когда начнете "${step.description}", я помогу с настройками`,
        trigger: step.step,
        preparationActions: ['prepare_settings', 'load_templates'],
        confidence: step.confidence
      });
    });
    
    // Условия на основе потенциальных проблем
    contextPredictions.potentialIssues.forEach(issue => {
      if (issue.probability > 0.6) {
        conditional.push({
          type: 'issue_prevention',
          priority: 'high',
          condition: `if_issue_${issue.issue}_detected`,
          message: `Обнаружен риск проблемы: ${issue.issue}`,
          prevention: issue.prevention,
          trigger: issue.issue,
          probability: issue.probability
        });
      }
    });
    
    return conditional;
  }

  /**
   * Генерирует подготовительные предложения
   */
  generatePreparatorySuggestions(contextPredictions) {
    const preparatory = [];
    
    // Подготовка ресурсов для следующих шагов
    contextPredictions.nextSteps.forEach(step => {
      if (step.confidence > 0.6) {
        preparatory.push({
          type: 'resource_preparation',
          priority: 'low',
          message: `Подготавливаю ресурсы для "${step.description}"`,
          action: 'preload_resources',
          resources: this.getRequiredResources(step.step),
          estimatedTime: this.estimatePreparationTime(step.step)
        });
      }
    });
    
    // Подготовка к оптимизациям
    contextPredictions.optimizations.forEach(optimization => {
      preparatory.push({
        type: 'optimization_prep',
        priority: 'low',
        message: `Готов предложить оптимизацию: ${optimization.suggestion}`,
        action: 'prepare_optimization',
        optimization: optimization,
        benefit: optimization.benefit
      });
    });
    
    return preparatory;
  }

  /**
   * Получает требуемые ресурсы для шага
   */
  getRequiredResources(step) {
    const resourceMap = {
      vectorize: ['vectorization_engine', 'quality_presets', 'format_converters'],
      choose_settings: ['parameter_templates', 'quality_examples', 'preview_generator'],
      optimize_colors: ['color_algorithms', 'palette_generators', 'harmony_tools'],
      export: ['format_writers', 'compression_tools', 'metadata_processors']
    };
    
    return resourceMap[step] || ['basic_tools'];
  }

  /**
   * Оценивает время подготовки
   */
  estimatePreparationTime(step) {
    const timeMap = {
      vectorize: 2000,      // 2 секунды
      choose_settings: 500,  // 0.5 секунды
      optimize_colors: 1500, // 1.5 секунды
      export: 1000          // 1 секунда
    };
    
    return timeMap[step] || 1000;
  }

  /**
   * Выполняет подготовительные действия
   */
  async executePreparatoryActions(userId, suggestions) {
    const preparationResults = [];
    
    for (const suggestion of suggestions.preparatory) {
      try {
        const result = await this.executePreparation(suggestion);
        preparationResults.push({
          suggestion: suggestion,
          success: true,
          result: result,
          executionTime: Date.now()
        });
      } catch (error) {
        preparationResults.push({
          suggestion: suggestion,
          success: false,
          error: error.message
        });
      }
    }
    
    // Сохраняем результаты подготовки
    this.resourcePreparation.set(userId, preparationResults);
    
    return preparationResults;
  }

  /**
   * Выполняет конкретную подготовку
   */
  async executePreparation(suggestion) {
    SmartLogger.predict(`Выполняем подготовку: ${suggestion.action}`);
    
    switch (suggestion.action) {
      case 'preload_resources':
        return await this.preloadResources(suggestion.resources);
      
      case 'prepare_optimization':
        return await this.prepareOptimization(suggestion.optimization);
      
      case 'prepare_settings':
        return await this.prepareSettings(suggestion);
      
      default:
        return { prepared: true, message: 'Базовая подготовка выполнена' };
    }
  }

  /**
   * Предзагружает ресурсы
   */
  async preloadResources(resources) {
    // Имитация предзагрузки ресурсов
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      preloaded: resources,
      count: resources.length,
      ready: true
    };
  }

  /**
   * Подготавливает оптимизацию
   */
  async prepareOptimization(optimization) {
    return {
      optimization: optimization,
      prepared: true,
      estimatedBenefit: optimization.benefit
    };
  }

  /**
   * Подготавливает настройки
   */
  async prepareSettings(suggestion) {
    return {
      settings: 'prepared',
      templates: 'loaded',
      ready: true
    };
  }

  /**
   * Получает активные рекомендации для пользователя
   */
  getActiveRecommendations(userId) {
    return this.activeRecommendations.get(userId) || {
      immediate: [],
      scheduled: [],
      conditional: [],
      preparatory: []
    };
  }

  /**
   * Обновляет статус рекомендации
   */
  updateRecommendationStatus(userId, recommendationId, status) {
    const recommendations = this.activeRecommendations.get(userId);
    if (!recommendations) return false;
    
    // Ищем рекомендацию во всех категориях
    for (const category of Object.keys(recommendations)) {
      const recommendation = recommendations[category].find(rec => rec.id === recommendationId);
      if (recommendation) {
        recommendation.status = status;
        recommendation.updatedAt = Date.now();
        return true;
      }
    }
    
    return false;
  }

  /**
   * Планирует уведомления
   */
  scheduleNotifications(userId, suggestions) {
    suggestions.scheduled.forEach(suggestion => {
      const notification = {
        userId: userId,
        message: suggestion.message,
        scheduledTime: suggestion.scheduledTime,
        priority: suggestion.priority,
        action: suggestion.action,
        status: 'scheduled'
      };
      
      this.notificationQueue.push(notification);
    });
    
    // Сортируем очередь по времени
    this.notificationQueue.sort((a, b) => a.scheduledTime - b.scheduledTime);
  }

  /**
   * Обрабатывает очередь уведомлений
   */
  processNotificationQueue() {
    const now = Date.now();
    const readyNotifications = [];
    
    // Извлекаем готовые уведомления
    while (this.notificationQueue.length > 0 && this.notificationQueue[0].scheduledTime <= now) {
      const notification = this.notificationQueue.shift();
      notification.status = 'ready';
      readyNotifications.push(notification);
    }
    
    return readyNotifications;
  }
}

/**
 * СИСТЕМА УПРАВЛЕНИЯ РЕЛЕВАНТНОСТЬЮ
 * Контролирует частоту и уместность предложений
 */
class RelevanceManager {
  constructor() {
    this.userPreferences = new Map();
    this.notificationHistory = new Map();
    this.relevanceScores = new Map();
    this.adaptiveSettings = new Map();
  }

  /**
   * Оценивает релевантность предложения
   */
  assessRelevance(userId, suggestion, context) {
    SmartLogger.predict('Оцениваем релевантность предложения', { userId, type: suggestion.type });
    
    const relevance = {
      score: 0,
      factors: {},
      recommendation: 'show', // show, delay, skip
      timing: 'immediate' // immediate, delayed, scheduled
    };
    
    // Фактор времени
    relevance.factors.timing = this.assessTimingRelevance(userId, suggestion, context);
    
    // Фактор контекста
    relevance.factors.context = this.assessContextRelevance(userId, suggestion, context);
    
    // Фактор частоты
    relevance.factors.frequency = this.assessFrequencyRelevance(userId, suggestion);
    
    // Фактор пользовательских предпочтений
    relevance.factors.preferences = this.assessPreferenceRelevance(userId, suggestion);
    
    // Вычисляем общую оценку
    relevance.score = this.calculateOverallRelevance(relevance.factors);
    
    // Определяем рекомендацию
    relevance.recommendation = this.determineRecommendation(relevance.score, suggestion);
    relevance.timing = this.determineTiming(relevance.score, suggestion, context);
    
    return relevance;
  }

  /**
   * Оценивает релевантность времени
   */
  assessTimingRelevance(userId, suggestion, context) {
    const currentHour = new Date().getHours();
    const userPrefs = this.getUserPreferences(userId);
    
    let timingScore = 0.5; // Базовая оценка
    
    // Проверяем активные часы пользователя
    if (userPrefs.activeTimes && userPrefs.activeTimes.includes(currentHour)) {
      timingScore += 0.3;
    }
    
    // Проверяем, не время ли отдыха
    if (currentHour < 8 || currentHour > 22) {
      timingScore -= 0.4;
    }
    
    // Проверяем последнюю активность
    const lastActivity = this.getLastActivity(userId);
    if (lastActivity && Date.now() - lastActivity < 300000) { // 5 минут
      timingScore += 0.2;
    }
    
    return Math.max(0, Math.min(1, timingScore));
  }

  /**
   * Оценивает контекстуальную релевантность
   */
  assessContextRelevance(userId, suggestion, context) {
    let contextScore = 0.5;
    
    // Релевантность к текущей задаче
    if (context.currentTask && suggestion.message.toLowerCase().includes(context.currentTask.toLowerCase())) {
      contextScore += 0.4;
    }
    
    // Релевантность к проекту
    if (context.projectId && suggestion.projectId === context.projectId) {
      contextScore += 0.3;
    }
    
    // Релевантность к фазе работы
    if (context.workPhase && suggestion.phase === context.workPhase) {
      contextScore += 0.2;
    }
    
    return Math.max(0, Math.min(1, contextScore));
  }

  /**
   * Оценивает частотную релевантность
   */
  assessFrequencyRelevance(userId, suggestion) {
    const history = this.getNotificationHistory(userId);
    const recentNotifications = history.filter(notification => 
      Date.now() - notification.timestamp < 3600000 // Последний час
    );
    
    let frequencyScore = 1.0;
    
    // Снижаем оценку при частых уведомлениях
    if (recentNotifications.length > 5) {
      frequencyScore -= 0.5;
    } else if (recentNotifications.length > 2) {
      frequencyScore -= 0.2;
    }
    
    // Проверяем повторяющиеся типы предложений
    const sameTypeCount = recentNotifications.filter(notification => 
      notification.type === suggestion.type
    ).length;
    
    if (sameTypeCount > 2) {
      frequencyScore -= 0.3;
    }
    
    return Math.max(0, frequencyScore);
  }

  /**
   * Оценивает соответствие предпочтениям
   */
  assessPreferenceRelevance(userId, suggestion) {
    const userPrefs = this.getUserPreferences(userId);
    let prefScore = 0.5;
    
    // Предпочтения по типам уведомлений
    if (userPrefs.notificationTypes) {
      if (userPrefs.notificationTypes.includes(suggestion.type)) {
        prefScore += 0.3;
      } else if (userPrefs.notificationTypes.includes('minimal')) {
        prefScore -= 0.4;
      }
    }
    
    // Предпочтения по приоритету
    if (userPrefs.minPriority) {
      const priorityValues = { low: 1, medium: 2, high: 3 };
      const suggestionPriority = priorityValues[suggestion.priority] || 1;
      const minPriority = priorityValues[userPrefs.minPriority] || 1;
      
      if (suggestionPriority >= minPriority) {
        prefScore += 0.2;
      } else {
        prefScore -= 0.5;
      }
    }
    
    return Math.max(0, Math.min(1, prefScore));
  }

  /**
   * Вычисляет общую релевантность
   */
  calculateOverallRelevance(factors) {
    const weights = {
      timing: 0.3,
      context: 0.4,
      frequency: 0.2,
      preferences: 0.1
    };
    
    let totalScore = 0;
    Object.entries(factors).forEach(([factor, score]) => {
      totalScore += score * (weights[factor] || 0);
    });
    
    return totalScore;
  }

  /**
   * Определяет рекомендацию по отображению
   */
  determineRecommendation(score, suggestion) {
    // Высокоприоритетные предложения показываем при низкой оценке
    if (suggestion.priority === 'high' && score > 0.3) {
      return 'show';
    }
    
    if (score > 0.7) return 'show';
    if (score > 0.4) return 'delay';
    return 'skip';
  }

  /**
   * Определяет тайминг показа
   */
  determineTiming(score, suggestion, context) {
    if (suggestion.priority === 'high') return 'immediate';
    
    if (score > 0.8) return 'immediate';
    if (score > 0.5) return 'delayed';
    return 'scheduled';
  }

  /**
   * Получает предпочтения пользователя
   */
  getUserPreferences(userId) {
    if (!this.userPreferences.has(userId)) {
      // Настройки по умолчанию
      this.userPreferences.set(userId, {
        notificationTypes: ['next_action', 'assistance', 'timing_reminder'],
        minPriority: 'medium',
        activeTimes: [9, 10, 11, 14, 15, 16, 17],
        maxPerHour: 3
      });
    }
    
    return this.userPreferences.get(userId);
  }

  /**
   * Получает историю уведомлений
   */
  getNotificationHistory(userId) {
    return this.notificationHistory.get(userId) || [];
  }

  /**
   * Получает время последней активности
   */
  getLastActivity(userId) {
    // Заглушка - в реальной системе это было бы из базы данных
    return Date.now() - Math.random() * 600000; // Случайное время в последние 10 минут
  }

  /**
   * Записывает показанное уведомление
   */
  recordShownNotification(userId, suggestion, relevanceData) {
    const history = this.getNotificationHistory(userId);
    
    history.push({
      timestamp: Date.now(),
      type: suggestion.type,
      priority: suggestion.priority,
      message: suggestion.message,
      relevanceScore: relevanceData.score,
      factors: relevanceData.factors,
      action: 'shown'
    });
    
    // Ограничиваем историю последними 100 записями
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.notificationHistory.set(userId, history);
  }

  /**
   * Адаптирует настройки на основе обратной связи
   */
  adaptSettings(userId, feedback) {
    const userPrefs = this.getUserPreferences(userId);
    
    // Адаптация на основе отклика на уведомления
    if (feedback.type === 'notification_dismissed' && feedback.dismissCount > 3) {
      // Увеличиваем минимальный приоритет
      if (userPrefs.minPriority === 'low') userPrefs.minPriority = 'medium';
      else if (userPrefs.minPriority === 'medium') userPrefs.minPriority = 'high';
    }
    
    if (feedback.type === 'notification_acted_upon') {
      // Снижаем порог, если пользователь активно использует уведомления
      if (userPrefs.minPriority === 'high') userPrefs.minPriority = 'medium';
    }
    
    // Адаптация временных предпочтений
    if (feedback.type === 'timing_feedback') {
      const hour = new Date(feedback.timestamp).getHours();
      if (feedback.positive && !userPrefs.activeTimes.includes(hour)) {
        userPrefs.activeTimes.push(hour);
      } else if (!feedback.positive && userPrefs.activeTimes.includes(hour)) {
        userPrefs.activeTimes = userPrefs.activeTimes.filter(h => h !== hour);
      }
    }
    
    this.userPreferences.set(userId, userPrefs);
  }
}

/**
 * ГЛАВНЫЙ КЛАСС ПРЕДИКТИВНОЙ СИСТЕМЫ
 */
class PredictiveSystem {
  constructor() {
    this.behavioralAnalyzer = new BehavioralPatternAnalyzer();
    this.contextualPredictor = new ContextualPredictor();
    this.proactiveEngine = new ProactiveEngine();
    this.relevanceManager = new RelevanceManager();
    this.initialized = false;
    this.predictionCache = new Map();
  }

  /**
   * Инициализация предиктивной системы
   */
  initialize() {
    if (this.initialized) return;
    
    SmartLogger.predict('Инициализация предиктивной системы');
    
    // Запускаем фоновые процессы
    this.startBackgroundProcesses();
    
    this.initialized = true;
    SmartLogger.predict('Предиктивная система готова к работе');
  }

  /**
   * Запускает фоновые процессы
   */
  startBackgroundProcesses() {
    // Обработка очереди уведомлений каждые 30 секунд
    setInterval(() => {
      this.processNotificationQueue();
    }, 30000);
    
    // Очистка кэша каждые 5 минут
    setInterval(() => {
      this.cleanupPredictionCache();
    }, 300000);
  }

  /**
   * Основной метод предсказания
   */
  async predict(userId, currentAction, context = {}) {
    this.initialize();
    
    SmartLogger.predict('Начинаем предсказание для пользователя', { userId, action: currentAction.type });
    
    try {
      // Проверяем кэш
      const cacheKey = this.generateCacheKey(userId, currentAction, context);
      if (this.predictionCache.has(cacheKey)) {
        SmartLogger.predict('Используем кэшированное предсказание');
        return this.predictionCache.get(cacheKey);
      }
      
      // Анализируем поведенческие паттерны
      const behavioralInsights = this.behavioralAnalyzer.analyzeUserBehavior(userId, currentAction, context);
      
      // Получаем контекстуальные предсказания
      const contextPredictions = this.contextualPredictor.predictContextualSteps(userId, context);
      
      // Генерируем проактивные предложения
      const proactiveSuggestions = this.proactiveEngine.generateProactiveSuggestions(
        userId, 
        behavioralInsights, 
        contextPredictions
      );
      
      // Фильтруем предложения по релевантности
      const filteredSuggestions = await this.filterByRelevance(userId, proactiveSuggestions, context);
      
      // Выполняем подготовительные действия
      await this.proactiveEngine.executePreparatoryActions(userId, filteredSuggestions);
      
      // Планируем уведомления
      this.proactiveEngine.scheduleNotifications(userId, filteredSuggestions);
      
      const result = {
        success: true,
        timestamp: Date.now(),
        userId: userId,
        currentAction: currentAction,
        
        // Результаты анализа
        behavioralInsights: behavioralInsights,
        contextPredictions: contextPredictions,
        
        // Предложения
        suggestions: filteredSuggestions,
        
        // Предсказания
        nextLikelyActions: behavioralInsights.nextLikelyActions,
        optimalTiming: behavioralInsights.optimalTiming,
        potentialIssues: contextPredictions.potentialIssues,
        
        // Рекомендации
        proactiveRecommendations: behavioralInsights.proactiveRecommendations,
        optimizations: contextPredictions.optimizations
      };
      
      // Кэшируем результат на 5 минут
      this.predictionCache.set(cacheKey, result);
      setTimeout(() => this.predictionCache.delete(cacheKey), 300000);
      
      SmartLogger.predict('Предсказание завершено успешно');
      return result;
      
    } catch (error) {
      SmartLogger.predict('Ошибка предсказания:', error);
      return {
        success: false,
        error: error.message,
        fallbackSuggestions: this.generateFallbackSuggestions(userId, currentAction)
      };
    }
  }

  /**
   * Генерирует ключ кэша
   */
  generateCacheKey(userId, currentAction, context) {
    const contextStr = JSON.stringify({
      type: context.type,
      projectId: context.projectId,
      phase: context.phase
    });
    
    return `${userId}_${currentAction.type}_${btoa(contextStr).slice(0, 10)}`;
  }

  /**
   * Фильтрует предложения по релевантности
   */
  async filterByRelevance(userId, suggestions, context) {
    const filtered = {
      immediate: [],
      scheduled: [],
      conditional: [],
      preparatory: []
    };
    
    // Фильтруем каждую категорию
    for (const category of Object.keys(suggestions)) {
      for (const suggestion of suggestions[category]) {
        const relevance = this.relevanceManager.assessRelevance(userId, suggestion, context);
        
        if (relevance.recommendation === 'show') {
          suggestion.relevance = relevance;
          suggestion.timing = relevance.timing;
          filtered[category].push(suggestion);
          
          // Записываем показанное уведомление
          this.relevanceManager.recordShownNotification(userId, suggestion, relevance);
        }
      }
    }
    
    return filtered;
  }

  /**
   * Генерирует запасные предложения
   */
  generateFallbackSuggestions(userId, currentAction) {
    return {
      immediate: [{
        type: 'general_help',
        priority: 'medium',
        message: 'Чем могу помочь с текущей задачей?',
        action: 'offer_help'
      }],
      scheduled: [],
      conditional: [],
      preparatory: []
    };
  }

  /**
   * Обрабатывает очередь уведомлений
   */
  processNotificationQueue() {
    const readyNotifications = this.proactiveEngine.processNotificationQueue();
    
    if (readyNotifications.length > 0) {
      SmartLogger.predict(`Обработано ${readyNotifications.length} готовых уведомлений`);
      
      // Здесь можно отправить уведомления через WebSocket или другой механизм
      readyNotifications.forEach(notification => {
        this.deliverNotification(notification);
      });
    }
  }

  /**
   * Доставляет уведомление
   */
  deliverNotification(notification) {
    SmartLogger.predict('Доставляем уведомление', { 
      userId: notification.userId, 
      message: notification.message.substring(0, 50) + '...' 
    });
    
    // Здесь была бы реальная доставка уведомления
    // Например, через WebSocket, push-уведомления и т.д.
  }

  /**
   * Очищает кэш предсказаний
   */
  cleanupPredictionCache() {
    const now = Date.now();
    const maxAge = 300000; // 5 минут
    
    let cleanedCount = 0;
    this.predictionCache.forEach((prediction, key) => {
      if (now - prediction.timestamp > maxAge) {
        this.predictionCache.delete(key);
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      SmartLogger.predict(`Очищено ${cleanedCount} устаревших предсказаний из кэша`);
    }
  }

  /**
   * Получает активные предсказания для пользователя
   */
  getActivePredictions(userId) {
    const active = {
      nextActions: [],
      recommendations: [],
      notifications: [],
      preparations: []
    };
    
    // Получаем активные рекомендации
    const recommendations = this.proactiveEngine.getActiveRecommendations(userId);
    active.recommendations = recommendations;
    
    // Получаем готовые уведомления
    const notifications = this.proactiveEngine.processNotificationQueue()
      .filter(notification => notification.userId === userId);
    active.notifications = notifications;
    
    return active;
  }

  /**
   * Обновляет предсказание на основе обратной связи
   */
  updatePredictionFeedback(userId, predictionId, feedback) {
    // Обновляем настройки релевантности
    this.relevanceManager.adaptSettings(userId, feedback);
    
    // Обновляем статус рекомендации
    this.proactiveEngine.updateRecommendationStatus(userId, predictionId, feedback.status);
    
    SmartLogger.predict('Обновлены настройки на основе обратной связи', { userId, feedback: feedback.type });
  }

  /**
   * Получает статистику предиктивной системы
   */
  getPredictiveStats() {
    return {
      cacheSize: this.predictionCache.size,
      activeUsers: this.behavioralAnalyzer.userSessions.size,
      queueSize: this.proactiveEngine.notificationQueue.length,
      systemHealth: this.assessSystemHealth()
    };
  }

  /**
   * Оценивает здоровье системы
   */
  assessSystemHealth() {
    const stats = this.getPredictiveStats();
    
    const health = {
      overall: 'healthy',
      components: {
        behavioral: 'healthy',
        contextual: 'healthy',
        proactive: 'healthy',
        relevance: 'healthy'
      },
      metrics: {
        cacheEfficiency: this.predictionCache.size > 0 ? 'good' : 'low',
        userEngagement: stats.activeUsers > 0 ? 'good' : 'low',
        queueProcessing: stats.queueSize < 100 ? 'good' : 'overloaded'
      }
    };
    
    // Проверяем метрики
    if (stats.queueSize > 100) {
      health.components.proactive = 'warning';
    }
    
    if (stats.activeUsers === 0) {
      health.overall = 'idle';
    }
    
    return health;
  }
}

// Создаем глобальный экземпляр
const predictiveSystem = new PredictiveSystem();

module.exports = {
  // Основные методы
  predict: (userId, action, context) => 
    predictiveSystem.predict(userId, action, context),
  getActivePredictions: (userId) => 
    predictiveSystem.getActivePredictions(userId),
  updatePredictionFeedback: (predictionId, feedback) => 
    predictiveSystem.updatePredictionFeedback(predictionId, feedback),
  getPredictiveStats: () => 
    predictiveSystem.getPredictiveStats(),
  
  // Компоненты для расширения
  PredictiveSystem,
  BehavioralPatternAnalyzer,
  ContextualPredictor,
  ProactiveEngine,
  RelevanceManager
};