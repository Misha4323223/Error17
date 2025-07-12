import { useEffect, useRef, useState, useCallback } from "react";
import { WSMessage } from "@shared/schema";

interface UseWebSocketOptions {
  url?: string;
  onOpen?: () => void;
  onMessage?: (data: string) => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  connectionStatus: "connecting" | "connected" | "disconnected";
  sendWSMessage: (message: WSMessage) => void;
}

export function useWebSocket({
  url = getWebSocketUrl(),
  onOpen,
  onMessage,
  onClose,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5
}: UseWebSocketOptions): UseWebSocketReturn {
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const socket = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isIntentionalCloseRef = useRef(false);

  // Create a function to connect to WebSocket
  const connect = useCallback(() => {
    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close existing socket if any
    if (socket.current) {
      socket.current.close();
    }

    // Create new WebSocket connection
    setConnectionStatus("connecting");
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('✅ [WebSocket] Successfully connected to:', url);
      setConnectionStatus("connected");
      reconnectCount.current = 0;

      // Отправляем подтверждение подключения
      try {
        ws.send(JSON.stringify({ 
          type: 'connection_established', 
          timestamp: Date.now(),
          client: 'neural-frontend'
        }));
      } catch (error) {
        console.error('❌ [WebSocket] Error sending connection confirmation:', error);
      }

      // Start heartbeat to keep connection alive
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          } catch (error) {
            console.error('❌ [WebSocket] Error sending heartbeat:', error);
          }
        }
      }, 30000); // Send ping every 30 seconds

      if (onOpen) onOpen();
    };

    ws.onmessage = (event) => {
      if (onMessage) onMessage(event.data);
    };

    ws.onclose = (event) => {
      console.log(`🔌 [WebSocket] Connection closed - code: ${event.code}, reason: ${event.reason}`);
      setConnectionStatus("disconnected");

      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Only attempt reconnect if it wasn't an intentional close
      if (!isIntentionalCloseRef.current && reconnectCount.current < maxReconnectAttempts) {
        reconnectCount.current += 1;
        console.log(`🔄 [WebSocket] Attempting reconnect ${reconnectCount.current}/${maxReconnectAttempts} in ${reconnectInterval}ms`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      } else if (reconnectCount.current >= maxReconnectAttempts) {
        console.error('❌ [WebSocket] Max reconnect attempts reached');
      }

      if (onClose) onClose();
    };

    ws.onerror = (error) => {
      console.error('❌ [WebSocket] Connection error:', error);
      console.error('❌ [WebSocket] URL was:', url);
      console.error('❌ [WebSocket] ReadyState:', ws.readyState);

      if (onError) onError(error);
    };

    socket.current = ws;
  }, [url, onOpen, onMessage, onClose, onError, reconnectInterval, maxReconnectAttempts]);

  // Connect when component mounts and clean up on unmount
  useEffect(() => {
    // Небольшая задержка для стабилизации
    const timer = setTimeout(() => {
      console.log('🔗 [WebSocket] Starting connection...');
      connect();
    }, 100);

    return () => {
      clearTimeout(timer);
      
      // Mark as intentional close to prevent reconnection
      isIntentionalCloseRef.current = true;

      if (socket.current) {
        console.log('🔌 [WebSocket] Closing connection on cleanup');
        socket.current.close(1000, 'Component unmounting');
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [connect]);

  // Function to send messages through the WebSocket
  const sendWSMessage = useCallback((message: WSMessage) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected, cannot send message");
    }
  }, []);

  return {
    connectionStatus,
    sendWSMessage
  };
}

export const getWebSocketUrl = (): string => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;

    console.log('🔍 [WebSocket] URL detection - host:', host, 'protocol:', protocol);

    // Определяем среду выполнения
    const isReplit = host.includes('replit.dev') || host.includes('repl.co') || host.includes('replit.app') || host.includes('replit.com');
    const isDev = import.meta.env.DEV;

    let wsUrl: string;

    if (isReplit) {
      // В Replit используем правильный протокол и порт
      const replitProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${replitProtocol}//${host}/api/ws`;
      console.log('🔗 [WebSocket] Replit URL:', wsUrl);
    } else if (isDev && host === 'localhost:3000') {
      // В development режиме подключаемся к backend серверу
      wsUrl = `ws://localhost:5000/api/ws`;
      console.log('🔗 [WebSocket] Dev URL:', wsUrl);
    } else {
      // Для всех остальных случаев используем текущий хост
      wsUrl = `${protocol}//${host}/api/ws`;
      console.log('🔗 [WebSocket] Default URL:', wsUrl);
    }

    // Дополнительная проверка URL
    console.log('🔍 [WebSocket] Final URL:', wsUrl);
    console.log('🔍 [WebSocket] Environment:', { isDev, isReplit, host, protocol });

    return wsUrl;
  };