// 1. 필요한 요소들을 문서에서 찾아오기
const todoInput = document.querySelector('.todo-app__input');
const todoList = document.querySelector('.todo-app__itembox--todo .todo-list'); // 해야 할 일 바구니
const doneList = document.querySelector('.todo-app__itembox--done .todo-list'); // 해낸 일 바구니

// 2. 입력창에서 Enter 키를 누를 때의 동작
todoInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && todoInput.value.trim() !== '') {
        addTodoItem(todoInput.value); // 할 일 추가 함수 실행
        todoInput.value = '';         // 다음 입력을 위해 창 비우기
    }
});

// 3. 할 일 항목을 만들고, 버튼 동작을 설정하는 함수
function addTodoItem(text) {
    // 항목(li) 뼈대 만들기
    const li = document.createElement('li');
    li.className = 'todo-list__item';

    //텍스트 넣기
    const span = document.createElement('span');
    span.className = 'todo-list__text';
    span.textContent = text;

    //버튼을 담을 상자와 버튼 만들기
    const actions = document.createElement('div');
    actions.className = 'todo-list__actions';

    const actionBtn = document.createElement('button');
    actionBtn.className = 'todo-list__btn todo-list__btn--complete';
    actionBtn.textContent = '완료';

    //조립하기 (버튼 -> 상자 -> 항목 )
    actions.appendChild(actionBtn);
    li.appendChild(span);
    li.appendChild(actions);

    // 해야 할 일에 완성된 항목 추가
    todoList.appendChild(li);

    //  버튼에 클릭 이벤트 담기

    actionBtn.addEventListener('click', function() {
        
        // 이 버튼이 완료 버튼이면?
        if (actionBtn.classList.contains('todo-list__btn--complete')) {
            
            // 1. 항목을 해낸 일 리스트로 옮긴다
            doneList.appendChild(li); 

            // 2. 버튼의 디자인과 글씨를 삭제로 바꾼다.
            actionBtn.classList.remove('todo-list__btn--complete');
            actionBtn.classList.add('todo-list__btn--delete');
            actionBtn.textContent = '삭제';
        } 
        
        // 상황 2: 만약 이 버튼이 '삭제' 버튼으로 변한 상태라면?
        else {
            // 화면에서 이 항목(li)을 완전히 지워버립니다.
            li.remove();
        }
    });
}