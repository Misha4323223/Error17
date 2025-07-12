/**
 * Быстрый тест знаниевой системы
 */

const semanticAnalyzer = require('./server/semantic-memory/semantic-analyzer.cjs');
const naturalLanguageGenerator = require('./server/semantic-memory/natural-language-generator.cjs');

async function testKnowledgeSystem() {
  console.log('🔍 БЫСТРЫЙ ТЕСТ ЗНАНИЕВОЙ СИСТЕМЫ');
  
  const testQuery = "Расскажи про планету Марс";
  console.log(`📝 Тестируем запрос: "${testQuery}"`);
  
  // Тест 1: Семантический анализатор
  console.log('\n1. ТЕСТ СЕМАНТИЧЕСКОГО АНАЛИЗАТОРА:');
  const semanticResult = semanticAnalyzer.analyzeSemantics(testQuery);
  console.log('✅ Результат анализа:', {
    cluster_name: semanticResult.semantic_cluster?.name,
    query_type: semanticResult.semantic_analysis?.query_type,
    dialog_category: semanticResult.semantic_analysis?.dialog_category,
    confidence: semanticResult.confidence
  });
  
  // Тест 2: Natural Language Generator
  console.log('\n2. ТЕСТ NATURAL LANGUAGE GENERATOR:');
  const context = {
    semanticAnalysis: semanticResult.semantic_analysis,
    isKnowledgeRequest: semanticResult.semantic_cluster?.name === 'knowledge_request'
  };
  
  const response = await naturalLanguageGenerator.generateResponse(testQuery, context);
  console.log('✅ Ответ сгенерирован:', {
    length: response.response?.length || 0,
    preview: response.response?.substring(0, 100) + '...'
  });
  
  console.log('\n📊 РЕЗУЛЬТАТ ТЕСТА:');
  console.log('Полный ответ:', response.response);
  
  // Проверяем успешность
  const isSuccess = response.response && 
                   response.response.length > 100 && 
                   response.response.includes('Марс');
  
  console.log(`\n${isSuccess ? '✅ ТЕСТ ПРОЙДЕН' : '❌ ТЕСТ ПРОВАЛЕН'}`);
  return isSuccess;
}

testKnowledgeSystem().catch(console.error);