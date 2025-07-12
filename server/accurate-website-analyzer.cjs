/**
 * Точный анализатор веб-сайтов
 * Обеспечивает достоверный анализ сайтов через реальную загрузку контента
 */

const fetch = require('node-fetch');

const SmartLogger = {
  analyze: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] WEBSITE ANALYZER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`❌ [${timestamp}] ANALYZER ERROR: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

/**
 * Проверяет, является ли строка URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Извлекает URL из текста запроса
 */
function extractUrlFromQuery(query) {
  SmartLogger.analyze(`Извлекаю URL из запроса: "${query}"`);
  
  // Паттерны для поиска URL
  const urlPatterns = [
    // Прямые URL
    /(https?:\/\/[^\s]+)/gi,
    // URL без протокола
    /([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi
  ];

  for (const pattern of urlPatterns) {
    const matches = query.match(pattern);
    if (matches) {
      let url = matches[0];
      // Добавляем протокол если его нет
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      // Очищаем от лишних символов в конце
      url = url.replace(/[.,;!?]+$/, '');
      
      if (isValidUrl(url)) {
        SmartLogger.analyze(`Найден URL: ${url}`);
        return url;
      }
    }
  }

  SmartLogger.analyze('URL не найден в запросе');
  return null;
}

/**
 * Определяет тип запроса на анализ сайта
 */
function detectWebsiteAnalysisIntent(query) {
  const lowerQuery = query.toLowerCase();
  
  // Ключевые фразы для анализа сайтов
  const analysisKeywords = [
    'проанализируй сайт',
    'анализ сайта', 
    'изучи сайт',
    'что на сайте',
    'опиши сайт',
    'расскажи о сайте',
    'какой сайт',
    'информация о сайте',
    'содержимое сайта',
    'analyze website',
    'website analysis',
    'site analysis'
  ];

  // Проверяем наличие URL
  const hasUrl = extractUrlFromQuery(query) !== null;
  
  // Проверяем ключевые слова
  const hasAnalysisKeywords = analysisKeywords.some(keyword => 
    lowerQuery.includes(keyword)
  );

  const confidence = (hasUrl ? 60 : 0) + (hasAnalysisKeywords ? 40 : 0);
  
  SmartLogger.analyze(`Детекция анализа сайта - URL: ${hasUrl}, ключевые слова: ${hasAnalysisKeywords}, уверенность: ${confidence}%`);
  
  return {
    isWebsiteAnalysis: confidence >= 60,
    confidence,
    hasUrl,
    hasAnalysisKeywords
  };
}

/**
 * Загружает содержимое веб-страницы
 */
async function fetchWebsiteContent(url) {
  SmartLogger.analyze(`Загружаю содержимое сайта: ${url}`);
  
  try {
    // Используем web_fetch функцию через require если доступна
    let webFetch;
    try {
      // Попробуем найти web_fetch в глобальных функциях
      const fs = require('fs');
      const path = require('path');
      
      // Для совместимости используем обычный fetch
      webFetch = fetch;
    } catch (err) {
      webFetch = fetch;
    }

    const response = await webFetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    SmartLogger.analyze(`Успешно загружено ${html.length} символов`);
    
    return {
      success: true,
      html,
      url,
      statusCode: response.status
    };

  } catch (error) {
    SmartLogger.error(`Ошибка загрузки ${url}:`, error.message);
    return {
      success: false,
      error: error.message,
      url
    };
  }
}

/**
 * Парсит HTML и извлекает структурированную информацию
 */
function parseWebsiteStructure(html, url) {
  SmartLogger.analyze(`Парсинг структуры сайта: ${url}`);
  
  try {
    // Простой парсинг без внешних библиотек
    const structure = {
      title: '',
      description: '',
      navigation: [],
      mainContent: '',
      products: [],
      prices: [],
      categories: [],
      contactInfo: {},
      technicalInfo: {}
    };

    // Извлекаем заголовок страницы
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      structure.title = titleMatch[1].trim();
    }

    // Извлекаем мета-описание
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
    if (descMatch) {
      structure.description = descMatch[1].trim();
    }

    // Извлекаем навигационные ссылки
    const navLinks = html.match(/<a[^>]*href=["\']([^"']+)["\'][^>]*>([^<]+)<\/a>/gi) || [];
    structure.navigation = navLinks
      .slice(0, 20) // Ограничиваем количество
      .map(link => {
        const hrefMatch = link.match(/href=["\']([^"']+)["\']/i);
        const textMatch = link.match(/>([^<]+)</);
        return {
          url: hrefMatch ? hrefMatch[1] : '',
          text: textMatch ? textMatch[1].trim() : ''
        };
      })
      .filter(link => link.text.length > 0 && link.text.length < 50);

    // Извлекаем цены - расширенные паттерны с поддержкой Tilda CMS
    const pricePatterns = [
      // СПЕЦИАЛЬНЫЕ ПАТТЕРНЫ ДЛЯ TILDA CMS
      /class="t754__price"[^>]*>(\d{1,5})<\/div>/gi,                     // Tilda цены
      /field="li_price__[^"]*">(\d{1,5})<\/div>/gi,                      // Tilda поля цен
      /"price"[^>]*>(\d{1,5})<\/[^>]*>/gi,                               // Общие price классы
      
      // Основные российские форматы
      /(\d{1,5})\s*р(?:\.|\b)/gi,                    // "5990 р" или "5990 р."
      /(\d{1,5})\s*руб(?:лей|ля|ль)?\b/gi,          // "5990 руб", "5990 рублей"
      /(\d{1,5})\s*₽/gi,                             // "5990 ₽"
      
      // Форматы с разделителями
      /(\d{1,3}(?:\s\d{3})+)\s*р(?:\.|\b)/gi,       // "5 990 р"
      /(\d{1,3}(?:\s\d{3})+)\s*руб/gi,              // "5 990 руб"
      /(\d{1,3}(?:\s\d{3})+)\s*₽/gi,                // "5 990 ₽"
      
      // Форматы с запятыми и точками
      /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:руб|рублей|₽|р\.)/gi,
      
      // Валютные форматы
      /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:\$|долларов|usd)/gi,
      /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:€|евро|eur)/gi,
      
      // Дополнительные российские паттерны
      /цена[:\s]*(\d{1,5})\s*р/gi,                  // "цена: 5990 р"
      /стоимость[:\s]*(\d{1,5})\s*р/gi,             // "стоимость: 5990 р"
      
      // JSON/DATA атрибуты (часто используются в современных CMS)
      /"price":\s*"?(\d{1,5})"?/gi,                 // JSON цены
      /data-price="(\d{1,5})"/gi                    // Data атрибуты
    ];

    pricePatterns.forEach((pattern, index) => {
      const matches = html.match(pattern) || [];
      if (matches.length > 0) {
        SmartLogger.analyze(`Паттерн ${index + 1} нашел ${matches.length} цен: ${matches.slice(0, 5).join(', ')}`);
      }
      structure.prices.push(...matches.slice(0, 10));
    });
    
    SmartLogger.analyze(`Всего найдено потенциальных цен: ${structure.prices.length}`);

    // Извлекаем основной контент (упрощенно)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    structure.mainContent = textContent.substring(0, 1000);

    // Определяем техническую информацию
    structure.technicalInfo = {
      hasJavaScript: html.includes('<script'),
      hasCSS: html.includes('<style') || html.includes('.css'),
      responsive: html.includes('viewport') || html.includes('responsive'),
      platform: detectPlatform(html)
    };

    SmartLogger.analyze(`Парсинг завершен - заголовок: "${structure.title}"`);
    return structure;

  } catch (error) {
    SmartLogger.error('Ошибка парсинга HTML:', error.message);
    return null;
  }
}

/**
 * Определяет платформу сайта
 */
function detectPlatform(html) {
  const platforms = [
    { name: 'Tilda', patterns: ['tilda', 'tildacdn'] },
    { name: 'WordPress', patterns: ['wp-content', 'wordpress', 'wp-includes'] },
    { name: 'Shopify', patterns: ['shopify', 'cdn.shopify'] },
    { name: 'Wix', patterns: ['wix.com', 'wixstatic'] },
    { name: 'React', patterns: ['react', 'react-dom'] },
    { name: 'Vue', patterns: ['vue.js', 'vue.min.js'] },
    { name: 'Angular', patterns: ['angular', 'ng-'] }
  ];

  for (const platform of platforms) {
    if (platform.patterns.some(pattern => html.toLowerCase().includes(pattern))) {
      return platform.name;
    }
  }

  return 'Неизвестно';
}

/**
 * Анализирует тип бизнеса и тематику сайта
 */
function analyzeBusinessType(structure) {
  SmartLogger.analyze('Анализирую тип бизнеса и тематику сайта');
  
  const content = (structure.title + ' ' + structure.description + ' ' + structure.mainContent).toLowerCase();
  const navigation = structure.navigation.map(nav => nav.text.toLowerCase()).join(' ');
  const fullContent = content + ' ' + navigation;

  // Определяем тип бизнеса
  const businessTypes = {
    'Интернет-магазин': ['каталог', 'товары', 'купить', 'цена', 'корзина', 'доставка', 'оплата', 'заказ'],
    'Ресторан/Кафе': ['меню', 'кухня', 'блюда', 'доставка еды', 'ресторан', 'кафе', 'бронирование'],
    'Услуги': ['услуги', 'сервис', 'консультация', 'обслуживание', 'ремонт', 'установка'],
    'Образование': ['курсы', 'обучение', 'образование', 'школа', 'университет', 'лекции'],
    'Медицина': ['клиника', 'врач', 'лечение', 'диагностика', 'медицина', 'здоровье'],
    'Недвижимость': ['квартиры', 'дома', 'аренда', 'продажа', 'недвижимость', 'жилье'],
    'IT/Технологии': ['разработка', 'программирование', 'сайты', 'приложения', 'it', 'технологии'],
    'Мода/Одежда': ['одежда', 'мода', 'стиль', 'коллекция', 'бренд', 'футболки', 'брюки', 'худи']
  };

  let detectedType = 'Другое';
  let maxScore = 0;

  for (const [type, keywords] of Object.entries(businessTypes)) {
    const score = keywords.filter(keyword => fullContent.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
    }
  }

  // Определяем целевую аудиторию
  const audienceKeywords = {
    'B2B': ['для бизнеса', 'партнеры', 'оптом', 'корпоративные', 'b2b'],
    'B2C': ['частные лица', 'покупатели', 'клиенты', 'пользователи'],
    'Молодежь': ['молодой', 'студенты', 'тренды', 'стиль', 'инстаграм'],
    'Семьи': ['семья', 'дети', 'родители', 'семейные']
  };

  let targetAudience = 'Общая';
  for (const [audience, keywords] of Object.entries(audienceKeywords)) {
    if (keywords.some(keyword => fullContent.includes(keyword))) {
      targetAudience = audience;
      break;
    }
  }

  return {
    businessType: detectedType,
    confidence: maxScore * 10,
    targetAudience,
    features: analyzeFeatures(fullContent)
  };
}

/**
 * Анализирует функциональные возможности сайта
 */
function analyzeFeatures(content) {
  const features = [];
  
  const featurePatterns = {
    'Корзина покупок': ['корзина', 'cart', 'basket'],
    'Регистрация': ['регистрация', 'signup', 'register'],
    'Личный кабинет': ['личный кабинет', 'account', 'profile'],
    'Поиск': ['поиск', 'search'],
    'Фильтры': ['фильтр', 'filter', 'сортировка'],
    'Отзывы': ['отзывы', 'reviews', 'комментарии'],
    'Блог': ['блог', 'blog', 'статьи', 'новости'],
    'Обратная связь': ['контакты', 'связь', 'contact'],
    'Социальные сети': ['instagram', 'facebook', 'vk', 'telegram'],
    'Многоязычность': ['en', 'english', 'язык', 'language']
  };

  for (const [feature, keywords] of Object.entries(featurePatterns)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      features.push(feature);
    }
  }

  return features;
}

/**
 * Генерирует финальный отчет об анализе сайта
 */
function generateAnalysisReport(structure, businessAnalysis, url) {
  SmartLogger.analyze('Генерирую финальный отчет анализа сайта');

  const domain = new URL(url).hostname;
  
  let report = `## Анализ сайта ${domain}\n\n`;

  // Основная информация
  report += `### 📌 Основная информация:\n`;
  report += `- **Название сайта:** ${structure.title || 'Не указано'}\n`;
  report += `- **Тип бизнеса:** ${businessAnalysis.businessType}\n`;
  report += `- **Целевая аудитория:** ${businessAnalysis.targetAudience}\n`;
  if (structure.description) {
    report += `- **Описание:** ${structure.description}\n`;
  }
  report += `\n`;

  // Структура и навигация
  if (structure.navigation.length > 0) {
    report += `### 🗂️ Структура сайта:\n`;
    const mainSections = structure.navigation
      .filter(nav => nav.text.length > 2 && nav.text.length < 30)
      .slice(0, 8)
      .map(nav => nav.text)
      .join(', ');
    report += `**Основные разделы:** ${mainSections}\n\n`;
  }

  // Функциональность
  if (businessAnalysis.features.length > 0) {
    report += `### ⚙️ Функциональность:\n`;
    businessAnalysis.features.forEach(feature => {
      report += `- ${feature}\n`;
    });
    report += `\n`;
  }

  // Цены (если найдены)
  if (structure.prices.length > 0) {
    report += `### 💰 Ценовая информация:\n`;
    const uniquePrices = [...new Set(structure.prices)].slice(0, 5);
    report += `**Найденные цены:** ${uniquePrices.join(', ')}\n\n`;
  }

  // Техническая информация
  report += `### 🛠️ Техническая информация:\n`;
  report += `- **Платформа:** ${structure.technicalInfo.platform}\n`;
  report += `- **Адаптивный дизайн:** ${structure.technicalInfo.responsive ? 'Да' : 'Нет'}\n`;
  report += `- **JavaScript:** ${structure.technicalInfo.hasJavaScript ? 'Используется' : 'Не обнаружен'}\n`;

  // Краткие выводы
  report += `\n### 📊 Краткие выводы:\n`;
  
  if (businessAnalysis.businessType === 'Интернет-магазин') {
    report += `Сайт представляет собой интернет-магазин`;
    if (structure.prices.length > 0) {
      report += ` с товарами в ценовом диапазоне`;
    }
  } else if (businessAnalysis.businessType === 'Мода/Одежда') {
    report += `Сайт бренда одежды с акцентом на современную моду`;
  } else {
    report += `Сайт специализируется в сфере: ${businessAnalysis.businessType.toLowerCase()}`;
  }

  if (businessAnalysis.features.includes('Корзина покупок')) {
    report += ` с возможностью онлайн-покупок`;
  }

  report += `.`;

  return report;
}

