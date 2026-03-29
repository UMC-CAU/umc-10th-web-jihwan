import type React from "react";
import { useState, type FormEvent } from "react";
import { useTodo } from "../context/TodoContext";


// TodoForm 컴포넌트는 할 일 추가를 위한 폼을 렌더링
const TodoForm = () : React.ReactNode => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();
        // 할 일 추가 함수
        const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            const text = input.trim();
            
            if (text) {
                // addTodo  자리
                addTodo(text);
                setInput('');
            }
        };
    return(
        <form onSubmit={handleSubmit}  className='todo-container__form'>
            <input
            // input의 값은 input 상태로 관리
            value={input}
            // 값이 변경될 때마다 input 상태 업데이트
            onChange={(e): void => setInput(e.target.value)} 
            type='text'
            className='todo-container__input'
            placeholder='할 일 입력'
            required
            />
            <button type='submit' className='todo-container__button'>
                할 일 추가
                </button>
        </form>
    );
}

export default TodoForm;