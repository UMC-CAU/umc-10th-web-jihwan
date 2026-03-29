import { createContext, useContext, useState, type PropsWithChildren} from 'react';
import { type TTodo } from '../types/todo';



interface ITodoContext{
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: 
    {children: React.ReactNode}): React.ReactNode => {
        //상태 (할 일 목록 관리, 완료 목록 관리 상태, )
        const [todos, setTodos] = useState<TTodo[]>([]);
        const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

        const addTodo = (text: string): void => {
            const newTodo: TTodo = {id: Date.now(),text};
                // 기존의 할 일 목록을 복사해오고 그 뒤에 방금 입력한 할 일을 덧붙여서 새로운 목록으로 교체
                setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]); 
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
            <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo}}>
                {children}
            </TodoContext.Provider>
        )
    }


    export const useTodo = (): ITodoContext => {
        const context = useContext(TodoContext);
        // context가 undefined인 경우, 즉 TodoProvider로 감싸지 않은 경우 에러를 발생시킴
        if (!context) {
            throw new Error('useTodo를 사용하기 위해서는 무조건 TodoProvider로 감싸야 한다.')
        }

        // context가 정상적으로 존재하는 경우, 즉 TodoProvider로 감싸진 경우 context를 반환
        return context;
    }