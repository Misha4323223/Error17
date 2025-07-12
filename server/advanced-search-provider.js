/**
 * Расширенный поисковый провайдер с множественными источниками
 * Поддерживает поиск в реальном времени, анализ веб-страниц и базы знаний
 */

const webSearchProvider = require('./web-search-provider');

/**
 * Основная функция расширенного поиска
 * @param {string} query - Поисковый запрос
 * @param {Object} options - Параметры поиска
 * @returns {Promise<Object>} Результаты поиска
 */
async function performAdvancedSearch(query, options = {}) {
  const {
    searchType = 'comprehensive', // comprehensive, web, academic, news, images
    language = 'ru',
    maxResults = 10,
    includeAnalysis = true
  } = options;

  console.log(`🔍 Выполняем расширенный поиск: "${query}" (тип: ${searchType})`);

  try {
    let searchResults = [];
    
    // Определяем тип поиска и источники
    switch (searchType) {
      case 'comprehensive':
        searchResults = await performComprehensiveSearch(query, language, maxResults);
        break;
      case 'web':
        const webResult = await webSearchProvider.performWebSearch(query);
        searchResults = webResult.success ? webResult.results : [];
        break;
      case 'academic':
        searchResults = await performAcademicSearch(query, language, maxResults);
        break;
      case 'news':
        searchResults = await performNewsSearch(query, language, maxResults);
        break;
      case 'images':
        searchResults = await performImageSearch(query, language, maxResults);
        break;
      default:
        const defaultWebResult = await webSearchProvider.performWebSearch(query);
        searchResults = defaultWebResult.success ? defaultWebResult.results : [];
    }

    // Анализируем результаты если требуется
    let analysis = null;
    if (includeAnalysis && searchResults.length > 0) {
      analysis = await analyzeSearchResults(searchResults, query);
    }

    return {
      success: true,
      query,
      searchType,
      results: searchResults,
      analysis,
      totalResults: searchResults.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Ошибка расширенного поиска:', error);
    return {
      success: false,
      error: error.message,
      query,
      searchType
    };
  }
}

/**
 * Комплексный поиск по всем источникам
 */
async function performComprehensiveSearch(query, language, maxResults) {
  const results = [];
  
  try {
    // Основной веб-поиск
    const webSearchResult = await webSearchProvider.performWebSearch(query);
    if (webSearchResult.success) {
      results.push(...webSearchResult.results.slice(0, Math.ceil(maxResults * 0.6)));
    }

    // Поиск новостей
    const newsResults = await performNewsSearch(query, language, Math.ceil(maxResults * 0.2));
    results.push(...newsResults);

    // Академический поиск
    const academicResults = await performAcademicSearch(query, language, Math.ceil(maxResults * 0.2));
    results.push(...academicResults);

    // Удаляем дубликаты и сортируем по релевантности
    return removeDuplicates(results).slice(0, maxResults);
    
  } catch (error) {
    console.error('❌ Ошибка комплексного поиска:', error);
    return [];
  }
}

/**
 * Веб-поиск через DuckDuckGo
 */
async function performLocalWebSearch(query, language, maxResults) {
  try {
    const webSearchResult = await webSearchProvider.performWebSearch(query);
    
    if (webSearchResult.success && webSearchResult.results) {
      return webSearchResult.results.map(result => ({
        ...result,
        source: 'web',
        relevanceScore: calculateRelevanceScore(result, query)
      })).slice(0, maxResults);
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ Ошибка веб-поиска:', error);
    return [];
  }
}

/**
 * Поиск новостей
 */
async function performNewsSearch(query, language, maxResults) {
  try {
    // Используем специальные операторы для поиска новостей
    const newsQuery = `${query} site:news.google.com OR site:yandex.ru/news OR site:lenta.ru OR site:rbc.ru`;
    const newsResult = await webSearchProvider.performWebSearch(newsQuery);
    
    if (newsResult.success && newsResult.results) {
      return newsResult.results.map(result => ({
        ...result,
        source: 'news',
        relevanceScore: calculateRelevanceScore(result, query),
        category: 'Новости'
      })).slice(0, maxResults);
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ Ошибка поиска новостей:', error);
    return [];
  }
}

/**
 * Академический поиск
 */
async function performAcademicSearch(query, language, maxResults) {
  try {
    // Поиск в академических источниках
    const academicQuery = `${query} site:scholar.google.com OR site:elibrary.ru OR site:cyberleninka.ru OR filetype:pdf`;
    const academicResult = await webSearchProvider.performWebSearch(academicQuery);
    
    if (academicResult.success && academicResult.results) {
      return academicResult.results.map(result => ({
        ...result,
        source: 'academic',
        relevanceScore: calculateRelevanceScore(result, query),
        category: 'Научные статьи'
      })).slice(0, maxResults);
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ Ошибка академического поиска:', error);
    return [];
  }
}

/**
 * Поиск изображений
 */
async function performImageSearch(query, language, maxResults) {
  try {
    // Поиск изображений через специальные операторы
    const imageQuery = `${query} filetype:jpg OR filetype:png OR filetype:webp`;
    const imageResults = await searchWeb(imageQuery, maxResults);
    
    return imageResults.map(result => ({
      ...result,
      source: 'images',
      relevanceScore: calculateRelevanceScore(result, query),
      category: 'Изображения'
    }));
    
  } catch (error) {
    console.error('❌ Ошибка поиска изображений:', error);
    return [];
  }
}

/**
 * Анализ результатов поиска с помощью AI
 */
async function analyzeSearchResults(results, originalQuery) {
  try {
    // Извлекаем ключевые факты из результатов
    const keyFacts = extractKeyFacts(results);
    const sources = results.map(r => r.source).filter((v, i, a) => a.indexOf(v) === i);
    const topResults = results.slice(0, 5);
    
    // Генерируем AI-обработанный ответ
    const aiProcessedAnswer = await generateAIProcessedAnswer(results, originalQuery);
    
    return {
      summary: generateSummary(results, originalQuery),
      aiAnswer: aiProcessedAnswer, // Новое поле с AI-обработанным ответом
      keyFacts,
      sources,
      topResults: topResults.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.snippet,
        relevanceScore: r.relevanceScore
      })),
      searchDepth: results.length,
      confidence: calculateConfidenceScore(results)
    };
    
  } catch (error) {
    console.error('❌ Ошибка анализа результатов:', error);
    return null;
  }
}

/**
 * Генерирует структурированный ответ на основе результатов поиска (без AI)
 */
async function generateAIProcessedAnswer(results, originalQuery) {
  try {
    console.log('🔄 Генерируем структурированный ответ без AI обработки');
    
    // Сразу используем локальную обработку без попыток AI
    return generateLocalProcessedAnswer(results, originalQuery);
    
  } catch (error) {
    console.error('❌ Ошибка генерации ответа:', error);
    return generateLocalProcessedAnswer(results, originalQuery);
  }
}

/**
 * Улучшенная локальная обработка результатов поиска
 */
function generateLocalProcessedAnswer(results, originalQuery) {
  if (results.length === 0) {
    return `По запросу "${originalQuery}" актуальная информация не найдена. 🔍\n\nПопробуйте уточнить запрос или использовать другие ключевые слова.`;
  }

  console.log('🧠 Обрабатываем результаты локально:', results.length);

  // Анализируем тип запроса для лучшего форматирования
  const queryType = detectQueryType(originalQuery);
  
  // Берем лучшие результаты
  const topResults = results.slice(0, 3);
  const allContent = topResults.map(r => r.snippet || r.content || '').join(' ');
  
  // Извлекаем структурированные данные
  const keyData = extractStructuredData(allContent);
  
  // Формируем ответ в зависимости от типа запроса
  let answer = formatAnswerByType(queryType, originalQuery, topResults, keyData);
  
  // Добавляем источники
  const sources = topResults.map(r => r.source).filter((v, i, a) => a.indexOf(v) === i);
  if (sources.length > 0) {
    answer += `\n\n📚 **Источники:** ${sources.join(', ')}`;
  }
  
  return answer;
}

/**
 * Определяет тип запроса для лучшего форматирования
 */
function detectQueryType(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('планет') || lowerQuery.includes('космос') || lowerQuery.includes('астрономи')) {
    return 'astronomy';
  }
  if (lowerQuery.includes('истори') || lowerQuery.includes('событи')) {
    return 'history';
  }
  if (lowerQuery.includes('медицин') || lowerQuery.includes('здоров') || lowerQuery.includes('лечени')) {
    return 'medical';
  }
  if (lowerQuery.includes('наук') || lowerQuery.includes('физик') || lowerQuery.includes('хими')) {
    return 'science';
  }
  if (lowerQuery.includes('технологи') || lowerQuery.includes('компьютер')) {
    return 'technology';
  }
  
  return 'general';
}

