/**
 * Простой тест диалогового потока - только первый шаг
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');

async function testSimpleFlow() {
  console.log('🎯 Тест: простой запрос генерации изображения...\n');
  
  try {
    const result = await intelligentProcessor.analyzeUserIntent(
      'Создай дракона',
      { sessionId: 'test-simple' }
    );
    
    console.log('✅ Результат:', {
      success: result.success,
      awaitingChoice: result.awaitingChoice,
      provider: result.provider || 'НЕТ',
      category: result.category || 'НЕТ'
    });
    
    if (result.success && result.awaitingChoice) {
      console.log('🎯 УСПЕХ: Система предложила варианты вместо немедленной генерации');
    } else if (result.success && result.category === 'image_generation') {
      console.log('🎯 УСПЕХ: Система сгенерировала изображение напрямую');
    } else {
      console.log('❌ ПРОБЛЕМА: Неожиданное поведение системы');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
  
  console.log('\n🎯 Тест завершен!');
}

testSimpleFlow();