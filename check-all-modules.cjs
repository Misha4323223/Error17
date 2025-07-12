/**
 * Комплексная проверка всех семантических модулей на ошибки
 * Анализирует синтаксис, зависимости и функциональность
 */

const fs = require('fs');
const path = require('path');

// Список всех ключевых модулей для проверки
const MODULES_TO_CHECK = [
  // Основные серверные модули
  'server/conversation-engine.cjs',
  'server/conversation-engine-semantic-provider.cjs', 
  'server/semantic-integration-layer.cjs',
  'server/smart-router.js',
  'server/intelligent-chat-processor.cjs',
  'server/routes.ts',
  
  // Семантические модули
  'server/semantic-memory/index.cjs',
  'server/semantic-memory/natural-language-generator.cjs',
  'server/semantic-memory/meta-semantic-engine.cjs',
  'server/semantic-memory/emotional-semantic-matrix.cjs',
  'server/semantic-memory/user-profiler.cjs',
  'server/semantic-memory/semantic-analyzer.cjs',
  'server/semantic-memory/learning-system.cjs',
  'server/semantic-memory/user-memory-manager.cjs',
  'server/semantic-memory/visual-semantic-extensions.cjs',
  
  // Системные модули
  'server/semantic-healthcheck.cjs',
  'server/semantic-monitor-dashboard.cjs'
];

async function checkAllModules() {
  console.log('🔍 НАЧИНАЕМ КОМПЛЕКСНУЮ ПРОВЕРКУ ВСЕХ МОДУЛЕЙ');
  console.log(`📋 Всего модулей для проверки: ${MODULES_TO_CHECK.length}`);
  
  const results = {
    total: MODULES_TO_CHECK.length,
    passed: 0,
    failed: 0,
    errors: [],
    warnings: []
  };
  
  for (const modulePath of MODULES_TO_CHECK) {
    console.log(`\n🧪 Проверяем модуль: ${modulePath}`);
    
    try {
      // Проверка 1: Существование файла
      if (!fs.existsSync(modulePath)) {
        const error = `❌ Файл не существует: ${modulePath}`;
        console.log(error);
        results.errors.push(error);
        results.failed++;
        continue;
      }
      
      // Проверка 2: Чтение файла
      let content;
      try {
        content = fs.readFileSync(modulePath, 'utf8');
      } catch (readError) {
        const error = `❌ Ошибка чтения файла ${modulePath}: ${readError.message}`;
        console.log(error);
        results.errors.push(error);
        results.failed++;
        continue;
      }
      
      // Проверка 3: Синтаксические ошибки
      const syntaxErrors = checkSyntaxErrors(content, modulePath);
      if (syntaxErrors.length > 0) {
        syntaxErrors.forEach(error => {
          console.log(`❌ Синтаксическая ошибка в ${modulePath}: ${error}`);
          results.errors.push(`${modulePath}: ${error}`);
        });
        results.failed++;
        continue;
      }
      
      // Проверка 4: Структурные проблемы
      const structuralIssues = checkStructuralIssues(content, modulePath);
      if (structuralIssues.length > 0) {
        structuralIssues.forEach(issue => {
          console.log(`⚠️ Структурная проблема в ${modulePath}: ${issue}`);
          results.warnings.push(`${modulePath}: ${issue}`);
        });
      }
      
      // Проверка 5: Загрузка модуля (только для .cjs)
      if (modulePath.endsWith('.cjs')) {
        try {
          // Очистим кэш require
          const absolutePath = path.resolve(modulePath);
          if (require.cache[absolutePath]) {
            delete require.cache[absolutePath];
          }
          
          const module = require(`./${modulePath}`);
          console.log(`✅ Модуль ${modulePath} загружается корректно`);
          
          // Проверяем основные экспорты
          if (typeof module === 'object' && Object.keys(module).length === 0) {
            const warning = `Модуль ${modulePath} имеет пустые экспорты`;
            console.log(`⚠️ ${warning}`);
            results.warnings.push(warning);
          }
          
        } catch (loadError) {
          const error = `❌ Ошибка загрузки модуля ${modulePath}: ${loadError.message}`;
          console.log(error);
          results.errors.push(error);
          results.failed++;
          continue;
        }
      }
      
      console.log(`✅ Модуль ${modulePath} прошел проверку`);
      results.passed++;
      
    } catch (generalError) {
      const error = `❌ Общая ошибка при проверке ${modulePath}: ${generalError.message}`;
      console.log(error);
      results.errors.push(error);
      results.failed++;
    }
  }
  
  // Итоговые результаты
  console.log('\n📊 ИТОГИ ПРОВЕРКИ МОДУЛЕЙ:');
  console.log(`✅ Успешно: ${results.passed}/${results.total}`);
  console.log(`❌ Ошибок: ${results.failed}/${results.total}`);
  console.log(`⚠️ Предупреждений: ${results.warnings.length}`);
  console.log(`📈 Процент успешности: ${Math.round((results.passed / results.total) * 100)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ СПИСОК КРИТИЧЕСКИХ ОШИБОК:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️ СПИСОК ПРЕДУПРЕЖДЕНИЙ:');
    results.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
  }
  
  return results;
}

/**
 * Проверка синтаксических ошибок в коде
 */
function checkSyntaxErrors(content, filePath) {
  const errors = [];
  
  // Проверка парных скобок
  const brackets = { '{': 0, '(': 0, '[': 0 };
  const quotes = { "'": 0, '"': 0, '`': 0 };
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (char === '{') brackets['{']++;
    else if (char === '}') brackets['{']--;
    else if (char === '(') brackets['(']++;
    else if (char === ')') brackets['(']--;
    else if (char === '[') brackets['[']++;
    else if (char === ']') brackets['[']--;
  }
  
  // Проверяем баланс скобок
  if (brackets['{'] !== 0) errors.push('Несбалансированные фигурные скобки {}');
  if (brackets['('] !== 0) errors.push('Несбалансированные круглые скобки ()');
  if (brackets['['] !== 0) errors.push('Несбалансированные квадратные скобки []');
  
  // Проверка дублирующих деклараций
  const declarations = content.match(/(?:const|let|var|function|class)\s+(\w+)/g);
  if (declarations) {
    const names = declarations.map(d => d.split(/\s+/)[1]);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Дублирующие декларации: ${[...new Set(duplicates)].join(', ')}`);
    }
  }
  
  // Проверка неправильных template literals
  if (content.includes('${') && !content.includes('`')) {
    errors.push('Обнаружены template literal выражения без backticks');
  }
  
  return errors;
}

