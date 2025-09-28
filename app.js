// Maruti Suzuki Mobile App JavaScript

// App data from provided JSON
const appData = {
  user: {
    name: "Soham Mehta",
    email: "soham.mehta2k@gmail.com",
    location: "Ghaziabad",
    membershipTier: "Silver",
    loyaltyPoints: 2450,
    profilePicture: "SM",
    currentVehicle: {
      model: "Swift VXI",
      year: 2023,
      regNumber: "UP 14 XX 1234",
      lastService: "2025-08-15",
      nextService: "2025-10-15",
      mileage: 15420
    }
  },
  quickActions: [
    {"title": "Book Service", "icon": "🔧", "action": "bookService"},
    {"title": "Remote Lock", "icon": "🔐", "action": "remoteLock"},
    {"title": "Find Dealer", "icon": "📍", "action": "findDealer"},
    {"title": "AR Showroom", "icon": "🥽", "action": "arShowroom"},
    {"title": "Fuel Prices", "icon": "⛽", "action": "fuelPrices"},
    {"title": "Insurance", "icon": "🛡️", "action": "insurance"},
    {"title": "Roadside Help", "icon": "🚗", "action": "roadsideHelp"},
    {"title": "Trade-in", "icon": "💰", "action": "tradeIn"}
  ],
  vehicles: [
    {
      id: 1,
      name: "Alto K10",
      category: "Arena",
      price: "₹3.70L",
      mileage: "24.39 kmpl",
      image: "🚗",
      rating: 4.2,
      engine: "998cc",
      transmission: "Manual/AMT"
    },
    {
      id: 2,
      name: "Swift",
      category: "Arena", 
      price: "₹5.79L",
      mileage: "24.8 kmpl",
      image: "🚙",
      rating: 4.5,
      engine: "1197cc",
      transmission: "Manual/AMT"
    },
    {
      id: 3,
      name: "Brezza",
      category: "Arena",
      price: "₹8.26L", 
      mileage: "17.4 kmpl",
      image: "🚐",
      rating: 4.3,
      engine: "1462cc",
      transmission: "Manual/AT"
    },
    {
      id: 4,
      name: "Grand Vitara",
      category: "Nexa",
      price: "₹10.77L",
      mileage: "21.1 kmpl",
      image: "🚗",
      rating: 4.4,
      engine: "1462cc",
      transmission: "Manual/AT/Hybrid"
    }
  ],
  notifications: [
    {
      title: "Service Reminder",
      message: "Your Swift service is due in 15 days",
      time: "2 hours ago",
      type: "service"
    },
    {
      title: "Special Offer",
      message: "Get ₹25,000 extra on trade-in this month",
      time: "1 day ago", 
      type: "offer"
    }
  ],
  chatHistory: [
    {
      sender: "ai",
      message: "Hi Soham! I'm your AI assistant. How can I help you today?",
      timestamp: "2025-09-28T17:15:00"
    },
    {
      sender: "user", 
      message: "What cars would you recommend for a family of 4?",
      timestamp: "2025-09-28T17:16:00"
    },
    {
      sender: "ai",
      message: "For a family of 4, I'd recommend:\n\n🚗 **Brezza** (₹8.26L) - Perfect compact SUV\n🚙 **Ertiga** (₹8.80L) - 7-seater for growing families\n🚗 **Grand Vitara** (₹10.77L) - Premium hybrid option\n\nWould you like to see detailed comparisons or book a test drive?",
      timestamp: "2025-09-28T17:16:30"
    }
  ],
  quickReplies: [
    "Book service for my Swift",
    "Show me car recommendations", 
    "Check my vehicle status",
    "Find nearest dealer",
    "What's my loyalty points?",
    "Help with insurance"
  ]
};

// App state
let appState = {
  currentTab: 'homeTab',
  vehicleStatus: {
    fuelLevel: 75,
    batteryLevel: 89,
    isLocked: true,
    engineRunning: false,
    climateOn: false
  },
  mediaPlayer: {
    isPlaying: false,
    currentTrack: 'Radio Mirchi FM',
    volume: 65
  },
  selectedCategory: 'all',
  chatbot: {
    isOpen: false,
    messages: [...appData.chatHistory],
    isTyping: false,
    hasNewMessages: false
  }
};

// DOM elements
let elements = {};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize the application
function initializeApp() {
  cacheElements();
  setupEventListeners();
  updateStatusBar();
  renderVehicles();
  initializeChatbot();
  startRealTimeUpdates();
  
  // Add touch feedback to interactive elements
  addTouchFeedback();
  
  // Show welcome toast
  showToast('Welcome back, ' + appData.user.name + '!', 'success');
}

