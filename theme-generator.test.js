// __tests__/theme-generator.test.js

// Mock de APIs de navegador muy modernas que no existen en jsdom
if (typeof Element.prototype.animate === 'undefined') {
  Element.prototype.animate = jest.fn().mockReturnValue({ finished: Promise.resolve() });
}
if (typeof window.CSS === 'undefined') {
  window.CSS = {};
}
window.CSS.paintWorklet = { addModule: jest.fn() }; // Ahora esto funcionará

import { AutoTheme } from './theme-generator.js';
import { fireEvent } from '@testing-library/dom';

// Mock de la interfaz `matchMedia` que usa el script para detectar preferencias del sistema.
// Jest se ejecuta en Node.js, no en un navegador, por lo que `window.matchMedia` no existe.
// Lo simulamos para poder controlar su comportamiento en las pruebas.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, // Por defecto, simulamos que el sistema prefiere el tema claro.
    media: query,
    onchange: null, // jest.fn() no es necesario aquí
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de `localStorage`. Al igual que `matchMedia`, no existe en el entorno de Node.js.
// Creamos una implementación simple en memoria para nuestras pruebas.
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de `startViewTransition` que no existe en jsdom.
// Simulamos que la función existe y simplemente ejecuta el callback que se le pasa.
Object.defineProperty(document, 'startViewTransition', {
  writable: true,
  value: (callback) => {
    callback();
    return { ready: Promise.resolve() }; // Devolvemos un objeto similar al real
  },
});