/**
 * Основная функция анализа сайта
 */
async function analyzeWebsite(query, options = {}) {
  SmartLogger.analyze(`Начинаю анализ сайта для запроса: "${query}"`);
  
  try {
    // Шаг 1: Извлекаем URL из запроса
    const url = extractUrlFromQuery(query);
    if (!url) {
      return {
        success: false,
        error: 'URL не найден в запросе',
        query
      };
    }

    // Шаг 2: Загружаем содержимое сайта
    const fetchResult = await fetchWebsiteContent(url);
    if (!fetchResult.success) {
      return {
        success: false,
        error: `Ошибка загрузки сайта: ${fetchResult.error}`,
        url,
        query
      };
    }

    // Шаг 3: Парсим структуру
    const structure = parseWebsiteStructure(fetchResult.html, url);
    if (!structure) {
      return {
        success: false,
        error: 'Ошибка парсинга содержимого сайта',
        url,
        query
      };
    }

    // Шаг 4: Анализируем бизнес-тип
    const businessAnalysis = analyzeBusinessType(structure);

    // Шаг 5: НОВЫЙ - Расширенный анализ
    const businessDetails = analyzeBusinessDetails(structure);
    const seoMarketing = analyzeSEOAndMarketing(structure, fetchResult.html);
    const conversionElements = analyzeConversionElements(structure, fetchResult.html);

    // Шаг 6: Генерируем расширенный отчет
    const report = generateAdvancedAnalysisReport(structure, businessAnalysis, businessDetails, seoMarketing, conversionElements, url);

    SmartLogger.analyze(`Анализ сайта ${url} завершен успешно`);

    return {
      success: true,
      response: report,
      url,
      query,
      structure,
      businessAnalysis,
      provider: 'AccurateWebsiteAnalyzer',
      category: 'website_analysis'
    };

  } catch (error) {
    SmartLogger.error('Критическая ошибка анализа сайта:', error.message);
    return {
      success: false,
      error: `Критическая ошибка: ${error.message}`,
      query
    };
  }
}

