/**
 * PUNTO DE ENTRADA DE LA APLICACIÓN (app.js)
 *
 * Responsabilidades:
 * - Inicializar las tres capas del patrón MVC
 * - Crear instancias del Modelo, Vista y Controlador
 * - Conectar los componentes entre sí
 * - Iniciar la aplicación
 *
 * FLUJO DE INICIALIZACIÓN:
 * 1. Importar módulos necesarios
 * 2. Crear instancia del Modelo (datos)
 * 3. Crear instancia de la Vista (UI)
 * 4. Crear instancia del Storage (persistencia)
 * 5. Crear instancia del Controlador (coordinación)
 * 6. El Controlador conecta automáticamente Modelo y Vista
 */

// Importar las tres capas del patrón MVC
import TaskModel from './src/models/TaskModel.js';
import TaskView from './src/views/TaskView.js';
import TaskController from './src/controllers/TaskController.js';

// Importar utilidades
import Storage from './src/utils/Storage.js';

/**
 * Clase principal de la aplicación
 * Gestiona la inicialización del patrón MVC
 */
class App {
  constructor() {
    // Banner de bienvenida en consola
    this._showWelcomeBanner();

    // Verificar que localStorage esté disponible
    const storage = new Storage();
    if (!storage.isAvailable()) {
      console.warn('[App] localStorage not available. Tasks will not be persisted.');
    }

    // PASO 1: Crear instancia del MODELO
    // El Modelo gestiona los datos de las tareas
    const model = new TaskModel();

    // PASO 2: Crear instancia de la VISTA
    // La Vista gestiona el DOM y la interfaz de usuario
    const view = new TaskView();

    // PASO 3: Crear instancia del servicio de STORAGE
    // Storage gestiona la persistencia en localStorage
    const storageService = new Storage();

    // PASO 4: Crear instancia del CONTROLADOR
    // El Controlador conecta Modelo y Vista, y gestiona la lógica de negocio
    const controller = new TaskController(model, view, storageService);

    // Guardar referencia para acceso global (útil para debugging)
    window.app = {
      model,
      view,
      controller,
      storage: storageService,
      getState: () => controller.getState()
    };

    console.log('[App] MVC application initialized successfully');
    console.log('[App] Tip: Use window.app in console to inspect state');
  }

  /**
   * Muestra un banner de bienvenida en la consola
   * @private
   */
  _showWelcomeBanner() {
    const banner = `
==============================================
  TASKS TRACKER - MVC PATTERN DEMO
==============================================
  Architecture: Model-View-Controller
  Technologies: JavaScript Vanilla ES6+
  Persistence: localStorage
==============================================
    `;

    console.log(banner);
    console.log('[App] Initializing MVC components...\n');
  }
}

/**
 * Esperar a que el DOM esté completamente cargado
 * antes de inicializar la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar la aplicación
  new App();
});

/**
 * DEBUGGING HELPERS
 * Funciones útiles para desarrollo y testing
 */

// Agregar tareas de ejemplo (útil para testing)
window.addDemoTasks = function() {
  if (!window.app) {
    console.error('[App] Application is not initialized');
    return;
  }

  const demoTasks = [
    {
      text: 'Learn MVC pattern',
      description: 'Understand Model-View-Controller architecture',
      priority: 'high',
      dueDate: '2025-01-15'
    },
    {
      text: 'Implement CRUD operations',
      description: 'Create, Read, Update, Delete functionality',
      priority: 'medium',
      dueDate: '2025-01-20'
    },
    {
      text: 'Add localStorage persistence',
      description: 'Save tasks to browser storage',
      priority: 'medium',
      dueDate: '2025-01-22'
    },
    {
      text: 'Create responsive design',
      description: 'Make UI work on all devices',
      priority: 'low',
      dueDate: '2025-01-25'
    },
    {
      text: 'Document the code',
      description: 'Add comprehensive code comments',
      priority: 'low',
      dueDate: '2025-01-30'
    }
  ];

  demoTasks.forEach(task => {
    window.app.controller.handleAddTask(task);
  });

  console.log('[App] Demo tasks added successfully');
};

// Exportar datos
window.exportTasks = function() {
  if (!window.app) {
    console.error('[App] Application is not initialized');
    return;
  }

  window.app.storage.exportToFile();
};

// Limpiar todos los datos
window.clearAllData = function() {
  if (!window.app) {
    console.error('[App] Application is not initialized');
    return;
  }

  if (confirm('Are you sure you want to delete ALL tasks?')) {
    window.app.storage.clearTasks();
    window.location.reload();
  }
};

// Mostrar estado actual
window.showState = function() {
  if (!window.app) {
    console.error('[App] Application is not initialized');
    return;
  }

  const state = window.app.getState();
  console.table(state.tasks);
  console.log('Statistics:', state.stats);
  console.log('Current filter:', state.filter);
};

console.log('[App] Available console commands:');
console.log('   - addDemoTasks()  : Add demo tasks');
console.log('   - exportTasks()   : Export tasks to JSON');
console.log('   - clearAllData()  : Clear all tasks');
console.log('   - showState()     : Show current state');
