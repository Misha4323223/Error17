/**
 * Комплексное исправление всех оставшихся проблем
 * Более точное исправление дублирующих деклараций с учетом контекста
 */

const fs = require('fs');

async function comprehensiveFix() {
  console.log('🔧 КОМПЛЕКСНОЕ ИСПРАВЛЕНИЕ ВСЕХ ПРОБЛЕМ');
  
  // 1. Исправляем semantic-integration-layer.cjs
  console.log('🔧 Исправляем semantic-integration-layer.cjs...');
  if (fs.existsSync('server/semantic-integration-layer.cjs')) {
    let content = fs.readFileSync('server/semantic-integration-layer.cjs', 'utf8');
    
    // Находим все объявления naturalLanguageGenerator
    const lines = content.split('\n');
    let firstNLGFound = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('const naturalLanguageGenerator =') || lines[i].includes('let naturalLanguageGenerator =')) {
        if (firstNLGFound) {
          // Заменяем повторные объявления на присваивание
          lines[i] = lines[i].replace(/(?:const|let)\s+naturalLanguageGenerator/, 'naturalLanguageGenerator');
        } else {
          firstNLGFound = true;
        }
      }
    }
    
    content = lines.join('\n');
    fs.writeFileSync('server/semantic-integration-layer.cjs', content, 'utf8');
    console.log('✅ semantic-integration-layer.cjs исправлен');
  }

  // 2. Исправляем smart-router.js
  console.log('🔧 Исправляем smart-router.js...');
  if (fs.existsSync('server/smart-router.js')) {
    let content = fs.readFileSync('server/smart-router.js', 'utf8');
    
    const lines = content.split('\n');
    let firstProviderFound = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('const provider =') || lines[i].includes('let provider =')) {
        if (firstProviderFound) {
          lines[i] = lines[i].replace(/(?:const|let)\s+provider/, 'provider');
        } else {
          firstProviderFound = true;
        }
      }
    }
    
    content = lines.join('\n');
    fs.writeFileSync('server/smart-router.js', content, 'utf8');
    console.log('✅ smart-router.js исправлен');
  }

  // 3. Исправляем routes.ts с учетом блоков функций
  console.log('🔧 Исправляем routes.ts...');
  if (fs.existsSync('server/routes.ts')) {
    let content = fs.readFileSync('server/routes.ts', 'utf8');
    
    // Разбиваем на функции/блоки по app. и router.
    const functionBlocks = content.split(/(app\.|router\.)/);
    
    for (let blockIndex = 1; blockIndex < functionBlocks.length; blockIndex += 2) {
      let block = functionBlocks[blockIndex + 1];
      if (!block) continue;
      
      // В каждом блоке исправляем дублирующие переменные
      const duplicateVars = ['timestamp', 'filePath', 'moduleName', 'status', 'results', 'result', 'userId', 'sessions', 'sessionId', 'messageData', 'aiResponse', 'aiMessageData', 'token', 'response', 'claudeProvider', 'ollamaResponse', 'ollamaProvider', 'uploadedImage'];
      
      for (const varName of duplicateVars) {
        const regex = new RegExp(`(const|let|var)\\s+${varName}\\s*=`, 'g');
        let count = 0;
        block = block.replace(regex, (match) => {
          count++;
          if (count > 1) {
            return `${varName} =`;
          }
          return match;
        });
      }
      
      functionBlocks[blockIndex + 1] = block;
    }
    
    content = functionBlocks.join('');
    fs.writeFileSync('server/routes.ts', content, 'utf8');
    console.log('✅ routes.ts исправлен');
  }

  // 4. Исправляем semantic-memory/index.cjs с учетом scope
  console.log('🔧 Исправляем semantic-memory/index.cjs...');
  if (fs.existsSync('server/semantic-memory/index.cjs')) {
    let content = fs.readFileSync('server/semantic-memory/index.cjs', 'utf8');
    
    // Исправляем специфично для этого файла
    const lines = content.split('\n');
    const declaredVars = new Set();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Проверяем объявления переменных
      const match = line.match(/^\s*(const|let|var)\s+(\w+)\s*=/);
      if (match) {
        const varName = match[2];
        if (declaredVars.has(varName)) {
          // Заменяем на присваивание
          lines[i] = line.replace(/^\s*(const|let|var)\s+/, '    ');
        } else {
          declaredVars.add(varName);
        }
      }
    }
    
    content = lines.join('\n');
    fs.writeFileSync('server/semantic-memory/index.cjs', content, 'utf8');
    console.log('✅ semantic-memory/index.cjs исправлен');
  }

  console.log('✅ Комплексное исправление завершено!');
}

// Запуск
if (require.main === module) {
  comprehensiveFix().catch(error => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  });
}

module.exports = { comprehensiveFix };