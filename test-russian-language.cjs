/**
 * 🇷🇺 ПОЛНАЯ ПРОВЕРКА ПОДДЕРЖКИ РУССКОГО ЯЗЫКА
 * Проверяем все компоненты системы на понимание русского
 */

async function testRussianLanguage() {
  console.log('🇷🇺 Тестируем поддержку русского языка во всех компонентах...\n');
  
  const testInput = "что такое трава";
  
  // 1. Проверяем семантический анализатор
  console.log('1️⃣ Тестируем семантический анализатор...');
  try {
    const SemanticAnalyzer = require('./server/semantic-memory/semantic-analyzer.cjs');
    const analyzer = new SemanticAnalyzer();
    
    const analysis = analyzer.analyzeSemanticMeaning(testInput);
    console.log('✅ Семантический анализ:', {
      intent: analysis.intent,
      confidence: analysis.confidence,
      cluster: analysis.semantic_cluster?.name
    });
  } catch (error) {
    console.log('❌ Ошибка семантического анализа:', error.message);
  }
  
  // 2. Проверяем natural language generator
  console.log('\n2️⃣ Тестируем natural language generator...');
  try {
    const NaturalLanguageGenerator = require('./server/semantic-memory/natural-language-generator.cjs');
    const nlg = new NaturalLanguageGenerator();
    
    const response = nlg.generateNaturalKnowledgeResponse(testInput, {});
    console.log('✅ NLG ответ:', response ? `${typeof response === 'string' ? response.length : JSON.stringify(response).length} символов` : 'Нет ответа');
    if (response) {
      const responseText = typeof response === 'string' ? response : response.response || JSON.stringify(response);
      console.log('Пример:', responseText.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Ошибка NLG:', error.message);
  }
  
  // 3. Проверяем conversation engine
  console.log('\n3️⃣ Тестируем conversation engine...');
  try {
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    const result = await conversationEngine.processUserInput(testInput, {
      userId: 'test_user',
      sessionId: 'test_session'
    });
    
    console.log('✅ Conversation engine:', {
      hasReply: !!result.reply,
      confidence: result.confidence,
      approach: result.metadata?.approach
    });
    
    if (result.reply) {
      console.log('Пример ответа:', result.reply.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Ошибка conversation engine:', error.message);
  }
  
  // 4. Проверяем семантическую память
  console.log('\n4️⃣ Тестируем семантическую память...');
  try {
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    const memoryResult = await semanticMemory.analyzeCompleteRequest(testInput, {});
    console.log('✅ Семантическая память:', {
      confidence: memoryResult.confidence,
      category: memoryResult.category,
      hasResponse: !!memoryResult.generatedResponse
    });
    
    if (memoryResult.generatedResponse) {
      const responseText = typeof memoryResult.generatedResponse === 'string' ? 
        memoryResult.generatedResponse : 
        memoryResult.generatedResponse.response || JSON.stringify(memoryResult.generatedResponse);
      console.log('Пример:', responseText.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Ошибка семантической памяти:', error.message);
  }
  
  // 5. Проверяем neural integration
  console.log('\n5️⃣ Тестируем neural integration...');
  try {
    const neuralIntegration = require('./server/neural-integration.cjs');
    
    const neuralResult = await neuralIntegration.generateHybridResponse(testInput, {});
    console.log('✅ Neural integration:', {
      hasResponse: !!neuralResult,
      type: typeof neuralResult
    });
    
    if (neuralResult) {
      console.log('Пример:', neuralResult.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Ошибка neural integration:', error.message);
  }
  
  // 6. Проверяем routes API
  console.log('\n6️⃣ Тестируем API routes...');
  try {
    // Запускаем сервер если не запущен
    const axios = require('axios');
    
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/ai/chat', {
          message: testInput
        }, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ API routes:', {
          status: response.status,
          hasData: !!response.data,
          responseLength: response.data?.length || 0
        });
        
        if (response.data) {
          console.log('API ответ:', response.data.substring(0, 100) + '...');
        }
      } catch (apiError) {
        console.log('❌ Ошибка API:', apiError.message);
      }
    }, 2000);
    
  } catch (error) {
    console.log('❌ Ошибка подготовки API теста:', error.message);
  }
  
  // Выводы
  console.log('\n🎯 АНАЛИЗ ПРОБЛЕМЫ С РУССКИМ ЯЗЫКОМ:');
  console.log('Проверим каждый компонент на поддержку кириллицы и русской семантики...');
}

testRussianLanguage();