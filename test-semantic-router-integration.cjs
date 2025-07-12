/**
 * 🎯 ТЕСТ SEMANTIC ROUTER ИНТЕГРАЦИИ
 * Проверяем работу semantic router + conversation engine + neural network
 */

const { analyzeAndRoute } = require('./server/semantic-router.cjs');

async function testSemanticRouterIntegration() {
  console.log('🎯 ТЕСТ SEMANTIC ROUTER ИНТЕГРАЦИИ');
  console.log('=====================================');
  
  const testQueries = [
    // Простые запросы (express режим)
    { text: 'привет', expectedMode: 'express', expectedComplexity: 0.1 },
    { text: 'как дела', expectedMode: 'express', expectedComplexity: 0.1 },
    { text: 'спасибо', expectedMode: 'express', expectedComplexity: 0.1 },
    
    // Средние запросы (standard режим)
    { text: 'расскажи про машинное обучение', expectedMode: 'standard', expectedComplexity: 0.5 },
    { text: 'создай изображение собаки', expectedMode: 'standard', expectedComplexity: 0.6 },
    { text: 'помоги с выбором дизайна', expectedMode: 'standard', expectedComplexity: 0.4 },
    
    // Сложные запросы (expert режим)
    { text: 'проведи глубокий анализ архитектуры нейросети для обработки естественного языка', expectedMode: 'expert', expectedComplexity: 0.8 },
    { text: 'создай комплексный алгоритм для оптимизации векторизации изображений', expectedMode: 'expert', expectedComplexity: 0.9 },
    
    // Специализированные запросы
    { text: 'создай дизайн для вышивки с цветами', expectedMode: 'specialized', expectedComplexity: 0.8 },
    { text: 'векторизуй это изображение в SVG формат', expectedMode: 'specialized', expectedComplexity: 0.7 },
    { text: 'сгенерируй картинку с драконом', expectedMode: 'specialized', expectedComplexity: 0.6 }
  ];
  
  let passedTests = 0;
  let totalTests = testQueries.length;
  
  for (const query of testQueries) {
    console.log(`\n🧪 Тестируем: "${query.text}"`);
    
    try {
      const result = await analyzeAndRoute(query.text);
      
      console.log(`📊 Результат анализа:`, {
        complexity: result.complexity.toFixed(2),
        strategy: result.routingStrategy,
        category: result.specialCategory,
        mode: result.routingHints?.mode,
        useNeural: result.routingHints?.useNeural,
        timeLimit: result.routingHints?.timeLimit
      });
      
      // Проверяем корректность режима
      const modeMatch = result.routingStrategy === query.expectedMode;
      const complexityInRange = Math.abs(result.complexity - query.expectedComplexity) <= 0.3;
      
      if (modeMatch && complexityInRange) {
        console.log(`✅ ТЕСТ ПРОЙДЕН: режим ${result.routingStrategy}, сложность ${result.complexity.toFixed(2)}`);
        passedTests++;
      } else {
        console.log(`❌ ТЕСТ НЕ ПРОЙДЕН:`);
        console.log(`   Ожидаемый режим: ${query.expectedMode}, получен: ${result.routingStrategy}`);
        console.log(`   Ожидаемая сложность: ~${query.expectedComplexity}, получена: ${result.complexity.toFixed(2)}`);
      }
      
    } catch (error) {
      console.log(`❌ ОШИБКА ТЕСТА:`, error.message);
    }
  }
  
  console.log(`\n🎯 ИТОГОВЫЙ РЕЗУЛЬТАТ: ${passedTests}/${totalTests} тестов пройдено`);
  console.log(`📊 Успешность: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  // Тест полной интеграции
  console.log('\n🔄 ТЕСТ ПОЛНОЙ ИНТЕГРАЦИИ');
  console.log('==========================');
  
  try {
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    // Тест простого запроса
    const routingDecision = await analyzeAndRoute('привет как дела');
    console.log('🎯 Routing decision для "привет как дела":', routingDecision.routingStrategy);
    
    const response = await conversationEngine.processUserInput('привет как дела', {
      routingHints: routingDecision.routingHints
    });
    
    console.log('✅ Conversation Engine ответ:', response.reply?.substring(0, 200) + '...');
    console.log('🎯 Routing info передан:', response.metadata?.routingInfo ? 'Да' : 'Нет');
    
  } catch (error) {
    console.log('❌ Ошибка полной интеграции:', error.message);
  }
}

// Запуск теста
if (require.main === module) {
  testSemanticRouterIntegration().catch(console.error);
}

module.exports = { testSemanticRouterIntegration };