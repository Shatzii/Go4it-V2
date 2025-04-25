// State management
let currentStep = 0;
let installData = {
  step: 0,
  totalSteps: 7,
  database: {
    host: 'localhost',
    port: 5432,
    name: 'go4it_sports',
    user: 'go4it',
    password: '',
    connectionEstablished: false
  },
  webServer: {
    type: 'nginx',
    port: 80,
    sslPort: 443,
    domain: 'go4itsports.org',
    useSSL: true,
    configCreated: false
  },
  api: {
    port: 5000,
    corsOrigins: '*',
    rateLimitMax: 100
  },
  apiKeys: {
    openai: '',
    anthropic: '',
    twilio: {
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    }
  },
  features: {
    enableAiCoach: true,
    enableHighlightGeneration: true,
    enableSmsNotifications: false
  }
};

// DOM Elements
const stepElements = document.querySelectorAll('.step');
const stepContents = document.querySelectorAll('.step-content');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Fetch initial state from server
  fetchState();
  
  // Set up event listeners
  document.getElementById('test-db-button').addEventListener('click', testDatabaseConnection);
  document.getElementById('server-ssl').addEventListener('change', toggleSslSettings);
  
  // Initialize current step
  updateStepUI(currentStep);
});

// Fetch installation state from server
async function fetchState() {
  try {
    const response = await fetch('/api/state');
    if (!response.ok) throw new Error('Failed to fetch installation state');
    
    const data = await response.json();
    installData = data;
    currentStep = data.step;
    
    // Update UI based on fetched state
    updateStepUI(currentStep);
    populateFormValues();
    
    // If we're on the system check step, run the check
    if (currentStep === 1) {
      runSystemCheck();
    }
  } catch (error) {
    console.error('Error fetching state:', error);
  }
}

// Navigation functions
function nextStep() {
  if (currentStep < installData.totalSteps) {
    currentStep++;
    updateStepUI(currentStep);
    updateServerStep(currentStep);
    
    // Run step-specific initialization
    if (currentStep === 1) {
      runSystemCheck();
    } else if (currentStep === 7) {
      populateInstallationSummary();
    }
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    updateStepUI(currentStep);
    updateServerStep(currentStep);
  }
}

// Update step UI
function updateStepUI(stepIndex) {
  // Hide all step contents
  stepContents.forEach(content => {
    content.style.display = 'none';
  });
  
  // Show current step content
  stepContents[stepIndex].style.display = 'block';
  
  // Update step indicators
  stepElements.forEach((step, index) => {
    step.classList.remove('active', 'completed');
    
    if (index === stepIndex) {
      step.classList.add('active');
    } else if (index < stepIndex) {
      step.classList.add('completed');
    }
  });
}

// Update server step
async function updateServerStep(stepIndex) {
  try {
    const response = await fetch('/api/update-step', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ step: stepIndex })
    });
    
    if (!response.ok) throw new Error('Failed to update step on server');
  } catch (error) {
    console.error('Error updating step:', error);
  }
}

// System Check
async function runSystemCheck() {
  const loadingElement = document.getElementById('system-check-loading');
  const resultsElement = document.getElementById('system-check-results');
  const nextButton = document.getElementById('system-check-next');
  
  loadingElement.style.display = 'flex';
  resultsElement.style.display = 'none';
  nextButton.disabled = true;
  
  try {
    const response = await fetch('/api/system-check');
    if (!response.ok) throw new Error('Failed to check system requirements');
    
    const data = await response.json();
    
    // Update UI with results
    displaySystemInfo(data.systemInfo);
    displaySystemMetrics(data.systemMetrics);
    displaySoftwareChecks(data.softwareChecks);
    displayRequirementsSummary(data.allPassed);
    
    // Enable next button if all checks passed
    nextButton.disabled = !data.allPassed;
    
    // Show results, hide loading
    loadingElement.style.display = 'none';
    resultsElement.style.display = 'block';
  } catch (error) {
    console.error('Error checking system:', error);
    
    // Show error message
    loadingElement.style.display = 'none';
    resultsElement.innerHTML = `
      <div class="error-message">
        <h3>Error Checking System</h3>
        <p>${error.message}</p>
        <button onclick="runSystemCheck()" class="secondary-button">Try Again</button>
      </div>
    `;
    resultsElement.style.display = 'block';
  }
}

