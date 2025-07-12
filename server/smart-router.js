/**
 * Интеллектуальный маршрутизатор сообщений к наиболее подходящим провайдерам
 * Анализирует сообщение и направляет его к специализированным провайдерам
 */

import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const router = express.Router();

// Система логирования
const SmartLogger = {
  route: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🎯 [${timestamp}] SMART ROUTER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  provider: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`🤖 [${timestamp}] PROVIDER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  success: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] SUCCESS: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] ERROR: ${message}`, error);
  }
};

// Динамическое расширение для провайдеров с асинхронной загрузкой
const ProviderLoader = {
  providers: new Map(),
  
  // Асинхронная загрузка провайдера (поддерживает и ES модули и CommonJS)
  async loadProvider(name, path) {
    try {
      if (!this.providers.has(name)) {
        let provider;
        
        // Пытаемся загрузить как ES модуль
        try {
          const module = await import(path);
          provider = module.default || module;
        } catch (esError) {
          // Если ES модуль не удался, пытаемся как CommonJS
          try {
            provider = require(path);
          } catch (cjsError) {
            throw new Error(`Не удалось загрузить как ES или CommonJS: ${esError.message}`);
          }
        }
        
        this.providers.set(name, provider);
        SmartLogger.route(`✅ Провайдер ${name} загружен`);
        return provider;
      }
      return this.providers.get(name);
    } catch (error) {
      SmartLogger.route(`⚠️ Провайдер ${name} недоступен: ${error.message}`);
      return null;
    }
  },
  
  // Синхронная загрузка провайдера (только CommonJS)
  loadProviderSync(name, path) {
    try {
      if (!this.providers.has(name)) {
        const provider = require(path);
        this.providers.set(name, provider);
        SmartLogger.route(`✅ Провайдер ${name} загружен (sync)`);
        return provider;
      }
      return this.providers.get(name);
    } catch (error) {
      SmartLogger.route(`⚠️ Провайдер ${name} недоступен: ${error.message}`);
      return null;
    }
  },
  
  // Получение всех доступных провайдеров
  getAvailableProviders() {
    return Array.from(this.providers.values()).filter(provider => provider !== null);
  },
  
  // Расширение новыми провайдерами в runtime
  extend(name, provider) {
    this.providers.set(name, provider);
    SmartLogger.route(`🔧 Провайдер ${name} добавлен через расширение`);
  }
};

// Глобальные переменные для провайдеров
let conversationEngineSemanticProvider = null;
let chatFreeProvider = null;
// deepspeekProvider удален из системы
let claudeProvider = null;
let deepInfraProvider = null;
let webSearchProvider = null;
let chatMemory = null;
let intelligentProcessor = null;
let globalHealthChecker = null;

// Функция асинхронной инициализации провайдеров
async function initializeProviders() {
  SmartLogger.route('🚀 Начинаем динамическую инициализацию провайдеров...');
  
  // Синхронная загрузка CommonJS провайдеров
  conversationEngineSemanticProvider = ProviderLoader.loadProviderSync('semantic', './conversation-engine-semantic-provider.cjs');
  intelligentProcessor = ProviderLoader.loadProviderSync('processor', './intelligent-chat-processor.cjs');
  
  // Асинхронная загрузка ES модулей
  chatMemory = await ProviderLoader.loadProvider('memory', './chat-memory.js');
  
  // Асинхронная загрузка остальных провайдеров
  chatFreeProvider = await ProviderLoader.loadProvider('chatfree', './chatfree-provider.js');
  deepspeekProvider = await ProviderLoader.loadProvider('deepspeek', './deepspeek-provider.js');
  claudeProvider = await ProviderLoader.loadProvider('claude', './claude-provider.js');
  deepInfraProvider = await ProviderLoader.loadProvider('deepinfra', './deepinfra-provider.js');
  webSearchProvider = await ProviderLoader.loadProvider('websearch', './web-search-provider.js');
  
  // Загрузка семантических модулей
  const healthModule = ProviderLoader.loadProviderSync('healthcheck', './semantic-healthcheck.cjs');
  globalHealthChecker = healthModule?.globalHealthChecker;
  
  SmartLogger.route('✅ Инициализация провайдеров завершена');
}

// Запускаем инициализацию асинхронно
initializeProviders().catch(error => {
  SmartLogger.error('Ошибка инициализации провайдеров:', error);
});

