
/**
 * 🐝🧠 СЕМАНТИЧЕСКИЙ РОЙ-ИНТЕЛЛЕКТ
 * Коллективный разум из множественных семантических агентов
 * Каждый агент специализируется на определенном аспекте понимания
 */

const SmartLogger = {
  swarm: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🐝🧠 [${timestamp}] SWARM-INTELLIGENCE: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * СЕМАНТИЧЕСКИЙ АГЕНТ (ПЧЕЛА)
 * Специализированный агент для конкретного аспекта понимания
 */
class SemanticAgent {
  constructor(id, specialization, capabilities = {}) {
    this.id = id;
    this.specialization = specialization;
    this.capabilities = capabilities;
    this.energy = 1.0; // Энергия агента
    this.experience = 0; // Опыт агента
    this.reputation = 0.5; // Репутация среди других агентов
    this.currentTask = null;
    this.communicationLog = [];
    this.discoveries = [];
    this.collaborations = new Map(); // id агента -> количество коллабораций
    this.lastActivity = Date.now();
    this.personalityTraits = this.generatePersonality();
  }

  /**
   * Генерирует уникальную личность агента
   */
  generatePersonality() {
    return {
      curiosity: Math.random(), // Любопытство к новому
      persistence: Math.random(), // Настойчивость в решении задач
      cooperation: Math.random(), // Склонность к сотрудничеству
      creativity: Math.random(), // Креативность в решениях
      precision: Math.random(), // Точность анализа
      initiative: Math.random() // Инициативность
    };
  }

  /**
   * Анализирует запрос согласно своей специализации
   */
  async analyzeQuery(query, context = {}) {
    const startTime = Date.now();
    this.lastActivity = startTime;
    
    // Тратим энергию на анализ
    this.spendEnergy(0.1);
    
    const analysis = await this.performSpecializedAnalysis(query, context);
    
    // Получаем опыт
    this.gainExperience(0.05);
    
    const processingTime = Date.now() - startTime;
    
    SmartLogger.swarm(`🐝 Агент ${this.id} (${this.specialization}) проанализировал запрос за ${processingTime}мс`);
    
    return {
      agentId: this.id,
      specialization: this.specialization,
      analysis,
      confidence: this.calculateConfidence(analysis),
      energy: this.energy,
      processingTime,
      personalityInfluence: this.applyPersonalityInfluence(analysis)
    };
  }

  /**
   * Выполняет специализированный анализ
   */
  async performSpecializedAnalysis(query, context) {
    switch (this.specialization) {
      case 'intent_detection':
        return this.analyzeIntent(query, context);
      
      case 'emotion_analysis':
        return this.analyzeEmotion(query, context);
      
      case 'context_understanding':
        return this.analyzeContext(query, context);
      
      case 'semantic_relations':
        return this.analyzeSemanticRelations(query, context);
      
      case 'creative_interpretation':
        return this.analyzeCreatively(query, context);
      
      case 'technical_analysis':
        return this.analyzeTechnically(query, context);
      
      case 'cultural_context':
        return this.analyzeCulturally(query, context);
      
      case 'temporal_analysis':
        return this.analyzeTemporally(query, context);
      
      default:
        return this.analyzeGenerally(query, context);
    }
  }

  /**
   * Анализ намерений
   */
  analyzeIntent(query, context) {
    const lowerQuery = query.toLowerCase();
    const intents = [];
    
    // Поиск паттернов намерений
    if (lowerQuery.includes('создай') || lowerQuery.includes('сделай')) {
      intents.push({ intent: 'create', confidence: 0.9, evidence: 'создательные глаголы' });
    }
    
    if (lowerQuery.includes('анализ') || lowerQuery.includes('что на')) {
      intents.push({ intent: 'analyze', confidence: 0.8, evidence: 'аналитические маркеры' });
    }
    
    if (lowerQuery.includes('?')) {
      intents.push({ intent: 'question', confidence: 0.7, evidence: 'вопросительная форма' });
    }

    return {
      primaryIntent: intents[0]?.intent || 'unknown',
      alternativeIntents: intents.slice(1),
      intentStrength: intents[0]?.confidence || 0.5,
      evidence: intents.map(i => i.evidence)
    };
  }

  /**
   * Эмоциональный анализ
   */
  analyzeEmotion(query, context) {
    const emotions = new Map([
      ['excitement', 0],
      ['frustration', 0],
      ['curiosity', 0],
      ['urgency', 0],
      ['satisfaction', 0]
    ]);

    // Анализ эмоциональных маркеров
    if (query.includes('!')) emotions.set('excitement', emotions.get('excitement') + 0.3);
    if (query.includes('?')) emotions.set('curiosity', emotions.get('curiosity') + 0.4);
    if (query.includes('срочно') || query.includes('быстр')) emotions.set('urgency', emotions.get('urgency') + 0.6);
    if (query.includes('отлично') || query.includes('супер')) emotions.set('satisfaction', emotions.get('satisfaction') + 0.5);

    const dominantEmotion = Array.from(emotions.entries())
      .sort(([,a], [,b]) => b - a)[0];

    return {
      dominantEmotion: dominantEmotion[0],
      emotionStrength: dominantEmotion[1],
      emotionalProfile: Object.fromEntries(emotions),
      emotionalTone: this.determineEmotionalTone(emotions)
    };
  }

  /**
   * Контекстуальный анализ
   */
  analyzeContext(query, context) {
    return {
      sessionContext: context.sessionId ? 'established' : 'new',
      temporalContext: this.analyzeTemporalMarkers(query),
      projectContext: context.currentProject ? 'continuing' : 'starting',
      userExperience: this.estimateUserExperience(query, context),
      contextualHints: this.extractContextualHints(query, context)
    };
  }

  /**
   * Анализ семантических связей
   */
  analyzeSemanticRelations(query, context) {
    const relations = [];
    const concepts = this.extractConcepts(query);
    
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const relation = this.findRelation(concepts[i], concepts[j]);
        if (relation) {
          relations.push(relation);
        }
      }
    }

    return {
      concepts,
      relations,
      semanticDensity: relations.length / Math.max(1, concepts.length),
      complexityLevel: this.calculateSemanticComplexity(concepts, relations)
    };
  }

  /**
   * Креативный анализ
   */
  analyzeCreatively(query, context) {
    const creativityMarkers = [
      'необычный', 'оригинальный', 'креативный', 'уникальный', 
      'интересный', 'нестандартный', 'инновационный'
    ];

    const hasCreativityMarkers = creativityMarkers.some(marker => 
      query.toLowerCase().includes(marker));

    return {
      creativityPotential: hasCreativityMarkers ? 0.8 : 0.4,
      alternativeInterpretations: this.generateAlternativeInterpretations(query),
      metaphoricalElements: this.findMetaphors(query),
      innovationOpportunities: this.identifyInnovationOpportunities(query, context)
    };
  }

  /**
   * Технический анализ
   */
  analyzeTechnically(query, context) {
    const technicalTerms = ['svg', 'вектор', 'пиксель', 'формат', 'конверт', 'оптимиз'];
    const foundTerms = technicalTerms.filter(term => 
      query.toLowerCase().includes(term));

    return {
      technicalComplexity: foundTerms.length / technicalTerms.length,
      foundTechnicalTerms: foundTerms,
      requiredExpertise: this.assessRequiredExpertise(foundTerms),
      technicalChallenges: this.identifyTechnicalChallenges(query, context)
    };
  }

  /**
   * Культурный анализ
   */
  analyzeCulturally(query, context) {
    return {
      culturalMarkers: this.findCulturalMarkers(query),
      languageStyle: this.analyzeLanguageStyle(query),
      formalityLevel: this.assessFormalityLevel(query),
      culturalContext: this.determineCulturalContext(query, context)
    };
  }

  /**
   * Временной анализ
   */
  analyzeTemporally(query, context) {
    const timeMarkers = ['сейчас', 'сегодня', 'завтра', 'срочно', 'потом', 'позже'];
    const foundMarkers = timeMarkers.filter(marker => 
      query.toLowerCase().includes(marker));

    return {
      temporalUrgency: foundMarkers.includes('срочно') ? 0.9 : 0.3,
      timeMarkers: foundMarkers,
      temporalPerspective: this.determineTemporalPerspective(foundMarkers),
      schedulingImplications: this.assessSchedulingNeeds(query, context)
    };
  }

  /**
   * Общий анализ
   */
  analyzeGenerally(query, context) {
    return {
      queryLength: query.length,
      wordCount: query.split(/\s+/).length,
      complexity: this.assessGeneralComplexity(query),
      clarity: this.assessClarity(query),
      completeness: this.assessCompleteness(query, context)
    };
  }

  /**
   * Коммуникация с другими агентами
   */
  async communicateWith(otherAgent, message, collaborationType = 'information_sharing') {
    this.spendEnergy(0.05);
    
    const communication = {
      timestamp: Date.now(),
      fromAgent: this.id,
      toAgent: otherAgent.id,
      message,
      collaborationType,
      responseReceived: false
    };

    // Записываем коммуникацию
    this.communicationLog.push(communication);
    
    // Увеличиваем счетчик коллабораций
    const currentCollabs = this.collaborations.get(otherAgent.id) || 0;
    this.collaborations.set(otherAgent.id, currentCollabs + 1);

    // Получаем ответ от другого агента
    const response = await otherAgent.receiveMessage(this, message, collaborationType);
    communication.response = response;
    communication.responseReceived = true;

    SmartLogger.swarm(`🐝↔️🐝 ${this.id} связался с ${otherAgent.id}: ${collaborationType}`);

    return response;
  }

  /**
   * Получение сообщения от другого агента
   */
  async receiveMessage(fromAgent, message, collaborationType) {
    // Влияние личности на ответ
    const willingness = this.personalityTraits.cooperation;
    
    if (willingness < 0.3) {
      return { 
        success: false, 
        reason: 'agent_busy',
        alternative: 'try_later'
      };
    }

    // Обрабатываем сообщение согласно типу коллаборации
    let response;
    switch (collaborationType) {
      case 'information_sharing':
        response = this.shareInformation(message);
        break;
      case 'consensus_building':
        response = this.contributeToConsensus(message);
        break;
      case 'problem_solving':
        response = this.helpSolveProblem(message);
        break;
      default:
        response = this.provideGeneralHelp(message);
    }

    // Получаем опыт от коллаборации
    this.gainExperience(0.02);

    return {
      success: true,
      response,
      agentId: this.id,
      collaborationType
    };
  }

  /**
   * Голосование в рое
   */
  voteOnProposal(proposal, evidence) {
    // Вес голоса зависит от репутации и специализации
    const relevanceToSpecialization = this.assessRelevanceToSpecialization(proposal);
    const voteWeight = (this.reputation + relevanceToSpecialization) / 2;
    
    // Решение на основе личности и доказательств
    const decision = this.makeDecision(proposal, evidence);
    
    return {
      agentId: this.id,
      vote: decision,
      weight: voteWeight,
      reasoning: this.explainVote(proposal, evidence, decision)
    };
  }

  // Вспомогательные методы
  spendEnergy(amount) {
    this.energy = Math.max(0, this.energy - amount);
  }

  gainExperience(amount) {
    this.experience += amount;
    // Опыт увеличивает репутацию
    this.reputation = Math.min(1, this.reputation + amount * 0.1);
  }

  calculateConfidence(analysis) {
    // Уверенность зависит от энергии, опыта и качества анализа
    const energyFactor = this.energy;
    const experienceFactor = Math.min(1, this.experience / 10);
    const personalityFactor = this.personalityTraits.precision;
    
    return (energyFactor + experienceFactor + personalityFactor) / 3;
  }

  applyPersonalityInfluence(analysis) {
    return {
      creativityBoost: analysis.creativityPotential ? analysis.creativityPotential * this.personalityTraits.creativity : 0,
      precisionAdjustment: this.personalityTraits.precision,
      persistenceLevel: this.personalityTraits.persistence,
      cooperationReadiness: this.personalityTraits.cooperation
    };
  }

  // Заглушки для сложных методов (могут быть расширены)
  determineEmotionalTone(emotions) { return 'neutral'; }
  analyzeTemporalMarkers(query) { return 'present'; }
  estimateUserExperience(query, context) { return 'intermediate'; }
  extractContextualHints(query, context) { return []; }
  extractConcepts(query) { return query.split(/\s+/).slice(0, 3); }
  findRelation(concept1, concept2) { return null; }
  calculateSemanticComplexity(concepts, relations) { return 0.5; }
  generateAlternativeInterpretations(query) { return []; }
  findMetaphors(query) { return []; }
  identifyInnovationOpportunities(query, context) { return []; }
  assessRequiredExpertise(terms) { return 'beginner'; }
  identifyTechnicalChallenges(query, context) { return []; }
  findCulturalMarkers(query) { return []; }
  analyzeLanguageStyle(query) { return 'informal'; }
  assessFormalityLevel(query) { return 0.5; }
  determineCulturalContext(query, context) { return 'neutral'; }
  determineTemporalPerspective(markers) { return 'immediate'; }
  assessSchedulingNeeds(query, context) { return []; }
  assessGeneralComplexity(query) { return 0.5; }
  assessClarity(query) { return 0.7; }
  assessCompleteness(query, context) { return 0.6; }
  shareInformation(message) { return 'information_shared'; }
  contributeToConsensus(message) { return 'consensus_contribution'; }
  helpSolveProblem(message) { return 'problem_solving_help'; }
  provideGeneralHelp(message) { return 'general_help'; }
  assessRelevanceToSpecialization(proposal) { return 0.7; }
  makeDecision(proposal, evidence) { return 'agree'; }
  explainVote(proposal, evidence, decision) { return `${decision} based on specialization`; }

  /**
   * Восстановление энергии
   */
  rest(duration = 1000) {
    const restAmount = duration / 10000; // 1 секунда = 0.0001 энергии
    this.energy = Math.min(1, this.energy + restAmount);
    SmartLogger.swarm(`🐝😴 Агент ${this.id} восстанавливается (+${restAmount.toFixed(3)} энергии)`);
  }

  /**
   * Экспорт состояния агента
   */
  exportState() {
    return {
      id: this.id,
      specialization: this.specialization,
      energy: this.energy,
      experience: this.experience,
      reputation: this.reputation,
      personalityTraits: this.personalityTraits,
      communicationsCount: this.communicationLog.length,
      collaborationsCount: this.collaborations.size,
      discoveriesCount: this.discoveries.length,
      lastActivity: this.lastActivity
    };
  }
}

