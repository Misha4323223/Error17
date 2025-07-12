
/**
 * 🌐🧠 ИНТЕГРАТОР ВНЕШНИХ ЗНАНИЙ
 * Подключение к Wikipedia, научным базам и краудсорсинговым аннотациям
 * Реальновременное обновление семантических связей
 */

const axios = require('axios');

const SmartLogger = {
  knowledge: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🌐🧠 [${timestamp}] EXTERNAL-KNOWLEDGE: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * ВИКИПЕДИЯ ИНТЕГРАТОР
 * Извлекает знания из Wikipedia API
 */
class WikipediaIntegrator {
  constructor() {
    this.apiEndpoint = 'https://en.wikipedia.org/api/rest_v1';
    this.searchEndpoint = 'https://en.wikipedia.org/w/api.php';
    this.cache = new Map();
    this.rateLimitDelay = 100; // мс между запросами
    this.lastRequestTime = 0;
  }

  /**
   * Поиск статей по ключевым словам
   */
  async searchArticles(query, limit = 5) {
    await this.respectRateLimit();
    
    try {
      SmartLogger.knowledge(`🔍 Поиск статей по запросу: "${query}"`);
      
      const response = await axios.get(this.searchEndpoint, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          srlimit: limit,
          origin: '*'
        },
        timeout: 5000
      });

      const articles = response.data.query?.search || [];
      
      SmartLogger.knowledge(`📚 Найдено ${articles.length} статей`);
      
      return articles.map(article => ({
        title: article.title,
        snippet: article.snippet.replace(/<[^>]*>/g, ''), // Убираем HTML теги
        pageId: article.pageid,
        wordCount: article.wordcount,
        relevanceScore: this.calculateRelevance(query, article.title, article.snippet)
      }));

    } catch (error) {
      SmartLogger.knowledge(`❌ Ошибка поиска в Wikipedia: ${error.message}`);
      return [];
    }
  }

  /**
   * Получение полного содержимого статьи
   */
  async getArticleContent(title) {
    const cacheKey = `wikipedia_${title}`;
    if (this.cache.has(cacheKey)) {
      SmartLogger.knowledge(`📋 Содержимое статьи "${title}" найдено в кэше`);
      return this.cache.get(cacheKey);
    }

    await this.respectRateLimit();

    try {
      SmartLogger.knowledge(`📖 Загрузка содержимого статьи: "${title}"`);
      
      const response = await axios.get(`${this.apiEndpoint}/page/summary/${encodeURIComponent(title)}`, {
        timeout: 5000
      });

      const content = {
        title: response.data.title,
        description: response.data.description,
        extract: response.data.extract,
        pageId: response.data.pageid,
        lang: response.data.lang,
        timestamp: response.data.timestamp,
        coordinates: response.data.coordinates,
        categories: response.data.categories || [],
        semanticConcepts: this.extractSemanticConcepts(response.data.extract)
      };

      this.cache.set(cacheKey, content);
      SmartLogger.knowledge(`✅ Содержимое статьи "${title}" загружено и кэширован`);
      
      return content;

    } catch (error) {
      SmartLogger.knowledge(`❌ Ошибка загрузки статьи "${title}": ${error.message}`);
      return null;
    }
  }

  /**
   * Извлечение семантических концепций из текста
   */
  extractSemanticConcepts(text) {
    if (!text) return [];

    const concepts = [];
    
    // Извлекаем имена собственные (заглавные буквы)
    const properNouns = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    concepts.push(...properNouns.slice(0, 10).map(noun => ({
      type: 'proper_noun',
      value: noun,
      confidence: 0.8
    })));

    // Извлекаем числовые данные
    const numbers = text.match(/\b\d{4}\b|\b\d+(?:\.\d+)?\s*(?:million|billion|thousand|percent|%)\b/gi) || [];
    concepts.push(...numbers.slice(0, 5).map(number => ({
      type: 'numerical_fact',
      value: number,
      confidence: 0.9
    })));

    // Извлекаем ключевые термины (часто встречающиеся слова длиннее 4 символов)
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const keyTerms = Object.entries(wordFreq)
      .filter(([word, freq]) => freq > 1 && !this.isStopWord(word))
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    concepts.push(...keyTerms.map(([term, freq]) => ({
      type: 'key_term',
      value: term,
      frequency: freq,
      confidence: Math.min(0.9, freq * 0.2)
    })));

    return concepts;
  }

  /**
   * Проверка стоп-слов
   */
  isStopWord(word) {
    const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'also', 'into', 'over', 'think', 'only', 'come', 'work', 'life', 'year', 'years', 'first', 'after', 'back', 'than', 'well', 'were', 'where', 'when', 'them'];
    return stopWords.includes(word);
  }

  /**
   * Вычисление релевантности
   */
  calculateRelevance(query, title, snippet) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const titleWords = title.toLowerCase().split(/\s+/);
    const snippetWords = snippet.toLowerCase().split(/\s+/);

    let score = 0;
    
    // Совпадения в заголовке весят больше
    queryWords.forEach(word => {
      if (titleWords.some(tw => tw.includes(word))) score += 0.4;
      if (snippetWords.some(sw => sw.includes(word))) score += 0.1;
    });

    return Math.min(1, score);
  }

  /**
   * Контроль частоты запросов
   */
  async respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }
}

