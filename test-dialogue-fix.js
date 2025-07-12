/**
 * Тест исправления диалоговой системы
 * Проверяет что система генерирует человеческие ответы вместо технических
 */

async function testDialogueFixes() {
  console.log('🧪 ТЕСТ ИСПРАВЛЕНИЯ ДИАЛОГОВОЙ СИСТЕМЫ\n');
  
  const testCases = [
    {
      name: 'Простое приветствие',
      input: 'Привет',
      expected: 'дружелюбный ответ с возможностями'
    },
    {
      name: 'Вопрос о возможностях',
      input: 'Расскажи о себе',
      expected: 'персональное представление'
    },
    {
      name: 'Простой вопрос',
      input: 'Что?',
      expected: 'уточняющий вопрос'
    },
    {
      name: 'Как дела',
      input: 'Как дела?',
      expected: 'позитивный ответ о состоянии'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Тест: ${testCase.name}`);
    console.log(`💬 Вопрос: "${testCase.input}"`);
    
    try {
      // Отправляем запрос к серверу
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.input,
          options: {
            provider: 'semantic'
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Ответ получен (${data.response.length} символов)`);
        console.log(`🎯 Содержание: "${data.response.substring(0, 100)}..."`);
        
        // Проверяем что ответ НЕ технический
        const isTechnical = data.response.includes('семантический анализ') || 
                          data.response.includes('модули') ||
                          data.response.includes('базовый анализ');
        
        if (isTechnical) {
          console.log('❌ ОШИБКА: Ответ все еще технический!');
        } else {
          console.log('✅ УСПЕХ: Ответ человечный и дружелюбный!');
        }
      } else {
        console.log(`❌ Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ Ошибка запроса: ${error.message}`);
    }
    
    // Пауза между тестами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎯 ТЕСТ ЗАВЕРШЕН');
}

// Запуск теста
testDialogueFixes();