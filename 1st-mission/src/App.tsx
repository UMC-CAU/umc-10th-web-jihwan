import './App.css'
import TodoBefore from './components/TodoBefore';
import Todo from './components/Todo';
import { TodoProvider } from './context/TodoContext';

function App(): Element {
  return (
  <TodoProvider>
    <Todo/>
    {/* <TodoBefore/> */}
  </TodoProvider>
  );
}

export default App
