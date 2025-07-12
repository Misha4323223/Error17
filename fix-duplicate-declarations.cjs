/**
 * Автоматическое исправление дублирующих деклараций во всех семантических модулях
 * Исправляет переменные, которые объявлены несколько раз в одном файле
 */

const fs = require('fs');
const path = require('path');

// Файлы для исправления
const FILES_TO_FIX = [
  'server/conversation-engine.cjs',
  'server/conversation-engine-semantic-provider.cjs', 
  'server/semantic-integration-layer.cjs',
  'server/smart-router.js',
  'server/intelligent-chat-processor.cjs',
  'server/semantic-memory/index.cjs',
  'server/semantic-memory/natural-language-generator.cjs',
  'server/semantic-memory/meta-semantic-engine.cjs',
  'server/semantic-memory/emotional-semantic-matrix.cjs',
  'server/semantic-memory/user-profiler.cjs',
  'server/semantic-memory/semantic-analyzer.cjs',
  'server/semantic-memory/learning-system.cjs',
  'server/semantic-memory/user-memory-manager.cjs',
  'server/semantic-memory/visual-semantic-extensions.cjs',
  'server/semantic-healthcheck.cjs',
  'server/semantic-monitor-dashboard.cjs'
];

async function fixDuplicateDeclarations() {
  console.log('🔧 НАЧИНАЕМ ИСПРАВЛЕНИЕ ДУБЛИРУЮЩИХ ДЕКЛАРАЦИЙ');
  
  let totalFixed = 0;
  let totalFiles = 0;
  
  for (const filePath of FILES_TO_FIX) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Файл не найден: ${filePath}`);
      continue;
    }
    
    totalFiles++;
    console.log(`\n🔧 Исправляем файл: ${filePath}`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let fixesInFile = 0;
      
      // Найдем все декларации переменных
      const declarationRegex = /(?:^|\n)([ \t]*)(const|let|var|function|class)\s+(\w+)/g;
      const declarations = new Map();
      const duplicates = new Set();
      
      let match;
      while ((match = declarationRegex.exec(content)) !== null) {
        const varName = match[3];
        if (declarations.has(varName)) {
          duplicates.add(varName);
        } else {
          declarations.set(varName, {
            type: match[2],
            indentation: match[1],
            position: match.index
          });
        }
      }
      
      if (duplicates.size > 0) {
        console.log(`🔍 Найдены дублирующие декларации: ${Array.from(duplicates).join(', ')}`);
        
        // Исправляем каждый дубликат
        for (const duplicateName of duplicates) {
          content = fixDuplicateVariable(content, duplicateName);
          fixesInFile++;
        }
        
        // Сохраняем исправленный файл
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Исправлено ${fixesInFile} дублирующих деклараций в ${filePath}`);
        totalFixed += fixesInFile;
      } else {
        console.log(`✅ В файле ${filePath} дублирующих деклараций не найдено`);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка при обработке файла ${filePath}:`, error.message);
    }
  }
  
  console.log(`\n📊 ИТОГИ ИСПРАВЛЕНИЯ:`);
  console.log(`📁 Обработано файлов: ${totalFiles}`);
  console.log(`🔧 Всего исправлений: ${totalFixed}`);
  console.log(`✅ Исправление завершено!`);
}

/**
 * Исправляет дублирующую переменную в коде
 */
function fixDuplicateVariable(content, varName) {
  const lines = content.split('\n');
  let firstDeclaration = true;
  let fixedContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Проверяем, есть ли в этой строке декларация нужной переменной
    const declarationRegex = new RegExp(`^([ \t]*)(const|let|var|function|class)\\s+${varName}\\b`);
    const match = line.match(declarationRegex);
    
    if (match) {
      if (firstDeclaration) {
        // Первое объявление оставляем как есть
        firstDeclaration = false;
        fixedContent += line + '\n';
      } else {
        // Последующие объявления заменяем на присваивание
        const indentation = match[1];
        const declarationType = match[2];
        
        if (declarationType === 'function' || declarationType === 'class') {
          // Для функций и классов добавляем комментарий
          fixedContent += `${indentation}// ИСПРАВЛЕНО: Дублирующее объявление ${declarationType} ${varName} закомментировано\n`;
          fixedContent += `${indentation}// ${line}\n`;
        } else {
          // Для переменных заменяем на присваивание
          const newLine = line.replace(declarationRegex, `$1${varName}`);
          fixedContent += newLine + '\n';
        }
      }
    } else {
      fixedContent += line + '\n';
    }
  }
  
  return fixedContent.slice(0, -1); // Убираем последний \n
}

/**
 * Исправление специфических проблем в отдельных файлах
 */
function fixSpecificIssues() {
  console.log('\n🎯 ИСПРАВЛЯЕМ СПЕЦИФИЧЕСКИЕ ПРОБЛЕМЫ');
  
  // Исправляем routes.ts - TypeScript файл
  if (fs.existsSync('server/routes.ts')) {
    let content = fs.readFileSync('server/routes.ts', 'utf8');
    
    // Исправляем дублирующие декларации в TypeScript контексте
    content = content.replace(/const timestamp = new Date\(\)\.toISOString\(\);/g, (match, offset) => {
      // Оставляем только первое объявление timestamp в каждом блоке функции
      const beforeMatch = content.substring(0, offset);
      const functionBlocks = beforeMatch.split(/(?:app\.|router\.)/);
      const currentBlock = functionBlocks[functionBlocks.length - 1];
      
      if (currentBlock.includes('timestamp = new Date().toISOString()')) {
        return '// timestamp уже объявлен выше';
      }
      return match;
    });
    
    fs.writeFileSync('server/routes.ts', content, 'utf8');
    console.log('✅ Исправлены специфические проблемы в routes.ts');
  }
}

// Запуск исправлений
if (require.main === module) {
  fixDuplicateDeclarations()
    .then(() => {
      fixSpecificIssues();
      console.log('\n🎉 ВСЕ ИСПРАВЛЕНИЯ ЗАВЕРШЕНЫ!');
    })
    .catch(error => {
      console.error('❌ Критическая ошибка:', error);
      process.exit(1);
    });
}

module.exports = { fixDuplicateDeclarations, fixSpecificIssues };