/**
 * НОВЫЙ: Детальный бизнес-анализ
 */
function analyzeBusinessDetails(structure) {
  SmartLogger.analyze('Выполняю детальный бизнес-анализ');
  
  const fullContent = (structure.title + ' ' + structure.description + ' ' + structure.mainContent).toLowerCase();
  
  return {
    pricing: analyzePricing(structure),
    uniqueSellingProposition: analyzeUSP(structure),
    productRange: analyzeProductRange(structure),
    competitiveAdvantages: analyzeCompetitiveAdvantages(fullContent)
  };
}

/**
 * Анализ ценовой политики
 */
function analyzePricing(structure) {
  const prices = structure.prices || [];
  
  if (prices.length === 0) {
    return {
      hasPricing: false,
      strategy: 'Цены не указаны публично',
      note: 'Возможно, цены предоставляются по запросу'
    };
  }
  
  // Извлекаем численные значения цен с улучшенной обработкой
  const numericPrices = prices.map(price => {
    // Специальная обработка для Tilda CMS и других HTML паттернов
    let cleaned = price;
    
    // Если это HTML с группами захвата, извлекаем последние 4-5 цифр (реальную цену)
    const match = price.match(/(\d{4,5})(?=<\/div>)/);
    if (match) {
      cleaned = match[1]; // Берем только цену в конце строки
    } else {
      // Убираем все лишнее, оставляем только цифры, пробелы, точки и запятые
      cleaned = price.replace(/[^\d\s.,]/g, '');
    }
    
    // Обрабатываем пробелы как разделители тысяч (5 990 -> 5990)
    cleaned = cleaned.replace(/\s+/g, '');
    
    // Заменяем запятую на точку для парсинга
    cleaned = cleaned.replace(',', '.');
    
    const num = parseFloat(cleaned);
    
    // Логируем для отладки
    if (!isNaN(num) && num > 0 && num < 1000000) {
      SmartLogger.analyze(`Найдена цена: "${price}" -> ${num}`);
    }
    
    return num;
  }).filter(price => !isNaN(price) && price > 0 && price < 1000000); // Фильтр разумных цен
  
  if (numericPrices.length === 0) {
    return {
      hasPricing: false,
      strategy: 'Цены в нестандартном формате'
    };
  }
  
  const minPrice = Math.min(...numericPrices);
  const maxPrice = Math.max(...numericPrices);
  const avgPrice = Math.round(numericPrices.reduce((a, b) => a + b, 0) / numericPrices.length);
  
  let strategy = 'Средний сегмент';
  if (avgPrice < 1000) strategy = 'Бюджетный сегмент';
  else if (avgPrice > 10000) strategy = 'Премиум сегмент';
  else if (avgPrice > 5000) strategy = 'Высокий сегмент';
  
  return {
    hasPricing: true,
    priceRange: `${minPrice} - ${maxPrice} руб.`,
    averagePrice: `${avgPrice} руб.`,
    strategy,
    totalPricesFound: numericPrices.length
  };
}

