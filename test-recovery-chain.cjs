
/**
 * ТЕСТ ЦЕПОЧКИ ВОССТАНОВЛЕНИЯ СИСТЕМЫ
 * Проверяет последовательность: routes.ts → conversation-engine → fallback
 */

const { createRequire } = require('module');
const conversationEngine = require('./server/conversation-engine.cjs');

async function testRecoveryChain() {
  console.log('🔄 ТЕСТИРОВАНИЕ ЦЕПОЧКИ ВОССТАНОВЛЕНИЯ СИСТЕМЫ');
  console.log('=' .repeat(60));

  // Тест 1: Нормальный режим работы
  console.log('\n📋 ТЕСТ 1: Нормальный режим работы');
  try {
    const result1 = await conversationEngine.processUserInput('Привет, как дела?', {
      userId: 'test-user',
      sessionId: 'test-session-1'
    });
    console.log('✅ Нормальный режим:', result1.reply.substring(0, 50) + '...');
    console.log('📊 Уверенность:', result1.confidence);
    console.log('🎯 Качество:', result1.quality);
  } catch (error) {
    console.log('❌ Ошибка нормального режима:', error.message);
  }

  // Тест 2: Режим с повреждением naturalLanguageGenerator
  console.log('\n📋 ТЕСТ 2: Режим с поврежденным генератором');
  try {
    // Временно "ломаем" generateResponse
    const originalGenerateResponse = require('./server/semantic-memory/natural-language-generator.cjs').generateResponse;
    require('./server/semantic-memory/natural-language-generator.cjs').generateResponse = function() {
      throw new Error('ТЕСТОВАЯ ОШИБКА ГЕНЕРАТОРА');
    };

    const result2 = await conversationEngine.processUserInput('Кто ты?', {
      userId: 'test-user',
      sessionId: 'test-session-2'
    });
    
    console.log('✅ Fallback режим активирован:', result2.reply.substring(0, 50) + '...');
    console.log('📊 Уверенность:', result2.confidence);
    console.log('🎯 Качество:', result2.quality);
    console.log('🔧 Использован fallback:', result2.metadata.systemHealth ? 'да' : 'нет');

    // Восстанавливаем оригинальную функцию
    require('./server/semantic-memory/natural-language-generator.cjs').generateResponse = originalGenerateResponse;
  } catch (error) {
    console.log('❌ Ошибка fallback режима:', error.message);
  }

  // Тест 3: Критическая ошибка всей системы
  console.log('\n📋 ТЕСТ 3: Критическая ошибка системы');
  try {
    const result3 = await conversationEngine.processUserInput('', {
      userId: null,
      sessionId: undefined
    });
    console.log('✅ Критический fallback:', result3.reply.substring(0, 50) + '...');
    console.log('📊 Уверенность:', result3.confidence);
    console.log('🎯 Качество:', result3.quality);
  } catch (error) {
    console.log('❌ Критическая ошибка:', error.message);
  }

  // Тест 4: Различные типы запросов
  console.log('\n📋 ТЕСТ 4: Различные типы запросов');
  const testQueries = [
    'Ты умная система?',
    'Кто тебя создал?',
    'Что ты умеешь?',
    'Ну и ладно',
    'Эй чертина'
  ];

  for (const query of testQueries) {
    try {
      const result = await conversationEngine.processUserInput(query, {
        userId: 'test-user',
        sessionId: 'test-session-recovery'
      });
      console.log(`✅ "${query}" → ${result.reply.substring(0, 30)}...`);
      console.log(`   Уверенность: ${result.confidence}, Качество: ${result.quality}`);
    } catch (error) {
      console.log(`❌ "${query}" → Ошибка: ${error.message}`);
    }
  }

  console.log('\n🎯 ЦЕПОЧКА ВОССТАНОВЛЕНИЯ ПРОТЕСТИРОВАНА');
  console.log('=' .repeat(60));
}

// Запуск теста
testRecoveryChain().catch(console.error);