// Cache DOM elements
function cacheElements() {
  elements = {
    // Tab navigation
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Status bar
    currentTime: document.getElementById('currentTime'),
    
    // Header
    notificationBtn: document.getElementById('notificationBtn'),
    menuBtn: document.getElementById('menuBtn'),
    
    // Cars tab
    vehiclesContainer: document.getElementById('vehiclesContainer'),
    categoryChips: document.querySelectorAll('.chip'),
    carSearch: document.getElementById('carSearch'),
    filterBtn: document.getElementById('filterBtn'),
    
    // Toast container
    toastContainer: document.getElementById('toastContainer'),
    modalOverlay: document.getElementById('modalOverlay'),
    
    // Chatbot elements
    chatbotFloat: document.getElementById('chatbotFloat'),
    chatbotModal: document.getElementById('chatbotModal'),
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendButton: document.getElementById('sendButton'),
    typingIndicator: document.getElementById('typingIndicator'),
    quickReplies: document.getElementById('quickReplies'),
    chatNotificationDot: document.getElementById('chatNotificationDot')
  };
}

// Setup event listeners
function setupEventListeners() {
  // Tab navigation
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
  });

  // Category chips
  elements.categoryChips.forEach(chip => {
    chip.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      selectCategory(this, category);
    });
  });

  // Search functionality
  if (elements.carSearch) {
    elements.carSearch.addEventListener('input', handleSearch);
  }

  // Header buttons
  if (elements.notificationBtn) {
    elements.notificationBtn.addEventListener('click', showNotifications);
  }

  if (elements.menuBtn) {
    elements.menuBtn.addEventListener('click', showMenu);
  }

  // Filter button
  if (elements.filterBtn) {
    elements.filterBtn.addEventListener('click', showFilters);
  }

  // Modal overlay
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', hideModal);
  }

  // Chatbot event listeners
  setupChatbotEventListeners();

  // Prevent default touch behaviors
  document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('no-touch')) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Setup chatbot event listeners
function setupChatbotEventListeners() {
  // Chat input
  if (elements.chatInput) {
    elements.chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    elements.chatInput.addEventListener('input', function() {
      elements.sendButton.disabled = this.value.trim() === '';
    });
  }

  // Send button
  if (elements.sendButton) {
    elements.sendButton.addEventListener('click', sendMessage);
  }

  // Make chatbot float draggable
  makeDraggable(elements.chatbotFloat);
}

// Initialize chatbot
function initializeChatbot() {
  renderChatMessages();
  renderQuickReplies();
  elements.sendButton.disabled = true;
}

// Make element draggable
function makeDraggable(element) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  element.addEventListener('touchstart', function(e) {
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = parseInt(window.getComputedStyle(element).right);
    startTop = parseInt(window.getComputedStyle(element).bottom);
    element.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = startX - touch.clientX;
    const deltaY = touch.clientY - startY;
    
    let newRight = startLeft + deltaX;
    let newBottom = startTop - deltaY;
    
    // Boundary constraints
    const containerRect = document.querySelector('.phone-container').getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    newRight = Math.max(10, Math.min(newRight, containerRect.width - elementRect.width - 10));
    newBottom = Math.max(120, Math.min(newBottom, containerRect.height - elementRect.height - 60));
    
    element.style.right = newRight + 'px';
    element.style.bottom = newBottom + 'px';
    
    e.preventDefault();
  });

  document.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    element.style.transition = 'all 0.3s ease';
    
    // Snap to nearest side
    const containerRect = document.querySelector('.phone-container').getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const centerX = elementRect.left + elementRect.width / 2;
    
    if (centerX < containerRect.width / 2) {
      element.style.right = (containerRect.width - elementRect.width - 20) + 'px';
    } else {
      element.style.right = '20px';
    }
  });

  // Click handler (only if not dragging)
  let clickTimeout;
  element.addEventListener('touchstart', function() {
    clickTimeout = setTimeout(() => {
      if (!isDragging) {
        openChatbot();
      }
    }, 200);
  });

  element.addEventListener('touchend', function() {
    clearTimeout(clickTimeout);
  });
}

