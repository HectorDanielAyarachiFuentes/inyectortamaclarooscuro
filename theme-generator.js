/**
 * Gestiona la creación y aplicación automática de temas,
 * inyectando un botón y los estilos base necesarios.
 * @version 5.0
 * @author HECTOR DANIEL AYARACHI FUENTES
 */

const COLOR_MAP = {
  "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
  "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff",
  "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00",
  "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c",
  "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9",
  "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00",
  "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff",
  "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22",
  "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520",
  "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4",
  "indianred": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa",
  "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080",
  "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgray": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff",
  "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23",
  "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98",
  "paleturquoise": "#afeeee", "palevioletred": "#db7093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f",
  "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "rebeccapurple": "#663399",
  "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072",
  "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0",
  "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f",
  "steelblue": "#4682b4", "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347",
  "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00", "yellowgreen": "#9acd32"
};

class AutoTheme {
  #baseColors;
  #buttonOptions;
  #isDark = false;
  #isPageInitiallyDark = false;
  #colorCache = new Map();
  #toggleButton;

  constructor(baseColors, buttonOptions = {}) {
    this.#baseColors = baseColors || { surface: '#ffffff', text: '#2c3e50' };
    this.#validateColors();

    this.#buttonOptions = {
      position: { bottom: '20px', right: '20px' },
      exclude: [],
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease',
      ...buttonOptions
    };