/**
 * СЕМАНТИЧЕСКИЙ РОЙ
 * Управляет коллективом семантических агентов
 */
class SemanticSwarm {
  constructor() {
    this.agents = new Map();
    this.swarmIntelligence = 0.5;
    this.consensusThreshold = 0.7;
    this.activeCollaborations = new Map();
    this.swarmMemory = [];
    this.emergentPatterns = [];
    this.decisionHistory = [];
    this.swarmPersonality = this.generateSwarmPersonality();
    
    this.initializeDefaultAgents();
  }

  /**
   * Инициализирует стандартный набор агентов
   */
  initializeDefaultAgents() {
    const agentTypes = [
      { id: 'intent_bee', specialization: 'intent_detection', capabilities: { pattern_recognition: 0.9 } },
      { id: 'emotion_bee', specialization: 'emotion_analysis', capabilities: { empathy: 0.8 } },
      { id: 'context_bee', specialization: 'context_understanding', capabilities: { memory: 0.9 } },
      { id: 'semantic_bee', specialization: 'semantic_relations', capabilities: { association: 0.85 } },
      { id: 'creative_bee', specialization: 'creative_interpretation', capabilities: { imagination: 0.95 } },
      { id: 'technical_bee', specialization: 'technical_analysis', capabilities: { precision: 0.9 } },
      { id: 'cultural_bee', specialization: 'cultural_context', capabilities: { cultural_awareness: 0.7 } },
      { id: 'temporal_bee', specialization: 'temporal_analysis', capabilities: { time_sensitivity: 0.8 } }
    ];

    for (const agentConfig of agentTypes) {
      const agent = new SemanticAgent(agentConfig.id, agentConfig.specialization, agentConfig.capabilities);
      this.agents.set(agent.id, agent);
    }

    SmartLogger.swarm(`🐝🏠 Семантический рой инициализирован с ${this.agents.size} агентами`);
  }