// Open chatbot modal
function openChatbot() {
  if (appState.chatbot.isOpen) return;
  
  appState.chatbot.isOpen = true;
  appState.chatbot.hasNewMessages = false;
  
  elements.chatbotModal.classList.remove('hidden');
  elements.chatNotificationDot.style.display = 'none';
  
  // Focus input after animation
  setTimeout(() => {
    elements.chatInput.focus();
    scrollToBottom();
  }, 400);
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

// Close chatbot modal
function closeChatbot() {
  if (!appState.chatbot.isOpen) return;
  
  appState.chatbot.isOpen = false;
  elements.chatbotModal.classList.add('hidden');
  elements.chatInput.blur();
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Send message
function sendMessage() {
  const message = elements.chatInput.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage('user', message);
  elements.chatInput.value = '';
  elements.sendButton.disabled = true;
  
  // Show typing indicator
  showTypingIndicator();
  
  // Simulate AI response
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateAIResponse(message);
    addMessage('ai', response);
    
    // Handle special actions
    handleAIActions(message, response);
  }, 1500 + Math.random() * 1000);
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Add message to chat
function addMessage(sender, message, timestamp = null) {
  const messageData = {
    sender,
    message,
    timestamp: timestamp || new Date().toISOString()
  };
  
  appState.chatbot.messages.push(messageData);
  renderChatMessages();
  scrollToBottom();
  
  // Show notification if chatbot is closed
  if (!appState.chatbot.isOpen && sender === 'ai') {
    appState.chatbot.hasNewMessages = true;
    elements.chatNotificationDot.style.display = 'block';
  }
}

// Render chat messages
function renderChatMessages() {
  if (!elements.chatMessages) return;
  
  const messagesHTML = appState.chatbot.messages.map(msg => {
    const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    
    const avatar = msg.sender === 'ai' ? '🤖' : appData.user.profilePicture;
    
    return `
      <div class="message ${msg.sender}">
        ${msg.sender === 'ai' ? `<div class="message-avatar">${avatar}</div>` : ''}
        <div class="message-content">
          <div class="message-bubble">${formatMessage(msg.message)}</div>
          <div class="message-time">${time}</div>
        </div>
        ${msg.sender === 'user' ? `<div class="message-avatar">${avatar}</div>` : ''}
      </div>
    `;
  }).join('');
  
  elements.chatMessages.innerHTML = messagesHTML;
}

// Format message with basic markdown-like formatting
function formatMessage(message) {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// Show typing indicator
function showTypingIndicator() {
  appState.chatbot.isTyping = true;
  elements.typingIndicator.classList.remove('hidden');
  scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
  appState.chatbot.isTyping = false;
  elements.typingIndicator.classList.add('hidden');
}

// Scroll chat to bottom
function scrollToBottom() {
  setTimeout(() => {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }, 100);
}

// Generate AI response
function generateAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  // Context-aware responses based on current tab
  const currentTab = appState.currentTab;
  
  // Service-related queries
  if (msg.includes('service') || msg.includes('book')) {
    if (msg.includes('swift')) {
      return `I can help you book service for your Swift VXI! Your next service is due on October 15, 2025. \n\nWould you like me to:\n• Schedule the service now\n• Show available time slots\n• Find nearby service centers`;
    }
    return `I'll help you with service booking. For your Swift VXI, the next service is due in 15 days. Shall I open the service booking for you?`;
  }
  
  // Car recommendation queries
  if (msg.includes('recommend') || msg.includes('car') || msg.includes('family')) {
    return `For a family of 4, I'd recommend these popular choices:\n\n🚗 **Brezza** (₹8.26L) - Perfect compact SUV with great features\n🚙 **Swift** (₹5.79L) - Reliable and fuel-efficient\n🚐 **Grand Vitara** (₹10.77L) - Premium hybrid option\n\nWould you like to see detailed comparisons or book a test drive?`;
  }
  
  // Vehicle status queries
  if (msg.includes('status') || msg.includes('vehicle') || msg.includes('car')) {
    return `Your Swift VXI status:\n\n⛽ Fuel: ${appState.vehicleStatus.fuelLevel}%\n🔋 Battery: ${appState.vehicleStatus.batteryLevel}%\n🔒 Status: ${appState.vehicleStatus.isLocked ? 'Locked' : 'Unlocked'}\n📍 Location: Mall Parking Level 2\n\nIs there anything specific you'd like me to help with?`;
  }
  
  // Dealer queries
  if (msg.includes('dealer') || msg.includes('location') || msg.includes('near')) {
    return `I found 3 Maruti dealers near Ghaziabad:\n\n📍 **Arena Ghaziabad** - 2.3 km\n📍 **Nexa Experience Center** - 4.1 km\n📍 **True Value Outlet** - 3.8 km\n\nAll are currently open. Would you like directions or contact details?`;
  }
  
  // Loyalty points queries
  if (msg.includes('points') || msg.includes('loyalty') || msg.includes('rewards')) {
    return `Your Maruti Rewards status:\n\n🏆 Current Points: ${appData.user.loyaltyPoints}\n⭐ Tier: ${appData.user.membershipTier}\n🎯 Points to Gold: 550\n\nYou can redeem points for:\n• Service discounts\n• Accessories\n• Extended warranty\n\nWould you like to see redemption options?`;
  }
  
  // Insurance queries
  if (msg.includes('insurance') || msg.includes('policy')) {
    return `I can help with your vehicle insurance! Here are your options:\n\n🛡️ **Renew Policy** - Current expires June 2025\n💰 **Compare Plans** - Get best rates\n📱 **Instant Quote** - Quick online process\n🚗 **Add-ons** - Zero depreciation, engine protect\n\nWhat would you like me to help you with?`;
  }
  
  // Price-related queries
  if (msg.includes('price') || msg.includes('cost') || msg.includes('emi')) {
    return `I can help you with pricing and financing options! Are you looking for:\n\n💰 **New Car Prices** - Latest models and offers\n📊 **EMI Calculator** - Monthly payment options\n🔄 **Exchange Value** - Trade-in your current vehicle\n🎁 **Current Offers** - Festive discounts available\n\nWhich one interests you?`;
  }
  
  // Greeting responses
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return `Hello ${appData.user.name}! 👋 Great to see you here. I'm your AI assistant ready to help with:\n\n• Vehicle service & maintenance\n• New car recommendations\n• Dealer locations & bookings\n• Insurance & financial services\n• Loyalty rewards & offers\n\nWhat can I assist you with today?`;
  }
  
  // Thank you responses
  if (msg.includes('thank') || msg.includes('thanks')) {
    return `You're welcome, ${appData.user.name}! 😊 I'm always here to help. Is there anything else you'd like to know about your Swift or our services?`;
  }
  
  // Default contextual response
  const contextResponses = {
    homeTab: `I can see you're on the home screen. Need help with any quick actions, service reminders, or checking your ${appData.user.currentVehicle.model} status?`,
    carsTab: `Looking at cars? I can help you compare models, check prices, or book test drives. What type of vehicle are you interested in?`,
    connectTab: `I see you're in Connect mode! Need help with remote vehicle controls or checking your trip statistics?`,
    servicesTab: `Perfect timing! I can help you book service, order genuine parts, or renew insurance. What service do you need?`,
    profileTab: `I can help you with account settings, rewards redemption, or document management. What would you like to do?`
  };
  
  return contextResponses[currentTab] || `I'm here to help! You can ask me about vehicle service, car recommendations, dealer locations, insurance, or any Maruti services. What would you like to know?`;
}