/**
 * НАУЧНЫЕ БАЗЫ ИНТЕГРАТОР
 * Подключение к arXiv, PubMed и другим научным ресурсам
 */
class ScientificDatabasesIntegrator {
  constructor() {
    this.arxivEndpoint = 'http://export.arxiv.org/api/query';
    this.cache = new Map();
    this.rateLimitDelay = 200; // Больше задержка для научных API
    this.lastRequestTime = 0;
  }

  /**
   * Поиск в arXiv
   */
  async searchArxiv(query, maxResults = 5) {
    await this.respectRateLimit();

    try {
      SmartLogger.knowledge(`🔬 Поиск в arXiv: "${query}"`);
      
      const searchQuery = `search_query=all:${encodeURIComponent(query)}`;
      const params = `${searchQuery}&start=0&max_results=${maxResults}`;
      
      const response = await axios.get(`${this.arxivEndpoint}?${params}`, {
        timeout: 10000
      });

      const papers = this.parseArxivXML(response.data);
      
      SmartLogger.knowledge(`📄 Найдено ${papers.length} научных статей в arXiv`);
      
      return papers;

    } catch (error) {
      SmartLogger.knowledge(`❌ Ошибка поиска в arXiv: ${error.message}`);
      return [];
    }
  }

  /**
   * Парсинг XML ответа от arXiv
   */
  parseArxivXML(xmlData) {
    const papers = [];
    
    try {
      // Простой парсинг XML для извлечения основной информации
      const entryMatches = xmlData.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      
      entryMatches.slice(0, 5).forEach(entry => {
        const title = this.extractXMLTag(entry, 'title');
        const summary = this.extractXMLTag(entry, 'summary');
        const published = this.extractXMLTag(entry, 'published');
        const authors = this.extractAuthors(entry);
        const categories = this.extractCategories(entry);
        
        if (title && summary) {
          papers.push({
            title: title.replace(/\s+/g, ' ').trim(),
            summary: summary.replace(/\s+/g, ' ').trim().substring(0, 500),
            published: published,
            authors: authors,
            categories: categories,
            source: 'arXiv',
            scientificConcepts: this.extractScientificConcepts(title, summary)
          });
        }
      });

    } catch (error) {
      SmartLogger.knowledge(`❌ Ошибка парсинга arXiv XML: ${error.message}`);
    }

    return papers;
  }

  /**
   * Извлечение тега из XML
   */
  extractXMLTag(xml, tagName) {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Извлечение авторов
   */
  extractAuthors(entry) {
    const authorMatches = entry.match(/<author>[\s\S]*?<\/author>/g) || [];
    return authorMatches.map(author => {
      const name = this.extractXMLTag(author, 'name');
      return name;
    }).filter(name => name).slice(0, 3);
  }

  /**
   * Извлечение категорий
   */
  extractCategories(entry) {
    const categoryMatches = entry.match(/term="([^"]+)"/g) || [];
    return categoryMatches.map(match => {
      const categoryMatch = match.match(/term="([^"]+)"/);
      return categoryMatch ? categoryMatch[1] : '';
    }).filter(cat => cat).slice(0, 3);
  }

  /**
   * Извлечение научных концепций
   */
  extractScientificConcepts(title, summary) {
    const text = `${title} ${summary}`.toLowerCase();
    const concepts = [];

    // Научные термины
    const scientificTerms = [
      'algorithm', 'neural network', 'machine learning', 'deep learning',
      'quantum', 'artificial intelligence', 'optimization', 'simulation',
      'analysis', 'model', 'framework', 'method', 'approach', 'system'
    ];

    scientificTerms.forEach(term => {
      if (text.includes(term)) {
        concepts.push({
          type: 'scientific_term',
          value: term,
          confidence: 0.9
        });
      }
    });

    // Математические концепции
    const mathMatches = text.match(/\b(?:equation|formula|theorem|proof|matrix|vector|function|derivative|integral)\b/g) || [];
    concepts.push(...mathMatches.slice(0, 5).map(match => ({
      type: 'mathematical_concept',
      value: match,
      confidence: 0.85
    })));

    return concepts;
  }

  /**
   * Контроль частоты запросов
   */
  async respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }
}