// `describe` agrupa un conjunto de pruebas relacionadas.
describe('AutoTheme', () => {

  // `beforeEach` se ejecuta antes de cada prueba (`test`) en este grupo.
  // Es el lugar perfecto para limpiar el estado y asegurar que las pruebas no interfieran entre sí.
  beforeEach(() => {
    // Limpiamos el body del DOM simulado por jsdom.
    document.body.innerHTML = '';
    // Limpiamos nuestro mock de localStorage.
    localStorage.clear();
    // Reseteamos el mock de matchMedia para que devuelva 'false' (light mode) por defecto.
    window.matchMedia.mockImplementation(query => ({ matches: false, addEventListener: jest.fn() }));
    // Limpiamos atributos que el script podría haber añadido al elemento <html>.
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-initialized');
    // Limpiamos el mock de animate para que no acumule llamadas entre tests
    if (Element.prototype.animate.mockClear) {
      Element.prototype.animate.mockClear();
    }
    // Mock para evitar el error de parsing de CSS en JSDOM.
    // Esto previene que los estilos se inyecten en el head durante las pruebas.
    jest.spyOn(document.head, 'appendChild').mockImplementation(el => {
      if (el.tagName === 'STYLE') return null;
    });
  });

  test('debería inicializarse correctamente y crear el botón de tema', () => {
    // Arrange: Preparamos el entorno de la prueba.
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };
    
    // Act: Ejecutamos el código que queremos probar.
    new AutoTheme(myBrandColors);

    // Assert: Verificamos que el resultado es el esperado.
    const toggleButton = document.getElementById('theme-toggle-button');
    expect(toggleButton).not.toBeNull(); // Esperamos que el botón exista en el DOM.
    
    // Como no hay preferencias guardadas y el sistema prefiere claro, el tema debe ser claro.
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  test('debería aplicar el tema oscuro si está guardado en localStorage', () => {
    // Arrange: Simulamos que el usuario ya había guardado la preferencia por el tema oscuro.
    localStorage.setItem('theme-preference', 'dark');
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };

    // Act
    new AutoTheme(myBrandColors);

    // Assert: El atributo `data-theme` debería ser 'inverted' para aplicar el modo oscuro.
    expect(document.documentElement.getAttribute('data-theme')).toBe('inverted');
  });

  test('debería aplicar el tema oscuro si el sistema operativo lo prefiere y no hay preferencia guardada', () => {
    // Arrange: Simulamos que el sistema operativo del usuario está en modo oscuro.
    window.matchMedia.mockImplementation(query => ({ matches: true, addEventListener: jest.fn() }));
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };

    // Act
    new AutoTheme(myBrandColors);

    // Assert: El tema debería ser oscuro.
    expect(document.documentElement.getAttribute('data-theme')).toBe('inverted');
  });

  test('debería cambiar de tema al hacer clic en el botón y actualizar localStorage', () => {
    // Arrange: Inicia con el tema claro por defecto.
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };
    new AutoTheme(myBrandColors);

    const toggleButton = document.getElementById('theme-toggle-button');
    expect(toggleButton).not.toBeNull();

    // Assert: Estado inicial es claro.
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    // El botón debe mostrar el icono del sol (SUN_ICON).
    expect(toggleButton.innerHTML).toContain('viewBox="0 0 2886 2872"');

    // Act: Simula el primer clic del usuario.
    toggleButton.click();

    // Assert: El tema ahora debe ser oscuro.
    expect(document.documentElement.getAttribute('data-theme')).toBe('inverted');
    expect(localStorage.getItem('theme-preference')).toBe('dark');
    // El botón debe mostrar el icono de la luna (MOON_ICON).
    expect(toggleButton.innerHTML).toContain('viewBox="0 0 3304.85 3304.44"');

    // Act: Simula un segundo clic para volver al tema claro.
    toggleButton.click();

    // Assert: El tema vuelve a ser claro.
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    expect(localStorage.getItem('theme-preference')).toBe('light');
    expect(toggleButton.innerHTML).toContain('viewBox="0 0 2886 2872"');
  });

  test('debería ser arrastrable, crear partículas y guardar la posición', () => {
    // Arrange: Habilitamos los temporizadores falsos de Jest para esta prueba.
    // Esto nos permite controlar `setTimeout`.
    jest.useFakeTimers();

    // Arrange
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };
    new AutoTheme(myBrandColors);

    const triggerContainer = document.getElementById('theme-toggle-container');
    expect(triggerContainer).not.toBeNull();

    // Mock getBoundingClientRect para tener una posición inicial predecible
    triggerContainer.getBoundingClientRect = jest.fn(() => ({
      left: window.innerWidth - 120 - 20, // Simula la posición inicial de 'right: 20px'
      top: window.innerHeight - 120 - 20, // Simula la posición inicial de 'bottom: 20px'
      right: window.innerWidth - 20,
      bottom: window.innerHeight - 20,
      width: 120,
      height: 120,
    }));

    // Act: Simular el arrastre
    fireEvent.mouseDown(triggerContainer, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 300 });

    // Act: Avanzamos el tiempo para que se ejecute el `setTimeout` que crea las partículas.
    jest.runAllTimers();

    // Assert: Verificar que se crearon partículas de arrastre
    const particles = document.querySelectorAll('.theme-drag-particle');
    expect(particles.length).toBeGreaterThan(0);
    expect(particles[0].classList.contains('particle-fire')).toBe(true); // Tema claro = partículas de fuego

    // Act: Soltar el botón
    fireEvent.mouseUp(document);

    // Assert: Verificar la nueva posición y el guardado en localStorage
    // La nueva posición es (200 - offsetX, 300 - offsetY). Como el clic fue en (10,10) y el botón no estaba ahí,
    // el cálculo del offset es complejo. Lo importante es que `left` y `top` ahora tienen valores.
    expect(triggerContainer.style.left).not.toBe('');
    expect(triggerContainer.style.top).not.toBe('');
    expect(localStorage.getItem('theme-button-position')).not.toBeNull();

    // Cleanup: Restauramos los temporizadores reales para no afectar otras pruebas.
    jest.useRealTimers();
  });

  test('debería ocultar el botón al hacer clic en "X" y restaurarlo con la tecla de atajo', () => {
    // Arrange: Habilitamos temporizadores falsos para controlar las animaciones.
    jest.useFakeTimers();

    // Simulamos que el tutorial ya se completó para que los botones satélite sean visibles.
    localStorage.setItem('theme-tutorial-completed', 'true');
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };
    new AutoTheme(myBrandColors, { shortcutKey: 't' });

    const triggerContainer = document.getElementById('theme-toggle-container');
    // Usamos un selector de atributo para encontrar el botón de cierre de forma fiable.
    const closeButton = triggerContainer.querySelector('button[aria-label*="Ocultar"]');
    
    expect(triggerContainer).not.toBeNull();
    expect(closeButton).not.toBeNull();
    expect(triggerContainer.style.display).not.toBe('none');

    // Act (Ocultar): Simula el clic en el botón de cierre.
    fireEvent.click(closeButton);
    // Disparamos el evento 'animationend' para completar la acción de ocultar.
    fireEvent.animationEnd(triggerContainer);

    // Assert (Oculto): Verificamos que el contenedor está oculto y guardado en localStorage.
    expect(triggerContainer.style.display).toBe('none');
    expect(localStorage.getItem('theme-button-hidden')).toBe('true');

    // Act (Restaurar): Simula la pulsación de la tecla de atajo.
    fireEvent.keyDown(window, { key: 't' });
    // Avanzamos el tiempo para que se ejecute el setTimeout que restaura el botón.
    jest.runAllTimers();

    // Assert (Restaurado): Verificamos que el contenedor es visible de nuevo.
    expect(triggerContainer.style.display).toBe('flex');
    expect(localStorage.getItem('theme-button-hidden')).toBeNull();
  });

  test('debería ejecutar el tutorial de bienvenida correctamente', () => {
    // Arrange: Habilitamos temporizadores falsos para los `setTimeout` del tutorial.
    jest.useFakeTimers();

    // Aseguramos que el tutorial no se ha completado.
    localStorage.removeItem('theme-tutorial-completed');

    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };
    new AutoTheme(myBrandColors, { shortcutKey: 't' });

    const triggerContainer = document.getElementById('theme-toggle-container');
    const toggleButton = document.getElementById('theme-toggle-button');
    const closeButton = triggerContainer.querySelector('button[aria-label*="Ocultar"]');

    // Assert: Estado inicial del tutorial
    expect(triggerContainer.classList.contains('tutorial-active')).toBe(true);
    expect(closeButton.style.display).toBe('none');

    // Act: Paso 1 - El usuario pasa el ratón por encima, iniciando el tutorial.
    fireEvent.mouseOver(toggleButton);

    // Assert: Paso 1 - El botón destella y aparece el primer tooltip.
    expect(toggleButton.classList.contains('sparkle')).toBe(true);
    let tooltip = document.getElementById('theme-tutorial-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip.textContent).toContain("Pulsa la tecla 'T'");

    // Act: Paso 2 - El usuario pulsa la tecla de atajo.
    fireEvent.keyDown(window, { key: 't' });

    // Assert: Paso 2 - Se revela el botón de cierre y el tooltip cambia.
    expect(closeButton.style.display).toBe('flex');
    expect(closeButton.classList.contains('tutorial-reveal')).toBe(true);
    expect(tooltip.textContent).toContain('Con esto, puedes ocultarme...');

    // Act: Paso 3 - Avanzamos el tiempo para el siguiente mensaje del tooltip.
    jest.runAllTimers();

    // Assert: Paso 3 - El tooltip vuelve a cambiar y el tutorial finaliza.
    expect(tooltip.textContent).toContain('para una sorpresa');
    fireEvent.keyDown(window, { key: 't' }); // Última pulsación para terminar
    expect(localStorage.getItem('theme-tutorial-completed')).toBe('true');
    expect(triggerContainer.classList.contains('tutorial-active')).toBe(false);
  });

  test('debería manejar casos límite y errores de configuración', () => {
    // Arrange: Mock de console.error para verificar que se reportan los errores.
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act 1: Inicializar con opciones inválidas.
    new AutoTheme({ surface: '#fff', text: '#000' }, 'opciones-invalidas');

    // Assert 1: Debería registrar un error.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'AutoTheme Error: buttonOptions must be an object. Using default options.'
    );

    // Act 2: Inicializar con un color HEX inválido.
    new AutoTheme({ surface: 'no-es-un-color', text: '#000' });

    // Assert 2: Debería registrar un error y usar el color por defecto.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'AutoTheme Error: Invalid HEX color format for "surface": no-es-un-color. Using default.'
    );

    // Act 3: El usuario tiene preferencia explícita por el tema claro.
    localStorage.setItem('theme-preference', 'light');
    new AutoTheme({ surface: '#fff', text: '#000' });
    // Assert 3: El tema no debe estar invertido.
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  test('debería ocultar el círculo y los satélites al hacer clic en el botón de cierre', () => {
    // Arrange: Preparamos el entorno para la prueba.
    // Simulamos que el tutorial ya se completó para que los botones satélite sean visibles.
    localStorage.setItem('theme-tutorial-completed', 'true');
    const myBrandColors = { surface: '#ffffff', text: '#2c3e50' };
    new AutoTheme(myBrandColors);

    const triggerContainer = document.getElementById('theme-toggle-container');
    const closeButton = triggerContainer.querySelector('button[aria-label*="Ocultar"]');
    const orbitWrapper = document.getElementById('theme-orbit-wrapper');

    // Assert (Estado Inicial): Verificamos que todo está visible y animado.
    expect(triggerContainer.style.display).not.toBe('none');
    expect(orbitWrapper.style.animationPlayState).toBe('running');

    // Act: El usuario hace clic en el botón de cerrar.
    fireEvent.click(closeButton);
    // Simulamos el final de la animación de "destrucción".
    fireEvent.animationEnd(triggerContainer);

    // Assert (Estado Final): Verificamos que el contenedor está oculto y la preferencia guardada.
    expect(triggerContainer.style.display).toBe('none');
    expect(localStorage.getItem('theme-button-hidden')).toBe('true');
  });
});