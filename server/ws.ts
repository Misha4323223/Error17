import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { IStorage } from "./storage";
import { WSEventType, WSMessage, WSMessagePayload, WSErrorPayload } from "@shared/schema";

// Импортируем Neural Progress Manager для интеграции
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getGlobalProgressManager } = require('./neural-progress-manager.cjs');

interface ExtendedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

export function setupWebSocket(httpServer: HttpServer, storage: IStorage) {
  console.log('🔍 [WebSocket] Initializing WebSocket server...');
  
  // Create WebSocket server with improved configuration
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/api/ws",
    perMessageDeflate: false,
    maxPayload: 16 * 1024,
    clientTracking: true,
    verifyClient: (info) => {
      console.log('🔍 [WebSocket] Client verification:', info.origin);
      return true; // Allow all connections for now
    },
    handleProtocols: (protocols, req) => {
      console.log('🔍 [WebSocket] Protocols:', protocols);
      return protocols.length > 0 ? protocols[0] : false;
    }
  });
  
  console.log('✅ [WebSocket] WebSocket server created successfully');
  
  // Store connected clients by user ID
  const connectedClients = new Map<number, ExtendedWebSocket>();
  
  // Store all connected clients for neural progress broadcasts
  const allClients = new Set<ExtendedWebSocket>();
  
  // Get neural progress manager
  const progressManager = getGlobalProgressManager();
  
  // Listen to neural progress events and broadcast to all connected clients
  progressManager.on('progress_update', (data: any) => {
    const message = {
      type: 'neural_progress_update',
      progress: data.progress,
      operation: data.operation,
      status: data.status,
      details: data.details,
      timestamp: data.timestamp
    };
    
    console.log(`📡 Broadcasting neural progress to ${allClients.size} clients:`, message);
    
    allClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error sending neural progress:', error);
          allClients.delete(ws);
        }
      } else {
        allClients.delete(ws);
      }
    });
  });
  
  progressManager.on('operation_complete', (data: any) => {
    const message = {
      type: 'neural_mode_change',
      mode: data.success ? 'full' : 'lite',
      description: data.result || 'Operation completed',
      timestamp: data.timestamp
    };
    
    allClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error sending mode change:', error);
          allClients.delete(ws);
        }
      } else {
        allClients.delete(ws);
      }
    });
  });
  
  // Handle WebSocket connection
  wss.on("connection", (ws: ExtendedWebSocket, req) => {
    const clientIP = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    console.log(`🔗 [WebSocket] NEW CLIENT CONNECTED from ${clientIP}`);
    console.log(`🔍 [WebSocket] User-Agent: ${userAgent?.substring(0, 100)}...`);
    console.log(`🔍 [WebSocket] Origin: ${req.headers.origin}`);
    console.log(`🔍 [WebSocket] Host: ${req.headers.host}`);
    
    // Set initial state
    ws.isAlive = true;
    // WebSocket readyState is read-only, no need to set it
    
    // Add to all clients for neural progress broadcasts
    allClients.add(ws);
    console.log(`📊 [WebSocket] Total active clients: ${allClients.size}`);
    
    // Send welcome message to confirm connection
    const sendWelcome = () => {
      try {
        const welcomeMessage = {
          type: 'connection_established',
          message: 'WebSocket connected successfully',
          timestamp: new Date().toISOString(),
          clientsCount: allClients.size,
          serverId: 'BOOOMERANGS-WS-v1.0'
        };
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(welcomeMessage));
          console.log('✅ [WebSocket] Welcome message sent successfully');
        } else {
          console.log('⚠️ [WebSocket] Connection not ready for welcome message');
        }
      } catch (error) {
        console.error('❌ [WebSocket] Error sending welcome message:', error);
        allClients.delete(ws);
      }
    };

    // Отправляем приветствие немедленно и с небольшой задержкой для надежности
    sendWelcome();
    setTimeout(sendWelcome, 100);
    
    // Отправляем статус нейросети при подключении
    setTimeout(() => {
      try {
        const statusMessage = {
          type: 'neural_status',
          status: 'lite',
          message: 'Neural network ready',
          timestamp: new Date().toISOString()
        };
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(statusMessage));
        }
      } catch (error) {
        console.error('❌ [WebSocket] Error sending status:', error);
      }
    }, 200);
    
    // Handle messages from client
    ws.on("message", async (data: WebSocket.Data) => {
      try {
        // Parse message
        const message: WSMessage = JSON.parse(data.toString());
        
        // Process message based on type
        switch (message.type) {
          case WSEventType.AUTH:
            await handleAuthentication(ws, message.payload, storage, connectedClients);
            break;
            
          case WSEventType.MESSAGE:
            await handleMessage(ws, message.payload, storage, connectedClients);
            break;
            
          case 'ping':
          case 'heartbeat':
            // Mark as alive and respond to ping/heartbeat
            ws.isAlive = true;
            try {
              ws.send(JSON.stringify({ 
                type: 'pong', 
                timestamp: new Date().toISOString(),
                serverTime: Date.now()
              }));
            } catch (error) {
              console.error('❌ Error sending pong response:', error);
              allClients.delete(ws);
            }
            break;
            
          case 'neural_client_ready':
            // Клиент готов получать neural progress updates
            console.log('🧠 [WebSocket] Neural client ready for progress updates');
            try {
              ws.send(JSON.stringify({ 
                type: 'neural_client_registered', 
                timestamp: new Date().toISOString(),
                message: 'Neural progress updates active'
              }));
            } catch (error) {
              console.error('❌ Error confirming neural client registration:', error);
              allClients.delete(ws);
            }
            break;
            
          default:
            // Don't send error for unknown types to avoid spam
            console.log(`Unknown WebSocket message type: ${message.type}`);
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
        try {
          sendError(ws, "Failed to process message");
        } catch (sendError) {
          console.error("❌ Failed to send error message:", sendError);
          allClients.delete(ws);
        }
      }
    });
    
    // Handle ping/pong for connection health check
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    
    // Handle client disconnect
    ws.on("close", async (code, reason) => {
      const reasonStr = reason ? reason.toString() : 'Unknown';
      console.log(`🔌 WebSocket client disconnected: code ${code}, reason: ${reasonStr}`);
      
      // Remove from all clients
      const wasRemoved = allClients.delete(ws);
      console.log(`📊 Client removed: ${wasRemoved}, remaining clients: ${allClients.size}`);
      
      if (ws.userId) {
        // Remove from connected clients
        connectedClients.delete(ws.userId);
        
        try {
          // Update user online status
          await storage.setUserOnlineStatus(ws.userId, false);
          
          // Notify other clients
          broadcastUserStatus(ws.userId, false, connectedClients);
        } catch (error) {
          console.error('❌ Error handling user disconnect:', error);
        }
        
        console.log(`👤 User ${ws.userId} disconnected`);
      }
    });
    
    // Handle WebSocket errors
    ws.on("error", (error) => {
      console.error(`❌ [WebSocket] ERROR for client ${ws.userId || 'anonymous'}:`);
      console.error(`❌ [WebSocket] Error type: ${error.name}`);
      console.error(`❌ [WebSocket] Error message: ${error.message}`);
      console.error(`❌ [WebSocket] ReadyState: ${ws.readyState}`);
      console.error(`❌ [WebSocket] Client IP: ${req.socket.remoteAddress}`);
      
      // Clean up client references
      const wasDeleted = allClients.delete(ws);
      console.log(`🗑️ [WebSocket] Client removed from allClients: ${wasDeleted}`);
      
      if (ws.userId) {
        const userDeleted = connectedClients.delete(ws.userId);
        console.log(`🗑️ [WebSocket] User ${ws.userId} removed from connectedClients: ${userDeleted}`);
      }
      
      // Try to close the connection gracefully
      try {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close(1011, 'Server error');
          console.log('🔌 [WebSocket] Connection closed due to error');
        }
      } catch (closeError) {
        console.error('❌ [WebSocket] Error closing connection:', closeError);
      }
    });
  });
  
  // Set up interval to check for stale connections
  const interval = setInterval(() => {
    console.log(`🔍 [WebSocket] Health check - ${wss.clients.size} clients connected`);
    
    wss.clients.forEach((ws: ExtendedWebSocket) => {
      if (ws.isAlive === false) {
        console.log(`💀 [WebSocket] Terminating stale connection for user ${ws.userId || 'unknown'}`);
        allClients.delete(ws);
        if (ws.userId) {
          connectedClients.delete(ws.userId);
        }
        return ws.terminate();
      }
      
      // Mark as not alive and send ping
      ws.isAlive = false;
      try {
        ws.ping();
      } catch (error) {
        console.error('❌ Error sending ping:', error);
        allClients.delete(ws);
        if (ws.userId) {
          connectedClients.delete(ws.userId);
        }
      }
    });
  }, 30000);
  
  // Handle server errors
  wss.on("error", (error) => {
    console.error('❌ WebSocket server error:', error);
  });
  
  // Clean up interval when server closes
  wss.on("close", () => {
    console.log('🔌 WebSocket server closing...');
    clearInterval(interval);
  });
  
  // Log when server is ready
  console.log("✅ WebSocket server initialized on path /api/ws");
  console.log(`📊 WebSocket server ready to accept connections`);
  
  // Return server instance for debugging
  return wss;
}

