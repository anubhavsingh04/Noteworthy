import api from "../services/api";

// Status object to track server state
const serverStatus = {
  isUp: true,
  lastCheck: null,
  retryCount: 0,
  maxRetries: 3
};

// Create a simple UI element
const createStatusIndicator = () => {
  const indicator = document.createElement('div');
  indicator.id = 'server-status-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
  `;
  
  const dot = document.createElement('span');
  dot.id = 'status-dot';
  dot.style.cssText = `
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.3s ease;
  `;
  
  const text = document.createElement('span');
  text.id = 'status-text';
  
  indicator.appendChild(dot);
  indicator.appendChild(text);
  document.body.appendChild(indicator);
  
  return { indicator, dot, text };
};

// Update the indicator based on server status
const updateStatusIndicator = (isUp, responseTime = null) => {
  let indicator = document.getElementById('server-status-indicator');
  let dot = document.getElementById('status-dot');
  let text = document.getElementById('status-text');
  
  // Create if doesn't exist
  if (!indicator) {
    const elements = createStatusIndicator();
    indicator = elements.indicator;
    dot = elements.dot;
    text = elements.text;
  }
  
  if (isUp) {
    dot.style.backgroundColor = '#10b981'; // Green
    text.textContent = responseTime 
      ? `Server active (${responseTime}ms)` 
      : 'Server active';
    indicator.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    indicator.style.color = '#10b981';
    indicator.style.border = '1px solid rgba(16, 185, 129, 0.2)';
  } else {
    dot.style.backgroundColor = '#ef4444'; // Red
    text.textContent = 'Server starting...';
    indicator.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    indicator.style.color = '#ef4444';
    indicator.style.border = '1px solid rgba(239, 68, 68, 0.2)';
  }
  
  // Show indicator for a few seconds then fade out
  indicator.style.opacity = '1';
  clearTimeout(indicator._timeout);
  indicator._timeout = setTimeout(() => {
    indicator.style.opacity = '0.5';
  }, 5000);
};

export const startKeepAlive = (intervalMinutes = 14) => {
  const pingServer = async () => {
    const startTime = Date.now();
    
    try {
      const response = await api.get('/health-check');
      const responseTime = Date.now() - startTime;
      
      serverStatus.isUp = true;
      serverStatus.lastCheck = new Date().toISOString();
      serverStatus.retryCount = 0;
      
      // Only show success occasionally to avoid spam
      if (Math.random() < 0.2) { // 20% chance to show
        console.log(`✅ Server ping successful (${responseTime}ms)`);
        updateStatusIndicator(true, responseTime);
      }
      
      return { success: true, responseTime, data: response.data };
      
    } catch (error) {
      serverStatus.retryCount++;
      serverStatus.isUp = serverStatus.retryCount < serverStatus.maxRetries;
      
      const errorMsg = error.response 
        ? `Status: ${error.response.status}` 
        : error.message;
      
      console.log(`❌ Ping failed (Attempt ${serverStatus.retryCount}): ${errorMsg}`);
      updateStatusIndicator(false);
      
      // If server seems down, try a simpler endpoint
      if (serverStatus.retryCount >= 2) {
        try {
          await fetch(`${process.env.REACT_APP_API_URL}/api/ping`);
          console.log('🔄 Fallback ping succeeded');
          updateStatusIndicator(true);
          serverStatus.isUp = true;
          serverStatus.retryCount = 0;
        } catch (fallbackError) {
          // Continue with error state
        }
      }
      
      return { 
        success: false, 
        error: errorMsg,
        retryCount: serverStatus.retryCount 
      };
    }
  };

  // Initial ping with delay to let page load
  setTimeout(() => {
    pingServer();
    updateStatusIndicator(true); // Assume up initially
  }, 2000);
  
  // Regular pings
  const interval = setInterval(pingServer, intervalMinutes * 60 * 1000);

  return () => {
    clearInterval(interval);
    const indicator = document.getElementById('server-status-indicator');
    if (indicator) {
      indicator.remove();
    }
  };
};