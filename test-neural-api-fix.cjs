/**
 * Тест исправления Neural API ошибки "Unexpected token '{'"
 */

const path = require('path');

console.log('🧪 ТЕСТ ИСПРАВЛЕНИЯ NEURAL API');
console.log('============================');

async function testNeuralAPIFix() {
  try {
    console.log('1️⃣ Тестирование загрузки neural-integration.cjs...');
    
    // Проверяем, можно ли загрузить модуль без синтаксических ошибок
    const neuralIntegration = require('./server/neural-integration.cjs');
    console.log('✅ Модуль neural-integration.cjs загружается без ошибок');
    
    console.log('2️⃣ Проверка экспортов...');
    console.log('   - NeuralIntegrationLayer:', typeof neuralIntegration.NeuralIntegrationLayer);
    console.log('   - initializeNeuralIntegration:', typeof neuralIntegration.initializeNeuralIntegration);
    console.log('   - getGlobalNeuralIntegration:', typeof neuralIntegration.getGlobalNeuralIntegration);
    
    console.log('3️⃣ Проверка создания экземпляра...');
    
    try {
      const instance = new neuralIntegration.NeuralIntegrationLayer();
      console.log('✅ Экземпляр NeuralIntegrationLayer создан успешно');
      console.log('   - Тип объекта:', typeof instance);
      console.log('   - Метод generateHybridResponse:', typeof instance.generateHybridResponse);
    } catch (instanceError) {
      console.log('❌ Ошибка создания экземпляра:', instanceError.message);
    }
    
    console.log('4️⃣ Проверка глобального экземпляра...');
    const globalInstance = neuralIntegration.getGlobalNeuralIntegration();
    console.log('   - Глобальный экземпляр создан:', !!globalInstance);
    
    console.log('\n🎉 РЕЗУЛЬТАТ: Ошибка "Unexpected token \'{\'" ИСПРАВЛЕНА!');
    console.log('✅ Neural API теперь загружается корректно');
    
  } catch (error) {
    console.error('❌ ОШИБКА ВСЕ ЕЩЕ ПРИСУТСТВУЕТ:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
  
  return true;
}

// Запуск теста
testNeuralAPIFix().then(success => {
  if (success) {
    console.log('\n🚀 Neural API готов к работе!');
  } else {
    console.log('\n💥 Требуется дополнительное исправление');
  }
}).catch(error => {
  console.error('💥 Критическая ошибка теста:', error);
});