/**
 * КРАУДСОРСИНГ СЕМАНТИЧЕСКИХ АННОТАЦИЙ
 * Система для сбора и валидации семантических аннотаций от пользователей
 */
class CrowdsourcingAnnotator {
  constructor() {
    this.annotations = new Map();
    this.validationThreshold = 3; // Минимум 3 подтверждения
    this.userContributions = new Map();
    this.qualityScores = new Map();
  }

  /**
   * Добавление аннотации от пользователя
   */
  addAnnotation(userId, concept, annotation, context = {}) {
    const annotationId = `${concept}_${Date.now()}`;
    
    const annotationData = {
      id: annotationId,
      userId,
      concept,
      annotation,
      context,
      timestamp: Date.now(),
      validations: 0,
      rejections: 0,
      status: 'pending'
    };

    this.annotations.set(annotationId, annotationData);
    
    // Обновляем вклад пользователя
    if (!this.userContributions.has(userId)) {
      this.userContributions.set(userId, {
        totalAnnotations: 0,
        acceptedAnnotations: 0,
        userQuality: 0.5
      });
    }
    
    const userStats = this.userContributions.get(userId);
    userStats.totalAnnotations++;
    this.userContributions.set(userId, userStats);

    SmartLogger.knowledge(`📝 Добавлена аннотация от пользователя ${userId} для концепции "${concept}"`);
    
    return annotationId;
  }

  /**
   * Валидация аннотации другими пользователями
   */
  validateAnnotation(annotationId, validatorUserId, isValid) {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) return false;

    if (annotation.userId === validatorUserId) {
      SmartLogger.knowledge(`⚠️ Пользователь не может валидировать свою аннотацию`);
      return false;
    }

    if (isValid) {
      annotation.validations++;
    } else {
      annotation.rejections++;
    }

    // Проверяем достижение порога валидации
    if (annotation.validations >= this.validationThreshold) {
      annotation.status = 'accepted';
      this.updateUserQuality(annotation.userId, true);
      SmartLogger.knowledge(`✅ Аннотация ${annotationId} принята сообществом`);
    } else if (annotation.rejections >= this.validationThreshold) {
      annotation.status = 'rejected';
      this.updateUserQuality(annotation.userId, false);
      SmartLogger.knowledge(`❌ Аннотация ${annotationId} отклонена сообществом`);
    }

    this.annotations.set(annotationId, annotation);
    return true;
  }

  /**
   * Обновление качества пользователя
   */
  updateUserQuality(userId, wasAccepted) {
    const userStats = this.userContributions.get(userId);
    if (!userStats) return;

    if (wasAccepted) {
      userStats.acceptedAnnotations++;
    }

    userStats.userQuality = userStats.acceptedAnnotations / userStats.totalAnnotations;
    this.userContributions.set(userId, userStats);
  }

  /**
   * Получение принятых аннотаций для концепции
   */
  getAcceptedAnnotations(concept) {
    const conceptAnnotations = [];
    
    for (const annotation of this.annotations.values()) {
      if (annotation.concept === concept && annotation.status === 'accepted') {
        conceptAnnotations.push(annotation);
      }
    }

    return conceptAnnotations.sort((a, b) => b.validations - a.validations);
  }

  /**
   * Получение статистики краудсорсинга
   */
  getCrowdsourcingStats() {
    const stats = {
      totalAnnotations: this.annotations.size,
      pendingAnnotations: 0,
      acceptedAnnotations: 0,
      rejectedAnnotations: 0,
      activeUsers: this.userContributions.size,
      averageUserQuality: 0
    };

    for (const annotation of this.annotations.values()) {
      switch (annotation.status) {
        case 'pending': stats.pendingAnnotations++; break;
        case 'accepted': stats.acceptedAnnotations++; break;
        case 'rejected': stats.rejectedAnnotations++; break;
      }
    }

    if (this.userContributions.size > 0) {
      const totalQuality = Array.from(this.userContributions.values())
        .reduce((sum, user) => sum + user.userQuality, 0);
      stats.averageUserQuality = totalQuality / this.userContributions.size;
    }

    return stats;
  }
}

