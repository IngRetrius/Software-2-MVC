# To-Do List - Demostración del Patrón MVC

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Modular-blue?logo=css3)
![MVC Pattern](https://img.shields.io/badge/Pattern-MVC-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

Una aplicación **To-Do List profesional** que demuestra la implementación del patrón de diseño **Modelo-Vista-Controlador (MVC)** usando JavaScript vanilla, HTML5 y CSS3 con una arquitectura modular y escalable.

---

## Tabla de Contenidos

- [¿Qué es el Patrón MVC?](#qué-es-el-patrón-mvc)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Flujo de Datos](#flujo-de-datos)
- [Componentes Principales](#componentes-principales)
- [Características](#características)
- [Instalación y Uso](#instalación-y-uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Comandos de Desarrollo](#comandos-de-desarrollo)
- [Guía de Código](#guía-de-código)
- [Buenas Prácticas Implementadas](#buenas-prácticas-implementadas)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Licencia](#licencia)

---

## ¿Qué es el Patrón MVC?

El **Modelo-Vista-Controlador (MVC)** es un patrón de diseño arquitectónico que separa una aplicación en **tres componentes principales**:

### **MODELO (Model)**
- **Responsabilidad**: Gestionar los datos y la lógica de negocio
- **Características**:
  - No tiene conocimiento del DOM
  - Es la única fuente de verdad de los datos
  - Notifica a los observadores cuando los datos cambian
- **En este proyecto**: `TaskModel.js`

### **VISTA (View)**
- **Responsabilidad**: Presentar los datos al usuario (interfaz gráfica)
- **Características**:
  - Renderiza el DOM
  - Captura eventos del usuario (clicks, inputs)
  - No contiene lógica de negocio
- **En este proyecto**: `TaskView.js`

### **CONTROLADOR (Controller)**
- **Responsabilidad**: Intermediario entre Modelo y Vista
- **Características**:
  - Maneja la lógica de la aplicación
  - Procesa las entradas del usuario
  - Actualiza el Modelo y la Vista
- **En este proyecto**: `TaskController.js`

### **Ventajas del Patrón MVC**

- **Separación de responsabilidades** (Separation of Concerns)
- **Código más mantenible** y escalable
- **Reutilización** de componentes
- **Facilita las pruebas** unitarias
- **Trabajo en equipo** más eficiente
- **Menor acoplamiento** entre componentes

---

## Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────┐
│                   USUARIO                       │
│        (Interactúa con la interfaz)            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │      VISTA      │  ◄─── Renderiza UI
         │  (TaskView.js)  │       Captura eventos
         └────────┬────────┘
                  │
                  │ Eventos del usuario
                  ▼
         ┌─────────────────┐
         │   CONTROLADOR   │  ◄─── Coordina
         │(TaskController) │       Valida datos
         └────────┬────────┘       Lógica de negocio
                  │
                  │ Actualiza
                  ▼
         ┌─────────────────┐
         │     MODELO      │  ◄─── Gestiona datos
         │ (TaskModel.js)  │       Notifica cambios
         └────────┬────────┘
                  │
                  │ Notifica cambios (Observer)
                  ▼
         ┌─────────────────┐
         │     STORAGE     │  ◄─── Persiste datos
         │  (Storage.js)   │       localStorage
         └─────────────────┘
```

---

## Estructura de Carpetas

```
proyecto-mvc-todo/
│
├── index.html              # Punto de entrada HTML
├── README.md               # Documentación del proyecto
├── app.js                  # Inicialización de la aplicación
│
├── assets/                 # Recursos estáticos
│   └── img/                # Imágenes e íconos
│
├── src/                    # Código fuente
│   ├── models/             # Capa de MODELO
│   │   └── TaskModel.js    # Modelo de tareas
│   │
│   ├── views/              # Capa de VISTA
│   │   └── TaskView.js     # Vista de tareas
│   │
│   ├── controllers/        # Capa de CONTROLADOR
│   │   └── TaskController.js # Controlador de tareas
│   │
│   └── utils/              # Utilidades
│       └── Storage.js      # Gestión de localStorage
│
└── styles/                 # Estilos modulares
    ├── main.css            # Variables y estilos base
    ├── components.css      # Componentes (botones, inputs)
    ├── layout.css          # Estructura y layouts
    └── responsive.css      # Media queries
```

---

## Flujo de Datos

### **1. Usuario agrega una tarea**

```
Usuario escribe "Comprar leche" y presiona Enter
                ↓
Vista captura el evento submit del formulario
                ↓
Vista llama a controller.handleAddTask("Comprar leche")
                ↓
Controlador valida el texto (no vacío, longitud máxima)
                ↓
Controlador llama a model.addTask("Comprar leche")
                ↓
Modelo crea la tarea, la agrega al array y notifica cambios
                ↓
Modelo ejecuta el callback onTasksChanged(tasks)
                ↓
Controlador recibe la notificación
                ↓
Controlador guarda en Storage y actualiza la Vista
                ↓
Vista re-renderiza la lista de tareas
                ↓
Usuario ve la nueva tarea en la interfaz
```

### **2. Usuario marca una tarea como completada**

```
Usuario hace click en el checkbox
                ↓
Vista captura el evento change
                ↓
Vista obtiene el ID de la tarea y llama a controller.handleToggleTask(id)
                ↓
Controlador llama a model.toggleTask(id)
                ↓
Modelo cambia el estado de completed y notifica
                ↓
Controlador guarda y actualiza la Vista
                ↓
Vista re-renderiza con la tarea tachada
```

---

## Componentes Principales

### **TaskModel.js** (Modelo)

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `addTask(text)` | Agrega una nueva tarea |
| `deleteTask(id)` | Elimina una tarea por ID |
| `toggleTask(id)` | Alterna el estado completado/pendiente |
| `editTask(id, newText)` | Edita el texto de una tarea |
| `getFilteredTasks(filter)` | Obtiene tareas filtradas |
| `getStats()` | Obtiene estadísticas (total, completadas, pendientes) |
| `bindTasksChanged(callback)` | Vincula un observador para cambios |

**Estructura de una tarea:**
```javascript
{
  id: 1234567890,
  text: "Comprar leche",
  completed: false,
  createdAt: "2025-01-15T10:30:00.000Z"
}
```

---

### **TaskView.js** (Vista)

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `displayTasks(tasks)` | Renderiza la lista de tareas |
| `updateCounters(stats)` | Actualiza los contadores |
| `updateFilterButtons(filter)` | Actualiza estado de botones de filtro |
| `bindAddTask(handler)` | Vincula el evento de agregar tarea |
| `bindDeleteTask(handler)` | Vincula el evento de eliminar |
| `bindToggleTask(handler)` | Vincula el evento de toggle |
| `bindEditTask(handler)` | Vincula el evento de editar |
| `bindFilterTasks(handler)` | Vincula el evento de filtrar |

---

### **TaskController.js** (Controlador)

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `handleAddTask(text)` | Maneja la adición de tareas (con validación) |
| `handleDeleteTask(id)` | Maneja la eliminación de tareas |
| `handleToggleTask(id)` | Maneja el cambio de estado |
| `handleEditTask(id, text)` | Maneja la edición (con validación) |
| `handleFilterTasks(filter)` | Maneja el filtrado de tareas |
| `onTasksChanged(tasks)` | Callback cuando el Modelo cambia |

---

### **Storage.js** (Utilidad)

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `saveTasks(tasks)` | Guarda tareas en localStorage |
| `getTasks()` | Recupera tareas de localStorage |
| `clearTasks()` | Elimina todas las tareas |
| `exportToFile()` | Exporta tareas a JSON |
| `importTasks(tasks)` | Importa tareas desde JSON |

---

## Características

### **Funcionalidades**

- Agregar nuevas tareas
- Marcar tareas como completadas/pendientes
- Eliminar tareas (con confirmación)
- Editar tareas inline
- Filtrar tareas (Todas / Pendientes / Completadas)
- Contadores dinámicos
- Persistencia en localStorage
- Exportar/Importar datos (mediante consola)

### **Características Técnicas**

- Patrón MVC puro
- JavaScript Vanilla (ES6+)
- Módulos ES6 (import/export)
- Patrón Observer/PubSub
- Single Responsibility Principle
- Código documentado en español
- Estilos CSS modulares
- Responsive design (mobile-first)
- Accesibilidad (ARIA labels)

---

## Instalación y Uso

### **Opción 1: Servidor Local con Python**

```bash
# Navegar a la carpeta del proyecto
cd proyecto-mvc-todo

# Iniciar servidor HTTP (Python 3)
python -m http.server 8000

# Abrir en el navegador
# http://localhost:8000
```

### **Opción 2: Servidor Local con Node.js**

```bash
# Instalar http-server globalmente
npm install -g http-server

# Iniciar servidor
http-server -p 8000

# Abrir en el navegador
# http://localhost:8000
```

### **Opción 3: Live Server (VS Code)**

1. Instalar la extensión **Live Server** en VS Code
2. Click derecho en `index.html`
3. Seleccionar **"Open with Live Server"**

### **Opción 4: Doble Click (puede tener limitaciones)**

Simplemente abre `index.html` en tu navegador (algunos navegadores restringen módulos ES6 en archivos locales).

---

## Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos modulares, variables CSS, Flexbox, Grid |
| **JavaScript** | ES6+ | Lógica de la aplicación, módulos ES6 |
| **localStorage** | Web API | Persistencia de datos |

**Sin frameworks ni librerías** - 100% JavaScript Vanilla

---

## Comandos de Desarrollo

Abre la **consola del navegador** (F12) para usar estos comandos:

```javascript
// Agregar tareas de demostración
addDemoTasks();

// Mostrar estado actual de la aplicación
showState();

// Exportar tareas a archivo JSON
exportTasks();

// Eliminar todas las tareas
clearAllData();

// Acceder al objeto de la aplicación
window.app.model      // Acceder al Modelo
window.app.view       // Acceder a la Vista
window.app.controller // Acceder al Controlador
window.app.storage    // Acceder al Storage
```

---

## Guía de Código

### **Cómo agregar una nueva funcionalidad**

Supongamos que quieres agregar **prioridades a las tareas** (alta, media, baja).

#### **1. Modificar el Modelo (TaskModel.js)**

```javascript
addTask(taskText, priority = 'media') {
  const task = {
    id: this._generateId(),
    text: taskText.trim(),
    completed: false,
    priority: priority,  // ← NUEVA PROPIEDAD
    createdAt: new Date().toISOString()
  };

  this.tasks.push(task);
  this._commit(this.tasks);
  return task;
}
```

#### **2. Modificar la Vista (TaskView.js)**

```javascript
// Agregar un select para prioridad en el formulario
// Modificar el renderizado para mostrar la prioridad con colores
```

#### **3. Modificar el Controlador (TaskController.js)**

```javascript
handleAddTask(taskText, priority) {
  // Validaciones...
  this.model.addTask(taskText, priority);
}
```

---

## Buenas Prácticas Implementadas

### **Arquitectura**

- Separación de responsabilidades (SoC)
- Single Responsibility Principle (SRP)
- Don't Repeat Yourself (DRY)
- Patrón Observer para comunicación

### **JavaScript**

- Módulos ES6 (import/export)
- Clases ES6
- Arrow functions
- Template literals
- Destructuring
- Const/let (no var)
- Métodos privados (prefijo `_`)

### **CSS**

- Variables CSS (custom properties)
- Modularización por responsabilidad
- Naming conventions consistente
- Mobile-first design
- Transitions suaves

### **HTML**

- Estructura semántica (`<header>`, `<main>`, `<section>`, `<footer>`)
- Atributos ARIA (accesibilidad)
- Meta tags apropiados
- Comentarios descriptivos

### **Accesibilidad**

- ARIA labels
- Focus visible
- Roles ARIA
- Navegación por teclado

---

## Capturas de Pantalla

### **Vista Desktop**
```
┌────────────────────────────────────────┐
│       To-Do List MVC                  │
│   Patrón Modelo-Vista-Controlador     │
├────────────────────────────────────────┤
│  Total: 5  │  Pendientes: 3  │  OK: 2 │
├────────────────────────────────────────┤
│  [Todas] [Pendientes] [Completadas]   │
├────────────────────────────────────────┤
│  [________Tarea nueva________] [+Add] │
├────────────────────────────────────────┤
│  [ ] Aprender MVC           [E] [X]   │
│  [X] Implementar CRUD       [E] [X]   │
│  [ ] Crear diseño           [E] [X]   │
└────────────────────────────────────────┘
```

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2025 Proyecto MVC Demo

Se concede permiso, de forma gratuita, a cualquier persona que obtenga
una copia de este software para usar, copiar, modificar, fusionar,
publicar, distribuir, sublicenciar y/o vender copias del Software.
```

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Contacto

Para preguntas o sugerencias sobre este proyecto educativo, no dudes en abrir un issue.

---

## Recursos Adicionales

- [MDN - Model-View-Controller](https://developer.mozilla.org/en-US/docs/Glossary/MVC)
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

<div align="center">

**Si este proyecto te ayudó a entender el patrón MVC, considera darle una estrella**

Hecho con dedicación para fines educativos

</div>
