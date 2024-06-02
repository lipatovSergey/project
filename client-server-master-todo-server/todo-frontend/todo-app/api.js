export async function getTodoList(owner) {
    // Отправляем запрос на список всех дел
    const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
    return await response.json();
}

export async function createTodoItem({ owner, name }) {
    const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
            name,
            owner,
        }),
        headers: {
            'Content-type': 'application/json',
        }
    });
    return await response.json();
}

export async function switchTodoItemDone({ todoItem }) {
    todoItem.done = !todoItem.done;
    try {
        const response = await fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ done: todoItem.done }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); // Предполагая, что сервер возвращает обновленный объект
    } catch (error) {
        console.error("Error updating todo item:", error);
    }
}


export function deleteTodoItem({ element, todoItem }) {
    if (!confirm('Вы уверены?')) {
        return;
    }
    element.remove();
    fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
        method: 'DELETE',
    })
}