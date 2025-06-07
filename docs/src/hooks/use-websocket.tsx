import { useState, useEffect, useRef } from "react";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected';

export function useWebSocket(url: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      setConnectionState('connecting');
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected to Monad Testnet');
        setConnectionState('connected');
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const message: WebSocketMessage = {
            type: data.method || 'unknown',
            data: data.params || data,
            timestamp: Date.now()
          };
          
          setLastMessage(message);
          setMessageHistory(prev => [...prev.slice(-99), message]); // Keep last 100 messages
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.current.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.reason);
        setConnectionState('disconnected');
        
        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current++;
          
          console.log(`🔄 Attempting to reconnect in ${delay}ms... (attempt ${reconnectAttempts.current})`);
          setTimeout(connect, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionState('disconnected');
      };
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setConnectionState('disconnected');
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect');
      ws.current = null;
    }
  };

  const sendMessage = (message: any) => {
    if (ws.current && connectionState === 'connected') {
      try {
        ws.current.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
      }
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    connectionState,
    lastMessage,
    messageHistory,
    connect,
    disconnect,
    sendMessage
  };
}