function displaySystemInfo(systemInfo) {
  const container = document.getElementById('server-info-grid');
  container.innerHTML = '';
  
  // Add info items
  const infoItems = [
    { label: 'Hostname', value: systemInfo.hostname },
    { label: 'Operating System', value: `${systemInfo.osType} ${systemInfo.osRelease}` },
    { label: 'CPU Cores', value: systemInfo.cpuCount },
    { label: 'Memory', value: `${systemInfo.memoryTotal} GB` },
    { label: 'Node.js Version', value: systemInfo.nodeVersion }
  ];
  
  infoItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `
      <div class="info-label">${item.label}</div>
      <div class="info-value">${item.value}</div>
    `;
    container.appendChild(div);
  });
}

function displaySystemMetrics(metrics) {
  const container = document.getElementById('system-metrics-grid');
  container.innerHTML = '';
  
  // Add metrics items
  const metricItems = [
    { label: 'CPU Usage', value: `${Math.round(metrics.cpuUsage * 100)}%` },
    { label: 'Memory Usage', value: `${Math.round(metrics.memoryUsage * 100)}%` },
    { label: 'Disk Space', value: `${metrics.diskSpace.free} GB free of ${metrics.diskSpace.total} GB` },
    { label: 'CPU Requirement', value: metrics.requirements.cpu.actual, pass: metrics.requirements.cpu.pass },
    { label: 'Memory Requirement', value: metrics.requirements.memory.actual, pass: metrics.requirements.memory.pass }
  ];
  
  metricItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'info-item';
    
    let statusIndicator = '';
    if (item.hasOwnProperty('pass')) {
      statusIndicator = item.pass ? 
        '<span style="color: var(--success)">✓</span>' : 
        '<span style="color: var(--danger)">✗</span>';
    }
    
    div.innerHTML = `
      <div class="info-label">${item.label}</div>
      <div class="info-value">${item.value} ${statusIndicator}</div>
    `;
    container.appendChild(div);
  });
}

function displaySoftwareChecks(checks) {
  const container = document.getElementById('software-requirements-list');
  container.innerHTML = '';
  
  // Add requirement items
  Object.values(checks).forEach(check => {
    const div = document.createElement('div');
    div.className = 'requirement-item';
    
    div.innerHTML = `
      <div class="requirement-icon ${check.pass ? 'pass' : 'fail'}">
        ${check.pass ? '✓' : '✗'}
      </div>
      <div class="requirement-details">
        <div class="requirement-name">${check.name}</div>
        <div class="requirement-version">
          <span>Required: ${check.required}</span>
          <span>Installed: ${check.installed}</span>
        </div>
      </div>
    `;
    
    container.appendChild(div);
  });
}

function displayRequirementsSummary(allPassed) {
  const container = document.getElementById('requirements-summary');
  const textElement = document.getElementById('summary-text');
  
  container.classList.remove('pass', 'fail');
  container.classList.add(allPassed ? 'pass' : 'fail');
  
  if (allPassed) {
    textElement.innerHTML = 'All system requirements are met! You can proceed with the installation.';
  } else {
    textElement.innerHTML = 'Some system requirements are not met. You may need to upgrade your system before proceeding.';
  }
}

// Database connection test
async function testDatabaseConnection() {
  const messageElement = document.getElementById('db-form-message');
  const nextButton = document.getElementById('database-next');
  const form = document.getElementById('database-form');
  
  // Clear previous message
  messageElement.className = 'form-message';
  messageElement.style.display = 'none';
  
  // Get form data
  const formData = {
    host: document.getElementById('db-host').value,
    port: document.getElementById('db-port').value,
    name: document.getElementById('db-name').value,
    user: document.getElementById('db-user').value,
    password: document.getElementById('db-password').value
  };
  
  // Validate required fields
  if (!formData.host || !formData.port || !formData.name || !formData.user || !formData.password) {
    messageElement.className = 'form-message error';
    messageElement.textContent = 'All fields are required';
    messageElement.style.display = 'block';
    return;
  }
  
  // Disable form during test
  const formElements = form.querySelectorAll('input, button');
  formElements.forEach(el => el.disabled = true);
  
  try {
    const response = await fetch('/api/test-database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Success - update UI
      messageElement.className = 'form-message success';
      messageElement.textContent = 'Database connection successful! ' + data.version;
      messageElement.style.display = 'block';
      nextButton.disabled = false;
      
      // Update install data
      installData.database = {
        ...formData,
        connectionEstablished: true
      };
    } else {
      // Failed connection
      messageElement.className = 'form-message error';
      messageElement.textContent = data.message;
      messageElement.style.display = 'block';
      nextButton.disabled = true;
    }
  } catch (error) {
    // Request error
    messageElement.className = 'form-message error';
    messageElement.textContent = 'Connection test failed: ' + error.message;
    messageElement.style.display = 'block';
    nextButton.disabled = true;
  } finally {
    // Re-enable form
    formElements.forEach(el => el.disabled = false);
  }
}

