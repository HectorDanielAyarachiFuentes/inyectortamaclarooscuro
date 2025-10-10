import { fireEvent } from '@testing-library/dom';
import { GradientSelector, GRADIENTS } from './theme-generator.js';

// Mock de localStorage para este conjunto de pruebas
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

describe('GradientSelector', () => {
  // Limpia el DOM y localStorage antes de cada prueba
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  test('debería inicializarse correctamente y crear el modal (oculto por defecto)', () => {
    // Arrange & Act
    new GradientSelector(GRADIENTS);

    // Assert
    const modal = document.getElementById('gradient-selector-modal');
    const backgroundLayer = document.getElementById('gradient-background-layer');

    expect(modal).not.toBeNull();
    expect(backgroundLayer).not.toBeNull();
    expect(modal.style.display).toBe('none'); // Debe estar oculto
  });

  test('debería mostrar y ocultar el modal con toggleModal()', () => {
    // Arrange
    const selector = new GradientSelector(GRADIENTS);
    const modal = document.getElementById('gradient-selector-modal');

    // Act: Mostrar el modal
    selector.toggleModal(true);
    // Assert: El modal debe estar visible
    expect(modal.style.display).toBe('block');

    // Act: Ocultar el modal
    selector.toggleModal(false);
    // Assert: El modal debe estar oculto
    expect(modal.style.display).toBe('none');
  });

  test('debería aplicar un degradado al hacer clic en una muestra', () => {
    // Arrange
    new GradientSelector(GRADIENTS);
    const backgroundLayer = document.getElementById('gradient-background-layer');
    const modal = document.getElementById('gradient-selector-modal');
    const firstSwatch = modal.querySelector('div[title]'); // Selecciona la primera muestra de color

    // Act
    fireEvent.click(firstSwatch);

    // Assert
    const selectedGradient = GRADIENTS[0].gradient;
    expect(backgroundLayer.style.background).toBe(selectedGradient);
    expect(backgroundLayer.style.opacity).toBe('1');
    expect(localStorage.getItem('selected-gradient')).toBe(selectedGradient);
    expect(modal.style.display).toBe('none'); // El modal debe cerrarse
  });

  test('debería quitar el degradado al hacer clic en "Quitar Fondo"', () => {
    // Arrange
    const selector = new GradientSelector(GRADIENTS);
    selector.toggleModal(true); // Abrimos el modal para que el botón exista
    const backgroundLayer = document.getElementById('gradient-background-layer');
    const removeButton = document.querySelector('#gradient-selector-modal button'); // Selector más específico

    // Act
    fireEvent.click(removeButton);

    // Assert
    expect(backgroundLayer.style.opacity).toBe('0');
    expect(['', null]).toContain(localStorage.getItem('selected-gradient'));
  });

  test('debería aplicar el degradado guardado al inicializar', () => {
    // Arrange: Guardamos un degradado en localStorage antes de inicializar
    const savedGradient = GRADIENTS[5].gradient;
    localStorage.setItem('selected-gradient', savedGradient);

    // Act
    new GradientSelector(GRADIENTS);

    // Assert
    const backgroundLayer = document.getElementById('gradient-background-layer');
    expect(backgroundLayer.style.background).toBe(savedGradient);
    expect(backgroundLayer.style.opacity).toBe('1');
  });

  test('debería abrir y cerrar el modal con el atajo de teclado', () => {
    // Arrange
    new GradientSelector(GRADIENTS, { shortcutKey: 'g' });
    const modal = document.getElementById('gradient-selector-modal');

    // Assert: Estado inicial
    expect(modal.style.display).toBe('none');

    // Act: Simular pulsación para abrir
    fireEvent.keyDown(window, { key: 'g' });
    // Assert: Modal visible
    expect(modal.style.display).toBe('block');

    // Act: Simular pulsación para cerrar
    fireEvent.keyDown(window, { key: 'g' });
    // Assert: Modal oculto
    expect(modal.style.display).toBe('none');
  });
});