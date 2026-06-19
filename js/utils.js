/**
 * Utility functions
 */

// localStorage helpers
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage set error:', e);
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('localStorage get error:', e);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('localStorage remove error:', e);
    }
  }
};

// Queue pending changes (for offline sync)
class PendingQueue {
  constructor() {
    this.queue = storage.get('pending_queue') || [];
  }

  add(action, data) {
    this.queue.push({
      action,
      data,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    });
    this.save();
  }

  getAll() {
    return this.queue;
  }

  remove(id) {
    this.queue = this.queue.filter(item => item.id !== id);
    this.save();
  }

  clear() {
    this.queue = [];
    this.save();
  }

  save() {
    storage.set('pending_queue', this.queue);
  }
}

// Number formatting
function formatNumber(num) {
  return num.toLocaleString('pt-BR');
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get country emoji flag
const flagEmojis = {
  'MEX': '🇲🇽', 'RSA': '🇿🇦', 'KOR': '🇰🇷', 'CZE': '🇨🇿',
  'CAN': '🇨🇦', 'BIH': '🇧🇦', 'QAT': '🇶🇦', 'SUI': '🇨🇭',
  'BRA': '🇧🇷', 'MAR': '🇲🇦', 'HAI': '🇭🇹', 'SCO': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'ARG': '🇦🇷', 'TUN': '🇹🇳', 'UZB': '🇺🇿', 'NED': '🇳🇱',
  'USA': '🇺🇸', 'GHA': '🇬🇭', 'TUR': '🇹🇷', 'ECU': '🇪🇨',
  'COL': '🇨🇴', 'JPN': '🇯🇵', 'NOR': '🇳🇴', 'IRQ': '🇮🇶',
  'FRA': '🇫🇷', 'EGY': '🇪🇬', 'PAN': '🇵🇦', 'AUT': '🇦🇹',
  'ESP': '🇪🇸', 'CIV': '🇨🇮', 'NZL': '🇳🇿', 'JOR': '🇯🇴',
  'GER': '🇩🇪', 'SEN': '🇸🇳', 'CUR': '🇨🇼', 'KSA': '🇸🇦',
  'ENG': '🇬🇧', 'CRO': '🇭🇷', 'CPV': '🇨🇻', 'PAR': '🇵🇾',
  'POR': '🇵🇹', 'BEL': '🇧🇪', 'COD': '🇨🇩', 'IRN': '🇮🇷',
  'URU': '🇺🇾', 'SWE': '🇸🇪', 'ALG': '🇩🇿', 'AUS': '🇦🇺'
};

function getCountryFlag(sigla) {
  return flagEmojis[sigla] || '🌍';
}

// Generate group tab style (background gradient)
const groupColors = {
  'A': 'linear-gradient(135deg, #e74c3c, #c0392b)',
  'B': 'linear-gradient(135deg, #27ae60, #229954)',
  'C': 'linear-gradient(135deg, #f5576c, #f093fb)',
  'D': 'linear-gradient(135deg, #4facfe, #00f2fe)',
  'E': 'linear-gradient(135deg, #fa709a, #fee140)',
  'F': 'linear-gradient(135deg, #ff6b6b, #feca57)',
  'G': 'linear-gradient(135deg, #30cfd0, #330867)',
  'H': 'linear-gradient(135deg, #a8edea, #fed6e3)',
  'I': 'linear-gradient(135deg, #ff9a56, #ff6a88)',
  'J': 'linear-gradient(135deg, #3a7bd5, #00d2fc)',
  'K': 'linear-gradient(135deg, #f86f51, #ff6e7f)',
  'L': 'linear-gradient(135deg, #667eea, #764ba2)'
};

function getGroupColor(grupo) {
  return groupColors[grupo] || groupColors['A'];
}
