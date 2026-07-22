// TaskFlow To-Do List Application Logic
const STORAGE_KEY = 'taskflow_tasks_list';

// Application State
let tasks = loadTasksFromStorage();
let currentFilter = 'all';
let editingTaskId = null;

// DOM Element References
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');
const itemsCount = document.getElementById('items-count');
const completedCount = document.getElementById('completed-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

/**
 * Initialize application and event listeners
 */
function init() {
    renderTasks();

    // Event Listeners
    todoForm.addEventListener('submit', handleAddTask);
    clearCompletedBtn.addEventListener('click', handleClearCompleted);

    // Filter Buttons Listener
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}

/**
 * Render task list based on state & active filter
 */
function renderTasks() {
    todoList.innerHTML = '';

    // Apply Filter
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    // Toggle Empty State Visibility
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Render Each Task Item
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const isEditing = editingTaskId === task.id;

        li.innerHTML = `
            <div class="todo-left">
                <div class="checkbox-custom" onclick="toggleTaskComplete(${task.id})" title="Toggle Complete"></div>
                ${isEditing 
                    ? `<input type="text" class="edit-input" id="edit-input-${task.id}" value="${escapeHTML(task.text)}">`
                    : `<span class="task-text" onclick="toggleTaskComplete(${task.id})">${escapeHTML(task.text)}</span>`
                }
            </div>
            <div class="task-actions">
                ${isEditing
                    ? `
                        <button type="button" class="action-btn btn-edit" onclick="saveTaskEdit(${task.id})" title="Save Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button type="button" class="action-btn" onclick="cancelTaskEdit()" title="Cancel Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    `
                    : `
                        <button type="button" class="action-btn btn-edit" onclick="startTaskEdit(${task.id})" title="Edit Task">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button type="button" class="action-btn btn-delete" onclick="deleteTask(${task.id})" title="Delete Task">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    `
                }
            </div>
        `;

        todoList.appendChild(li);

        // Attach Enter key save listener if currently editing
        if (isEditing) {
            const editInput = document.getElementById(`edit-input-${task.id}`);
            if (editInput) {
                editInput.focus();
                editInput.setSelectionRange(editInput.value.length, editInput.value.length);
                editInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') saveTaskEdit(task.id);
                    if (e.key === 'Escape') cancelTaskEdit();
                });
            }
        }
    });

    // Update Counter Badges
    updateCounters();
}

/**
 * Handle Add New Task
 */
function handleAddTask(e) {
    e.preventDefault();
    const text = todoInput.value.trim();

    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.unshift(newTask);
    saveTasksToStorage();
    todoInput.value = '';
    renderTasks();
}

/**
 * Toggle Task Completed Status
 */
function toggleTaskComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasksToStorage();
    renderTasks();
}

/**
 * Start Editing Task Mode
 */
function startTaskEdit(id) {
    editingTaskId = id;
    renderTasks();
}

/**
 * Save Task Edit
 */
function saveTaskEdit(id) {
    const editInput = document.getElementById(`edit-input-${id}`);
    if (!editInput) return;

    const newText = editInput.value.trim();
    if (!newText) {
        // Delete task if cleared completely
        deleteTask(id);
        return;
    }

    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText };
        }
        return task;
    });

    editingTaskId = null;
    saveTasksToStorage();
    renderTasks();
}

/**
 * Cancel Task Edit
 */
function cancelTaskEdit() {
    editingTaskId = null;
    renderTasks();
}

/**
 * Delete Task by ID
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage();
    renderTasks();
}

/**
 * Handle Clear Completed Tasks
 */
function handleClearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToStorage();
    renderTasks();
}

/**
 * Update Footer Task Counters
 */
function updateCounters() {
    const activeTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;

    itemsCount.textContent = `${activeTasks} active task${activeTasks === 1 ? '' : 's'}`;
    completedCount.textContent = `${completedTasks} completed`;

    if (completedTasks > 0) {
        clearCompletedBtn.classList.remove('hidden');
    } else {
        clearCompletedBtn.classList.add('hidden');
    }
}

/**
 * Save Tasks array to LocalStorage
 */
function saveTasksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Load Tasks array from LocalStorage
 */
function loadTasksFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    // Default initial sample tasks if empty
    return [
        { id: 1, text: "Build responsive layout for Task 3", completed: true },
        { id: 2, text: "Create interactive quiz app for Task 4", completed: true },
        { id: 3, text: "Implement To-Do List mini project with LocalStorage", completed: false }
    ];
}

/**
 * Escape HTML Helper
 */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Global scope bindings for inline event calls
window.toggleTaskComplete = toggleTaskComplete;
window.startTaskEdit = startTaskEdit;
window.saveTaskEdit = saveTaskEdit;
window.cancelTaskEdit = cancelTaskEdit;
window.deleteTask = deleteTask;

// Run Application initialization on DOM load
document.addEventListener('DOMContentLoaded', init);
