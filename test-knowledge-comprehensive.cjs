/**
 * Комплексный тест знаниевой системы для разных тем
 */

const semanticAnalyzer = require('./server/semantic-memory/semantic-analyzer.cjs');
const naturalLanguageGenerator = require('./server/semantic-memory/natural-language-generator.cjs');

async function testKnowledgeQuery(query, expectedTopic) {
  console.log(`\n🔍 ТЕСТ: "${query}"`);
  
  // Семантический анализ
  const semanticResult = semanticAnalyzer.analyzeSemantics(query);
  const isKnowledgeRequest = semanticResult.semantic_cluster?.name === 'knowledge_request';
  
  console.log(`📊 Семантика: ${semanticResult.semantic_cluster?.name}, уверенность: ${semanticResult.confidence}%`);
  
  if (!isKnowledgeRequest) {
    console.log('❌ НЕ ОПРЕДЕЛЕН как знаниевый запрос');
    return false;
  }
  
  // Генерация ответа
  const context = {
    semanticAnalysis: semanticResult.semantic_analysis,
    isKnowledgeRequest: true
  };
  
  const response = await naturalLanguageGenerator.generateResponse(query, context);
  
  const hasContent = response.response && response.response.length > 100;
  const hasExpectedTopic = expectedTopic ? response.response.toLowerCase().includes(expectedTopic.toLowerCase()) : true;
  
  console.log(`📝 Ответ: ${hasContent ? '✅ Содержательный' : '❌ Короткий'} (${response.response?.length || 0} символов)`);
  console.log(`🎯 Тема "${expectedTopic}": ${hasExpectedTopic ? '✅ Найдена' : '❌ Не найдена'}`);
  
  // Показываем превью ответа
  if (response.response) {
    console.log(`📄 Превью: ${response.response.substring(0, 150)}...`);
  }
  
  return hasContent && hasExpectedTopic;
}

async function runComprehensiveTest() {
  console.log('🧠 КОМПЛЕКСНЫЙ ТЕСТ ЗНАНИЕВОЙ СИСТЕМЫ\n');
  
  const testCases = [
    { query: "Расскажи про планету Земля", expectedTopic: "Земля" },
    { query: "Расскажи про планету Марс", expectedTopic: "Марс" },
    { query: "Расскажи про гравитацию", expectedTopic: "гравитация" },
    { query: "Расскажи про космос", expectedTopic: "космос" },
    { query: "Расскажи про историю России", expectedTopic: "история" },
    { query: "Что такое наука", expectedTopic: "наука" },
    { query: "Объясни физику", expectedTopic: "физика" },
    { query: "Расскажи про культуру", expectedTopic: "культура" },
    { query: "Что знаешь о медицине", expectedTopic: "медицина" },
    { query: "Расскажи про экономику", expectedTopic: "экономика" }
  ];
  
  let passed = 0;
  let total = testCases.length;
  
  for (const testCase of testCases) {
    const result = await testKnowledgeQuery(testCase.query, testCase.expectedTopic);
    if (result) passed++;
  }
  
  console.log(`\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:`);
  console.log(`✅ Успешно: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
  console.log(`❌ Провалено: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log(`\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ - СИСТЕМА РАБОТАЕТ ИДЕАЛЬНО!`);
  } else if (passed >= total * 0.8) {
    console.log(`\n👍 СИСТЕМА РАБОТАЕТ ХОРОШО - большинство тестов пройдено`);
  } else {
    console.log(`\n⚠️ НУЖНЫ ДОРАБОТКИ - много тестов провалено`);
  }
  
  return passed === total;
}

runComprehensiveTest().catch(console.error);