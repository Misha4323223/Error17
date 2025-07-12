
#!/usr/bin/env node
/**
 * ДИАГНОСТИКА СТРУКТУРЫ EXPORTS
 * Проверяет корректность всех exports в семантических модулях
 */

const fs = require('fs');
const path = require('path');

const problematicFiles = [
  'server/semantic-memory/creative-semantic-engine.cjs',
  'server/semantic-memory/external-knowledge-integrator.cjs', 
  'server/semantic-memory/learning-system.cjs',
  'server/semantic-memory/meta-semantic-engine.cjs'
];

console.log('🔍 ДИАГНОСТИКА СТРУКТУРЫ EXPORTS');
console.log('================================\n');

function analyzeExportsStructure(filePath) {
  console.log(`📄 Анализ файла: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ Файл не найден\n');
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Проверка базовой структуры
    const hasModuleExports = content.includes('module.exports');
    const bracketBalance = checkBracketBalance(content);
    const exportStructure = analyzeExportStructure(content);
    
    console.log(`   📋 module.exports найден: ${hasModuleExports ? '✅' : '❌'}`);
    console.log(`   🔧 Баланс скобок: ${bracketBalance.isBalanced ? '✅' : '❌'}`);
    
    if (!bracketBalance.isBalanced) {
      console.log(`      Открывающих: ${bracketBalance.opening}, Закрывающих: ${bracketBalance.closing}`);
    }
    
    console.log(`   📦 Структура exports: ${exportStructure.isValid ? '✅' : '❌'}`);
    
    if (exportStructure.issues.length > 0) {
      console.log('   ⚠️ Обнаруженные проблемы:');
      exportStructure.issues.forEach(issue => {
        console.log(`      - ${issue}`);
      });
    }
    
    console.log('');
    return hasModuleExports && bracketBalance.isBalanced && exportStructure.isValid;
    
  } catch (error) {
    console.log(`❌ Ошибка чтения файла: ${error.message}\n`);
    return false;
  }
}

function checkBracketBalance(content) {
  let openingBraces = 0;
  let closingBraces = 0;
  let openingParens = 0;
  let closingParens = 0;
  
  for (let char of content) {
    switch (char) {
      case '{': openingBraces++; break;
      case '}': closingBraces++; break;
      case '(': openingParens++; break;
      case ')': closingParens++; break;
    }
  }
  
  return {
    isBalanced: openingBraces === closingBraces && openingParens === closingParens,
    opening: openingBraces,
    closing: closingBraces,
    openingParens,
    closingParens
  };
}

function analyzeExportStructure(content) {
  const issues = [];
  let isValid = true;
  
  // Проверка на дублирование переменных в exports
  const exportLines = content.split('\n').filter(line => line.includes('module.exports'));
  
  if (exportLines.length === 0) {
    issues.push('module.exports не найден');
    isValid = false;
  }
  
  // Проверка на корректность bind()
  const bindMatches = content.match(/\.bind\([^)]*\)/g) || [];
  bindMatches.forEach(bindCall => {
    if (!bindCall.includes('this.') && !bindCall.includes('instance.')) {
      issues.push(`Потенциально некорректный bind: ${bindCall}`);
    }
  });
  
  // Проверка на корректность структуры объекта exports
  const moduleExportsMatch = content.match(/module\.exports\s*=\s*{[\s\S]*?};/);
  if (moduleExportsMatch) {
    const exportsContent = moduleExportsMatch[0];
    
    // Проверка на запятые
    const lines = exportsContent.split('\n').filter(line => line.trim());
    for (let i = 1; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line && !line.endsWith(',') && !line.endsWith('{') && !line.includes('//')) {
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && !nextLine.startsWith('}')) {
          issues.push(`Возможно отсутствует запятая в строке: ${line}`);
        }
      }
    }
  }
  
  return { isValid: isValid && issues.length === 0, issues };
}

// Запуск диагностики
let allValid = true;

for (const file of problematicFiles) {
  const isValid = analyzeExportsStructure(file);
  allValid = allValid && isValid;
}

console.log('📊 ИТОГОВЫЙ РЕЗУЛЬТАТ');
console.log('====================');
console.log(`Статус: ${allValid ? '✅ ВСЕ ФАЙЛЫ КОРРЕКТНЫ' : '❌ ОБНАРУЖЕНЫ ПРОБЛЕМЫ'}`);

if (!allValid) {
  console.log('\n🔧 РЕКОМЕНДАЦИИ:');
  console.log('1. Исправить синтаксические ошибки');
  console.log('2. Проверить баланс скобок');
  console.log('3. Убедиться в корректности структуры exports');
}

process.exit(allValid ? 0 : 1);
