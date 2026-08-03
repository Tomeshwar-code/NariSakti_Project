import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaRobot } from 'react-icons/fa';
import './VoiceAssistant.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSpeechRecognition = Boolean(SpeechRecognition);

const speakText = (text) => {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const commandHandlers = {
  search: (query, navigate) => {
    const trimmed = query.trim();
    if (!trimmed) {
      speakText('Please say the product name or phrase after search.');
      return;
    }
    speakText(`Searching for ${trimmed}`);
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
  },
  route: (target, navigate) => {
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
    };

    const path = routeMap[normalized] || null;
    if (path) {
      speakText(`Opening ${normalized}`);
      navigate(path);
    } else {
      speakText(`I am not sure how to open ${normalized}. Try a different command.`);
    }
  },
};

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [status, setStatus] = useState('Tap mic to speak');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!hasSpeechRecognition) {
      setSupported(false);
      setStatus('Voice assistant not supported in this browser');
    }
  }, []);

  const handleResult = (transcript) => {
    const text = transcript.toLowerCase().trim();

    if (/^(search|find) (for )?(.+)/i.test(text)) {
      const query = text.replace(/^(search|find)( for)?\s+/i, '');
      commandHandlers.search(query, navigate);
      setStatus(`Searching for “${query}”`);
      return;
    }

    if (/^(go to|open|show|take me to) (.+)/i.test(text)) {
      const target = text.replace(/^(go to|open|show|take me to)\s+/i, '');
      commandHandlers.route(target, navigate);
      setStatus(`Opening ${target}`);
      return;
    }

    if (/help|what can you do|commands/i.test(text)) {
      const message = 'You can say: search for mango pickles, open cart, go to profile, or show orders.';
      speakText(message);
      setStatus('Voice assistant help shown');
      return;
    }

    speakText('Sorry, I did not understand that command. Try search for products or open cart.');
    setStatus('Command not recognized. Try again.');
  };

  const startListening = () => {
    if (!supported) {
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setStatus('Listening... speak now');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setStatus('Voice recognition error. Try again.');
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

  return (
    <div className="voice-assistant">
      <button
        type="button"
        className={`voice-assistant__button ${listening ? 'listening' : ''}`}
        onClick={startListening}
        aria-label="Toggle voice assistant"
      >
        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <div className="voice-assistant__status">
        <FaRobot className="voice-assistant__icon" />
        <span>{status}</span>
      </div>
    </div>
  );
};

export default VoiceAssistant;
