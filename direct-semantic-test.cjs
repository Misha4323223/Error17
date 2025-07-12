/**
 * ПРЯМОЙ ТЕСТ СЕМАНТИЧЕСКОЙ СИСТЕМЫ
 * Тестируем запрос "Расскажи про планету Земля"
 */

async function directSemanticTest() {
  console.log('🧪 ПРЯМОЙ ТЕСТ СЕМАНТИЧЕСКОЙ СИСТЕМЫ');
  console.log('=' .repeat(60));
  console.log('📝 Тестовый запрос: "Расскажи про планету Земля"');
  console.log('');

  try {
    // Загружаем семантическую систему
    console.log('📦 Загружаем семантический интеграционный слой...');
    const semanticIntegrationLayer = require('./server/semantic-integration-layer.cjs');
    
    // Тестовый запрос
    const testQuery = "Расскажи про планету Земля";
    const testContext = {
      sessionId: 'direct-test-session',
      conversationHistory: [],
      hasRecentImages: false,
      userPreferences: {},
      chatContext: {}
    };

    console.log('🔍 ЭТАП 1: Семантический анализ');
    console.log('=' .repeat(40));

    // Выполняем семантический анализ
    const analysisStart = Date.now();
    const analysisResult = await semanticIntegrationLayer.analyzeWithSemantics(testQuery, testContext);
    const analysisTime = Date.now() - analysisStart;

    console.log(`⏱️  Время анализа: ${analysisTime}мс`);
    console.log(`📊 shouldUseSemantic: ${analysisResult.shouldUseSemantic}`);
    console.log(`📊 reason: ${analysisResult.reason}`);
    console.log(`📊 confidence: ${analysisResult.confidence}`);

    if (analysisResult.semanticResult) {
      console.log(`📊 intent: ${analysisResult.semanticResult.intent}`);
      console.log(`📊 category: ${analysisResult.semanticResult.category}`);
      console.log(`📊 fallback: ${analysisResult.semanticResult.fallback || false}`);
      
      if (analysisResult.semanticResult.semantic_analysis) {
        console.log(`📊 query_type: ${analysisResult.semanticResult.semantic_analysis.query_type}`);
        console.log(`📊 dialog_category: ${analysisResult.semanticResult.semantic_analysis.dialog_category}`);
      }
    }

    console.log('\n🧠 ЭТАП 2: Генерация ответа');
    console.log('=' .repeat(40));

    // Генерируем ответ
    const responseStart = Date.now();
    const responseResult = await semanticIntegrationLayer.generateSmartResponse(testQuery, testContext);
    const responseTime = Date.now() - responseStart;

    console.log(`⏱️  Время генерации: ${responseTime}мс`);
    
    if (responseResult && responseResult.response) {
      console.log(`📝 Ответ получен: ДА`);
      console.log(`🔧 Генератор: ${responseResult.metadata?.generatedBy || 'unknown'}`);
      console.log(`📊 Модули использованы: ${responseResult.metadata?.modulesUsed?.length || 0}`);
      
      console.log('\n📄 ПОЛНЫЙ ОТВЕТ СИСТЕМЫ:');
      console.log('=' .repeat(60));
      console.log(responseResult.response);
      console.log('=' .repeat(60));
    } else {
      console.log('❌ Ответ НЕ получен');
      if (responseResult?.error) {
        console.log(`🔴 Ошибка: ${responseResult.error}`);
      }
    }

    // Тест индивидуальных компонентов
    console.log('\n🔧 ЭТАП 3: Тест индивидуальных компонентов');
    console.log('=' .repeat(40));

    // Загружаем conversation engine для сравнения
    try {
      const conversationEngine = require('./server/conversation-engine.cjs');
      
      console.log('🧠 Тестируем conversation-engine...');
      const engineResult = await conversationEngine.processUserInput(testQuery, {
        sessionId: 'direct-test-engine',
        userId: 'test-user',
        conversationHistory: []
      });

      if (engineResult && engineResult.reply) {
        console.log('✅ Conversation Engine работает');
        console.log(`📊 Качество: ${engineResult.quality}`);
        console.log(`📊 Уверенность: ${engineResult.confidence}`);
        console.log(`📝 Краткий ответ: "${engineResult.reply.substring(0, 100)}..."`);
      } else {
        console.log('❌ Conversation Engine не ответил');
      }
    } catch (error) {
      console.log(`❌ Ошибка Conversation Engine: ${error.message}`);
    }

    // Итоговый анализ
    console.log('\n📈 ИТОГОВЫЙ ОТЧЕТ');
    console.log('=' .repeat(60));
    
    const totalTime = analysisTime + responseTime;
    console.log(`⏱️  Общее время обработки: ${totalTime}мс`);
    
    if (analysisResult.shouldUseSemantic && responseResult?.response) {
      console.log('🎉 ТЕСТ УСПЕШЕН');
      console.log('✅ Семантический анализ работает');
      console.log('✅ Генерация ответов функционирует');
      console.log('✅ Система использует полную семантическую обработку');
      
      if (!analysisResult.semanticResult?.fallback) {
        console.log('✅ Emergency fallback НЕ используется');
      } else {
        console.log('⚠️ Система использует fallback режим');
      }
    } else {
      console.log('❌ ТЕСТ НЕ ПРОШЕЛ');
      console.log('🔧 Требуется дополнительная диагностика');
    }

  } catch (error) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА ТЕСТА:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Запуск теста
if (require.main === module) {
  directSemanticTest().catch(console.error);
}

module.exports = { directSemanticTest };