/**
 * Анализ уникального торгового предложения
 */
function analyzeUSP(structure) {
  const content = structure.title + ' ' + structure.description + ' ' + structure.mainContent;
  const contentLower = content.toLowerCase();
  
  const uspKeywords = [
    { word: 'уникальн', weight: 3 },
    { word: 'эксклюзивн', weight: 3 },
    { word: 'только у нас', weight: 4 },
    { word: 'впервые', weight: 2 },
    { word: 'лучш', weight: 2 },
    { word: 'бесплатн', weight: 2 },
    { word: 'гарантия', weight: 2 },
    { word: 'качество', weight: 1 },
    { word: 'быстр', weight: 1 },
    { word: 'удобн', weight: 1 },
    { word: 'экологичн', weight: 2 },
    { word: 'натуральн', weight: 2 },
    { word: 'handmade', weight: 3 },
    { word: 'ручная работа', weight: 3 },
    { word: 'авторск', weight: 2 },
    { word: 'индивидуальн', weight: 2 }
  ];
  
  const foundUSPs = [];
  
  uspKeywords.forEach(({ word, weight }) => {
    if (contentLower.includes(word)) {
      // Найдем предложения с этим словом
      const sentences = content.split(/[.!?]+/);
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(word) && sentence.length > 10 && sentence.length < 150) {
          foundUSPs.push({
            text: sentence.trim(),
            strength: weight,
            keyword: word
          });
        }
      });
    }
  });
  
  // Сортируем по силе и берем топ-3
  const topUSPs = foundUSPs
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3)
    .map(usp => usp.text);
  
  return {
    found: topUSPs,
    strength: foundUSPs.length > 2 ? 'Сильное' : foundUSPs.length > 0 ? 'Среднее' : 'Слабое'
  };
}

/**
 * Анализ товарного ассортимента
 */