// Toggle SSL settings
function toggleSslSettings() {
  const sslEnabled = document.getElementById('server-ssl').checked;
  const sslSettings = document.getElementById('ssl-settings');
  
  sslSettings.style.display = sslEnabled ? 'block' : 'none';
}

// Save web server config
async function saveWebServerConfig() {
  const formData = {
    type: document.getElementById('server-type').value,
    domain: document.getElementById('server-domain').value,
    port: document.getElementById('http-port').value,
    sslPort: document.getElementById('ssl-port').value,
    useSSL: document.getElementById('server-ssl').checked
  };
  
  try {
    const response = await fetch('/api/webserver-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Failed to save web server configuration');
    
    // Update install data
    installData.webServer = {
      ...formData,
      configCreated: true
    };
    
    // Go to next step
    nextStep();
  } catch (error) {
    console.error('Error saving web server config:', error);
    alert('Failed to save web server configuration: ' + error.message);
  }
}

// Save API server config
async function saveApiConfig() {
  const formData = {
    port: document.getElementById('api-port').value,
    corsOrigins: document.getElementById('cors-origins').value,
    rateLimitMax: document.getElementById('rate-limit').value
  };
  
  try {
    const response = await fetch('/api/server-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Failed to save API server configuration');
    
    // Update install data
    installData.api = formData;
    
    // Go to next step
    nextStep();
  } catch (error) {
    console.error('Error saving API config:', error);
    alert('Failed to save API server configuration: ' + error.message);
  }
}

// Save API keys
async function saveApiKeys() {
  const formData = {
    openai: document.getElementById('openai-key').value,
    anthropic: document.getElementById('anthropic-key').value,
    twilio: {
      accountSid: document.getElementById('twilio-sid').value,
      authToken: document.getElementById('twilio-token').value,
      phoneNumber: document.getElementById('twilio-phone').value
    }
  };
  
  try {
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Failed to save API keys');
    
    // Update install data
    installData.apiKeys = formData;
    
    // Go to next step
    nextStep();
  } catch (error) {
    console.error('Error saving API keys:', error);
    alert('Failed to save API keys: ' + error.message);
  }
}

// Save features
async function saveFeatures() {
  const formData = {
    enableAiCoach: document.getElementById('ai-coach-toggle').checked,
    enableHighlightGeneration: document.getElementById('highlight-toggle').checked,
    enableSmsNotifications: document.getElementById('sms-toggle').checked
  };
  
  try {
    const response = await fetch('/api/features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Failed to save feature settings');
    
    // Update install data
    installData.features = formData;
    
    // Go to next step
    nextStep();
  } catch (error) {
    console.error('Error saving features:', error);
    alert('Failed to save feature settings: ' + error.message);
  }
}

