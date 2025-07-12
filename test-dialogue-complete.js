/**
 * Полный тест диалогового цикла
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');

async function testCompleteDialogue() {
  const sessionId = 'test-complete';
  
  console.log('🎭 ЭТАП 1: Простой запрос');
  const step1 = await intelligentProcessor.analyzeUserIntent('Создай дракона', { sessionId });
  console.log(`✅ Результат: success=${step1.success}, awaitingChoice=${step1.awaitingChoice}`);
  
  if (step1.success && step1.awaitingChoice) {
    console.log('\n🎭 ЭТАП 2: Выбор пользователя');
    const step2 = await intelligentProcessor.analyzeUserIntent('принт', { sessionId });
    console.log(`✅ Результат: success=${step2.success}, category=${step2.category}`);
    
    if (step2.success && step2.category === 'image_generation') {
      console.log('\n🎯 ПОЛНЫЙ УСПЕХ: Диалоговый поток работает корректно!');
      console.log('✅ Система правильно переходит от предложения вариантов к генерации');
    } else {
      console.log('\n❌ Ошибка на этапе 2: выбор пользователя не обработан');
    }
  } else {
    console.log('\n❌ Ошибка на этапе 1: система не предложила варианты');
  }
}

testCompleteDialogue().catch(console.error);