/**
 * РЕАЛЬНОВРЕМЕННЫЙ ОБНОВЛЯТЕЛЬ СЕМАНТИЧЕСКИХ СВЯЗЕЙ
 */
class RealTimeSemanticUpdater {
  constructor() {
    this.updateQueue = [];
    this.isProcessing = false;
    this.batchSize = 10;
    this.updateInterval = 30000; // 30 секунд
    this.semanticGraph = new Map();
    
    this.startUpdateCycle();
  }

  /**
   * Добавление обновления в очередь
   */
  queueUpdate(updateType, data) {
    const update = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: updateType,
      data,
      timestamp: Date.now(),
      priority: this.calculatePriority(updateType, data)
    };

    this.updateQueue.push(update);
    this.updateQueue.sort((a, b) => b.priority - a.priority);

    SmartLogger.knowledge(`🔄 Добавлено обновление в очередь: ${updateType} (приоритет: ${update.priority})`);
  }

  /**
   * Вычисление приоритета обновления
   */
  calculatePriority(updateType, data) {
    const priorities = {
      'wikipedia_integration': 0.8,
      'scientific_paper': 0.9,
      'crowdsourced_annotation': 0.7,
      'user_feedback': 0.6,
      'external_api': 0.5
    };

    let basePriority = priorities[updateType] || 0.5;
    
    // Увеличиваем приоритет для новых концепций
    if (data.isNewConcept) basePriority += 0.2;
    
    // Увеличиваем приоритет для высококачественных источников
    if (data.sourceQuality && data.sourceQuality > 0.8) basePriority += 0.1;

    return Math.min(1, basePriority);
  }

  /**
   * Запуск цикла обновлений
   */
  startUpdateCycle() {
    setInterval(() => {
      if (!this.isProcessing && this.updateQueue.length > 0) {
        this.processUpdateBatch();
      }
    }, this.updateInterval);

    SmartLogger.knowledge(`🔄 Запущен цикл реальновременных обновлений (интервал: ${this.updateInterval}мс)`);
  }

  /**
   * Обработка пакета обновлений
   */
  async processUpdateBatch() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const batch = this.updateQueue.splice(0, this.batchSize);
    
    SmartLogger.knowledge(`🔄 Обработка пакета из ${batch.length} обновлений`);

    for (const update of batch) {
      try {
        await this.processUpdate(update);
      } catch (error) {
        SmartLogger.knowledge(`❌ Ошибка обработки обновления ${update.id}: ${error.message}`);
      }
    }

    this.isProcessing = false;
    SmartLogger.knowledge(`✅ Пакет обновлений обработан`);
  }

  /**
   * Обработка отдельного обновления
   */
  async processUpdate(update) {
    switch (update.type) {
      case 'wikipedia_integration':
        await this.integrateWikipediaData(update.data);
        break;
      
      case 'scientific_paper':
        await this.integrateScientificData(update.data);
        break;
      
      case 'crowdsourced_annotation':
        await this.integrateCrowdsourcedData(update.data);
        break;
      
      default:
        SmartLogger.knowledge(`⚠️ Неизвестный тип обновления: ${update.type}`);
    }
  }

  /**
   * Интеграция данных Wikipedia
   */
  async integrateWikipediaData(data) {
    const conceptKey = data.title.toLowerCase().replace(/\s+/g, '_');
    
    if (!this.semanticGraph.has(conceptKey)) {
      this.semanticGraph.set(conceptKey, {
        type: 'wikipedia_concept',
        title: data.title,
        description: data.description,
        extract: data.extract,
        concepts: data.semanticConcepts,
        lastUpdated: Date.now(),
        sources: ['wikipedia']
      });
    } else {
      const existing = this.semanticGraph.get(conceptKey);
      existing.extract = data.extract;
      existing.concepts = [...existing.concepts, ...data.semanticConcepts];
      existing.lastUpdated = Date.now();
      if (!existing.sources.includes('wikipedia')) {
        existing.sources.push('wikipedia');
      }
    }

    SmartLogger.knowledge(`📚 Интегрированы данные Wikipedia для концепции "${data.title}"`);
  }

  /**
   * Интеграция научных данных
   */
  async integrateScientificData(data) {
    const conceptKey = data.title.toLowerCase().replace(/\s+/g, '_');
    
    if (!this.semanticGraph.has(conceptKey)) {
      this.semanticGraph.set(conceptKey, {
        type: 'scientific_concept',
        title: data.title,
        summary: data.summary,
        authors: data.authors,
        categories: data.categories,
        concepts: data.scientificConcepts,
        lastUpdated: Date.now(),
        sources: ['arxiv']
      });
    } else {
      const existing = this.semanticGraph.get(conceptKey);
      existing.summary = data.summary;
      existing.concepts = [...existing.concepts, ...data.scientificConcepts];
      existing.lastUpdated = Date.now();
      if (!existing.sources.includes('arxiv')) {
        existing.sources.push('arxiv');
      }
    }

    SmartLogger.knowledge(`🔬 Интегрированы научные данные для концепции "${data.title}"`);
  }

  /**
   * Интеграция краудсорсинговых данных
   */
  async integrateCrowdsourcedData(data) {
    const conceptKey = data.concept.toLowerCase().replace(/\s+/g, '_');
    
    if (!this.semanticGraph.has(conceptKey)) {
      this.semanticGraph.set(conceptKey, {
        type: 'crowdsourced_concept',
        concept: data.concept,
        annotations: [data.annotation],
        userValidations: data.validations,
        lastUpdated: Date.now(),
        sources: ['crowdsourcing']
      });
    } else {
      const existing = this.semanticGraph.get(conceptKey);
      if (!existing.annotations) existing.annotations = [];
      existing.annotations.push(data.annotation);
      existing.userValidations = (existing.userValidations || 0) + data.validations;
      existing.lastUpdated = Date.now();
      if (!existing.sources.includes('crowdsourcing')) {
        existing.sources.push('crowdsourcing');
      }
    }

    SmartLogger.knowledge(`👥 Интегрированы краудсорсинговые данные для концепции "${data.concept}"`);
  }

  /**
   * Получение семантического графа
   */
  getSemanticGraph() {
    return this.semanticGraph;
  }

  /**
   * Поиск связанных концепций
   */
  findRelatedConcepts(query, limit = 10) {
    const queryLower = query.toLowerCase();
    const related = [];

    for (const [key, concept] of this.semanticGraph) {
      let relevanceScore = 0;

      // Проверяем совпадение в названии
      if (key.includes(queryLower) || concept.title?.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.8;
      }

      // Проверяем совпадение в описании/резюме
      const text = (concept.description || concept.summary || '').toLowerCase();
      if (text.includes(queryLower)) {
        relevanceScore += 0.4;
      }

      // Проверяем концепции
      if (concept.concepts) {
        const conceptMatches = concept.concepts.filter(c => 
          c.value.toLowerCase().includes(queryLower)
        ).length;
        relevanceScore += conceptMatches * 0.2;
      }

      if (relevanceScore > 0) {
        related.push({
          ...concept,
          key,
          relevanceScore
        });
      }
    }

    return related
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }
}

