/**
 * ФИНАЛЬНЫЙ ТЕСТ ЛОКАЛЬНОЙ AI СИСТЕМЫ BOOOMERANGS
 * Проверяем работу conversation-engine после всех исправлений
 */

console.log('🚀 ФИНАЛЬНЫЙ ТЕСТ ЛОКАЛЬНОЙ AI СИСТЕМЫ BOOOMERANGS');
console.log('Цель: Проверить работу семантической генерации вместо fallback ответов');
console.log('');

async function testLocalAI() {
  try {
    const conversationEngine = require('./server/conversation-engine.cjs');
    
    // Тест 1: Информативный запрос о научной теме
    console.log('📊 ТЕСТ 1: Научная информация (планета Марс)');
    const result1 = await conversationEngine.processUserInput(
      'Расскажи интересные факты о планете Марс и последних открытиях',
      { sessionId: 'test_mars', includeAdvancedSearch: false }
    );
    
    console.log('  Ответ получен:', !!result1.reply);
    console.log('  Длина ответа:', result1.reply?.length || 0, 'символов');
    console.log('  Уверенность:', result1.confidence);
    console.log('  Подход:', result1.metadata?.approach || 'не указан');
    console.log('  Первые 200 символов:', result1.reply?.substring(0, 200) + '...');
    
    const isInformative1 = result1.reply?.length > 150 && 
                          (result1.reply.includes('Марс') || result1.reply.includes('планет'));
    const isTemplate1 = result1.reply?.includes('📁 Поддерживаемые форматы');
    
    console.log('  ✅ Информативен:', isInformative1 ? 'ДА' : 'НЕТ');
    console.log('  ✅ Не шаблон:', !isTemplate1 ? 'ДА' : 'НЕТ');
    console.log('');
    
    // Тест 2: Общий вопрос о возможностях системы
    console.log('📊 ТЕСТ 2: Вопрос о возможностях BOOOMERANGS');
    const result2 = await conversationEngine.processUserInput(
      'Что ты умеешь делать?',
      { sessionId: 'test_capabilities' }
    );
    
    console.log('  Ответ получен:', !!result2.reply);
    console.log('  Длина ответа:', result2.reply?.length || 0, 'символов');
    console.log('  Уверенность:', result2.confidence);
    console.log('  Подход:', result2.metadata?.approach || 'не указан');
    console.log('  Первые 200 символов:', result2.reply?.substring(0, 200) + '...');
    
    const mentionsBooomerangs = result2.reply?.includes('BOOOMERANGS') || 
                               result2.reply?.includes('вышивк') ||
                               result2.reply?.includes('изображен');
    const isTemplate2 = result2.reply?.includes('📁 Поддерживаемые форматы');
    
    console.log('  ✅ Упоминает BOOOMERANGS/вышивку:', mentionsBooomerangs ? 'ДА' : 'НЕТ');
    console.log('  ✅ Не шаблон:', !isTemplate2 ? 'ДА' : 'НЕТ');
    console.log('');
    
    // Тест 3: Творческий запрос
    console.log('📊 ТЕСТ 3: Творческий запрос (генерация идей)');
    const result3 = await conversationEngine.processUserInput(
      'Предложи идеи для дизайна вышивки с космической темой',
      { sessionId: 'test_creative' }
    );
    
    console.log('  Ответ получен:', !!result3.reply);
    console.log('  Длина ответа:', result3.reply?.length || 0, 'символов');
    console.log('  Уверенность:', result3.confidence);
    console.log('  Подход:', result3.metadata?.approach || 'не указан');
    console.log('  Первые 200 символов:', result3.reply?.substring(0, 200) + '...');
    
    const isCreative = result3.reply?.length > 100 && 
                      (result3.reply.includes('космос') || result3.reply.includes('звезд') || 
                       result3.reply.includes('планет') || result3.reply.includes('дизайн'));
    const isTemplate3 = result3.reply?.includes('📁 Поддерживаемые форматы');
    
    console.log('  ✅ Творческий ответ:', isCreative ? 'ДА' : 'НЕТ');
    console.log('  ✅ Не шаблон:', !isTemplate3 ? 'ДА' : 'НЕТ');
    console.log('');
    
    // Итоговая оценка
    const tests = [
      { name: 'Научная информация', passed: isInformative1 && !isTemplate1 },
      { name: 'Описание возможностей', passed: mentionsBooomerangs && !isTemplate2 },
      { name: 'Творческие идеи', passed: isCreative && !isTemplate3 }
    ];
    
    const passedTests = tests.filter(t => t.passed).length;
    
    console.log('🎯 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:');
    tests.forEach(test => {
      console.log(`  ${test.name}: ${test.passed ? '✅ ПРОЙДЕН' : '❌ НЕ ПРОЙДЕН'}`);
    });
    
    console.log('');
    console.log(`📈 ОБЩИЙ РЕЗУЛЬТАТ: ${passedTests}/3 тестов пройдено`);
    
    if (passedTests === 3) {
      console.log('🎉 ПОЛНЫЙ УСПЕХ: Локальная AI система BOOOMERANGS работает отлично!');
      console.log('✅ Система генерирует качественные, персонализированные ответы');
      console.log('✅ Шаблонные ответы полностью устранены');
      console.log('✅ Семантическая обработка функционирует корректно');
    } else if (passedTests >= 2) {
      console.log('✅ ХОРОШИЙ РЕЗУЛЬТАТ: Система работает с незначительными недочетами');
      console.log('🔧 Требуется небольшая доработка отдельных аспектов');
    } else if (passedTests >= 1) {
      console.log('🔄 ЧАСТИЧНЫЙ УСПЕХ: Основные функции работают');
      console.log('⚠️ Необходимы дополнительные улучшения');
    } else {
      console.log('❌ ТРЕБУЕТСЯ ДОПОЛНИТЕЛЬНАЯ РАБОТА');
      console.log('🔧 Система нуждается в серьезных доработках');
    }
    
  } catch (error) {
    console.log('❌ Критическая ошибка тестирования:', error.message);
    console.log('📄 Стек ошибки:', error.stack?.substring(0, 500));
  }
}

// Запускаем тест с задержкой для инициализации модулей
setTimeout(() => {
  testLocalAI();
}, 3000);