// Handle AI actions
function handleAIActions(userMessage, aiResponse) {
  const msg = userMessage.toLowerCase();
  
  // Service booking action
  if ((msg.includes('book') && msg.includes('service')) || msg.includes('schedule')) {
    setTimeout(() => {
      addMessage('ai', 'I\'m opening the service booking section for you! 📱');
      setTimeout(() => {
        switchTab('servicesTab');
        closeChatbot();
        showToast('Service booking opened', 'success');
      }, 1000);
    }, 1000);
  }
  
  // Show cars action
  if (msg.includes('show') && (msg.includes('car') || msg.includes('model'))) {
    setTimeout(() => {
      addMessage('ai', 'Let me show you our car lineup! 🚗');
      setTimeout(() => {
        switchTab('carsTab');
        closeChatbot();
        showToast('Car catalog opened', 'success');
      }, 1000);
    }, 1000);
  }
  
  // Vehicle control action
  if (msg.includes('lock') || msg.includes('unlock') || msg.includes('start')) {
    setTimeout(() => {
      addMessage('ai', 'Taking you to vehicle controls! 🔐');
      setTimeout(() => {
        switchTab('connectTab');
        closeChatbot();
        showToast('Vehicle controls opened', 'success');
      }, 1000);
    }, 1000);
  }
}

// Render quick replies
function renderQuickReplies() {
  if (!elements.quickReplies) return;
  
  const quickRepliesHTML = appData.quickReplies.map(reply => `
    <button class="quick-reply-btn" onclick="sendQuickReply('${reply}')">${reply}</button>
  `).join('');
  
  elements.quickReplies.innerHTML = quickRepliesHTML;
}