  /**
   * Добавляет нового агента в рой
   */
  addAgent(agent) {
    this.agents.set(agent.id, agent);
    SmartLogger.swarm(`🐝➕ Новый агент ${agent.id} присоединился к рою`);
  }

  /**
   * Коллективный анализ запроса
   */
  async analyzeWithSwarm(query, context = {}) {
    SmartLogger.swarm(`🐝🧠 Запуск коллективного анализа: "${query.substring(0, 50)}..."`);
    
    const startTime = Date.now();
    
    // Фаза 1: Индивидуальный анализ каждого агента
    const individualAnalyses = await this.gatherIndividualAnalyses(query, context);
    
    // Фаза 2: Кросс-коммуникация между агентами
    const collaborativeInsights = await this.facilitateCollaboration(individualAnalyses, query, context);
    
    // Фаза 3: Консенсус и голосование
    const consensus = await this.buildConsensus(individualAnalyses, collaborativeInsights);
    
    // Фаза 4: Эмерджентный интеллект
    const emergentInsights = this.generateEmergentInsights(individualAnalyses, collaborativeInsights, consensus);
    
    // Фаза 5: Финальная интеграция
    const swarmResult = this.integrateSwarmResults(individualAnalyses, collaborativeInsights, consensus, emergentInsights);
    
    const processingTime = Date.now() - startTime;
    
    // Обновляем память роя
    this.updateSwarmMemory(query, swarmResult, context);
    
    SmartLogger.swarm(`🐝✅ Коллективный анализ завершен за ${processingTime}мс`);
    
    return {
      timestamp: startTime,
      processingTime,
      individualAnalyses,
      collaborativeInsights,
      consensus,
      emergentInsights,
      swarmResult,
      swarmIntelligence: this.swarmIntelligence,
      activeAgents: this.getActiveAgentsCount(),
      consensusReached: consensus.consensusReached,
      emergentPatternsDetected: emergentInsights.patterns.length
    };
  }

