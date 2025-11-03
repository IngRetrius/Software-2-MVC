/**
 * VISTA (View) - Patrón MVC
 *
 * Responsabilidades:
 * - Renderizar la interfaz de usuario (manipular el DOM)
 * - Capturar eventos del usuario (clicks, inputs, etc.)
 * - Mostrar los datos que recibe del Controlador
 * - NO contiene lógica de negocio
 * - Se comunica con el Controlador mediante callbacks
 */

class TaskView {
  constructor() {
    // Referencias a elementos del DOM
    this.app = document.getElementById('root');

    // Elementos del header
    this.btnNew = document.getElementById('btn-new');

    // Modal y formulario
    this.modal = document.getElementById('task-form-modal');
    this.form = document.getElementById('task-form');
    this.input = document.getElementById('task-input');
    this.descriptionInput = document.getElementById('task-description');
    this.prioritySelect = document.getElementById('task-priority');
    this.dateInput = document.getElementById('task-date');
    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.btnCancel = document.getElementById('btn-cancel');

    // Tabs (filtros)
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.currentFilter = 'all';

    // Tabla de tareas
    this.taskList = document.getElementById('task-list');

    // Estado vacío
    this.emptyState = document.getElementById('empty-state');
  }

  /**
   * Obtiene el valor actual del formulario
   * @returns {Object} Datos del formulario
   */
  get formData() {
    return {
      text: this.input.value,
      description: this.descriptionInput.value,
      priority: this.prioritySelect.value,
      dueDate: this.dateInput.value
    };
  }

  /**
   * Resetea el formulario
   */
  resetForm() {
    this.input.value = '';
    this.descriptionInput.value = '';
    this.prioritySelect.value = 'medium';
    this.dateInput.value = '';
  }

  /**
   * Muestra el modal
   */
  showModal() {
    this.modal.style.display = 'flex';
    this.input.focus();
  }

  /**
   * Oculta el modal
   */
  hideModal() {
    this.modal.style.display = 'none';
    this.resetForm();
  }

  /**
   * Renderiza la lista completa de tareas en formato tabla
   * @param {Array} tasks - Array de tareas a renderizar
   */
  displayTasks(tasks) {
    // Limpiar la tabla
    this.taskList.innerHTML = '';

    // Mostrar estado vacío si no hay tareas
    if (tasks.length === 0) {
      this.emptyState.style.display = 'flex';
      return;
    }

    this.emptyState.style.display = 'none';

    // Crear filas para cada tarea
    tasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.dataset.id = task.id;

      // Determinar el estado de la tarea
      const status = task.status || 'not-started';
      const statusText = this._getStatusText(status);

      // Formatear fecha
      const dueDate = task.dueDate ? this._formatDate(task.dueDate) : '-';

      // HTML de la fila
      tr.innerHTML = `
        <td class="col-checkbox">
          <input
            type="checkbox"
            class="task-checkbox"
            ${task.status === 'done' ? 'checked' : ''}
            aria-label="Mark task as complete"
          />
        </td>
        <td class="col-name">
          <span class="task-name ${task.status === 'done' ? 'completed' : ''}">${this._escapeHtml(task.text)}</span>
        </td>
        <td class="col-status">
          <button class="badge badge-${status} badge-clickable" data-status="${status}" aria-label="Change status">
            <span class="badge-dot"></span>
            ${statusText}
          </button>
        </td>
        <td class="col-date">
          <span class="task-date">${dueDate}</span>
        </td>
        <td class="col-priority">
          <span class="badge badge-${task.priority}">${this._capitalize(task.priority)}</span>
        </td>
        <td class="col-description">
          <span class="task-description">${this._escapeHtml(task.description || '-')}</span>
        </td>
        <td class="col-actions">
          <div class="task-actions">
            <button class="btn-action btn-delete" aria-label="Delete task" title="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;

      this.taskList.appendChild(tr);
    });
  }

  /**
   * Actualiza el estado visual de los tabs
   * @param {string} filter - Filtro activo
   */
  updateTabButtons(filter) {
    this.currentFilter = filter;

    this.tabBtns.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Vincula el evento de mostrar modal
   * @param {Function} handler - Función del controlador
   */
  bindShowModal(handler) {
    this.btnNew.addEventListener('click', () => {
      this.showModal();
    });
  }

  /**
   * Vincula el evento de ocultar modal
   */
  bindHideModal() {
    this.btnCloseModal.addEventListener('click', () => {
      this.hideModal();
    });

    this.btnCancel.addEventListener('click', () => {
      this.hideModal();
    });

    // Cerrar al hacer click en el backdrop
    this.modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      this.hideModal();
    });
  }

  /**
   * Vincula el evento de agregar tarea
   * @param {Function} handler - Función del controlador
   */
  bindAddTask(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      const data = this.formData;

      if (data.text.trim()) {
        handler(data);
        this.hideModal();
      }
    });
  }

  /**
   * Vincula el evento de eliminar tarea
   * @param {Function} handler - Función del controlador
   */
  bindDeleteTask(handler) {
    this.taskList.addEventListener('click', event => {
      if (event.target.closest('.btn-delete')) {
        const tr = event.target.closest('tr');
        const id = parseInt(tr.dataset.id);

        if (confirm('Are you sure you want to delete this task?')) {
          handler(id);
        }
      }
    });
  }

  /**
   * Vincula el evento de toggle completado (checkbox)
   * @param {Function} handler - Función del controlador
   */
  bindToggleTask(handler) {
    this.taskList.addEventListener('change', event => {
      if (event.target.classList.contains('task-checkbox')) {
        const tr = event.target.closest('tr');
        const id = parseInt(tr.dataset.id);
        handler(id);
      }
    });
  }

  /**
   * Vincula el evento de cambiar status (click en badge)
   * @param {Function} handler - Función del controlador
   */
  bindChangeStatus(handler) {
    this.taskList.addEventListener('click', event => {
      if (event.target.closest('.badge-clickable')) {
        const badge = event.target.closest('.badge-clickable');
        const tr = badge.closest('tr');
        const id = parseInt(tr.dataset.id);
        handler(id);
      }
    });
  }

  /**
   * Vincula el evento de filtrar tareas
   * @param {Function} handler - Función del controlador
   */
  bindFilterTasks(handler) {
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', event => {
        const filter = event.currentTarget.dataset.filter;
        handler(filter);
      });
    });
  }

  /**
   * Formatea una fecha
   * @private
   * @param {string} dateString - Fecha en formato ISO o YYYY-MM-DD
   * @returns {string} Fecha formateada
   */
  _formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Capitaliza la primera letra
   * @private
   * @param {string} str - Cadena a capitalizar
   * @returns {string} Cadena capitalizada
   */
  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Escapa HTML para prevenir XSS
   * @private
   * @param {string} str - Cadena a escapar
   * @returns {string} Cadena escapada
   */
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Obtiene el texto del status
   * @private
   * @param {string} status - Estado de la tarea
   * @returns {string} Texto del estado
   */
  _getStatusText(status) {
    const statusMap = {
      'not-started': 'Not started',
      'in-progress': 'In progress',
      'done': 'Done'
    };
    return statusMap[status] || 'Not started';
  }
}

export default TaskView;
