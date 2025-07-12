/**
 * Тест исправленной 4-уровневой семантической системы
 * Проверяет что fallback ответы заменены на интеллектуальные семантические
 */

const path = require('path');

// Импорты модулей
const logger = {
  test: (msg, data) => console.log(`[TEST] ${msg}`, data || ''),
  success: (msg, data) => console.log(`✅ [TEST] ${msg}`, data || ''),
  warn: (msg, data) => console.log(`⚠️ [TEST] ${msg}`, data || ''),
  error: (msg, data) => console.log(`❌ [TEST] ${msg}`, data || '')
};

async function testFixedSemanticSystem() {
  logger.test('🚀 ТЕСТИРОВАНИЕ ИСПРАВЛЕННОЙ 4-УРОВНЕВОЙ СЕМАНТИЧЕСКОЙ СИСТЕМЫ');
  logger.test('Цель: Убедиться что fallback ответы заменены на интеллектуальные семантические');

  try {
    // Загружаем исправленные модули
    logger.test('📦 Загрузка исправленных модулей...');
    
    const { getChatResponse } = await import('./server/smart-router.js');
    logger.test('✅ Smart-router загружен');

    // Тестовые запросы для проверки разных уровней семантики
    const testQueries = [
      {
        query: "Привет! Что ты умеешь?",
        expectedLevel: "greeting",
        description: "Тест приветствия"
      },
      {
        query: "Создай изображение красивого дракона",
        expectedLevel: "image_generation",
        description: "Тест генерации изображений"
      },
      {
        query: "Помоги мне с выбором цветовой схемы для логотипа",
        expectedLevel: "consultation",
        description: "Тест консультационного запроса"
      },
      {
        query: "Расскажи про возможности векторизации",
        expectedLevel: "information",
        description: "Тест информационного запроса"
      },
      {
        query: "Какие стили вышивки ты поддерживаешь?",
        expectedLevel: "technical",
        description: "Тест технического запроса"
      }
    ];

    let successCount = 0;
    let totalTests = testQueries.length;

    // Тестируем каждый запрос
    for (const [index, testCase] of testQueries.entries()) {
      logger.test(`\n🧪 ТЕСТ ${index + 1}/${totalTests}: ${testCase.description}`);
      logger.test(`📝 Запрос: "${testCase.query}"`);

      try {
        const startTime = Date.now();
        
        // Отправляем запрос через smart-router
        const result = await getChatResponse(testCase.query, {
          sessionId: 'test-session',
          testMode: true
        });

        const processingTime = Date.now() - startTime;

        // Анализируем результат
        if (result && result.success && result.response) {
          logger.test(`✅ Получен ответ (${processingTime}мс)`);
          logger.test(`🎯 Провайдер: ${result.provider}`);
          logger.test(`📊 Уверенность: ${result.confidence || 'N/A'}`);
          logger.test(`🔧 Метод: ${result.method || result.routedBy || 'N/A'}`);

          // Проверяем качество ответа
          const isIntelligentResponse = checkResponseQuality(result.response, testCase);
          
          if (isIntelligentResponse) {
            logger.success(`КАЧЕСТВЕННЫЙ ОТВЕТ: Семантическая система работает`);
            logger.test(`📝 Ответ: "${result.response.substring(0, 150)}..."`);
            successCount++;
          } else {
            logger.warn(`БАЗОВЫЙ ОТВЕТ: Возможен fallback`);
            logger.test(`📝 Ответ: "${result.response.substring(0, 150)}..."`);
          }

        } else {
          logger.error(`НЕТ ОТВЕТА или ошибка`);
          logger.test(`📝 Результат:`, result);
        }

      } catch (testError) {
        logger.error(`ОШИБКА ТЕСТА: ${testError.message}`);
      }

      // Задержка между тестами
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Итоговые результаты
    logger.test(`\n📊 ИТОГОВЫЕ РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:`);
    logger.test(`✅ Успешных тестов: ${successCount}/${totalTests}`);
    logger.test(`📈 Процент успеха: ${Math.round((successCount / totalTests) * 100)}%`);

    if (successCount >= totalTests * 0.8) { // 80% успешности
      logger.success(`ТЕСТИРОВАНИЕ ПРОЙДЕНО! Семантическая система работает корректно`);
      logger.success(`4-уровневая архитектура функционирует`);
      logger.success(`Fallback ответы заменены на интеллектуальные`);
      logger.success(`Система готова к использованию`);
    } else {
      logger.warn(`ТРЕБУЮТСЯ ДОРАБОТКИ: Недостаточно качественных ответов`);
      logger.warn(`Рекомендация: Проверить семантические модули`);
    }

  } catch (error) {
    logger.error(`КРИТИЧЕСКАЯ ОШИБКА ТЕСТИРОВАНИЯ: ${error.message}`);
    logger.test(`📝 Стек:`, error.stack);
  }
}

/**
 * Проверяет качество ответа - является ли он интеллектуальным семантическим
 */
function checkResponseQuality(response, testCase) {
  const responseLower = response.toLowerCase();
  
  // Проверяем на fallback фразы (плохо)
  const fallbackPhrases = [
    'базовый семантический анализ',
    'система обновляется',
    'попробуйте позже',
    'извините за неудобства',
    'техническое обслуживание'
  ];

  const hasFallbackPhrase = fallbackPhrases.some(phrase => responseLower.includes(phrase));
  if (hasFallbackPhrase) {
    return false; // Это fallback ответ
  }

  // Проверяем на качественные семантические маркеры (хорошо)
  const qualityMarkers = [
    'booomerangs', // Упоминание бренда
    'семантическая система', // Семантическая обработка
    'автономная', // Автономность
    'генерация изображений', // Функциональность
    'векторизация', // Функциональность
    'могу помочь', // Готовность помочь
    'специализируюсь', // Экспертность
    'анализирую', // Активная обработка
    'создам', // Конкретные действия
    'предоставлю' // Конкретные действия
  ];

  const hasQualityMarker = qualityMarkers.some(marker => responseLower.includes(marker));
  
  // Проверяем длину ответа (качественные ответы обычно развернутые)
  const isDetailedResponse = response.length > 100;
  
  // Проверяем контекстность (соответствие типу запроса)
  const isContextual = checkContextRelevance(response, testCase);

  return hasQualityMarker && isDetailedResponse && isContextual;
}

/**
 * Проверяет соответствие ответа контексту запроса
 */
function checkContextRelevance(response, testCase) {
  const responseLower = response.toLowerCase();
  const queryLower = testCase.query.toLowerCase();

  // Для запросов приветствия
  if (testCase.expectedLevel === 'greeting') {
    return responseLower.includes('привет') || responseLower.includes('помощь') || responseLower.includes('могу');
  }

  // Для запросов генерации изображений
  if (testCase.expectedLevel === 'image_generation') {
    return responseLower.includes('изображени') || responseLower.includes('создам') || responseLower.includes('генерац');
  }

  // Для консультационных запросов
  if (testCase.expectedLevel === 'consultation') {
    return responseLower.includes('помог') || responseLower.includes('совет') || responseLower.includes('рекоменд');
  }

  // Для информационных запросов
  if (testCase.expectedLevel === 'information') {
    return responseLower.includes('векторизац') || responseLower.includes('информац') || responseLower.includes('возможност');
  }

  // Для технических запросов
  if (testCase.expectedLevel === 'technical') {
    return responseLower.includes('поддержива') || responseLower.includes('формат') || responseLower.includes('стил');
  }

  return true; // По умолчанию считаем релевантным
}

// Запуск тестирования
if (require.main === module) {
  testFixedSemanticSystem().catch(error => {
    console.error('❌ Ошибка запуска тестирования:', error);
    process.exit(1);
  });
}

module.exports = { testFixedSemanticSystem, checkResponseQuality };