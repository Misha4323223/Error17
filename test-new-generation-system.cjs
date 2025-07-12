/**
 * БЫСТРЫЙ ТЕСТ НОВОЙ СИСТЕМЫ ГЕНЕРАЦИИ
 * Проверяем что fallback ответы заменены на интеллектуальные
 */

console.log('🧪 ТЕСТИРОВАНИЕ НОВОЙ СИСТЕМЫ ГЕНЕРАЦИИ');

async function testNewGenerationSystem() {
  try {
    console.log('📁 Загружаем natural-language-generator...');
    
    // Прямой импорт нового генератора
    const nlgModule = require('./server/semantic-memory/natural-language-generator.cjs');
    
    console.log('🔍 Тип модуля:', typeof nlgModule);
    console.log('🔍 Ключи модуля:', Object.keys(nlgModule));
    
    let generator;
    if (nlgModule.instance) {
      generator = nlgModule.instance;
    } else if (nlgModule.NaturalLanguageGenerator) {
      generator = new nlgModule.NaturalLanguageGenerator();
    } else if (typeof nlgModule === 'object' && nlgModule.generateResponse) {
      generator = nlgModule;
    } else {
      console.log('❌ Не удалось найти правильный интерфейс генератора');
      return;
    }
    
    console.log('✅ Генератор найден');
    console.log('🔍 Методы генератора:', Object.getOwnPropertyNames(Object.getPrototypeOf(generator)).filter(name => name !== 'constructor'));
    
    // Тестируем новые методы
    if (generator.generateAdaptiveResponse) {
      console.log('\n🎯 ТЕСТИРУЕМ НОВЫЙ generateAdaptiveResponse');
      
      // Создаем тестовый объект thought
      const testThought = {
        userInput: 'сучка',
        context: {},
        memoryInsights: {}
      };
      
      const result = generator.generateAdaptiveResponse(testThought);
      console.log('📝 Результат для "сучка":', result);
      
      // Проверяем что это НЕ старый fallback ответ
      if (result.includes('Интересно! Давай поговорим об этом')) {
        console.log('❌ ВСЕ ЕЩЕ СТАРЫЙ FALLBACK!');
      } else {
        console.log('✅ НОВЫЙ ИНТЕЛЛЕКТУАЛЬНЫЙ ОТВЕТ!');
      }
      
      // Тестируем другие методы
      if (generator.detectEmotionalIntent) {
        const emotion = generator.detectEmotionalIntent('сучка');
        console.log('🧠 Эмоциональный тон:', emotion);
      }
      
      if (generator.analyzeUserNeed) {
        const need = generator.analyzeUserNeed('сучка');
        console.log('🎯 Потребность пользователя:', need);
      }
      
    } else {
      console.log('❌ generateAdaptiveResponse не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    console.error('📍 Stack:', error.stack);
  }
}

// Запускаем тест
testNewGenerationSystem();