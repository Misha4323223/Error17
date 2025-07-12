/**
 * Тест нового точного анализатора сайтов
 * Проверяем работу с реальным сайтом booomerangs.ru
 */

const websiteAnalyzer = require('./server/accurate-website-analyzer.cjs');

async function testWebsiteAnalyzer() {
  console.log('🧪 === ТЕСТИРОВАНИЕ ТОЧНОГО АНАЛИЗАТОРА САЙТОВ ===\n');

  const testQueries = [
    'проанализируй сайт https://booomerangs.ru',
    'анализ сайта booomerangs.ru',
    'изучи сайт https://booomerangs.ru',
    'что на сайте https://booomerangs.ru'
  ];

  for (const query of testQueries) {
    console.log(`\n📝 Тестирую запрос: "${query}"`);
    console.log('=' .repeat(60));

    try {
      // Тест детекции намерений
      const detection = websiteAnalyzer.detectWebsiteAnalysisIntent(query);
      console.log(`🔍 Детекция намерений:`, {
        isWebsiteAnalysis: detection.isWebsiteAnalysis,
        confidence: detection.confidence + '%',
        hasUrl: detection.hasUrl,
        hasAnalysisKeywords: detection.hasAnalysisKeywords
      });

      if (detection.isWebsiteAnalysis) {
        // Тест извлечения URL
        const extractedUrl = websiteAnalyzer.extractUrlFromQuery(query);
        console.log(`🌐 Извлеченный URL: ${extractedUrl}`);

        // Полный анализ сайта
        console.log(`🚀 Запускаю полный анализ сайта...`);
        const result = await websiteAnalyzer.analyzeWebsite(query);

        if (result.success) {
          console.log(`✅ Анализ успешен!`);
          console.log(`📊 Тип бизнеса: ${result.businessAnalysis?.businessType}`);
          console.log(`🎯 Целевая аудитория: ${result.businessAnalysis?.targetAudience}`);
          console.log(`🔧 Функции: ${result.businessAnalysis?.features?.join(', ')}`);
          console.log(`\n📄 ОТЧЕТ:\n${result.response.substring(0, 300)}...`);
        } else {
          console.log(`❌ Ошибка анализа: ${result.error}`);
        }
      } else {
        console.log(`⚠️ Запрос не распознан как анализ сайта`);
      }

    } catch (error) {
      console.error(`💥 Ошибка при тестировании: ${error.message}`);
    }

    console.log('\n' + '─'.repeat(60));
  }

  console.log('\n🏁 === ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
}

// Запускаем тест только если файл вызван напрямую
if (require.main === module) {
  testWebsiteAnalyzer().catch(console.error);
}

module.exports = { testWebsiteAnalyzer };