/**
 * ГЛАВНЫЙ ИНТЕГРАТОР ВНЕШНИХ ЗНАНИЙ
 * Координирует все источники внешних знаний
 */
class ExternalKnowledgeIntegrator {
  constructor() {
    this.wikipediaIntegrator = new WikipediaIntegrator();
    this.scientificIntegrator = new ScientificDatabasesIntegrator();
    this.crowdsourcingAnnotator = new CrowdsourcingAnnotator();
    this.realtimeUpdater = new RealTimeSemanticUpdater();
    
    this.initialized = false;
    this.statistics = {
      wikipediaQueries: 0,
      scientificQueries: 0,
      annotationsReceived: 0,
      conceptsIntegrated: 0,
      lastUpdateTime: 0
    };
  }

  /**
   * Инициализация интегратора
   */
  initialize() {
    if (this.initialized) return;
    
    SmartLogger.knowledge('🌐 Инициализация интегратора внешних знаний');
    this.initialized = true;
    SmartLogger.knowledge('✅ Интегратор внешних знаний готов к работе');
  }

  /**
   * ГЛАВНЫЙ МЕТОД: Обогащение запроса внешними знаниями
   */
  async enrichWithExternalKnowledge(query, context = {}) {
    this.initialize();
    
    SmartLogger.knowledge(`🌐🧠 ОБОГАЩЕНИЕ ВНЕШНИМИ ЗНАНИЯМИ: "${query.substring(0, 50)}..."`);
    
    const startTime = Date.now();
    
    try {
      // 1. Расширенный поиск (приоритетный источник)
      let advancedSearchResults = null;
      if (context.includeAdvancedSearch) {
        SmartLogger.knowledge(`🔍 Расширенный поиск...`);
        try {
          const { performAdvancedSearch } = require('../advanced-search-provider');
          advancedSearchResults = await performAdvancedSearch(query, {
            searchType: 'comprehensive',
            language: 'ru',
            maxResults: 8,
            includeAnalysis: true
          });
          SmartLogger.knowledge(`✅ Расширенный поиск: ${advancedSearchResults.totalResults} результатов`);
        } catch (error) {
          SmartLogger.knowledge(`❌ Ошибка расширенного поиска: ${error.message}`);
        }
      }

      // 2. Поиск в Wikipedia
      SmartLogger.knowledge(`📚 Поиск в Wikipedia...`);
      const wikipediaResults = await this.wikipediaIntegrator.searchArticles(query, 3);
      this.statistics.wikipediaQueries++;

      // 3. Поиск в научных базах
      SmartLogger.knowledge(`🔬 Поиск в научных базах...`);
      const scientificResults = await this.scientificIntegrator.searchArxiv(query, 3);
      this.statistics.scientificQueries++;

      // 4. Поиск в краудсорсинговых аннотациях
      SmartLogger.knowledge(`👥 Поиск в краудсорсинговых аннотациях...`);
      const crowdsourcedResults = this.crowdsourcingAnnotator.getAcceptedAnnotations(query);

      // 5. Поиск связанных концепций в реальновременном графе
      SmartLogger.knowledge(`🔄 Поиск в реальновременном семантическом графе...`);
      const relatedConcepts = this.realtimeUpdater.findRelatedConcepts(query, 5);

      // 5. Загрузка детального содержимого для топ результатов
      const detailedWikipedia = [];
      for (const result of wikipediaResults.slice(0, 2)) {
        const content = await this.wikipediaIntegrator.getArticleContent(result.title);
        if (content) {
          detailedWikipedia.push(content);
          
          // Добавляем в очередь реальновременных обновлений
          this.realtimeUpdater.queueUpdate('wikipedia_integration', {
            ...content,
            isNewConcept: true,
            sourceQuality: 0.9
          });
        }
      }

      // 6. Обновляем статистику
      this.statistics.conceptsIntegrated += 
        wikipediaResults.length + scientificResults.length + relatedConcepts.length;
      this.statistics.lastUpdateTime = Date.now();

      const processingTime = Date.now() - startTime;

      const result = {
        query,
        timestamp: Date.now(),
        processingTime,
        
        // Результаты расширенного поиска (приоритет)
        analysis: advancedSearchResults?.analysis || null,
        searchResults: advancedSearchResults?.results || [],
        
        // Результаты поиска
        wikipediaResults: {
          count: wikipediaResults.length,
          articles: wikipediaResults,
          detailedContent: detailedWikipedia
        },
        
        scientificResults: {
          count: scientificResults.length,
          papers: scientificResults
        },
        
        crowdsourcedResults: {
          count: crowdsourcedResults.length,
          annotations: crowdsourcedResults
        },
        
        relatedConcepts: {
          count: relatedConcepts.length,
          concepts: relatedConcepts
        },
        
        // Семантическое обогащение
        enrichedContext: this.createEnrichedContext(
          wikipediaResults, scientificResults, crowdsourcedResults, relatedConcepts, advancedSearchResults
        ),
        
        // Рекомендации
        knowledgeRecommendations: this.generateKnowledgeRecommendations(
          wikipediaResults, scientificResults, relatedConcepts
        ),
        
        // Метрики
        enrichmentMetrics: {
          totalSources: wikipediaResults.length + scientificResults.length + crowdsourcedResults.length + (advancedSearchResults?.totalResults || 0),
          diversityScore: this.calculateDiversityScore(wikipediaResults, scientificResults),
          authorityScore: this.calculateAuthorityScore(wikipediaResults, scientificResults),
          noveltyScore: this.calculateNoveltyScore(relatedConcepts),
          integrationQuality: this.calculateIntegrationQuality(detailedWikipedia, scientificResults),
          searchQuality: advancedSearchResults?.analysis?.confidence || 0
        }
      };

      SmartLogger.knowledge(`✨ Обогащение завершено за ${processingTime}мс`);
      SmartLogger.knowledge(`📊 Найдено источников: Wikipedia ${wikipediaResults.length}, Научные ${scientificResults.length}, Краудсорсинг ${crowdsourcedResults.length}`);
      
      return result;
      
    } catch (error) {
      SmartLogger.knowledge(`❌ Ошибка обогащения внешними знаниями: ${error.message}`);
      
      return {
        error: error.message,
        timestamp: Date.now(),
        processingTime: Date.now() - startTime,
        fallbackRecommendations: this.generateFallbackRecommendations(query)
      };
    }
  }

