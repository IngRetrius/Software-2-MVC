/**
 * SERVICIO DE ALMACENAMIENTO (Storage)
 *
 * Responsabilidades:
 * - Gestionar la persistencia de datos en localStorage
 * - Proporcionar una API simple para guardar y recuperar tareas
 * - Manejar errores de almacenamiento
 * - Serializar y deserializar datos JSON
 *
 * Este es un servicio auxiliar que NO forma parte del patrón MVC,
 * pero es usado por el Controlador para persistir datos.
 */

class Storage {
  /**
   * Constructor del servicio de almacenamiento
   * @param {string} key - Clave para almacenar en localStorage (default: 'mvc-todo-tasks')
   */
  constructor(key = 'mvc-todo-tasks') {
    this.STORAGE_KEY = key;
  }

  /**
   * Guarda las tareas en localStorage
   * @param {Array} tasks - Array de tareas a guardar
   * @returns {boolean} true si se guardó exitosamente, false en caso de error
   */
  saveTasks(tasks) {
    try {
      const tasksJSON = JSON.stringify(tasks);
      localStorage.setItem(this.STORAGE_KEY, tasksJSON);
      console.log('[Storage] Tasks saved to localStorage');
      return true;
    } catch (error) {
      console.error('[Storage] Error saving tasks:', error);

      // Manejar quota exceeded (límite de almacenamiento)
      if (error.name === 'QuotaExceededError') {
        alert('No hay espacio suficiente en el almacenamiento local');
      }

      return false;
    }
  }

  /**
   * Recupera las tareas desde localStorage
   * @returns {Array} Array de tareas o array vacío si no hay datos
   */
  getTasks() {
    try {
      const tasksJSON = localStorage.getItem(this.STORAGE_KEY);

      if (!tasksJSON) {
        console.log('[Storage] No saved tasks');
        return [];
      }

      const tasks = JSON.parse(tasksJSON);
      console.log(`[Storage] ${tasks.length} tasks loaded from localStorage`);

      // Validar que sea un array
      if (!Array.isArray(tasks)) {
        console.warn('[Storage] Corrupted data in localStorage, returning empty array');
        return [];
      }

      // Migrar tareas antiguas con 'completed' a nuevo formato con 'status'
      const migratedTasks = tasks.map(task => {
        if (task.completed !== undefined && task.status === undefined) {
          return {
            ...task,
            status: task.completed ? 'done' : 'not-started'
          };
        }
        return task;
      });

      return migratedTasks;
    } catch (error) {
      console.error('[Storage] Error loading tasks:', error);
      return [];
    }
  }

  /**
   * Elimina todas las tareas del almacenamiento
   * @returns {boolean} true si se eliminó exitosamente
   */
  clearTasks() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('[Storage] All tasks cleared from storage');
      return true;
    } catch (error) {
      console.error('[Storage] Error clearing tasks:', error);
      return false;
    }
  }

  /**
   * Verifica si localStorage está disponible
   * @returns {boolean} true si localStorage está disponible
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('[Storage] localStorage is not available');
      return false;
    }
  }

  /**
   * Obtiene el tamaño aproximado de los datos almacenados
   * @returns {number} Tamaño en bytes (aproximado)
   */
  getStorageSize() {
    try {
      const tasksJSON = localStorage.getItem(this.STORAGE_KEY);
      if (!tasksJSON) return 0;

      // Calcular tamaño aproximado en bytes
      return new Blob([tasksJSON]).size;
    } catch (error) {
      console.error('[Storage] Error calculating size:', error);
      return 0;
    }
  }

  /**
   * Exporta las tareas como archivo JSON descargable
   * @returns {boolean} true si se exportó exitosamente
   */
  exportToFile() {
    try {
      const tasks = this.getTasks();

      if (tasks.length === 0) {
        alert('No hay tareas para exportar');
        return false;
      }

      const dataStr = JSON.stringify(tasks, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      // Crear link de descarga
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tareas-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log('[Storage] Tasks exported successfully');
      return true;
    } catch (error) {
      console.error('[Storage] Error exporting tasks:', error);
      return false;
    }
  }

  /**
   * Importa tareas desde un objeto JSON
   * @param {Array} tasks - Array de tareas a importar
   * @returns {boolean} true si se importó exitosamente
   */
  importTasks(tasks) {
    try {
      if (!Array.isArray(tasks)) {
        throw new Error('Los datos deben ser un array');
      }

      // Validar estructura básica de cada tarea
      const isValid = tasks.every(task =>
        task.hasOwnProperty('id') &&
        task.hasOwnProperty('text') &&
        task.hasOwnProperty('completed')
      );

      if (!isValid) {
        throw new Error('Estructura de tareas inválida');
      }

      this.saveTasks(tasks);
      console.log('[Storage] Tasks imported successfully');
      return true;
    } catch (error) {
      console.error('[Storage] Error importing tasks:', error);
      alert('Error al importar tareas: ' + error.message);
      return false;
    }
  }
}

export default Storage;
