'use client'

import { useEffect } from 'react'

export function AccessibilityEnhancements() {
  useEffect(() => {
    // Voice navigation setup
    if ('speechSynthesis' in window && 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase()
        
        if (transcript.includes('go to dashboard')) {
          window.location.href = '/dashboard'
        } else if (transcript.includes('go to academy')) {
          window.location.href = '/academy'
        } else if (transcript.includes('search')) {
          // Trigger search with Cmd/Ctrl + K
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
        }
      }

      // Start voice recognition on Alt + V
      document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'v') {
          recognition.start()
        }
      })

      return () => {
        recognition.stop()
      }
    }

    // High contrast mode
    const toggleHighContrast = () => {
      document.body.classList.toggle('high-contrast')
    }

    // Text size adjustment
    const increaseFontSize = () => {
      const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      document.documentElement.style.fontSize = `${currentSize + 2}px`
    }

    const decreaseFontSize = () => {
      const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      document.documentElement.style.fontSize = `${currentSize - 2}px`
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'h') {
        toggleHighContrast()
      } else if (e.ctrlKey && e.key === '+') {
        e.preventDefault()
        increaseFontSize()
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault()
        decreaseFontSize()
      }
    })

    // Add accessibility styles
    const style = document.createElement('style')
    style.textContent = `
      .high-contrast {
        filter: contrast(150%) brightness(120%);
      }
      
      .high-contrast * {
        background-color: #000 !important;
        color: #fff !important;
        border-color: #fff !important;
      }
      
      .high-contrast a {
        color: #ffff00 !important;
      }
      
      .high-contrast button {
        background-color: #333 !important;
        color: #fff !important;
        border: 2px solid #fff !important;
      }
      
      /* Focus indicators */
      *:focus {
        outline: 3px solid #007acc !important;
        outline-offset: 2px !important;
      }
      
      /* Skip navigation */
      .skip-nav {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
      }
      
      .skip-nav:focus {
        top: 6px;
      }
    `
    document.head.appendChild(style)

    // Add skip navigation
    const skipNav = document.createElement('a')
    skipNav.href = '#main-content'
    skipNav.className = 'skip-nav'
    skipNav.textContent = 'Skip to main content'
    document.body.insertBefore(skipNav, document.body.firstChild)

    return () => {
      document.head.removeChild(style)
      document.body.removeChild(skipNav)
    }
  }, [])

  return null
}