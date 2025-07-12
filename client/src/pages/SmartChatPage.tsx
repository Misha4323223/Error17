import { useState, useRef, useEffect } from "react";
import BooomerangsLogo from "@/components/BooomerangsLogo";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useWebSocket, getWebSocketUrl } from "../lib/useWebSocket";

// Функция для получения иконки провайдера в метаданных
const getProviderIcon = (provider?: string) => {
  const providerName = provider?.toLowerCase() || '';

  switch(providerName) {
    case 'deepspeek':
      return <span className="mr-1">👨‍💻</span>;
    case 'claude':
    case 'anthropic':
      return <span className="mr-1">🪃</span>;
    case 'chatfree':
      return <span className="mr-1">💬</span>;
    case 'deepinfra':
      return <span className="mr-1">🧠</span>;
    case 'qwen':
    case 'aitianhu':
      return <span className="mr-1">🚀</span>;
    case 'ollama':
      return <span className="mr-1">🦙</span>;
    case 'phind':
      return <span className="mr-1">📚</span>;
    default:
      return <span className="mr-1">🪃</span>;
  }
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  provider?: string;
  model?: string;
}

export default function SmartChatPage() {
  console.log('🎯 [Component] SmartChatPage component rendering - CODE VERSION 2.0');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [showAuth, setShowAuth] = useState(true);
  const [showNeuralDashboard, setShowNeuralDashboard] = useState(false);
  const [neuralStats, setNeuralStats] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [neuralMode, setNeuralMode] = useState<'lite' | 'upgrading' | 'full' | 'loading'>('loading');
  const [upgradProgress, setUpgradeProgress] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [neuralWebSocketStatus, setNeuralWebSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [wsReconnectAttempts, setWsReconnectAttempts] = useState(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Heartbeat functions for WebSocket connection
  const startHeartbeat = (ws: WebSocket) => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        console.log('🏓 [Neural] Sent ping');
      }
    }, 30000);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  // WebSocket для neural прогресса через основное соединение
  useEffect(() => {
    let neuralWs: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectNeuralWebSocket = () => {
      try {
        // ИСПРАВЛЕНО: WebSocket сервер всегда работает на порту 5000
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.hostname;
        const wsPort = '5000'; // ВСЕГДА порт 5000 для WebSocket сервера
        const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}/api/ws`;
        
        console.log('🔗 [Neural] Connecting to WebSocket:', wsUrl);
        setNeuralWebSocketStatus('connecting');
        neuralWs = new WebSocket(wsUrl);

        neuralWs.onopen = () => {
          console.log('✅ [Neural] WebSocket connected to main server');
          setNeuralWebSocketStatus('connected');
          setWsReconnectAttempts(0); // Сбрасываем счетчик попыток при успешном подключении
          
          // Отправляем сообщение о подключении для neural progress
          const readyMessage = {
            type: 'neural_client_ready',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          };
          
          neuralWs.send(JSON.stringify(readyMessage));
          console.log('📡 [Neural] Sent ready message:', readyMessage);
          
          // Запускаем heartbeat для поддержания соединения
          startHeartbeat(neuralWs);
        };

        neuralWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📡 [Neural] WebSocket message:', data);

            // Обрабатываем neural сообщения
            if (data.type?.startsWith('neural_')) {
              if (data.type === 'neural_progress_update' || data.type === 'neural_progress') {
                setUpgradeProgress(data.progress);
                console.log(`📊 [Neural] Progress: ${data.progress}%`);
              } else if (data.type === 'neural_operation_complete') {
                setIsUpgrading(false);
                if (data.success) {
                  setNeuralMode('full');
                  console.log('✅ [Neural] Upgrade completed successfully');

                  // Добавляем сообщение об успешном upgrade
                  const upgradeCompleteMessage: Message = {
                    id: Date.now().toString(),
                    text: '🎉 **Full Neural Network Ready!**\n\n12-слойная нейросеть активирована:\n✅ Multi-Head Attention\n✅ RoPE Positioning\n✅ Mixed Precision\n✅ Gradient Checkpointing\n\n🧠 Полная мощность BOOOMERANGS Neural доступна!',
                    isUser: false,
                    timestamp: new Date(),
                    status: 'sent',
                    provider: 'BOOOMERANGS-Neural',
                    model: 'full-transformer'
                  };
                  setMessages(prev => [...prev, upgradeCompleteMessage]);
                }
                setUpgradeProgress(100);
              } else if (data.type === 'neural_operation_start') {
                console.log(`🚀 [Neural] Operation started: ${data.operation}`);
                if (data.operation?.includes('Upgrade')) {
                  setIsUpgrading(true);
                  setNeuralMode('upgrading');
                }
              } else if (data.type === 'neural_status') {
                console.log('📊 [Neural] Status update:', data);
              } else if (data.type === 'connection_established') {
                console.log('🎉 [Neural] Connection established, clients:', data.clientsCount);
              } else if (data.type === 'pong') {
                console.log('🏓 [Neural] Received pong');
              }
            }
          } catch (error) {
            console.error('❌ [Neural] WebSocket message parse error:', error);
          }
        };

        neuralWs.onerror = (error) => {
          console.error('🚨 [Neural] WebSocket error:', error);
          console.error('🚨 [Neural] WebSocket URL was:', wsUrl);
          console.error('🚨 [Neural] WebSocket readyState:', neuralWs?.readyState);
          setNeuralWebSocketStatus('disconnected');
        };

        neuralWs.onclose = (event) => {
          console.log('❌ [Neural] WebSocket disconnected', { code: event.code, reason: event.reason });
          setNeuralWebSocketStatus('disconnected');
          stopHeartbeat();

          // Экспоненциальный backoff как в HTML версии
          const currentAttempts = wsReconnectAttempts + 1;
          setWsReconnectAttempts(currentAttempts);
          const reconnectDelay = Math.min(5000 * Math.pow(2, Math.min(currentAttempts, 4)), 30000);
          
          console.log(`🔄 [Neural] Reconnecting in ${reconnectDelay/1000}s (attempt ${currentAttempts})`);
          reconnectTimer = setTimeout(() => {
            connectNeuralWebSocket();
          }, reconnectDelay);
        };
      } catch (error) {
        console.error('❌ [Neural] WebSocket connection failed:', error);
        setNeuralWebSocketStatus('disconnected');
      }
    };

    // Подключаем WebSocket независимо от состояния авторизации
    // так как neural progress нужен всегда
    connectNeuralWebSocket();

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (neuralWs) {
        neuralWs.close();
      }
    };
  }, []); // Убираем зависимость от showAuth - WebSocket нужен всегда

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setShowAuth(false);
    }
  }, []);

  const handleAuth = (name: string) => {
    setUsername(name);
    setShowAuth(false);
    localStorage.setItem('chat_username', name);

    // Добавляем приветственное сообщение
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Привет, ${name}! 🚀 Я BOOOMERANGS AI с нейросетевым ядром и Neural Dashboard!\n\n🧠 **Возможности:**\n• Transformer архитектура с Multi-Head Attention\n• Обучение на ваших данных\n• Семантический анализ\n• Векторизация изображений\n• Генерация контента\n\n💡 Нажмите "🧠 Neural Dashboard" для управления нейросетью!\n\nЧем могу помочь?`,
      isUser: false,
      timestamp: new Date(),
      status: 'sent',
      provider: 'BOOOMERANGS-Neural',
      model: 'transformer-hybrid'
    };

    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/neural/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input,
          options: {
            username: username,
            useCheckpoints: true,
            sessionId: `neural_chat_${username}_${Date.now()}`
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || '🧠 Нейросеть обрабатывает ваш запрос...',
        isUser: false,
        timestamp: new Date(),
        status: 'sent',
        provider: 'BOOOMERANGS-Neural',
        model: 'transformer-hybrid'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова.',
        isUser: false,
        timestamp: new Date(),
        status: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const logout = () => {
    setShowAuth(true);
    setUsername("");
    setMessages([]);
    localStorage.removeItem('chat_username');
  };

  // Функции управления нейросетью
  const loadNeuralStats = async () => {
    try {
      const response = await fetch('/api/neural/stats');
      const data = await response.json();
      if (data.success) {
        setNeuralStats(data.stats);
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики нейросети:', error);
    }
  };

  const startNeuralTraining = async () => {
    try {
      setIsTraining(true);
      const response = await fetch('/api/neural/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epochs: 3, batchSize: 4 })
      });

      const data = await response.json();
      if (data.success) {
        const trainingMessage: Message = {
          id: Date.now().toString(),
          text: '🔥 Обучение нейросети запущено! Epochs: 3, Batch Size: 4',
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
          provider: 'BOOOMERANGS-Neural',
          model: 'training-system'
        };
        setMessages(prev => [...prev, trainingMessage]);
      }
    } catch (error) {
      console.error('Ошибка запуска обучения:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const runNeuralTests = async () => {
    try {
      const response = await fetch('/api/neural/test', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        const testMessage: Message = {
          id: Date.now().toString(),
          text: `🧪 Тестирование нейросети завершено:\n\n${data.testResults.map((result: any, index: number) => 
            `${index + 1}. "${result.query}"\n${result.success ? '✅ ' + result.response : '❌ ' + result.error}`
          ).join('\n\n')}`,
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
          provider: 'BOOOMERANGS-Neural',
          model: 'test-system'
        };
        setMessages(prev => [...prev, testMessage]);
      }
    } catch (error) {
      console.error('Ошибка тестирования:', error);
    }
  };

  // Функции neural upgrade management
  const startNeuralUpgrade = async () => {
    try {
      setIsUpgrading(true);
      setNeuralMode('upgrading');
      setUpgradeProgress(0);

      const response = await fetch('/api/neural/upgrade-to-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        const upgradeMessage: Message = {
          id: Date.now().toString(),
          text: '🚀 **Neural Network Upgrade Started!**\n\nЗапускается переход на полную нейросеть:\n• Загрузка 12-слойной архитектуры\n• Активация Multi-Head Attention\n• Включение Mixed Precision\n\n⏳ Прогресс будет отображен в режиме реального времени...',
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
          provider: 'BOOOMERANGS-Neural',
          model: 'upgrade-manager'
        };
        setMessages(prev => [...prev, upgradeMessage]);
      }
    } catch (error) {
      console.error('Ошибка запуска upgrade:', error);
      setIsUpgrading(false);
      setNeuralMode('lite');
    }
  };

  const initializeLiteNeural = async () => {
    try {
      console.log('⚡ [Neural] Initializing Lite Neural Network...');
      setNeuralMode('loading');

      const response = await fetch('/api/neural/initialize-lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [Neural] Lite initialization response:', data);

      if (data.success) {
        setNeuralMode('lite');
        console.log('✅ [Neural] Lite initialization started');

        const initMessage: Message = {
          id: Date.now().toString(),
          text: '⚡ **Lite Neural Network Ready!**\n\nБыстрая нейросеть активирована:\n✅ 3 transformer слоя\n✅ 256-мерные эмбеддинги\n✅ ~10MB модель\n\n🚀 Автоматический upgrade к 12 слоям начнется через 5 секунд...',
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
          provider: 'BOOOMERANGS-Neural',
          model: 'lite-transformer'
        };
        setMessages(prev => [...prev, initMessage]);

        // Автоматический upgrade к полной модели через 5 секунд
        setTimeout(() => {
          console.log('🚀 [Neural] Starting automatic upgrade to full model...');
          startNeuralUpgrade();
        }, 5000);
      }
    } catch (error) {
      console.error('Ошибка инициализации lite:', error);
      setNeuralMode('lite');
    }
  };

  useEffect(() => {
    console.log('🚀 [Component] SmartChatPage useEffect triggered, showAuth:', showAuth);
    if (!showAuth) {
      loadNeuralStats();
      // Проверяем текущий статус нейросети
      checkNeuralMode();
      const interval = setInterval(loadNeuralStats, 30000);
      return () => clearInterval(interval);
    }
  }, [showAuth]);

  const checkNeuralMode = async () => {
    try {
      const response = await fetch('/api/neural/status');
      const data = await response.json();

      if (data.success) {
        const currentMode = data.mode || 'loading';
        setNeuralMode(currentMode);
        console.log('🧠 [Neural] Current mode:', currentMode);

        // Если нейросеть не инициализирована, запускаем lite
        if (currentMode === 'loading' || !data.isInitialized) {
          console.log('🔄 [Neural] Neural network not initialized, starting lite...');
          initializeLiteNeural();
        }
      }
    } catch (error) {
      console.error('Ошибка проверки neural mode:', error);
      // Автоматически инициализируем lite режим
      console.log('🔄 [Neural] Status check failed, initializing lite...');
      initializeLiteNeural();
    }
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <BooomerangsLogo className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">BOOOMERANGS Smart AI</h1>
            <p className="text-gray-600">Продвинутый чат с системой чекпоинтов</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = formData.get('username') as string;
            if (name.trim()) {
              handleAuth(name.trim());
            }
          }}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Введите ваше имя
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ваше имя..."
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Начать чат
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BooomerangsLogo />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">BOOOMERANGS Smart AI</h1>
              <p className="text-sm text-gray-600">Пользователь: {username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNeuralDashboard(!showNeuralDashboard)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                showNeuralDashboard 
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              🧠 Neural Dashboard
            </button>
            <a 
              href="/checkpoints" 
              className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              Чекпоинты
            </a>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Neural Status Banner */}
      <div className="max-w-6xl mx-auto p-4">
        <div className={`rounded-lg p-4 mb-4 border-l-4 ${
          neuralMode === 'full' ? 'bg-green-50 border-green-500' :
          neuralMode === 'upgrading' ? 'bg-yellow-50 border-yellow-500' :
          neuralMode === 'lite' ? 'bg-blue-50 border-blue-500' :
          'bg-gray-50 border-gray-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {neuralMode === 'full' ? '🧠' : 
                 neuralMode === 'upgrading' ? '⚡' :
                 neuralMode === 'lite' ? '💫' : '⏳'}
              </span>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Neural Network Status: {
                    neuralMode === 'full' ? 'Full Transformer (12 layers)' :
                    neuralMode === 'upgrading' ? 'Upgrading to Full...' :
                    neuralMode === 'lite' ? 'Lite Mode (3 layers)' :
                    'Initializing...'
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {neuralMode === 'full' ? 'Maximum performance available' :
                   neuralMode === 'upgrading' ? `Loading: ${upgradProgress}%` :
                   neuralMode === 'lite' ? 'Fast responses, upgrade available' :
                   'Setting up neural network...'}
                </p>
              </div>
            </div>

            {/* Neural Action Buttons */}
            <div className="flex items-center space-x-2">
              {neuralMode === 'lite' && !isUpgrading && (
                <button
                  onClick={startNeuralUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all font-medium"
                >
                  🚀 Upgrade to Full
                </button>
              )}

              {neuralMode === 'loading' && (
                <button
                  onClick={initializeLiteNeural}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ⚡ Initialize Lite
                </button>
              )}

              <span className={`px-2 py-1 rounded text-xs font-medium ${
                neuralWebSocketStatus === 'connected' ? 'bg-green-100 text-green-800' :
                neuralWebSocketStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Neural WebSocket: {neuralWebSocketStatus}
              </span>

              <span className={`px-2 py-1 rounded text-xs font-medium ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Main WebSocket: {connectionStatus}
              </span>
            </div>
          </div>

          {/* Progress Bar для upgrading */}
          {(neuralMode === 'upgrading' || isUpgrading) && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Neural Upgrade Progress</span>
                <span>{upgradProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(upgradProgress, 0)}%` }}
                />
              </div>
              {neuralWebSocketStatus !== 'connected' && (
                <div className="text-xs text-orange-600 mt-1">
                  ⚠️ WebSocket не подключен - прогресс может не обновляться
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Neural Dashboard Panel */}
      {showNeuralDashboard && (
        <div className="max-w-6xl mx-auto p-4 mb-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                🧠 Neural Network Dashboard
              </h2>
              <button
                onClick={() => setShowNeuralDashboard(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Статистика нейросети */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  📊 Статистика нейросети
                </h3>
                {neuralStats ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Режим:</span>
                      <span className={`font-semibold ${
                        neuralMode === 'full' ? 'text-green-600' :
                        neuralMode === 'lite' ? 'text-blue-600' :
                        neuralMode === 'upgrading' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {neuralMode === 'full' ? '🧠 Full' :
                         neuralMode === 'lite' ? '💫 Lite' :
                         neuralMode === 'upgrading' ? '⚡ Upgrading' :
                         '⏳ Loading'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Статус:</span>
                      <span className={neuralStats.isInitialized ? 'text-green-600' : 'text-red-600'}>
                        {neuralStats.isInitialized ? '✅ Активна' : '❌ Неактивна'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Словарь:</span>
                      <span className="font-mono">{neuralStats.neural?.vocabSize || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Слоёв:</span>
                      <span className="font-mono">
                        {neuralMode === 'full' ? '12' : 
                         neuralMode === 'lite' ? '3' : 
                         neuralStats.neural?.numLayers || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attention голов:</span>
                      <span className="font-mono">{neuralStats.neural?.numHeads || 'N/A'}</span>
                    </div>
                    {neuralMode === 'upgrading' && (
                      <div className="flex justify-between">
                        <span>Прогресс:</span>
                        <span className="font-mono text-yellow-600">{upgradProgress}%</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">Загрузка статистики...</div>
                )}
                <button
                  onClick={loadNeuralStats}
                  className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  🔄 Обновить
                </button>
              </div>

              {/* Управление обучением */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  🔥 Обучение нейросети
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={startNeuralTraining}
                    disabled={isTraining}
                    className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm disabled:bg-gray-400"
                  >
                    {isTraining ? '⏳ Обучение...' : '🔥 Начать обучение'}
                  </button>
                  <button
                    onClick={runNeuralTests}
                    className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                  >
                    🧪 Запустить тесты
                  </button>
                </div>
              </div>

              {/* Neural Management */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  ⚡ Neural Management
                </h3>
                <div className="space-y-2">
                  {neuralMode === 'lite' && (
                    <button
                      onClick={startNeuralUpgrade}
                      disabled={isUpgrading}
                      className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded hover:from-purple-600 hover:to-blue-600 transition-all text-sm disabled:opacity-50"
                    >
                      {isUpgrading ? '⏳ Upgrading...' : '🚀 Full Upgrade'}
                    </button>
                  )}

                  {neuralMode === 'loading' && (
                    <button
                      onClick={initializeLiteNeural}
                      className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      ⚡ Initialize Lite
                    </button>
                  )}

                  <button
                    onClick={() => setInput('Покажи статистику нейросети')}
                    className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
                  >
                    📈 Статистика
                  </button>
                  <button
                    onClick={() => setInput('Объясни архитектуру Transformer')}
                    className="w-full px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
                  >
                    🏗️ Архитектура
                  </button>
                  <button
                    onClick={() => setInput('Создай изображение используя нейросеть')}
                    className="w-full px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors text-sm"
                  >
                    🎨 Генерация
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Область сообщений */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : message.status === 'error'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!message.isUser && message.provider && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      {getProviderIcon(message.provider)}
                      <span>{message.provider}</span>
                      {message.model && <span className="ml-1">({message.model})</span>}
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none">
                    {message.isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    )}
                  </div>

                  <div className={`text-xs mt-2 ${
                    message.isUser ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"```python
 style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">Печатает...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}