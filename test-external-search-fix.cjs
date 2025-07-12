/**
 * Тест исправления внешнего поиска для знаниевых запросов
 */

async function testExternalSearchFix() {
  console.log('🔍 ТЕСТ ИСПРАВЛЕНИЯ ВНЕШНЕГО ПОИСКА');
  console.log('==========================================');
  
  try {
    // Загружаем исправленный semantic-integration-layer
    const semanticIntegration = require('./server/semantic-integration-layer.cjs');
    
    // Тестируем детектор знаниевых запросов напрямую
    const testDetector = (query) => {
      const lowerInput = query.toLowerCase();
      
      // Ключевые слова для знаниевых запросов
      const knowledgeKeywords = [
        'расскажи', 'что такое', 'объясни', 'как работает', 'что знаешь о',
        'почему', 'где', 'когда', 'кто', 'какой', 'расскажите', 'опиши',
        'что это', 'как это', 'зачем', 'для чего', 'история', 'происхождение'
      ];
      
      // Предметные области
      const knowledgeDomains = [
        'планет', 'марс', 'юпитер', 'земля', 'космос', 'астрономия',
        'медицин', 'наука', 'физика', 'химия', 'биология', 'математика',
        'история', 'география', 'технология', 'компьютер', 'программирование',
        'искусство', 'культура', 'литература', 'философия', 'религия',
        'политика', 'экономика', 'общество', 'психология', 'социология',
        'погода', 'температура', 'климат', 'москва', 'россия'
      ];
      
      const hasKnowledgeKeywords = knowledgeKeywords.some(keyword => 
        lowerInput.includes(keyword)
      );
      
      const hasKnowledgeDomains = knowledgeDomains.some(domain => 
        lowerInput.includes(domain)
      );
      
      const isQuestion = lowerInput.includes('?') || 
                        lowerInput.startsWith('что') ||
                        lowerInput.startsWith('как') ||
                        lowerInput.startsWith('где') ||
                        lowerInput.startsWith('когда') ||
                        lowerInput.startsWith('почему') ||
                        lowerInput.startsWith('зачем') ||
                        lowerInput.startsWith('какая');
      
      return hasKnowledgeKeywords || hasKnowledgeDomains || isQuestion;
    };
    
    // Тестируем знаниевые запросы
    const testQueries = [
      'Расскажи про планету Марс',
      'Какая погода в Москве?',
      'Что такое активированный уголь?',
      'Привет, как дела?',  // не должен активировать поиск
      'Создай картинку кота' // не должен активировать поиск
    ];
    
    for (const query of testQueries) {
      console.log(`\n📝 Тестируем: "${query}"`);
      
      // Проверяем детектор знаниевых запросов
      const isKnowledgeRequest = testDetector(query);
      console.log(`🔍 Знаниевый запрос: ${isKnowledgeRequest ? '✅ ДА' : '❌ НЕТ'}`);
      
      if (isKnowledgeRequest) {
        // Тестируем семантический анализ с внешним поиском
        try {
          const result = await semanticIntegration.analyzeWithSemantics(query, {
            sessionId: 'test-session',
            language: 'ru'
          });
          
          console.log(`🎯 Причина: ${result.reason}`);
          console.log(`📊 Уверенность: ${result.confidence}`);
          
          if (result.semanticResult && result.semanticResult.externalKnowledge) {
            console.log(`✅ Внешний поиск активирован: ${result.semanticResult.externalKnowledge.length} результатов`);
          } else {
            console.log(`⚠️ Внешний поиск НЕ активирован`);
          }
        } catch (error) {
          console.log(`❌ Ошибка анализа: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 ТЕСТ ЗАВЕРШЕН');
    
  } catch (error) {
    console.error('❌ Ошибка теста:', error.message);
  }
}

// Запуск теста
testExternalSearchFix();