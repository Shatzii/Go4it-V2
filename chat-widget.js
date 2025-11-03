/**
 * Go4it Chat Widget
 * Connects landing page to existing Anthropic/Claude AI system
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiEndpoint: '/api/chat', // Will connect to your existing Anthropic integration
    position: 'bottom-right', // Options: bottom-right, bottom-left
    theme: 'neon-blue', // Matches landing page theme
    autoOpen: false,
    welcomeMessage: "Hi! I'm your Go4it AI Assistant. Ask me about GAR testing, NCAA pathways, or our academy programs! 🏀⚽🏈"
  };

  // Create chat widget HTML
  function createChatWidget() {
    const widgetHTML = `
      <div id="go4it-chat-widget" class="chat-widget chat-widget--${CONFIG.position} chat-widget--${CONFIG.theme}">
        <!-- Chat Button -->
        <button id="chat-toggle-btn" class="chat-toggle-btn" aria-label="Open chat">
          <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span class="notification-badge" id="chat-notification-badge" style="display: none;">1</span>
        </button>

        <!-- Chat Window -->
        <div id="chat-window" class="chat-window" style="display: none;">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-header-info">
              <div class="chat-avatar">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="url(#gradient)"/>
                  <path d="M16 8C13.79 8 12 9.79 12 12C12 14.21 13.79 16 16 16C18.21 16 20 14.21 20 12C20 9.79 18.21 8 16 8ZM16 18C12.67 18 6 19.67 6 23V24H26V23C26 19.67 19.33 18 16 18Z" fill="white"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stop-color="#00F0FF"/>
                      <stop offset="100%" stop-color="#00D4FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h3 class="chat-title">Go4it AI Assistant</h3>
                <p class="chat-status">
                  <span class="status-indicator"></span>
                  Online
                </p>
              </div>
            </div>
            <button class="chat-minimize" id="chat-minimize-btn" aria-label="Minimize chat">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="10" x2="15" y2="10"></line>
              </svg>
            </button>
          </div>

          <!-- Chat Messages -->
          <div class="chat-messages" id="chat-messages">
            <div class="message message--bot">
              <div class="message-avatar">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="url(#gradient)"/>
                  <path d="M16 8C13.79 8 12 9.79 12 12C12 14.21 13.79 16 16 16C18.21 16 20 14.21 20 12C20 9.79 18.21 8 16 8ZM16 18C12.67 18 6 19.67 6 23V24H26V23C26 19.67 19.33 18 16 18Z" fill="white"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stop-color="#00F0FF"/>
                      <stop offset="100%" stop-color="#00D4FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="message-content">
                <p>${CONFIG.welcomeMessage}</p>
              </div>
            </div>
          </div>

          <!-- Quick Replies -->
          <div class="quick-replies" id="quick-replies">
            <button class="quick-reply-btn" data-message="What is GAR testing?">
              <span class="icon">📊</span>
              GAR Testing
            </button>
            <button class="quick-reply-btn" data-message="How do I apply to the academy?">
              <span class="icon">📝</span>
              Apply Now
            </button>
            <button class="quick-reply-btn" data-message="Tell me about NCAA pathways">
              <span class="icon">🎓</span>
              NCAA Info
            </button>
            <button class="quick-reply-btn" data-message="What are your programs?">
              <span class="icon">⚡</span>
              Programs
            </button>
          </div>

          <!-- Chat Input -->
          <div class="chat-input-wrapper">
            <textarea 
              id="chat-input" 
              class="chat-input" 
              placeholder="Type your message..."
              rows="1"
              maxlength="500"
            ></textarea>
            <button id="chat-send-btn" class="chat-send-btn" aria-label="Send message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 10L18 2L10 18L8 12L2 10Z"/>
              </svg>
            </button>
          </div>

          <!-- Powered By -->
          <div class="chat-footer">
            <span class="powered-by">Powered by Claude AI</span>
          </div>
        </div>
      </div>
    `;

    // Inject widget into page
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container.firstElementChild);
  }

  // Initialize chat widget
  function initChatWidget() {
    createChatWidget();
    attachEventListeners();
    
    if (CONFIG.autoOpen) {
      setTimeout(() => openChat(), 1000);
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const minimizeBtn = document.getElementById('chat-minimize-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const input = document.getElementById('chat-input');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

    toggleBtn.addEventListener('click', toggleChat);
    minimizeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Quick replies
    quickReplyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        sendQuickReply(message);
      });
    });

    // Auto-resize textarea
    input.addEventListener('input', autoResizeTextarea);
  }

  // Toggle chat window
  function toggleChat() {
    const window = document.getElementById('chat-window');
    const isOpen = window.style.display !== 'none';
    
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Open chat
  function openChat() {
    const window = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const badge = document.getElementById('chat-notification-badge');
    
    window.style.display = 'flex';
    toggleBtn.classList.add('chat-toggle-btn--open');
    badge.style.display = 'none';
    
    // Focus input
    setTimeout(() => {
      document.getElementById('chat-input').focus();
    }, 300);
  }

  // Close chat
  function closeChat() {
    const window = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    
    window.style.display = 'none';
    toggleBtn.classList.remove('chat-toggle-btn--open');
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessage(message, 'user');
    input.value = '';
    autoResizeTextarea.call(input);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      // Send to API (connect to your existing Anthropic integration)
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: 'landing-page-chat',
          teacherConfig: {
            name: 'Go4it Assistant',
            subject: 'Sports Academy & GAR Testing',
            teachingStyle: 'friendly and informative',
            personalityTraits: ['enthusiastic', 'helpful', 'knowledgeable']
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Remove typing indicator
      removeTypingIndicator();
      
      // Add bot response
      addMessage(data.response || data.message, 'bot');
      
    } catch (error) {
      console.error('Chat error:', error);
      removeTypingIndicator();
      addMessage('Sorry, I\'m having trouble connecting right now. Please try refreshing the page or contact us directly.', 'bot');
    }
  }

  // Send quick reply
  function sendQuickReply(message) {
    const input = document.getElementById('chat-input');
    input.value = message;
    sendMessage();
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageHTML = `
      <div class="message message--${sender}">
        ${sender === 'bot' ? `
          <div class="message-avatar">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="url(#gradient)"/>
              <path d="M16 8C13.79 8 12 9.79 12 12C12 14.21 13.79 16 16 16C18.21 16 20 14.21 20 12C20 9.79 18.21 8 16 8ZM16 18C12.67 18 6 19.67 6 23V24H26V23C26 19.67 19.33 18 16 18Z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#00F0FF"/>
                  <stop offset="100%" stop-color="#00D4FF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        ` : ''}
        <div class="message-content">
          <p>${text}</p>
        </div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingHTML = `
      <div class="message message--bot typing-indicator" id="typing-indicator">
        <div class="message-avatar">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="url(#gradient)"/>
            <path d="M16 8C13.79 8 12 9.79 12 12C12 14.21 13.79 16 16 16C18.21 16 20 14.21 20 12C20 9.79 18.21 8 16 8ZM16 18C12.67 18 6 19.67 6 23V24H26V23C26 19.67 19.33 18 16 18Z" fill="white"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#00F0FF"/>
                <stop offset="100%" stop-color="#00D4FF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Auto-resize textarea
  function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatWidget);
  } else {
    initChatWidget();
  }

})();
