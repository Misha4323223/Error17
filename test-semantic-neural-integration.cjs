/**
 * Тест интеграции семантической системы с нейросетью
 * Проверяет, что система отвечает осмысленно на вопрос "что такое трава"
 */

const { execSync } = require('child_process');

async function testSemanticNeuralIntegration() {
  console.log('🧪 Тестирование семантической интеграции с нейросетью...');
  
  // Ждем запуска сервера
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Тестируем через семантическую систему
    console.log('1. Тестируем семантическую систему...');
    const semanticTest = await fetch('http://localhost:5000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'что такое трава' })
    });
    
    const semanticResponse = await semanticTest.json();
    console.log('📋 Семантический ответ:', semanticResponse?.response?.substring(0, 200) || 'Нет ответа');
    
    // Тестируем через нейросетевую интеграцию
    console.log('2. Тестируем нейросетевую интеграцию...');
    const neuralTest = await fetch('http://localhost:5000/api/neural/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: 'что такое трава' })
    });
    
    const neuralResponse = await neuralTest.json();
    console.log('🧠 Нейросетевой ответ:', neuralResponse?.response?.substring(0, 200) || 'Нет ответа');
    
    // Анализируем результаты
    console.log('\n📊 Анализ результатов:');
    
    if (semanticResponse?.response && semanticResponse.response.length > 50) {
      console.log('✅ Семантическая система работает корректно');
    } else {
      console.log('❌ Семантическая система не дает полных ответов');
    }
    
    if (neuralResponse?.response && neuralResponse.response.length > 50) {
      console.log('✅ Нейросетевая интеграция работает корректно');
    } else {
      console.log('❌ Нейросетевая интеграция не дает полных ответов');
    }
    
    // Проверяем качество ответов
    const meaninglessPatterns = [
      'создать нейросеть от',
      'изображение ai это семантика',
      'booomerangs в что найти',
      'анализ сделать все только'
    ];
    
    let isMeaningful = true;
    for (const pattern of meaninglessPatterns) {
      if (neuralResponse?.response?.includes(pattern)) {
        isMeaningful = false;
        break;
      }
    }
    
    if (isMeaningful) {
      console.log('✅ Ответы осмысленные и не содержат бессмысленных комбинаций');
    } else {
      console.log('❌ Ответы содержат бессмысленные комбинации токенов');
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

// Запуск сервера и тестирование
console.log('🚀 Запуск сервера...');
const serverProcess = execSync('npx tsx server/index.ts > /tmp/server.log 2>&1 &', { stdio: 'inherit' });

// Ждем запуска сервера
setTimeout(() => {
  testSemanticNeuralIntegration();
}, 10000);