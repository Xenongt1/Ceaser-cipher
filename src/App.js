import { useState, useEffect } from 'react';

// CipherWheel component definition
function CipherWheel({ shift, mode }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Calculate the positions of each letter on the wheel
  const getPosition = (index, innerWheel = false) => {
    const radius = innerWheel ? 120 : 180;
    const angle = (index * (360 / 26)) * (Math.PI / 180);
    const x = 250 + radius * Math.sin(angle);
    const y = 250 - radius * Math.cos(angle);
    return { x, y };
  };

  // Calculate the shifted letter
  const getShiftedLetter = (index) => {
    if (mode === 'encrypt') {
      return alphabet[(index + shift) % 26];
    } else {
      return alphabet[(index - shift + 26) % 26];
    }
  };

  // Draw connection lines for all letters
  const connectionLines = alphabet.split('').map((_, i) => {
    const outerPos = getPosition(i);
    const shiftedIndex = mode === 'encrypt' 
      ? (i + shift) % 26 
      : (i - shift + 26) % 26;
    const shiftedInnerPos = getPosition(shiftedIndex, true);
    
    return (
      <g key={`line-${i}`}>
        <line 
          x1={outerPos.x} 
          y1={outerPos.y} 
          x2={shiftedInnerPos.x} 
          y2={shiftedInnerPos.y} 
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.4"
        />
      </g>
    );
  });

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <svg viewBox="0 0 500 500" className="w-full max-w-2xl">
        {/* Background */}
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#eff6ff" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="250" r="250" fill="url(#bgGradient)" />
        
        {/* Outer wheel (fixed) */}
        <circle cx="250" cy="250" r="200" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,2" />
        <circle cx="250" cy="250" r="180" fill="none" stroke="#2563eb" strokeWidth="1" />
        
        {/* Inner wheel (rotating) */}
        <circle cx="250" cy="250" r="140" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" opacity="0.7" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="#2563eb" strokeWidth="1" />
        
        {/* Connection lines */}
        {connectionLines}
        
        {/* Outer wheel letters */}
        {alphabet.split('').map((char, i) => {
          const pos = getPosition(i);
          return (
            <g key={`outer-${i}`}>
              <circle 
                cx={pos.x} 
                cy={pos.y} 
                r="16" 
                fill="#bfdbfe" 
                stroke="#2563eb" 
                strokeWidth="1.5"
              />
              <text 
                x={pos.x} 
                y={pos.y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="14" 
                fontWeight="bold"
                fill="#1e40af"
              >
                {char}
              </text>
            </g>
          );
        })}
        
        {/* Inner wheel letters - show all mapped letters */}
        {alphabet.split('').map((_, i) => {
          const pos = getPosition(i, true);
          const shiftedLetter = getShiftedLetter(i);
          return (
            <g key={`inner-${i}`}>
              <circle 
                cx={pos.x} 
                cy={pos.y} 
                r="14" 
                fill="#93c5fd" 
                stroke="#2563eb" 
                strokeWidth="1.5" 
              />
              <text 
                x={pos.x} 
                y={pos.y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="12" 
                fontWeight="bold"
                fill="#1e3a8a"
              >
                {shiftedLetter}
              </text>
            </g>
          );
        })}
        
        {/* Center decoration */}
        <circle cx="250" cy="250" r="50" fill="url(#bgGradient)" stroke="#2563eb" strokeWidth="2" />
        <circle cx="250" cy="250" r="40" fill="#3b82f6" />
        <circle cx="250" cy="250" r="35" fill="#2563eb" />
        <text 
          x="250" 
          y="250" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize="18" 
          fontWeight="bold"
          fill="white"
        >
          {shift}
        </text>
        
        {/* Rotation indicator */}
        <line 
          x1="250" 
          y1="250" 
          x2="250" 
          y2="70" 
          stroke="#2563eb" 
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="250" cy="70" r="8" fill="#2563eb" />
      </svg>
    </div>
  );
}

// Main App component
export default function App() {
  const [inputText, setInputText] = useState('HELLO WORLD');
  const [shift, setShift] = useState(3);
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Process the text whenever input text or shift changes
  useEffect(() => {
    processText();
  }, [inputText, shift, mode]);

  const processText = () => {
    const result = inputText
      .split('')
      .map(char => {
        if (!/[A-Za-z]/.test(char)) return char;
        
        const isUpperCase = char === char.toUpperCase();
        const letterIndex = alphabet.indexOf(char.toUpperCase());
        
        if (letterIndex === -1) return char;
        
        let newIndex;
        if (mode === 'encrypt') {
          newIndex = (letterIndex + shift) % 26;
        } else {
          newIndex = (letterIndex - shift + 26) % 26;
        }
        
        const newChar = alphabet[newIndex];
        return isUpperCase ? newChar : newChar.toLowerCase();
      })
      .join('');
    
    setOutputText(result);
  };

  const handleShiftChange = (e) => {
    const value = parseInt(e.target.value);
    setShift(isNaN(value) ? 0 : value % 26);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto bg-gradient-to-b from-indigo-50 to-blue-50 min-h-screen">
      <div className="bg-white w-full rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Caesar Cipher Visualizer
        </h1>
        <p className="text-gray-600 text-center mb-8">Encrypt and decrypt messages with the ancient cipher technique</p>
      
        {/* Mode selection */}
        <div className="flex justify-center mb-8 gap-4">
          <button 
            className={`px-6 py-3 rounded-full font-medium transition-all ${mode === 'encrypt' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setMode('encrypt')}
          >
            Encrypt
          </button>
          <button 
            className={`px-6 py-3 rounded-full font-medium transition-all ${mode === 'decrypt' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setMode('decrypt')}
          >
            Decrypt
          </button>
        </div>
        
        {/* Input/Output Section */}
        <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-blue-800">Input Text:</label>
            <textarea
              className="w-full h-40 p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your message here..."
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-blue-800">Output Text:</label>
            <textarea
              className="w-full h-40 p-4 border border-blue-200 rounded-lg bg-blue-50"
              value={outputText}
              readOnly
              placeholder="Your processed text will appear here..."
            />
          </div>
        </div>
        
        {/* Shift Control */}
        <div className="w-full mb-12 bg-white p-6 rounded-lg shadow-sm border border-blue-100">
          <label className="block text-lg font-semibold mb-3 text-blue-800">Shift Value: <span className="text-blue-600">{shift}</span></label>
          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={handleShiftChange}
            className="w-full h-2 bg-blue-200 rounded appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm text-blue-600 font-medium">
            <span>0</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
          </div>
        </div>
      </div>
      
      {/* Visualization Section */}
      <div className="bg-white w-full rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Cipher Visualization</h2>
        
        <div className="mb-12">
          <CipherWheel shift={shift} mode={mode} />
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Alphabet Mapping</h3>
          <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm overflow-x-auto">
            <div className="flex flex-col md:flex-row min-w-max">
              <div className="md:w-24 font-bold text-blue-800 mb-2 md:mb-0">Original:</div>
              <div className="flex gap-4 text-blue-600">
                {alphabet.split('').map((char, i) => (
                  <span key={`orig-${i}`} className="text-center w-6">{char}</span>
                ))}
              </div>
            </div>
            <div className="border-t border-blue-200 my-2"></div>
            <div className="flex flex-col md:flex-row min-w-max">
              <div className="md:w-24 font-bold text-blue-800 mb-2 md:mb-0">{mode === 'encrypt' ? 'Encrypted:' : 'Decrypted:'}</div>
              <div className="flex gap-4 text-purple-600 font-medium">
                {alphabet.split('').map((_, i) => {
                  const newIndex = mode === 'encrypt' 
                    ? (i + shift) % 26 
                    : (i - shift + 26) % 26;
                  return <span key={`new-${i}`} className="text-center w-6">{alphabet[newIndex]}</span>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Explanation */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p className="mb-4 text-blue-100">
          The Caesar cipher is a substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet.
        </p>
        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
          <p className="text-white">
            For example, with a shift of 3:
            <br />
            A → D, B → E, C → F, ..., Z → C
          </p>
        </div>
      </div>
      
      <footer className="text-center text-gray-500 text-sm mt-4 mb-8">
        Created by TechWithChef1t • 
      </footer>
    </div>
  );
}