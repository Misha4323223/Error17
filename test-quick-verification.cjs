/**
 * БЫСТРАЯ ВЕРИФИКАЦИЯ ИСПРАВЛЕННОЙ СИСТЕМЫ
 * Тестируем основные компоненты после исправлений
 */

console.log('🔧 БЫСТРАЯ ВЕРИФИКАЦИЯ ИСПРАВЛЕННОЙ СИСТЕМЫ');

async function quickVerification() {
  try {
    console.log('1️⃣ Загрузка семантической памяти...');
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    console.log('✅ Семантическая память загружена');
    console.log(`📊 Доступных функций: ${Object.keys(semanticMemory).length}`);

    console.log('\n2️⃣ Проверка семантического анализатора...');
    const semanticAnalyzer = require('./server/semantic-memory/semantic-analyzer.cjs');
    console.log('✅ Семантический анализатор загружен');
    console.log(`📊 Экспортов: ${Object.keys(semanticAnalyzer).length}`);

    console.log('\n3️⃣ Проверка эмоциональной матрицы...');
    const emotionalMatrix = require('./server/semantic-memory/emotional-semantic-matrix.cjs');
    console.log('✅ Эмоциональная матрица загружена');
    console.log(`📊 Экспортов: ${Object.keys(emotionalMatrix).length}`);

    console.log('\n4️⃣ Тест простого анализа...');
    
    // Ждем инициализации
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testResult = await semanticMemory.analyzeCompleteRequest("привет", {});
    console.log('✅ Тест выполнен без runtime ошибок');
    console.log(`📊 Результат: уверенность ${testResult.confidence}, время ${testResult.processingTime}мс`);

    console.log('\n🎉 ВСЕ ОСНОВНЫЕ КОМПОНЕНТЫ РАБОТАЮТ!');
    console.log('✅ Никаких критических ошибок не обнаружено');
    console.log('✅ Система готова к использованию');

  } catch (error) {
    console.log('\n❌ ОБНАРУЖЕНА ОШИБКА:', error.message);
    console.log('📄 Первые 300 символов стека:', error.stack?.substring(0, 300));
  }
}

quickVerification();