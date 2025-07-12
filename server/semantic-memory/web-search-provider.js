
/**
 * Web Search Provider - реальный внешний поиск
 * Интеграция с DuckDuckGo, Wikipedia и другими источниками
 */

const axios = require('axios');

// Кэш для избежания повторных запросов
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

/**
 * Основная функция поиска с использованием нескольких источников
 */
export async function search(query, options = {}) {
  console.log(`🔍 [WEB-SEARCH] Реальный поиск: "${query}"`);

  const startTime = Date.now();
  const cacheKey = `${query}_${JSON.stringify(options)}`;
  
  // Проверяем кэш
  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`📋 [WEB-SEARCH] Результат из кэша для: "${query}"`);
      return cached.results;
    }
  }

  const results = [];
  const maxResults = options.maxResults || 10;

  try {
    // 1. Поиск в DuckDuckGo (основной источник)
    console.log(`🦆 [WEB-SEARCH] Поиск в DuckDuckGo...`);
    const duckResults = await searchDuckDuckGo(query, Math.ceil(maxResults * 0.6));
    results.push(...duckResults);

    // 2. Поиск в Wikipedia
    console.log(`📚 [WEB-SEARCH] Поиск в Wikipedia...`);
    const wikiResults = await searchWikipedia(query, Math.ceil(maxResults * 0.3));
    results.push(...wikiResults);

    // 3. Поиск новостей (если запрос связан с новостями)
    if (isNewsQuery(query)) {
      console.log(`📰 [WEB-SEARCH] Поиск новостей...`);
      const newsResults = await searchNews(query, Math.ceil(maxResults * 0.2));
      results.push(...newsResults);
    }

    // 4. Академический поиск (если запрос научный)
    if (isScientificQuery(query)) {
      console.log(`🔬 [WEB-SEARCH] Поиск научных статей...`);
      const academicResults = await searchAcademic(query, Math.ceil(maxResults * 0.2));
      results.push(...academicResults);
    }

    // Сортируем по релевантности и убираем дубликаты
    const uniqueResults = removeDuplicates(results);
    const sortedResults = uniqueResults
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, maxResults);

    const processingTime = Date.now() - startTime;
    
    // Сохраняем в кэш
    searchCache.set(cacheKey, {
      results: sortedResults,
      timestamp: Date.now()
    });

    console.log(`✅ [WEB-SEARCH] Найдено ${sortedResults.length} результатов за ${processingTime}мс`);
    
    return sortedResults;

  } catch (error) {
    console.error(`❌ [WEB-SEARCH] Ошибка поиска: ${error.message}`);
    return [];
  }
}

/**
 * Поиск в DuckDuckGo через их Instant Answer API
 */
async function searchDuckDuckGo(query, maxResults = 5) {
  try {
    // Используем DuckDuckGo Instant Answer API
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: '1',
        skip_disambig: '1'
      },
      timeout: 5000
    });

    const results = [];
    const data = response.data;

    // Добавляем основной ответ если есть
    if (data.Abstract && data.Abstract.length > 0) {
      results.push({
        title: data.Heading || query,
        snippet: data.Abstract,
        url: data.AbstractURL || '',
        source: 'duckduckgo',
        type: 'abstract',
        relevanceScore: 0.9
      });
    }

    // Добавляем определение если есть
    if (data.Definition && data.Definition.length > 0) {
      results.push({
        title: `Определение: ${query}`,
        snippet: data.Definition,
        url: data.DefinitionURL || '',
        source: 'duckduckgo',
        type: 'definition',
        relevanceScore: 0.95
      });
    }

    // Добавляем связанные темы
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, maxResults - results.length).forEach(topic => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: extractTitleFromText(topic.Text),
            snippet: topic.Text,
            url: topic.FirstURL,
            source: 'duckduckgo',
            type: 'related',
            relevanceScore: 0.7
          });
        }
      });
    }

    return results;

  } catch (error) {
    console.error(`❌ DuckDuckGo поиск не удался: ${error.message}`);
    return [];
  }
}