    this.#init();
  }

  #validateColors() {
    for (const [name, color] of Object.entries(this.#baseColors)) {
      if (!/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(color)) {
        console.error(`AutoTheme Error: Invalid HEX color format for "${name}": ${color}. Using default.`);
        this.#baseColors[name] = name === 'surface' ? '#ffffff' : '#2c3e50';
      }
    }
  }

  #hexToHsl(hex) {
    try {
      const fullHex = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      if (!result) throw new Error(`Invalid HEX color: ${hex}`);
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    } catch (error) {
      console.error(error.message);
      return { h: 0, s: 0, l: 100 }; // Default to white on error
    }
  }

  #generateDarkColors() {
    const darkColors = {};
    for (const [name, hex] of Object.entries(this.#baseColors)) {
      const hsl = this.#hexToHsl(hex);
      const invertedL = 100 - hsl.l;
      let adjustedS = hsl.s;
      if (invertedL > 50) adjustedS = Math.max(30, hsl.s * 0.8);
      else adjustedS = Math.min(90, hsl.s * 1.2);
      darkColors[name] = `hsl(${hsl.h}, ${adjustedS}%, ${invertedL}%)`;
    }
    return darkColors;
  }

  #getEffectiveBackgroundColor() {
    let element = document.body;
    while (element) {
      const bgColor = window.getComputedStyle(element).backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') return bgColor;
      element = element.parentElement;
    }
    return 'rgb(255, 255, 255)'; // Default to white
  }

  #colorNameToHex(color) {
    return COLOR_MAP[color.toLowerCase()] || null;
  }

  #isColorDark(colorString) {
    const sanitizedColor = colorString.toLowerCase().trim();
    if (this.#colorCache.has(sanitizedColor)) {
      return this.#isColorDark(this.#colorCache.get(sanitizedColor));
    }

    let r, g, b;
    let match;

    if ((match = sanitizedColor.match(/rgba?(\d+),\s*(\d+),\s*(\d+)/))) {
      [, r, g, b] = match.map(Number);
    } else if ((match = sanitizedColor.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/))) {
      [, r, g, b] = match.map(c => parseInt(c, 16));
    } else if ((match = sanitizedColor.match(/#([a-f\d])([a-f\d])([a-f\d])/))) {
      [, r, g, b] = match.map(c => parseInt(c + c, 16));
    } else if ((match = sanitizedColor.match(/hsla?(\d+),\s*(\d+)%?,\s*(\d+)%?/))) {
      const [, h, s, l] = match.map(Number);
      const s_norm = s / 100, l_norm = l / 100;
      const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l_norm - c / 2;
      let r_temp = 0, g_temp = 0, b_temp = 0;
      if (h < 60) { [r_temp, g_temp, b_temp] = [c, x, 0]; }
      else if (h < 120) { [r_temp, g_temp, b_temp] = [x, c, 0]; }
      else if (h < 180) { [r_temp, g_temp, b_temp] = [0, c, x]; }
      else if (h < 240) { [r_temp, g_temp, b_temp] = [0, x, c]; }
      else if (h < 300) { [r_temp, g_temp, b_temp] = [x, 0, c]; }
      else { [r_temp, g_temp, b_temp] = [c, 0, x]; }
      r = Math.round((r_temp + m) * 255);
      g = Math.round((g_temp + m) * 255);
      b = Math.round((b_temp + m) * 255);
    } else {
      const hexColor = this.#colorNameToHex(sanitizedColor);
      if (hexColor) {
        this.#colorCache.set(sanitizedColor, hexColor);
        return this.#isColorDark(hexColor);
      }
      return false; // Cannot determine
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }

  recalculatePageTheme() {
    const bodyBgColor = this.#getEffectiveBackgroundColor();
    this.#isPageInitiallyDark = this.#isColorDark(bodyBgColor);
    this.setTheme(this.#isDark);
  }

  setTheme(isDark, manualToggle = false) {
    try {
      if (this.#isDark === isDark && document.documentElement.hasAttribute('data-theme-initialized')) return;

      this.#isDark = isDark;
      this.#toggleButton?.setAttribute('aria-pressed', String(isDark));

      if (document.startViewTransition) {
        document.startViewTransition(() => this.#applyThemeChanges(manualToggle));
      } else {
        this.#applyThemeChanges(manualToggle);
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }

  #applyThemeChanges(manualToggle) {
    if (manualToggle) {
      localStorage.setItem('theme-preference', this.#isDark ? 'dark' : 'light');
    }

    const liveRegion = document.getElementById('theme-announcer');
    if (liveRegion) liveRegion.textContent = `Tema cambiado a modo ${this.#isDark ? 'oscuro' : 'claro'}.`;

    if (this.#isPageInitiallyDark !== this.#isDark) {
      document.documentElement.setAttribute('data-theme', 'inverted');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    document.documentElement.setAttribute('data-theme-initialized', 'true');

    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { isDark: this.#isDark, manualToggle }
    }));

    this.#updateToggleButton();
  }

  #createToggleButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle-button';
    button.setAttribute('aria-label', 'Cambiar entre tema claro y oscuro');

    let initialPositionStyles = this.#buttonOptions.position;
    try {
      const savedPosition = JSON.parse(localStorage.getItem('theme-button-position') ?? '{}');
      if (typeof savedPosition.left === 'number' && typeof savedPosition.top === 'number') {
        initialPositionStyles = { left: `${savedPosition.left}px`, top: `${savedPosition.top}px` };
      }
    } catch (error) {
      console.error('Error parsing saved button position:', error);
      localStorage.removeItem('theme-button-position');
    }

    Object.assign(button.style, {
      position: 'fixed',
      ...initialPositionStyles,
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: '9999',
      transition: 'transform 0.2s ease, background-color 0.3s ease, color 0.3s ease'
    });

    button.addEventListener('mouseover', () => button.style.transform = 'scale(1.1)');
    button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');
    button.addEventListener('click', () => this.setTheme(!this.#isDark, true));
    
    this.#makeDraggable(button);

    document.body.appendChild(button);
    this.#toggleButton = button;
  }

  #makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    const onMouseDown = (e) => {
      // Solo arrastrar con el botón izquierdo del ratón
      if (e.button !== 0) return;

      isDragging = true;
      // Usar getBoundingClientRect para una posición más precisa
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      element.style.cursor = 'grabbing';
      // Evitar la transición durante el arrastre para un movimiento fluido
      element.style.transition = 'none';

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp, { once: true });
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      // Limitar la posición dentro de la ventana
      const x = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, e.clientX - offsetX));
      const y = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, e.clientY - offsetY));
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      element.style.cursor = 'pointer';
      // Restaurar la transición
      element.style.transition = 'transform 0.2s ease, background-color 0.3s ease, color 0.3s ease';
      document.removeEventListener('mousemove', onMouseMove);
      
      localStorage.setItem('theme-button-position', JSON.stringify({ left: element.offsetLeft, top: element.offsetTop }));
    };

    element.addEventListener('mousedown', onMouseDown);
  }

  #injectLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'theme-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    Object.assign(liveRegion.style, { position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: '0', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' });
    document.body.appendChild(liveRegion);
  }

  #updateToggleButton() {
    if (!this.#toggleButton) return;
    this.#toggleButton.innerHTML = this.#isDark ? '☀️' : '🌙';
    this.#toggleButton.style.backgroundColor = 'var(--color-surface)';
    this.#toggleButton.style.color = 'var(--color-text)';
  }

  #injectBaseStyles() {
    const style = document.createElement('style');
    const baseExclusions = ['img', 'video', 'iframe', '#theme-toggle-button', '[data-theme-exclude]', '[style*="background-image"]'];
    const userExclusions = this.#buttonOptions.exclude.filter(e => typeof e === 'string');
    const allExclusionSelectors = [...new Set([...baseExclusions, ...userExclusions])];
    const exclusionSelector = allExclusionSelectors.map(sel => `[data-theme="inverted"] ${sel}`).join(',\n');

    const exclusionFunctions = this.#buttonOptions.exclude.filter(e => typeof e === 'function');
    if (exclusionFunctions.length > 0) {
      document.querySelectorAll('*').forEach(el => {
        if (exclusionFunctions.some(fn => fn(el))) {
          el.setAttribute('data-theme-exclude', '');
        }
      });
    }

    const highContrast = window.matchMedia('(prefers-contrast: more)').matches;
    const contrastValue = highContrast ? '110%' : '90%';
    const brightnessValue = highContrast ? '100%' : '95%';
    const { transitionDuration, transitionTimingFunction } = this.#buttonOptions;
    const darkColors = this.#generateDarkColors();

    style.textContent = `
      :root {
        --color-surface: ${this.#baseColors.surface || '#ffffff'};
        --color-text: ${this.#baseColors.text || '#2c3e50'};
      }

      [data-theme="inverted"] {
        --color-surface: ${darkColors.surface || '#2c3e50'};
        --color-text: ${darkColors.text || '#ffffff'};
      }

      html {
        transition: filter ${transitionDuration} ${transitionTimingFunction};
      }

      [data-theme="inverted"] {
        filter: invert(1) hue-rotate(180deg) contrast(${contrastValue}) brightness(${brightnessValue});
        background-color: #fff;
      }

      ${exclusionSelector} {
        filter: invert(1) hue-rotate(180deg);
      }
    `;
    document.head.appendChild(style);
  }

  #init() {
    this.#injectBaseStyles();
    this.#injectLiveRegion();
    this.#createToggleButton();

    this.#isPageInitiallyDark = this.#isColorDark(this.#getEffectiveBackgroundColor());

    const savedPreference = localStorage.getItem('theme-preference');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const initialThemeIsDark = savedPreference ? savedPreference === 'dark' : systemPreference.matches;

    this.setTheme(initialThemeIsDark);

    let debounceTimer;
    systemPreference.addEventListener('change', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!localStorage.getItem('theme-preference')) {
          this.setTheme(e.matches);
        }
      }, 100);
    });

    const observer = new MutationObserver(() => this.recalculatePageTheme());
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
  }
}

/**
 * Punto de entrada de la aplicación.
 * Define los colores base y activa el sistema de temas autónomo.
 * @author HECTOR DANIEL AYARACHI FUENTES
 */
const myBrandColors = {
  surface: '#ffffff',
  text: '#2c3e50'
};

// Crea una nueva instancia de la clase y le pasa los colores base.
new AutoTheme(myBrandColors, {
  // Ejemplo de exclusiones:
  // exclude: [
  //   '.logo', // Selector CSS
  //   (el) => el.id === 'map-container' // Función de callback
  // ]
});
