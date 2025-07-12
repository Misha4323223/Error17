import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { createRequire } from 'module';
// Этот импорт вызывает ошибку из-за неверного форматирования в deepspeek-provider.js
// Отключаем прямой импорт проблемного файла
process.env.SKIP_DEEPSPEEK_ORIGINAL = 'true';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';

// 🧠 Нейросетевая интеграция загружается в routes.ts - убираем проблемный импорт

// Инициализируем векторизатор-менеджер (lazy loading)
let vectorizerManager: any = null;
try {
  const customRequire = createRequire(import.meta.url);
  vectorizerManager = customRequire('./vectorizer-manager');
  log('Vectorizer Manager initialized');
} catch (error) {
  log('Vectorizer Manager initialization deferred');
}

const app = express();
app.use(cors()); // Разрешаем CORS для всех маршрутов
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Статическая раздача загруженных файлов
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use('/output', express.static('output'));

// HTML маршруты будут добавлены после registerRoutes

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Создаем HTTP сервер для приложения
  const httpServer = createServer(app);
  const server = await registerRoutes(app, httpServer);

  // Neural API Routes - добавляем после registerRoutes
  const { createRequire } = await import('module');
  const customRequire = createRequire(import.meta.url);
  const { setupNeuralRoutes } = customRequire('./neural-api-routes.js');
  setupNeuralRoutes(app);

  // Обслуживание основного HTML интерфейса - ПОСЛЕ API routes, но ДО Vite middleware
  app.get('/booomerangs-smart-chat.html', (req, res) => {
    console.log('🎯 Serving booomerangs-smart-chat.html');
    res.sendFile(path.join(process.cwd(), 'booomerangs-smart-chat.html'));
  });

  // Другие HTML файлы для тестирования
  app.get('/neural-dashboard.html', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'neural-dashboard.html'));
  });

  // WebSocket endpoint информация (не middleware)
  app.get('/api/ws/status', (req, res) => {
    res.status(200).json({ 
      message: 'WebSocket endpoint available',
      status: 'ready',
      connectedClients: (global as any).neuralWebSocketServer?.clients?.size || 0,
      endpoint: '/api/ws'
    });
  });

  // Редирект с корневого URL на HTML интерфейс
  app.get('/', (req, res) => {
    res.redirect('/booomerangs-smart-chat.html');
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  // Используем переменную окружения PORT если она доступна, иначе 5000
  // Это критично для правильной работы в окружении Replit
  const PORT = parseInt(process.env.PORT || '5000', 10);
  httpServer.listen(PORT, "0.0.0.0", async () => {
    log(`serving on port ${PORT}`);

    // Инициализация семантической базы данных
    try {
      // const semanticInitialized = await initializeSemanticDatabase();
      // if (semanticInitialized) {
      //   console.log('🧠 Семантическая система готова к работе');
      // } else {
      //   console.log('⚠️ Семантическая система работает в ограниченном режиме');
      // }
    } catch (error) {
      console.error('❌ Ошибка инициализации семантической системы:', error);
    }

    // 🧠 Нейросетевая интеграция инициализируется в routes.ts
    log('🧠 Нейросетевая интеграция будет инициализирована по запросу');
  });

  // ===== WEBSOCKET СЕРВЕР ДЛЯ NEURAL PROGRESS =====
  const { WebSocketServer } = await import('ws');
  const wss = new WebSocketServer({ server: httpServer });
  
  // КРИТИЧНО: Устанавливаем глобальный WebSocket сервер ДО получения Progress Manager
  (global as any).neuralWebSocketServer = wss;
  
  // Интеграция с Neural Progress Manager
  const { getGlobalProgressManager } = customRequire('./neural-progress-manager.cjs');
  const progressManager = getGlobalProgressManager();
  
  // ПРИНУДИТЕЛЬНАЯ ИНТЕГРАЦИЯ Progress Manager с WebSocket сервером
  if (progressManager) {
    console.log('🔗 [WebSocket] Forcing Progress Manager integration...');
    progressManager.integrateWithMainWebSocket(wss);
    
    // Убеждаемся что connectedClients используют правильную коллекцию
    progressManager.connectedClients = wss.clients || new Set();
  }
  
  wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    console.log(`🔗 [WebSocket] New neural client connected from: ${clientIP}, UA: ${userAgent.substring(0, 50)}`);
    console.log(`🔗 [WebSocket] Request URL: ${req.url}, Headers:`, Object.keys(req.headers));
    
    // Добавляем клиента в Neural Progress Manager
    if (progressManager && progressManager.connectedClients) {
      progressManager.connectedClients.add(ws);
      console.log(`📡 [WebSocket] Client added to neural progress manager. Total: ${progressManager.connectedClients.size}`);
      
      // Отправляем текущий статус новому клиенту
      const currentStatus = progressManager.getStatus();
      if (currentStatus.isRunning) {
        progressManager.sendToClient(ws, {
          type: 'neural_status',
          ...currentStatus,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Отправляем подтверждение подключения к neural системе
    const welcomeMessage = {
      type: 'connection_established',
      message: 'Neural WebSocket connected successfully',
      clientsTotal: wss.clients.size,
      timestamp: new Date().toISOString(),
      serverInfo: 'BOOOMERANGS Neural WebSocket Server'
    };
    
    console.log('📤 [WebSocket] Sending welcome message:', welcomeMessage);
    ws.send(JSON.stringify(welcomeMessage));
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 [WebSocket] Received:', data.type || 'unknown');
        
        // Обработка ping-pong для поддержания соединения
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
        
        // Обработка neural_client_ready
        if (data.type === 'neural_client_ready' || data.type === 'connection_established') {
          ws.send(JSON.stringify({ 
            type: 'neural_welcome', 
            message: 'Neural client connected successfully',
            totalClients: wss.clients.size,
            timestamp: Date.now() 
          }));
          
          // Уведомляем Progress Manager о новом активном клиенте
          if (progressManager) {
            progressManager.broadcastToClients({
              type: 'client_connected',
              totalClients: wss.clients.size,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error('❌ [WebSocket] Message parse error:', error.message);
      }
    });
    
    ws.on('close', () => {
      console.log('🔌 [WebSocket] Neural client disconnected');
      if (progressManager && progressManager.connectedClients) {
        progressManager.connectedClients.delete(ws);
        console.log(`📡 [WebSocket] Client removed. Remaining: ${progressManager.connectedClients.size}`);
      }
    });
    
    ws.on('error', (error) => {
      console.error('❌ [WebSocket] Client error:', error.message);
      if (progressManager && progressManager.connectedClients) {
        progressManager.connectedClients.delete(ws);
      }
    });
  });
  
  // Enhanced Health check для WebSocket connections
  setInterval(() => {
    const activeClients = wss.clients.size;
    console.log(`🔍 [WebSocket] Health check - ${activeClients} clients connected`);
    
    // Синхронизируем Progress Manager с реальным количеством клиентов
    if (progressManager && progressManager.connectedClients) {
      progressManager.connectedClients = wss.clients;
      console.log(`🔄 [WebSocket] Progress Manager synchronized: ${progressManager.connectedClients.size} clients`);
    }
  }, 30000);
  
  console.log('✅ [WebSocket] Neural WebSocket server initialized');
})();