/**
 * Поиск в Wikipedia
 */
async function searchWikipedia(query, maxResults = 3) {
  try {
    // Поиск статей
    const searchResponse = await axios.get('https://ru.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        srlimit: maxResults,
        origin: '*'
      },
      timeout: 5000
    });

    const results = [];
    const searchResults = searchResponse.data.query?.search || [];

    for (const article of searchResults) {
      try {
        // Получаем краткое содержание статьи
        const summaryResponse = await axios.get('https://ru.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            format: 'json',
            titles: article.title,
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            exsentences: 3,
            origin: '*'
          },
          timeout: 3000
        });

        const pages = summaryResponse.data.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId]?.extract || article.snippet;

        results.push({
          title: article.title,
          snippet: extract.replace(/<[^>]*>/g, ''), // Убираем HTML теги
          url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(article.title)}`,
          source: 'wikipedia',
          type: 'encyclopedia',
          relevanceScore: calculateRelevanceScore(query, article.title, extract)
        });

      } catch (err) {
        // Если не удалось получить полное содержание, используем базовые данные
        results.push({
          title: article.title,
          snippet: article.snippet.replace(/<[^>]*>/g, ''),
          url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(article.title)}`,
          source: 'wikipedia',
          type: 'encyclopedia',
          relevanceScore: 0.6
        });
      }
    }

    return results;

  } catch (error) {
    console.error(`❌ Wikipedia поиск не удался: ${error.message}`);
    return [];
  }
}

/**
 * Поиск новостей
 */
