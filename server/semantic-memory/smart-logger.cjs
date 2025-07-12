/**
 * Умный логгер для семантической системы
 * Централизованное логирование с категориями
 */

class SmartLogger {
  static log(category, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = this.getCategoryPrefix(category);
    
    let logMessage = `${prefix} [${timestamp}] ${message}`;
    
    if (data) {
      logMessage += ` ${JSON.stringify(data)}`;
    }
    
    console.log(logMessage);
  }

  static getCategoryPrefix(category) {
    const prefixes = {
      'project': '🏗️',
      'semantic': '🧠',
      'entity': '🔍',
      'analyzer': '🔬',
      'profiler': '👤',
      'memory': '💾',
      'integration': '🔗',
      'learning': '🎓',
      'predictor': '🔮',
      'graph': '🕸️',
      'meta': '🌟',
      'error': '❌',
      'success': '✅',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    
    return prefixes[category] || '📝';
  }

  static project(message, data = null) {
    this.log('project', message, data);
  }

  static semantic(message, data = null) {
    this.log('semantic', message, data);
  }

  static entity(message, data = null) {
    this.log('entity', message, data);
  }

  static analyzer(message, data = null) {
    this.log('analyzer', message, data);
  }

  static profiler(message, data = null) {
    this.log('profiler', message, data);
  }

  static memory(message, data = null) {
    this.log('memory', message, data);
  }

  static integration(message, data = null) {
    this.log('integration', message, data);
  }

  static learning(message, data = null) {
    this.log('learning', message, data);
  }

  static predictor(message, data = null) {
    this.log('predictor', message, data);
  }

  static graph(message, data = null) {
    this.log('graph', message, data);
  }

  static meta(message, data = null) {
    this.log('meta', message, data);
  }

  static error(message, data = null) {
    this.log('error', message, data);
  }

  static success(message, data = null) {
    this.log('success', message, data);
  }

  static warning(message, data = null) {
    this.log('warning', message, data);
  }

  static info(message, data = null) {
    this.log('info', message, data);
  }
}

module.exports = SmartLogger;