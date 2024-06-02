export function getTodoList(owner) {
    const data = localStorage.getItem(owner);
    return data ? JSON.parse(data) : [];
}

export function createTodoItem({ owner, name }) {
    const todos = getTodoList(owner);
    const newTodo = { id: Date.now(), name, done: false };
    todos.push(newTodo);
    localStorage.setItem(owner, JSON.stringify(todos));
    return newTodo;
}

export function switchTodoItemDone({ owner, todoItem }) {
    const todos = getTodoList(owner);
    const index = todos.findIndex(todo => todo.id === todoItem.id);
    // Так как findIndex возвращает -1 в случае если нет совпадений, то это как if(true)
    if (index !== -1) {
        todos[index].done = !todos[index].done;
        localStorage.setItem(owner, JSON.stringify(todos));
        return todos[index];
    }
}

export function deleteTodoItem({ owner, todoItem }) {
    if (!confirm('Вы уверены?')) {
        return;
    }
    const todos = getTodoList(owner);
    const filteredTodos = todos.filter(todo => todo.id !== todoItem.id);
    localStorage.setItem(owner, JSON.stringify(filteredTodos));
}