/**
 * Извлекает структурированные данные из текста
 */
function extractStructuredData(text) {
  return {
    numbers: (text.match(/\d+[.,]?\d*\s*(?:млн|млрд|тыс|процент|%|км|м|кг|тонн|градус|°C|°F)/gi) || []).slice(0, 5),
    dates: (text.match(/\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{4}\s*год/g) || []).slice(0, 3),
    locations: (text.match(/в\s+([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)*)/g) || []).slice(0, 3),
    keyTerms: extractKeyTerms(text)
  };
}

/**
 * Извлекает ключевые термины
 */
function extractKeyTerms(text) {
  const words = text.toLowerCase().match(/\b[а-яё]{4,}\b/g) || [];
  const frequency = {};
  
  words.forEach(word => {
    if (!isStopWord(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .filter(([word, freq]) => freq > 1)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

/**
 * Проверка стоп-слов
 */
function isStopWord(word) {
  const stopWords = ['который', 'которая', 'которое', 'также', 'более', 'менее', 'может', 'могут', 'должен', 'должна', 'после', 'перед', 'между', 'через', 'около'];
  return stopWords.includes(word);
}

/**
 * Форматирует ответ в зависимости от типа запроса
 */
function formatAnswerByType(queryType, originalQuery, topResults, keyData) {
  const mainContent = topResults[0].snippet || topResults[0].content || '';
  
  let answer = '';
  
  switch (queryType) {
    case 'astronomy':
      answer = `🌌 **${originalQuery}**\n\n${mainContent}`;
      if (keyData.numbers.length > 0) {
        answer += `\n\n📊 **Ключевые характеристики:** ${keyData.numbers.join(', ')}`;
      }
      break;
      
    case 'history':
      answer = `📚 **${originalQuery}**\n\n${mainContent}`;
      if (keyData.dates.length > 0) {
        answer += `\n\n📅 **Важные даты:** ${keyData.dates.join(', ')}`;
      }
      break;
      
    case 'medical':
      answer = `🏥 **${originalQuery}**\n\n${mainContent}`;
      if (keyData.keyTerms.length > 0) {
        answer += `\n\n💊 **Ключевые понятия:** ${keyData.keyTerms.join(', ')}`;
      }
      break;
      
    case 'science':
      answer = `🔬 **${originalQuery}**\n\n${mainContent}`;
      if (keyData.numbers.length > 0) {
        answer += `\n\n🧮 **Научные данные:** ${keyData.numbers.join(', ')}`;
      }
      break;
      
    case 'technology':
      answer = `💻 **${originalQuery}**\n\n${mainContent}`;
      if (keyData.keyTerms.length > 0) {
        answer += `\n\n⚙️ **Технические термины:** ${keyData.keyTerms.join(', ')}`;
      }
      break;
      
    default:
      answer = `🎯 **Ответ на "${originalQuery}"**\n\n${mainContent}`;
      if (keyData.numbers.length > 0) {
        answer += `\n\n📊 **Ключевые данные:** ${keyData.numbers.join(', ')}`;
      }
  }
  
  // Добавляем дополнительную информацию из других результатов
  if (topResults.length > 1) {
    const additionalInfo = topResults.slice(1, 3)
      .map(r => r.snippet || r.content || '')
      .filter(content => content.length > 50)
      .slice(0, 2);
      
    if (additionalInfo.length > 0) {
      answer += `\n\n📋 **Дополнительная информация:**\n• ${additionalInfo.join('\n• ')}`;
    }
  }
  
  return answer;
}

// Удаляем первый дублированный экспорт - будет только один полный в конце файла

/**
 * Извлечение ключевых фактов
 */
function extractKeyFacts(results) {
  const facts = [];
  
  results.forEach(result => {
    if (result.snippet) {
      // Ищем числовые данные, даты, имена
      const numbers = result.snippet.match(/\d+[.,]?\d*/g);
      const dates = result.snippet.match(/\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}/g);
      
      if (numbers && numbers.length > 0) {
        facts.push(`Числовые данные: ${numbers.join(', ')}`);
      }
      
      if (dates && dates.length > 0) {
        facts.push(`Даты: ${dates.join(', ')}`);
      }
    }
  });
  
  return [...new Set(facts)].slice(0, 10); // Уникальные факты, максимум 10
}

/**
 * Генерация краткого резюме
 */
function generateSummary(results, query) {
  if (results.length === 0) {
    return `По запросу "${query}" информация не найдена.`;
  }
  
  const topResult = results[0];
  const totalSources = results.map(r => r.source).filter((v, i, a) => a.indexOf(v) === i).length;
  
  return `По запросу "${query}" найдено ${results.length} результатов из ${totalSources} источников. ` +
         `Наиболее релевантный результат: "${topResult.title}" (${topResult.url}).`;
}

/**
 * Вычисление релевантности результата
 */
function calculateRelevanceScore(result, query) {
  let score = 0;
  const queryWords = query.toLowerCase().split(' ');
  
  // Проверяем заголовок
  if (result.title) {
    const titleWords = result.title.toLowerCase();
    queryWords.forEach(word => {
      if (titleWords.includes(word)) score += 3;
    });
  }
  
  // Проверяем описание
  if (result.snippet) {
    const snippetWords = result.snippet.toLowerCase();
    queryWords.forEach(word => {
      if (snippetWords.includes(word)) score += 1;
    });
  }
  
  // Проверяем URL
  if (result.url) {
    const urlWords = result.url.toLowerCase();
    queryWords.forEach(word => {
      if (urlWords.includes(word)) score += 2;
    });
  }
  
  return Math.min(score / queryWords.length, 10); // Нормализуем от 0 до 10
}

/**
 * Вычисление уверенности в результатах
 */
function calculateConfidenceScore(results) {
  if (results.length === 0) return 0;
  
  const avgRelevance = results.reduce((sum, r) => sum + (r.relevanceScore || 0), 0) / results.length;
  const sourceVariety = results.map(r => r.source).filter((v, i, a) => a.indexOf(v) === i).length;
  
  return Math.min((avgRelevance * 0.7 + sourceVariety * 0.3) * 10, 100);
}

/**
 * Удаление дубликатов
 */
function removeDuplicates(results) {
  const seen = new Set();
  return results.filter(result => {
    const key = result.url || result.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Поиск по веб-страницам в реальном времени
 */
async function searchRealTimeWeb(query, options = {}) {
  const { 
    timeRange = 'recent', // recent, day, week, month, year
    region = 'ru'
  } = options;

  try {
    let timeFilter = '';
    switch (timeRange) {
      case 'day':
        timeFilter = ' after:' + new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0];
        break;
      case 'week':
        timeFilter = ' after:' + new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
        break;
      case 'month':
        timeFilter = ' after:' + new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
        break;
    }

    const enhancedQuery = query + timeFilter;
    return await performWebSearch(enhancedQuery, region, 15);

  } catch (error) {
    console.error('❌ Ошибка поиска в реальном времени:', error);
    return [];
  }
}

module.exports = {
  performAdvancedSearch,
  performComprehensiveSearch,
  searchRealTimeWeb,
  analyzeSearchResults,
  generateAIProcessedAnswer,
  performLocalWebSearch,
  performNewsSearch,
  performAcademicSearch,
  performImageSearch
};