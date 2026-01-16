import api from "../services/api";

// ========== CONFIGURATION ==========
const CONFIG = {
  pingInterval: 14, // minutes
  maxRetries: 3,
  fadeDelay: 5000, // ms
  successFadeDelay: 10000, // ms for first success
};

const STATUS = {
  isUp: false,
  lastCheck: null,
  retryCount: 0,
  isInitialPing: true,
};

// ========== CSS STYLES ==========
const STYLES = `
  #server-status-indicator {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInUp 0.5s ease forwards;
  }
  
  #status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  #status-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid transparent;
    border-radius: 50%;
    display: none;
  }
  
  .checkmark {
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
    margin-left: 4px;
    font-weight: bold;
  }
  
  .checkmark-visible {
    opacity: 1;
    transform: scale(1);
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ========== HELPER FUNCTIONS ==========
const addStyles = () => {
  if (document.getElementById("keep-alive-styles")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "keep-alive-styles";
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);
};

const createIndicator = () => {
  addStyles();

  const indicator = document.createElement("div");
  indicator.id = "server-status-indicator";

  const dot = document.createElement("span");
  dot.id = "status-dot";

  const spinner = document.createElement("span");
  spinner.id = "status-spinner";

  const text = document.createElement("span");
  text.id = "status-text";

  indicator.append(dot, spinner, text);
  document.body.appendChild(indicator);

  return { indicator, dot, spinner, text };
};

const getElements = () => {
  let indicator = document.getElementById("server-status-indicator");
  let dot = document.getElementById("status-dot");
  let spinner = document.getElementById("status-spinner");
  let text = document.getElementById("status-text");

  if (!indicator) {
    return createIndicator();
  }

  return { indicator, dot, spinner, text };
};

// ========== STATUS UPDATES ==========
const showStartingState = () => {
  const { dot, spinner, text, indicator } = getElements();

  dot.style.display = "none";
  spinner.style.display = "inline-block";
  spinner.style.borderTopColor = "#ef4444";
  spinner.style.borderLeftColor = "#ef4444";
  spinner.style.animation = "spin 1s linear infinite";

  text.textContent = "Starting backend...";
  updateIndicatorStyle(indicator, false);
  indicator.style.opacity = "1";

  // console.log('🔴 Starting backend connection...');
};

const updateIndicator = (isUp, responseTime = null) => {
  const { dot, spinner, text, indicator } = getElements();

  // Update visibility
  spinner.style.display = isUp ? "none" : "none";
  dot.style.display = "inline-block";

  if (isUp) {
    // Server is up - green state
    dot.style.backgroundColor = "#10b981";
    dot.style.animation = "pulse 2s infinite";
    updateIndicatorStyle(indicator, true);

    if (STATUS.isInitialPing) {
      showFirstSuccess(text);
      STATUS.isInitialPing = false;
    } else {
      text.textContent = responseTime
        ? `Server active (${responseTime}ms)`
        : "Server active";
    }
  } else {
    // Server is down - red state
    dot.style.backgroundColor = "#ef4444";
    dot.style.animation = "pulse 1.5s infinite";
    updateIndicatorStyle(indicator, false);
    text.textContent = "Server starting...";
  }

  // Fade out after delay
  indicator.style.opacity = "1";
  clearTimeout(indicator._timeout);

  const delay =
    !STATUS.isInitialPing && isUp ? CONFIG.successFadeDelay : CONFIG.fadeDelay;

  indicator._timeout = setTimeout(() => {
    indicator.style.opacity = "0.7";
  }, delay);
};

const showFirstSuccess = (textElement) => {
  textElement.textContent = "Server active";

  const checkmark = document.createElement("span");
  checkmark.className = "checkmark";
  checkmark.textContent = " ✓";

  textElement.innerHTML = "";
  textElement.append("Server active", checkmark);

  setTimeout(() => checkmark.classList.add("checkmark-visible"), 100);
  // console.log('✅ Server connection established');
};

const updateIndicatorStyle = (indicator, isUp) => {
  if (isUp) {
    indicator.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
    indicator.style.color = "#10b981";
    indicator.style.border = "1px solid rgba(16, 185, 129, 0.3)";
  } else {
    indicator.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
    indicator.style.color = "#ef4444";
    indicator.style.border = "1px solid rgba(239, 68, 68, 0.3)";
  }
};

// ========== PING LOGIC ==========
const pingServer = async () => {
  const startTime = Date.now();

  try {
    console.log(
      `🔄 Pinging server at ${new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // This ensures AM/PM
      })}`
    );
    const response = await api.get("/health-check");
    const responseTime = Date.now() - startTime;

    STATUS.isUp = true;
    STATUS.lastCheck = new Date().toISOString();
    STATUS.retryCount = 0;

    console.log(`✅ Ping successful (${responseTime}ms)`);
    updateIndicator(true, responseTime);

    return { success: true, responseTime };
  } catch (error) {
    return handlePingError(error, startTime);
  }
};

const handlePingError = async (error, startTime) => {
  STATUS.retryCount++;
  STATUS.isUp = STATUS.retryCount < CONFIG.maxRetries;

  const errorMsg = error.response?.status || error.message;
  console.log(`❌ Ping failed (Attempt ${STATUS.retryCount}): ${errorMsg}`);

  if (STATUS.retryCount === 1) {
    updateIndicator(false);
  }

  if (STATUS.retryCount >= 2) {
    await tryFallbackPing();
  }

  return {
    success: false,
    error: errorMsg,
    retryCount: STATUS.retryCount,
  };
};

const tryFallbackPing = async () => {
  try {
    console.log("🔄 Trying fallback ping...");
    await fetch(`${process.env.REACT_APP_API_URL}/api/ping`);
    console.log("✅ Fallback ping succeeded");
    updateIndicator(true);
    STATUS.isUp = true;
    STATUS.retryCount = 0;
  } catch {
    console.log("❌ Fallback ping failed");
  }
};

// ========== MAIN EXPORT ==========
export const startKeepAlive = (intervalMinutes = CONFIG.pingInterval) => {
  // console.log('🚀 Starting keep-alive service...');
  // console.log(`📡 Backend URL: ${process.env.REACT_APP_API_URL}`);

  // Show initial state
  setTimeout(showStartingState, 500);
  setTimeout(pingServer, 2000);

  // Set up regular pings
  const interval = setInterval(pingServer, intervalMinutes * 60 * 1000);

  // Cleanup function
  return () => {
    // console.log('🛑 Stopping keep-alive service');
    clearInterval(interval);

    const indicator = document.getElementById("server-status-indicator");
    if (indicator) {
      indicator.style.opacity = "0";
      setTimeout(() => indicator.remove(), 300);
    }
  };
};
