/**
 * Диагностический тест для последнего провального случая
 * Проверяем какие именно тесты еще не проходят
 */

const { analyzeSemantics } = require('./server/semantic-memory/semantic-analyzer.cjs');
const { processRequest } = require('./server/semantic-memory/index.cjs');

async function testFailingCases() {
  console.log('🔍 ПОИСК ПОСЛЕДНЕГО ПРОВАЛЬНОГО ТЕСТА\n');
  
  // Полный список всех тестов
  const allTests = [
    "Расскажи про планету Земля",
    "Расскажи про планету Марс", 
    "Расскажи про экономику",
    "Расскажи про историю России",
    "Расскажи про биологию",
    "Расскажи про физику",
    "Расскажи про программирование",
    "Расскажи про космос",
    "Расскажи про гравитацию",
    "Расскажи про науку"
  ];
  
  let failed = 0;
  let passed = 0;
  
  for (const testQuery of allTests) {
    console.log(`🔍 ТЕСТ: "${testQuery}"`);
    
    try {
      // Семантический анализ
      const semanticResult = await analyzeSemantics(testQuery);
      
      // Проверяем корректность классификации
      const isKnowledgeRequest = semanticResult.semantic_cluster?.name === 'knowledge_request';
      const confidence = semanticResult.confidence;
      
      if (isKnowledgeRequest && confidence >= 80) {
        // Проверяем генерацию ответа
        const response = await processRequest(testQuery, {
          semanticAnalysis: semanticResult
        });
        
        // Проверяем качество ответа
        const responseText = response.response;
        const isContentful = responseText.length > 100;
        const hasTopicMention = responseText.toLowerCase().includes(
          testQuery.toLowerCase().replace('расскажи про ', '').replace('расскажи о ', '')
        );
        
        if (isContentful && hasTopicMention) {
          console.log(`✅ ПРОШЕЛ (${responseText.length} символов)`);
          passed++;
        } else {
          console.log(`❌ ПРОВАЛИЛСЯ - плохой ответ (${responseText.length} символов)`);
          console.log(`📄 Ответ: ${responseText.substring(0, 100)}...`);
          failed++;
        }
      } else {
        console.log(`❌ ПРОВАЛИЛСЯ - неверная классификация: ${semanticResult.semantic_cluster?.name} (${confidence}%)`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ПРОВАЛИЛСЯ - ошибка: ${error.message}`);
      failed++;
    }
    
    console.log();
  }
  
  console.log(`📊 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:`);
  console.log(`✅ Успешно: ${passed}/${allTests.length} (${Math.round(passed/allTests.length*100)}%)`);
  console.log(`❌ Провалено: ${failed}/${allTests.length}`);
  
  if (failed === 0) {
    console.log('🎉 ИДЕАЛЬНЫЙ РЕЗУЛЬТАТ - ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  } else {
    console.log(`🔧 НУЖНО ИСПРАВИТЬ: ${failed} тестов`);
  }
}

testFailingCases().catch(console.error);