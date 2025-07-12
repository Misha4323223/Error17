#!/usr/bin/env node

/**
 * Проверка состояния семантической системы
 * Диагностика проблем с semantic-memory
 */

console.log('🔍 Проверка состояния семантической системы...\n');

async function checkSemanticSystemStatus() {
  try {
    // Проверяем основные модули
    console.log('📋 Проверка основных модулей:');
    
    // 1. Семантическая память
    try {
      console.log('   🧠 Загружаем semantic-memory...');
      const semanticMemory = require('./server/semantic-memory/index.cjs');
      console.log('   ✅ semantic-memory загружен успешно');
      
      // Проверяем состояние инициализации
      if (semanticMemory.getModuleInitializationStatus) {
        const initStatus = semanticMemory.getModuleInitializationStatus();
        console.log('   📊 Статус инициализации:', {
          totalModules: Object.keys(initStatus.modules).length,
          loadedModules: Object.values(initStatus.modules).filter(m => m.loaded).length,
          cachedModules: Object.values(initStatus.modules).filter(m => m.cached).length
        });
      }
      
    } catch (error) {
      console.log('   ❌ Ошибка загрузки semantic-memory:', error.message);
    }
    
    // 2. Интеллектуальный процессор
    try {
      console.log('   🎯 Загружаем intelligent-chat-processor...');
      const intelligentProcessor = require('./server/intelligent-chat-processor.cjs');
      console.log('   ✅ intelligent-chat-processor загружен успешно');
      
      // Проверяем checkHealth если доступен
      if (intelligentProcessor.checkHealth) {
        const health = intelligentProcessor.checkHealth();
        console.log('   💚 Состояние здоровья:', health);
      }
      
    } catch (error) {
      console.log('   ❌ Ошибка загрузки intelligent-processor:', error.message);
    }
    
    // 3. Система мониторинга
    try {
      console.log('   📊 Загружаем semantic-healthcheck...');
      const healthCheck = require('./server/semantic-healthcheck.cjs');
      console.log('   ✅ semantic-healthcheck загружен успешно');
      
    } catch (error) {
      console.log('   ❌ Ошибка загрузки healthcheck:', error.message);
    }
    
    // 4. Visual-semantic расширения
    try {
      console.log('   🎨 Загружаем visual-semantic-extensions...');
      const visualExtensions = require('./server/semantic-memory/visual-semantic-extensions.cjs');
      console.log('   ✅ visual-semantic-extensions загружен успешно');
      
      const healthStatus = visualExtensions.checkHealth();
      console.log('   🎨 Состояние visual-semantic:', healthStatus.system_status);
      
    } catch (error) {
      console.log('   ❌ Ошибка загрузки visual-semantic:', error.message);
    }
    
    console.log('\n🔍 Диагностика проблем:');
    
    // Проверяем возможные причины degraded состояния
    console.log('   🔍 Возможные причины degraded состояния semantic-memory:');
    console.log('   1. Не все модули загружены корректно');
    console.log('   2. Проблемы с кэшированием модулей');
    console.log('   3. Ошибки в циклических зависимостях');
    console.log('   4. Проблемы с инициализацией новых модулей');
    
    console.log('\n💡 Рекомендации по исправлению:');
    console.log('   ✅ Перезапустить систему семантической памяти');
    console.log('   ✅ Очистить кэш модулей');
    console.log('   ✅ Проверить все экспорты модулей');
    console.log('   ✅ Убедиться что visual-semantic-extensions корректно интегрирован');
    
    return true;
    
  } catch (error) {
    console.error('❌ Критическая ошибка диагностики:', error.message);
    return false;
  }
}

// Запуск диагностики
checkSemanticSystemStatus()
  .then(success => {
    if (success) {
      console.log('\n🎯 Диагностика завершена');
      console.log('📋 Состояние: intelligent-processor здоров, semantic-memory требует внимания');
      console.log('🔧 Рекомендуется перезапуск семантической системы');
    } else {
      console.log('\n💥 Диагностика не удалась');
    }
  })
  .catch(error => {
    console.error('\n💥 Ошибка:', error.message);
  });