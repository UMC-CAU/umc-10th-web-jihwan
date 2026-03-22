// 1. HTML 요소 선택
const todoInput = document.querySelector('.todo-app__input') as HTMLInputElement;
const addBtn = document.querySelector('#add-btn') as HTMLButtonElement;
const todoList = document.querySelector('.todo-app__itembox--todo .todo-list') as HTMLUListElement;
const doneList = document.querySelector('.todo-app__itembox--done .todo-list') as HTMLUListElement;

// 2. 할 일이 어떻게 생겼는지 Type 정의
type Todo = {
    id: number;
    text: string;
};

// 데이터 저장소 (배열)
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 3. 할 일 목록 렌더링 함수 (화면을 새로 그리는 역할)
const renderTasks = (): void => {
    // 기존에 그려진 내용을 비우기
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    // '해야 할 일' 그리기
    todos.forEach((todo) => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    // '해낸 일' 그리기
    doneTasks.forEach((todo) => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

// 4. 할 일 아이템 생성 함수 (버튼 색상 및 텍스트 분기)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.className = 'todo-list__item';

    const span = document.createElement('span');
    span.textContent = todo.text;

    const actionBtn = document.createElement('button');
    
    if (!isDone) {
        // 완료 전: 초록색 버튼
        actionBtn.className = 'todo-list__btn todo-list__btn--complete';
        actionBtn.textContent = '완료';
        actionBtn.onclick = () => completeTodo(todo);
    } else {
        // 완료 후: 빨간색 버튼
        actionBtn.className = 'todo-list__btn todo-list__btn--delete';
        actionBtn.textContent = '삭제';
        actionBtn.onclick = () => deleteTodo(todo);
    }

    li.appendChild(span);
    li.appendChild(actionBtn);
    return li;
};

// 5. 할 일 추가 처리 함수
const addTodo = (): void => {
    const text = todoInput.value.trim();
    if (text !== '') {
        todos.push({ id: Date.now(), text }); // 데이터 추가
        todoInput.value = '';
        renderTasks(); // 화면 갱신
    }
};

// 6. 할 일 상태 변경 (완료로 이동)
const completeTodo = (todo: Todo): void => {
    // 원본 배열에서 제거하고 완료 배열에 추가
    todos = todos.filter((t) => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks(); // 화면 갱신
};

// 7. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t) => t.id !== todo.id);
    renderTasks(); // 화면 갱신
};

// 8. 이벤트 리스너
addBtn.addEventListener('click', addTodo);