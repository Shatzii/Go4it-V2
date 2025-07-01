import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

// Define the socket store state
interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  terminalOutput: Record<string, string[]>;
  serverMetrics: Record<string, any>;
  connectionErrors: Record<string, string>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  sendCommand: (serverId: string, command: string) => void;
  clearTerminalOutput: (serverId: string) => void;
}

// Create the socket store
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  terminalOutput: {},
  serverMetrics: {},
  connectionErrors: {},

  // Connect to the socket server
  connectSocket: () => {
    // Check if socket already exists and is connected
    if (get().socket?.connected) return;

    // Disconnect existing socket if any
    if (get().socket && get().socket.connected) {
      get().socket.disconnect();
    }

    // Create new socket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = io(`${protocol}//${window.location.host}`, {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    // Setup event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      set({ isConnected: false });
    });

    // Terminal events
    socket.on('terminal:output', ({ serverId, output }) => {
      set((state) => {
        const currentOutput = state.terminalOutput[serverId] || [];
        return {
          terminalOutput: {
            ...state.terminalOutput,
            [serverId]: [...currentOutput, output]
          }
        };
      });
    });

    socket.on('terminal:error', ({ serverId, error }) => {
      set((state) => ({
        connectionErrors: {
          ...state.connectionErrors,
          [serverId]: error
        }
      }));
    });

    // Server metrics events
    socket.on('server:metrics', ({ serverId, metrics }) => {
      set((state) => ({
        serverMetrics: {
          ...state.serverMetrics,
          [serverId]: metrics
        }
      }));
    });

    // Save socket in state
    set({ socket });
  },

  // Disconnect from socket server
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Send terminal command to a server
  sendCommand: (serverId: string, command: string) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('terminal:command', { serverId, command });
    } else {
      console.error('Socket not connected. Cannot send command.');
    }
  },

  // Clear terminal output for a server
  clearTerminalOutput: (serverId: string) => {
    set((state) => ({
      terminalOutput: {
        ...state.terminalOutput,
        [serverId]: []
      }
    }));
  }
}));

// Initialize socket connection on app start
export const initializeSocket = () => {
  useSocketStore.getState().connectSocket();
};

// Disconnect socket on app unmount
export const cleanupSocket = () => {
  useSocketStore.getState().disconnectSocket();
};

// Helper function to get terminal output for a specific server
export const getTerminalOutput = (serverId: string): string[] => {
  return useSocketStore.getState().terminalOutput[serverId] || [];
};

// Helper function to get server metrics for a specific server
export const getServerMetrics = (serverId: string): any => {
  return useSocketStore.getState().serverMetrics[serverId] || null;
};

export default useSocketStore;