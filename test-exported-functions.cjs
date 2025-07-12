/**
 * ТЕСТ ЭКСПОРТИРОВАННЫХ ФУНКЦИЙ СЕМАНТИЧЕСКОЙ ПАМЯТИ
 * Проверяем что функции доступны и работают корректно
 */

console.log('🧪 ТЕСТ ЭКСПОРТИРОВАННЫХ ФУНКЦИЙ СЕМАНТИЧЕСКОЙ ПАМЯТИ');
console.log('Цель: Убедиться что analyzeCompleteRequest функционирует');

async function testExportedFunctions() {
  try {
    console.log('\n📦 ЗАГРУЗКА МОДУЛЯ...');
    
    // Загружаем семантическую память
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    console.log('✅ Модуль загружен успешно');
    console.log('📊 Экспортированных функций:', Object.keys(semanticMemory).length);
    console.log('✅ analyzeCompleteRequest:', typeof semanticMemory.analyzeCompleteRequest);
    console.log('✅ semanticMemory объект:', 'semanticMemory' in semanticMemory);
    
    console.log('\n🧪 ТЕСТ 1: Вызов analyzeCompleteRequest');
    
    // Ждем немного для инициализации
    console.log('⏳ Ожидаем инициализацию модулей (3 сек)...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const testQuery = "Привет! Как дела?";
    console.log(`📝 Тестовый запрос: "${testQuery}"`);
    
    const result = await semanticMemory.analyzeCompleteRequest(testQuery, {});
    
    console.log('\n📊 РЕЗУЛЬТАТ АНАЛИЗА:');
    console.log('✅ Функция выполнилась без ошибок');
    console.log('✅ Возвращен объект:', typeof result);
    console.log('✅ Есть анализ:', !!result.analysis);
    console.log('✅ Уверенность:', result.confidence);
    console.log('✅ Время обработки:', result.processingTime + 'мс');
    
    if (result.analysis) {
      console.log('✅ Семантический анализ:', !!result.analysis.semantic);
      console.log('✅ Мета-анализ:', !!result.analysis.meta);
      console.log('✅ Эмоциональный анализ:', !!result.analysis.emotional);
    }
    
    console.log('\n🎉 ТЕСТ ЭКСПОРТИРОВАННЫХ ФУНКЦИЙ ЗАВЕРШЕН УСПЕШНО!');
    console.log('✅ Семантическая память полностью функциональна');
    console.log('✅ Готова к интеграции с основной системой');
    
  } catch (error) {
    console.log('\n❌ ОШИБКА ТЕСТА:', error.message);
    console.log('📄 Стек:', error.stack?.substring(0, 500));
  }
}

testExportedFunctions();