// Выполняем ленивую регистрацию модулей после импорта для избежания циклических зависимостей
setTimeout(() => {
  try {
    if (globalHealthChecker && globalHealthChecker.registerBasicModules) {
      globalHealthChecker.registerBasicModules();
      SmartLogger.route('✅ Ленивая регистрация модулей для мониторинга выполнена');
    }
  } catch (error) {
    SmartLogger.error('Ошибка ленивой регистрации модулей:', error);
  }
}, 100); // Небольшая задержка для завершения всех импортов

// Динамическое получение провайдеров
function getActiveProviders() {
  const providers = [];
  
  // Добавляем семантический провайдер с высоким приоритетом
  if (conversationEngineSemanticProvider) {
    providers.push({
      name: 'ConversationEngine-Semantic',
      priority: 100,
      canHandle: conversationEngineSemanticProvider.canHandle?.bind(conversationEngineSemanticProvider) || (() => true),
      processRequest: conversationEngineSemanticProvider.processRequest?.bind(conversationEngineSemanticProvider) || (() => Promise.resolve({ response: 'Провайдер недоступен' }))
    });
  }
  
  // Добавляем интеллектуальный процессор как провайдер
  if (intelligentProcessor) {
    providers.push({
      name: 'Intelligent-Processor',
      priority: 90,
      canHandle: () => true,
      processRequest: async (query, options) => {
        try {
          const result = await intelligentProcessor.analyzeUserIntent(query, options);
          return { 
            response: result.response || 'Интеллектуальный процессор обработал запрос',
            confidence: result.confidence || 75,
            provider: 'Intelligent-Processor',
            success: true
          };
        } catch (error) {
          return { response: 'Ошибка интеллектуального процессора', confidence: 30, success: false };
        }
      }
    });
  }
  
  // Добавляем чат-память как провайдер
  if (chatMemory) {
    providers.push({
      name: 'Chat-Memory',
      priority: 85,
      canHandle: () => true,
      processRequest: async (query, options) => {
        try {
          const response = await chatMemory.processMessage?.(query, options) || 'Память чата доступна';
          return { response, confidence: 70, provider: 'Chat-Memory', success: true };
        } catch (error) {
          return { response: 'Ошибка памяти чата', confidence: 25, success: false };
        }
      }
    });
  }
  
  // Добавляем другие провайдеры по мере их доступности
  if (chatFreeProvider) {
    providers.push({
      name: 'ChatFree',
      priority: 80,
      canHandle: () => true,
      processRequest: chatFreeProvider.processRequest?.bind(chatFreeProvider) || (() => Promise.resolve({ response: 'ChatFree недоступен', success: false }))
    });
  }
  
  if (deepspeekProvider) {
    providers.push({
      name: 'DeepSeek',
      priority: 75,
      canHandle: () => true,
      processRequest: deepspeekProvider.processRequest?.bind(deepspeekProvider) || (() => Promise.resolve({ response: 'DeepSeek недоступен', success: false }))
    });
  }
  
  if (claudeProvider) {
    providers.push({
      name: 'Claude',
      priority: 70,
      canHandle: () => true,
      processRequest: claudeProvider.processRequest?.bind(claudeProvider) || (() => Promise.resolve({ response: 'Claude недоступен', success: false }))
    });
  }
  
  if (webSearchProvider) {
    providers.push({
      name: 'WebSearch',
      priority: 60,
      canHandle: (query) => query.includes('найди') || query.includes('поиск') || query.includes('расскажи'),
      processRequest: webSearchProvider.processRequest?.bind(webSearchProvider) || (() => Promise.resolve({ response: 'Веб-поиск недоступен', success: false }))
    });
  }
  
  // Сортируем по приоритету (высокий приоритет первым)
  providers.sort((a, b) => b.priority - a.priority);
  
  return providers;
}

/**
 * УЛУЧШЕННЫЙ AI МАРШРУТИЗАТОР с routing hints
 * Обрабатывает запросы с учетом semantic router рекомендаций
 */
