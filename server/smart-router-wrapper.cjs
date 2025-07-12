/**
 * Обертка для smart-router.js для совместимости с CommonJS
 * Позволяет использовать require() в TypeScript коде
 */

let smartRouter = null;

// Динамически загружаем ES модуль
async function loadSmartRouter() {
  if (!smartRouter) {
    smartRouter = await import('./smart-router.js');
  }
  return smartRouter;
}

// CommonJS экспорт для совместимости
module.exports = {
  async getChatResponse(message, options = {}) {
    const router = await loadSmartRouter();
    return router.getChatResponse(message, options);
  },
  
  async analyzeMessage(message, options = {}) {
    const router = await loadSmartRouter();
    return router.analyzeMessage(message, options);
  },
  
  async routeMessage(message, options = {}) {
    const router = await loadSmartRouter();
    return router.routeMessage(message, options);
  }
};