  /**
   * Создание обогащенного контекста
   */
  createEnrichedContext(wikipediaResults, scientificResults, crowdsourcedResults, relatedConcepts) {
    const context = {
      knowledgeDomains: [],
      keyFacts: [],
      expertiseLevel: 'general',
      informationDensity: 0,
      crossReferences: [],
      conceptualDepth: 0
    };

    // Определяем домены знаний
    const domains = new Set();
    
    wikipediaResults.forEach(result => {
      if (result.snippet.includes('science') || result.snippet.includes('technology')) {
        domains.add('science_technology');
      }
      if (result.snippet.includes('history') || result.snippet.includes('historical')) {
        domains.add('history');
      }
      if (result.snippet.includes('art') || result.snippet.includes('culture')) {
        domains.add('arts_culture');
      }
    });

    scientificResults.forEach(result => {
      domains.add('academic_research');
      result.categories.forEach(category => {
        if (category.includes('cs.')) domains.add('computer_science');
        if (category.includes('physics')) domains.add('physics');
        if (category.includes('math')) domains.add('mathematics');
      });
    });

    context.knowledgeDomains = Array.from(domains);

    // Извлекаем ключевые факты
    wikipediaResults.forEach(result => {
      if (result.snippet.length > 50) {
        context.keyFacts.push({
          source: 'wikipedia',
          fact: result.snippet.substring(0, 150) + '...',
          reliability: 0.8
        });
      }
    });

    scientificResults.forEach(result => {
      context.keyFacts.push({
        source: 'scientific',
        fact: result.summary.substring(0, 150) + '...',
        reliability: 0.9
      });
    });

    // Определяем уровень экспертизы
    if (scientificResults.length > wikipediaResults.length) {
      context.expertiseLevel = 'expert';
    } else if (scientificResults.length > 0) {
      context.expertiseLevel = 'intermediate';
    }

    // Вычисляем плотность информации
    const totalWords = [
      ...wikipediaResults.map(r => r.snippet),
      ...scientificResults.map(r => r.summary)
    ].join(' ').split(/\s+/).length;

    context.informationDensity = Math.min(1, totalWords / 1000);

    // Концептуальная глубина
    context.conceptualDepth = Math.min(1, 
      (relatedConcepts.length * 0.2) + 
      (scientificResults.length * 0.3) + 
      (wikipediaResults.length * 0.1)
    );

    return context;
  }

