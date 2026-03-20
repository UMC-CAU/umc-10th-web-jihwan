"use strict";
const todoInput = document.querySelector('.todo-app__input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('.todo-app__itembox--todo .todo-list');
const doneList = document.querySelector('.todo-app__itembox--done .todo-list');
let todos = [];
let doneTasks = [];
const renderTasks = () => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach((todo) => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach((todo) => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};
const createTodoElement = (todo, isDone) => {
    const li = document.createElement('li');
    li.className = 'todo-list__item';
    const span = document.createElement('span');
    span.textContent = todo.text;
    const actionBtn = document.createElement('button');
    if (!isDone) {
        actionBtn.className = 'todo-list__btn todo-list__btn--complete';
        actionBtn.textContent = '완료';
        actionBtn.onclick = () => completeTodo(todo);
    }
    else {
        actionBtn.className = 'todo-list__btn todo-list__btn--delete';
        actionBtn.textContent = '삭제';
        actionBtn.onclick = () => deleteTodo(todo);
    }
    li.appendChild(span);
    li.appendChild(actionBtn);
    return li;
};
const addTodo = () => {
    const text = todoInput.value.trim();
    if (text !== '') {
        todos.push({ id: Date.now(), text });
        todoInput.value = '';
        renderTasks();
    }
};
const completeTodo = (todo) => {
    todos = todos.filter((t) => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};
const deleteTodo = (todo) => {
    doneTasks = doneTasks.filter((t) => t.id !== todo.id);
    renderTasks();
};
addBtn.addEventListener('click', addTodo);
