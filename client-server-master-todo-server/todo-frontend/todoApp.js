(function() {
    todoArray = [];
        listName = '';

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        button.disabled = true;

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название вашего дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function() {
            button.disabled = input.value.trim() === ""
        });

        return {
            form,
            input,
            button,
        }
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItemElement(todoItem, { onDone, onDelete }) {
        const doneClass = 'list-group-item-success';

        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        if (todoItem.done) {
            item.classList.add(doneClass);
        }
        item.textContent = todoItem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //Очень важное условие. Именно оно задаёт стиль для выполненного и сохраненного дела

        // добавляем обработчики кнопок
        doneButton.addEventListener('click', function() {
            onDone({ todoItem, element: item });
            item.classList.toggle(doneClass, todoItem.done);
        });

        deleteButton.addEventListener('click', function() {
            onDelete({ todoItem, element: item });
        });

        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);

        return item;
    }

    async function createTodoApp(container, title, owner) {
        const todoAppTitle = createAppTitle(title);
        const todoItemForm = createTodoItemForm();
        const todoList = createTodoList();
        const handlers = {
            onDone({ todoItem }) {
                todoItem.done = !todoItem.done;
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ done: todoItem.done }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            },
            onDelete({ todoItem, element }) {
                if (!confirm('Вы уверены?')) {
                    return;
                }
                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'DELETE',
                })
            }
        }


        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // Отправляем запрос на список всех дел
        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach(todoItem => {
            const todoItemElement = createTodoItemElement(todoItem, handlers);
            todoList.append(todoItemElement);
        });

        // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела.
        todoItemForm.form.addEventListener('submit', async function(e) {
            // эта строчка необходима чтобы предотвратить стандартное действие браузера, в данном случае
            // мы не хотим чтобы страница перезагружалась после отправки формы
            e.preventDefault();

            // игнорируем создание элемента если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            }

            const response = await fetch('http://localhost:3000/api/todos', {
              method: 'POST',
              body: JSON.stringify({
                name: todoItemForm.input.value.trim(),
                owner,
              }),
              headers: {
                'Content-type': 'application/json',
              }
            })
            const todoItem = await response.json();

            const todoItemElement = createTodoItemElement(todoItem, handlers);

            // При каждом добавлении делаем кнопку Disabled
            todoItemForm.button.disabled = true;

            // Очищаем поле ввода
            todoItemForm.input.value = '';

            // создаём и добавлем в список новое дело с названием из поля ввода
            todoList.append(todoItemElement);
        });
    }
    window.createTodoApp = createTodoApp;
})();