  /**
   * Собирает индивидуальные анализы от всех агентов
   */
  async gatherIndividualAnalyses(query, context) {
    const analyses = new Map();
    const promises = [];

    // Запускаем анализ параллельно для всех агентов
    for (const [agentId, agent] of this.agents) {
      if (agent.energy > 0.2) { // Только агенты с достаточной энергией
        promises.push(
          agent.analyzeQuery(query, context).then(result => {
            analyses.set(agentId, result);
          })
        );
      }
    }

    await Promise.all(promises);
    
    SmartLogger.swarm(`🐝📊 Собрано ${analyses.size} индивидуальных анализов`);
    
    return analyses;
  }

  /**
   * Фасилитирует коллаборацию между агентами
   */
  async facilitateCollaboration(individualAnalyses, query, context) {
    const collaborations = [];
    const agents = Array.from(this.agents.values()).filter(a => a.energy > 0.3);
    
    // Создаем пары для коллаборации
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agent1 = agents[i];
        const agent2 = agents[j];
        
        // Проверяем совместимость специализаций
        if (this.areSpecializationsCompatible(agent1.specialization, agent2.specialization)) {
          const collaboration = await this.facilitatePairCollaboration(
            agent1, agent2, individualAnalyses, query, context
          );
          
          if (collaboration) {
            collaborations.push(collaboration);
          }
        }
      }
    }
    
    SmartLogger.swarm(`🐝🤝 Проведено ${collaborations.length} коллабораций`);
    
    return collaborations;
  }

  /**
   * Фасилитирует коллаборацию между парой агентов
   */
  async facilitatePairCollaboration(agent1, agent2, analyses, query, context) {
    const analysis1 = analyses.get(agent1.id);
    const analysis2 = analyses.get(agent2.id);
    
    if (!analysis1 || !analysis2) return null;
    
    // Агент 1 делится своими результатами с агентом 2
    const sharing1to2 = await agent1.communicateWith(agent2, {
      analysis: analysis1.analysis,
      specialization: agent1.specialization,
      confidence: analysis1.confidence
    }, 'information_sharing');
    
    // Агент 2 делится своими результатами с агентом 1
    const sharing2to1 = await agent2.communicateWith(agent1, {
      analysis: analysis2.analysis,
      specialization: agent2.specialization,
      confidence: analysis2.confidence
    }, 'information_sharing');
    
    // Синтез результатов
    const synthesis = this.synthesizeCollaboration(analysis1, analysis2, sharing1to2, sharing2to1);
    
    return {
      participants: [agent1.id, agent2.id],
      specializations: [agent1.specialization, agent2.specialization],
      synthesis,
      synergy: this.calculateSynergy(analysis1, analysis2),
      timestamp: Date.now()
    };
  }

  /**
   * Строит консенсус среди агентов
   */
  async buildConsensus(individualAnalyses, collaborativeInsights) {
    const proposals = this.generateConsensusProposals(individualAnalyses, collaborativeInsights);
    const votes = new Map();
    
    // Каждый агент голосует по каждому предложению
    for (const proposal of proposals) {
      const proposalVotes = [];
      
      for (const [agentId, agent] of this.agents) {
        if (agent.energy > 0.1) {
          const vote = agent.voteOnProposal(proposal, {
            individualAnalyses,
            collaborativeInsights
          });
          proposalVotes.push(vote);
        }
      }
      
      votes.set(proposal.id, proposalVotes);
    }
    
    // Анализируем результаты голосования
    const consensusResults = this.analyzeVotingResults(proposals, votes);
    
    return {
      proposals,
      votes: Object.fromEntries(votes),
      consensusReached: consensusResults.consensusStrength > this.consensusThreshold,
      consensusStrength: consensusResults.consensusStrength,
      majorityOpinion: consensusResults.majorityOpinion,
      dissenting: consensusResults.dissenting
    };
  }

  /**
   * Генерирует эмерджентные инсайты
   */
  generateEmergentInsights(individualAnalyses, collaborativeInsights, consensus) {
    const patterns = [];
    const insights = [];
    
    // Поиск эмерджентных паттернов
    const analysisPatterns = this.detectAnalysisPatterns(individualAnalyses);
    const collaborationPatterns = this.detectCollaborationPatterns(collaborativeInsights);
    const consensusPatterns = this.detectConsensusPatterns(consensus);
    
    patterns.push(...analysisPatterns, ...collaborationPatterns, ...consensusPatterns);
    
    // Генерация инсайтов на основе паттернов
    for (const pattern of patterns) {
      const insight = this.generateInsightFromPattern(pattern);
      if (insight) {
        insights.push(insight);
      }
    }
    
    // Поиск синергии
    const synergies = this.detectSynergies(individualAnalyses, collaborativeInsights);
    
    return {
      patterns,
      insights,
      synergies,
      emergentIntelligence: this.calculateEmergentIntelligence(patterns, insights, synergies),
      novelty: this.assessNovelty(patterns, insights)
    };
  }

  /**
   * Интегрирует результаты роя
   */
  integrateSwarmResults(individualAnalyses, collaborativeInsights, consensus, emergentInsights) {
    // Взвешенная интеграция всех анализов
    const weightedResults = this.calculateWeightedResults(individualAnalyses);
    
    // Применяем коллаборативные улучшения
    const collaborativelyEnhanced = this.applyCollaborativeEnhancements(weightedResults, collaborativeInsights);
    
    // Применяем консенсус
    const consensusAdjusted = this.applyConsensusAdjustments(collaborativelyEnhanced, consensus);
    
    // Добавляем эмерджентные элементы
    const finalResult = this.addEmergentElements(consensusAdjusted, emergentInsights);
    
    return {
      primaryInterpretation: finalResult.interpretation,
      confidence: finalResult.confidence,
      swarmAgreement: consensus.consensusStrength,
      emergentElements: emergentInsights.insights,
      recommendedActions: this.generateSwarmRecommendations(finalResult, emergentInsights),
      qualityScore: this.assessSwarmQuality(finalResult, consensus, emergentInsights),
      
      // Мета-информация о рое
      swarmStats: {
        activeAgents: this.getActiveAgentsCount(),
        totalCollaborations: collaborativeInsights.length,
        consensusStrength: consensus.consensusStrength,
        emergentPatternsCount: emergentInsights.patterns.length,
        swarmIntelligence: this.swarmIntelligence
      }
    };
  }

  /**
   * Обновляет память роя
   */
  updateSwarmMemory(query, result, context) {
    const memoryEntry = {
      timestamp: Date.now(),
      query,
      result,
      context,
      swarmState: this.captureSwarmState(),
      lessons: this.extractLessons(result)
    };
    
    this.swarmMemory.push(memoryEntry);
    
    // Ограничиваем размер памяти
    if (this.swarmMemory.length > 100) {
      this.swarmMemory = this.swarmMemory.slice(-100);
    }
    
    // Обновляем интеллект роя
    this.updateSwarmIntelligence(result);
  }

  /**
   * Генерирует личность роя
   */
  generateSwarmPersonality() {
    return {
      collectivism: 0.8, // Склонность к коллективным решениям
      adaptability: 0.7, // Способность адаптироваться
      curiosity: 0.9, // Коллективное любопытство
      persistence: 0.6, // Настойчивость в решении задач
      creativity: 0.8, // Коллективная креативность
      harmony: 0.7 // Стремление к гармонии
    };
  }

  // Вспомогательные методы
  areSpecializationsCompatible(spec1, spec2) {
    const compatibilityMatrix = {
      'intent_detection': ['emotion_analysis', 'context_understanding'],
      'emotion_analysis': ['intent_detection', 'cultural_context'],
      'context_understanding': ['intent_detection', 'temporal_analysis'],
      'semantic_relations': ['creative_interpretation', 'technical_analysis'],
      'creative_interpretation': ['semantic_relations', 'cultural_context'],
      'technical_analysis': ['semantic_relations', 'temporal_analysis'],
      'cultural_context': ['emotion_analysis', 'creative_interpretation'],
      'temporal_analysis': ['context_understanding', 'technical_analysis']
    };
    
    return compatibilityMatrix[spec1]?.includes(spec2) || false;
  }

  synthesizeCollaboration(analysis1, analysis2, sharing1to2, sharing2to1) {
    return {
      combinedConfidence: (analysis1.confidence + analysis2.confidence) / 2,
      synthesizedInsight: `Collaboration between ${analysis1.specialization} and ${analysis2.specialization}`,
      mutualEnhancement: sharing1to2.success && sharing2to1.success,
      novelCombinations: this.findNovelCombinations(analysis1.analysis, analysis2.analysis)
    };
  }

  calculateSynergy(analysis1, analysis2) {
    // Синергия = совместный результат больше суммы частей
    const individualSum = analysis1.confidence + analysis2.confidence;
    const collaborativeBonus = 0.2; // 20% бонус за коллаборацию
    
    return Math.min(1, individualSum * (1 + collaborativeBonus));
  }

  generateConsensusProposals(individualAnalyses, collaborativeInsights) {
    const proposals = [];
    
    // Предложение на основе большинства индивидуальных анализов
    proposals.push({
      id: 'majority_individual',
      type: 'individual_majority',
      description: 'Consensus based on individual analyses majority'
    });
    
    // Предложение на основе коллаборативных инсайтов
    proposals.push({
      id: 'collaborative_synthesis',
      type: 'collaborative',
      description: 'Consensus based on collaborative insights'
    });
    
    return proposals;
  }

  analyzeVotingResults(proposals, votes) {
    let totalAgreement = 0;
    let voteCount = 0;
    
    for (const [proposalId, proposalVotes] of votes) {
      const agreements = proposalVotes.filter(vote => vote.vote === 'agree').length;
      const total = proposalVotes.length;
      
      if (total > 0) {
        totalAgreement += agreements / total;
        voteCount++;
      }
    }
    
    const consensusStrength = voteCount > 0 ? totalAgreement / voteCount : 0;
    
    return {
      consensusStrength,
      majorityOpinion: consensusStrength > 0.5 ? 'agree' : 'disagree',
      dissenting: consensusStrength < 0.8
    };
  }

  getActiveAgentsCount() {
    return Array.from(this.agents.values()).filter(agent => agent.energy > 0.1).length;
  }

  captureSwarmState() {
    return {
      totalAgents: this.agents.size,
      activeAgents: this.getActiveAgentsCount(),
      averageEnergy: this.calculateAverageEnergy(),
      averageExperience: this.calculateAverageExperience(),
      swarmIntelligence: this.swarmIntelligence
    };
  }

  calculateAverageEnergy() {
    const energies = Array.from(this.agents.values()).map(agent => agent.energy);
    return energies.reduce((sum, energy) => sum + energy, 0) / energies.length;
  }

  calculateAverageExperience() {
    const experiences = Array.from(this.agents.values()).map(agent => agent.experience);
    return experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length;
  }

  updateSwarmIntelligence(result) {
    const qualityFactor = result.qualityScore || 0.5;
    const learningRate = 0.01;
    
    this.swarmIntelligence += (qualityFactor - this.swarmIntelligence) * learningRate;
    this.swarmIntelligence = Math.max(0, Math.min(1, this.swarmIntelligence));
  }

  // Заглушки для сложных методов
  detectAnalysisPatterns(analyses) { return []; }
  detectCollaborationPatterns(collaborations) { return []; }
  detectConsensusPatterns(consensus) { return []; }
  generateInsightFromPattern(pattern) { return null; }
  detectSynergies(analyses, collaborations) { return []; }
  calculateEmergentIntelligence(patterns, insights, synergies) { return 0.7; }
  assessNovelty(patterns, insights) { return 0.6; }
  calculateWeightedResults(analyses) { return { interpretation: 'weighted', confidence: 0.8 }; }
  applyCollaborativeEnhancements(results, collaborations) { return results; }
  applyConsensusAdjustments(results, consensus) { return results; }
  addEmergentElements(results, emergentInsights) { return results; }
  generateSwarmRecommendations(result, insights) { return []; }
  assessSwarmQuality(result, consensus, insights) { return 0.8; }
  extractLessons(result) { return []; }
  findNovelCombinations(analysis1, analysis2) { return []; }

  /**
   * Восстановление энергии роя
   */
  async restSwarm(duration = 5000) {
    SmartLogger.swarm(`🐝😴 Рой отдыхает и восстанавливается...`);
    
    const promises = Array.from(this.agents.values()).map(agent => {
      return new Promise(resolve => {
        setTimeout(() => {
          agent.rest(duration);
          resolve();
        }, Math.random() * 1000); // Случайная задержка
      });
    });
    
    await Promise.all(promises);
    
    SmartLogger.swarm(`🐝😌 Рой восстановился! Средняя энергия: ${this.calculateAverageEnergy().toFixed(3)}`);
  }

  /**
   * Получает статистику роя
   */
  getSwarmStatistics() {
    const agentStats = Array.from(this.agents.values()).map(agent => agent.exportState());
    
    return {
      swarmSize: this.agents.size,
      activeAgents: this.getActiveAgentsCount(),
      swarmIntelligence: this.swarmIntelligence,
      consensusThreshold: this.consensusThreshold,
      swarmPersonality: this.swarmPersonality,
      memoryEntries: this.swarmMemory.length,
      emergentPatterns: this.emergentPatterns.length,
      averageStats: {
        energy: this.calculateAverageEnergy(),
        experience: this.calculateAverageExperience(),
        reputation: agentStats.reduce((sum, agent) => sum + agent.reputation, 0) / agentStats.length
      },
      agentDetails: agentStats,
      lastActivity: Math.max(...agentStats.map(agent => agent.lastActivity))
    };
  }
}

module.exports = {
  SemanticSwarm,
  SemanticAgent
};
