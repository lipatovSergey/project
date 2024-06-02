function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
}

function createStoregeBtn(container, type) {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-primary');
    btn.textContent = type === 'local' ? 'Перейти на серверное хранилище' : 'Перейти на локальное хранилище';

    btn.addEventListener('click', () => {
        const newStorageType = type === 'local' ? 'api' : 'local';
        localStorage.setItem('storageType', newStorageType);
        window.location.reload();
    })
    container.prepend(btn);
}

async function initializeApp(title, owner) {
    const storageType = localStorage.getItem('storageType') || 'local';
    const module = await dynamicImport(storageType);
    const todoItemList = await module.getTodoList(owner);
    const container = document.getElementById('todo-app');

    createTodoApp(document.getElementById('todo-app'), {
        title,
        owner,
        todoItemList,
        onCreateFormSubmit: module.createTodoItem,
        onDoneClick: module.switchTodoItemDone,
        onDeleteClick: module.deleteTodoItem,
    })

    createStoregeBtn(container, storageType);
}

async function dynamicImport(type) {
    const modulePath = type === 'local' ? './localStorageModule.js' : './api.js'
    return import(modulePath);
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

    input.addEventListener('input', function () {
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

function createTodoItemElement(todoItem, { onDone, onDelete, owner }) {
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
    doneButton.addEventListener('click', async function () {
        const updatedTodoItem = await onDone({ todoItem, element: item, owner });
        // Обновляем ссылку на todoItem, если onDone возвращает новый объект
        todoItem = updatedTodoItem;
        item.classList.toggle(doneClass, todoItem.done);
    });

    deleteButton.addEventListener('click', function () {
        onDelete({ todoItem, element: item, owner });
        item.remove();
    });

    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    return item;
}

async function createTodoApp(container, {
    title,
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
}) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();
    const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };


    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemList.forEach(todoItem => {
        const todoItemElement = createTodoItemElement(todoItem, {
            onDone: handlers.onDone,
            onDelete: handlers.onDelete,
            owner
        });
        todoList.append(todoItemElement);
    });

    // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела.
    todoItemForm.form.addEventListener('submit', async function (e) {
        // эта строчка необходима чтобы предотвратить стандартное действие браузера, в данном случае
        // мы не хотим чтобы страница перезагружалась после отправки формы
        e.preventDefault();

        // игнорируем создание элемента если пользователь ничего не ввёл в поле
        if (!todoItemForm.input.value) {
            return;
        }

        const todoItem = await onCreateFormSubmit({
            owner,
            name: todoItemForm.input.value.trim(),
        });

        const todoItemElement = createTodoItemElement(todoItem, {
            onDone: handlers.onDone,
            onDelete: handlers.onDelete,
            owner
        });

        todoList.append(todoItemElement);
        todoItemForm.button.disabled = true; // Деактивируем кнопку
        todoItemForm.input.value = ''; // Очищаем поле ввода

    });
}
export { initializeApp };