// Send quick reply
function sendQuickReply(reply) {
  elements.chatInput.value = reply;
  sendMessage();
}

// Tab switching functionality
function switchTab(tabId) {
  // Update tab buttons
  elements.tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    }
  });

  // Update tab content
  elements.tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === tabId) {
      content.classList.add('active');
      content.classList.add('fade-in');
    }
  });

  appState.currentTab = tabId;

  // Load tab-specific content
  if (tabId === 'carsTab' && elements.vehiclesContainer.children.length === 0) {
    renderVehicles();
  }
}

// Category selection
function selectCategory(chipElement, category) {
  // Update chip appearance
  elements.categoryChips.forEach(chip => {
    chip.classList.remove('active');
  });
  chipElement.classList.add('active');

  appState.selectedCategory = category;
  renderVehicles();
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// Render vehicles based on category
function renderVehicles() {
  if (!elements.vehiclesContainer) return;

  let filteredVehicles = appData.vehicles;
  
  if (appState.selectedCategory !== 'all') {
    filteredVehicles = appData.vehicles.filter(vehicle => 
      vehicle.category === appState.selectedCategory
    );
  }

  const vehicleHTML = filteredVehicles.map(vehicle => `
    <div class="vehicle-card touch-feedback" onclick="showVehicleDetails('${vehicle.name}')">
      <div class="vehicle-image">
        ${vehicle.image}
        <div class="vehicle-badge">${vehicle.category}</div>
      </div>
      <div class="vehicle-details">
        <div class="vehicle-header">
          <h3 class="vehicle-name">${vehicle.name}</h3>
          <span class="vehicle-price">${vehicle.price}</span>
        </div>
        <div class="vehicle-specs">
          <span class="vehicle-spec">⛽ ${vehicle.mileage}</span>
          <span class="vehicle-spec">🔧 ${vehicle.engine}</span>
          <span class="vehicle-spec">⚙️ ${vehicle.transmission}</span>
        </div>
        <div class="vehicle-rating">
          <span class="stars">⭐⭐⭐⭐⭐</span>
          <span class="rating-value">${vehicle.rating}</span>
        </div>
        <div class="vehicle-actions">
          <button class="action-btn primary touch-feedback" onclick="event.stopPropagation(); configureVehicle('${vehicle.name}')">
            Configure
          </button>
          <button class="action-btn secondary touch-feedback" onclick="event.stopPropagation(); viewInAR('${vehicle.name}')">
            AR View
          </button>
        </div>
      </div>
    </div>
  `).join('');

  elements.vehiclesContainer.innerHTML = vehicleHTML;
}

// Search functionality
function handleSearch() {
  const searchTerm = elements.carSearch.value.toLowerCase();
  const vehicleCards = elements.vehiclesContainer.querySelectorAll('.vehicle-card');

  vehicleCards.forEach(card => {
    const vehicleName = card.querySelector('.vehicle-name').textContent.toLowerCase();
    const isMatch = vehicleName.includes(searchTerm);
    card.style.display = isMatch ? 'block' : 'none';
  });
}

// Update status bar time
function updateStatusBar() {
  if (!elements.currentTime) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });
  
  elements.currentTime.textContent = timeString;
}

// Start real-time updates
function startRealTimeUpdates() {
  // Update time every minute
  setInterval(updateStatusBar, 60000);
  
  // Simulate vehicle status updates
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance
      simulateVehicleStatusUpdate();
    }
  }, 30000);

  // Simulate AI proactive messages
  setInterval(() => {
    if (Math.random() < 0.05 && !appState.chatbot.isOpen) { // 5% chance
      simulateProactiveMessage();
    }
  }, 60000);
}

// Simulate proactive AI messages
function simulateProactiveMessage() {
  const proactiveMessages = [
    "🔔 Reminder: Your Swift service is due in 2 weeks. Shall I book it for you?",
    "💰 Special offer: Get ₹25,000 extra on your trade-in this month!",
    "⛽ Fuel tip: Best prices nearby at Shell (2.3km) - ₹96.75/L",
    "🚗 Your driving score improved to 87! Keep up the good driving habits.",
    "🎉 You're 550 points away from Gold tier. Check out easy ways to earn more!"
  ];
  
  const randomMessage = proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)];
  addMessage('ai', randomMessage);
  
  // Show notification
  showToast('New message from AI Assistant', 'info');
}

