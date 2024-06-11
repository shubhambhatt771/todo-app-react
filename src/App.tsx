import { useEffect, useState } from 'react';
import { TodoType, addTodo, deleteTodo, fetchTodos, updateTodo } from './store/todosSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import './App.css';
const App = () => {
  const [input, setInput] = useState('');
  const todos: TodoType[] = useSelector((state:RootState) => state.todos.todos);
  const dispatch:AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);


  const addTodoItem = () => {
    if (input.trim()) {
      const data = { userId: 1, title: input, completed: false };
      dispatch(addTodo(data));
      setInput('');
    }
  };

  const toggleComplete = (todo:TodoType) => {
    dispatch(updateTodo({
      id: todo.id,
      title: todo.title,
      completed: !todo.completed
    }))
  };

  const deleteTodoItem = (todoId:number) => {
    dispatch(deleteTodo(todoId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">To-Do App</h1>
      <div className="flex mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="p-2 border min-w-[300px] border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a new task"
        />
        <button
          onClick={addTodoItem}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          <i className='fa fa-plus' /> Add
        </button>
      </div>
      <ul className="w-full max-w-md space-y-2">
        {todos.map((todo, index) => (
          <li key={index} className={`p-4 bg-white rounded-md shadow-md flex justify-between items-center ${todo.completed ? 'line-through text-gray-500' : ''}`}>

            <span className='flex items-center'>
              <input onChange={() => toggleComplete(todo)} type='checkbox' name='completed' checked={todo.completed} />
              <span className="cursor-pointer ml-3">{todo.title}</span>
            </span>

            <button
              onClick={() => deleteTodoItem(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <i className='fas fa-trash' />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
