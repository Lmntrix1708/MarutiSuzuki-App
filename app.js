// Maruti Suzuki Mobile App JavaScript

// Application Data
const appData = {
  user: {
    name: "Soham Mehta",
    location: "Ghaziabad",
    currentVehicle: "Swift VXI",
    membershipTier: "Silver",
    loyaltyPoints: 2450
  },
  vehicles: [
    {
      name: "Alto K10",
      category: "Arena",
      type: "Hatchback", 
      startingPrice: "₹3.70 Lakh",
      onRoadPrice: "₹4.05 Lakh",
      mileage: "24.39 kmpl",
      engine: "998cc",
      transmission: "Manual/AMT",
      uniqueFeature: "Most affordable modern car; easy city driving",
      matchScore: 94,
      image: "🚗"
    },
    {
      name: "S-Presso",
      category: "Arena",
      type: "Mini Crossover",
      startingPrice: "₹3.50 Lakh",
      onRoadPrice: "₹3.85 Lakh", 
      mileage: "24.12 kmpl",
      engine: "998cc",
      transmission: "Manual/AMT/CNG",
      uniqueFeature: "SUV-inspired design with high 180mm ground clearance",
      matchScore: 91,
      image: "🚙"
    },
    {
      name: "Wagon R",
      category: "Arena",
      type: "Hatchback",
      startingPrice: "₹4.99 Lakh",
      onRoadPrice: "₹5.50 Lakh",
      mileage: "24.35 kmpl", 
      engine: "998cc/1197cc",
      transmission: "Manual/AMT/CNG",
      uniqueFeature: "Tall-boy design with best-in-class headroom",
      matchScore: 88,
      image: "🚗"
    },
    {
      name: "Swift",
      category: "Arena",
      type: "Hatchback", 
      startingPrice: "₹5.79 Lakh",
      onRoadPrice: "₹6.35 Lakh",
      mileage: "24.8 kmpl",
      engine: "1197cc",
      transmission: "Manual/AMT/CNG",
      uniqueFeature: "Peppy handling; fun-to-drive character",
      matchScore: 87,
      image: "🚗"
    },
    {
      name: "Brezza",
      category: "Arena",
      type: "Compact SUV",
      startingPrice: "₹8.26 Lakh",
      onRoadPrice: "₹9.50 Lakh", 
      mileage: "17.4 kmpl",
      engine: "1462cc",
      transmission: "Manual/AT/CNG",
      uniqueFeature: "Only sub-4m SUV with factory CNG option",
      matchScore: 82,
      image: "🚙"
    },
    {
      name: "Grand Vitara",
      category: "Nexa",
      type: "Compact SUV",
      startingPrice: "₹10.77 Lakh",
      onRoadPrice: "₹12.50 Lakh", 
      mileage: "21.1 kmpl",
      engine: "1462cc/1490cc Hybrid",
      transmission: "Manual/AT/CVT",
      uniqueFeature: "Strong hybrid & AWD options with 28 kmpl efficiency",
      matchScore: 89,
      image: "🚙"
    },
    {
      name: "Baleno",
      category: "Nexa", 
      type: "Premium Hatchback",
      startingPrice: "₹5.99 Lakh",
      onRoadPrice: "₹6.85 Lakh",
      mileage: "22.3 kmpl",
      engine: "1197cc",
      transmission: "Manual/AMT/CNG",
      uniqueFeature: "Most spacious in class with head-up display & 360° camera",
      matchScore: 85,
      image: "🚗"
    }
  ],
  services: [
    {
      title: "Next Service Due",
      description: "Your Swift is due for service in 15 days",
      date: "Oct 15, 2025",
      type: "maintenance"
    },
    {
      title: "Tire Pressure Check",
      description: "Recommended based on your driving patterns",
      priority: "medium"
    },
    {
      title: "Insurance Renewal",
      description: "Policy expires in 45 days",
      date: "Nov 12, 2025",
      type: "insurance"
    }
  ],
  dealers: [
    {
      name: "Rajpal Motors",
      distance: "2.3 km",
      rating: 4.5,
      services: ["Sales", "Service", "Spare Parts"],
      nextSlot: "Tomorrow 10:00 AM"
    },
    {
      name: "Khurana Motors",
      distance: "4.1 km", 
      rating: 4.2,
      services: ["Sales", "Service"],
      nextSlot: "Oct 2, 2:00 PM"
    }
  ]
};

