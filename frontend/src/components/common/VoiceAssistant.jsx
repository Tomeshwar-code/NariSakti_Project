// import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaMicrophone, FaMicrophoneSlash, FaRobot } from 'react-icons/fa';
// import './VoiceAssistant.css';

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const hasSpeechRecognition = Boolean(SpeechRecognition);

// const speakText = (text) => {
//   if (!window.speechSynthesis) return;
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = 'en-IN';
//   window.speechSynthesis.cancel();
//   window.speechSynthesis.speak(utterance);
// };

// const commandHandlers = {
//   search: (query, navigate) => {
//     const trimmed = query.trim();
//     if (!trimmed) {
//       speakText('Please say the product name or phrase after search.');
//       return;
//     }
//     speakText(`Searching for ${trimmed}`);
//     navigate(`/products?q=${encodeURIComponent(trimmed)}`);
//   },
//   route: (target, navigate) => {
//     const normalized = target.toLowerCase().trim();
//     const routeMap = {
//       home: '/',
//       dashboard: '/seller/dashboard',
//       'seller dashboard': '/seller/dashboard',
//       'admin dashboard': '/admin',
//       cart: '/cart',
//       profile: '/profile',
//       register: '/register',
//       login: '/login',
//       orders: '/orders',
//       products: '/products',
//     };

//     const path = routeMap[normalized] || null;
//     if (path) {
//       speakText(`Opening ${normalized}`);
//       navigate(path);
//     } else {
//       speakText(`I am not sure how to open ${normalized}. Try a different command.`);
//     }
//   },
// };

// const VoiceAssistant = () => {
//   const navigate = useNavigate();
//   const recognitionRef = useRef(null);
//   const [status, setStatus] = useState('Tap mic to speak');
//   const [listening, setListening] = useState(false);
//   const [supported, setSupported] = useState(true);

//   useEffect(() => {
//     if (!hasSpeechRecognition) {
//       setSupported(false);
//       setStatus('Voice assistant not supported in this browser');
//     }
//   }, []);

//   const handleResult = (transcript) => {
//     const text = transcript.toLowerCase().trim();

//     if (/^(search|find) (for )?(.+)/i.test(text)) {
//       const query = text.replace(/^(search|find)( for)?\s+/i, '');
//       commandHandlers.search(query, navigate);
//       setStatus(`Searching for “${query}”`);
//       return;
//     }

//     if (/^(go to|open|show|take me to) (.+)/i.test(text)) {
//       const target = text.replace(/^(go to|open|show|take me to)\s+/i, '');
//       commandHandlers.route(target, navigate);
//       setStatus(`Opening ${target}`);
//       return;
//     }

//     if (/help|what can you do|commands/i.test(text)) {
//       const message = 'You can say: search for mango pickles, open cart, go to profile, or show orders.';
//       speakText(message);
//       setStatus('Voice assistant help shown');
//       return;
//     }

//     speakText('Sorry, I did not understand that command. Try search for products or open cart.');
//     setStatus('Command not recognized. Try again.');
//   };

//   const startListening = () => {
//     if (!supported) {
//       return;
//     }

