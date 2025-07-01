import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { nanoid } from 'nanoid';
import { debounce } from '../lib/utils';

interface CollaboratorCursor {
  userId: string;
  position: {
    line: number;
    column: number;
  };
  timestamp: string;
  username?: string;
}

interface CollaborativeEditorOptions {
  onContentChange?: (content: string) => void;
  onChange?: (content: string) => void;
  debounceMs?: number;
  cursorUpdateInterval?: number;
}

export function useCollaborativeEditor(
  filePath: string,
  initialContent: string = '',
  options: CollaborativeEditorOptions = {}
) {
  const {
    onContentChange,
    onChange,
    debounceMs = 500,
    cursorUpdateInterval = 1000
  } = options;

  const [content, setContent] = useState(initialContent);
  const [collaborators, setCollaborators] = useState<CollaboratorCursor[]>([]);
  const [localCursor, setLocalCursor] = useState<{ line: number; column: number }>({ line: 0, column: 0 });
  const editorRef = useRef<any>(null);
  const lastSyncedContentRef = useRef<string>(initialContent);
  const userId = useRef<string>('');
  const cursorUpdateTimerRef = useRef<number | null>(null);

  // Setup WebSocket connection
  const { isConnected, send, lastMessage, activeUsers } = useWebSocket('/ws/editor', {
    onMessage: (data) => {
      if (data.type === 'content_update' && data.filePath === filePath && data.userId !== userId.current) {
        // Another user updated the content
        if (data.content !== lastSyncedContentRef.current) {
          setContent(data.content);
          lastSyncedContentRef.current = data.content;
          
          if (onContentChange) {
            onContentChange(data.content);
          }
        }
      } else if (data.type === 'cursor_update' && data.filePath === filePath && data.userId !== userId.current) {
        // Update collaborator cursor
        setCollaborators(prev => {
          const existing = prev.find(c => c.userId === data.userId);
          if (existing) {
            return prev.map(c => 
              c.userId === data.userId 
                ? { 
                    ...c, 
                    position: data.position,
                    timestamp: new Date().toISOString()
                  }
                : c
            );
          } else {
            return [...prev, {
              userId: data.userId,
              position: data.position,
              timestamp: new Date().toISOString(),
              username: data.username
            }];
          }
        });
      } else if (data.type === 'user_left') {
        // Remove collaborator
        setCollaborators(prev => prev.filter(c => c.userId !== data.userId));
      }
    }
  });

  // Initialize user ID
  useEffect(() => {
    // Try to get from local storage first
    let storedUserId = localStorage.getItem('collaborative_editor_user_id');
    if (!storedUserId) {
      storedUserId = nanoid(10);
      localStorage.setItem('collaborative_editor_user_id', storedUserId);
    }
    userId.current = storedUserId;

    // Cleanup collaborators whose cursors haven't been updated recently
    const cleanupInterval = setInterval(() => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      setCollaborators(prev => prev.filter(c => c.timestamp > fiveMinutesAgo));
    }, 60 * 1000); // Every minute

    return () => {
      clearInterval(cleanupInterval);
      if (cursorUpdateTimerRef.current) {
        window.clearInterval(cursorUpdateTimerRef.current);
      }
    };
  }, []);

  // Join file editing session when connected
  useEffect(() => {
    if (isConnected && filePath) {
      send({
        type: 'join_file',
        filePath,
        userId: userId.current,
        timestamp: new Date().toISOString()
      });

      // Setup cursor update interval
      if (cursorUpdateTimerRef.current) {
        window.clearInterval(cursorUpdateTimerRef.current);
      }

      cursorUpdateTimerRef.current = window.setInterval(() => {
        if (localCursor) {
          send({
            type: 'cursor_update',
            filePath,
            userId: userId.current,
            position: localCursor,
            timestamp: new Date().toISOString()
          });
        }
      }, cursorUpdateInterval);

      // Send initial content if we're the first to join
      if (initialContent && !lastSyncedContentRef.current) {
        send({
          type: 'content_update',
          filePath,
          content: initialContent,
          userId: userId.current,
          timestamp: new Date().toISOString()
        });
        lastSyncedContentRef.current = initialContent;
      }

      // Leave editing session when component unmounts
      return () => {
        send({
          type: 'leave_file',
          filePath,
          userId: userId.current,
          timestamp: new Date().toISOString()
        });

        if (cursorUpdateTimerRef.current) {
          window.clearInterval(cursorUpdateTimerRef.current);
          cursorUpdateTimerRef.current = null;
        }
      };
    }
  }, [isConnected, filePath, initialContent, send, cursorUpdateInterval]);

  // Debounced content change handler to avoid too many updates
  const debouncedContentUpdate = useCallback(
    debounce((newContent: string) => {
      if (isConnected && newContent !== lastSyncedContentRef.current) {
        send({
          type: 'content_update',
          filePath,
          content: newContent,
          userId: userId.current,
          timestamp: new Date().toISOString()
        });
        lastSyncedContentRef.current = newContent;
        
        if (onChange) {
          onChange(newContent);
        }
      }
    }, debounceMs),
    [isConnected, filePath, send, onChange, debounceMs]
  );

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    debouncedContentUpdate(newContent);
  }, [debouncedContentUpdate]);

  // Handle cursor position changes
  const handleCursorChange = useCallback((position: { line: number; column: number }) => {
    setLocalCursor(position);
  }, []);

  // Set editor reference
  const setEditor = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  return {
    content,
    setContent: handleContentChange,
    collaborators,
    isConnected,
    activeUsers,
    localCursor,
    setCursor: handleCursorChange,
    setEditor,
    editor: editorRef.current
  };
}