// Application State
let currentStep = 1;
let maxSteps = 4;
let userPreferences = {
  budget: 8,
  usage: 'mixed',
  preferences: {
    efficiency: 4,
    safety: 5,
    tech: 3,
    space: 4
  }
};
let currentCarFilter = 'all';
let chatMessages = [
  {
    type: 'bot',
    text: 'Hi Soham! I\'m your AI assistant. How can I help you today?'
  }
];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  setupSliders();
  renderCarsGrid();
  updateProgress();
  setupNotificationHandler();
  setupSideMenu();
  
  // Show loading for initial setup
  showLoading(1000);
  
  // Initialize with home screen
  navigateToScreen('homeScreen');
}

function setupEventListeners() {
  // Budget slider
  const budgetSlider = document.getElementById('budgetSlider');
  if (budgetSlider) {
    budgetSlider.addEventListener('input', updateBudgetDisplay);
  }

  // Range chips
  const rangeChips = document.querySelectorAll('.range-chip');
  rangeChips.forEach(chip => {
    chip.addEventListener('click', function() {
      rangeChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const budget = parseInt(this.dataset.budget);
      userPreferences.budget = budget;
      document.getElementById('budgetSlider').value = budget;
      updateBudgetDisplay();
    });
  });

  // Usage radio buttons
  const usageRadios = document.querySelectorAll('input[name="usage"]');
  usageRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        userPreferences.usage = this.value;
      }
    });
  });

  // Preference sliders
  const prefSliders = document.querySelectorAll('.pref-slider');
  prefSliders.forEach(slider => {
    slider.addEventListener('input', function() {
      const pref = this.dataset.pref;
      const value = parseInt(this.value);
      userPreferences.preferences[pref] = value;
      
      // Update display value
      const valueDisplay = this.parentNode.querySelector('.pref-value');
      if (valueDisplay) {
        valueDisplay.textContent = value;
      }
    });
  });

  // Category tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCarFilter = this.dataset.category;
      renderCarsGrid();
    });
  });

  // Search functionality
  const searchInput = document.getElementById('carSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      filterCarsBySearch(searchTerm);
    });
  }

  // Chat input
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Notification button
  const notificationBtn = document.querySelector('.notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', showNotifications);
  }

  // Menu button
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', openSideMenu);
  }
}

function setupSliders() {
  // Initialize all preference sliders with their current values
  const prefSliders = document.querySelectorAll('.pref-slider');
  prefSliders.forEach(slider => {
    const pref = slider.dataset.pref;
    if (userPreferences.preferences[pref]) {
      slider.value = userPreferences.preferences[pref];
      const valueDisplay = slider.parentNode.querySelector('.pref-value');
      if (valueDisplay) {
        valueDisplay.textContent = userPreferences.preferences[pref];
      }
    }
  });
}

function setupSideMenu() {
  const menuOverlay = document.getElementById('menuOverlay');
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeSideMenu);
  }
}

// Navigation Functions
function navigateToScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  
  // Update bottom navigation
  updateBottomNavigation(screenId);
  
  // Close side menu if open
  closeSideMenu();
  
  // Screen-specific initialization
  if (screenId === 'aiFinderScreen') {
    resetWizard();
  } else if (screenId === 'carsScreen') {
    renderCarsGrid();
  }
  
  // Add animation effect
  if (targetScreen) {
    targetScreen.style.animation = 'slideIn 0.3s ease-out';
  }
}

function updateBottomNavigation(screenId) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.dataset.screen === screenId) {
      item.classList.add('active');
    }
  });
}

// Side Menu Functions
function openSideMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  if (sideMenu) {
    sideMenu.classList.add('active');
  }
  if (menuOverlay) {
    menuOverlay.classList.add('active');
  }
}

function closeSideMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  if (sideMenu) {
    sideMenu.classList.remove('active');
  }
  if (menuOverlay) {
    menuOverlay.classList.remove('active');
  }
}

