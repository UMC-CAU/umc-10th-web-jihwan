import { type FormEvent,  useState} from "react";
import type { TTodo } from "../types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import {  useTodo } from "../context/TodoContext";


const Todo = () : React.ReactNode => {
        const { todos, doneTodos, addTodo, completeTodo, deleteTodo } = useTodo();
        
    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>Todo List</h1>
            <TodoForm/>
        {/* todo의 form 형태 */}
        <div className='render-container'>
            {/* 할 일 목록 */}
            <TodoList 
                title='할 일' 
                todos = {todos} 
                buttonLabel = '완료' 
                buttonColor = '#28a745'
                onClick={completeTodo}
                />
            {/* 완료된 할 일 목록 */}
            <TodoList 
                title='완료' 
                todos = {doneTodos} 
                buttonLabel = '삭제' 
                buttonColor = '#dc3545'
                onClick={deleteTodo}
                />
        </div>
        </div>
    );
};

export default Todo;

