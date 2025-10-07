/**
 * Gestiona la creación y aplicación automática de temas,
 * inyectando un botón y los estilos base necesarios.
 * @version 3.0
 * @author HECTOR DANIEL AYARACHI FUENTES
 */

class AutoTheme {
  constructor(baseColors, buttonOptions = {}) {
    this.baseColors = baseColors;
    this.buttonOptions = {
      position: { bottom: '20px', right: '20px' },
      // Nueva opción para excluir elementos del filtro de inversión
      exclude: [], 
      ...buttonOptions
    };
    this.isDark = false;
    this.isPageInitiallyDark = false; // Determinará si la página es oscura por defecto
    this.init();
  }

  hexToHsl(hex) {
    // 1. Normaliza el formato HEX (ej. #f03 -> #ff0033)
    const fullHex = hex.length === 4 ?
      `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` :
      hex;

    // 2. Extrae los valores R, G, B
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (!result) {
        throw new Error(`Invalid HEX color: ${hex}`);
    }
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    // 3. Encuentra los valores máximo y mínimo para calcular la luminosidad y saturación
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

    // 4. Retorna el objeto HSL con valores redondeados
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
  }

  generateDarkColors() {
    const darkColors = {};
    for (const [name, hex] of Object.entries(this.baseColors)) {
      const hsl = this.hexToHsl(hex);
      const invertedL = 100 - hsl.l;
      let adjustedS = hsl.s;
      if (invertedL > 50) adjustedS = Math.max(30, hsl.s * 0.8);
      else adjustedS = Math.min(90, hsl.s * 1.2);
      darkColors[name] = `hsl(${hsl.h}, ${adjustedS}%, ${invertedL}%)`;
    }
    return darkColors;
  }

