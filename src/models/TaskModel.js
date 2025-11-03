/**
 * MODELO (Model) - Patrón MVC
 *
 * Responsabilidades:
 * - Gestionar los datos de las tareas (array de tareas)
 * - Proveer métodos para manipular datos (CRUD)
 * - Implementar patrón Observer para notificar cambios
 * - NO tiene conocimiento del DOM ni de la Vista
 * - Es la única fuente de verdad de los datos
 */

class TaskModel {
  constructor() {
    // Array de tareas - estructura: { id, text, description, status, priority, dueDate, createdAt }
    // status: 'not-started' | 'in-progress' | 'done'
    this.tasks = [];

    // Patrón Observer: función callback que se ejecutará cuando cambien los datos
    this.onTasksChanged = null;
  }

  /**
   * Vincula un callback para notificar cambios en los datos
   * @param {Function} callback - Función que se ejecutará cuando cambien las tareas
   */
  bindTasksChanged(callback) {
    this.onTasksChanged = callback;
  }

  /**
   * Notifica a los observadores (normalmente la Vista) que los datos cambiaron
   * @param {Array} tasks - Array actualizado de tareas
   */
  _commit(tasks) {
    if (this.onTasksChanged) {
      this.onTasksChanged(tasks);
    }
  }

  /**
   * Agrega una nueva tarea
   * @param {Object} taskData - Datos de la tarea { text, description, priority, dueDate }
   * @returns {Object} La tarea creada
   */
  addTask(taskData) {
    const task = {
      id: this._generateId(),
      text: taskData.text.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      status: 'not-started',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    this._commit(this.tasks);

    return task;
  }

  /**
   * Edita una tarea existente
   * @param {number} id - ID de la tarea a editar
   * @param {Object} updates - Objeto con los campos a actualizar
   */
  editTask(id, updates) {
    const task = this.tasks.find(task => task.id === id);

    if (task) {
      if (updates.text !== undefined) task.text = updates.text.trim();
      if (updates.description !== undefined) task.description = updates.description.trim();
      if (updates.priority !== undefined) task.priority = updates.priority;
      if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
      if (updates.status !== undefined) task.status = updates.status;

      this._commit(this.tasks);
    }
  }

  /**
   * Elimina una tarea por su ID
   * @param {number} id - ID de la tarea a eliminar
   */
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this._commit(this.tasks);
  }

  /**
   * Cambia el estado de una tarea al siguiente estado
   * Ciclo: not-started -> in-progress -> done -> not-started
   * @param {number} id - ID de la tarea
   */
  toggleTask(id) {
    const task = this.tasks.find(task => task.id === id);

    if (task) {
      // Ciclo de estados
      if (task.status === 'not-started') {
        task.status = 'in-progress';
      } else if (task.status === 'in-progress') {
        task.status = 'done';
      } else {
        task.status = 'not-started';
      }

      this._commit(this.tasks);
    }
  }

  /**
   * Cambia el estado de una tarea a un estado específico
   * @param {number} id - ID de la tarea
   * @param {string} status - Nuevo estado: 'not-started' | 'in-progress' | 'done'
   */
  setTaskStatus(id, status) {
    const task = this.tasks.find(task => task.id === id);

    if (task && ['not-started', 'in-progress', 'done'].includes(status)) {
      task.status = status;
      this._commit(this.tasks);
    }
  }

  /**
   * Establece todas las tareas (usado para cargar desde Storage)
   * @param {Array} tasks - Array de tareas
   */
  setTasks(tasks) {
    this.tasks = tasks;
    this._commit(this.tasks);
  }

  /**
   * Obtiene todas las tareas
   * @returns {Array} Array de todas las tareas
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * Obtiene tareas filtradas por estado
   * @param {string} filter - 'all', 'active', 'completed', 'high-priority'
   * @returns {Array} Array de tareas filtradas
   */
  getFilteredTasks(filter) {
    switch (filter) {
      case 'active':
        return this.tasks.filter(task => task.status !== 'done');
      case 'completed':
        return this.tasks.filter(task => task.status === 'done');
      case 'high-priority':
        return this.tasks.filter(task => task.priority === 'high');
      case 'all':
      default:
        return this.tasks;
    }
  }

  /**
   * Obtiene estadísticas de las tareas
   * @returns {Object} Objeto con total, completadas y pendientes
   */
  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.status === 'done').length;
    const active = total - completed;
    const inProgress = this.tasks.filter(task => task.status === 'in-progress').length;
    const notStarted = this.tasks.filter(task => task.status === 'not-started').length;
    const highPriority = this.tasks.filter(task => task.priority === 'high' && task.status !== 'done').length;

    return { total, completed, active, inProgress, notStarted, highPriority };
  }

  /**
   * Genera un ID único para cada tarea
   * @private
   * @returns {number} ID único basado en timestamp y random
   */
  _generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
}

// Exportar para uso en módulos ES6
export default TaskModel;
