/**
 * Go4It Sports Installation Wizard
 * JavaScript functionality
 * Version: 1.0.1
 */

document.addEventListener('DOMContentLoaded', () => {
  // Variables
  let currentStep = 0;
  const totalSteps = document.querySelectorAll('.wizard-screen').length;
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  
  // Initialize the wizard
  init();
  
  // Event listeners
  prevButton.addEventListener('click', goToPreviousStep);
  nextButton.addEventListener('click', goToNextStep);
  
  // Add click listeners to steps in sidebar
  document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('click', () => {
      const stepIndex = parseInt(step.dataset.step);
      if (stepIndex <= getMaxReachedStep()) {
        goToStep(stepIndex);
      }
    });
  });
  
  // Add listeners for database connection test
  const testConnectionBtn = document.getElementById('test-connection-btn');
  if (testConnectionBtn) {
    testConnectionBtn.addEventListener('click', testDatabaseConnection);
  }
  
  // Add listeners for the SSL toggle
  const useSSLCheckbox = document.getElementById('use-ssl');
  if (useSSLCheckbox) {
    useSSLCheckbox.addEventListener('change', toggleSSLSettings);
  }
  
  // Add listeners for the Twilio toggle
  const useTwilioCheckbox = document.getElementById('use-twilio');
  if (useTwilioCheckbox) {
    useTwilioCheckbox.addEventListener('change', toggleTwilioSettings);
  }
  
  // Add listener for install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.addEventListener('click', installApplication);
  }
  
  // Initialize the UI
  function init() {
    // Show the first step
    goToStep(0);
    
    // Get current installation state from the server
    fetchInstallationState();
    
    // Run system check if we're on that step
    if (currentStep === 1) {
      runSystemCheck();
    }
    
    // Update summary whenever inputs change
    setupSummaryUpdates();
  }
  
  // Fetch the current installation state from the server
  async function fetchInstallationState() {
    try {
      const response = await fetch('/api/state');
      const state = await response.json();
      
      // If the installation is already completed, jump to the final step
      if (state.status.installed) {
        goToStep(totalSteps - 1);
        document.getElementById('installation-progress').classList.add('hidden');
        document.getElementById('installation-complete').classList.remove('hidden');
      }
      
      // Populate form fields with saved values
      populateFormFields(state);
      
    } catch (error) {
      console.error('Error fetching installation state:', error);
    }
  }
  
  // Populate form fields with saved values from state
  function populateFormFields(state) {
    // Database fields
    if (state.database) {
      const { host, port, name, user, password } = state.database;
      setInputValue('db-host', host);
      setInputValue('db-port', port);
      setInputValue('db-name', name);
      setInputValue('db-user', user);
      setInputValue('db-password', password);
      
      if (state.status.databaseSetup) {
        showConnectionStatus(true, 'Database connection successful');
      }
    }
    
    // Web server fields
    if (state.webServer) {
      const { type, port, sslPort, domain, useSSL } = state.webServer;
      setSelectValue('server-type', type);
      setInputValue('server-domain', domain);
      setCheckboxValue('use-ssl', useSSL);
      setInputValue('http-port', port);
      setInputValue('https-port', sslPort);
      
      // Show/hide SSL settings
      toggleSSLSettings();
    }
    
    // API configuration fields
    if (state.api) {
      const { port, corsOrigins, rateLimitMax } = state.api;
      setInputValue('api-port', port);
      setInputValue('cors-origins', corsOrigins);
      setInputValue('rate-limit', rateLimitMax);
    }
    
    // API keys fields
    if (state.apiKeys) {
      const { openai, anthropic, twilio } = state.apiKeys;
      setInputValue('openai-key', openai);
      setInputValue('anthropic-key', anthropic);
      
      if (twilio && (twilio.accountSid || twilio.authToken || twilio.phoneNumber)) {
        setCheckboxValue('use-twilio', true);
        setInputValue('twilio-account-sid', twilio.accountSid);
        setInputValue('twilio-auth-token', twilio.authToken);
        setInputValue('twilio-phone', twilio.phoneNumber);
        toggleTwilioSettings();
      }
    }
    
    // Features fields
    if (state.features) {
      const { enableAiCoach, enableHighlightGeneration, enableSmsNotifications } = state.features;
      setCheckboxValue('feature-ai-coach', enableAiCoach);
      setCheckboxValue('feature-highlight-generation', enableHighlightGeneration);
      setCheckboxValue('feature-sms-notifications', enableSmsNotifications);
    }
    
    // Update summary
    updateSummary();
  }
  
  // Helper functions for setting form values
  function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value) {
      element.value = value;
    }
  }
  
  function setSelectValue(id, value) {
    const element = document.getElementById(id);
    if (element && value) {
      element.value = value;
    }
  }
  
  function setCheckboxValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.checked = value;
    }
  }
  
  // Navigation functions
  function goToStep(step) {
    if (step < 0 || step >= totalSteps) return;
    
    // Hide all screens
    document.querySelectorAll('.wizard-screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show the current screen
    document.getElementById(`screen-${step}`).classList.add('active');
    
    // Update steps in sidebar
    document.querySelectorAll('.step').forEach(stepEl => {
      stepEl.classList.remove('active');
      
      const stepIndex = parseInt(stepEl.dataset.step);
      if (stepIndex < step) {
        stepEl.classList.add('completed');
      } else if (stepIndex === step) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('completed');
      }
    });
    
    // Update buttons
    prevButton.classList.toggle('hidden', step === 0);
    
    // Change Next button to Install on the last step
    if (step === totalSteps - 1) {
      nextButton.classList.add('hidden');
    } else {
      nextButton.classList.remove('hidden');
    }
    
    // Update the current step
    currentStep = step;
    
    // If we're on the system check step, run it
    if (step === 1) {
      runSystemCheck();
    }
    
    // If we're on the final step, update summary
    if (step === totalSteps - 1) {
      updateSummary();
    }
    
    // Tell the server what step we're on
    updateServerStep(step);
  }
  
  function goToPreviousStep() {
    goToStep(currentStep - 1);
  }
  
  function goToNextStep() {
    // Validate the current step before moving on
    if (validateCurrentStep()) {
      goToStep(currentStep + 1);
    }
  }
  
  // Keep track of the highest step the user has reached
  let maxReachedStep = 0;
  
  function getMaxReachedStep() {
    return maxReachedStep;
  }
  
  function setMaxReachedStep(step) {
    maxReachedStep = Math.max(maxReachedStep, step);
  }
  
  // Step validation
  function validateCurrentStep() {
    switch (currentStep) {
      case 0: // Welcome screen
        return true;
      
      case 1: // System check
        // Only allow proceeding if all checks pass
        const systemCheckStatus = document.getElementById('system-check-status');
        return !systemCheckStatus.classList.contains('error');
      
      case 2: // Database
        // Require a successful database connection
        const dbConnectionStatus = document.getElementById('db-connection-status');
        if (!dbConnectionStatus || dbConnectionStatus.classList.contains('hidden')) {
          alert('Please test your database connection first.');
          return false;
        }
        return dbConnectionStatus.classList.contains('success');
      
      case 3: // Web server
        // Validate domain
        const domain = document.getElementById('server-domain').value;
        if (!domain) {
          alert('Please enter a domain name.');
          return false;
        }
        return true;
      
      case 4: // API configuration
        // Validate port
        const port = document.getElementById('api-port').value;
        if (!port || isNaN(port) || port < 1 || port > 65535) {
          alert('Please enter a valid port number (1-65535).');
          return false;
        }
        return true;
      
      case 5: // API keys
        // Validate required API keys
        const openaiKey = document.getElementById('openai-key').value;
        const anthropicKey = document.getElementById('anthropic-key').value;
        
        if (!openaiKey) {
          alert('OpenAI API Key is required.');
          return false;
        }
        
        if (!anthropicKey) {
          alert('Anthropic API Key is required.');
          return false;
        }
        
        // If Twilio is enabled, validate those fields
        const useTwilio = document.getElementById('use-twilio').checked;
        if (useTwilio) {
          const twilioAccountSid = document.getElementById('twilio-account-sid').value;
          const twilioAuthToken = document.getElementById('twilio-auth-token').value;
          const twilioPhone = document.getElementById('twilio-phone').value;
          
          if (!twilioAccountSid || !twilioAuthToken || !twilioPhone) {
            alert('All Twilio fields are required when SMS notifications are enabled.');
            return false;
          }
        }
        
        return true;
      
      case 6: // Features
        // No validation needed
        return true;
      
      default:
        return true;
    }
  }
  
  // Run system check
  async function runSystemCheck() {
    const systemCheckStatus = document.getElementById('system-check-status');
    const requirementsList = document.getElementById('requirements-list');
    
    // Show loading state
    systemCheckStatus.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Checking system requirements...</p>
    `;
    
    try {
      const response = await fetch('/api/system-check');
      const data = await response.json();
      
      // Update system info
      document.getElementById('hostname').textContent = data.systemInfo.hostname;
      document.getElementById('os-type').textContent = data.systemInfo.osType;
      document.getElementById('os-release').textContent = data.systemInfo.osRelease;
      document.getElementById('cpu-count').textContent = `${data.systemInfo.cpuCount} cores`;
      document.getElementById('memory-total').textContent = `${data.systemInfo.memoryTotal} GB`;
      document.getElementById('disk-space').textContent = `${data.systemMetrics.diskSpace.availableGB} GB available`;
      
      // Update requirements list
      let requirementsHTML = '';
      
      // Software requirements
      for (const [key, check] of Object.entries(data.softwareChecks)) {
        requirementsHTML += `
          <div class="requirement-row">
            <div class="requirement-name">${check.name}</div>
            <div class="requirement-required">v${check.required}+</div>
            <div class="requirement-installed">${check.installed}</div>
            <div class="requirement-status">
              <span class="requirement-status-icon ${check.pass ? 'success' : 'error'}"></span>
              ${check.pass ? 'OK' : 'Not Met'}
            </div>
          </div>
        `;
      }
      
      // System requirements
      for (const [key, req] of Object.entries(data.systemMetrics.requirements)) {
        requirementsHTML += `
          <div class="requirement-row">
            <div class="requirement-name">${key === 'cpu' ? 'CPU Cores' : 'Memory'}</div>
            <div class="requirement-required">${req.required}</div>
            <div class="requirement-installed">${req.actual}</div>
            <div class="requirement-status">
              <span class="requirement-status-icon ${req.pass ? 'success' : 'error'}"></span>
              ${req.pass ? 'OK' : 'Not Met'}
            </div>
          </div>
        `;
      }
      
      requirementsList.innerHTML = requirementsHTML;
      
      // Update overall status
      if (data.allPassed) {
        systemCheckStatus.innerHTML = `
          <div style="color: var(--success); font-size: 24px; margin-bottom: 0.5rem;">✓</div>
          <p>All system requirements are met. You can proceed with the installation.</p>
        `;
        systemCheckStatus.classList.remove('error');
      } else {
        systemCheckStatus.innerHTML = `
          <div style="color: var(--error); font-size: 24px; margin-bottom: 0.5rem;">⚠</div>
          <p>Some system requirements are not met. You may encounter issues during installation.</p>
        `;
        systemCheckStatus.classList.add('error');
      }
      
    } catch (error) {
      console.error('Error running system check:', error);
      systemCheckStatus.innerHTML = `
        <div style="color: var(--error); font-size: 24px; margin-bottom: 0.5rem;">✗</div>
        <p>Failed to check system requirements: ${error.message}</p>
      `;
      systemCheckStatus.classList.add('error');
    }
  }
  
  // Test database connection
  async function testDatabaseConnection() {
    const host = document.getElementById('db-host').value;
    const port = document.getElementById('db-port').value;
    const name = document.getElementById('db-name').value;
    const user = document.getElementById('db-user').value;
    const password = document.getElementById('db-password').value;
    
    const connectionStatus = document.getElementById('db-connection-status');
    const testButton = document.getElementById('test-connection-btn');
    
    // Validate inputs
    if (!host || !port || !name || !user) {
      alert('Please fill in all required database fields.');
      return;
    }
    
    // Show loading state
    testButton.disabled = true;
    testButton.textContent = 'Testing...';
    connectionStatus.classList.add('hidden');
    
    try {
      const response = await fetch('/api/test-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ host, port, name, user, password }),
      });
      
      const data = await response.json();
      
      // Show status message
      showConnectionStatus(data.success, data.message);
      
    } catch (error) {
      console.error('Error testing database connection:', error);
      showConnectionStatus(false, 'Failed to test connection: ' + error.message);
    } finally {
      // Reset button
      testButton.disabled = false;
      testButton.textContent = 'Test Connection';
    }
  }
  
  // Show connection status
  function showConnectionStatus(success, message) {
    const connectionStatus = document.getElementById('db-connection-status');
    
    connectionStatus.classList.remove('hidden', 'success', 'error');
    connectionStatus.classList.add(success ? 'success' : 'error');
    
    connectionStatus.innerHTML = `
      <div class="status-icon"></div>
      <div class="status-message">${message}</div>
    `;
  }
  
  // Toggle SSL settings
  function toggleSSLSettings() {
    const useSSL = document.getElementById('use-ssl').checked;
    const sslSettings = document.getElementById('ssl-settings');
    
    if (useSSL) {
      sslSettings.classList.remove('hidden');
    } else {
      sslSettings.classList.add('hidden');
    }
  }
  
  // Toggle Twilio settings
  function toggleTwilioSettings() {
    const useTwilio = document.getElementById('use-twilio').checked;
    const twilioSettings = document.getElementById('twilio-settings');
    
    if (useTwilio) {
      twilioSettings.classList.remove('hidden');
    } else {
      twilioSettings.classList.add('hidden');
    }
  }
  
  // Install the application
  async function installApplication() {
    const installButton = document.getElementById('install-button');
    const installationProgress = document.getElementById('installation-progress');
    const installationComplete = document.getElementById('installation-complete');
    const progressBar = document.querySelector('.progress-bar-inner');
    const progressMessage = document.querySelector('.progress-message');
    
    // Show progress UI
    installButton.disabled = true;
    installationProgress.classList.remove('hidden');
    installationComplete.classList.add('hidden');
    
    // Start the progress bar animation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 1;
      progressBar.style.width = `${Math.min(progress, 95)}%`;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    try {
      // Save web server configuration
      const serverType = document.getElementById('server-type').value;
      const domain = document.getElementById('server-domain').value;
      const useSSL = document.getElementById('use-ssl').checked;
      const httpPort = document.getElementById('http-port').value;
      const httpsPort = document.getElementById('https-port')?.value || '443';
      
      await fetch('/api/webserver-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: serverType,
          port: httpPort,
          sslPort: httpsPort,
          domain,
          useSSL,
        }),
      });
      
      progressMessage.textContent = 'Saved web server configuration...';
      
      // Save API configuration
      const apiPort = document.getElementById('api-port').value;
      const corsOrigins = document.getElementById('cors-origins').value;
      const rateLimitMax = document.getElementById('rate-limit').value;
      
      await fetch('/api/server-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          port: apiPort,
          corsOrigins,
          rateLimitMax,
        }),
      });
      
      progressMessage.textContent = 'Saved API configuration...';
      
      // Save API keys
      const openaiKey = document.getElementById('openai-key').value;
      const anthropicKey = document.getElementById('anthropic-key').value;
      const useTwilio = document.getElementById('use-twilio').checked;
      
      let twilioData = {};
      if (useTwilio) {
        twilioData = {
          accountSid: document.getElementById('twilio-account-sid').value,
          authToken: document.getElementById('twilio-auth-token').value,
          phoneNumber: document.getElementById('twilio-phone').value,
        };
      }
      
      await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openai: openaiKey,
          anthropic: anthropicKey,
          twilio: twilioData,
        }),
      });
      
      progressMessage.textContent = 'Saved API keys...';
      
      // Save feature settings
      const enableAiCoach = document.getElementById('feature-ai-coach').checked;
      const enableHighlightGeneration = document.getElementById('feature-highlight-generation').checked;
      const enableSmsNotifications = document.getElementById('feature-sms-notifications').checked;
      
      await fetch('/api/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enableAiCoach,
          enableHighlightGeneration,
          enableSmsNotifications,
        }),
      });
      
      progressMessage.textContent = 'Saved feature settings...';
      
      // Perform the installation
      const installResponse = await fetch('/api/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      const installResult = await installResponse.json();
      
      if (installResult.success) {
        // Set progress to 100%
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        
        // Show completion UI
        setTimeout(() => {
          installationProgress.classList.add('hidden');
          installationComplete.classList.remove('hidden');
        }, 500);
      } else {
        throw new Error(installResult.message);
      }
      
    } catch (error) {
      console.error('Installation error:', error);
      clearInterval(progressInterval);
      
      progressMessage.textContent = `Installation failed: ${error.message}`;
      progressBar.style.backgroundColor = 'var(--error)';
      
      // Re-enable the install button
      installButton.disabled = false;
    }
  }
  
  // Update the summary in the final step
  function updateSummary() {
    // Database summary
    document.getElementById('summary-db-host').textContent = document.getElementById('db-host')?.value || 'localhost';
    document.getElementById('summary-db-port').textContent = document.getElementById('db-port')?.value || '5432';
    document.getElementById('summary-db-name').textContent = document.getElementById('db-name')?.value || 'go4it_sports';
    document.getElementById('summary-db-user').textContent = document.getElementById('db-user')?.value || 'go4it';
    
    // Web server summary
    const serverTypeSelect = document.getElementById('server-type');
    const serverTypeValue = serverTypeSelect?.value || 'nginx';
    const serverTypeText = serverTypeSelect?.options[serverTypeSelect.selectedIndex]?.text || 'Nginx';
    document.getElementById('summary-server-type').textContent = serverTypeText;
    
    document.getElementById('summary-domain').textContent = document.getElementById('server-domain')?.value || 'go4itsports.org';
    document.getElementById('summary-ssl').textContent = document.getElementById('use-ssl')?.checked ? 'Enabled' : 'Disabled';
    
    // API summary
    document.getElementById('summary-api-port').textContent = document.getElementById('api-port')?.value || '5000';
    document.getElementById('summary-cors').textContent = document.getElementById('cors-origins')?.value || '*';
    
    // Features summary
    const aiCoach = document.getElementById('feature-ai-coach')?.checked;
    const highlightGen = document.getElementById('feature-highlight-generation')?.checked;
    const smsNotifications = document.getElementById('feature-sms-notifications')?.checked;
    
    document.getElementById('summary-feature-ai-coach').classList.toggle('hidden', !aiCoach);
    document.getElementById('summary-feature-highlight').classList.toggle('hidden', !highlightGen);
    document.getElementById('summary-feature-sms').classList.toggle('hidden', !smsNotifications);
  }
  
  // Set up summary updates when form inputs change
  function setupSummaryUpdates() {
    // Watch for changes in input fields
    document.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', updateSummary);
    });
  }
  
  // Tell the server what step we're on
  async function updateServerStep(step) {
    try {
      await fetch('/api/update-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step }),
      });
    } catch (error) {
      console.error('Error updating step:', error);
    }
    
    // Update max reached step
    setMaxReachedStep(step);
  }
});