  /**
   * Encuentra el color de fondo efectivo de la página, subiendo por el DOM si es necesario.
   * @returns {string} El color de fondo en formato 'rgb(r, g, b)'.
   */
  getEffectiveBackgroundColor() {
    let element = document.body;
    while (element) {
      const bgColor = window.getComputedStyle(element).backgroundColor;
      // Si el color no es transparente, lo hemos encontrado.
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        return bgColor;
      }
      // Si es transparente, subimos al padre.
      element = element.parentElement;
    }
    // Si todos los elementos son transparentes, devolvemos blanco como último recurso.
    return 'rgb(255, 255, 255)';
  }

  /**
   * Analiza un color (rgb, hex) y determina si es "oscuro" basado en su luminosidad.
   * @param {string} colorString - El color en formato CSS.
   * @returns {boolean} - True si el color es oscuro.
   */
  isColorDark(colorString) {
    let r, g, b;
    // Extrae los componentes R, G, B del string de color
    const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      [, r, g, b] = match.map(Number);
    } else {
      // Si no es RGB, asume que es un color no oscuro y no hace nada.
      // Se podría añadir un parseador de HEX si fuera necesario.
      return false;
    }

    // Fórmula de luminosidad perceptual
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    // Un umbral de 128 es un buen punto medio en una escala de 0 a 255.
    return luminance < 128;
  }

  /**
   * Cambia el tema, lo aplica y guarda la preferencia.
   * @param {boolean} isDark - True si el modo oscuro debe estar activado.
   * @param {boolean} manualToggle - True si el cambio fue por el usuario.
   */
  setTheme(isDark, manualToggle = false) {
    this.isDark = isDark;

    // Lógica de inversión inteligente:
    // - Si la página es oscura y queremos tema claro, invertimos.
    // - Si la página es clara y queremos tema oscuro, invertimos.
    // - En los otros casos, no hacemos nada.
    if (this.isPageInitiallyDark !== this.isDark) {
      document.documentElement.setAttribute('data-theme', 'inverted');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Si el usuario hizo clic en el botón, guarda su elección
    if (manualToggle) {
      localStorage.setItem('theme-preference', this.isDark ? 'dark' : 'light');
    }
    
    // Anuncia el cambio de tema a los lectores de pantalla
    const liveRegion = document.getElementById('theme-announcer');
    if (liveRegion) liveRegion.textContent = `Tema cambiado a modo ${this.isDark ? 'oscuro' : 'claro'}.`;

    this.updateToggleButton();
  }

  /**
   * Inyecta el botón para cambiar de tema en el DOM.
   */
  injectToggleButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle-button';
    button.setAttribute('aria-label', 'Cambiar tema');
    
    // Carga la posición guardada o usa la por defecto
    const savedPositionJSON = localStorage.getItem('theme-button-position');
    let initialPositionStyles = this.buttonOptions.position;

    if (savedPositionJSON) {
        const savedPosition = JSON.parse(savedPositionJSON);
        // Asegura que los valores guardados son válidos
        if (typeof savedPosition.left === 'number' && typeof savedPosition.top === 'number') {
            initialPositionStyles = {
                left: `${savedPosition.left}px`,
                top: `${savedPosition.top}px`,
            };
        }
    }

    // Aplica estilos directamente desde JS para que no dependa de un CSS externo
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

    // --- Lógica para hacer el botón arrastrable ---
    let isDragging = false;
    let hasMoved = false;
    let offsetX, offsetY;

    const onDragStart = (e) => {
      isDragging = true;
      hasMoved = false;
      button.style.cursor = 'grabbing';
      button.style.transition = 'none'; // Desactiva transiciones durante el arrastre

      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      const rect = button.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('touchmove', onDragMove, { passive: false });
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchend', onDragEnd);
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      hasMoved = true;

      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;

      let newX = clientX - offsetX;
      let newY = clientY - offsetY;

      // Limita el movimiento a la ventana visible
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      newX = Math.max(0, Math.min(newX, viewportWidth - button.offsetWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - button.offsetHeight));

      button.style.left = `${newX}px`;
      button.style.top = `${newY}px`;
      // Elimina las propiedades de posición inicial para que left/top tomen control
      button.style.right = 'auto';
      button.style.bottom = 'auto';
    };

    const onDragEnd = () => {
      isDragging = false;
      button.style.cursor = 'pointer';
      button.style.transition = 'transform 0.2s ease, background-color 0.3s ease, color 0.3s ease'; // Reactiva transiciones

      // Guarda la posición final en localStorage si el botón se movió
      const finalRect = button.getBoundingClientRect();
      localStorage.setItem('theme-button-position', JSON.stringify({ left: finalRect.left, top: finalRect.top }));

      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchend', onDragEnd);
    };

    button.addEventListener('mousedown', onDragStart);
    button.addEventListener('touchstart', onDragStart, { passive: false });

    document.body.appendChild(button);

    button.addEventListener('click', () => {
      // Solo cambia el tema si el botón no se ha movido (es un clic, no un arrastre)
      if (!hasMoved) {
        this.setTheme(!this.isDark, true);
      }
    });

    this.toggleButton = button; // Guarda la referencia al botón
  }

  /**
   * Inyecta un elemento para anunciar cambios a tecnologías de asistencia.
   */
  injectLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'theme-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    // Oculta el elemento visualmente pero lo mantiene accesible
    Object.assign(liveRegion.style, { position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: '0', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' });
    document.body.appendChild(liveRegion);
  }
  
  /**
   * Actualiza el ícono y el color del botón según el tema actual.
   */
  updateToggleButton() {
    if (!this.toggleButton) return;
    
    this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
    this.toggleButton.style.backgroundColor = 'var(--color-surface)';
    this.toggleButton.style.color = 'var(--color-text)';
  }

  /**
   * Inyecta los estilos CSS base en el <head> del documento.
   * Esto elimina la necesidad de un archivo style.css externo.
   */
  injectBaseStyles() {
    const style = document.createElement('style');

    // Construye el selector de elementos a excluir
    const baseExclusions = ['img', 'video', 'iframe', '#theme-toggle-button']; // Excluir el botón por defecto
    const allExclusions = [...new Set([...baseExclusions, ...this.buttonOptions.exclude])];
    const exclusionSelector = allExclusions.map(sel => `[data-theme="inverted"] ${sel}`).join(',\n');

    style.textContent = `
      /*
        Inyector de Estilos Universal v4.0 - Adaptativo y con Exclusiones
      */
      
      /* Define las variables de color para el botón, independientemente del tema */
      :root {
        --color-surface: ${this.baseColors.surface || '#ffffff'};
        --color-text: ${this.baseColors.text || '#2c3e50'};
      }

      [data-theme="inverted"] {
        --color-surface: ${this.generateDarkColors().surface || '#2c3e50'};
        --color-text: ${this.generateDarkColors().text || '#ffffff'};
      }

      html {
        /* Transición suave para el filtro */
        transition: filter 0.3s ease;
      }

      [data-theme="inverted"] {
        /* 1. Invierte todos los colores y rota los tonos para corregir colores como el azul */
        filter: invert(1) hue-rotate(180deg) contrast(90%) brightness(95%);
        /* Asegura que el fondo de la página se renderice para que el filtro se aplique */
        background-color: #fff;
      }

      /* 2. Vuelve a invertir los elementos excluidos para que mantengan su apariencia original */
      ${exclusionSelector} {
        filter: invert(1) hue-rotate(180deg);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Inicializa el sistema.
   */
  init() {
    // Inyecta los componentes visuales inmediatamente.
    this.injectBaseStyles();
    this.injectLiveRegion();
    this.injectToggleButton();
  }
}

/**
 * Punto de entrada de la aplicación.
 * Define los colores base y activa el sistema de temas autónomo.
 * @author HECTOR DANIEL AYARACHI FUENTES
 */

// 1. Los colores base ya no son necesarios para el inyector de filtros,
//    pero se mantienen para la coloración del botón de tema.
const myBrandColors = {
  surface: '#ffffff',
  text: '#2c3e50'
};

// 2. Espera a que el DOM esté completamente cargado y luego inicializa el sistema de temas.
document.addEventListener('DOMContentLoaded', () => {
  const themeManager = new AutoTheme(myBrandColors, {
    // exclude: ['.logo', '#map-container']
  });

  // --- Lógica de configuración del tema ---
  // 1. Detecta el tema inicial de la página de forma robusta.
  const bodyBgColor = themeManager.getEffectiveBackgroundColor();
  themeManager.isPageInitiallyDark = themeManager.isColorDark(bodyBgColor);

  // 2. Determina el tema a aplicar basado en la jerarquía de preferencias.
  const savedPreference = localStorage.getItem('theme-preference');
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
  
  let initialThemeIsDark;
  if (savedPreference) {
      initialThemeIsDark = savedPreference === 'dark';
  } else {
      initialThemeIsDark = systemPreference.matches;
  }

  // 3. Aplica el tema inicial.
  themeManager.setTheme(initialThemeIsDark);

  // 4. Escucha cambios en la preferencia del sistema.
  systemPreference.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-preference')) {
          themeManager.setTheme(e.matches);
      }
  });
});