  /**
   * Генерация рекомендаций на основе знаний
   */
  generateKnowledgeRecommendations(wikipediaResults, scientificResults, relatedConcepts) {
    const recommendations = [];

    // Рекомендации на основе Wikipedia
    if (wikipediaResults.length > 0) {
      const topResult = wikipediaResults[0];
      recommendations.push({
        type: 'explore_topic',
        source: 'wikipedia',
        message: `Изучите подробнее: ${topResult.title}`,
        relevance: topResult.relevanceScore,
        action: `Узнать больше о ${topResult.title} в Wikipedia`
      });
    }

    // Рекомендации на основе научных статей
    if (scientificResults.length > 0) {
      const recentPaper = scientificResults[0];
      recommendations.push({
        type: 'academic_insight',
        source: 'scientific',
        message: `Последние исследования: ${recentPaper.title}`,
        relevance: 0.9,
        action: `Ознакомиться с научной статьей: ${recentPaper.title}`
      });
    }

    // Рекомендации на основе связанных концепций
    if (relatedConcepts.length > 2) {
      recommendations.push({
        type: 'expand_knowledge',
        source: 'semantic_graph',
        message: `Связанные концепции могут расширить понимание темы`,
        relevance: 0.7,
        action: `Исследовать ${relatedConcepts.length} связанных концепций`
      });
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Вычисление оценок качества
   */
  calculateDiversityScore(wikipediaResults, scientificResults) {
    const sources = new Set(['wikipedia', 'scientific']);
    return sources.size / 3; // Из 3 возможных типов источников
  }

  calculateAuthorityScore(wikipediaResults, scientificResults) {
    let score = 0;
    score += wikipediaResults.length * 0.3; // Wikipedia средний авторитет
    score += scientificResults.length * 0.5; // Научные статьи высокий авторитет
    return Math.min(1, score);
  }

  calculateNoveltyScore(relatedConcepts) {
    if (relatedConcepts.length === 0) return 0;
    
    const recentConcepts = relatedConcepts.filter(concept => 
      Date.now() - concept.lastUpdated < 24 * 60 * 60 * 1000 // Последние 24 часа
    ).length;
    
    return recentConcepts / relatedConcepts.length;
  }

  calculateIntegrationQuality(detailedWikipedia, scientificResults) {
    let quality = 0.5; // Базовое качество

    if (detailedWikipedia.length > 0) quality += 0.2;
    if (scientificResults.length > 0) quality += 0.2;
    if (detailedWikipedia.length > 0 && scientificResults.length > 0) quality += 0.1; // Синергия

    return Math.min(1, quality);
  }

  /**
   * Генерация резервных рекомендаций
   */
  generateFallbackRecommendations(query) {
    return [
      {
        type: 'general_search',
        message: 'Попробуйте более конкретный запрос для лучших результатов',
        action: 'Уточнить поисковый запрос'
      },
      {
        type: 'knowledge_expansion',
        message: 'Рассмотрите связанные темы для расширения контекста',
        action: 'Исследовать смежные области'
      }
    ];
  }

  /**
   * Метод для добавления пользовательской аннотации
   */
  addUserAnnotation(userId, concept, annotation, context = {}) {
    const annotationId = this.crowdsourcingAnnotator.addAnnotation(userId, concept, annotation, context);
    this.statistics.annotationsReceived++;
    
    // Добавляем в очередь реальновременных обновлений
    this.realtimeUpdater.queueUpdate('crowdsourced_annotation', {
      concept,
      annotation,
      validations: 1,
      isNewConcept: !this.realtimeUpdater.getSemanticGraph().has(concept.toLowerCase().replace(/\s+/g, '_')),
      sourceQuality: 0.6
    });

    return annotationId;
  }

  /**
   * Метод для валидации аннотации
   */
  validateAnnotation(annotationId, validatorUserId, isValid) {
    return this.crowdsourcingAnnotator.validateAnnotation(annotationId, validatorUserId, isValid);
  }

  /**
   * Получение статистики системы
   */
  getSystemStatistics() {
    return {
      ...this.statistics,
      initialized: this.initialized,
      crowdsourcingStats: this.crowdsourcingAnnotator.getCrowdsourcingStats(),
      semanticGraphSize: this.realtimeUpdater.getSemanticGraph().size,
      updateQueueSize: this.realtimeUpdater.updateQueue.length
    };
  }
}

// Создаем глобальный экземпляр интегратора
const externalKnowledgeIntegrator = new ExternalKnowledgeIntegrator();

module.exports = {
  // Основной метод
  enrichWithExternalKnowledge: externalKnowledgeIntegrator.enrichWithExternalKnowledge.bind(externalKnowledgeIntegrator),
  
  // Методы для краудсорсинга
  addUserAnnotation: externalKnowledgeIntegrator.addUserAnnotation.bind(externalKnowledgeIntegrator),
  validateAnnotation: externalKnowledgeIntegrator.validateAnnotation.bind(externalKnowledgeIntegrator),
  
  // Статистика
  getSystemStatistics: externalKnowledgeIntegrator.getSystemStatistics.bind(externalKnowledgeIntegrator),
  
  // Доступ к компонентам
  components: {
    wikipediaIntegrator: externalKnowledgeIntegrator.wikipediaIntegrator,
    scientificIntegrator: externalKnowledgeIntegrator.scientificIntegrator,
    crowdsourcingAnnotator: externalKnowledgeIntegrator.crowdsourcingAnnotator,
    realtimeUpdater: externalKnowledgeIntegrator.realtimeUpdater
  },
  
  // Классы для расширения
  ExternalKnowledgeIntegrator,
  WikipediaIntegrator,
  ScientificDatabasesIntegrator,
  CrowdsourcingAnnotator,
  RealTimeSemanticUpdater
};
