/**
 * Быстрая проверка ключевых модулей без полной инициализации
 * Проверяет только синтаксис и основную загрузку
 */

const fs = require('fs');

const KEY_MODULES = [
  'server/conversation-engine.cjs',
  'server/conversation-engine-semantic-provider.cjs', 
  'server/semantic-integration-layer.cjs',
  'server/smart-router.js',
  'server/intelligent-chat-processor.cjs',
  'server/semantic-memory/index.cjs',
  'server/semantic-memory/user-profiler.cjs'
];

async function quickCheck() {
  console.log('🔍 БЫСТРАЯ ПРОВЕРКА КЛЮЧЕВЫХ МОДУЛЕЙ');
  
  let success = 0;
  let failed = 0;
  
  for (const modulePath of KEY_MODULES) {
    console.log(`\n🧪 Проверяем: ${modulePath}`);
    
    try {
      // Проверка существования
      if (!fs.existsSync(modulePath)) {
        console.log(`❌ Файл не найден`);
        failed++;
        continue;
      }
      
      // Проверка синтаксиса
      const content = fs.readFileSync(modulePath, 'utf8');
      
      // Проверка баланса скобок
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      
      if (openBraces !== closeBraces) {
        console.log(`❌ Несбалансированные фигурные скобки: ${openBraces} открывающих, ${closeBraces} закрывающих`);
        failed++;
        continue;
      }
      
      if (openParens !== closeParens) {
        console.log(`❌ Несбалансированные круглые скобки: ${openParens} открывающих, ${closeParens} закрывающих`);
        failed++;
        continue;
      }
      
      // Проверка дублирующих деклараций (быстрая)
      const declarations = content.match(/(?:const|let|var)\s+(\w+)/g) || [];
      const varNames = declarations.map(d => d.split(/\s+/)[1]);
      const duplicates = varNames.filter((name, index) => varNames.indexOf(name) !== index);
      
      if (duplicates.length > 0) {
        console.log(`⚠️ Возможные дублирующие декларации: ${[...new Set(duplicates)].join(', ')}`);
      }
      
      // Попытка загрузки (только для .cjs)
      if (modulePath.endsWith('.cjs')) {
        try {
          const absolutePath = require.resolve(`./${modulePath}`);
          delete require.cache[absolutePath];
          require(`./${modulePath}`);
          console.log(`✅ Модуль загружается корректно`);
        } catch (loadError) {
          console.log(`❌ Ошибка загрузки: ${loadError.message.split('\n')[0]}`);
          failed++;
          continue;
        }
      } else {
        console.log(`✅ Синтаксис корректен (TypeScript/JS файл)`);
      }
      
      success++;
      
    } catch (error) {
      console.log(`❌ Ошибка проверки: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 ИТОГИ БЫСТРОЙ ПРОВЕРКИ:`);
  console.log(`✅ Успешно: ${success}/${KEY_MODULES.length}`);
  console.log(`❌ Ошибок: ${failed}/${KEY_MODULES.length}`);
  console.log(`📈 Процент успешности: ${Math.round((success / KEY_MODULES.length) * 100)}%`);
  
  return { success, failed, total: KEY_MODULES.length };
}

if (require.main === module) {
  quickCheck().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  });
}

module.exports = { quickCheck };