//     if (listening) {
//       recognitionRef.current?.stop();
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-IN';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       setListening(true);
//       setStatus('Listening... speak now');
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       handleResult(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setStatus('Voice recognition error. Try again.');
//       setListening(false);
//     };

//     recognition.onend = () => {
//       setListening(false);
//       if (status === 'Listening... speak now') {
//         setStatus('Tap mic to speak');
//       }
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   return (
//     <div className="voice-assistant">
//       <button
//         type="button"
//         className={`voice-assistant__button ${listening ? 'listening' : ''}`}
//         onClick={startListening}
//         aria-label="Toggle voice assistant"
//       >
//         {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
//       </button>
//       <div className="voice-assistant__status">
//         <FaRobot className="voice-assistant__icon" />
//         <span>{status}</span>
//       </div>
//     </div>
//   );
// };

// export default VoiceAssistant;
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaRobot, 
  FaTimes, 
  FaHistory, 
  FaStar, 
  FaRegStar,
  FaCog,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBox,
  FaHeart,
  FaClipboardList,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCheck,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';
import './VoiceAssistant.css';

// ========== SPEECH RECOGNITION SETUP ==========
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSpeechRecognition = Boolean(SpeechRecognition);

// ========== SPEAK FUNCTION ==========
const speakText = (text, language = 'en-IN') => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

// ========== MAIN COMPONENT ==========
const VoiceAssistant = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  
  // ===== STATES =====
  const [status, setStatus] = useState('Tap mic to speak');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [context, setContext] = useState({
    currentPage: 'home',
    lastProduct: null,
    cartCount: 0,
    wishlistCount: 0
  });
  const [settings, setSettings] = useState({
    language: 'en-IN',
    voiceType: 'female',
    speed: 1,
    pitch: 1,
    autoListen: false,
    persistentMode: false,
    hapticFeedback: true,
    showSuggestions: true
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // ===== CHECK SUPPORT =====
  useEffect(() => {
    if (!hasSpeechRecognition) {
      setSupported(false);
      setStatus('Voice assistant not supported in this browser');
    }
  }, []);

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        startListening();
      }
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        setShowMenu(!showMenu);
      }
      if (e.key === 'Escape') {
        setShowMenu(false);
        setShowSettings(false);
        setShowHistory(false);
        setShowCommands(false);
        setShowSuggestions(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showMenu]);

  // ===== UPDATE CONTEXT =====
  useEffect(() => {
    // Update cart count from localStorage or context
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setContext(prev => ({
      ...prev,
      cartCount: cart.length
    }));
  }, []);

  // ===== COMMAND HANDLERS =====
  const commandHandlers = {
    // ===== SEARCH COMMANDS =====
    search: (query) => {
      const trimmed = query.trim();
      if (!trimmed) {
        speakText('Please say the product name after search.');
        setStatus('Please say a product name');
        return;
      }
      speakText(`Searching for ${trimmed}`);
      setStatus(`Searching for "${trimmed}"`);
      navigate(`/products?q=${encodeURIComponent(trimmed)}`);
      saveToHistory(`Search for "${trimmed}"`, 'Search');
    },

    // ===== NAVIGATION COMMANDS =====
    route: (target) => {
      const normalized = target.toLowerCase().trim();
      const routeMap = {
        home: '/',
        dashboard: '/seller/dashboard',
        'seller dashboard': '/seller/dashboard',
        'admin dashboard': '/admin',
        cart: '/cart',
        profile: '/profile',
        register: '/register',
        login: '/login',
        orders: '/orders',
        products: '/products',
        wishlist: '/wishlist',
        checkout: '/checkout',
        'track order': '/track-order',
        'seller register': '/seller-register',
        'seller guide': '/seller-guide',
        about: '/about',
        contact: '/contact',
        blog: '/blog',
        faq: '/faq',
        'gift cards': '/gift-cards'
      };

      const path = routeMap[normalized];
      if (path) {
        speakText(`Opening ${normalized}`);
        setStatus(`Opening ${normalized}`);
        navigate(path);
        saveToHistory(`Go to ${normalized}`, 'Navigation');
      } else {
        const message = `I'm not sure how to open ${normalized}. Try a different command.`;
        speakText(message);
        setStatus(`Don't know how to open "${normalized}"`);
      }
    },

    // ===== CART COMMANDS =====
    cart: {
      add: (product, quantity = 1) => {
        const productName = product || 'product';
        speakText(`Adding ${quantity} ${productName} to cart`);
        setStatus(`Added ${productName} to cart`);
        // Add to cart logic
        saveToHistory(`Add ${productName} to cart`, 'Cart');
      },
      remove: (product) => {
        const productName = product || 'item';
        speakText(`Removing ${productName} from cart`);
        setStatus(`Removed ${productName} from cart`);
        saveToHistory(`Remove ${productName} from cart`, 'Cart');
      },
      clear: () => {
        speakText('Clearing your cart');
        setStatus('Cart cleared');
        saveToHistory('Clear cart', 'Cart');
      },
      view: () => {
        navigate('/cart');
        saveToHistory('View cart', 'Navigation');
      },
      checkout: () => {
        navigate('/checkout');
        speakText('Proceeding to checkout');
        setStatus('Opening checkout');
        saveToHistory('Checkout', 'Navigation');
      }
    },

    // ===== ORDER COMMANDS =====
    order: {
      track: (orderId) => {
        if (orderId) {
          navigate(`/orders/track/${orderId}`);
          speakText(`Tracking order ${orderId}`);
          saveToHistory(`Track order ${orderId}`, 'Orders');
        } else {
          speakText('Please say your order number');
          setStatus('Please provide order number');
        }
      },
      cancel: (orderId) => {
        speakText(`Cancelling order ${orderId}`);
        setStatus(`Order ${orderId} cancelled`);
        saveToHistory(`Cancel order ${orderId}`, 'Orders');
      },
      reorder: (orderId) => {
        speakText(`Reordering items from order ${orderId}`);
        setStatus(`Reordering ${orderId}`);
        saveToHistory(`Reorder ${orderId}`, 'Orders');
      },
      history: () => {
        navigate('/orders');
        speakText('Showing your order history');
        saveToHistory('View order history', 'Navigation');
      }
    },

    // ===== FILTER COMMANDS =====
    filter: {
      apply: (type, value) => {
        const filterMap = {
          price: 'Price',
          category: 'Category',
          rating: 'Rating',
          brand: 'Brand',
          color: 'Color',
          size: 'Size'
        };
        const filterType = filterMap[type] || type;
        speakText(`Applying ${filterType} filter: ${value}`);
        setStatus(`Filter: ${filterType} - ${value}`);
        saveToHistory(`Apply filter ${type} ${value}`, 'Filter');
      },
      clear: () => {
        speakText('Clearing all filters');
        setStatus('Filters cleared');
        saveToHistory('Clear filters', 'Filter');
      },
      sort: (criteria) => {
        const sortOptions = {
          'price low to high': 'Price: Low to High',
          'price high to low': 'Price: High to Low',
          'newest': 'Newest First',
          'popular': 'Most Popular',
          'rating': 'Highest Rated'
        };
        const sortText = sortOptions[criteria] || criteria;
        speakText(`Sorting by ${sortText}`);
        setStatus(`Sorted by ${sortText}`);
        saveToHistory(`Sort by ${criteria}`, 'Filter');
      }
    },

    // ===== WISHLIST COMMANDS =====
    wishlist: {
      add: (product) => {
        const productName = product || 'product';
        speakText(`Adding ${productName} to wishlist`);
        setStatus(`Added ${productName} to wishlist`);
        saveToHistory(`Add ${productName} to wishlist`, 'Wishlist');
      },
      view: () => {
        navigate('/wishlist');
        speakText('Showing your wishlist');
        saveToHistory('View wishlist', 'Navigation');
      }
    },

    // ===== SELLER COMMANDS =====
    seller: {
      dashboard: () => {
        navigate('/seller/dashboard');
        speakText('Opening seller dashboard');
        saveToHistory('Open seller dashboard', 'Navigation');
      },
      orders: () => {
        navigate('/seller/orders');
        speakText('Showing seller orders');
        saveToHistory('View seller orders', 'Navigation');
      },
      addProduct: () => {
        navigate('/seller/add-product');
        speakText('Opening add product page');
        saveToHistory('Add new product', 'Navigation');
      },
      earnings: () => {
        navigate('/seller/earnings');
        speakText('Showing your earnings');
        saveToHistory('View earnings', 'Navigation');
      }
    },

    // ===== HELP COMMANDS =====
    help: () => {
      const message = `Here are some commands you can try: 
        Search for [product name], 
        Go to [page name], 
        Add [product] to cart, 
        Show my orders, 
        Open wishlist, 
        Apply filter [type] [value], 
        Sort by [criteria],
        Clear cart,
        Checkout,
        Add to wishlist,
        Open seller dashboard,
        Track order,
        What can you do,
        Say settings to change preferences`;
      speakText(message);
      setStatus('Help shown - check the menu for commands');
      saveToHistory('Help', 'System');
      setShowCommands(true);
    },

    // ===== SETTINGS COMMANDS =====
    settings: {
      open: () => {
        setShowSettings(true);
        speakText('Opening voice assistant settings');
        setStatus('Settings opened');
        saveToHistory('Open settings', 'System');
      },
      changeLanguage: (lang) => {
        const languages = {
          hindi: 'hi-IN',
          tamil: 'ta-IN',
          telugu: 'te-IN',
          bengali: 'bn-IN',
          english: 'en-IN',
          'english us': 'en-US'
        };
        const languageCode = languages[lang] || 'en-IN';
        setSettings(prev => ({ ...prev, language: languageCode }));
        speakText(`Language changed to ${lang}`, languageCode);
        setStatus(`Language: ${lang}`);
        saveToHistory(`Change language to ${lang}`, 'Settings');
      },
      changeVoice: (type) => {
        setSettings(prev => ({ ...prev, voiceType: type }));
        speakText(`Voice type changed to ${type}`);
        setStatus(`Voice: ${type}`);
        saveToHistory(`Change voice to ${type}`, 'Settings');
      }
    },

    // ===== SYSTEM COMMANDS =====
    system: {
      status: () => {
        const statusMsg = `I'm ${listening ? 'listening' : 'ready'}. ${status}`;
        speakText(statusMsg);
        setStatus(`Status: ${listening ? 'Listening' : 'Ready'}`);
      },
      clearHistory: () => {
        setHistory([]);
        speakText('Command history cleared');
        setStatus('History cleared');
        saveToHistory('Clear history', 'System');
      },
      saveFavorites: () => {
        if (favorites.length === 0) {
          speakText('You have no saved favorites');
          return;
        }
        speakText(`You have ${favorites.length} favorite commands saved`);
        setStatus(`${favorites.length} favorites saved`);
      }
    }
  };

  // ===== PROCESS COMMAND =====
  const handleCommand = (text) => {
    const input = text.toLowerCase().trim();
    setIsProcessing(true);

    // ===== SEARCH COMMANDS =====
    if (/^(search|find|look for|show me) (for )?(.+)/i.test(input)) {
      const query = input.replace(/^(search|find|look for|show me)( for)?\s+/i, '');
      commandHandlers.search(query);
      setIsProcessing(false);
      return;
    }

    // ===== NAVIGATION COMMANDS =====
    if (/^(go to|open|show|take me to|navigate to) (.+)/i.test(input)) {
      const target = input.replace(/^(go to|open|show|take me to|navigate to)\s+/i, '');
      commandHandlers.route(target);
      setIsProcessing(false);
      return;
    }

    // ===== CART COMMANDS =====
    if (/^add (.*) to cart/i.test(input)) {
      const product = input.replace(/^add (.*) to cart/i, '$1');
      const quantity = product.match(/\d+/);
      const productName = product.replace(/\d+/, '').trim() || 'product';
      commandHandlers.cart.add(productName, quantity ? parseInt(quantity[0]) : 1);
      setIsProcessing(false);
      return;
    }

    if (/^remove (.*) from cart/i.test(input)) {
      const product = input.replace(/^remove (.*) from cart/i, '$1');
      commandHandlers.cart.remove(product || 'item');
      setIsProcessing(false);
      return;
    }

    if (/^(clear|empty) cart/i.test(input)) {
      commandHandlers.cart.clear();
      setIsProcessing(false);
      return;
    }

    if (/^(view|show) cart/i.test(input)) {
      commandHandlers.cart.view();
      setIsProcessing(false);
      return;
    }

    if (/^(checkout|proceed to checkout|buy now)/i.test(input)) {
      commandHandlers.cart.checkout();
      setIsProcessing(false);
      return;
    }

    // ===== ORDER COMMANDS =====
    if (/^track order (.*)/i.test(input)) {
      const orderId = input.replace(/^track order /i, '');
      commandHandlers.order.track(orderId);
      setIsProcessing(false);
      return;
    }

    if (/^(cancel|delete) order (.*)/i.test(input)) {
      const orderId = input.replace(/^(cancel|delete) order /i, '');
      commandHandlers.order.cancel(orderId);
      setIsProcessing(false);
      return;
    }

    if (/^reorder (.*)/i.test(input)) {
      const orderId = input.replace(/^reorder /i, '');
      commandHandlers.order.reorder(orderId);
      setIsProcessing(false);
      return;
    }

    if (/^(show|view|my) orders?/i.test(input)) {
      commandHandlers.order.history();
      setIsProcessing(false);
      return;
    }

    // ===== FILTER COMMANDS =====
    if (/^apply (price|category|rating|brand|color|size) filter (.*)/i.test(input)) {
      const [, type, value] = input.match(/^apply (price|category|rating|brand|color|size) filter (.*)/i);
      commandHandlers.filter.apply(type, value);
      setIsProcessing(false);
      return;
    }

    if (/^(clear|remove) filters?/i.test(input)) {
      commandHandlers.filter.clear();
      setIsProcessing(false);
      return;
    }

    if (/^sort by (price low to high|price high to low|newest|popular|rating)/i.test(input)) {
      const criteria = input.replace(/^sort by /i, '');
      commandHandlers.filter.sort(criteria);
      setIsProcessing(false);
      return;
    }

    // ===== WISHLIST COMMANDS =====
    if (/^add (.*) to wishlist/i.test(input)) {
      const product = input.replace(/^add (.*) to wishlist/i, '$1');
      commandHandlers.wishlist.add(product || 'product');
      setIsProcessing(false);
      return;
    }

    if (/^(view|show) wishlist/i.test(input)) {
      commandHandlers.wishlist.view();
      setIsProcessing(false);
      return;
    }

    // ===== SELLER COMMANDS =====
    if (/^(seller dashboard|dashboard)/i.test(input)) {
      commandHandlers.seller.dashboard();
      setIsProcessing(false);
      return;
    }

    if (/^(seller orders|seller order)/i.test(input)) {
      commandHandlers.seller.orders();
      setIsProcessing(false);
      return;
    }

    if (/^(add product|new product|create product)/i.test(input)) {
      commandHandlers.seller.addProduct();
      setIsProcessing(false);
      return;
    }

    if (/^(earnings|seller earnings|revenue)/i.test(input)) {
      commandHandlers.seller.earnings();
      setIsProcessing(false);
      return;
    }

    // ===== HELP COMMANDS =====
    if (/^(help|what can you do|commands|how to use|guide)/i.test(input)) {
      commandHandlers.help();
      setIsProcessing(false);
      return;
    }

    // ===== SETTINGS COMMANDS =====
    if (/^(settings|preferences|setup)/i.test(input)) {
      commandHandlers.settings.open();
      setIsProcessing(false);
      return;
    }

    if (/^change language to (hindi|tamil|telugu|bengali|english|english us)/i.test(input)) {
      const lang = input.replace(/^change language to /i, '');
      commandHandlers.settings.changeLanguage(lang);
      setIsProcessing(false);
      return;
    }

    if (/^change voice to (male|female)/i.test(input)) {
      const type = input.replace(/^change voice to /i, '');
      commandHandlers.settings.changeVoice(type);
      setIsProcessing(false);
      return;
    }

    // ===== SYSTEM COMMANDS =====
    if (/^(status|are you there|hello|hi)/i.test(input)) {
      commandHandlers.system.status();
      setIsProcessing(false);
      return;
    }

    if (/^(clear history|delete history)/i.test(input)) {
      commandHandlers.system.clearHistory();
      setIsProcessing(false);
      return;
    }

    if (/^(show|list) favorites/i.test(input)) {
      commandHandlers.system.saveFavorites();
      setIsProcessing(false);
      return;
    }

    // ===== SAVE TO FAVORITES =====
    if (/^(save|remember) this command as favorite/i.test(input)) {
      const lastCommand = history.length > 0 ? history[0].command : null;
      if (lastCommand) {
        addToFavorites(lastCommand);
        speakText('Command saved to favorites');
        setStatus('Added to favorites');
      } else {
        speakText('No recent command to save');
      }
      setIsProcessing(false);
      return;
    }

    // ===== FALLBACK =====
    const fallbackMessage = `Sorry, I didn't understand that. Say "help" for available commands.`;
    speakText(fallbackMessage);
    setStatus('Command not recognized');
    saveToHistory(input, 'Unknown');
    setIsProcessing(false);
  };

  // ===== SAVE TO HISTORY =====
  const saveToHistory = (command, type = 'Command') => {
    const newEntry = {
      id: Date.now(),
      command,
      type,
      timestamp: new Date().toLocaleString(),
      date: new Date().toISOString()
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  // ===== ADD TO FAVORITES =====
  const addToFavorites = (command) => {
    if (!favorites.includes(command)) {
      setFavorites(prev => [...prev, command]);
      localStorage.setItem('voiceFavorites', JSON.stringify([...favorites, command]));
      speakText('Command saved to favorites');
    } else {
      speakText('Command already in favorites');
    }
  };

  // ===== REMOVE FROM FAVORITES =====
  const removeFromFavorites = (command) => {
    setFavorites(prev => prev.filter(c => c !== command));
    localStorage.setItem('voiceFavorites', JSON.stringify(favorites.filter(c => c !== command)));
  };

  // ===== GET SUGGESTIONS =====
  const getSuggestions = (input) => {
    const suggestionsList = [];
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('search') || lowerInput.includes('find')) {
      suggestionsList.push('Search for mango pickle', 'Search for handmade crafts', 'Search for organic honey');
    }
    if (lowerInput.includes('cart') || lowerInput.includes('buy')) {
      suggestionsList.push('Add to cart', 'View cart', 'Checkout');
    }
    if (lowerInput.includes('order')) {
      suggestionsList.push('Track my order', 'View orders', 'Reorder');
    }
    if (lowerInput.includes('filter') || lowerInput.includes('sort')) {
      suggestionsList.push('Filter by price', 'Sort by rating', 'Clear filters');
    }
    if (lowerInput.includes('help') || lowerInput.includes('what')) {
      suggestionsList.push('Show me commands', 'How to use', 'Settings');
    }
    
    return suggestionsList.slice(0, 4);
  };

  // ===== HANDLE VOICE RESULT =====
  const handleResult = (transcript) => {
    setShowSuggestions(true);
    const suggestions = getSuggestions(transcript);
    setSuggestions(suggestions);
    handleCommand(transcript);
  };

  // ===== START LISTENING =====
  const startListening = () => {
    if (!supported) {
      speakText('Voice assistant is not supported in this browser');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = settings.language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setStatus('Listening... speak now');
      if (settings.hapticFeedback && navigator.vibrate) {
        navigator.vibrate(50);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setStatus('Microphone access denied. Please allow microphone access.');
        speakText('Please allow microphone access');
      } else {
        setStatus('Voice recognition error. Try again.');
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (status === 'Listening... speak now') {
        setStatus('Tap mic to speak');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // ===== RE-RUN COMMAND FROM HISTORY =====
  const reRunCommand = (command) => {
    setShowHistory(false);
    handleCommand(command);
  };

  // ===== GET ALL COMMANDS LIST =====
  const getAllCommands = () => {
    return [
      { category: '🔍 Search', commands: ['Search for [product]', 'Find [product]', 'Look for [product]'] },
      { category: '🧭 Navigation', commands: ['Go to [page]', 'Open [page]', 'Show [page]'] },
      { category: '🛒 Cart', commands: ['Add [product] to cart', 'Remove [product] from cart', 'Clear cart', 'View cart', 'Checkout'] },
      { category: '📦 Orders', commands: ['Track order [id]', 'Cancel order [id]', 'Reorder [id]', 'Show my orders'] },
      { category: '🔎 Filters', commands: ['Apply [type] filter [value]', 'Clear filters', 'Sort by [criteria]'] },
      { category: '❤️ Wishlist', commands: ['Add [product] to wishlist', 'View wishlist'] },
      { category: '🏪 Seller', commands: ['Seller dashboard', 'Seller orders', 'Add product', 'View earnings'] },
      { category: '⚙️ System', commands: ['Help', 'Settings', 'Clear history', 'Save as favorite', 'Status'] }
    ];
  };

  // ===== HANDLE SUGGESTION CLICK =====
  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    handleCommand(suggestion);
  };

  // ===== UPDATE SETTINGS =====
  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'language') {
      speakText(`Language updated`, value);
    }
  };

  // ===== LOAD FAVORITES FROM LOCALSTORAGE =====
  useEffect(() => {
    const savedFavorites = localStorage.getItem('voiceFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // ===== RENDER =====
  return (
    <div className="voice-assistant enhanced">
      {/* ===== MAIN BUTTON ===== */}
      <div className="voice-assistant__main">
        <button
          type="button"
          className={`voice-assistant__button ${listening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={startListening}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          aria-label="Voice Assistant"
          title="Click to speak (Alt+V)"
        >
          {listening ? (
            <FaMicrophoneSlash className="mic-icon" />
          ) : (
            <FaMicrophone className="mic-icon" />
          )}
          
          {listening && (
            <>
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
            </>
          )}
        </button>

        {/* ===== MENU ===== */}
        <div className={`voice-menu ${showMenu ? 'active' : ''}`}>
          <button onClick={() => { setShowMenu(false); setShowCommands(true); }}>
            <FaClipboardList /> All Commands
          </button>
          <button onClick={() => { setShowMenu(false); setShowHistory(true); }}>
            <FaHistory /> History
          </button>
          <button onClick={() => { setShowMenu(false); setShowSettings(true); }}>
            <FaCog /> Settings
          </button>
          <button onClick={() => { setShowMenu(false); handleCommand('help'); }}>
            <FaRobot /> Help
          </button>
          <button onClick={() => { setShowMenu(false); handleCommand('status'); }}>
            <FaCheck /> Status
          </button>
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className={`voice-assistant__status ${listening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}>
        <FaRobot className="voice-assistant__icon" />
        <span className="status-text">{status}</span>
        {listening && (
          <div className="status-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {isProcessing && (
          <div className="processing-spinner">
            <span></span>
          </div>
        )}
      </div>

      {/* ===== QUICK COMMANDS ===== */}
      <div className="quick-commands">
        <button onClick={() => handleCommand('search')} className="quick-btn">
          <FaSearch /> Search
        </button>
        <button onClick={() => handleCommand('view cart')} className="quick-btn">
          <FaShoppingCart /> Cart {context.cartCount > 0 && `(${context.cartCount})`}
        </button>
        <button onClick={() => handleCommand('show my orders')} className="quick-btn">
          <FaBox /> Orders
        </button>
        <button onClick={() => handleCommand('help')} className="quick-btn">
          <FaChevronRight /> Help
        </button>
      </div>

      {/* ===== SUGGESTIONS ===== */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="voice-suggestions">
          {suggestions.map((suggestion, index) => (
            <button 
              key={index} 
              className="suggestion-btn"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* ===== COMMANDS MODAL ===== */}
      {showCommands && (
        <div className="voice-modal voice-commands-modal">
          <div className="modal-header">
            <h3>📋 All Commands</h3>
            <button className="modal-close" onClick={() => setShowCommands(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            {getAllCommands().map((category, idx) => (
              <div key={idx} className="command-category">
                <h4>{category.category}</h4>
                <ul>
                  {category.commands.map((cmd, i) => (
                    <li key={i} onClick={() => { setShowCommands(false); handleCommand(cmd); }}>
                      {cmd}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== HISTORY MODAL ===== */}
      {showHistory && (
        <div className="voice-modal voice-history-modal">
          <div className="modal-header">
            <h3>📜 Command History</h3>
            <button className="modal-close" onClick={() => setShowHistory(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            {history.length === 0 ? (
              <p className="empty-state">No commands yet. Start speaking!</p>
            ) : (
              <>
                <div className="history-actions">
                  <button onClick={() => { setHistory([]); }} className="clear-btn">
                    <FaTrash /> Clear All
                  </button>
                </div>
                <ul>
                  {history.map((item) => (
                    <li key={item.id} onClick={() => reRunCommand(item.command)}>
                      <div className="history-item">
                        <span className="history-command">{item.command}</span>
                        <span className="history-type">{item.type}</span>
                        <span className="history-time">{item.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== SETTINGS MODAL ===== */}
      {showSettings && (
        <div className="voice-modal voice-settings-modal">
          <div className="modal-header">
            <h3>⚙️ Voice Settings</h3>
            <button className="modal-close" onClick={() => setShowSettings(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <div className="settings-group">
              <div className="setting-item">
                <label>Language</label>
                <select 
                  value={settings.language} 
                  onChange={(e) => updateSettings('language', e.target.value)}
                >
                  <option value="en-IN">English (India)</option>
                  <option value="en-US">English (US)</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="ta-IN">Tamil</option>
                  <option value="te-IN">Telugu</option>
                  <option value="bn-IN">Bengali</option>
                  <option value="kn-IN">Kannada</option>
                  <option value="ml-IN">Malayalam</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Voice Type</label>
                <div className="voice-options">
                  <button 
                    className={settings.voiceType === 'female' ? 'active' : ''}
                    onClick={() => updateSettings('voiceType', 'female')}
                  >
                    👩 Female
                  </button>
                  <button 
                    className={settings.voiceType === 'male' ? 'active' : ''}
                    onClick={() => updateSettings('voiceType', 'male')}
                  >
                    👨 Male
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label>Speed: {settings.speed}x</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={settings.speed}
                  onChange={(e) => updateSettings('speed', parseFloat(e.target.value))}
                />
              </div>

              <div className="setting-item">
                <label>Pitch: {settings.pitch}</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={settings.pitch}
                  onChange={(e) => updateSettings('pitch', parseFloat(e.target.value))}
                />
              </div>

              <div className="setting-item checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.autoListen}
                    onChange={(e) => updateSettings('autoListen', e.target.checked)}
                  />
                  Auto-Listen Mode
                </label>
              </div>

              <div className="setting-item checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.hapticFeedback}
                    onChange={(e) => updateSettings('hapticFeedback', e.target.checked)}
                  />
                  Haptic Feedback
                </label>
              </div>

              <div className="setting-item checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.showSuggestions}
                    onChange={(e) => updateSettings('showSuggestions', e.target.checked)}
                  />
                  Show Suggestions
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;