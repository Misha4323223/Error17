/**
 * Простой скрипт для запуска сервера разработки
 * Обходит проблемы с workflow и запускает сервер напрямую
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запуск BOOOMERANGS Development Server...');

// Устанавливаем переменные окружения
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';

// Путь к основному серверу
const serverPath = path.join(__dirname, 'server', 'index.ts');

// Запускаем сервер с tsx для поддержки TypeScript
const server = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname
});

server.on('close', (code) => {
  console.log(`\n❌ Сервер завершил работу с кодом ${code}`);
  process.exit(code);
});

server.on('error', (error) => {
  console.error('💥 Ошибка запуска сервера:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал терминации...');
  server.kill('SIGTERM');
});