async function searchNews(query, maxResults = 3) {
  try {
    // Используем NewsAPI (требует ключ) или RSS ленты
    const results = [];
    
    // Пытаемся получить новости через RSS (более надежно без API ключа)
    try {
      const rssResponse = await axios.get(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ru&gl=RU&ceid=RU:ru`, {
        timeout: 5000
      });
      
      // Простой парсинг RSS (можно улучшить)
      const items = extractRSSItems(rssResponse.data);
      
      items.slice(0, maxResults).forEach(item => {
        results.push({
          title: item.title,
          snippet: item.description || '',
          url: item.link,
          source: 'google_news',
          type: 'news',
          relevanceScore: 0.8,
          publishedDate: item.pubDate
        });
      });
      
    } catch (rssError) {
      console.log(`⚠️ RSS новости недоступны: ${rssError.message}`);
    }

    return results;

  } catch (error) {
    console.error(`❌ Поиск новостей не удался: ${error.message}`);
    return [];
  }
}

/**
 * Академический поиск
 */
async function searchAcademic(query, maxResults = 2) {
  try {
    const results = [];
    
    // Поиск в arXiv
    try {
      const arxivResponse = await axios.get('http://export.arxiv.org/api/query', {
        params: {
          search_query: `all:${query}`,
          start: 0,
          max_results: maxResults
        },
        timeout: 7000
      });

      const papers = parseArxivXML(arxivResponse.data);
      
      papers.forEach(paper => {
        results.push({
          title: paper.title,
          snippet: paper.summary,
          url: paper.id,
          source: 'arxiv',
          type: 'academic',
          relevanceScore: 0.85,
          authors: paper.authors,
          publishedDate: paper.published
        });
      });
      
    } catch (arxivError) {
      console.log(`⚠️ arXiv поиск недоступен: ${arxivError.message}`);
    }

    return results;

  } catch (error) {
    console.error(`❌ Академический поиск не удался: ${error.message}`);
    return [];
  }
}

/**
 * Расширенный поиск с анализом
 */
export async function performAdvancedSearch(query, options = {}) {
  console.log(`🔬 [ADVANCED-SEARCH] Расширенный поиск: "${query}"`);

  try {
    const basicResults = await search(query, options);
    
    if (basicResults.length === 0) {
      return {
        summary: 'По данному запросу результаты не найдены',
        results: [],
        confidence: 0.1
      };
    }

    // Анализируем результаты для создания сводки
    const summary = generateSearchSummary(query, basicResults);
    const confidence = calculateSearchConfidence(basicResults);

    return {
      summary: summary,
      results: basicResults,
      confidence: confidence,
      totalResults: basicResults.length,
      searchTime: Date.now()
    };

  } catch (error) {
    console.error(`❌ [ADVANCED-SEARCH] Ошибка: ${error.message}`);
    
    return {
      summary: 'Произошла ошибка при поиске информации',
      results: [],
      confidence: 0.1,
      error: error.message
    };
  }
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

function isNewsQuery(query) {
  const newsKeywords = ['новости', 'событие', 'произошло', 'случилось', 'сегодня', 'вчера', 'происходит'];
  return newsKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

function isScientificQuery(query) {
  const scienceKeywords = ['исследование', 'наука', 'научный', 'эксперимент', 'теория', 'формула', 'физика', 'химия', 'биология'];
  return scienceKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

function calculateRelevanceScore(query, title, content) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const titleWords = title.toLowerCase().split(/\s+/);
  const contentWords = content.toLowerCase().split(/\s+/);

  let score = 0;
  queryWords.forEach(word => {
    if (titleWords.some(tw => tw.includes(word))) score += 0.4;
    if (contentWords.some(cw => cw.includes(word))) score += 0.1;
  });

  return Math.min(1, score);
}

function removeDuplicates(results) {
  const seen = new Set();
  return results.filter(result => {
    const key = `${result.title}_${result.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractTitleFromText(text) {
  // Извлекаем первые 60 символов как заголовок
  return text.length > 60 ? text.substring(0, 60) + '...' : text;
}

function extractRSSItems(xmlData) {
  const items = [];
  try {
    // Простой regex парсинг RSS (в реальном проекте лучше использовать XML парсер)
    const itemMatches = xmlData.match(/<item>[\s\S]*?<\/item>/g) || [];
    
    itemMatches.slice(0, 5).forEach(item => {
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || [])[1] || '';
      const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || '';
      const description = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || [])[1] || '';
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      
      if (title && link) {
        items.push({ title, link, description, pubDate });
      }
    });
  } catch (error) {
    console.error('Ошибка парсинга RSS:', error);
  }
  
  return items;
}

function parseArxivXML(xmlData) {
  const papers = [];
  try {
    const entryMatches = xmlData.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    
    entryMatches.slice(0, 3).forEach(entry => {
      const title = (entry.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const summary = (entry.match(/<summary>(.*?)<\/summary>/) || [])[1] || '';
      const id = (entry.match(/<id>(.*?)<\/id>/) || [])[1] || '';
      const published = (entry.match(/<published>(.*?)<\/published>/) || [])[1] || '';
      
      if (title && summary) {
        papers.push({
          title: title.replace(/\s+/g, ' ').trim(),
          summary: summary.replace(/\s+/g, ' ').trim().substring(0, 300),
          id: id,
          published: published,
          authors: []
        });
      }
    });
  } catch (error) {
    console.error('Ошибка парсинга arXiv XML:', error);
  }
  
  return papers;
}

function generateSearchSummary(query, results) {
  if (results.length === 0) {
    return `По запросу "${query}" результаты не найдены.`;
  }

  const sources = [...new Set(results.map(r => r.source))];
  const topResult = results[0];
  
  let summary = `По запросу "${query}" найдено ${results.length} результатов из источников: ${sources.join(', ')}. `;
  
  if (topResult.snippet) {
    summary += `Основная информация: ${topResult.snippet.substring(0, 200)}...`;
  }
  
  return summary;
}

function calculateSearchConfidence(results) {
  if (results.length === 0) return 0.1;
  
  const avgRelevance = results.reduce((sum, r) => sum + (r.relevanceScore || 0.5), 0) / results.length;
  const sourceVariety = new Set(results.map(r => r.source)).size;
  
  return Math.min(0.95, avgRelevance * 0.7 + (sourceVariety / 4) * 0.3);
}

export default {
  search,
  performAdvancedSearch
};
