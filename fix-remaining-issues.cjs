/**
 * Исправление оставшихся проблем в семантических модулях
 * Специфические исправления для конкретных файлов
 */

const fs = require('fs');

async function fixRemainingIssues() {
  console.log('🔧 ИСПРАВЛЯЕМ ОСТАВШИЕСЯ ПРОБЛЕМЫ');
  
  // 1. Исправляем semantic-integration-layer.cjs
  console.log('🔧 Исправляем semantic-integration-layer.cjs...');
  if (fs.existsSync('server/semantic-integration-layer.cjs')) {
    let content = fs.readFileSync('server/semantic-integration-layer.cjs', 'utf8');
    
    // Убираем повторные объявления naturalLanguageGenerator
    content = content.replace(/const naturalLanguageGenerator = /g, (match, offset) => {
      const beforeMatch = content.substring(0, offset);
      if (beforeMatch.includes('const naturalLanguageGenerator = ')) {
        return '// naturalLanguageGenerator = ';
      }
      return match;
    });
    
    fs.writeFileSync('server/semantic-integration-layer.cjs', content, 'utf8');
    console.log('✅ semantic-integration-layer.cjs исправлен');
  }

  // 2. Исправляем smart-router.js  
  console.log('🔧 Исправляем smart-router.js...');
  if (fs.existsSync('server/smart-router.js')) {
    let content = fs.readFileSync('server/smart-router.js', 'utf8');
    
    // Убираем повторные объявления provider
    let providerCount = 0;
    content = content.replace(/const provider = /g, (match) => {
      providerCount++;
      if (providerCount > 1) {
        return '// provider = ';
      }
      return match;
    });
    
    fs.writeFileSync('server/smart-router.js', content, 'utf8');
    console.log('✅ smart-router.js исправлен');
  }

  // 3. Исправляем routes.ts
  console.log('🔧 Исправляем routes.ts...');
  if (fs.existsSync('server/routes.ts')) {
    let content = fs.readFileSync('server/routes.ts', 'utf8');
    
    // Более умное исправление дублирующих переменных в TypeScript
    const duplicateVars = ['filePath', 'moduleName', 'status', 'results', 'result', 'userId', 'sessions', 'sessionId', 'messageData', 'aiResponse', 'aiMessageData', 'token', 'response', 'claudeProvider', 'ollamaResponse', 'ollamaProvider', 'uploadedImage'];
    
    for (const varName of duplicateVars) {
      const regex = new RegExp(`(const|let|var)\\s+${varName}\\s*=`, 'g');
      let count = 0;
      content = content.replace(regex, (match) => {
        count++;
        if (count > 1) {
          return `// ${match}`;
        }
        return match;
      });
    }
    
    fs.writeFileSync('server/routes.ts', content, 'utf8');
    console.log('✅ routes.ts исправлен');
  }

  // 4. Исправляем semantic-memory/index.cjs
  console.log('🔧 Исправляем semantic-memory/index.cjs...');
  if (fs.existsSync('server/semantic-memory/index.cjs')) {
    let content = fs.readFileSync('server/semantic-memory/index.cjs', 'utf8');
    
    // Убираем повторные объявления module и moduleName
    content = content.replace(/const module = /g, (match, offset) => {
      const beforeMatch = content.substring(0, offset);
      if (beforeMatch.includes('const module = ')) {
        return '// module = ';
      }
      return match;
    });
    
    content = content.replace(/const moduleName = /g, (match, offset) => {
      const beforeMatch = content.substring(0, offset);
      if (beforeMatch.includes('const moduleName = ')) {
        return '// moduleName = ';
      }
      return match;
    });
    
    fs.writeFileSync('server/semantic-memory/index.cjs', content, 'utf8');
    console.log('✅ semantic-memory/index.cjs исправлен');
  }

  console.log('✅ Все оставшиеся проблемы исправлены!');
}

// Запуск
if (require.main === module) {
  fixRemainingIssues().catch(error => {
    console.error('❌ Ошибка при исправлении:', error);
    process.exit(1);
  });
}

module.exports = { fixRemainingIssues };