// Populate form values from install data
function populateFormValues() {
  // Database form
  document.getElementById('db-host').value = installData.database.host;
  document.getElementById('db-port').value = installData.database.port;
  document.getElementById('db-name').value = installData.database.name;
  document.getElementById('db-user').value = installData.database.user;
  document.getElementById('db-password').value = installData.database.password;
  document.getElementById('database-next').disabled = !installData.database.connectionEstablished;
  
  // Web server form
  document.getElementById('server-type').value = installData.webServer.type;
  document.getElementById('server-domain').value = installData.webServer.domain;
  document.getElementById('http-port').value = installData.webServer.port;
  document.getElementById('ssl-port').value = installData.webServer.sslPort;
  document.getElementById('server-ssl').checked = installData.webServer.useSSL;
  toggleSslSettings();
  
  // API server form
  document.getElementById('api-port').value = installData.api.port;
  document.getElementById('cors-origins').value = installData.api.corsOrigins;
  document.getElementById('rate-limit').value = installData.api.rateLimitMax;
  
  // API keys form
  document.getElementById('openai-key').value = installData.apiKeys.openai;
  document.getElementById('anthropic-key').value = installData.apiKeys.anthropic;
  document.getElementById('twilio-sid').value = installData.apiKeys.twilio.accountSid;
  document.getElementById('twilio-token').value = installData.apiKeys.twilio.authToken;
  document.getElementById('twilio-phone').value = installData.apiKeys.twilio.phoneNumber;
  
  // Features form
  document.getElementById('ai-coach-toggle').checked = installData.features.enableAiCoach;
  document.getElementById('highlight-toggle').checked = installData.features.enableHighlightGeneration;
  document.getElementById('sms-toggle').checked = installData.features.enableSmsNotifications;
}

// Populate installation summary
function populateInstallationSummary() {
  // Database summary
  const dbSummary = document.getElementById('db-summary');
  dbSummary.innerHTML = `
    <li><strong>Host:</strong> ${installData.database.host}</li>
    <li><strong>Port:</strong> ${installData.database.port}</li>
    <li><strong>Database:</strong> ${installData.database.name}</li>
    <li><strong>User:</strong> ${installData.database.user}</li>
    <li><strong>Connection:</strong> ${installData.database.connectionEstablished ? 'Verified' : 'Not Verified'}</li>
  `;
  
  // Web server summary
  const webServerSummary = document.getElementById('webserver-summary');
  webServerSummary.innerHTML = `
    <li><strong>Type:</strong> ${installData.webServer.type}</li>
    <li><strong>Domain:</strong> ${installData.webServer.domain}</li>
    <li><strong>SSL:</strong> ${installData.webServer.useSSL ? 'Enabled' : 'Disabled'}</li>
    <li><strong>HTTP Port:</strong> ${installData.webServer.port}</li>
    ${installData.webServer.useSSL ? `<li><strong>HTTPS Port:</strong> ${installData.webServer.sslPort}</li>` : ''}
  `;
  
  // API server summary
  const apiSummary = document.getElementById('api-summary');
  apiSummary.innerHTML = `
    <li><strong>Port:</strong> ${installData.api.port}</li>
    <li><strong>CORS Origins:</strong> ${installData.api.corsOrigins}</li>
    <li><strong>Rate Limit:</strong> ${installData.api.rateLimitMax} requests/minute</li>
  `;
  
  // Features summary
  const featuresSummary = document.getElementById('features-summary');
  featuresSummary.innerHTML = `
    <li><strong>AI Coach:</strong> ${installData.features.enableAiCoach ? 'Enabled' : 'Disabled'}</li>
    <li><strong>Highlight Generation:</strong> ${installData.features.enableHighlightGeneration ? 'Enabled' : 'Disabled'}</li>
    <li><strong>SMS Notifications:</strong> ${installData.features.enableSmsNotifications ? 'Enabled' : 'Disabled'}</li>
  `;
}

// Start installation
async function startInstallation() {
  const progressContainer = document.getElementById('installation-progress');
  const resultContainer = document.getElementById('installation-result');
  const progressBar = document.getElementById('installation-progress-bar');
  const statusText = document.getElementById('installation-status');
  const installButton = document.getElementById('install-button');
  
  // Show progress, hide result
  progressContainer.style.display = 'block';
  resultContainer.style.display = 'none';
  installButton.disabled = true;
  
  try {
    // Simulate progress (since the actual installation is happening on the server)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${progress}%`;
      statusText.textContent = `Installing... (${progress}%)`;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 300);
    
    // Start installation on server
    const response = await fetch('/api/install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Installation failed');
    
    const data = await response.json();
    
    // Ensure progress reaches 100%
    progress = 100;
    progressBar.style.width = '100%';
    statusText.textContent = 'Installation complete!';
    
    // Show result after a short delay
    setTimeout(() => {
      progressContainer.style.display = 'none';
      resultContainer.style.display = 'block';
    }, 1000);
  } catch (error) {
    console.error('Installation error:', error);
    statusText.textContent = `Installation failed: ${error.message}`;
    installButton.disabled = false;
  }
}