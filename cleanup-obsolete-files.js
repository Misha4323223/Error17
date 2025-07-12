
/**
 * Утилита для очистки устаревших файлов семантической системы
 */

const fs = require('fs').promises;
const path = require('path');

const obsoletePatterns = [
  '*-old.cjs',
  '*-old.js', 
  '*.backup',
  '*-broken.cjs',
  'test-*.js',
  'debug-*.cjs'
];

const protectedFiles = [
  'test-semantic-memory.js',
  'test-semantic-integration.js',
  'test-meta-semantic-integration.js'
];

async function findObsoleteFiles(dir) {
  const obsoleteFiles = [];
  
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        const subFiles = await findObsoleteFiles(fullPath);
        obsoleteFiles.push(...subFiles);
      } else {
        // Проверяем на устаревшие паттерны
        const isObsolete = obsoletePatterns.some(pattern => {
          const regex = new RegExp(pattern.replace('*', '.*'));
          return regex.test(file.name);
        });
        
        // Исключаем защищенные файлы
        const isProtected = protectedFiles.includes(file.name);
        
        if (isObsolete && !isProtected) {
          const stats = await fs.stat(fullPath);
          const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          
          obsoleteFiles.push({
            path: fullPath,
            name: file.name,
            size: stats.size,
            lastModified: stats.mtime,
            daysSinceModified: Math.round(daysSinceModified)
          });
        }
      }
    }
  } catch (error) {
    console.error(`Ошибка при сканировании ${dir}:`, error.message);
  }
  
  return obsoleteFiles;
}

async function cleanupObsoleteFiles() {
  console.log('🧹 Запуск очистки устаревших файлов семантической системы...\n');
  
  const directories = [
    './server',
    './server/semantic-memory',
    './'
  ];
  
  let totalFiles = 0;
  let totalSize = 0;
  
  for (const dir of directories) {
    console.log(`📂 Сканирование: ${dir}`);
    const obsoleteFiles = await findObsoleteFiles(dir);
    
    if (obsoleteFiles.length === 0) {
      console.log('✅ Устаревших файлов не найдено\n');
      continue;
    }
    
    console.log(`📋 Найдено ${obsoleteFiles.length} устаревших файлов:\n`);
    
    for (const file of obsoleteFiles) {
      console.log(`  🗑️  ${file.name}`);
      console.log(`      📍 ${file.path}`);
      console.log(`      📦 ${(file.size / 1024).toFixed(1)} KB`);
      console.log(`      📅 ${file.daysSinceModified} дней назад\n`);
      
      totalFiles++;
      totalSize += file.size;
    }
  }
  
  console.log(`📊 Итого найдено: ${totalFiles} файлов, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n🔧 Для удаления запустите: node cleanup-obsolete-files.js --delete');
}

// Запуск очистки
if (require.main === module) {
  cleanupObsoleteFiles().catch(console.error);
}

module.exports = { findObsoleteFiles, cleanupObsoleteFiles };