// AI Car Finder Wizard
function nextWizardStep() {
  if (currentStep < maxSteps) {
    // Hide current step
    document.getElementById(`aiStep${currentStep}`).classList.remove('active');
    
    // Show next step
    currentStep++;
    document.getElementById(`aiStep${currentStep}`).classList.add('active');
    
    // Update progress
    updateProgress();
    
    // Generate results on final step
    if (currentStep === maxSteps) {
      generateAIResults();
    }
  }
}

function prevWizardStep() {
  if (currentStep > 1) {
    // Hide current step
    document.getElementById(`aiStep${currentStep}`).classList.remove('active');
    
    // Show previous step
    currentStep--;
    document.getElementById(`aiStep${currentStep}`).classList.add('active');
    
    // Update progress
    updateProgress();
  }
}

function resetWizard() {
  currentStep = 1;
  // Hide all steps
  const steps = document.querySelectorAll('.wizard-step');
  steps.forEach(step => step.classList.remove('active'));
  
  // Show first step
  document.getElementById('aiStep1').classList.add('active');
  updateProgress();
}

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const stepIndicator = document.getElementById('stepIndicator');
  
  if (progressFill) {
    const progressPercent = (currentStep / maxSteps) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }
  
  if (stepIndicator) {
    stepIndicator.textContent = `${currentStep}/${maxSteps}`;
  }
}

function updateBudgetDisplay() {
  const budgetSlider = document.getElementById('budgetSlider');
  const budgetAmount = document.getElementById('budgetAmount');
  
  if (budgetSlider && budgetAmount) {
    const value = budgetSlider.value;
    budgetAmount.textContent = `₹${value} Lakh`;
    userPreferences.budget = parseInt(value);
  }
}

