

/**
 * 🚀 ПАРАЛЛЕЛЬНЫЙ ЗАПУСК ВСЕХ НЕЙРОСЕТЕВЫХ ЗАДАЧ
 * Одновременно выполняет расширение словаря и обучение 12-слойной нейросети
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 BOOOMERANGS: ПАРАЛЛЕЛЬНЫЙ ЗАПУСК НЕЙРОСЕТЕВЫХ ЗАДАЧ');
console.log('==================================================');

async function startBothNeuralTasks() {
  try {
    console.log('🔥 Запускаем ОБА процесса параллельно...');
    
    // Запускаем расширение словаря и обучение LITE
    const vocabularyProcess = spawn('node', ['start-vocabulary-expansion.cjs'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    // Запускаем обучение 12-слойной нейросети
    const neuralTrainingProcess = spawn('node', ['start-neural-training.cjs'], {
      stdio: 'inherit', 
      cwd: process.cwd()
    });

    console.log('📊 Процессы запущены:');
    console.log(`   🧠 Расширение словаря (PID: ${vocabularyProcess.pid})`);
    console.log(`   🔥 Обучение 12-слойной нейросети (PID: ${neuralTrainingProcess.pid})`);

    // Отслеживаем завершение процессов
    const processPromises = [
      new Promise((resolve, reject) => {
        vocabularyProcess.on('exit', (code) => {
          if (code === 0) {
            console.log('✅ Расширение словаря завершено успешно');
            resolve({ task: 'vocabulary', success: true });
          } else {
            console.log('❌ Расширение словаря завершено с ошибкой');
            reject({ task: 'vocabulary', success: false, code });
          }
        });
        
        vocabularyProcess.on('error', (error) => {
          console.error('❌ Ошибка процесса расширения словаря:', error);
          reject({ task: 'vocabulary', error });
        });
      }),

      new Promise((resolve, reject) => {
        neuralTrainingProcess.on('exit', (code) => {
          if (code === 0) {
            console.log('✅ Обучение 12-слойной нейросети завершено успешно');
            resolve({ task: 'neural-training', success: true });
          } else {
            console.log('❌ Обучение 12-слойной нейросети завершено с ошибкой');
            reject({ task: 'neural-training', success: false, code });
          }
        });

        neuralTrainingProcess.on('error', (error) => {
          console.error('❌ Ошибка процесса обучения нейросети:', error);
          reject({ task: 'neural-training', error });
        });
      })
    ];

    // Ждем завершения всех процессов
    console.log('⏳ Ожидаем завершения обеих задач...');
    const results = await Promise.allSettled(processPromises);

    console.log('\n🎉 ИТОГОВЫЙ ОТЧЕТ');
    console.log('=================');

    let successCount = 0;
    results.forEach((result, index) => {
      const taskName = index === 0 ? 'Расширение словаря' : 'Обучение нейросети';
      
      if (result.status === 'fulfilled') {
        console.log(`✅ ${taskName}: УСПЕШНО`);
        successCount++;
      } else {
        console.log(`❌ ${taskName}: ОШИБКА`, result.reason);
      }
    });

    if (successCount === 2) {
      console.log('\n🎊 ВСЕ ЗАДАЧИ ВЫПОЛНЕНЫ УСПЕШНО!');
      console.log('📈 Нейросеть BOOOMERANGS готова к работе с расширенным словарем');
      process.exit(0);
    } else {
      console.log('\n⚠️ Некоторые задачи завершились с ошибками');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
    process.exit(1);
  }
}

// Обработка сигналов для graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал прерывания, завершаем процессы...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал завершения, завершаем процессы...');
  process.exit(0);
});

// Запуск если вызвано напрямую
if (require.main === module) {
  startBothNeuralTasks().catch(console.error);
}

module.exports = { startBothNeuralTasks };

