const semanticMemory = require('./semantic-memory/index.cjs');
const semanticMonitor = require('./semantic-monitor.cjs');

SmartLogger.consultation('🎯 Контекст консультации:', {
      type: consultationType.type,
      projectType: projectContext.type,
      hasProject: !!semanticAnalysis.current_project,
      contextualQuestions: contextualQuestions.length
    });

    // Записываем в мониторинг
    semanticMonitor.recordImageConsultation(
      sessionId, 
      consultationType.type, 
      semanticAnalysis.confidence || 0.5, 
      contextualQuestions.length
    );

    return {
      semanticAnalysis,
      consultationType,
      projectContext,
      contextualQuestions,
      sessionId
    };