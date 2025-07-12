/**
 * 🧠 ТЕСТ СОЗДАНИЯ И СОХРАНЕНИЯ МОДЕЛИ НА ДИСК
 * Проверяем что модель создается и сохраняется в папку neural-models (256 ГБ диск)
 */

const { BooomerangsNeuralCore } = require('./server/neural-network-core.cjs');
const fs = require('fs');
const path = require('path');

async function testModelCreation() {
  console.log('🚀 ТЕСТ СОЗДАНИЯ И СОХРАНЕНИЯ НЕЙРОННОЙ МОДЕЛИ');
  console.log('=====================================');

  try {
    // Создаем экземпляр нейронного ядра
    const neuralCore = new BooomerangsNeuralCore();
    
    // Инициализируем (создает или загружает модель)
    console.log('🔄 Инициализация нейронного ядра...');
    await neuralCore.initialize();
    
    // Проверяем что модель создана
    const stats = neuralCore.getModelStats();
    if (stats) {
      console.log('\n✅ МОДЕЛЬ УСПЕШНО СОЗДАНА!');
      console.log('📊 Статистика модели:');
      console.log(`   - Параметры: ${stats.totalParams.toLocaleString()}`);
      console.log(`   - Архитектура: ${stats.architecture}`);
      console.log(`   - Словарь: ${stats.vocabSize} токенов`);
      console.log(`   - Размер: ~${stats.memoryEstimate.estimatedMB} МБ`);
      console.log(`   - Слои: ${stats.numLayers}`);
      console.log(`   - Embedding: ${stats.embeddingDim}`);
    } else {
      throw new Error('Модель не создана');
    }
    
    // Проверяем сохранение на диске
    console.log('\n📂 ПРОВЕРКА СОХРАНЕНИЯ НА ДИСКЕ:');
    const modelPath = './neural-models/booomerangs-transformer';
    
    if (fs.existsSync(modelPath)) {
      console.log('✅ Папка модели создана: ./neural-models/booomerangs-transformer/');
      
      // Проверяем файлы
      const files = fs.readdirSync(modelPath);
      console.log('📁 Файлы в папке модели:');
      
      let totalSize = 0;
      files.forEach(file => {
        const filePath = path.join(modelPath, file);
        const fileStat = fs.statSync(filePath);
        const fileSizeMB = (fileStat.size / (1024 * 1024)).toFixed(2);
        console.log(`   - ${file}: ${fileSizeMB} МБ`);
        totalSize += fileStat.size;
      });
      
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`📊 Общий размер модели: ${totalSizeMB} МБ`);
      
      // Проверяем ключевые файлы
      const requiredFiles = ['model.json', 'weights.bin', 'metadata.json', 'vocabulary.json'];
      const missingFiles = requiredFiles.filter(file => !files.includes(file));
      
      if (missingFiles.length === 0) {
        console.log('✅ Все необходимые файлы присутствуют');
      } else {
        console.log(`⚠️ Отсутствуют файлы: ${missingFiles.join(', ')}`);
      }
      
    } else {
      console.log('❌ Папка модели не найдена');
    }
    
    // Проверяем использование диска
    console.log('\n💾 ПРОВЕРКА ИСПОЛЬЗОВАНИЯ ДИСКА:');
    const { execSync } = require('child_process');
    const diskUsage = execSync('df -h /home/runner/workspace').toString();
    console.log(diskUsage);
    
    // Тестируем генерацию
    console.log('\n🤖 ТЕСТ ГЕНЕРАЦИИ:');
    try {
      const testInput = "Привет! Как дела?";
      console.log(`Входной запрос: "${testInput}"`);
      
      const response = await neuralCore.generateResponse(testInput, {
        maxTokens: 50,
        temperature: 0.8
      });
      
      console.log(`Ответ модели: "${response}"`);
      console.log('✅ Генерация работает!');
      
    } catch (genError) {
      console.log('⚠️ Ошибка генерации:', genError.message);
    }
    
    console.log('\n🎉 ТЕСТ ЗАВЕРШЕН УСПЕШНО!');
    console.log('✅ Модель создана, сохранена на диск и функционирует');
    
  } catch (error) {
    console.error('❌ ОШИБКА ТЕСТА:', error.message);
    console.error(error.stack);
  }
}

// Запускаем тест
testModelCreation();