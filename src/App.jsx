/**
 * Annect - Real-Time Surplus Food Redistribution Network
 * 
 * Main Application Component (React + Vite)
 * This file coordinates state matrices, interactive dashboards, SVG routing overlays,
 * AI keyword chatbot responses, custom notification toasts, and the slide deck presenter.
 * 
 * Authors/Team: Advanced Agentic Coding Team
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Info, PlusCircle, LayoutDashboard, Building, Bike, Shield, HelpCircle, 
  MapPin, Lock, FileSpreadsheet, Check, CheckCircle, RefreshCw, ChevronLeft, ChevronRight,
  Camera, CloudUpload, ArrowRight, UserPlus, Milestone, Award, Users, Leaf, Trash2, Heart, Search
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'motion/react';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ==================== GLOBAL CONSTANTS & PRESETS ====================

const TICKER_LOGS = [
  "TCS Central Cafeteria rescued 60 meals ➔ MCF shelter (2m ago) | +30kg CO₂ Saved",
  "Bakehouse Cafe Sector 15 rescued 30 boxes ➔ Children Shelter (9m ago) | +15kg CO₂ Saved",
  "Radisson Blu Banquet rescued 140 servings ➔ Migrant Labor Camp (22m ago) | +70kg CO₂ Saved",
  "Sector 16 Mandi Wholesaler rescued 100kg produce ➔ Sewa Kitchen (1h ago) | +50kg CO₂ Saved",
  "Max Canteen rescued 40 meals ➔ MCF Rain Basera (3h ago) | +20kg CO₂ Saved"
];

const PRESET_DONATIONS = {
  paneer: {
    photoName: '/paneer_curry.png',
    foodType: 'Cooked',
    quantity: '45',
    prepTime: '1 hour ago',
    address: 'Radisson Blu Banquet Hall, Faridabad',
    packaging: 'Hot Buffet Trays',
    readyBefore: '2 hours',
    notes: 'Touchless buffet leftovers - Paneer Butter Masala, Veg Pulao & Naan. Kept warm.',
    ai: {
      detected: 'Paneer Butter Masala, Pulao & Roti',
      confidence: '98%',
      estimatedMeals: '45 servings',
      shelfLife: '3 hours 10 mins',
      urgency: 'HIGH',
      temperature: 38.4
    }
  },
  sandwiches: {
    photoName: '/packed_meals.png',
    foodType: 'Packed',
    quantity: '60',
    prepTime: '30 mins ago',
    address: 'Corporate Cafeteria - TCS Sector 14',
    packaging: 'Individually Sealed Boxes',
    readyBefore: '5 hours',
    notes: 'Packed sandwich meal boxes (Cheese Sandwich, Juice box, Apple). Fully sealed.',
    ai: {
      detected: 'Individually Boxed Sandwiches & Fruits',
      confidence: '95%',
      estimatedMeals: '60 servings',
      shelfLife: '8 hours 30 mins',
      urgency: 'MEDIUM',
      temperature: 19.2
    }
  },
  bakery: {
    photoName: '/bakery_surplus.png',
    foodType: 'Bakery',
    quantity: '30',
    prepTime: 'Closing time - 10 mins ago',
    address: 'Bakehouse Cafe, Sector 9',
    packaging: 'Paper Bags & Bread Boxes',
    readyBefore: '12 hours',
    notes: 'Assorted sweet buns, chocolate croissants, wheat loaves. Freshly baked today.',
    ai: {
      detected: 'Sweet Breads, Loaves & Croissants',
      confidence: '92%',
      estimatedMeals: '30 servings',
      shelfLife: '24 hours',
      urgency: 'MEDIUM',
      temperature: 22.0
    }
  },
  vegetables: {
    photoName: '/mandi_vegetables.png',
    foodType: 'Raw',
    quantity: '120',
    prepTime: 'Morning sorting',
    address: 'Faridabad Fruit & Veg Mandi, Stand 42',
    packaging: 'Wooden Crates',
    readyBefore: '48 hours',
    notes: 'Surplus ripe tomatoes and fresh potatoes. Perfect for large cooking operations.',
    ai: {
      detected: 'Ripe Tomatoes & Potatoes (Raw)',
      confidence: '99%',
      estimatedMeals: '200+ (for prep)',
      shelfLife: '4 days',
      urgency: 'MEDIUM',
      temperature: 25.6
    }
  }
};

const INITIAL_DONORS = [
  { id: 'DON-101', name: 'Radisson Blu Hotel', type: 'Hotel', contact: 'Suresh Kumar', phone: '9812345670', address: 'Sector 21-C, Faridabad', estSurplus: '60 servings', fssai: '10821034000192', status: 'approved' },
  { id: 'DON-102', name: 'Bakehouse Cafe', type: 'Bakery', contact: 'Amit Arora', phone: '9876543210', address: 'Sector 15 Market, Faridabad', estSurplus: '30 units', fssai: '20822034000542', status: 'approved' },
  { id: 'DON-103', name: 'Sector 16 Temple Kitchen', type: 'Religious', contact: 'Pandit Ji', phone: '9988776655', address: 'Sector 16, Faridabad', estSurplus: '80 servings', fssai: 'None', status: 'approved' },
  { id: 'DON-104', name: 'TCS Cafeteria', type: 'Corporate', contact: 'Ramesh Singh', phone: '9911223344', address: 'Sector 14, Faridabad', estSurplus: '120 servings', fssai: '10819034000843', status: 'approved' },
  { id: 'DON-105', name: 'Max Hospital Canteen', type: 'Hospital', contact: 'Dr. V. Sharma', phone: '9811223344', address: 'Sector 19, Faridabad', estSurplus: '50 servings', fssai: '10820034000214', status: 'approved' }
];

const INITIAL_NGOS = [
  { id: 'ngo-mcf', name: 'MCF Night Shelter (Rain Basera)', type: 'Night Shelter', contact: 'Supervisor MCF', phone: '9810203040', address: 'Sector 15, Faridabad', demand: '72 servings', storage: 'Hot Holding Cabinet', status: 'approved' },
  { id: 'ngo-children', name: 'Children Shelter Foundation', type: 'Orphanage', contact: 'Neeta Gupta', phone: '9810908070', address: 'Sector 11, Faridabad', demand: '30 servings', storage: 'Ambient Storage Only', status: 'approved' },
  { id: 'ngo-migrant', name: 'Sector 25 Migrant Labor Camp', type: 'Migrant Camp', contact: 'Vol. In-Charge', phone: '9910203040', address: 'Sector 25 Industrial Area', demand: '150 servings', storage: 'None (Immediate Service)', status: 'approved' }
];

const INITIAL_RESCUES = [
  { id: 'RSC-9842', donor: 'Radisson Blu Hotel', ngo: 'MCF Night Shelter', volunteer: 'Rahul Sharma', quantity: '45 meals', date: 'Today (Live)', carbon: '22.5 kg', temp: '38.4°C', status: 'active-rescue' },
  { id: 'RSC-9831', donor: 'Bakehouse Cafe', ngo: 'Children Shelter Foundation', volunteer: 'Amit Kumar', quantity: '30 units', date: 'Yesterday', carbon: '15.0 kg', temp: '21.2°C', status: 'approved' },
  { id: 'RSC-9828', donor: 'TCS Cafeteria', ngo: 'Sector 25 Migrant Labor Camp', volunteer: 'Priya Singh', quantity: '120 meals', date: '2 days ago', carbon: '60.0 kg', temp: '36.5°C', status: 'approved' }
];

const LIST_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const LIST_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const INITIAL_MOCK_NGOS = [
  {
    id: 'ngo-mcf',
    name: 'MCF Night Shelter (Rain Basera)',
    distance: '4.2 km',
    capacity: '72 servings',
    occupancy: '48 present',
    score: '96%',
    pref: 'Vegetarian Cooked',
    storage: 'Hot Holding Cabinet',
    recommended: true,
    rejected: false,
    reason: 'Matches delivery window, has hot cabinet capacity, highest immediate hunger index.'
  },
  {
    id: 'ngo-children',
    name: 'Children Shelter Foundation',
    distance: '2.0 km',
    capacity: '30 servings',
    occupancy: 'Full capacity',
    score: '0%',
    pref: 'Nutritional snacks',
    storage: 'Ambient Storage Only',
    recommended: false,
    rejected: true,
    reason: 'Capacity full. Storage not available for immediate cooked meals.'
  },
  {
    id: 'ngo-migrant',
    name: 'Sector 25 Migrant Labor Camp',
    distance: '5.4 km',
    capacity: '150 servings',
    occupancy: 'High demand',
    score: '90%',
    pref: 'Any cooked meals',
    storage: 'None (Immediate Service)',
    recommended: false,
    rejected: false,
    reason: 'High localized hunger rate, ready for immediate distribution, but lacks hot-holding gear.'
  }
];

export default function App() {
  // ==================== STATE MATRIX DEFINITIONS ====================
  // Tracks navigation links and active anchor nodes during scrollspy scans

  // Navigation & Search States
  const [activeAnchor, setActiveAnchor] = useState('home');
  const [selectedRegion, setSelectedRegion] = useState('central');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // App Overlays (Modal state windows)
  const [showDonateFlow, setShowDonateFlow] = useState(false);
  const [donateStep, setDonateStep] = useState(1); // 1: Form, 2: Scan, 3: Match, 4: Delivery
  
  const [showAdminFlow, setShowAdminFlow] = useState(false);
  const [showNgoFlow, setShowNgoFlow] = useState(false);
  const [showVolunteerFlow, setShowVolunteerFlow] = useState(false);
  const [showRegisterFlow, setShowRegisterFlow] = useState(false);

  // ESG Calculator States
  const [calcWeight, setCalcWeight] = useState(150);
  const [calcType, setCalcType] = useState('hotel');

  // AI Chatbot Helper States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hi! I am the Annect Safety & Operations Assistant. Ask me anything or type keywords like "safety", "register", "volunteer", "points", or "carbon"!', time: 'Just Now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // App States
  const [donationData, setDonationData] = useState({
    photo: null,
    photoName: '/paneer_curry.png',
    foodType: 'Cooked',
    quantity: '45',
    prepTime: '1 hour ago',
    address: 'Radisson Blu Banquet Hall, Faridabad',
    packaging: 'Hot Buffet Trays',
    readyBefore: '2 hours',
    notes: 'Touchless buffet leftovers - Paneer Butter Masala, Veg Pulao & Naan. Kept warm.'
  });

  // Slider Temperature & FSSAI dynamic values
  const [tempValue, setTempValue] = useState(38.4);
  const [aiAnalysis, setAiAnalysis] = useState({
    detected: 'Paneer Butter Masala, Pulao & Roti',
    confidence: '98%',
    estimatedMeals: '45 servings',
    shelfLife: '3 hours 10 mins',
    urgency: 'HIGH',
    temperature: '38.4°C',
    countdownSecs: 35 * 60
  });

  const [ngoMatches, setNgoMatches] = useState(INITIAL_MOCK_NGOS);
  const [selectedNgo, setSelectedNgo] = useState(null);
  
  // Dynamic Databases
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [ngos, setNgos] = useState(INITIAL_NGOS);
  const [rescues, setRescues] = useState(INITIAL_RESCUES);
  
  // Interactive Simulation variables
  const [activePreset, setActivePreset] = useState('paneer');
  const [isScanning, setIsScanning] = useState(false);
  const [countdownTime, setCountdownTime] = useState('35:00');
  const [routeProgress, setRouteProgress] = useState(0);
  const [routeStep, setRouteStep] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);
  

  // Registration Portal States
  const [regRole, setRegRole] = useState('donor');
  const [regSuccess, setRegSuccess] = useState(null);
  const [regOrgName, setRegOrgName] = useState('');
  
  // Admin Panel states
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('donors');
  const [adminEmail, setAdminEmail] = useState('admin@annect.org');
  const [adminPass, setAdminPass] = useState('admin123');
  const [adminLoading, setAdminLoading] = useState(false);
  
  // Slide Deck Index
  const [slideIndex, setSlideIndex] = useState(0);

  // Bento Interactive route simulation state
  const [activeBentoRoute, setActiveBentoRoute] = useState('radisson');

  // Counter values for Landing page statistics
  const [mealsRescuedCount, setMealsRescuedCount] = useState(18240);
  const [co2SavedCount, setCo2SavedCount] = useState(9.1);

  // Interval references
  const timerIntervalRef = useRef(null);
  const transitIntervalRef = useRef(null);

  // Region stats details
  const REGION_STATS = {
    central: { meals: 18240, saved: 4.2, co2: 9.1 },
    gurugram: { meals: 42100, saved: 9.8, co2: 21.0 },
    noida: { meals: 29450, saved: 6.9, co2: 14.7 }
  };

  // Scroll to section element helper
  const scrollToSection = (id) => {
    setActiveAnchor(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Toast notification helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Card cursor spotlight tracking
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  // Scrollspy & page progress handler
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Universal Searchable Database (Vite / Next.js Style)
  const handleImageError = (e, fallbackEmoji) => {
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    if (parent && !parent.querySelector('.img-placeholder')) {
      const p = document.createElement('div');
      p.className = 'img-placeholder';
      p.style.width = '100%';
      p.style.height = '100%';
      p.style.background = 'var(--bg-hover)';
      p.style.display = 'flex';
      p.style.alignItems = 'center';
      p.style.justifyContent = 'center';
      p.style.fontSize = '32px';
      p.innerHTML = fallbackEmoji || '🍲';
      
      if (parent.classList.contains('preset-card')) {
        p.style.width = '52px';
        p.style.height = '52px';
        p.style.marginRight = '12px';
        p.style.borderRadius = 'var(--radius-sm)';
      }
      
      parent.insertBefore(p, parent.firstChild);
    }
  };

  const SEARCHABLE_ITEMS = [
    // Sections
    { title: "Home Page (Hero & Live Map)", category: "Navigation", target: "home", type: "scroll" },
    { title: "How It Works Timeline (6 Steps)", category: "Navigation", target: "how-it-works", type: "scroll" },
    { title: "Impact Dashboard & ESG Stats", category: "Navigation", target: "impact", type: "scroll" },
    { title: "About Us & Vision Policies", category: "Navigation", target: "about", type: "scroll" },
    { title: "Pitch Slide Presentation Deck", category: "Navigation", target: "pitch-deck", type: "scroll" },
    
    // Actions / Workflows
    { title: "Donate Surplus Food (Start AI Scan)", category: "Action", action: "donate", type: "flow" },
    { title: "Business Sign Up / Donor Registration", category: "Action", action: "register-donor", type: "flow" },
    { title: "Join as Recipient Shelter", category: "Action", action: "register-ngo", type: "flow" },
    { title: "Volunteer Hub (Accept Pickups & XP)", category: "Action", action: "volunteer", type: "flow" },
    { title: "Supervisor Admin Panel Login", category: "Action", action: "supervisor", type: "flow" },

    // NGOs & Shelters
    { title: "MCF Night Shelter (Rain Basera)", category: "Shelter", target: "ngo-mcf", type: "ngo" },
    { title: "Children Shelter Foundation", category: "Shelter", target: "ngo-children", type: "ngo" },
    { title: "Sector 25 Migrant Labor Camp", category: "Shelter", target: "ngo-migrant", type: "ngo" }
  ];

  // Universal Search Matches
  const getUniversalSearchResults = () => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return SEARCHABLE_ITEMS.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
  };

  /**
   * Universal Search Item Action Dispatcher
   * Resolves search matches to active behaviors:
   * 1. 'scroll' target: Scrolls window viewport smoothly to target ID.
   * 2. 'flow' target: Spawns specific donor/recipient registration overlays.
   * 3. 'ngo' target: Loads individual profile details for shelters.
   */
  const handleSearchResultClick = (item) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    if (item.type === 'scroll') {
      scrollToSection(item.target);
      triggerToast(`Navigated to ${item.title}`);
    } else if (item.type === 'flow') {
      if (item.action === 'donate') {
        setShowDonateFlow(true);
        setDonateStep(1);
      } else if (item.action === 'register-donor') {
        setRegRole('donor');
        setRegSuccess(null);
        setShowRegisterFlow(true);
      } else if (item.action === 'register-ngo') {
        setRegRole('ngo');
        setRegSuccess(null);
        setShowRegisterFlow(true);
      } else if (item.action === 'volunteer') {
        setShowVolunteerFlow(true);
      } else if (item.action === 'supervisor') {
        setShowAdminFlow(true);
        setAdminLoggedIn(false);
      }
      triggerToast(`Opened ${item.title}`);
    } else if (item.type === 'ngo') {
      const ngoObj = INITIAL_MOCK_NGOS.find(m => m.id === item.target) || ngos.find(n => n.id === item.target);
      setSelectedNgo(ngoObj);
      setShowNgoFlow(true);
      triggerToast(`Opened Profile for ${ngoObj.name}`);
    }
  };

  // Calculate dynamic shelf life from temperature sensor input
  useEffect(() => {
    const t = parseFloat(tempValue);
    let shelfLife = '3 hours 10 mins';
    let urgency = 'HIGH';
    let label = 'WARM: Normal redistribution buffer';
    let seconds = 35 * 60;

    if (t >= 60) {
      shelfLife = '3 hours 30 mins';
      urgency = 'MEDIUM';
      label = 'SAFE: FSSAI Thermal buffer active';
      seconds = 45 * 60;
    } else if (t >= 40 && t < 60) {
      shelfLife = '1 hour 20 mins';
      urgency = 'HIGH';
      label = 'WARNING: Rapid microbial breeding zone';
      seconds = 20 * 60;
    } else if (t > 10 && t < 40) {
      shelfLife = '35 mins';
      urgency = 'HIGH';
      label = 'CRITICAL: Rapid spoilage danger zone';
      seconds = 12 * 60;
    } else {
      shelfLife = '8 hours 40 mins';
      urgency = 'LOW';
      label = 'SAFE: Cold chain preservation active';
      seconds = 180 * 60;
    }

    setAiAnalysis(prev => ({
      ...prev,
      shelfLife,
      urgency,
      temperature: `${t.toFixed(1)}°C`,
      detected: `${prev.detected.split(' (')[0]} (${label})`,
      countdownSecs: seconds
    }));
  }, [tempValue]);

  // Animate stats counter on mount / region toggle
  useEffect(() => {
    const targetMeals = REGION_STATS[selectedRegion].meals;
    const targetCo2 = REGION_STATS[selectedRegion].co2;
    setMealsRescuedCount(Math.floor(targetMeals * 0.96));
    setCo2SavedCount(parseFloat((targetCo2 * 0.96).toFixed(1)));
    
    let currentMeals = Math.floor(targetMeals * 0.96);
    const interval = setInterval(() => {
      currentMeals += Math.floor((targetMeals - currentMeals) / 6) + 1;
      if (currentMeals >= targetMeals) {
        setMealsRescuedCount(targetMeals);
        setCo2SavedCount(targetCo2);
        clearInterval(interval);
      } else {
        setMealsRescuedCount(currentMeals);
        setCo2SavedCount(parseFloat(((currentMeals / targetMeals) * targetCo2).toFixed(1)));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [selectedRegion]);

  // Handle countdown timer inside AI page
  useEffect(() => {
    if (showDonateFlow && donateStep === 2 && !isScanning) {
      let seconds = aiAnalysis.countdownSecs;
      timerIntervalRef.current = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(timerIntervalRef.current);
          setCountdownTime('00:00');
        } else {
          const m = Math.floor(seconds / 60).toString().padStart(2, '0');
          const s = (seconds % 60).toString().padStart(2, '0');
          setCountdownTime(`${m}:${s}`);
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [showDonateFlow, donateStep, isScanning, aiAnalysis.countdownSecs]);

  // Chatbot conversation triggers (Quick select)
  const triggerChatResponse = (optionText, answerText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: optionText, time: 'Just Now' }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'ai', text: answerText, time: 'Just Now' }]);
    }, 600);
  };

  // Conversational text parser chat responder
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: msg, time: 'Just Now' }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const text = msg.toLowerCase();
      let reply = "I can help with questions about: 1. FSSAI temperature safety limits, 2. NGO registry & partner shelters, 3. Volunteer courier rewards (XP), or 4. Carbon savings (ESG metrics). Feel free to type keywords like 'safety', 'register', or 'volunteer'!";

      if (text.includes('temp') || text.includes('safety') || text.includes('fssai') || text.includes('limit') || text.includes('hot') || text.includes('cold')) {
        reply = "According to FSSAI compliance laws, hot cooked foods must be picked up within 2 hours of prep and kept above 60°C. Cold chain items must stay below 5°C. Annect checks sensor readings at every checkpoint to ensure safety.";
      } else if (text.includes('register') || text.includes('sign up') || text.includes('join') || text.includes('partner') || text.includes('add')) {
        reply = "Establishments can join by clicking 'Business Sign Up' or 'Join as Receiver Shelter' on the homepage, filling in FSSAI details. A local municipal supervisor will audit and approve your node within 24 hours.";
      } else if (text.includes('volunteer') || text.includes('courier') || text.includes('deliver') || text.includes('xp') || text.includes('points') || text.includes('badge')) {
        reply = "Volunteers sign up via the Volunteer Hub. You receive XP points for every rescue delivery based on distance and servings. Level up to earn badges like 'Night Owl' or 'Centurion'.";
      } else if (text.includes('ngo') || text.includes('shelter') || text.includes('recipient') || text.includes('mcf') || text.includes('rain')) {
        reply = "Annect distributes surplus to FSSAI-audited night shelters (Rain Baseras), orphanages, and labor camps. Registered shelters include: MCF Night Shelter (Rain Basera), Children Shelter Foundation, and Sector 25 Labor Camp.";
      } else if (text.includes('carbon') || text.includes('co2') || text.includes('green') || text.includes('esg') || text.includes('landfill') || text.includes('save')) {
        reply = "By diverting surplus from organic landfills, we offset greenhouse methane emissions. Every 1kg of rescued food offsets approximately 2.5kg of CO2 equivalent emissions and reduces garbage tax.";
      } else if (text.includes('about') || text.includes('annect') || text.includes('what is') || text.includes('how')) {
        reply = "Annect is India's largest AI-powered real-time surplus food recovery network. We link banquet halls, caterers, and corporate canteens with nearby hunger centers under strict FSSAI safety checks.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply, time: 'Just Now' }]);
    }, 850);
  };

  // Download Pitch Deck PDF layout generator
  const downloadPitchDeckPdf = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Annect - Investor Pitch Deck</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #203727; background-color: #f9fbf4; }
            h1 { font-family: 'Outfit', sans-serif; font-size: 28px; color: #203727; border-bottom: 2px solid #203727; padding-bottom: 10px; margin-bottom: 15px; }
            h2 { font-size: 20px; color: #516e5a; margin-top: 0; margin-bottom: 20px; font-weight: 600; }
            .slide { page-break-after: always; padding: 40px; border: 1px solid rgba(32, 55, 39, 0.16); border-radius: 12px; margin-bottom: 40px; background: white; box-shadow: 0 4px 12px rgba(32,55,39,0.04); }
            ul { line-height: 1.8; font-size: 15px; }
            li { margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid rgba(32, 55, 39, 0.16); padding: 12px; text-align: left; }
            th { background-color: #e0ffab; color: #203727; font-weight: 700; }
            .subtitle { font-size: 18px; color: #516e5a; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="slide">
            <h1>Annect</h1>
            <h2>Slide 1: Cover</h2>
            <div style="margin: 60px 0; text-align: center;">
              <p style="font-size: 24px; font-weight: bold; color: #203727; margin-bottom: 10px;">Connecting surplus food to save lives</p>
              <p class="subtitle">India's Largest AI-Powered Surplus Food Rescue Network</p>
              <p style="font-size: 14px; color: #203727; margin-top: 40px; font-weight: 700;">Zero Food Waste • Zero Hunger</p>
            </div>
          </div>
          
          <div class="slide">
            <h1>The Looming Crisis</h1>
            <h2>Slide 2: The Problem</h2>
            <ul>
              <li><b>40% of food in India is wasted</b> before it reaches plates (FSSAI/FAO estimation).</li>
              <li><b>India ranks 111th out of 125</b> countries on the Global Hunger Index.</li>
              <li>Surplus food from banquets, corporate canteens, and markets is thrown into landfills daily.</li>
              <li><b>Environmental impact:</b> Decomposing food generates large volumes of methane gas and wastes precious agricultural water.</li>
            </ul>
          </div>
          
          <div class="slide">
            <h1>The Connected Ecosystem</h1>
            <h2>Slide 3: The Connected Network</h2>
            <ul>
              <li><b>Donors:</b> Hotels, corporate cafeterias, bakeries, mandis.</li>
              <li><b>Volunteers:</b> Registered crowd-sourced couriers.</li>
              <li><b>NGOs & Shelters:</b> Homeless night shelters, camps, community kitchens.</li>
              <li><b>Municipalities:</b> Providing municipal integration and waste reductions.</li>
            </ul>
          </div>

          <div class="slide">
            <h1>What Food We Rescue</h1>
            <h2>Slide 4: Rescue Target</h2>
            <ul>
              <li><b>Cooked Meals:</b> Banquet halls, hotels. High priority. 1-4 hour redistribution window.</li>
              <li><b>Packed Meals:</b> Airlines, meal subscription kitchens. Sealed and secure.</li>
              <li><b>Bakery Products:</b> Bakeries, cafes. Bread, cookies, cakes collected at closing.</li>
              <li><b>Fresh Produce:</b> Mandis, wholesale vendors. Redirected to community kitchens.</li>
            </ul>
          </div>

          <div class="slide">
            <h1>Operating Model (7 Steps)</h1>
            <h2>Slide 5: Safety Buffers</h2>
            <ul>
              <li><b>Step 1-2: Donor Upload & AI Audit</b> - Photo submission automatically parsed for quantity and shelf-life estimates.</li>
              <li><b>Step 3-4: Matching & Dispatch</b> - Algorithm assigns the optimal shelter, alerts nearest volunteer.</li>
              <li><b>Step 5: Quality Check</b> - Volunteer verifies container hygiene and temperatures at pickup.</li>
              <li><b>Step 6-7: Secure Handover & Stats update</b> - Delivery QR code signature updates impact dashboards.</li>
            </ul>
          </div>

          <div class="slide">
            <h1>The AI Matching Engine</h1>
            <h2>Slide 6: Smart Matrix</h2>
            <ul>
              <li><b>Distance & ETA:</b> Minimal transport duration.</li>
              <li><b>Shelter Capacity:</b> Prevent overloading.</li>
              <li><b>Real-Time Occupancy:</b> Direct need calculation.</li>
              <li><b>Storage Infrastructure:</b> Refrigerator/cabinet check.</li>
              <li><b>Volunteer Pathing:</b> Merging routes to save travel energy.</li>
            </ul>
          </div>

          <div class="slide">
            <h1>FSSAI Compliance & Safety</h1>
            <h2>Slide 7: FSSAI Standards</h2>
            <ul>
              <li>Adheres strictly to <b>FSSAI Surplus Food Recovery Regulations</b>.</li>
              <li><b>Digital Audits:</b> Photo matching detects spoilage patterns before logistics begin.</li>
              <li><b>Physical Audits:</b> Volunteers measure temperature (hot meals must stay above 60°C or cold below 5°C).</li>
              <li><b>Traceability:</b> Every batch is digitally stamped from donor source to recipient signature.</li>
            </ul>
          </div>

          <div class="slide">
            <h1>Sustainability & Revenue Model</h1>
            <h2>Slide 8: Revenue Stream</h2>
            <ul>
              <li><b>CSR Corporate Sponsorships:</b> Funding network tech, logistics fuel, and volunteer gear.</li>
              <li><b>ESG SaaS Dashboard Subscriptions:</b> For hotel chains, hospitals, and tech campuses requiring carbon audits.</li>
              <li><b>Municipal Partnership Contracts:</b> Helping cities reduce municipal solid waste costs.</li>
              <li><b>Premium Logistics support:</b> For large recurring commercial food producers.</li>
            </ul>
          </div>

          <div class="slide">
            <h1>Competitive Landscape</h1>
            <h2>Slide 9: Competitors</h2>
            <table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Strengths</th>
                  <th>Gaps Annect Fills</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Robin Hood Army</b></td>
                  <td>Large local volunteer networks</td>
                  <td>Adding real-time AI matching, routing & transparency charts.</td>
                </tr>
                <tr>
                  <td><b>Feeding India</b></td>
                  <td>Corporate tie-ups, structural programs</td>
                  <td>Adding hyperlocal instant matching of freshly cooked meals.</td>
                </tr>
                <tr>
                  <td><b>Municipal Initiatives</b></td>
                  <td>Government backup and localized reach</td>
                  <td>Providing a scalable software framework for national deployment.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="slide">
            <h1>The Road Ahead</h1>
            <h2>Slide 10: Horizon</h2>
            <ul>
              <li><b>Phase 1: Pilot</b> - 20 hotels, 10 restaurants, 10 NGOs in Faridabad. Target: 500 meals/day.</li>
              <li><b>Phase 2: NCR</b> - Expand to Noida, Gurugram, Delhi. Integrate corporate campus canteens.</li>
              <li><b>Phase 3: National</b> - Deploy modular playbooks to 100+ tier-1 & 2 cities with Municipal links.</li>
            </ul>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download Pitch Deck Markdown document generator
  const downloadPitchDeckMarkdown = () => {
    const content = `# Annect - Investor Pitch Deck
India's Largest AI-Powered Surplus Food Rescue Network

---

## Slide 1: Cover
### Connecting surplus food to save lives
- Zero Food Waste • Zero Hunger
- Tech-first platform linking banquet surplus with hunger centers.

---

## Slide 2: The Problem
### The Looming Crisis
- 40% of food in India is wasted before it reaches plates (FSSAI/FAO estimate).
- India ranks 111th out of 125 on the Global Hunger Index.
- Landfills overflow with organic waste, releasing large methane volumes.

---

## Slide 3: The Connected Network
### The Connected Ecosystem
- Donors: Hotels, corporate canteens, bakeries, mandis.
- Volunteers: Registered crowd-sourced couriers.
- NGOs/Shelters: Rain Baseras, orphanages, labor camps.
- Municipalities: Reducing city solid waste logs.

---

## Slide 4: Rescue Target
### What Food We Rescue
- Cooked Meals: Banquet and catering leftovers. (1-4h window)
- Packed Meals: Sealed meal boxes from corporate events or airlines.
- Bakery Products: Fresh bread, sweet rolls, pastries.
- Fresh Produce: Mandi surplus vegetables.

---

## Slide 5: Safety Buffers
### Operating Model (7 Steps)
1. Donor uploads food details & photo.
2. AI Scanner audits packaging & temperature.
3. Matching Matrix ranks optimal recipient shelters.
4. Logistics alerts nearest courier.
5. Courier performs physical FSSAI checks at pickup.
6. Handover scanned via secure QR keys.
7. ESG dashboards and CO2 records update instantly.

---

## Slide 6: Smart Matrix
### The AI Matching Engine
- Decides matches using distance, current occupancy, storage cabinet limits, and path overlap metrics.

---

## Slide 7: FSSAI Standards
### FSSAI Compliance & Safety
- Adheres strictly to FSSAI Surplus Recovery rules.
- Hot holding above 60°C and cold chain below 5°C checked via thermal indicators.

---

## Slide 8: Revenue Stream
### Sustainability & Revenue Model
- CSR Corporate sponsorships.
- ESG SaaS dashboard subscriptions for hotel compliance audits.
- Municipal solid waste deduction contracts.

---

## Slide 9: Competitors
### Competitive Landscape
- Robin Hood Army: Strong local networks, but lacks real-time tech, routing, and transparency audits.
- Feeding India: Corporate ties, but focuses on dry grain packages.
- Annect: Hyperlocal real-time cooked food matching with FSSAI sensors.

---

## Slide 10: Horizon
### The Road Ahead
- Phase 1: Pilot in Faridabad with 20 hotels and 10 NGOs.
- Phase 2: NCR Expansion (Noida, Gurugram, Delhi).
- Phase 3: National rollout across 100+ cities.
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Annect_Pitch_Deck.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Trigger automated scanning duration when entering AI analyzer screen
  const triggerAiScanner = () => {
    setDonateStep(2);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2500); // 2.5s scanning effect
  };

  // Trigger live route transport simulation
  const startRouteSimulation = () => {
    setRouteProgress(0);
    setRouteStep(0);
    setDonateStep(4);

    transitIntervalRef.current = setInterval(() => {
      setRouteProgress(prev => {
        const next = prev + 2.5; // complete in ~4 seconds
        if (next >= 100) {
          clearInterval(transitIntervalRef.current);
          setRouteStep(4);
          setShowQrModal(true);
          return 100;
        }
        
        if (next > 75) setRouteStep(3);
        else if (next > 45) setRouteStep(2);
        else if (next > 15) setRouteStep(1);

        return next;
      });
    }, 100);
  };

  // Clean close route simulation, save to analytics database, update landing statistics
  const completeRescueAndNavigate = () => {
    setShowQrModal(false);
    setShowDonateFlow(false);
    
    // Increment stats
    const qtyInt = parseInt(donationData.quantity) || 45;
    REGION_STATS.central.meals += qtyInt;
    REGION_STATS.central.co2 = parseFloat((REGION_STATS.central.co2 + (qtyInt * 0.5)).toFixed(1));
    setSelectedRegion('central');

    // Push new rescue log to supervisor database
    const newRescueLog = {
      id: 'RSC-' + Math.floor(1000 + Math.random() * 9000),
      donor: donationData.address.split(' - ')[0].split(',')[0],
      ngo: selectedNgo ? selectedNgo.name : 'MCF Night Shelter',
      volunteer: 'Rahul Sharma',
      quantity: `${donationData.quantity} servings`,
      date: 'Just Now',
      carbon: `${(qtyInt * 0.5).toFixed(1)} kg`,
      temp: aiAnalysis.temperature,
      status: 'approved'
    };

    setRescues(prev => [newRescueLog, ...prev]);
    
    setTimeout(() => {
      scrollToSection('impact');
    }, 300);
  };

  // Preset Selector Card triggers
  const handlePresetSelect = (key) => {
    setActivePreset(key);
    const data = PRESET_DONATIONS[key];
    if (!data) return;

    setDonationData({
      photo: null,
      photoName: data.photoName,
      foodType: data.foodType,
      quantity: data.quantity,
      prepTime: data.prepTime,
      address: data.address,
      packaging: data.packaging,
      readyBefore: data.readyBefore,
      notes: data.notes
    });

    setTempValue(data.ai.temperature);
  };

  // Mock File Upload change listener
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDonationData(prev => ({
          ...prev,
          photo: event.target.result,
          photoName: file.name
        }));
        
        setTempValue(36.5);
        setActivePreset(''); // Unselect presets
      };
      reader.readAsDataURL(file);
    }
  };

  // Register Form submits
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const orgName = regOrgName || (regRole === 'donor' ? 'Surplus Kitchen Ltd' : 'MCF Hope Centre');
    const refCode = regRole === 'donor' 
      ? 'ANNECT-DONOR-' + Math.floor(1000 + Math.random() * 9000)
      : 'ANNECT-NGO-' + Math.floor(1000 + Math.random() * 9000);

    if (regRole === 'donor') {
      const newDonor = {
        id: refCode,
        name: orgName,
        type: document.getElementById('reg-donor-type')?.value || 'Hotel',
        contact: document.getElementById('reg-donor-contact')?.value || 'Supervisor',
        phone: document.getElementById('reg-donor-phone')?.value || '9988776655',
        address: document.getElementById('reg-donor-address')?.value || 'Faridabad',
        estSurplus: '60 servings',
        fssai: document.getElementById('reg-donor-fssai')?.value || 'None',
        status: 'pending'
      };
      setDonors(prev => [newDonor, ...prev]);
    } else {
      const newNgo = {
        id: refCode,
        name: orgName,
        type: document.getElementById('reg-ngo-type')?.value || 'Shelter',
        contact: document.getElementById('reg-ngo-contact')?.value || 'Manager',
        phone: document.getElementById('reg-ngo-phone')?.value || '9911223344',
        address: document.getElementById('reg-ngo-address')?.value || 'Faridabad',
        demand: '100 servings',
        storage: document.getElementById('reg-ngo-storage')?.value === 'Fridge' ? 'Commercial Refrigerator' : 'Ambient Storage Only',
        status: 'pending'
      };
      setNgos(prev => [newNgo, ...prev]);
    }

    setRegSuccess(refCode);
  };

  // Supervisor authenticate submit delay
  const handleAdminSignIn = () => {
    setAdminLoading(true);
    setTimeout(() => {
      setAdminLoading(false);
      if (adminEmail && adminPass) {
        setAdminLoggedIn(true);
      }
    }, 1200);
  };

  // FSSAI approvals in Admin Registry
  const verifyDonor = (id) => {
    setDonors(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    const donorName = donors.find(d => d.id === id)?.name || 'Establishment';
    triggerToast(`FSSAI License verified for ${donorName}!`);
  };

  const verifyNgo = (id) => {
    setNgos(prev => prev.map(n => n.id === id ? { ...n, status: 'approved' } : n));
    const verifiedNgo = ngos.find(n => n.id === id);
    if (verifiedNgo) {
      const isRefrigerated = verifiedNgo.storage.includes('Fridge') || verifiedNgo.storage.includes('Refrigerator');
      
      const newNgoCandidate = {
        id: verifiedNgo.id,
        name: verifiedNgo.name,
        distance: '1.5 km',
        capacity: verifiedNgo.demand,
        occupancy: 'High Demand',
        score: '98%',
        pref: 'Vegetarian Cooked',
        storage: isRefrigerated ? 'Cold storage available' : 'Dry shelving only',
        recommended: true,
        rejected: false,
        reason: 'Your newly registered and FSSAI-approved shelter! Active matching completed.'
      };

      setNgoMatches(prev => {
        const reset = prev.map(c => ({ ...c, recommended: false }));
        return [newNgoCandidate, ...reset];
      });
      
      triggerToast(`FSSAI Approval verified for ${verifiedNgo.name}! Matches updated.`);
    }
  };

  // Check if any overlay is active
  const isOverlayOpen = showDonateFlow || showAdminFlow || showNgoFlow || showVolunteerFlow || showRegisterFlow;

  return (
    <div className="app-shell-vertical">
      

      {/* Floating AI Helper Assistant */}
      {!isOverlayOpen && (
        <div className="chat-bubble-container">
          <div className="floating-chat-bubble" role="button" aria-label="Open Help Assistant" onClick={() => setChatOpen(!chatOpen)}>
            <HelpCircle className="w-6 h-6" />
          </div>

          {chatOpen && (
            <div className="chat-window">
              <div className="chat-header">
                <span>Annect Helper</span>
                <button 
                  style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
                  onClick={() => setChatOpen(false)}
                  aria-label="Close Help Assistant"
                >
                  ×
                </button>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-msg-row ${msg.sender}`}>
                    <div className="chat-msg-bubble">{msg.text}</div>
                    <div className="chat-msg-meta">{msg.time}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-msg-row ai">
                    <div className="chat-msg-bubble">Typing response...</div>
                  </div>
                )}
              </div>

              <div className="chat-options-grid">
                <button 
                  className="chat-option-btn"
                  onClick={() => triggerChatResponse(
                    "What are the FSSAI temperature safety limits?", 
                    "According to FSSAI guidelines, hot cooked foods must be picked up within 2 hours of prep and kept above 60°C. Cold foods must be stored below 5°C. Annect checks sensor readings at every checkpoint to ensure safety."
                  )}
                >
                  🌡️ What are FSSAI temperature safety limits?
                </button>
                <button 
                  className="chat-option-btn"
                  onClick={() => triggerChatResponse(
                    "How do I register my restaurant?", 
                    "Click 'Business Sign Up' on the home page or 'Join Network' in the header. Fill in your FSSAI license number. Our regional supervisor will audit your license key and approve your node within 24 hours."
                  )}
                >
                  🏢 How do I register my restaurant?
                </button>
                <button 
                  className="chat-option-btn"
                  onClick={() => triggerChatResponse(
                    "How do I become a volunteer?", 
                    "You can sign up as a volunteer courier through the Volunteer Hub. You will receive points (XP) for every successful rescue, helping you level up and earn awards."
                  )}
                >
                  🚴 How do I become a volunteer?
                </button>
              </div>

              {/* Conversational Chat input and send triggers */}
              <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', padding: '8px', background: 'var(--bg-surface)' }}>
                <input 
                  type="text" 
                  placeholder="Ask about safety, registration..." 
                  className="form-control" 
                  style={{ flexGrow: 1, height: '34px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', padding: '0 8px' }}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleChatSend();
                  }}
                />
                <button 
                  className="btn btn-primary" 
                  style={{ marginLeft: '6px', height: '34px', padding: '0 12px', display: 'flex', alignItems: 'center' }}
                  onClick={handleChatSend}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== FIXED HEADER (EverSwap-Style) ==================== */}
      <header className="site-header">
        {/* Scroll Progress Bar */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            height: '3px', 
            backgroundColor: 'var(--primary)', 
            width: `${scrollProgress}%`, 
            transition: 'width 0.1s ease',
            zIndex: 1010
          }}
        ></div>

        <div className="header-left" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
          <div className="header-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--primary-light)" />
              <circle cx="8.5" cy="9.5" r="1.2" fill="var(--primary)" />
              <circle cx="15.5" cy="9.5" r="1.2" fill="var(--primary)" />
              <path d="M10.5 12 Q12 13.5 13.5 12" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M16.5 3.5 C17.5 1.5 20.5 1.5 21.5 2.5 C21.5 3.5 20.5 6.5 18.5 6.5" fill="var(--primary-light)" stroke="var(--primary)" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="header-logo-text">
            <span>Annect</span>
            <span>ZERO FOOD WASTE</span>
          </div>
        </div>

        <nav className="header-nav">
          <button 
            className={`header-nav-link ${activeAnchor === 'home' ? 'active' : ''}`}
            onClick={() => scrollToSection('home')}
          >
            Home
          </button>
          
          <button 
            className={`header-nav-link ${activeAnchor === 'how-it-works' ? 'active' : ''}`}
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </button>

          <button 
            className={`header-nav-link ${activeAnchor === 'impact' ? 'active' : ''}`}
            onClick={() => scrollToSection('impact')}
          >
            Impact Dashboard
          </button>

          <button 
            className={`header-nav-link ${activeAnchor === 'about' ? 'active' : ''}`}
            onClick={() => scrollToSection('about')}
          >
            About Us
          </button>

          <button 
            className="header-nav-link"
            onClick={() => { setShowAdminFlow(true); setAdminLoggedIn(false); }}
          >
            Supervisor Portal
          </button>

          <button 
            className={`header-nav-link pitch-btn ${activeAnchor === 'pitch-deck' ? 'active' : ''}`}
            onClick={() => scrollToSection('pitch-deck')}
          >
            Pitch Deck
          </button>
        </nav>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Simple mid-right search button input */}
          <div className="header-search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search sections, actions, NGOs..." 
              className="form-control"
              style={{ 
                width: '240px', 
                paddingLeft: '34px', 
                paddingRight: '12px', 
                height: '36px', 
                fontSize: '12.5px', 
                borderRadius: '18px', 
                border: '1px solid var(--border-color)', 
                background: 'rgba(255,255,255,0.7)',
                outline: 'none'
              }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => {
                if (searchQuery.length > 0) setShowSearchResults(true);
              }}
            />
            <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            
            {/* Dropdown Search Results */}
            {showSearchResults && (
              <div 
                className="search-dropdown-menu" 
                style={{ 
                  position: 'absolute', 
                  top: '42px', 
                  right: 0, 
                  width: '320px', 
                  backgroundColor: 'white', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  boxShadow: '0 8px 24px rgba(32,55,39,0.12)', 
                  padding: '10px', 
                  zIndex: 1200, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px' 
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '2px' }}>
                  GLOBAL SITE COMMANDS & NODES:
                </div>
                {getUniversalSearchResults().length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '6px' }}>No matches found.</div>
                ) : (
                  getUniversalSearchResults().map((item, idx) => (
                    <div 
                      key={idx} 
                      className="search-result-item" 
                      style={{ 
                        padding: '6px 8px', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        transition: 'background 0.2s', 
                        borderBottom: '1px solid var(--border-light)' 
                      }}
                      onClick={() => handleSearchResultClick(item)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)' }}>{item.title}</span>
                        <span className={`status-pill ${item.category === 'Action' ? 'pending' : item.category === 'Navigation' ? 'approved' : 'active-rescue'}`} style={{ fontSize: '8.5px', padding: '2px 6px' }}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-secondary btn-sm" onClick={() => { setShowDonateFlow(true); setDonateStep(1); }} aria-label="Donate Surplus Food">
            <PlusCircle className="w-3.5 h-3.5" /> <span className="hide-mobile">Donate Food</span>
          </motion.button>
        </div>
      </header>

      {/* ==================== MAIN CONTENT AREA (CONTINUOUS SCROLLING) ==================== */}
      <main className="main-content">
        
        {/* SECTION 1: HOME HERO */}
        <motion.section 
          id="home"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="scroll-section"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Hero background image watermark with dark gradient overlay using --primary at low opacity */}
          <div 
            className="hero-bg-watermark" 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(to bottom, rgba(32, 55, 39, 0.05) 0%, rgba(32, 55, 39, 0.15) 100%), url("/hero_background.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.14,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          
          <div className="landing-hero">
            <div className="hero-kicker">CSR ALIGNMENT • MUNICIPAL ZERO WASTE</div>
            <h1>Connecting surplus food to save lives</h1>
            <p>India's leading real-time surplus redistribution network. We bridge commercial food providers with recipient shelters under rigorous FSSAI freshness and safety diagnostics.</p>
            
            <div className="landing-hero-ctas">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" onClick={() => { setShowDonateFlow(true); setDonateStep(1); }}>
                <PlusCircle className="w-4 h-4" /> Start Food Donation Scan
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-outline" onClick={() => { setRegRole('ngo'); setRegSuccess(null); setShowRegisterFlow(true); }}>
                <Building className="w-4 h-4" /> Join as Receiver Shelter
              </motion.button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-outline btn-sm" onClick={() => { setRegRole('donor'); setRegSuccess(null); setShowRegisterFlow(true); }}>
                <Building className="w-3.5 h-3.5" /> Business Sign Up
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-outline btn-sm" onClick={() => setShowVolunteerFlow(true)}>
                <Bike className="w-3.5 h-3.5" /> Volunteer Hub
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-outline btn-sm" onClick={() => setShowNgoFlow(true)}>
                <Building className="w-3.5 h-3.5" /> NGO Console
              </motion.button>
            </div>
          </div>

          <div className="landing-layout-grid">
            <div className="card" onMouseMove={handleCardMouseMove}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Ecosystem Stats</h3>
                
                {/* Region selector filter */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className={`btn btn-sm ${selectedRegion === 'central' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelectedRegion('central')}>Central</button>
                  <button className={`btn btn-sm ${selectedRegion === 'gurugram' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelectedRegion('gurugram')}>Gurugram</button>
                  <button className={`btn btn-sm ${selectedRegion === 'noida' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelectedRegion('noida')}>Noida</button>
                </div>
              </div>

              <div className="stats-counter-grid">
                <div className="stat-item span-2">
                  <div className="stat-info">
                    <div className="stat-number">{mealsRescuedCount.toLocaleString()}</div>
                    <div className="stat-label">Meals Rescued</div>
                  </div>
                  <Trash2 className="w-7 h-7 stat-emoji" />
                </div>
                <div className="stat-item span-2">
                  <div className="stat-info">
                    <div className="stat-number">{co2SavedCount} Tons</div>
                    <div className="stat-label">CO₂ Saved</div>
                  </div>
                  <Leaf className="w-7 h-7 stat-emoji" />
                </div>
                <div className="stat-item">
                  <Milestone className="w-7 h-7 mx-auto stat-emoji" />
                  <div className="stat-number">{REGION_STATS[selectedRegion].saved} Tons</div>
                  <div className="stat-label">Food Saved</div>
                </div>
                <div className="stat-item">
                  <Users className="w-7 h-7 mx-auto stat-emoji" />
                  <div className="stat-number">{(REGION_STATS[selectedRegion].meals * 0.7).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                  <div className="stat-label">People Fed</div>
                </div>
              </div>

              {/* Informational Disclaimer on Data Origin */}
              <div style={{ 
                marginTop: '20px', 
                paddingTop: '12px', 
                borderTop: '1px solid var(--border-light)', 
                fontSize: '11px', 
                color: 'var(--text-muted)', 
                textAlign: 'left',
                lineHeight: '1.4',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>ℹ️</span>
                <span>
                  <strong>Data Context:</strong> Statistics are aggregated from active NCR municipal pilot project logs (Central, Gurugram, Noida) combined with projected carbon emission savings calculated using FSSAI food waste multipliers.
                </span>
              </div>
            </div>

            <div className="hero-graphics">
              <div className="city-map-container">
                <svg className="city-map-svg">
                  <path d="M -50 350 Q 150 380 450 320 L 500 500 L -50 500 Z" fill="#e0ffab" opacity="0.25"/>
                  <path d="M 0 100 L 500 130" stroke="rgba(32, 55, 39, 0.08)" strokeWidth="2" fill="none"/>
                  <path d="M 0 280 Q 200 240 500 300" stroke="rgba(32, 55, 39, 0.08)" strokeWidth="2" fill="none"/>
                  <path d="M 120 0 L 100 500" stroke="rgba(32, 55, 39, 0.08)" strokeWidth="2" fill="none"/>
                  <path d="M 380 0 Q 300 200 350 500" stroke="rgba(32, 55, 39, 0.08)" strokeWidth="2" fill="none"/>
                  <path d="M 120 100 Q 250 180 350 300" className="map-route-line" stroke="#516e5a" />
                </svg>
                <div className="map-node donor animate-ping" style={{ left: '120px', top: '100px' }}></div>
                <div className="map-node donor" style={{ left: '120px', top: '100px' }}></div>
                <div className="map-node ngo animate-ping" style={{ left: '350px', top: '300px' }}></div>
                <div className="map-node ngo" style={{ left: '350px', top: '300px' }}></div>
                
                <div className="map-info-card">
                  <Bike className="w-5 h-5 text-emerald-800" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Rescue Route Active</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Radisson Blu → MCF Night Shelter</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 1.5: INTERACTIVE BENTO GRID (21st.dev inspired) */}
        <section className="bento-container" style={{ marginTop: '40px' }}>
          <div className="section-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h1>Interactive Simulation Console</h1>
            <p>Test FSSAI safety thresholds, carbon offset projections, and live route pathing parameters in real-time.</p>
          </div>

          <div className="bento-grid">
            {/* Card 1: FSSAI Telemetry Scanner Simulator */}
            <div className="bento-card span-2" onMouseMove={handleCardMouseMove} style={{ border: '1px solid var(--primary)', boxShadow: '0 8px 30px rgba(32,55,39,0.06)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: 'var(--primary)' }}><Shield className="w-5 h-5 inline-block mr-1.5" /> FSSAI Safety Buffer Simulator</h3>
                  <span className={`urgency-badge ${aiAnalysis.urgency.toLowerCase()}`}>{aiAnalysis.urgency} URGENCY</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Drag the temperature handle to simulate changes in food transit heat. Observe how shelf life and safety status adapt dynamically.
                </p>

                {/* Slider Temperature & FSSAI dynamic values */}
                <div className="temp-slider-container" style={{ margin: '16px 0' }}>
                  <div className="temp-slider-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SIMULATED TRANSIT TEMP</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{parseFloat(tempValue).toFixed(1)}°C</span>
                  </div>
                  <input 
                    type="range" 
                    min="2.0" 
                    max="75.0" 
                    step="0.5" 
                    className="temp-range-input" 
                    value={tempValue} 
                    onChange={(e) => setTempValue(parseFloat(e.target.value))}
                  />
                </div>

                <div className="ai-stat-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div className="ai-stat-card" style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '6px' }}>
                    <div className="label" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DIAGNOSTIC STATUS</div>
                    <div className="value" style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px', color: 'var(--primary-dark)' }}>{aiAnalysis.detected}</div>
                  </div>
                  <div className="ai-stat-card" style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '6px' }}>
                    <div className="label" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CALCULATED SHELF LIFE</div>
                    <div className="value" style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px', color: 'var(--primary-dark)' }}>{aiAnalysis.shelfLife}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: ESG Waste Tax Calculator */}
            <div className="bento-card span-1" onMouseMove={handleCardMouseMove}>
              <div>
                <h3 style={{ marginBottom: '12px' }}><Leaf className="w-5 h-5 inline mr-1 text-emerald-800" /> Carbon Offset</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Drag to estimate savings based on weekly diverted food weight.
                </p>

                <div className="temp-slider-container" style={{ margin: '12px 0' }}>
                  <div className="temp-slider-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span>WEEKLY WEIGHT</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{calcWeight} kg</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    step="10" 
                    className="temp-range-input" 
                    value={calcWeight} 
                    onChange={(e) => setCalcWeight(parseInt(e.target.value))}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '11.5px', background: 'var(--bg-app)', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Meals Served:</span>
                    <span style={{ fontWeight: 700 }}>{calcWeight * 2}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CO₂ Saved:</span>
                    <span style={{ fontWeight: 700 }}>{(calcWeight * 2.5).toFixed(1)} kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax Savings:</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(calcWeight * 12).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Hyperlocal City Map Nodes */}
            <div className="bento-card span-1" onMouseMove={handleCardMouseMove}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}><MapPin className="w-5 h-5 inline mr-1" /> Route Tracking</h3>
                  <select 
                    className="form-control" 
                    style={{ width: '110px', height: '26px', fontSize: '10px', padding: '0 4px', borderRadius: '4px' }}
                    value={activeBentoRoute}
                    onChange={(e) => setActiveBentoRoute(e.target.value)}
                  >
                    <option value="radisson">Route A (Radisson)</option>
                    <option value="bakehouse">Route B (Bakehouse)</option>
                    <option value="mandi">Route C (Mandi)</option>
                  </select>
                </div>
                
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {activeBentoRoute === 'radisson' && "Radisson Blu ➔ MCF Night Shelter (12 Mins)"}
                  {activeBentoRoute === 'bakehouse' && "Bakehouse Cafe ➔ Children Shelter (5 Mins)"}
                  {activeBentoRoute === 'mandi' && "Mandi Wholesaler ➔ Sewa Kitchen (22 Mins)"}
                </p>

                <div style={{ height: '140px', background: 'var(--bg-app)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                  <svg style={{ width: '100%', height: '100%' }}>
                    {activeBentoRoute === 'radisson' && (
                      <>
                        <path d="M 30 30 Q 120 70 200 110" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="5 3" />
                        <circle cx="30" cy="30" r="5" fill="#d9534f" />
                        <circle cx="200" cy="110" r="5" fill="var(--primary)" />
                      </>
                    )}
                    {activeBentoRoute === 'bakehouse' && (
                      <>
                        <path d="M 30 110 Q 100 40 200 30" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="5 3" />
                        <circle cx="30" cy="110" r="5" fill="#d9534f" />
                        <circle cx="200" cy="30" r="5" fill="var(--primary)" />
                      </>
                    )}
                    {activeBentoRoute === 'mandi' && (
                      <>
                        <path d="M 100 30 Q 120 120 200 110" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="5 3" />
                        <circle cx="100" cy="30" r="5" fill="#d9534f" />
                        <circle cx="200" cy="110" r="5" fill="var(--primary)" />
                      </>
                    )}
                  </svg>
                  
                  <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '9px', background: 'white', padding: '2px 4px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', fontWeight: 700 }}>
                    {activeBentoRoute === 'radisson' && "Radisson Blu (Hotel)"}
                    {activeBentoRoute === 'bakehouse' && "Bakehouse Cafe"}
                    {activeBentoRoute === 'mandi' && "Mandi Stand"}
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '9px', background: 'white', padding: '2px 4px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', fontWeight: 700 }}>
                    {activeBentoRoute === 'radisson' && "MCF Night Shelter"}
                    {activeBentoRoute === 'bakehouse' && "Children Shelter"}
                    {activeBentoRoute === 'mandi' && "Sewa Kitchen"}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Volunteer XP & Leaderboard History */}
            <div className="bento-card span-2" onMouseMove={handleCardMouseMove} style={{ border: '1px solid var(--primary)', boxShadow: '0 8px 30px rgba(32,55,39,0.06)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3><Award className="w-5 h-5 inline mr-1 text-emerald-800" /> Courier XP Level Progress</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Level 12 Dispatcher Profile</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginTop: '12px' }}>
                  <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '6px', fontSize: '12px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>Rahul Sharma</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '8px' }}>Total Points: 1,820 XP</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '9px', border: '1px solid var(--border-color)' }}>🏆 Centurion</span>
                      <span style={{ background: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '9px', border: '1px solid var(--border-color)' }}>🌙 Night Owl</span>
                    </div>
                  </div>

                  <div style={{ height: '100px' }}>
                    <Line 
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                          label: 'XP',
                          data: [80, 150, 90, 240, 120, 310, 420],
                          borderColor: '#203727',
                          borderWidth: 2.5,
                          tension: 0.3,
                          pointRadius: 0,
                          fill: false
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { display: false },
                          x: { grid: { display: false }, ticks: { font: { size: 9 } } }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW IT WORKS TIMELINE */}
        <motion.section 
          id="how-it-works"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="scroll-section"
        >
          <div className="section-header">
            <h1>How Annect Ecosystem Works</h1>
            <p>Real-time coordination between donors, volunteers, and shelters enabled by intelligent logistics.</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-step">
              <div className="timeline-step-icon"><Building className="w-6 h-6" /></div>
              <div className="timeline-step-content">
                <div className="timeline-step-header">
                  <span className="timeline-step-num">Step 1</span>
                  <h3 className="timeline-step-title">Surplus Food Upload</h3>
                </div>
                <p className="timeline-step-desc">Hotels, canteens, and banquet managers upload details of surplus food (quantity, dishes, time cooked) along with a fresh image directly from their phone.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon"><Shield className="w-6 h-6" /></div>
              <div className="timeline-step-content">
                <div className="timeline-step-header">
                  <span className="timeline-step-num">Step 2</span>
                  <h3 className="timeline-step-title">Digital Freshness Scan</h3>
                </div>
                <p className="timeline-step-desc">The digital audit scanner runs diagnostic parameters: verifying packaging type, food temperature, ingredients, and calculating safe distribution shelf life.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon"><Milestone className="w-6 h-6" /></div>
              <div className="timeline-step-content">
                <div className="timeline-step-header">
                  <span className="timeline-step-num">Step 3</span>
                  <h3 className="timeline-step-title">FSSAI Compliance Matching</h3>
                </div>
                <p className="timeline-step-desc">The matching engine ranks recipient shelters based on distance, occupancy, and storage capability (refrigeration/hot cabinets) to select the safest recipient.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon"><Bike className="w-6 h-6" /></div>
              <div className="timeline-step-content">
                <div className="timeline-step-header">
                  <span className="timeline-step-num">Step 4</span>
                  <h3 className="timeline-step-title">Courier Dispatch</h3>
                </div>
                <p className="timeline-step-desc">A nearby registered volunteer is alerted, accepts the pickup request, and follows optimized real-time routes to the donor.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon"><CheckCircle className="w-6 h-6" /></div>
              <div className="timeline-step-content">
                <div className="timeline-step-header">
                  <span className="timeline-step-num">Step 5</span>
                  <h3 className="timeline-step-title">FSSAI Quality Check</h3>
                </div>
                <p className="timeline-step-desc">The volunteer conducts a physical check at pickup: measuring food temperature, checking container hygiene, and verifying preparation timings.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-step-icon"><CheckCircle className="w-6 h-6" /></div>
              <div className="timeline-step-content">
                <div className="timeline-step-header">
                  <span className="timeline-step-num">Step 6</span>
                  <h3 className="timeline-step-title">Secure Handover & Impact Updates</h3>
                </div>
                <p className="timeline-step-desc">Food is delivered to the matched shelter. Receivers verify arrival using secure QR validation. Instantly, ESG dashboards and CO2 records update.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 3: IMPACT DASHBOARD */}
        <motion.section 
          id="impact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="scroll-section"
        >
          <div className="section-header">
            <h1>Ecosystem Impact & ESG Analytics</h1>
            <p>Real-time transparency reports for CSR alignment, environmental audits, and municipal compliance.</p>
          </div>

          <div className="impact-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div className="card" onMouseMove={handleCardMouseMove} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', padding: '24px 30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="stat-number" style={{ fontSize: '32px' }}>{mealsRescuedCount.toLocaleString()}</div>
                <div className="stat-label">Meals Served</div>
              </div>
              <Trash2 className="w-8 h-8 stat-emoji" style={{ margin: 0, color: 'var(--primary)' }} />
            </div>
            <div className="card" onMouseMove={handleCardMouseMove} style={{ textAlign: 'center' }}>
              <Milestone className="w-6 h-6 mx-auto stat-emoji" />
              <div className="stat-number">4,200 kg</div>
              <div className="stat-label">Landfill Diverted</div>
            </div>
            <div className="card" onMouseMove={handleCardMouseMove} style={{ textAlign: 'center' }}>
              <Leaf className="w-6 h-6 mx-auto stat-emoji" />
              <div className="stat-number">{co2SavedCount} Tons</div>
              <div className="stat-label">CO₂ Saved</div>
            </div>
            <div className="card" onMouseMove={handleCardMouseMove} style={{ textAlign: 'center' }}>
              <Users className="w-6 h-6 mx-auto stat-emoji" />
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Volunteers</div>
            </div>
          </div>

          <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '30px' }}>
            <div className="card" onMouseMove={handleCardMouseMove}>
              <h3><i className="fas fa-chart-area"></i> Monthly Redistribution Trend</h3>
              <div style={{ height: '280px', marginTop: '20px' }}>
                <Line 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                      label: 'Meals Rescued',
                      data: [2100, 3400, 5200, 7800, 11200, 14800, mealsRescuedCount],
                      borderColor: '#203727',
                      backgroundColor: 'rgba(224, 255, 171, 0.25)',
                      fill: true,
                      tension: 0.4,
                      borderWidth: 3
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { grid: { borderDash: [4, 4], color: 'rgba(32, 55, 39, 0.08)' } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </div>
            </div>

            <div className="card" onMouseMove={handleCardMouseMove}>
              <h3><i className="fas fa-chart-pie"></i> Surplus Food Sources</h3>
              <div style={{ height: '280px', marginTop: '20px' }}>
                <Doughnut 
                  data={{
                    labels: ['Cooked Leftovers', 'Packed Meals', 'Bakery', 'Mandi/Produce'],
                    datasets: [{
                      data: [45, 25, 15, 15],
                      backgroundColor: ['#203727', '#e0ffab', '#516e5a', '#d9534f'],
                      borderWidth: 2,
                      borderColor: '#ffffff'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true, color: '#203727' } }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* ESG Carbon Impact Calculator */}
          <div className="calc-grid">
            <div className="card" onMouseMove={handleCardMouseMove}>
              <h3 style={{ marginBottom: '15px' }}><Leaf className="w-5 h-5 inline mr-1 text-emerald-800" /> ESG Estimator Calculator</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Estimate how much carbon offset your business can achieve weekly by routing surplus through Annect.
              </p>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Establishment Type</label>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button className={`btn btn-sm ${calcType === 'hotel' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCalcType('hotel')}>Hotel / Banquet</button>
                  <button className={`btn btn-sm ${calcType === 'canteen' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCalcType('canteen')}>Corporate Canteen</button>
                  <button className={`btn btn-sm ${calcType === 'retail' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCalcType('retail')}>Bakery / Mandi</button>
                </div>
              </div>

              <div className="temp-slider-container" style={{ marginTop: '20px' }}>
                <div className="temp-slider-header">
                  <span>WEEKLY SURPLUS WEIGHT</span>
                  <span style={{ color: 'var(--primary)' }}>{calcWeight} kg</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10" 
                  className="temp-range-input" 
                  value={calcWeight} 
                  onChange={(e) => setCalcWeight(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="calc-metrics-card">
              <div>
                <h4 style={{ color: 'var(--primary-light)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Potential Weekly Impact Metrics
                </h4>
                
                <div className="calc-metric-row">
                  <span className="calc-metric-label">Meals Rescued</span>
                  <span className="calc-metric-val">{(calcWeight * 2).toLocaleString()} meals</span>
                </div>
                
                <div className="calc-metric-row">
                  <span className="calc-metric-label">Carbon Offset</span>
                  <span className="calc-metric-val">{(calcWeight * 2.5).toFixed(1)} kg CO₂e</span>
                </div>

                <div className="calc-metric-row">
                  <span className="calc-metric-label">Waste Tax Savings</span>
                  <span className="calc-metric-val">₹{(calcWeight * 12).toLocaleString()} saved</span>
                </div>
              </div>

              <div style={{ fontSize: '11px', opacity: 0.8, borderTop: '1px solid rgba(224, 255, 171, 0.2)', paddingTop: '10px', marginTop: '10px' }}>
                *Estimates based on FSSAI guidelines & municipal garbage tipping tax structures.
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 4: ABOUT US & REGULATORY VISION */}
        <motion.section 
          id="about"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="scroll-section"
        >
          <div className="section-header">
            <h1>About Annect</h1>
            <p>The vision, policies, and partnerships building the digital backbone for zero hunger.</p>
          </div>

          <div className="about-grid">
            <div className="card" onMouseMove={handleCardMouseMove}>
              <h3 style={{ marginBottom: '15px' }}><Heart className="w-5 h-5 inline mr-1" /> Our Vision</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                We believe that no safe food should reach a landfill while families sleep hungry. Annect operates as India's largest tech-first surplus food redistribution network. By integrating intelligent verification sensors, real-time matching matrices, and crowd-sourced delivery channels, we bridge the gap between commercial surplus and local nutrition shelters.
              </p>
              
              <h3>FSSAI Regulatory Standards</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '10px' }}>
                All operations conform to FSSAI (Food Safety and Standards Authority of India) protocols for surplus recovery. Hot foods must be picked up within 2 hours of preparation and kept warm at 60°C. Volunteers measure telemetry parameters at every checkpoint to ensure absolute safe handover.
              </p>
            </div>

            {/* Small relevant photography card */}
            <div className="card" onMouseMove={handleCardMouseMove} style={{ padding: 0, overflow: 'hidden', minHeight: '260px' }}>
              <img 
                src="/about_shelter.jpg" 
                alt="Volunteers and shelter community kitchen" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => handleImageError(e, "🤝")}
              />
            </div>

            <div className="card" onMouseMove={handleCardMouseMove} style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', borderColor: 'var(--primary-light)' }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '12px' }}><Milestone className="w-5 h-5 inline mr-1" /> Core Partnerships</h3>
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '12px' }}><b>Municipal Corporations:</b> Collaborating on garbage dumping tax waivers for zero-waste hotels.</p>
                <p style={{ marginBottom: '12px' }}><b>CSR Partners:</b> Funding volunteer electric scooters, thermal storage gear, and shelter holding cabinets.</p>
                <p><b>FSSAI Auditing:</b> Certifying volunteers and NGO kitchens for hygiene parameters.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 5: PITCH DECK SLIDES */}
        <motion.section 
          id="pitch-deck"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="scroll-section"
        >
          <div className="section-header">
            <h1>Annect Investor Presentation</h1>
            <p>Interactive slides for Hackathons, Investors, Municipal Corporations, and NGOs.</p>
          </div>

          <div className="slide-deck-wrapper">
            <div className="slide-frame">
              {slideIndex === 0 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 1 • Cover</span>
                    <h2>Annect</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-title-layout" style={{ textAlign: 'left', padding: '0' }}>
                      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Connecting surplus food to save lives</h1>
                      <p className="subtitle" style={{ fontSize: '15px' }}>India's Largest AI-Powered Surplus Food Rescue Network</p>
                      <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, marginTop: '16px' }}>
                        <Leaf className="w-5 h-5 inline mr-1.5" /> Zero Food Waste • Zero Hunger
                      </div>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', height: '220px' }}>
                      <img src="/hero_background.jpg" alt="Commercial Kitchen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🍲")} />
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 1 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 2 • The Crisis</span>
                    <h2>The Looming Crisis</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <ul>
                        <li><b>40% of food in India is wasted</b> before it reaches plates (FSSAI/FAO estimation).</li>
                        <li><b>India ranks 111th out of 125</b> countries on the Global Hunger Index.</li>
                        <li>Surplus food from banquets, corporate canteens, and markets is thrown into landfills daily.</li>
                        <li><b>Environmental impact:</b> Decomposing food generates large volumes of methane gas and wastes precious agricultural water.</li>
                      </ul>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '220px' }}>
                      <div style={{ height: '120px' }}>
                        <img src="/mandi_vegetables.png" alt="Mandi fresh vegetables" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🥦")} />
                      </div>
                      <div style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>40% Wasted Daily</div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Co-exists alongside chronic undernourishment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 2 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 3 • Connected Network</span>
                    <h2>The Connected Ecosystem</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <p>Annect is the unified digital backbone coordinating multiple key stakeholders in real-time:</p>
                      <div className="slide-grid-2" style={{ marginTop: '15px' }}>
                        <div className="slide-card">
                          <h3>Donors</h3>
                          <p>Hotels, corporate cafeterias, bakeries, mandis.</p>
                        </div>
                        <div className="slide-card">
                          <h3>Volunteers</h3>
                          <p>Hyperlocal crowd-sourced networks and NGO teams.</p>
                        </div>
                        <div className="slide-card">
                          <h3>NGOs & Shelters</h3>
                          <p>Homeless night shelters, camps, community kitchens.</p>
                        </div>
                        <div className="slide-card">
                          <h3>Municipalities</h3>
                          <p>Providing municipal integration and waste reductions.</p>
                        </div>
                      </div>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '220px' }}>
                      <div style={{ height: '130px' }}>
                        <img src="/about_shelter.jpg" alt="Shelter volunteers" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🤝")} />
                      </div>
                      <div style={{ padding: '12px' }}>
                        <h3 style={{ fontSize: '13.5px', margin: 0 }}>The Network Effect</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Reducing food pickup windows to minutes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 3 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 4 • Rescue Target</span>
                    <h2>What Food We Rescue</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <div className="slide-grid-2">
                        <div>
                          <h3>Cooked Meals</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Banquet halls, hotels. High priority. 1-4 hour redistribution window.</p>
                        </div>
                        <div>
                          <h3>Packed Meals</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Airlines, meal subscription kitchens. Sealed and secure.</p>
                        </div>
                        <div>
                          <h3>Bakery Products</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bakeries, cafes. Bread, cookies, cakes collected at closing.</p>
                        </div>
                        <div>
                          <h3>Fresh Produce</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mandis, wholesale vendors. Redirected to community kitchens.</p>
                        </div>
                      </div>
                    </div>
                    <div className="slide-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '220px', justifyContent: 'center' }}>
                      <h4 style={{ fontSize: '12px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800 }}>Rescue Portals:</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', flexGrow: 1 }}>
                        <div style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                          <img src="/paneer_curry.png" alt="Cooked" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🍛")} />
                        </div>
                        <div style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                          <img src="/packed_meals.png" alt="Packed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🥪")} />
                        </div>
                        <div style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                          <img src="/bakery_surplus.png" alt="Bakery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🍞")} />
                        </div>
                        <div style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                          <img src="/mandi_vegetables.png" alt="Veg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🥦")} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 4 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 5 • Safety Buffers</span>
                    <h2>Operating Model (7 Steps)</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <ul>
                        <li><b>Step 1-2: Donor Upload & AI Audit</b> - Photo submission automatically parsed for quantity and shelf-life estimates.</li>
                        <li><b>Step 3-4: Matching & Dispatch</b> - Algorithm assigns the optimal shelter, alerts nearest volunteer.</li>
                        <li><b>Step 5: Quality Check</b> - Volunteer verifies container hygiene and temperatures at pickup.</li>
                        <li><b>Step 6-7: Secure Handover & Stats update</b> - Delivery QR code signature updates impact dashboards.</li>
                      </ul>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '220px' }}>
                      <div style={{ height: '140px' }}>
                        <img src="/hero_background.jpg" alt="Transport Cycle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🍲")} />
                      </div>
                      <div style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '13px', margin: 0 }}>Minutes Matter</h4>
                        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Pickup matches the safety buffer window.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 5 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 6 • Smart Matrix</span>
                    <h2>The AI Matching Engine</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <p>Our routing matrix uses multiple weight parameters to decide the matching recipient shelter:</p>
                      <ul style={{ marginTop: '10px' }}>
                        <li><b>Distance & ETA:</b> Minimal transport duration.</li>
                        <li><b>Shelter Capacity:</b> Prevent overloading.</li>
                        <li><b>Real-Time Occupancy:</b> Direct need calculation.</li>
                        <li><b>Storage Infrastructure:</b> Refrigerator/cabinet check.</li>
                        <li><b>Volunteer Pathing:</b> Merging routes to save travel energy.</li>
                      </ul>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '220px' }}>
                      <div style={{ height: '140px' }}>
                        <img src="/about_shelter.jpg" alt="AI Matching" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🤖")} />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <h4 style={{ fontSize: '13px', margin: 0 }}>Not Just "Nearest"</h4>
                        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Dynamically pathing based on real-time need.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 6 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 7 • FSSAI Standards</span>
                    <h2>FSSAI Compliance & Safety</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <ul>
                        <li>Adheres strictly to <b>FSSAI Surplus Food Recovery Regulations</b>.</li>
                        <li><b>Digital Audits:</b> Photo matching detects spoilage patterns before logistics begin.</li>
                        <li><b>Physical Audits:</b> Volunteers measure temperature (hot meals must stay above 60°C or cold below 5°C).</li>
                        <li><b>Traceability:</b> Every batch is digitally stamped from donor source to recipient signature.</li>
                      </ul>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '220px' }}>
                      <div style={{ height: '140px' }}>
                        <img src="/paneer_curry.png" alt="FSSAI Hot Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🌡️")} />
                      </div>
                      <div style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '13px', margin: 0 }}>Zero Liability</h4>
                        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Hot foods kept above 60°C for FSSAI safety.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 7 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 8 • Revenue Stream</span>
                    <h2>Sustainability & Revenue Model</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <p>Although mission-driven, Annect builds financial self-sufficiency through:</p>
                      <ul style={{ marginTop: '10px' }}>
                        <li><b>CSR Corporate Sponsorships:</b> Funding network tech, logistics fuel, and volunteer gear.</li>
                        <li><b>ESG SaaS Dashboard Subscriptions:</b> For hotel chains, hospitals, and tech campuses requiring carbon audits.</li>
                        <li><b>Municipal Partnership Contracts:</b> Helping cities reduce municipal solid waste costs.</li>
                        <li><b>Premium Logistics support:</b> For large recurring commercial food producers.</li>
                      </ul>
                    </div>
                    <div className="slide-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '220px' }}>
                      <div style={{ height: '140px' }}>
                        <img src="/mandi_vegetables.png" alt="Carbon offset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => handleImageError(e, "🌱")} />
                      </div>
                      <div style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '13px', margin: 0 }}>$0 for Food</h4>
                        <p style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Technology & ESG reporting monetize the network.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 8 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 9 • Competitors</span>
                    <h2>Competitive Landscape</h2>
                  </div>
                  <div className="slide-body">
                    <div className="table-container" style={{ width: '100%' }}>
                      <table className="data-table" style={{ fontSize: '13px', width: '100%' }}>
                        <thead>
                          <tr>
                            <th>Organization</th>
                            <th>Strengths</th>
                            <th>Gaps Annect Fills</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><b>Robin Hood Army</b></td>
                            <td>Large local volunteer networks</td>
                            <td>Adding real-time AI matching, routing & transparency charts.</td>
                          </tr>
                          <tr>
                            <td><b>Feeding India</b></td>
                            <td>Corporate tie-ups, structural programs</td>
                            <td>Adding hyperlocal instant matching of freshly cooked meals.</td>
                          </tr>
                          <tr>
                            <td><b>Municipal Initiatives</b></td>
                            <td>Government backup and localized reach</td>
                            <td>Providing a scalable software framework for national deployment.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {slideIndex === 9 && (
                <div className="slide-content active">
                  <div className="slide-header">
                    <span className="category">Slide 10 • Horizon</span>
                    <h2>The Road Ahead</h2>
                  </div>
                  <div className="slide-body">
                    <div className="slide-body-left">
                      <div className="slide-grid-2">
                        <div className="slide-card">
                          <h3>Phase 1: Pilot</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>20 hotels, 10 restaurants, 10 NGOs in Faridabad. Target: 500 meals/day.</p>
                        </div>
                        <div className="slide-card">
                          <h3>Phase 2: NCR</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Expand to Noida, Gurugram, Delhi. Integrate corporate campus canteens.</p>
                        </div>
                        <div className="slide-card">
                          <h3>Phase 3: National</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Deploy modular playbooks to 100+ tier-1 & 2 cities with Municipal links.</p>
                        </div>
                        <div className="slide-card">
                          <h3>Join the Bridge</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Become a donor, tech collaborator, or municipal partner today.</p>
                        </div>
                      </div>
                    </div>
                    <div className="slide-card" style={{ borderLeft: '4px solid var(--primary)', textAlign: 'center', padding: '30px' }}>
                      <Heart className="w-10 h-10 mx-auto text-emerald-800 animate-pulse mb-3" />
                      <h3 style={{ justifyContent: 'center' }}>Let's Save Food</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Partner with us to deploy in your municipal district today.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="slide-controls">
              <button className="btn btn-outline btn-sm" disabled={slideIndex === 0} onClick={() => setSlideIndex(prev => Math.max(prev - 1, 0))}>
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="slide-progress-bar">
                <div className="slide-progress" style={{ width: `${((slideIndex + 1) / 10) * 100}%` }}></div>
              </div>

              <button className="btn btn-outline btn-sm" disabled={slideIndex === 9} onClick={() => setSlideIndex(prev => Math.min(prev + 1, 9))}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Downloader triggers for Pitch slides */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={downloadPitchDeckPdf}>
                <FileSpreadsheet className="w-4 h-4" /> Download PDF Presentation
              </button>
              <button className="btn btn-outline btn-sm" onClick={downloadPitchDeckMarkdown}>
                <FileSpreadsheet className="w-4 h-4" /> Download Markdown Deck
              </button>
            </div>
          </div>
        </motion.section>

      </main>

      {/* ==================== WIZARD 1: DONATE FOOD APP FLOW OVERLAY ==================== */}
      {showDonateFlow && (
        <div className="app-flow-overlay">
          <div className="app-flow-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>Redistribution Portal</span>
              
              <div className="flow-progress-tracker">
                <div className={`flow-step-indicator ${donateStep === 1 ? 'active' : 'completed'}`}><span className="flow-step-dot"></span> Details</div>
                <div className={`flow-step-indicator ${donateStep === 2 ? 'active' : donateStep > 2 ? 'completed' : ''}`}><span className="flow-step-dot"></span> Scan</div>
                <div className={`flow-step-indicator ${donateStep === 3 ? 'active' : donateStep > 3 ? 'completed' : ''}`}><span className="flow-step-dot"></span> Match</div>
                <div className={`flow-step-indicator ${donateStep === 4 ? 'active' : donateStep > 4 ? 'completed' : ''}`}><span className="flow-step-dot"></span> Telemetry</div>
              </div>
            </div>
            
            <button className="btn btn-outline btn-sm" onClick={() => setShowDonateFlow(false)}>Close Portal</button>
          </div>

          <div className="app-flow-container">
            {/* Step 1: Form details */}
            {donateStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 16 }} className="donation-grid">
                <div className="card" onMouseMove={handleCardMouseMove}>
                  <h3 style={{ marginBottom: '20px' }}><PlusCircle className="w-5 h-5 inline-block mr-1.5" /> Surplus Details</h3>
                  
                  <div className="preset-section" style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>SELECT SURPLUS PRESETS FOR QUICK ENTRY:</label>
                    <div className="preset-grid">
                      <div className={`preset-card ${activePreset === 'paneer' ? 'selected' : ''}`} onClick={() => handlePresetSelect('paneer')}>
                        <img src="/paneer_curry.png" alt="Paneer" onError={(e) => handleImageError(e, "🍲")} />
                        <div className="preset-info">
                          <h4>Paneer Curry & Rice</h4>
                          <p>Cooked - 45 Servings</p>
                        </div>
                      </div>
                      <div className={`preset-card ${activePreset === 'sandwiches' ? 'selected' : ''}`} onClick={() => handlePresetSelect('sandwiches')}>
                        <img src="/packed_meals.png" alt="Sandwiches" onError={(e) => handleImageError(e, "🥪")} />
                        <div className="preset-info">
                          <h4>Meal Box Packets</h4>
                          <p>Sealed - 60 Boxes</p>
                        </div>
                      </div>
                      <div className={`preset-card ${activePreset === 'bakery' ? 'selected' : ''}`} onClick={() => handlePresetSelect('bakery')}>
                        <img src="/bakery_surplus.png" alt="Bakery" onError={(e) => handleImageError(e, "🍞")} />
                        <div className="preset-info">
                          <h4>Assorted Breads</h4>
                          <p>Bakery - 30 items</p>
                        </div>
                      </div>
                      <div className={`preset-card ${activePreset === 'vegetables' ? 'selected' : ''}`} onClick={() => handlePresetSelect('vegetables')}>
                        <img src="/mandi_vegetables.png" alt="Veg" onError={(e) => handleImageError(e, "🥦")} />
                        <div className="preset-info">
                          <h4>Mandi Vegetables</h4>
                          <p>Produce - 120kg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="food-type">Food Category</label>
                        <select id="food-type" className="form-control" value={donationData.foodType} onChange={(e) => setDonationData({ ...donationData, foodType: e.target.value })}>
                          <option value="Cooked">Category 1: Fresh Cooked Food</option>
                          <option value="Packed">Category 2: Sealed Packaged Meals</option>
                          <option value="Bakery">Category 3: Bakery Items</option>
                          <option value="Raw">Category 4: Fruits & Vegetables</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="food-quantity">Estimated Servings / Units</label>
                        <input type="text" id="food-quantity" className="form-control" value={donationData.quantity} onChange={(e) => setDonationData({ ...donationData, quantity: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="food-packaging">Packaging Type</label>
                        <input type="text" id="food-packaging" className="form-control" value={donationData.packaging} onChange={(e) => setDonationData({ ...donationData, packaging: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="food-ready-before">Pickup Before Window</label>
                        <input type="text" id="food-ready-before" className="form-control" value={donationData.readyBefore} onChange={(e) => setDonationData({ ...donationData, readyBefore: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="food-address">Pickup Address</label>
                      <input type="text" id="food-address" className="form-control" value={donationData.address} onChange={(e) => setDonationData({ ...donationData, address: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="food-notes">Special Instructions & Safety Notes</label>
                      <textarea id="food-notes" className="form-control" rows="3" value={donationData.notes} onChange={(e) => setDonationData({ ...donationData, notes: e.target.value })}></textarea>
                    </div>

                    <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={triggerAiScanner}>
                      <Shield className="w-4 h-4" /> Run Quality & Safety Scan
                    </button>
                  </form>
                </div>

                <div className="card" onMouseMove={handleCardMouseMove}>
                  <h3 style={{ marginBottom: '20px' }}><Camera className="w-5 h-5 inline-block mr-1.5" /> Food Photo</h3>
                  <div className="file-upload-wrapper">
                    <input type="file" id="food-photo" accept="image/*" onChange={handleFileUpload} />
                    <CloudUpload className="file-upload-icon mx-auto" />
                    <div className="file-upload-text">Click or Drag Photo Here</div>
                    {donationData.photo ? (
                      <img src={donationData.photo} className="file-upload-preview" style={{ display: 'block' }} alt="Uploaded Preview" onError={(e) => handleImageError(e, "🍱")} />
                    ) : (
                      <img src={donationData.photoName} className="file-upload-preview" style={{ display: 'block' }} alt="Preset Preview" onError={(e) => handleImageError(e, "🍱")} />
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Safety Scan with Interactive Temp slider */}
            {donateStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 16 }} className="ai-analysis-container">
                <div className="ai-scan-box">
                  {donationData.photo ? (
                    <img src={donationData.photo} alt="Food Scanning" onError={(e) => handleImageError(e, "🔍")} />
                  ) : (
                    <img src={donationData.photoName} alt="Food Scanning" onError={(e) => handleImageError(e, "🔍")} />
                  )}
                  {isScanning && (
                    <div className="ai-scan-overlay">
                      <div className="ai-scan-bar"></div>
                    </div>
                  )}
                </div>

                {isScanning ? (
                  <div className="card" style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <div style={{ height: '20px', width: '150px', background: 'linear-gradient(90deg, #f1f4ea 25%, #e2e8f0 50%, #f1f4ea 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '4px' }}></div>
                      <div style={{ height: '20px', width: '80px', background: 'linear-gradient(90deg, #f1f4ea 25%, #e2e8f0 50%, #f1f4ea 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ height: '60px', width: '100%', background: 'linear-gradient(90deg, #f1f4ea 25%, #e2e8f0 50%, #f1f4ea 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '4px' }}></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ height: '54px', background: '#f1f4ea', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                      <div style={{ height: '54px', background: '#f1f4ea', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ height: '54px', background: '#f1f4ea', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                      <div style={{ height: '54px', background: '#f1f4ea', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f4ea', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    </div>
                    <div style={{ height: '40px', width: '100%', background: '#f1f4ea', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  </div>
                ) : (
                  <div className="card" onMouseMove={handleCardMouseMove}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                      <h3 style={{ color: 'var(--primary)' }}><CheckCircle className="w-5 h-5 inline-block mr-1.5" /> Quality Audit Report</h3>
                      <span className={`urgency-badge ${aiAnalysis.urgency.toLowerCase()}`}>{aiAnalysis.urgency} URGENCY</span>
                    </div>

                    {/* Interactive safety slider */}
                    <div className="temp-slider-container">
                      <div className="temp-slider-header">
                        <span>SIMULATED TEMPERATURE SENSOR</span>
                        <span style={{ color: 'var(--primary)' }}>{parseFloat(tempValue).toFixed(1)}°C</span>
                      </div>
                      <input 
                        type="range" 
                        min="2.0" 
                        max="75.0" 
                        step="0.5" 
                        className="temp-range-input" 
                        value={tempValue} 
                        onChange={(e) => setTempValue(parseFloat(e.target.value))}
                        disabled={isScanning}
                      />
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center', fontWeight: 600 }}>
                        Slide to simulate FSSAI safety buffers (Safe: &lt;10°C or &gt;60°C)
                      </div>
                    </div>

                    <div className="ai-stat-row">
                      <div className="ai-stat-card">
                        <div className="label">DETECTED INTEGRITY</div>
                        <div className="value" style={{ fontSize: '13px' }}>{aiAnalysis.detected}</div>
                      </div>
                      <div className="ai-stat-card">
                        <div className="label">CONFIDENCE LEVEL</div>
                        <div className="value">{aiAnalysis.confidence}</div>
                      </div>
                    </div>

                    <div className="ai-stat-row">
                      <div className="ai-stat-card">
                        <div className="label">ESTIMATED SERVINGS</div>
                        <div className="value">{aiAnalysis.estimatedMeals}</div>
                      </div>
                      <div className="ai-stat-card">
                        <div className="label">CALCULATED SHELF LIFE</div>
                        <div className="value">{aiAnalysis.shelfLife}</div>
                      </div>
                    </div>

                    <div className="countdown-wrapper">
                      <div className="countdown-circle">
                        <div className="countdown-content">
                          <div className="countdown-time">{countdownTime}</div>
                          <div className="countdown-label">Mins Left</div>
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} disabled={isScanning} onClick={() => setDonateStep(3)}>
                      <ArrowRight className="w-4 h-4" /> Find Optimal Matching NGO
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Matcher */}
            {donateStep === 3 && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 16 }} className="matching-container">
                <div>
                  <h3 style={{ marginBottom: '20px' }}><i className="fas fa-list-ol"></i> Matching Shelters</h3>
                  <motion.div id="ngo-matches-list" variants={LIST_CONTAINER_VARIANTS} initial="hidden" animate="show">
                    {ngoMatches.map((candidate) => (
                      <motion.div 
                        key={candidate.id} 
                        variants={LIST_ITEM_VARIANTS}
                        className={`match-card ${selectedNgo?.id === candidate.id ? 'selected' : ''} ${candidate.recommended ? 'recommended' : ''}`}
                        onClick={() => setSelectedNgo(candidate)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="match-header">
                          <span className="match-name">{candidate.name}</span>
                          {candidate.recommended && <span className="status-pill approved" style={{ fontSize: '9px' }}>Recommended Match</span>}
                        </div>
                        <div className="match-meta">
                          <span><b>Distance:</b> {candidate.distance}</span>
                          <span><b>Capacity:</b> {candidate.capacity}</span>
                          <span><b>Storage:</b> {candidate.storage.split(' ')[0]}</span>
                        </div>
                        <div className="match-reason">{candidate.reason}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }} disabled={!selectedNgo} onClick={startRouteSimulation}>
                    <Bike className="w-4 h-4" /> Dispatch Route & Assign Volunteer
                  </button>
                </div>

                <div className="card hero-graphics" style={{ height: '450px' }}>
                  <div className="city-map-container">
                    <svg className="city-map-svg">
                      <path d="M -50 350 Q 150 380 450 320 L 500 500 L -50 500 Z" fill="#e0ffab" opacity="0.2"/>
                      <circle cx="120" cy="120" r="6" fill="#d9534f" />
                      <text x="135" y="125" fontSize="12" fontWeight="bold" fill="#203727">Radisson Blu (Donor)</text>
                      
                      <circle cx="340" cy="320" r="6" fill="#203727" />
                      <text x="210" y="340" fontSize="12" fill="#516e5a">MCF Night Shelter</text>
                      
                      <circle cx="200" cy="180" r="6" fill="#516e5a" />
                      
                      {selectedNgo?.id === 'ngo-mcf' && (
                        <line x1="120" y1="120" x2="340" y2="320" stroke="#203727" strokeWidth="3" strokeDasharray="6 4" />
                      )}
                      {selectedNgo?.id?.includes('ngo-custom') && (
                        <line x1="120" y1="120" x2="220" y2="280" stroke="#203727" strokeWidth="3" strokeDasharray="6 4" />
                      )}
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Live Delivery Telemetry */}
            {donateStep === 4 && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 16 }} className="live-route-grid">
                <div className="card hero-graphics" style={{ height: '420px' }}>
                  <div className="city-map-container">
                    <svg className="city-map-svg">
                      <path d="M 120 120 Q 250 200 350 320" fill="none" stroke="rgba(32, 55, 39, 0.16)" strokeWidth="4" />
                      <path 
                        d="M 120 120 Q 250 200 350 320" 
                        fill="none" 
                        stroke="#203727" 
                        strokeWidth="4" 
                        strokeDasharray="440" 
                        strokeDashoffset={440 - (440 * routeProgress) / 100}
                      />
                    </svg>
                    
                    <div className="map-node donor" style={{ left: '120px', top: '120px' }}></div>
                    <div className="map-node ngo" style={{ left: '350px', top: '320px' }}></div>
                    
                    <div 
                      className="absolute z-20 transition-all duration-100 ease-linear"
                      style={{ 
                        left: `${120 + (350 - 120) * routeProgress / 100}px`,
                        top: `${120 + (320 - 120) * routeProgress / 100}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                        <Bike className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tracker-status-panel">
                  <div className="card eta-card" onMouseMove={handleCardMouseMove}>
                    <h3>ESTIMATED ARRIVAL</h3>
                    <div className="eta-time">{Math.max(0, Math.ceil(12 - (12 * routeProgress) / 100))} Mins</div>
                    <div style={{ fontSize: '12px' }}>Volunteer Courier: <b>Rahul Sharma</b> (Level 12 Rescue)</div>
                  </div>

                  <div className="card" onMouseMove={handleCardMouseMove}>
                    <h3 style={{ marginBottom: '15px' }}><Shield className="w-4.5 h-4.5 inline mr-1" /> Telemetry checkpoints</h3>
                    <div className="status-step-list">
                      <div className={`status-step ${routeStep >= 1 ? 'completed' : 'active'}`}>
                        <div className="status-step-dot"></div>
                        <span><b>Pickup completed</b> - Temperature verified at {parseFloat(tempValue).toFixed(1)}°C</span>
                      </div>
                      <div className={`status-step ${routeStep >= 2 ? 'completed' : routeStep === 1 ? 'active' : ''}`}>
                        <div className="status-step-dot"></div>
                        <span><b>Logistics Transit</b> - Route tracking verified active</span>
                      </div>
                      <div className={`status-step ${routeStep >= 3 ? 'completed' : routeStep === 2 ? 'active' : ''}`}>
                        <div className="status-step-dot"></div>
                        <span><b>Approaching Shelter</b> - Safe window audit compliance green</span>
                      </div>
                      <div className={`status-step ${routeStep >= 4 ? 'completed' : routeStep === 3 ? 'active' : ''}`}>
                        <div className="status-step-dot"></div>
                        <span><b>Delivered & Handover</b> - QR Code signature audit pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* QR verification modal overlay */}
            {showQrModal && (
              <div className="modal-overlay">
                <div className="modal-card" style={{ animation: 'pageFadeIn 0.3s ease' }}>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-2 border-emerald-800">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 style={{ color: 'var(--primary)' }}>Arrived at Shelter!</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Scan the receiver shelter's digital FSSAI ledger signature key to finalize the surplus rescue protocol.</p>
                  
                  <div className="w-40 h-40 border border-emerald-800 rounded mx-auto mb-6 p-2 flex items-center justify-center bg-white">
                    <i className="fas fa-qrcode" style={{ fontSize: '120px', color: 'var(--primary)' }}></i>
                  </div>

                  <div className="bg-emerald-50 text-left p-3 rounded mb-6 border border-emerald-200" style={{ fontSize: '12px' }}>
                    <p><b>Recipient:</b> MCF Night Shelter (Rain Basera)</p>
                    <p><b>Rescued quantity:</b> {donationData.quantity} servings</p>
                    <p><b>Carbon Saved:</b> {(parseInt(donationData.quantity) * 0.5).toFixed(1)} kg CO₂ Equivalent</p>
                  </div>

                  <button className="btn btn-primary w-full" onClick={completeRescueAndNavigate}>
                    Verify Handover & Finalize
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== WIZARD 2: SUPERVISOR CONTROL PANEL OVERLAY ==================== */}
      {showAdminFlow && (
        <div className="app-flow-overlay">
          <div className="app-flow-header">
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>Supervisor Registry Console</span>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAdminFlow(false)}>Close Portal</button>
          </div>

          <div className="app-flow-container">
            {!adminLoggedIn ? (
              <div style={{ maxWidth: '440px', margin: '60px auto' }}>
                <div className="card" onMouseMove={handleCardMouseMove}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Lock className="w-10 h-10 mx-auto text-emerald-800 mb-3" />
                    <h2>Supervisor Sign In</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Access regional compliance records</p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                      <label htmlFor="admin-email">Admin Email ID</label>
                      <input type="email" id="admin-email" className="form-control" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label htmlFor="admin-password">Security Key</label>
                      <input type="password" id="admin-password" className="form-control" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
                    </div>

                    {adminLoading && (
                      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-800" />
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Verifying compliance key...</p>
                      </div>
                    )}

                    <button type="button" className="btn btn-primary w-full" onClick={handleAdminSignIn} disabled={adminLoading}>
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div>
                <div className="impact-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Active Donors</h4>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                      {donors.filter(d => d.status === 'approved').length}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Active NGOs</h4>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--secondary-dark)', marginTop: '4px' }}>
                      {ngos.filter(n => n.status === 'approved').length}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Pending Audits</h4>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
                      {donors.filter(d => d.status === 'pending').length + ngos.filter(n => n.status === 'pending').length}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>FSSAI Status</h4>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>Normal</div>
                  </div>
                </div>

                <div className="card" onMouseMove={handleCardMouseMove}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div className="register-toggle-group" style={{ display: 'flex', gap: '8px' }}>
                      <button className={`btn btn-sm ${adminTab === 'donors' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setAdminTab('donors')}>Donors Database</button>
                      <button className={`btn btn-sm ${adminTab === 'ngos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setAdminTab('ngos')}>NGO Partners</button>
                      <button className={`btn btn-sm ${adminTab === 'rescues' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setAdminTab('rescues')}>Food Rescues Log</button>
                    </div>
                  </div>

                  {adminTab === 'donors' && (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Donor Name</th>
                            <th>Category</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>FSSAI Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donors.map(donor => (
                            <tr key={donor.id}>
                              <td><b>{donor.id}</b></td>
                              <td>{donor.name}</td>
                              <td>{donor.type}</td>
                              <td>{donor.phone}</td>
                              <td>{donor.address}</td>
                              <td>
                                <span className={`status-pill ${donor.status === 'approved' ? 'approved' : 'pending'}`}>
                                  {donor.status === 'approved' ? 'Approved' : 'Pending'}
                                </span>
                              </td>
                              <td>
                                {donor.status === 'pending' ? (
                                  <button className="btn btn-secondary btn-sm" onClick={() => verifyDonor(donor.id)}>Verify License</button>
                                ) : (
                                  <span style={{ fontSize: '12px', fontWeight: 600 }}><CheckCircle className="w-4 h-4 text-emerald-800 inline mr-1" /> Active</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {adminTab === 'ngos' && (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Shelter / NGO Name</th>
                            <th>Type</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Daily Demand</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ngos.map(ngo => (
                            <tr key={ngo.id}>
                              <td><b>{ngo.id}</b></td>
                              <td>{ngo.name}</td>
                              <td>{ngo.type}</td>
                              <td>{ngo.phone}</td>
                              <td>{ngo.address}</td>
                              <td>{ngo.demand}</td>
                              <td>
                                <span className={`status-pill ${ngo.status === 'approved' ? 'approved' : 'pending'}`}>
                                  {ngo.status === 'approved' ? 'Active' : 'Pending'}
                                </span>
                              </td>
                              <td>
                                {ngo.status === 'pending' ? (
                                  <button className="btn btn-secondary btn-sm" onClick={() => verifyNgo(ngo.id)}>Approve & Match</button>
                                ) : (
                                  <span style={{ fontSize: '12px', fontWeight: 600 }}><CheckCircle className="w-4 h-4 text-emerald-800 inline mr-1" /> Activated</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {adminTab === 'rescues' && (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Rescue ID</th>
                            <th>Donor Source</th>
                            <th>Shelter Destination</th>
                            <th>Courier</th>
                            <th>Servings</th>
                            <th>Temperature</th>
                            <th>Rescue Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rescues.map(rsc => (
                            <tr key={rsc.id}>
                              <td><b>{rsc.id}</b></td>
                              <td>{rsc.donor}</td>
                              <td>{rsc.ngo}</td>
                              <td>{rsc.volunteer}</td>
                              <td>{rsc.quantity}</td>
                              <td><span style={{ color: 'var(--primary)', fontWeight: 700 }}>{rsc.temp}</span></td>
                              <td>
                                <span className={`status-pill ${rsc.status === 'active-rescue' ? 'active-rescue' : 'approved'}`}>
                                  {rsc.status === 'active-rescue' ? 'In Transit' : 'Delivered'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== WIZARD 3: NGO PORTAL CONSOLE OVERLAY ==================== */}
      {showNgoFlow && (
        <div className="app-flow-overlay">
          <div className="app-flow-header">
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>Shelter / NGO Hub</span>
            <button className="btn btn-outline btn-sm" onClick={() => setShowNgoFlow(false)}>Close Console</button>
          </div>

          <div className="app-flow-container">
            <div className="portal-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" onMouseMove={handleCardMouseMove} style={{ padding: '0px', overflow: 'hidden' }}>
                  <div style={{ height: '140px', position: 'relative' }}>
                    <img 
                      src="/about_shelter.jpg" 
                      alt="Shelter Kitchen" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => handleImageError(e, "🏠")}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ margin: 0 }}>{selectedNgo ? selectedNgo.name : 'MCF Night Shelter'} Profile</h3>
                    <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <p><b>Establishment Type:</b> {selectedNgo ? selectedNgo.type : 'Night Shelter'}</p>
                    <p><b>Location Zone:</b> {selectedNgo ? selectedNgo.address : 'Sector 15, Faridabad'}</p>
                    <p><b>Verification Status:</b> FSSAI Licensed</p>
                    <p><b>Daily Target Intake:</b> {selectedNgo ? selectedNgo.capacity || selectedNgo.demand : '72 servings'}</p>
                    <p><b>Storage Infrastructure:</b> {selectedNgo ? selectedNgo.storage : 'Hot Holding Cabinet'}</p>
                    </div>
                  </div>
                </div>

                <div className="card" onMouseMove={handleCardMouseMove}>
                  <h3>Current Stocks</h3>
                  <div style={{ height: '180px', marginTop: '15px' }}>
                    <Bar 
                      data={{
                        labels: ['Rice', 'Dal', 'Curry', 'Chapati', 'Breads', 'Fruits'],
                        datasets: [{
                          label: 'Stocks (units)',
                          data: [42, 28, 15, 80, 24, 60],
                          backgroundColor: '#516e5a',
                          borderRadius: 4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { borderDash: [4, 4], color: 'rgba(32, 55, 39, 0.08)' } },
                          x: { grid: { display: false } }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="card" onMouseMove={handleCardMouseMove}>
                <h3>Recent Rescue Inflows</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Donor Source</th>
                        <th>Courier</th>
                        <th>Dishes Rescued</th>
                        <th>FSSAI Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1 hour ago</td>
                        <td>Radisson Blu Hotel</td>
                        <td>Rahul Sharma</td>
                        <td>45 Servings (Paneer Butter Masala)</td>
                        <td><span className="status-pill approved" style={{ fontSize: '9px' }}>Safe Audit Logged</span></td>
                      </tr>
                      <tr>
                        <td>Yesterday</td>
                        <td>Bakehouse Cafe</td>
                        <td>Amit Arora</td>
                        <td>30 Croissants & Sweet Buns</td>
                        <td><span className="status-pill approved" style={{ fontSize: '9px' }}>Safe Audit Logged</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WIZARD 4: VOLUNTEER REGISTRY CONSOLE OVERLAY ==================== */}
      {showVolunteerFlow && (
        <div className="app-flow-overlay">
          <div className="app-flow-header">
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>Volunteer central</span>
            <button className="btn btn-outline btn-sm" onClick={() => setShowVolunteerFlow(false)}>Close Hub</button>
          </div>

          <div className="app-flow-container">
            <div className="portal-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" onMouseMove={handleCardMouseMove}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-lg font-bold">RS</div>
                    <div>
                      <h4>Rahul Sharma</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Level 12 Dispatcher</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', fontSize: '13px', lineHeight: '1.6' }}>
                    <p><b>Points Balance:</b> 1,820 XP</p>
                    <p><b>Zone:</b> Central Faridabad</p>
                  </div>
                </div>

                <div className="card" onMouseMove={handleCardMouseMove}>
                  <h3 style={{ fontSize: '15px', marginBottom: '12px' }}><Award className="w-4.5 h-4.5 inline mr-1" /> Rescue Badges</h3>
                  <div className="badge-grid">
                    <div className="badge-item" title="Rescued food late at night">
                      <div className="badge-icon" style={{ color: '#6366f1' }}><i className="fas fa-moon"></i></div>
                      <div className="badge-name">Night Owl</div>
                    </div>
                    <div className="badge-item" title="Completed 100+ deliveries">
                      <div className="badge-icon" style={{ color: '#f59e0b' }}><i className="fas fa-award"></i></div>
                      <div className="badge-name">Centurion</div>
                    </div>
                    <div className="badge-item" title="Safety compliance certified">
                      <div className="badge-icon" style={{ color: '#10b981' }}><i className="fas fa-shield-alt"></i></div>
                      <div className="badge-name">Safety First</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" onMouseMove={handleCardMouseMove}>
                  <h3>Pending Pickups Near You</h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Donor Source</th>
                          <th>Distance</th>
                          <th>Items</th>
                          <th>XP Weight</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><b>Bakehouse Cafe</b></td>
                          <td>1.2 km</td>
                          <td>30 bakery boxes</td>
                          <td>+25 XP</td>
                          <td><button className="btn btn-secondary btn-sm" onClick={() => triggerToast('Pickup accepted! Logistics details loaded.')}>Accept</button></td>
                        </tr>
                        <tr>
                          <td><b>Sector 16 Temple</b></td>
                          <td>2.8 km</td>
                          <td>80 Servings (Khichdi)</td>
                          <td>+45 XP</td>
                          <td><button className="btn btn-secondary btn-sm" onClick={() => triggerToast('Pickup accepted! Logistics details loaded.')}>Accept</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card" onMouseMove={handleCardMouseMove}>
                  <h3>XP Points History</h3>
                  <div style={{ height: '160px', marginTop: '10px' }}>
                    <Line 
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                          label: 'XP Earned',
                          data: [80, 150, 90, 240, 120, 310, 420],
                          borderColor: '#203727',
                          backgroundColor: 'rgba(224, 255, 171, 0.15)',
                          fill: true,
                          tension: 0.3,
                          borderWidth: 3
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { borderDash: [4, 4], color: 'rgba(32, 55, 39, 0.08)' } },
                          x: { grid: { display: false } }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WIZARD 5: NETWORK REGISTRATION FLOW OVERLAY ==================== */}
      {showRegisterFlow && (
        <div className="app-flow-overlay">
          <div className="app-flow-header">
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>Registry Hub</span>
            <button className="btn btn-outline btn-sm" onClick={() => setShowRegisterFlow(false)}>Close Portal</button>
          </div>

          <div className="app-flow-container">
            <div id="registration-card" className="card" onMouseMove={handleCardMouseMove} style={{ maxWidth: '640px', margin: '0 auto' }}>
              {!regSuccess ? (
                <>
                  <div className="register-toggle-group" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button 
                      type="button" 
                      className={`btn ${regRole === 'donor' ? 'btn-primary' : 'btn-outline'} flex-grow`}
                      onClick={() => setRegRole('donor')}
                    >
                      Surplus Food Donor
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${regRole === 'ngo' ? 'btn-primary' : 'btn-outline'} flex-grow`}
                      onClick={() => setRegRole('ngo')}
                    >
                      NGO / Recipient Shelter
                    </button>
                  </div>

                  <form onSubmit={handleRegisterSubmit}>
                    <div className="form-group">
                      <label htmlFor="reg-org-name">Establishment / Org Name</label>
                      <input 
                        type="text" 
                        id="reg-org-name" 
                        className="form-control" 
                        placeholder={regRole === 'donor' ? 'e.g. Radisson Blu Hotel' : 'e.g. MCF Night Shelter'} 
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        required
                      />
                    </div>

                    {regRole === 'donor' ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="reg-donor-type">Establishment Category</label>
                          <select id="reg-donor-type" className="form-control">
                            <option value="Hotel">Hotel</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Hospital">Hospital Kitchen</option>
                            <option value="Corporate">Corporate Cafeteria</option>
                            <option value="Banquet">Banquet Hall / Caterer</option>
                            <option value="Mandi">Mandi Wholesaler</option>
                          </select>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="reg-donor-contact">Contact Person</label>
                            <input type="text" id="reg-donor-contact" className="form-control" placeholder="Full Name" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="reg-donor-phone">Contact Phone</label>
                            <input type="tel" id="reg-donor-phone" className="form-control" placeholder="10-digit number" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="reg-donor-address">Pickup Location Address</label>
                          <input type="text" id="reg-donor-address" className="form-control" placeholder="Complete address in Faridabad" />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="reg-donor-fssai">FSSAI License Key (If active)</label>
                            <input type="text" id="reg-donor-fssai" className="form-control" placeholder="14-digit license number" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="reg-donor-est">Est. Daily Surplus (servings)</label>
                            <input type="number" id="reg-donor-est" className="form-control" placeholder="e.g. 50" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="reg-ngo-type">Shelter Category</label>
                          <select id="reg-ngo-type" className="form-control">
                            <option value="Night Shelter">Rain Basera (Night Shelter)</option>
                            <option value="Orphanage">Orphanage</option>
                            <option value="Migrant Camp">Migrant Labor Camp</option>
                            <option value="Community Kitchen">Sewa Kitchen</option>
                          </select>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="reg-ngo-contact">Contact Person</label>
                            <input type="text" id="reg-ngo-contact" className="form-control" placeholder="Full Name" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="reg-ngo-phone">Contact Phone</label>
                            <input type="tel" id="reg-ngo-phone" className="form-control" placeholder="10-digit number" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="reg-ngo-address">Delivery Address</label>
                          <input type="text" id="reg-ngo-address" className="form-control" placeholder="Complete address in Faridabad" />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="reg-ngo-storage">Infrastructure Storage</label>
                            <select id="reg-ngo-storage" className="form-control">
                              <option value="None">None (Immediate Redistribution)</option>
                              <option value="Fridge">Commercial Refrigerator</option>
                              <option value="HotCabinet">Hot-Holding Cabinets</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="reg-ngo-demand">Est. Daily Needs (servings)</label>
                            <input type="number" id="reg-ngo-demand" className="form-control" placeholder="e.g. 100" />
                          </div>
                        </div>
                      </>
                    )}

                    <button type="submit" className="btn btn-primary w-full mt-4">
                      Submit Registration
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-2 border-emerald-800">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 style={{ color: 'var(--primary)' }}>Registration Filed!</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Your registry has been saved to the database. Once verified by the supervisor, your node will activate.</p>
                  
                  <div className="bg-emerald-50 text-left p-4 rounded mb-6 border border-emerald-200" style={{ fontSize: '13px' }}>
                    <p><b>Organization:</b> {regOrgName || (regRole === 'donor' ? 'Surplus Kitchen Ltd' : 'MCF Hope Centre')}</p>
                    <p><b>Reference ID:</b> <code style={{ fontWeight: 800 }}>{regSuccess}</code></p>
                    <p><b>Verification Queue:</b> Pending Supervisor Audit</p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary flex-grow" onClick={() => { setRegSuccess(null); setRegOrgName(''); setShowRegisterFlow(false); setShowAdminFlow(true); setAdminLoggedIn(false); }}>
                      Login to Supervisor Panel
                    </button>
                    <button className="btn btn-outline flex-grow" onClick={() => setShowRegisterFlow(false)}>
                      Return to Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animated Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="action-toast"
          >
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
