import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import toast from '@/lib/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/auth';
import { incrementUnreadCount, addNotification, Notification } from '@/store/notifications';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

interface WebSocketContextType { }
const WebSocketContext = createContext<WebSocketContextType | null>(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const websocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);

                if (data.message) {
                    toast.info(data.message);
                }

                dispatch(incrementUnreadCount());
                const newNotification: Partial<Notification> = {
                    id: Date.now(),
                    message: data.message,
                    link: data.link,
                    type: data.type,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                };
                dispatch(addNotification(newNotification));
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        const connect = () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                return;
            }
            console.log('Attempting to connect to WebSocket...');
            const ws = new WebSocket(WS_URL);
            ws.onopen = () => console.log('WebSocket connection established.');
            ws.onmessage = handleMessage;
            ws.onerror = (error) => console.error('WebSocket error:', error);
            ws.onclose = () => {
                console.log('WebSocket connection closed.');
                websocket.current = null;
                if (isAuthenticated) {
                    setTimeout(connect, 5000);
                }
            };
            websocket.current = ws;
        };

        const disconnect = () => {
            if (websocket.current?.readyState === WebSocket.OPEN) {
                console.log('Closing WebSocket connection...');
                websocket.current.close();
            }
            websocket.current = null;
        };

        if (isAuthenticated) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            // Không disconnect ở đây để giữ kết nối khi chuyển trang
        };
    }, [isAuthenticated, dispatch]);

    return (
        <WebSocketContext.Provider value={{}}>
            {children}
        </WebSocketContext.Provider>
    );
};