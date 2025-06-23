document.addEventListener('DOMContentLoaded', () => {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    let tareasSemana = JSON.parse(localStorage.getItem('tareasSemana')) || {};
    dias.forEach(dia => {
        if (!tareasSemana[dia]) tareasSemana[dia] = [];
    });

    // Variables para selección de tarea desde el formulario
    let tareaSeleccionada = {};

    function cerrarMenus() {
        document.querySelectorAll('.acciones-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    function renderTareas() {
        dias.forEach(dia => {
            const agendaDia = document.querySelector(`.agenda-dia[data-dia="${dia}"]`);
            agendaDia.innerHTML = '';
            // Formulario para agregar tarea
            const formDiv = document.createElement('div');
            formDiv.className = 'task';
            formDiv.innerHTML = `
                <div class="input-group" style="justify-content: flex-start;">
                    <input type="date" class="add-date" id="date-${dia}">
                    <input type="text" class="add-name" placeholder="Nueva tarea">
                    <select class="add-priority task-priority" required>
                        <option value="">Prioridad</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>
                <span class="form-error"></span>
                <div class="acciones-paquete">
                    <button class="add-btn" data-dia="${dia}">Agregar</button>
                    <button type="button" class="edit-task-btn" data-dia="${dia}" disabled>Editar</button>
                    <button type="button" class="delete-task-btn" data-dia="${dia}" disabled>Eliminar</button>
                </div>
            `;
            agendaDia.appendChild(formDiv);
            if (tareasSemana[dia].length === 0) {
                const sinTareas = document.createElement('p');
                sinTareas.className = 'sin-tareas';
                sinTareas.textContent = 'Sin tareas';
                agendaDia.appendChild(sinTareas);
                return;
            }
            tareasSemana[dia].forEach((tarea, idx) => {
                const tareaDiv = document.createElement('div');
                tareaDiv.className = 'task tarea-lista';
                tareaDiv.setAttribute('data-dia', dia);
                tareaDiv.setAttribute('data-idx', idx);
                tareaDiv.innerHTML = `
                    <span><strong>${tarea.nombre}</strong></span>
                    <span>${tarea.fecha ? `<span class='task-date'>📅 ${tarea.fecha}</span>` : ''}</span>
                    <span class="task-priority ${tarea.prioridad}">
                        ${tarea.prioridad ? (tarea.prioridad === 'alta' ? '🔴 Alta' : tarea.prioridad === 'media' ? '🟡 Media' : '🟢 Baja') : ''}
                    </span>
                `;
                agendaDia.appendChild(tareaDiv);
            });
        });
    }

    // Elimino los formularios superiores
    document.querySelectorAll('.task-form').forEach(form => form.remove());

    // Manejo de eventos en toda la agenda
    document.querySelector('#semana').addEventListener('click', e => {
        // Seleccionar tarea para editar o eliminar
        if (e.target.closest('.tarea-lista')) {
            const tareaDiv = e.target.closest('.tarea-lista');
            const dia = tareaDiv.getAttribute('data-dia');
            const idx = tareaDiv.getAttribute('data-idx');
            const tarea = tareasSemana[dia][idx];
            const agendaDia = tareaDiv.parentElement;
            const formDiv = agendaDia.querySelector('.task');
            formDiv.querySelector('.add-name').value = tarea.nombre;
            formDiv.querySelector('.add-date').value = tarea.fecha || '';
            formDiv.querySelector('.add-priority').value = tarea.prioridad;
            tareaSeleccionada[dia] = idx;
            formDiv.querySelector('.edit-task-btn').disabled = false;
            formDiv.querySelector('.delete-task-btn').disabled = false;
        }
        // Agregar tarea
        if (e.target.classList.contains('add-btn')) {
            const dia = e.target.getAttribute('data-dia');
            const parent = e.target.closest('.task');
            const nombre = parent.querySelector('.add-name').value.trim();
            const fecha = parent.querySelector('.add-date').value;
            const prioridad = parent.querySelector('.add-priority') ? parent.querySelector('.add-priority').value : '';
            const errorSpan = parent.querySelector('.form-error');
            if (!nombre || !prioridad) {
                errorSpan.textContent = 'Completa todos los campos.';
                return;
            }
            errorSpan.textContent = '';
            tareasSemana[dia].push({ nombre, fecha, prioridad });
            localStorage.setItem('tareasSemana', JSON.stringify(tareasSemana));
            renderTareas();
            tareaSeleccionada[dia] = undefined;
            return;
        }
        // Editar tarea
        if (e.target.classList.contains('edit-task-btn')) {
            const dia = e.target.getAttribute('data-dia');
            const idx = tareaSeleccionada[dia];
            if (idx === undefined) return;
            const parent = e.target.closest('.task');
            const nombre = parent.querySelector('.add-name').value.trim();
            const fecha = parent.querySelector('.add-date').value;
            const prioridad = parent.querySelector('.add-priority') ? parent.querySelector('.add-priority').value : '';
            const errorSpan = parent.querySelector('.form-error');
            if (!nombre || !prioridad) {
                errorSpan.textContent = 'Completa todos los campos.';
                return;
            }
            errorSpan.textContent = '';
            tareasSemana[dia][idx] = { nombre, fecha, prioridad };
            localStorage.setItem('tareasSemana', JSON.stringify(tareasSemana));
            renderTareas();
            tareaSeleccionada[dia] = undefined;
        }
        // Eliminar tarea
        if (e.target.classList.contains('delete-task-btn')) {
            const dia = e.target.getAttribute('data-dia');
            const idx = tareaSeleccionada[dia];
            if (idx === undefined) return;
            tareasSemana[dia].splice(idx, 1);
            localStorage.setItem('tareasSemana', JSON.stringify(tareasSemana));
            renderTareas();
            tareaSeleccionada[dia] = undefined;
        }
    });

    renderTareas();
});