// Handler for authentication messages
async function handleAuthentication(
  ws: ExtendedWebSocket,
  payload: any,
  storage: IStorage,
  connectedClients: Map<number, ExtendedWebSocket>
) {
  try {
    // Validate token
    const { token } = payload;
    
    if (!token) {
      return sendError(ws, "No token provided");
    }
    
    // Get user from token
    const user = await storage.getUserByToken(token);
    
    if (!user) {
      return sendError(ws, "Invalid token");
    }
    
    // Set WebSocket user ID
    ws.userId = user.id;
    
    // Store connection
    connectedClients.set(user.id, ws);
    
    // Update user online status
    await storage.setUserOnlineStatus(user.id, true);
    
    // Notify other clients that user is online
    broadcastUserStatus(user.id, true, connectedClients);
    
    // Send confirmation to client
    ws.send(JSON.stringify({
      type: WSEventType.AUTH,
      payload: {
        success: true,
        userId: user.id,
        username: user.username
      }
    }));
    
    console.log(`User ${user.id} (${user.username}) authenticated via WebSocket`);
  } catch (error) {
    console.error("Authentication error:", error);
    sendError(ws, "Authentication failed");
  }
}

// Handler for message messages
async function handleMessage(
  ws: ExtendedWebSocket,
  payload: WSMessagePayload,
  storage: IStorage,
  connectedClients: Map<number, ExtendedWebSocket>
) {
  try {
    if (!ws.userId) {
      return sendError(ws, "Not authenticated");
    }
    
    const { text, receiverId } = payload;
    
    if (!text || !receiverId) {
      return sendError(ws, "Invalid message data");
    }
    
    // Create message in storage
    const message = await storage.createMessage({
      senderId: ws.userId,
      receiverId,
      text
    });
    
    // Get sender details
    const sender = await storage.getUser(ws.userId);
    
    if (!sender) {
      return sendError(ws, "Sender not found");
    }
    
    // Format message for client
    const formattedMessage = {
      ...message,
      sender: {
        ...sender,
        initials: sender.username
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      },
      time: new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    // Send message to recipient if they're connected
    const recipientWs = connectedClients.get(receiverId);
    
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify({
        type: WSEventType.MESSAGE,
        payload: formattedMessage
      }));
      
      // Update message status to delivered
      // In a real app, we'd update the message status in storage too
    }
  } catch (error) {
    console.error("Message handling error:", error);
    sendError(ws, "Failed to send message");
  }
}

// Helper to send error messages
function sendError(ws: WebSocket, message: string) {
  const payload: WSErrorPayload = { message };
  
  ws.send(JSON.stringify({
    type: WSEventType.ERROR,
    payload
  }));
}

// Helper to broadcast user status changes
function broadcastUserStatus(
  userId: number,
  isOnline: boolean,
  connectedClients: Map<number, ExtendedWebSocket>
) {
  // Broadcast to all connected clients except the user
  connectedClients.forEach((clientWs, clientId) => {
    if (clientId !== userId && clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({
        type: isOnline ? WSEventType.USER_CONNECTED : WSEventType.USER_DISCONNECTED,
        payload: { userId }
      }));
    }
  });
}