function analyzeProductRange(structure) {
  const navigation = structure.navigation || [];
  const content = structure.mainContent.toLowerCase();
  
  // Извлекаем категории из навигации
  const categories = navigation
    .map(nav => nav.text)
    .filter(text => text.length > 2 && text.length < 30)
    .filter(text => !['главная', 'контакты', 'о нас', 'доставка', 'оплата', 'корзина'].includes(text.toLowerCase()));
  
  // Поиск продуктовых категорий в контенте
  const productCategories = [
    'одежда', 'обувь', 'аксессуары', 'украшения', 'сумки', 'часы',
    'футболки', 'джинсы', 'платья', 'куртки', 'пальто', 'свитера',
    'кроссовки', 'ботинки', 'сапоги', 'туфли', 'сандалии',
    'кольца', 'серьги', 'браслеты', 'цепочки', 'подвески',
    'косметика', 'парфюм', 'уход', 'макияж', 'крем',
    'техника', 'электроника', 'гаджеты', 'компьютеры', 'телефоны'
  ];
  
  const foundProducts = productCategories.filter(category => content.includes(category));
  
  let diversity = 'Неопределена';
  if (categories.length > 8) diversity = 'Очень широкий ассортимент';
  else if (categories.length > 5) diversity = 'Широкий ассортимент';
  else if (categories.length > 2) diversity = 'Средний ассортимент';
  else if (categories.length > 0) diversity = 'Узкая специализация';
  
  return {
    categories: categories.slice(0, 10),
    productTypes: foundProducts.slice(0, 8),
    diversity,
    categoriesCount: categories.length
  };
}

/**
 * Анализ конкурентных преимуществ
 */
function analyzeCompetitiveAdvantages(content) {
  const advantages = [];
  
  const advantagePatterns = [
    { pattern: /бесплатн.*доставк/i, advantage: 'Бесплатная доставка' },
    { pattern: /гарантия.*(\d+)/i, advantage: 'Расширенная гарантия' },
    { pattern: /возврат.*(\d+).*дн/i, advantage: 'Гибкий возврат товара' },
    { pattern: /24.*7|круглосуточн/i, advantage: 'Круглосуточная поддержка' },
    { pattern: /скидк.*(\d+)%/i, advantage: 'Система скидок' },
    { pattern: /собственн.*производств/i, advantage: 'Собственное производство' },
    { pattern: /эко.*матери|натуральн.*матери/i, advantage: 'Экологичные материалы' },
    { pattern: /персонализ|индивидуальн.*подход/i, advantage: 'Персонализация' },
    { pattern: /опыт.*(\d+).*лет/i, advantage: 'Многолетний опыт' },
    { pattern: /эксклюзивн|уникальн/i, advantage: 'Эксклюзивность' },
    { pattern: /быстр.*доставк/i, advantage: 'Быстрая доставка' },
    { pattern: /низк.*цен|доступн.*цен/i, advantage: 'Доступные цены' }
  ];
  
  advantagePatterns.forEach(({ pattern, advantage }) => {
    if (pattern.test(content)) {
      advantages.push(advantage);
    }
  });
  
  return advantages;
}

/**
 * НОВЫЙ: SEO и маркетинг анализ
 */
function analyzeSEOAndMarketing(structure, html) {
  SmartLogger.analyze('Выполняю SEO и маркетинг анализ');
  
  return {
    seo: analyzeSEO(structure, html),
    socialMedia: analyzeSocialMedia(html),
    analytics: analyzeAnalytics(html),
    contentMarketing: analyzeContentMarketing(structure)
  };
}

/**
 * SEO анализ
 */
