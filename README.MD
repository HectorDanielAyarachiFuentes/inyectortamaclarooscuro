# Inyector de Tema Dinámico (Claro/Oscuro) - AutoTheme.js

`AutoTheme.js` es un script de JavaScript robusto y sin dependencias que permite inyectar un completo sistema de cambio de tema (claro/oscuro) en cualquier página web con una sola línea de código. Lo que comenzó como un simple inversor de colores ha evolucionado hasta convertirse en una herramienta inteligente y resiliente, capaz de manejar los escenarios más complejos de CSS y del DOM moderno.

**Ver Demo en Vivo**

!Demostración del botón de tema y sus animaciones

---

## ✨ Características Principales

*   **Inversión Inteligente:** Utiliza un filtro CSS de `invert(1) hue-rotate(180deg)` para un cambio de tema instantáneo y de alto rendimiento, ajustando los matices para que los colores (como el azul) no se conviertan en sus opuestos indeseados (amarillo).
*   **Botón Flotante Interactivo:**
    *   **Arrastrable:** El usuario puede mover el botón a cualquier lugar de la pantalla.
    *   **Posición Recordada:** Guarda la posición del botón en `localStorage`.
    *   **Estela de Partículas:** Un efecto visual de partículas de "fuego" (tema claro) o "hielo" (tema oscuro) sigue al botón mientras se arrastra.
    *   **Órbita de Satélites:** Los botones de opciones (ocultar, selector de fondos) orbitan alrededor del botón principal con una animación fluida.
*   **Detección Automática del Sistema:** Aplica el tema oscuro o claro basándose en la preferencia del sistema operativo del usuario en la primera visita.
*   **Persistencia:** Guarda la elección manual del usuario en `localStorage`, dándole prioridad sobre la configuración del sistema en visitas posteriores.
*   **Exclusiones Inteligentes:**
    *   **Automáticas:** Excluye automáticamente imágenes (`<img>`), videos (`<video>`), `iframes`, y elementos con imágenes de fondo para evitar su inversión. En su lugar, les aplica un sutil filtro de brillo y contraste en modo oscuro.
    *   **Detección de Modales:** Usa un `MutationObserver` para detectar dinámicamente la aparición de modales, popups o cualquier elemento con `z-index` alto, excluyéndolos del filtro para que se muestren correctamente.
    *   **Manejo de `top-layer`:** Gestiona de forma explícita los elementos de la "capa superior" como `<dialog>` y la API de `popover`, que no son afectados por el filtro del `<html>`.
    *   **Manual:** Permite excluir elementos específicos mediante selectores CSS o funciones de callback.
*   **Sincronización con `iframes`:** El script es capaz de inyectarse a sí mismo en `iframes` del mismo origen para mantener el tema sincronizado en toda la aplicación.
*   **Tutorial Interactivo:** La primera vez que un usuario interactúa con el botón, un pequeño tutorial guiado le enseña a usar las funciones de ocultar y las opciones adicionales.
*   **Selector de Fondos (Opcional):** Incluye una clase `GradientSelector` que añade un modal para que el usuario pueda elegir entre más de 200 fondos de degradado para la página.
*   **Accesibilidad:** Incluye atributos `aria-label`, `aria-pressed` y una región `aria-live` para anunciar los cambios de tema a los lectores de pantalla.
*   **Atajos de Teclado:**
    *   `T`: Restaura el botón de tema si ha sido ocultado.
    *   `G`: Abre/cierra el modal de selección de fondos.

---

## 🚀 Cómo Usarlo

La integración es increíblemente sencilla.

1.  **Incluye el script** en tu archivo HTML. Es importante que sea de tipo `module`.

    ```html
    <script type="module" src="theme-generator.js"></script>
    ```

2.  **¡Listo!** El script se inicializará automáticamente al cargar el DOM. Detectará los colores de tu página y creará el botón flotante.

### Configuración Avanzada

Dentro de `theme-generator.js`, puedes personalizar la inicialización para un control más preciso.

```javascript
// Al final del archivo theme-generator.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Define los colores base de tu tema claro.
    const myBrandColors = {
      surface: '#ffffff', // Color de fondo principal
      text: '#2c3e50'     // Color de texto principal
    };

    // 2. Instancia el selector de gradientes (opcional).
    const gradientSelector = new GradientSelector(GRADIENTS, { shortcutKey: 'g' });

    // 3. Instancia el gestor de tema con tus opciones.
    new AutoTheme(myBrandColors, {
      shortcutKey: 't', // Tecla para restaurar el botón
      gradientSelector: gradientSelector, // Inyecta la dependencia del selector de fondos
      
      // Ejemplo de exclusiones personalizadas:
      exclude: [ 
        '.logo-principal', // Excluir por selector CSS
        '#mapa-interactivo', // Excluir por ID
        (el) => el.classList.contains('no-invertir') // Excluir mediante una función
      ]
    });
});
```

---

## ⚔️ Desafíos Conquistados

Este script ha sido probado y optimizado para manejar una gran cantidad de casos límite de CSS que a menudo causan problemas con los inversores de tema. La página de demostración incluye pruebas para todos estos niveles de desafío:

### Nivel Básico
*   Pestañas, Modales, Imágenes, Videos, Iframes, Fondos CSS, Pseudo-elementos, Iconos SVG, Canvas, Formularios.

### Nivel Experto
*   Shadow DOM, `mix-blend-mode`, Filtros CSS apilados, Tablas complejas, Elementos deshabilitados.

### Nivel Pesadilla
*   `backdrop-filter`, `position: sticky`, Animaciones CSS complejas, `details` y `summary`, `clip-path` con variables CSS, `writing-mode`.

### Nivel Ultra Hard
*   Transformaciones 3D, `mask-image`, Animaciones por Scroll (`animation-timeline`), CSS Houdini (Paint API), `will-change`.

### Nivel DIOS
*   Popover API (`@top-layer`), Container Queries (`@container`), Animaciones `offset-path`, `color-mix()`, Houdini `@property`.

### Nivel Ultra Maldad
*   Elemento `<dialog>` nativo y `::backdrop`, `shape-outside`, Filtros SVG complejos, Custom Highlight API.

### Nivel APOCALIPSIS
*   Sincronización de tema con documentos HTML anidados en `<iframe>` y `<object>`.

---

## 🎨 Arte para el Alma

Este proyecto está dedicado a mi bella Dulce.

```


```

---

## Autor

*   **HECTOR DANIEL AYARACHI FUENTES**

---

## Licencia

Este proyecto está bajo la Licencia MIT.