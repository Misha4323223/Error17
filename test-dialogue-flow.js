/**
 * Тест полного диалогового потока с выборами пользователя
 * Проверяем: запрос → варианты → выбор → генерация
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');

async function testFullDialogueFlow() {
  console.log('🎭 Тестирование полного диалогового потока...\n');
  
  const sessionId = 'test-dialogue-session';
  
  try {
    // ========== Шаг 1: Простой запрос на генерацию изображения ==========
    console.log('📝 Шаг 1: Отправляем простой запрос "Создай дракона"');
    
    const step1Result = await intelligentProcessor.analyzeUserIntent(
      'Создай дракона',
      { sessionId: sessionId }
    );
    
    console.log('✅ Результат шага 1:', {
      success: step1Result.success,
      awaitingChoice: step1Result.awaitingChoice,
      provider: step1Result.provider,
      category: step1Result.category
    });
    
    if (step1Result.success && step1Result.awaitingChoice) {
      console.log('🎯 Система правильно предложила варианты вместо немедленной генерации');
    } else {
      console.log('❌ Ошибка: система должна была предложить варианты');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // ========== Шаг 2: Выбор пользователя ==========
    console.log('📝 Шаг 2: Пользователь делает выбор "принт"');
    
    const step2Result = await intelligentProcessor.analyzeUserIntent(
      'принт',
      { sessionId: sessionId }
    );
    
    console.log('✅ Результат шага 2:', {
      success: step2Result.success,
      provider: step2Result.provider,
      category: step2Result.category,
      imageUrl: step2Result.imageUrl ? 'ЕСТЬ' : 'НЕТ',
      isChoiceExecution: step2Result.originalRequest ? 'ДА' : 'НЕТ'
    });
    
    if (step2Result.success && step2Result.category === 'image_generation') {
      console.log('🎯 Система правильно распознала выбор и запустила генерацию');
      
      if (step2Result.originalRequest) {
        console.log(`📋 Оригинальный запрос восстановлен: "${step2Result.originalRequest}"`);
      }
      
      if (step2Result.userChoice) {
        console.log(`✅ Выбор пользователя сохранен: "${step2Result.userChoice}"`);
      }
    } else {
      console.log('❌ Ошибка: система должна была распознать выбор и сгенерировать изображение');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // ========== Шаг 3: Новый запрос (должен снова предложить варианты) ==========
    console.log('📝 Шаг 3: Новый простой запрос "Нарисуй кота"');
    
    const step3Result = await intelligentProcessor.analyzeUserIntent(
      'Нарисуй кота',
      { sessionId: sessionId }
    );
    
    console.log('✅ Результат шага 3:', {
      success: step3Result.success,
      awaitingChoice: step3Result.awaitingChoice,
      provider: step3Result.provider,
      category: step3Result.category
    });
    
    if (step3Result.success && step3Result.awaitingChoice) {
      console.log('🎯 Система правильно сбросила состояние и снова предложила варианты');
    } else {
      console.log('❌ Ошибка: система должна была сбросить состояние и предложить варианты');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // ========== Шаг 4: Запрос с конкретным стилем (должен генерировать напрямую) ==========
    console.log('📝 Шаг 4: Запрос с указанием стиля "Создай реалистичного волка"');
    
    const step4Result = await intelligentProcessor.analyzeUserIntent(
      'Создай реалистичного волка',
      { sessionId: sessionId }
    );
    
    console.log('✅ Результат шага 4:', {
      success: step4Result.success,
      awaitingChoice: step4Result.awaitingChoice,
      provider: step4Result.provider,
      category: step4Result.category,
      imageUrl: step4Result.imageUrl ? 'ЕСТЬ' : 'НЕТ'
    });
    
    if (step4Result.success && !step4Result.awaitingChoice && step4Result.category === 'image_generation') {
      console.log('🎯 Система правильно распознала конкретный стиль и сгенерировала напрямую');
    } else {
      console.log('❌ Ошибка: система должна была генерировать напрямую без предложения вариантов');
    }

  } catch (error) {
    console.error('❌ Ошибка в тесте:', error.message);
  }
  
  console.log('\n🎯 Тестирование диалогового потока завершено!');
}

// Запуск теста
testFullDialogueFlow();