// Simulate vehicle status updates
function simulateVehicleStatusUpdate() {
  // Randomly update fuel level (decrease)
  if (Math.random() < 0.3) {
    appState.vehicleStatus.fuelLevel = Math.max(10, appState.vehicleStatus.fuelLevel - 1);
    updateVehicleStatusDisplay();
  }
  
  // Randomly update battery level
  if (Math.random() < 0.2) {
    const change = Math.random() > 0.5 ? 1 : -1;
    appState.vehicleStatus.batteryLevel = Math.max(20, Math.min(100, 
      appState.vehicleStatus.batteryLevel + change));
    updateVehicleStatusDisplay();
  }
}

// Update vehicle status display
function updateVehicleStatusDisplay() {
  const statusItems = document.querySelectorAll('.status-item .status-text');
  if (statusItems.length >= 3) {
    statusItems[0].textContent = `${appState.vehicleStatus.fuelLevel}%`;
    statusItems[1].textContent = `${appState.vehicleStatus.batteryLevel}%`;
    statusItems[2].textContent = appState.vehicleStatus.isLocked ? 'Locked' : 'Unlocked';
  }
}

// Quick action handlers
function handleQuickAction(action) {
  const actionMap = {
    bookService: () => {
      switchTab('servicesTab');
      showToast('Service booking opened', 'success');
      
      // Send message to chatbot
      if (!appState.chatbot.isOpen) {
        setTimeout(() => {
          addMessage('ai', 'I see you opened service booking! Need help scheduling your Swift service?');
        }, 2000);
      }
    },
    remoteLock: () => {
      toggleLock();
    },
    findDealer: () => {
      showToast('Finding nearest dealers...', 'info');
      setTimeout(() => {
        showToast('3 dealers found within 5km', 'success');
        if (!appState.chatbot.isOpen) {
          addMessage('ai', 'I found 3 dealers near you! Open chat if you need directions or want to book a visit.');
        }
      }, 1500);
    },
    arShowroom: () => {
      switchTab('carsTab');
      showToast('AR Showroom opened', 'success');
      
      if (!appState.chatbot.isOpen) {
        setTimeout(() => {
          addMessage('ai', 'Welcome to the AR showroom! Which car would you like to see in 3D?');
        }, 2000);
      }
    },
    fuelPrices: () => {
      showToast('Loading fuel prices...', 'info');
      setTimeout(() => {
        showToast('Best price: ₹96.75/L at Shell (2.3km)', 'success');
      }, 1200);
    },
    insurance: () => {
      showToast('Insurance services opened', 'info');
    },
    roadsideHelp: () => {
      showToast('Roadside assistance available 24/7', 'success');
    },
    tradeIn: () => {
      showToast('Trade-in value: ₹4.2L for your Swift', 'info');
    }
  };

  if (actionMap[action]) {
    actionMap[action]();
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(75);
    }
  }
}

// Vehicle control functions
function toggleLock() {
  appState.vehicleStatus.isLocked = !appState.vehicleStatus.isLocked;
  const status = appState.vehicleStatus.isLocked ? 'locked' : 'unlocked';
  
  showToast(`Vehicle ${status} successfully`, 'success');
  updateVehicleStatusDisplay();
  
  // Notify chatbot
  if (!appState.chatbot.isOpen) {
    setTimeout(() => {
      addMessage('ai', `I noticed you ${status} your Swift remotely. Everything looks good! 🔐`);
    }, 3000);
  }
  
  // Stronger haptic feedback for vehicle actions
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
}

function startEngine() {
  appState.vehicleStatus.engineRunning = !appState.vehicleStatus.engineRunning;
  const status = appState.vehicleStatus.engineRunning ? 'started' : 'stopped';
  
  showToast(`Engine ${status} remotely`, 'success');
  
  if (navigator.vibrate) {
    navigator.vibrate([150, 100, 150]);
  }
}