function generateAIResults() {
  const resultsContainer = document.getElementById('resultsContainer');
  if (!resultsContainer) return;
  
  // Filter and sort vehicles based on preferences
  const budget = userPreferences.budget;
  const filteredVehicles = appData.vehicles
    .filter(vehicle => {
      const price = parseFloat(vehicle.startingPrice.replace('₹', '').replace(' Lakh', ''));
      return price <= budget;
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  resultsContainer.innerHTML = filteredVehicles.map(vehicle => `
    <div class="result-card">
      <div class="match-badge">${vehicle.matchScore}% Match</div>
      <h4 class="result-car-name">${vehicle.name}</h4>
      <p class="result-car-type">${vehicle.type} • ${vehicle.category}</p>
      <div class="result-car-price">${vehicle.startingPrice}</div>
      <p class="result-features">${vehicle.uniqueFeature}</p>
      <div class="result-actions">
        <button class="result-btn primary" onclick="exploreVehicle('${vehicle.name}')">
          Explore Details
        </button>
        <button class="result-btn secondary" onclick="tryARVehicle('${vehicle.name}')">
          Try in AR
        </button>
      </div>
    </div>
  `).join('');
}

// Cars Grid
function renderCarsGrid() {
  const carsGrid = document.getElementById('carsGrid');
  if (!carsGrid) return;

  let filteredVehicles = appData.vehicles;
  
  if (currentCarFilter !== 'all') {
    filteredVehicles = appData.vehicles.filter(vehicle => vehicle.category === currentCarFilter);
  }

  carsGrid.innerHTML = filteredVehicles.map(vehicle => `
    <div class="car-card" onclick="exploreVehicle('${vehicle.name}')">
      <div class="car-image">${vehicle.image}</div>
      <div class="car-details">
        <h3 class="car-name">${vehicle.name}</h3>
        <p class="car-type">${vehicle.type} • ${vehicle.category}</p>
        <div class="car-price">${vehicle.startingPrice}</div>
        <div class="car-specs">
          <span>⛽ ${vehicle.mileage}</span>
          <span>🔧 ${vehicle.engine}</span>
          <span>⚙️ ${vehicle.transmission.split('/')[0]}</span>
        </div>
        <p class="car-feature">${vehicle.uniqueFeature}</p>
        <div class="car-actions">
          <button class="btn btn--primary" onclick="event.stopPropagation(); configureVehicle('${vehicle.name}')">
            Configure
          </button>
          <button class="btn btn--secondary" onclick="event.stopPropagation(); tryARVehicle('${vehicle.name}')">
            AR View
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCarsBySearch(searchTerm) {
  if (!searchTerm) {
    renderCarsGrid();
    return;
  }

  const carsGrid = document.getElementById('carsGrid');
  if (!carsGrid) return;

  const filteredVehicles = appData.vehicles.filter(vehicle => {
    return vehicle.name.toLowerCase().includes(searchTerm) ||
           vehicle.type.toLowerCase().includes(searchTerm) ||
           vehicle.uniqueFeature.toLowerCase().includes(searchTerm);
  });

  if (filteredVehicles.length === 0) {
    carsGrid.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
        <h3>No cars found</h3>
        <p>Try adjusting your search terms</p>
      </div>
    `;
    return;
  }

  carsGrid.innerHTML = filteredVehicles.map(vehicle => `
    <div class="car-card" onclick="exploreVehicle('${vehicle.name}')">
      <div class="car-image">${vehicle.image}</div>
      <div class="car-details">
        <h3 class="car-name">${vehicle.name}</h3>
        <p class="car-type">${vehicle.type} • ${vehicle.category}</p>
        <div class="car-price">${vehicle.startingPrice}</div>
        <div class="car-specs">
          <span>⛽ ${vehicle.mileage}</span>
          <span>🔧 ${vehicle.engine}</span>
          <span>⚙️ ${vehicle.transmission.split('/')[0]}</span>
        </div>
        <p class="car-feature">${vehicle.uniqueFeature}</p>
        <div class="car-actions">
          <button class="btn btn--primary" onclick="event.stopPropagation(); configureVehicle('${vehicle.name}')">
            Configure
          </button>
          <button class="btn btn--secondary" onclick="event.stopPropagation(); tryARVehicle('${vehicle.name}')">
            AR View
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// AR Functions
function rotateAR() {
  const carElement = document.getElementById('arCar');
  if (carElement) {
    carElement.style.transform = 'rotateY(45deg) scale(1.1)';
    setTimeout(() => {
      carElement.style.transform = 'rotateY(0deg) scale(1)';
    }, 1000);
  }
  showToast('🔄 Car rotated in AR view');
}

function changeColor() {
  const colors = ['🔴', '🔵', '⚫', '⚪', '🟡'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  showToast(`🎨 Color changed to ${randomColor}`);
}

function openDoors() {
  showToast('🚪 Interior view activated - exploring cabin features');
}

function shareAR() {
  showToast('📷 AR photo captured and ready to share!');
}

function tryARVehicle(vehicleName) {
  navigateToScreen('arScreen');
  
  // Update AR car selector
  const arCarSelect = document.getElementById('arCarSelect');
  if (arCarSelect) {
    const vehicle = appData.vehicles.find(v => v.name === vehicleName);
    if (vehicle) {
      // Update the car in AR view
      const arCar = document.getElementById('arCar');
      if (arCar) {
        arCar.textContent = vehicle.image;
      }
    }
  }
  
  showToast(`🥽 Starting AR experience for ${vehicleName}`);
}

// Vehicle Actions
function exploreVehicle(vehicleName) {
  const vehicle = appData.vehicles.find(v => v.name === vehicleName);
  if (vehicle) {
    // Navigate to cars screen to show vehicle details
    navigateToScreen('carsScreen');
    
    // Highlight the selected vehicle by filtering
    setTimeout(() => {
      const searchInput = document.getElementById('carSearch');
      if (searchInput) {
        searchInput.value = vehicleName;
        filterCarsBySearch(vehicleName.toLowerCase());
      }
    }, 300);
    
    showToast(`🚗 Showing detailed view for ${vehicle.name}`);
  }
}

function configureVehicle(vehicleName) {
  showLoading(2000);
  setTimeout(() => {
    showToast(`⚙️ 3D configurator launched for ${vehicleName}`);
  }, 2000);
}

function bookTestDrive(vehicleName = '') {
  const message = vehicleName ? 
    `🗓️ Test drive booked for ${vehicleName}` : 
    '🗓️ Test drive booking initiated';
  showToast(message);
  
  // Show loading and then simulate booking
  showLoading(1500);
  setTimeout(() => {
    showToast('✅ Test drive booked at Rajpal Motors - Tomorrow 10:00 AM');
  }, 1500);
}

function shareExperience() {
  showToast('📱 AR experience shared on social media!');
}

// Service Functions
function bookService() {
  showToast('🔧 Service appointment booking started');
  showLoading(1500);
  setTimeout(() => {
    showToast('✅ Service booked for Tomorrow 10:00 AM at Rajpal Motors');
  }, 1500);
}

function findDealer() {
  showToast('📍 Finding nearest dealer...');
  showLoading(1000);
  setTimeout(() => {
    showToast('🏢 Rajpal Motors - 2.3 km away, 4.5⭐ rating');
  }, 1000);
}

function roadSideAssistance() {
  showToast('🚨 24/7 Roadside assistance activated');
  setTimeout(() => {
    showToast('📞 Help will arrive in 15-20 minutes');
  }, 1000);
}

function genuineParts() {
  showToast('🔩 Genuine parts catalog opened');
}

// Connected Car Functions
function showConnectServices() {
  navigateToScreen('myMarutiScreen');
  showToast('📱 Suzuki Connect services activated');
  
  // Simulate connecting to vehicle
  showLoading(2000);
  setTimeout(() => {
    showToast('✅ Connected to your Swift VXI');
  }, 2000);
}

// Chat Functions
function toggleChat() {
  const chatWidget = document.getElementById('chatWidget');
  const chatBubble = document.getElementById('chatBubble');
  
  if (chatWidget && chatBubble) {
    chatWidget.classList.toggle('active');
    if (chatWidget.classList.contains('active')) {
      chatBubble.style.display = 'none';
    } else {
      chatBubble.style.display = 'flex';
    }
  }
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  
  if (!chatInput || !chatMessages) return;
  
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Add user message
  addChatMessage(message, 'user');
  chatInput.value = '';
  
  // Simulate AI response
  setTimeout(() => {
    const response = generateAIResponse(message);
    addChatMessage(response, 'bot');
  }, 1000);
}

function addChatMessage(text, type) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `<p>${text}</p>`;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
  const responses = {
    'budget': 'I can help you find cars within your budget. What\'s your preferred price range?',
    'car': 'Looking for a specific car? I\'d recommend checking out our Swift or Brezza models based on your profile.',
    'service': 'Your Swift is due for service in 15 days. Would you like me to book an appointment?',
    'ar': 'Try our AR experience! You can see any car in your driveway using your phone camera.',
    'test drive': 'I can book a test drive for you. Which model are you interested in?',
    'mileage': 'For best mileage, I\'d suggest the Alto K10 with 24.39 kmpl or Swift with 24.8 kmpl.',
    'family': 'For families, the Brezza or Grand Vitara offer excellent space and safety features.',
    'hybrid': 'The Grand Vitara features strong hybrid technology with excellent fuel efficiency. Would you like to see it in AR?',
    'default': 'I\'m here to help! Ask me about cars, services, test drives, or use our AR showroom.'
  };
  
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return responses.default;
}

function startVoiceChat() {
  showToast('🎤 Voice assistant activated - "Hey Maruti"');
  
  // Simulate voice recognition
  setTimeout(() => {
    addChatMessage('Tell me about hybrid cars', 'user');
    setTimeout(() => {
      addChatMessage('The Grand Vitara features strong hybrid technology with 28 kmpl efficiency and AWD option. Would you like to see it in AR?', 'bot');
    }, 1000);
  }, 2000);
}

// Voice Functions
function startVoiceSearch() {
  showToast('🎤 Voice search activated - Say a car name');
  
  // Simulate voice recognition
  setTimeout(() => {
    const searchInput = document.getElementById('carSearch');
    if (searchInput) {
      searchInput.value = 'Swift';
      filterCarsBySearch('swift');
    }
    showToast('🔍 Found Swift in our catalog');
  }, 2000);
}

// Notification Functions
function showNotifications() {
  const notificationsPanel = document.getElementById('notificationsPanel');
  if (notificationsPanel) {
    notificationsPanel.classList.add('active');
  }
}

function closeNotifications() {
  const notificationsPanel = document.getElementById('notificationsPanel');
  if (notificationsPanel) {
    notificationsPanel.classList.remove('active');
  }
}

function setupNotificationHandler() {
  // Close notifications when clicking outside
  document.addEventListener('click', function(e) {
    const notificationsPanel = document.getElementById('notificationsPanel');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationsPanel && 
        notificationsPanel.classList.contains('active') && 
        !notificationsPanel.contains(e.target) && 
        !notificationBtn.contains(e.target)) {
      closeNotifications();
    }
  });
}

// Filter Functions
function showFilters() {
  showToast('⚙️ Advanced filters coming soon!');
}

// Utility Functions
function showLoading(duration = 2000) {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
    }, duration);
  }
}

function showToast(message, duration = 3000) {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 3000;
    max-width: 300px;
    text-align: center;
    backdrop-filter: blur(10px);
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animate in
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Haptic Feedback Simulation
function hapticFeedback() {
  // Simulate haptic feedback with a brief animation
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Add haptic feedback to buttons
document.addEventListener('click', function(e) {
  if (e.target.matches('button, .action-card, .service-card, .car-card, .nav-item')) {
    hapticFeedback();
  }
});

// Pull to Refresh Simulation
let startY = 0;
let currentY = 0;
let pullDistance = 0;

document.addEventListener('touchstart', function(e) {
  startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function(e) {
  if (window.scrollY === 0) {
    currentY = e.touches[0].clientY;
    pullDistance = currentY - startY;
    
    if (pullDistance > 0 && pullDistance < 100) {
      // Visual feedback for pull to refresh
      document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
      document.body.style.transition = 'none';
    }
  }
});

document.addEventListener('touchend', function(e) {
  document.body.style.transform = '';
  document.body.style.transition = 'transform 0.3s ease';
  
  if (pullDistance > 80) {
    showToast('🔄 Refreshing content...');
    // Simulate refresh
    setTimeout(() => {
      showToast('✅ Content updated');
    }, 1500);
  }
  
  pullDistance = 0;
});

// Swipe Gestures for Car Cards
let startX = 0;
let currentX = 0;

document.addEventListener('touchstart', function(e) {
  if (e.target.closest('.car-card')) {
    startX = e.touches[0].clientX;
  }
});

document.addEventListener('touchend', function(e) {
  const carCard = e.target.closest('.car-card');
  if (carCard && startX) {
    currentX = e.changedTouches[0].clientX;
    const diffX = startX - currentX;
    
    if (Math.abs(diffX) > 100) {
      if (diffX > 0) {
        // Swipe left - quick action (bookmark/favorite)
        showToast('⭐ Added to favorites');
      } else {
        // Swipe right - quick action (share)
        showToast('📤 Shared vehicle info');
      }
    }
  }
  startX = 0;
});

// Background App Refresh Simulation
setInterval(() => {
  // Simulate receiving real-time updates
  if (Math.random() > 0.9) { // 10% chance every interval
    const updates = [
      '🚗 New car recommendation available',
      '🔧 Service reminder updated',
      '💰 Special offer on your shortlisted car',
      '📍 Dealer near you has availability'
    ];
    
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    
    // Update notification badge
    const chatIndicator = document.querySelector('.chat-indicator');
    if (chatIndicator) {
      const currentCount = parseInt(chatIndicator.textContent) || 0;
      chatIndicator.textContent = currentCount + 1;
    }
  }
}, 30000); // Every 30 seconds

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Progressive Web App features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Service worker would be registered here for offline functionality
    console.log('PWA features ready');
  });
}

// Export functions for global access
window.navigateToScreen = navigateToScreen;
window.nextWizardStep = nextWizardStep;
window.prevWizardStep = prevWizardStep;
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.startVoiceChat = startVoiceChat;
window.startVoiceSearch = startVoiceSearch;
window.showNotifications = showNotifications;
window.closeNotifications = closeNotifications;
window.showFilters = showFilters;
window.exploreVehicle = exploreVehicle;
window.configureVehicle = configureVehicle;
window.tryARVehicle = tryARVehicle;
window.bookTestDrive = bookTestDrive;
window.shareExperience = shareExperience;
window.rotateAR = rotateAR;
window.changeColor = changeColor;
window.openDoors = openDoors;
window.shareAR = shareAR;
window.bookService = bookService;
window.findDealer = findDealer;
window.roadSideAssistance = roadSideAssistance;
window.genuineParts = genuineParts;
window.showConnectServices = showConnectServices;
window.openSideMenu = openSideMenu;
window.closeSideMenu = closeSideMenu;
window.showToast = showToast;