function analyzeSEO(structure, html) {
  const seo = {
    metaTags: {},
    structuredData: false,
    headings: {},
    images: {}
  };
  
  // Анализ мета-тегов
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  seo.metaTags.title = {
    present: !!titleMatch,
    content: titleMatch ? titleMatch[1].trim() : '',
    length: titleMatch ? titleMatch[1].trim().length : 0,
    quality: titleMatch && titleMatch[1].length > 30 && titleMatch[1].length < 60 ? 'Хорошая' : 'Требует улучшения'
  };
  
  const descMatch = html.match(/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"']+)["\'][^>]*>/i);
  seo.metaTags.description = {
    present: !!descMatch,
    content: descMatch ? descMatch[1].trim() : '',
    length: descMatch ? descMatch[1].trim().length : 0,
    quality: descMatch && descMatch[1].length > 120 && descMatch[1].length < 160 ? 'Хорошая' : 'Требует улучшения'
  };
  
  // Анализ заголовков
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
  
  seo.headings = {
    h1: { count: h1Count, quality: h1Count === 1 ? 'Хорошо' : 'Требует внимания' },
    h2: { count: h2Count },
    h3: { count: h3Count },
    structure: h1Count === 1 && h2Count > 0 ? 'Хорошая' : 'Требует улучшения'
  };
  
  // Структурированные данные
  seo.structuredData = html.includes('application/ld+json') || html.includes('schema.org');
  
  return seo;
}

/**
 * Анализ социальных сетей
 */
function analyzeSocialMedia(html) {
  const social = {
    platforms: [],
    integration: {},
    sharing: false
  };
  
  const socialPatterns = [
    { pattern: /vk\.com|vkontakte/i, platform: 'ВКонтакте' },
    { pattern: /instagram\.com|instagram/i, platform: 'Instagram' },
    { pattern: /facebook\.com|facebook/i, platform: 'Facebook' },
    { pattern: /youtube\.com|youtube/i, platform: 'YouTube' },
    { pattern: /telegram\.org|t\.me/i, platform: 'Telegram' },
    { pattern: /twitter\.com|x\.com/i, platform: 'Twitter/X' },
    { pattern: /tiktok\.com/i, platform: 'TikTok' },
    { pattern: /whatsapp/i, platform: 'WhatsApp' }
  ];
  
  socialPatterns.forEach(({ pattern, platform }) => {
    if (pattern.test(html)) {
      social.platforms.push(platform);
    }
  });
  
  // Open Graph теги
  social.integration.openGraph = html.includes('og:title') || html.includes('og:description');
  social.integration.twitterCards = html.includes('twitter:card');
  
  // Кнопки поделиться
  social.sharing = html.includes('share') || html.includes('поделиться');
  
  return social;
}

/**
 * Анализ аналитики
 */
function analyzeAnalytics(html) {
  const analytics = {
    googleAnalytics: html.includes('google-analytics') || html.includes('gtag') || html.includes('GA_MEASUREMENT_ID'),
    yandexMetrica: html.includes('metrika.yandex') || html.includes('ym('),
    pixels: {},
    heatmaps: false
  };
  
  // Пиксели социальных сетей
  analytics.pixels.facebook = html.includes('facebook.net/tr') || html.includes('fbq(');
  analytics.pixels.vk = html.includes('vk.com/js/api/openapi.js');
  
  // Тепловые карты
  analytics.heatmaps = html.includes('hotjar') || html.includes('crazyegg') || html.includes('yandex.ru/metrika');
  
  return analytics;
}

/**
 * Анализ контент-маркетинга
 */
function analyzeContentMarketing(structure) {
  const navigation = structure.navigation || [];
  const content = structure.mainContent.toLowerCase();
  
  const contentTypes = {
    blog: navigation.some(nav => ['блог', 'новости', 'статьи', 'blog'].includes(nav.text.toLowerCase())),
    news: content.includes('новости') || content.includes('анонсы'),
    reviews: content.includes('отзывы') || content.includes('reviews'),
    guides: content.includes('руководство') || content.includes('инструкция') || content.includes('как'),
    video: content.includes('видео') || content.includes('youtube'),
    cases: content.includes('кейсы') || content.includes('примеры работ')
  };
  
  const activeTypes = Object.entries(contentTypes)
    .filter(([type, active]) => active)
    .map(([type]) => type);
  
  return {
    types: activeTypes,
    strategy: activeTypes.length > 2 ? 'Активная' : activeTypes.length > 0 ? 'Базовая' : 'Отсутствует',
    contentQuality: structure.mainContent.length > 1000 ? 'Богатый контент' : 'Минимальный контент'
  };
}

/**
 * НОВЫЙ: Анализ конверсионных элементов
 */
function analyzeConversionElements(structure, html) {
  SmartLogger.analyze('Анализирую конверсионные элементы');
  
  return {
    contactForms: analyzeContactForms(html),
    ecommerce: analyzeEcommerce(html, structure),
    userExperience: analyzeUserExperience(html),
    trustSignals: analyzeTrustSignals(html, structure)
  };
}

/**
 * Анализ форм обратной связи
 */
function analyzeContactForms(html) {
  const forms = {
    contactForm: html.includes('<form') && (html.includes('contact') || html.includes('связ')),
    subscriptionForm: html.includes('subscribe') || html.includes('подписк'),
    callbackForm: html.includes('callback') || html.includes('обратный звонок'),
    quoteForm: html.includes('quote') || html.includes('расчет') || html.includes('заявка'),
    chatWidget: html.includes('chat') || html.includes('чат') || html.includes('онлайн-консультант')
  };
  
  const activeforms = Object.entries(forms).filter(([form, active]) => active).map(([form]) => form);
  
  return {
    types: activeforms,
    count: activeforms.length,
    quality: activeforms.length > 2 ? 'Хорошо развиты' : activeforms.length > 0 ? 'Базовые' : 'Отсутствуют'
  };
}

/**
 * Анализ электронной коммерции
 */
function analyzeEcommerce(html, structure) {
  const ecommerce = {
    shoppingCart: html.includes('cart') || html.includes('корзина'),
    wishlist: html.includes('wishlist') || html.includes('избранное'),
    productFilters: html.includes('filter') || html.includes('фильтр'),
    searchFunction: html.includes('search') || html.includes('поиск'),
    paymentMethods: analyzePaymentMethods(html),
    deliveryOptions: analyzeDeliveryOptions(html)
  };
  
  const activeFeatures = Object.entries(ecommerce)
    .filter(([feature, active]) => typeof active === 'boolean' ? active : Object.keys(active).length > 0)
    .length;
  
  return {
    ...ecommerce,
    maturity: activeFeatures > 4 ? 'Зрелая' : activeFeatures > 2 ? 'Развивающаяся' : 'Базовая'
  };
}

/**
 * Анализ способов оплаты
 */
function analyzePaymentMethods(html) {
  const methods = {
    cards: html.includes('visa') || html.includes('mastercard') || html.includes('карт'),
    electronic: html.includes('paypal') || html.includes('webmoney') || html.includes('яндекс.деньги'),
    cash: html.includes('наличными') || html.includes('при получении'),
    banking: html.includes('банковский перевод') || html.includes('счет'),
    crypto: html.includes('bitcoin') || html.includes('криптовалют')
  };
  
  return Object.entries(methods).filter(([method, active]) => active).map(([method]) => method);
}

/**
 * Анализ вариантов доставки
 */
function analyzeDeliveryOptions(html) {
  const options = {
    courier: html.includes('курьер') || html.includes('courier'),
    pickup: html.includes('самовывоз') || html.includes('pickup'),
    post: html.includes('почта') || html.includes('post'),
    express: html.includes('экспресс') || html.includes('express'),
    free: html.includes('бесплатная доставка') || html.includes('free delivery')
  };
  
  return Object.entries(options).filter(([option, active]) => active).map(([option]) => option);
}

/**
 * Анализ пользовательского опыта
 */
function analyzeUserExperience(html) {
  return {
    mobileOptimized: html.includes('viewport') && html.includes('responsive'),
    fastLoading: html.includes('defer') || html.includes('async') || html.includes('lazy'),
    accessibility: html.includes('alt=') && html.includes('aria-'),
    multilingual: html.includes('lang=') && (html.match(/lang=/g) || []).length > 1,
    ssl: true // Предполагаем, что современные сайты используют HTTPS
  };
}

/**
 * Анализ сигналов доверия
 */
function analyzeTrustSignals(html, structure) {
  const content = structure.mainContent.toLowerCase();
  
  return {
    reviews: content.includes('отзыв') || content.includes('review'),
    certificates: content.includes('сертификат') || content.includes('лицензия'),
    guarantees: content.includes('гарантия') || content.includes('guarantee'),
    security: html.includes('ssl') || content.includes('безопасность'),
    contacts: content.includes('телефон') || content.includes('адрес') || content.includes('email'),
    aboutCompany: structure.navigation.some(nav => nav.text.toLowerCase().includes('о нас')) ||
                  structure.navigation.some(nav => nav.text.toLowerCase().includes('about'))
  };
}

/**
 * НОВАЯ: Генерация расширенного отчета анализа сайта
 */
function generateAdvancedAnalysisReport(structure, businessAnalysis, businessDetails, seoMarketing, conversionElements, url) {
  SmartLogger.analyze('Генерирую расширенный отчет анализа сайта');
  
  const domain = url.replace(/^https?:\/\//, '').replace(/\/.*/, '');
  
  const report = `## 🔍 Профессиональный анализ сайта ${domain}

### 📌 Основная информация:
- **Название сайта:** ${structure.title || 'Не определено'}
- **Тип бизнеса:** ${businessAnalysis.businessType}
- **Целевая аудитория:** ${businessAnalysis.targetAudience}
- **Описание:** ${structure.description || 'Описание не найдено'}

### 💼 Бизнес-анализ:

#### 💰 Ценовая политика:
${businessDetails.pricing.hasPricing 
  ? `- **Диапазон цен:** ${businessDetails.pricing.priceRange}
- **Средняя цена:** ${businessDetails.pricing.averagePrice}
- **Стратегия:** ${businessDetails.pricing.strategy}
- **Найдено цен:** ${businessDetails.pricing.totalPricesFound}`
  : `- **Статус:** ${businessDetails.pricing.strategy}
- **Примечание:** ${businessDetails.pricing.note || 'Цены требуют запроса'}`}

#### 🎯 Уникальное торговое предложение:
- **Сила УТП:** ${businessDetails.uniqueSellingProposition.strength}
${businessDetails.uniqueSellingProposition.found.length > 0 
  ? businessDetails.uniqueSellingProposition.found.map(usp => `- "${usp}"`).join('\n')
  : '- УТП не выявлено или требует усиления'}

#### 📦 Товарный ассортимент:
- **Разнообразие:** ${businessDetails.productRange.diversity}
- **Категории (${businessDetails.productRange.categoriesCount}):** ${businessDetails.productRange.categories.join(', ') || 'Не определены'}
${businessDetails.productRange.productTypes.length > 0 
  ? `- **Типы товаров:** ${businessDetails.productRange.productTypes.join(', ')}`
  : ''}

#### 🏆 Конкурентные преимущества:
${businessDetails.competitiveAdvantages.length > 0 
  ? businessDetails.competitiveAdvantages.map(adv => `- ${adv}`).join('\n')
  : '- Конкурентные преимущества не выявлены'}

### 🔍 SEO и маркетинг:

#### 📈 Поисковая оптимизация:
- **Title тег:** ${seoMarketing.seo.metaTags.title.quality} (${seoMarketing.seo.metaTags.title.length} символов)
- **Meta Description:** ${seoMarketing.seo.metaTags.description.quality} (${seoMarketing.seo.metaTags.description.length} символов)
- **Структура заголовков:** ${seoMarketing.seo.headings.structure}
  - H1: ${seoMarketing.seo.headings.h1.count} (${seoMarketing.seo.headings.h1.quality})
  - H2: ${seoMarketing.seo.headings.h2.count}
  - H3: ${seoMarketing.seo.headings.h3.count}
- **Структурированные данные:** ${seoMarketing.seo.structuredData ? 'Есть' : 'Отсутствуют'}

#### 📱 Социальные сети:
${seoMarketing.socialMedia.platforms.length > 0 
  ? `- **Платформы:** ${seoMarketing.socialMedia.platforms.join(', ')}
- **Open Graph:** ${seoMarketing.socialMedia.integration.openGraph ? 'Настроен' : 'Отсутствует'}
- **Кнопки "Поделиться":** ${seoMarketing.socialMedia.sharing ? 'Есть' : 'Нет'}`
  : '- Интеграция с социальными сетями не обнаружена'}

#### 📊 Аналитика:
- **Google Analytics:** ${seoMarketing.analytics.googleAnalytics ? 'Установлен' : 'Не найден'}
- **Яндекс.Метрика:** ${seoMarketing.analytics.yandexMetrica ? 'Установлена' : 'Не найдена'}
${Object.keys(seoMarketing.analytics.pixels).some(key => seoMarketing.analytics.pixels[key])
  ? `- **Пиксели:** ${Object.entries(seoMarketing.analytics.pixels).filter(([k,v]) => v).map(([k,v]) => k).join(', ')}`
  : ''}
- **Тепловые карты:** ${seoMarketing.analytics.heatmaps ? 'Используются' : 'Не обнаружены'}

#### 📝 Контент-маркетинг:
- **Стратегия:** ${seoMarketing.contentMarketing.strategy}
- **Качество контента:** ${seoMarketing.contentMarketing.contentQuality}
${seoMarketing.contentMarketing.types.length > 0 
  ? `- **Типы контента:** ${seoMarketing.contentMarketing.types.join(', ')}`
  : ''}

### 🎯 Конверсионные элементы:

#### 📞 Формы и связь:
- **Качество форм:** ${conversionElements.contactForms.quality}
- **Количество:** ${conversionElements.contactForms.count}
${conversionElements.contactForms.types.length > 0 
  ? `- **Типы:** ${conversionElements.contactForms.types.join(', ')}`
  : ''}

#### 🛒 Электронная коммерция:
- **Зрелость платформы:** ${conversionElements.ecommerce.maturity}
- **Корзина:** ${conversionElements.ecommerce.shoppingCart ? 'Есть' : 'Нет'}
- **Поиск:** ${conversionElements.ecommerce.searchFunction ? 'Есть' : 'Нет'}
- **Фильтры:** ${conversionElements.ecommerce.productFilters ? 'Есть' : 'Нет'}
${conversionElements.ecommerce.paymentMethods.length > 0 
  ? `- **Способы оплаты:** ${conversionElements.ecommerce.paymentMethods.join(', ')}`
  : ''}
${conversionElements.ecommerce.deliveryOptions.length > 0 
  ? `- **Доставка:** ${conversionElements.ecommerce.deliveryOptions.join(', ')}`
  : ''}

#### 👤 Пользовательский опыт:
- **Мобильная оптимизация:** ${conversionElements.userExperience.mobileOptimized ? 'Да' : 'Требует улучшения'}
- **Быстрая загрузка:** ${conversionElements.userExperience.fastLoading ? 'Оптимизирована' : 'Может быть улучшена'}
- **Доступность:** ${conversionElements.userExperience.accessibility ? 'Хорошая' : 'Требует внимания'}
- **Многоязычность:** ${conversionElements.userExperience.multilingual ? 'Есть' : 'Нет'}

#### 🛡️ Сигналы доверия:
${Object.entries(conversionElements.trustSignals).filter(([k,v]) => v).length > 0
  ? Object.entries(conversionElements.trustSignals)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const labels = {
          reviews: 'Отзывы клиентов',
          certificates: 'Сертификаты/лицензии',
          guarantees: 'Гарантии',
          security: 'Безопасность',
          contacts: 'Контактная информация',
          aboutCompany: 'Информация о компании'
        };
        return `- ${labels[key] || key}`;
      }).join('\n')
  : '- Сигналы доверия требуют усиления'}

### 🗂️ Структура сайта:
**Основные разделы:** ${structure.navigation.map(nav => nav.text).join(', ') || 'Навигация не найдена'}

### 🛠️ Техническая информация:
- **Платформа:** ${structure.technicalInfo.platform}
- **Адаптивный дизайн:** ${structure.technicalInfo.responsive ? 'Да' : 'Не определено'}
- **JavaScript:** ${structure.technicalInfo.hasJavaScript ? 'Используется' : 'Не обнаружен'}

### 📊 Итоговые рекомендации:
${generateAdvancedRecommendations(businessDetails, seoMarketing, conversionElements)}

---
*Профессиональный анализ выполнен системой BOOOMERANGS AI*`;

  return report;
}

/**
 * Генерация продвинутых рекомендаций
 */
function generateAdvancedRecommendations(businessDetails, seoMarketing, conversionElements) {
  const recommendations = [];
  
  // Рекомендации по ценообразованию
  if (!businessDetails.pricing.hasPricing) {
    recommendations.push('💰 Добавить прозрачное ценообразование для увеличения конверсии');
  }
  
  // Рекомендации по УТП
  if (businessDetails.uniqueSellingProposition.strength === 'Слабое') {
    recommendations.push('🎯 Усилить уникальное торговое предложение и разместить на главной странице');
  }
  
  // SEO рекомендации
  if (seoMarketing.seo.metaTags.title.quality === 'Требует улучшения') {
    recommendations.push('📈 Оптимизировать title теги (30-60 символов)');
  }
  if (seoMarketing.seo.metaTags.description.quality === 'Требует улучшения') {
    recommendations.push('📝 Улучшить meta descriptions (120-160 символов)');
  }
  
  // Рекомендации по аналитике
  if (!seoMarketing.analytics.googleAnalytics && !seoMarketing.analytics.yandexMetrica) {
    recommendations.push('📊 Установить систему веб-аналитики для отслеживания результатов');
  }
  
  // Рекомендации по конверсии
  if (conversionElements.contactForms.count === 0) {
    recommendations.push('📞 Добавить формы обратной связи для увеличения лидов');
  }
  
  // Рекомендации по доверию
  const trustCount = Object.values(conversionElements.trustSignals).filter(Boolean).length;
  if (trustCount < 3) {
    recommendations.push('🛡️ Усилить сигналы доверия (отзывы, гарантии, сертификаты)');
  }
  
  // Мобильная оптимизация
  if (!conversionElements.userExperience.mobileOptimized) {
    recommendations.push('📱 Улучшить мобильную версию сайта');
  }
  
  return recommendations.length > 0 
    ? recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')
    : 'Сайт показывает хорошие результаты по основным критериям.';
}

module.exports = {
  analyzeWebsite,
  detectWebsiteAnalysisIntent,
  extractUrlFromQuery,
  isValidUrl,
  analyzeBusinessDetails,
  analyzeSEOAndMarketing,
  analyzeConversionElements
};