/**
 * Проверка структурных проблем
 */
function checkStructuralIssues(content, filePath) {
  const issues = [];
  
  // Проверка экспортов
  if (filePath.endsWith('.cjs')) {
    if (!content.includes('module.exports') && !content.includes('exports.')) {
      issues.push('CommonJS модуль без экспортов');
    }
  }
  
  // Проверка импортов в .cjs файлах
  if (filePath.endsWith('.cjs') && content.includes('import ')) {
    issues.push('ES6 импорты в CommonJS модуле');
  }
  
  // Проверка смешанного стиля кавычек
  const singleQuotes = (content.match(/'/g) || []).length;
  const doubleQuotes = (content.match(/"/g) || []).length;
  const backticks = (content.match(/`/g) || []).length;
  
  if (singleQuotes > 0 && doubleQuotes > 0 && Math.abs(singleQuotes - doubleQuotes) > 20) {
    issues.push('Смешанный стиль кавычек (одинарные и двойные)');
  }
  
  // Проверка console.log в продакшене
  const consoleCount = (content.match(/console\.(log|info|warn|error)/g) || []).length;
  if (consoleCount > 50) {
    issues.push(`Много console вызовов (${consoleCount}), рекомендуется использовать logger`);
  }
  
  return issues;
}

// Запуск проверки
if (require.main === module) {
  checkAllModules().catch(error => {
    console.error('❌ Критическая ошибка при проверке модулей:', error);
    process.exit(1);
  });
}

module.exports = { checkAllModules };