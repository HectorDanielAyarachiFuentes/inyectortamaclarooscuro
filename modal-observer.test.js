// c:\Users\Ramoncito\Documents\GitHub\inyectortamaclarooscuro\modal-observer.test.js

// Importamos la clase AutoTheme, ya que #initializeModalObserver es un método privado
// que se llama durante la instanciación.
import { AutoTheme } from './theme-generator.js';

// Mock de matchMedia, necesario para que el constructor de AutoTheme no falle.
global.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }));

describe('AutoTheme - Detección Automática de Modales', () => {
  let mockMutationObserver;
  let observeSpy;
  let disconnectSpy;
  let getComputedStyleSpy;
  let observerCallbacks = []; // Array para almacenar las callbacks de los observers

  // Antes de cada prueba, reseteamos el DOM y mockeamos MutationObserver
  beforeEach(() => {
    // Limpiamos el DOM para cada prueba
    document.body.innerHTML = '';

    // Mockeamos MutationObserver
    observeSpy = jest.fn();
    disconnectSpy = jest.fn();

    observerCallbacks = []; // Limpiamos el array en cada prueba
    mockMutationObserver = jest.fn((callback) => {
      // Guardamos cada callback que se registra
      observerCallbacks.push(callback);
      return {
        observe: observeSpy,
        disconnect: disconnectSpy,
      };
    });

    // Reemplazamos el MutationObserver global con nuestro mock
    global.MutationObserver = mockMutationObserver;

    // Mockeamos getComputedStyle de forma global para todas las pruebas en este describe.
    // Lo hacemos aquí para que esté disponible ANTES de que se llame a `new AutoTheme()`.
    // Por defecto, devuelve un estilo de elemento no-modal.
    getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({ position: 'static', zIndex: '1', backgroundImage: 'none' });

    // Mock para evitar el error de parsing de CSS en JSDOM.
    // Esto previene que los estilos se inyecten en el head durante las pruebas.
    jest.spyOn(document.head, 'appendChild').mockImplementation(el => {
      if (el.tagName === 'STYLE') return null;
    });
  });

  afterEach(() => {
    // Limpiamos los mocks después de cada prueba
    jest.clearAllMocks();
  });

  test('debería inicializar un MutationObserver y comenzar a observar el body', () => {
    // Al crear una instancia de AutoTheme, se llama a #init() y, por lo tanto, a #initializeModalObserver()
    new AutoTheme();

    // Verificamos que MutationObserver fue instanciado
    expect(mockMutationObserver).toHaveBeenCalledTimes(2); // Ahora esperamos 2: modal y atributos del body
    // Verificamos que observe fue llamado con el body y la configuración correcta
    expect(observeSpy).toHaveBeenCalledTimes(2);
    expect(observeSpy).toHaveBeenCalledWith(document.body, { childList: true, subtree: true });
    expect(observeSpy).toHaveBeenCalledWith(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
  });

  test('debería añadir "data-theme-exclude" a un elemento modal-like añadido al DOM', () => {
    // Espiamos console.log para verificar que se registra el mensaje de detección.
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Simula la adición de un elemento que parece un modal
    const modalElement = document.createElement('div');
    modalElement.id = 'myModal';

    // Configuramos el mock para que devuelva estilos de modal CUANDO se le pregunte por `modalElement`.
    getComputedStyleSpy.mockImplementation(el => (el === modalElement ? {
      position: 'fixed',
      zIndex: '1001', // Un z-index > 1000
    } : { position: 'static', zIndex: '1', backgroundImage: 'none' }));

    new AutoTheme();
    document.body.appendChild(modalElement);

    // La primera callback registrada es la del observador de modales.
    const modalObserverCallback = observerCallbacks[0];

    // Invoca manualmente la callback del MutationObserver para simular un cambio
    if (modalObserverCallback) {
      modalObserverCallback([
        {
          type: 'childList',
          addedNodes: [modalElement],
          target: document.body,
        },
      ]);
    }

    // Verifica que al elemento se le añadió el atributo de exclusión.
    expect(modalElement.hasAttribute('data-theme-exclude')).toBe(true);
    expect(modalElement.getAttribute('data-theme-exclude')).toBe('modal-auto');

    // Verifica que se ha logueado el mensaje esperado
    expect(consoleSpy).toHaveBeenCalledWith('AutoTheme: Modal-like element detected. Applying exclusion.', modalElement);

    consoleSpy.mockRestore();
  });

  test('no debería añadir "data-theme-exclude" a elementos que no son modales', () => {
    const nonModalElement = document.createElement('div');
    nonModalElement.id = 'notAModal';

    // Nos aseguramos de que el mock devuelva estilos de no-modal para este elemento.
    getComputedStyleSpy.mockReturnValue({
      position: 'static', // Estilo de un elemento normal
      zIndex: '1',
      backgroundImage: 'none'
    });
    new AutoTheme();
    document.body.appendChild(nonModalElement);

    // La primera callback registrada es la del observador de modales.
    const modalObserverCallback = observerCallbacks[0];

    if (modalObserverCallback) {
      modalObserverCallback([
        {
          type: 'childList',
          addedNodes: [nonModalElement],
          target: document.body,
        },
      ]);
    }

    // Verifica que el elemento no modal NO tiene el atributo de exclusión.
    expect(nonModalElement.hasAttribute('data-theme-exclude')).toBe(false);
  });

  test('debería añadir el atributo de exclusión a un elemento con la API Popover', () => {
    const popoverElement = document.createElement('div');
    popoverElement.setAttribute('popover', 'auto');
    document.body.appendChild(popoverElement);

    new AutoTheme();

    // La primera callback registrada es la del observador de modales.
    const modalObserverCallback = observerCallbacks[0];

    // La lógica para popovers no está en el MutationObserver, sino en un listener 'toggle'.
    // Primero, simulamos que el nodo es añadido para que el listener se adjunte.
    if (modalObserverCallback) {
      modalObserverCallback([
        {
          type: 'childList',
          addedNodes: [popoverElement],
          target: document.body,
        },
      ]);
    }

    // Ahora, simulamos el evento 'toggle' que se dispara cuando el popover se abre.
    const toggleEvent = new Event('toggle');
    Object.defineProperty(toggleEvent, 'newState', { value: 'open' });
    popoverElement.dispatchEvent(toggleEvent);

    // Verificamos que el atributo de exclusión se ha añadido.
    expect(popoverElement.getAttribute('data-theme-exclude')).toBe('popover-auto');
  });

  test('debería desconectar el observer cuando se llama al método destroy()', () => {
    const themeInstance = new AutoTheme();

    // El observer debería estar activo después de la inicialización.
    expect(observeSpy).toHaveBeenCalledTimes(2);
    expect(disconnectSpy).not.toHaveBeenCalled(); // Ninguno se ha desconectado aún

    // Llamamos al método de limpieza.
    themeInstance.destroy();

    // Verificamos que el observer de modales se ha desconectado.
    expect(disconnectSpy).toHaveBeenCalledTimes(2);
  });
});