async function getAIResponseWithSearch(userQuery, options = {}) {
  try {
    SmartLogger.route(`🤖 Обработка запроса через smart-router`);
    SmartLogger.route(`📝 Запрос: "${userQuery.substring(0, 100)}..."`);

    // Извлекаем routing hints из options
    const routingHints = options.routingHints || null;
    if (routingHints) {
      SmartLogger.route(`🎯 Получены routing hints:`, {
        complexity: routingHints.complexity,
        mode: routingHints.mode,
        preferredProviders: routingHints.preferredProviders,
        timeLimit: routingHints.timeLimit,
        useNeural: routingHints.useNeural
      });
    }

    // Адаптивные таймауты на основе routing hints
    const baseTimeout = routingHints?.timeLimit || 10000;
    const adaptiveTimeout = Math.max(1000, Math.min(baseTimeout, 60000)); // 1с - 60с
    
    SmartLogger.route(`⏰ Адаптивный таймаут: ${adaptiveTimeout}мс`);

    // Ждем инициализации провайдеров если они еще не готовы
    let retryCount = 0;
    while (!conversationEngineSemanticProvider && retryCount < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retryCount++;
    }

    // Проверяем здоровье системы
    let healthStatus = { status: 'unknown', summary: { healthy: 0, total: 0 } };
    try {
      if (globalHealthChecker && globalHealthChecker.checkSystemHealth) {
        healthStatus = globalHealthChecker.checkSystemHealth();
        SmartLogger.route(`💊 Здоровье системы: ${healthStatus.status}`);
      }
    } catch (healthError) {
      SmartLogger.route(`⚠️ Healthcheck недоступен: ${healthError.message}`);
    }

    // ===== ОПТИМИЗИРОВАННАЯ МАРШРУТИЗАЦИЯ С ROUTING HINTS =====
    SmartLogger.route(`🎯 Оптимизированная маршрутизация с routing hints`);
    
    // Получаем активные провайдеры динамически
    let providers = getActiveProviders();
    SmartLogger.route(`📋 Доступно провайдеров: ${providers.length}`);
    
    // Оптимизация выбора провайдеров на основе routing hints
    if (routingHints) {
      // Фильтрация по предпочтительным провайдерам
      if (routingHints.preferredProviders && routingHints.preferredProviders.length > 0) {
        const preferredProviders = providers.filter(p => 
          routingHints.preferredProviders.includes(p.name)
        );
        
        if (preferredProviders.length > 0) {
          providers = preferredProviders;
          SmartLogger.route(`🎯 Отфильтровано до предпочтительных провайдеров: ${providers.map(p => p.name).join(', ')}`);
        }
      }
      
      // Исключение провайдеров из skipProviders
      if (routingHints.skipProviders && routingHints.skipProviders.length > 0) {
        providers = providers.filter(p => 
          !routingHints.skipProviders.includes(p.name)
        );
        SmartLogger.route(`🎯 Исключены провайдеры: ${routingHints.skipProviders.join(', ')}`);
      }
      
      // Переупорядочивание по приоритету routing hints
      if (routingHints.mode === 'express') {
        // Для express режима - приоритет быстрым провайдерам
        providers.sort((a, b) => {
          const fastProviders = ['Chat-Memory', 'ChatFree'];
          const aFast = fastProviders.includes(a.name) ? 1 : 0;
          const bFast = fastProviders.includes(b.name) ? 1 : 0;
          return bFast - aFast;
        });
      } else if (routingHints.mode === 'expert') {
        // Для expert режима - приоритет мощным провайдерам
        providers.sort((a, b) => {
          const powerProviders = ['ConversationEngine-Semantic', 'Intelligent-Processor'];
          const aPower = powerProviders.includes(a.name) ? 1 : 0;
          const bPower = powerProviders.includes(b.name) ? 1 : 0;
          return bPower - aPower;
        });
      }
    }
    
    // Пробуем провайдеры с адаптивными таймаутами
    for (const provider of providers) {
      try {
        SmartLogger.route(`🔍 Проверяем провайдер: ${provider.name || provider.constructor.name}`);
        
        // Проверяем может ли провайдер обработать запрос
        const canHandle = provider.canHandle ? provider.canHandle(userQuery, options) : true;
        
        if (!canHandle) {
          SmartLogger.route(`⏭️ Провайдер ${provider.name} пропускает запрос`);
          continue;
        }

        // Пробуем обработать запрос с адаптивным таймаутом
        let result;
        const processPromise = provider.processRequest ? 
          provider.processRequest(userQuery, { ...options, routingHints }) :
          provider.getChatResponse ? 
          provider.getChatResponse(userQuery, { ...options, routingHints }) :
          null;

        if (!processPromise) {
          SmartLogger.route(`⚠️ Провайдер ${provider.name} не имеет методов обработки`);
          continue;
        }

        // Применяем адаптивный таймаут
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout ${adaptiveTimeout}мс`)), adaptiveTimeout)
        );

        result = await Promise.race([processPromise, timeoutPromise]);

        if (result && result.success && result.response) {
          SmartLogger.route(`✅ Провайдер ${provider.name || result.provider} успешно обработал запрос`);
          
          return {
            ...result,
            systemHealth: healthStatus.status,
            routedBy: 'smart-router',
            routingOptimized: true,
            adaptiveTimeout,
            routingHintsUsed: !!routingHints
          };
        }

      } catch (providerError) {
        if (providerError.message.includes('Timeout')) {
          SmartLogger.route(`⏰ Провайдер ${provider.name} превысил таймаут ${adaptiveTimeout}мс`);
        } else {
          SmartLogger.route(`⚠️ Ошибка провайдера ${provider.name}: ${providerError.message}`);
        }
        continue;
      }
    }

    // ===== FALLBACK С УЧЕТОМ ROUTING HINTS =====
    SmartLogger.route(`⚠️ Ни один провайдер не смог обработать запрос, используем адаптированный fallback`);
    
    // Адаптируем fallback ответ на основе routing hints
    let fallbackResponse;
    if (routingHints?.mode === 'express') {
      fallbackResponse = "Привет! Система обрабатывает ваш запрос в ускоренном режиме. Попробуйте переформулировать?";
    } else if (routingHints?.mode === 'expert') {
      fallbackResponse = "Система проводит глубокий анализ вашего запроса. Семантические модули временно недоступны, но я готов обсудить тему подробно!";
    } else if (routingHints?.specialCategory) {
      fallbackResponse = `Обнаружена специализированная категория "${routingHints.specialCategory}". Система обновляется, но готов помочь с этой темой!`;
    } else {
      fallbackResponse = "Привет! Я BOOOMERANGS AI. Сейчас система обновляется, но я готов помочь! В чем вопрос?";
    }
    
    return {
      success: true,
      response: fallbackResponse,
      provider: 'SmartRouter-Fallback',
      confidence: routingHints?.complexity ? Math.max(0.3, routingHints.complexity) : 0.5,
      quality: routingHints?.mode === 'expert' ? 7 : 6,
      systemHealth: healthStatus.status,
      routedBy: 'smart-router-fallback',
      routingOptimized: !!routingHints,
      metadata: {
        fallback: true,
        providersChecked: providers.length,
        availableProviders: ProviderLoader.getAvailableProviders().length,
        routingHints: routingHints ? {
          mode: routingHints.mode,
          complexity: routingHints.complexity,
          specialCategory: routingHints.specialCategory
        } : null
      }
    };

  } catch (error) {
    SmartLogger.error(`Ошибка smart-router: ${error.message}`);
    return { 
      success: false, 
      error: error.message,
      provider: 'SmartRouter-Error'
    };
  }
}

/**
 * Упрощенная интеграция веб-поиска и AI (старая версия для совместимости)
 */
async function getSmartResponse(userQuery) {
  SmartLogger.route(`🚀 Старый интерфейс getSmartResponse перенаправляет на новый маршрутизатор`);
  return await getAIResponseWithSearch(userQuery, {});
}

/**
 * Анализирует сообщение и определяет его тематику
 * @param {string} message - Сообщение пользователя
 * @returns {Object} Категория запроса и провайдеры
 */
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // Определяем категории запросов
  if (lowerMessage.includes('поиск') || lowerMessage.includes('найди') || lowerMessage.includes('расскажи про')) {
    return { category: 'search', confidence: 80 };
  }
  
  if (lowerMessage.includes('нарисуй') || lowerMessage.includes('создай изображение') || lowerMessage.includes('сгенерируй')) {
    return { category: 'image_generation', confidence: 85 };
  }
  
  if (lowerMessage.includes('векторизуй') || lowerMessage.includes('svg') || lowerMessage.includes('вектор')) {
    return { category: 'vectorization', confidence: 75 };
  }
  
  return { category: 'general_chat', confidence: 60 };
}

/**
 * Выбирает наиболее подходящего провайдера и получает ответ
 * @param {string} message - Сообщение пользователя
 * @param {Object} options - Дополнительные параметры
 * @returns {Promise<Object>} - Результат от провайдера
 */
async function routeMessage(message, options = {}) {
  SmartLogger.route(`🎯 routeMessage перенаправляет на новый smart-router`);
  return await getAIResponseWithSearch(message, options);
}

// ===== ЭКСПОРТЫ =====
export default router;

// Новый стандартизированный API
export { 
  getAIResponseWithSearch as getChatResponse,
  routeMessage,
  analyzeMessage,
  getSmartResponse,
  ProviderLoader,
  getActiveProviders
};

// Для совместимости со старым кодом
export const addProvider = (name, provider) => ProviderLoader.extend(name, provider);
export const getProviderInfo = () => ProviderLoader.getAvailableProviders().map(p => p.getInfo ? p.getInfo() : { name: p.name || 'Unknown' });