function toggleAC() {
  appState.vehicleStatus.climateOn = !appState.vehicleStatus.climateOn;
  const status = appState.vehicleStatus.climateOn ? 'turned on' : 'turned off';
  
  showToast(`Climate control ${status}`, 'success');
  
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

function locateVehicle() {
  showToast('Locating your vehicle...', 'info');
  
  setTimeout(() => {
    showToast('Vehicle found: Mall Parking, Level 2, Slot B23', 'success');
  }, 2000);
  
  if (navigator.vibrate) {
    navigator.vibrate(75);
  }
}

// Media player controls
function togglePlayback() {
  appState.mediaPlayer.isPlaying = !appState.mediaPlayer.isPlaying;
  
  const playBtn = document.querySelector('.play-btn');
  if (playBtn) {
    playBtn.textContent = appState.mediaPlayer.isPlaying ? '⏸️' : '▶️';
  }
  
  const status = appState.mediaPlayer.isPlaying ? 'Playing' : 'Paused';
  showToast(`${status}: ${appState.mediaPlayer.currentTrack}`, 'info');
  
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Vehicle and service functions
function showVehicleDetails(vehicleName) {
  showToast(`Loading ${vehicleName} details...`, 'info');
  
  setTimeout(() => {
    showToast(`${vehicleName} configurator opened`, 'success');
  }, 1000);
}

function configureVehicle(vehicleName) {
  showToast(`Opening ${vehicleName} configurator...`, 'info');
  
  setTimeout(() => {
    showToast('3D configurator loaded - customize your vehicle!', 'success');
  }, 1500);
}

function viewInAR(vehicleName) {
  showToast(`Launching AR experience for ${vehicleName}...`, 'info');
  
  setTimeout(() => {
    showToast('AR camera ready - point at ground to place vehicle', 'success');
  }, 1000);
}

function bookService() {
  showToast('Opening service booking...', 'info');
  
  setTimeout(() => {
    showToast('Available slots: Tomorrow 10 AM, 2 PM, 4 PM', 'success');
  }, 1200);
}

function viewParts() {
  showToast('Loading genuine parts catalog...', 'info');
  
  setTimeout(() => {
    showToast('Parts catalog opened - 1000+ items available', 'success');
  }, 1000);
}

function renewInsurance() {
  showToast('Loading insurance renewal...', 'info');
  
  setTimeout(() => {
    showToast('Current policy expires June 15, 2025', 'warning');
  }, 1200);
}

function roadsideAssistance() {
  showToast('Connecting to roadside assistance...', 'info');
  
  setTimeout(() => {
    showToast('24/7 assistance available - Call initiated', 'success');
  }, 1500);
}

// Profile functions
function viewDocuments() {
  showToast('Loading document vault...', 'info');
  
  setTimeout(() => {
    showToast('3 documents found: License, RC, Insurance', 'success');
  }, 1000);
}

function viewRewards() {
  showToast('Loading rewards program...', 'info');
  
  setTimeout(() => {
    showToast(`${appData.user.loyaltyPoints} points available for redemption`, 'success');
  }, 1200);
}

function viewSettings() {
  showToast('Opening app settings...', 'info');
}

function getSupport() {
  showToast('Loading help & support...', 'info');
  
  setTimeout(() => {
    showToast('Live chat available 9 AM - 9 PM', 'success');
  }, 1000);
}

// Header functions
function showNotifications() {
  const notificationHTML = `
    <div class="notification-panel">
      <h3>Notifications</h3>
      ${appData.notifications.map(notif => `
        <div class="notification-item">
          <div class="notif-icon">${notif.type === 'service' ? '🔧' : '💰'}</div>
          <div class="notif-content">
            <h4>${notif.title}</h4>
            <p>${notif.message}</p>
            <span class="notif-time">${notif.time}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  showModal(notificationHTML);
}

function showMenu() {
  const menuHTML = `
    <div class="menu-panel">
      <h3>More Services</h3>
      <div class="menu-items">
        <div class="menu-item-modal" onclick="handleMenuAction('trueValue')">
          <span class="menu-icon">🚗</span>
          <div>
            <h4>True Value</h4>
            <p>Used Cars & Exchange</p>
          </div>
        </div>
        <div class="menu-item-modal" onclick="handleMenuAction('partsKart')">
          <span class="menu-icon">🔧</span>
          <div>
            <h4>Parts Kart</h4>
            <p>Genuine Parts & Accessories</p>
          </div>
        </div>
        <div class="menu-item-modal" onclick="handleMenuAction('drivingSchool')">
          <span class="menu-icon">🚙</span>
          <div>
            <h4>Driving School</h4>
            <p>Learn to Drive</p>
          </div>
        </div>
        <div class="menu-item-modal" onclick="handleMenuAction('smartFinance')">
          <span class="menu-icon">💳</span>
          <div>
            <h4>Smart Finance</h4>
            <p>Car Loans & EMI</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  showModal(menuHTML);
}

function handleMenuAction(action) {
  const actions = {
    trueValue: 'True Value marketplace opened',
    partsKart: 'Parts Kart store opened',
    drivingSchool: 'Driving School booking opened',
    smartFinance: 'Smart Finance options opened'
  };
  
  hideModal();
  showToast(actions[action] || 'Service opened', 'success');
}

function showFilters() {
  const filterHTML = `
    <div class="filter-panel">
      <h3>Filter Cars</h3>
      <div class="filter-options">
        <div class="filter-group">
          <h4>Price Range</h4>
          <div class="price-range">
            <button class="filter-chip">Under ₹5L</button>
            <button class="filter-chip">₹5L - ₹10L</button>
            <button class="filter-chip">Above ₹10L</button>
          </div>
        </div>
        <div class="filter-group">
          <h4>Body Type</h4>
          <div class="body-types">
            <button class="filter-chip">Hatchback</button>
            <button class="filter-chip">Sedan</button>
            <button class="filter-chip">SUV</button>
            <button class="filter-chip">Crossover</button>
          </div>
        </div>
        <div class="filter-group">
          <h4>Fuel Type</h4>
          <div class="fuel-types">
            <button class="filter-chip">Petrol</button>
            <button class="filter-chip">CNG</button>
            <button class="filter-chip">Hybrid</button>
          </div>
        </div>
      </div>
      <button class="apply-filters-btn" onclick="applyFilters()">Apply Filters</button>
    </div>
  `;
  
  showModal(filterHTML);
}

function applyFilters() {
  hideModal();
  showToast('Filters applied - 6 vehicles match your criteria', 'success');
}

// Modal functions
function showModal(content) {
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.innerHTML = content;
  
  elements.modalOverlay.innerHTML = '';
  elements.modalOverlay.appendChild(modalContent);
  elements.modalOverlay.classList.add('active');
  
  // Add modal-specific styles
  const style = document.createElement('style');
  style.textContent = `
    .modal-content {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-surface);
      border-radius: 20px;
      padding: 24px;
      max-width: 320px;
      width: 90%;
      max-height: 70vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      border: 1px solid var(--color-border);
    }
    .notification-panel h3, .menu-panel h3, .filter-panel h3 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--color-text);
    }
    .notification-item, .menu-item-modal {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border);
      cursor: pointer;
    }
    .notif-icon, .menu-icon {
      font-size: 20px;
      width: 32px;
      text-align: center;
    }
    .notif-content h4, .menu-item-modal h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text);
    }
    .notif-content p, .menu-item-modal p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: var(--color-text-secondary);
    }
    .notif-time {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
    .filter-group {
      margin-bottom: 20px;
    }
    .filter-group h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text);
    }
    .filter-chip {
      padding: 8px 12px;
      margin: 4px 4px 4px 0;
      background: var(--color-bg-1);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      font-size: 14px;
      color: var(--color-text);
      cursor: pointer;
    }
    .filter-chip:hover {
      background: #01458E;
      color: white;
    }
    .apply-filters-btn {
      width: 100%;
      padding: 12px;
      background: #01458E;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
    }
  `;
  document.head.appendChild(style);
}

function hideModal() {
  elements.modalOverlay.classList.remove('active');
  elements.modalOverlay.innerHTML = '';
}

// Toast notification system
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  elements.toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        elements.toastContainer.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Add touch feedback to elements
function addTouchFeedback() {
  const touchElements = document.querySelectorAll('.touch-feedback');
  
  touchElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
    
    element.addEventListener('touchcancel', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Handle orientation changes
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    updateStatusBar();
  }, 500);
});

// Performance optimization: lazy load images
function lazyLoadImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}

// Export functions for global access
window.openChatbot = openChatbot;
window.closeChatbot = closeChatbot;
window.sendQuickReply = sendQuickReply;
window.handleQuickAction = handleQuickAction;
window.toggleLock = toggleLock;
window.startEngine = startEngine;
window.toggleAC = toggleAC;
window.locateVehicle = locateVehicle;
window.togglePlayback = togglePlayback;
window.showVehicleDetails = showVehicleDetails;
window.configureVehicle = configureVehicle;
window.viewInAR = viewInAR;
window.bookService = bookService;
window.viewParts = viewParts;
window.renewInsurance = renewInsurance;
window.roadsideAssistance = roadsideAssistance;
window.viewDocuments = viewDocuments;
window.viewRewards = viewRewards;
window.viewSettings = viewSettings;
window.getSupport = getSupport;
window.handleMenuAction = handleMenuAction;
window.applyFilters = applyFilters;
window.hideModal = hideModal;