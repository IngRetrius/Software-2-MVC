/**
 * CONTROLADOR (Controller) - Patrón MVC
 *
 * Responsabilidades:
 * - Actúa como intermediario entre Modelo y Vista
 * - Maneja la lógica de negocio (validaciones, reglas)
 * - Procesa las entradas del usuario desde la Vista
 * - Actualiza el Modelo con los cambios
 * - Coordina la actualización de la Vista cuando cambia el Modelo
 * - Gestiona la persistencia de datos (usando Storage)
 */

class TaskController {
  /**
   * Constructor del controlador
   * @param {TaskModel} model - Instancia del modelo
   * @param {TaskView} view - Instancia de la vista
   * @param {Storage} storage - Instancia del servicio de almacenamiento
   */
  constructor(model, view, storage) {
    this.model = model;
    this.view = view;
    this.storage = storage;

    // Filtro actual
    this.currentFilter = 'all';

    // Vincular los eventos de la Vista con los métodos del Controlador
    this._bindViewEvents();

    // Vincular el Modelo con el Controlador (patrón Observer)
    this.model.bindTasksChanged(this.onTasksChanged.bind(this));

    // Cargar tareas desde el almacenamiento al inicializar
    this._loadTasksFromStorage();

    // Renderizar estado inicial
    this._renderTasks();
  }

  /**
   * Carga las tareas desde localStorage
   * @private
   */
  _loadTasksFromStorage() {
    const tasks = this.storage.getTasks();
    if (tasks && tasks.length > 0) {
      this.model.setTasks(tasks);
    }
  }

  /**
   * Guarda las tareas en localStorage
   * @private
   */
  _saveTasksToStorage() {
    this.storage.saveTasks(this.model.getTasks());
  }

  /**
   * Vincula todos los eventos de la Vista con los handlers del Controlador
   * @private
   */
  _bindViewEvents() {
    this.view.bindShowModal();
    this.view.bindHideModal();
    this.view.bindAddTask(this.handleAddTask.bind(this));
    this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
    this.view.bindToggleTask(this.handleToggleTask.bind(this));
    this.view.bindChangeStatus(this.handleToggleTask.bind(this));
    this.view.bindFilterTasks(this.handleFilterTasks.bind(this));
  }

  /**
   * Renderiza las tareas según el filtro actual
   * @private
   */
  _renderTasks() {
    const tasks = this.model.getFilteredTasks(this.currentFilter);
    this.view.displayTasks(tasks);
  }

  /**
   * Callback que se ejecuta cuando el Modelo notifica cambios (patrón Observer)
   * @param {Array} tasks - Array actualizado de tareas
   */
  onTasksChanged(tasks) {
    // Guardar en localStorage
    this._saveTasksToStorage();

    // Re-renderizar la vista
    this._renderTasks();
  }

  /**
   * Handler: Agregar nueva tarea
   * @param {Object} taskData - Datos de la tarea
   */
  handleAddTask(taskData) {
    // Validación de entrada
    if (!taskData.text || taskData.text.trim().length === 0) {
      alert('Please enter a task name');
      return;
    }

    if (taskData.text.length > 200) {
      alert('Task name is too long (max 200 characters)');
      return;
    }

    if (taskData.description && taskData.description.length > 500) {
      alert('Description is too long (max 500 characters)');
      return;
    }

    // Delegar al Modelo la creación de la tarea
    this.model.addTask(taskData);

    console.log('[TaskController] Task added successfully');
  }

  /**
   * Handler: Eliminar una tarea
   * @param {number} id - ID de la tarea a eliminar
   */
  handleDeleteTask(id) {
    // Delegar al Modelo la eliminación
    this.model.deleteTask(id);

    console.log('[TaskController] Task deleted');
  }

  /**
   * Handler: Alternar estado completado/pendiente
   * @param {number} id - ID de la tarea
   */
  handleToggleTask(id) {
    // Delegar al Modelo el toggle
    this.model.toggleTask(id);

    console.log('[TaskController] Task status updated');
  }

  /**
   * Handler: Editar una tarea
   * @param {number} id - ID de la tarea
   * @param {Object} updates - Campos a actualizar
   */
  handleEditTask(id, updates) {
    // Validación
    if (updates.text !== undefined && updates.text.trim().length === 0) {
      alert('Task name cannot be empty');
      return;
    }

    if (updates.text && updates.text.length > 200) {
      alert('Task name is too long (max 200 characters)');
      return;
    }

    if (updates.description && updates.description.length > 500) {
      alert('Description is too long (max 500 characters)');
      return;
    }

    // Delegar al Modelo la edición
    this.model.editTask(id, updates);

    console.log('[TaskController] Task edited');
  }

  /**
   * Handler: Filtrar tareas por estado
   * @param {string} filter - 'all', 'active', 'completed', 'high-priority'
   */
  handleFilterTasks(filter) {
    // Actualizar filtro actual
    this.currentFilter = filter;

    // Actualizar UI de los tabs
    this.view.updateTabButtons(filter);

    // Re-renderizar con el nuevo filtro
    this._renderTasks();

    console.log(`[TaskController] Filter applied: ${filter}`);
  }

  /**
   * Método público para obtener el estado actual de la aplicación
   * @returns {Object} Estado actual
   */
  getState() {
    return {
      tasks: this.model.getTasks(),
      stats: this.model.getStats(),
      filter: this.currentFilter
    };
  }
}

export default TaskController;
