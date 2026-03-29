import { type FormEvent, useState } from "react";
import type {TTodo} from '../types/todo';

const TodoBefore = () =>{
    // 상태 (할 일 목록 관리, 완료 목록 관리 상태, 입력값 관리 상태)
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    //console.log('input', input);

    // 할 일 추가 함수
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            const newTodo: TTodo = {id: Date.now(),text};
            // 기존의 할 일 목록을 복사해오고 그 뒤에 방금 입력한 할 일을 덧붙여서 새로운 목록으로 교체
            setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]); 
            setInput('');
        }
    };

    // 할 일 -> 완료 함수
    const completeTodo = (todo: TTodo) : void => {
        // 완료된 할 일을 할 일 목록에서 제거
        setTodos(prevTodos => prevTodos.filter((t) :boolean => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) : TTodo[] => [... prevDoneTodos, todo]);
    }

    // 완료된 할 일 삭제 함수
    const deleteTodo = (todo:TTodo) : void => {
        // 완료 목록에서 제거
        setDoneTodos(prevTodos => prevTodos.filter((t): boolean => t.id !==todo.id));
    }


    return (
        <div className='todo-container'>
        <h1 className='todo-container__header'>Todo List</h1>
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
        <div className='render-container'>
            <div className='render-container__section'>
                <h2 className='render-container__title'>할 일</h2>
                <ul id='todo-list' className='render-container__list'>
                    {todos.map((todo):any => (
                        <li key={todo.id} className='render-container__item'>
                        <span className='render-container__item-text'>{todo.text}</span>
                        <button
                            onClick={() : void => completeTodo(todo)}
                            style={{
                                backgroundColor: '#28a745',
                            }}
                                className='render-container__item-button'>완료</button>
                    </li>
                    ))}
                </ul>
            </div>
            <div className='render-container__section'>
                <h2 className='render-container__title'>완료</h2>
                <ul id='todo-list' className='render-container__list'>
                    {doneTodos.map((todo):any => (
                        <li key={todo.id} className='render-container__item'>
                        <span className='render-container__item-text'>{todo.text}</span>
                        <button
                            onClick={() : void => deleteTodo(todo)}
                            style={{
                                backgroundColor: '#dc3545',
                            }}
                                className='render-container__item-button'>삭제</button>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    );
};
 
export default TodoBefore;