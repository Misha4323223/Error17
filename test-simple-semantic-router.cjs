/**
 * 🎯 ПРОСТОЙ ТЕСТ SEMANTIC ROUTER
 * Проверяем работу базовых функций
 */

const { analyzeAndRoute } = require('./server/semantic-router.cjs');

async function testSimpleSemanticRouter() {
  console.log('🎯 ПРОСТОЙ ТЕСТ SEMANTIC ROUTER');
  console.log('===============================');
  
  const testQueries = [
    'привет',
    'как дела',
    'расскажи про машинное обучение',
    'создай дизайн вышивки с розами'
  ];
  
  for (const query of testQueries) {
    console.log(`\n🧪 Тестируем: "${query}"`);
    
    try {
      const result = await analyzeAndRoute(query);
      
      console.log(`✅ Результат:`, {
        complexity: result.complexity.toFixed(2),
        strategy: result.routingStrategy,
        mode: result.routingHints?.mode,
        useNeural: result.routingHints?.useNeural,
        timeLimit: result.routingHints?.timeLimit
      });
      
    } catch (error) {
      console.log(`❌ Ошибка:`, error.message);
    }
  }
  
  console.log('\n✅ Тест завершен!');
}

// Запуск теста
testSimpleSemanticRouter().catch(console.error);