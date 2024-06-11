import { useEffect, useRef, useState } from 'react';
import { TodoType, addTodo, deleteTodo, fetchTodos, updateTodo } from './store/todosSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import './App.css';
const App = () => {
  const [input, setInput] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const todos: TodoType[] = useSelector((state: RootState) => state.todos.todos);
  const dispatch: AppDispatch = useDispatch();
  const todoToUpdate = useRef(null);
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);


  const addTodoItem = () => {
    if (isEdit) {
      updateTodoItem();
    }
    else if (input.trim()) {
      const data = { userId: 1, title: input, completed: false };

      dispatch(addTodo(data));
    }
    setInput('');
  };

  const toggleComplete = async (todo: TodoType, index) => {
    const data = {
      ...todo,
      completed: !todo.completed,
      index
    };
    await dispatch(updateTodo(data));
  };

  const deleteTodoItem = (todoId: number) => {
    dispatch(deleteTodo(todoId));
  };

  const editTodoItem = (todo, index) => {
    setInput(todo.title);
    setIsEdit(true);
    todoToUpdate.current = { ...todo, index };
  }

  const updateTodoItem = async () => {
    const todo = todoToUpdate.current;

    const data = {
      ...todo,
      title: input,
    };
    await dispatch(updateTodo(data));
    setIsEdit(false);
  }

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
          {
            isEdit && <><i className='fa fa-edit mr-3'>
            </i>
              <>
              Update
              </>
              </>
          }
          {
            !isEdit && <><i className='fa fa-plus mr-3'>
            </i>
              <>
                Add
              </>
            </>

          }
        </button>
      </div>
      <ul className="w-full max-w-md space-y-2">
        {todos.map((todo, index) => (
          <li key={index} className={`p-4 bg-white rounded-md shadow-md flex justify-between items-center ${todo.completed ? 'line-through text-gray-500' : ''}`}>

            <span className='flex items-center'>
              <input onChange={() => toggleComplete(todo, index)} type='checkbox' name='completed' checked={todo.completed} />
              <span className="cursor-pointer ml-3">{todo.title}</span>
            </span>

            <span className='flex items-center'>
              <button
                onClick={() => deleteTodoItem(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                <i className='fas fa-trash' />
              </button>
              <button
                onClick={() => editTodoItem(todo, index)}
                className="text-blue-500 hover:text-blue-700 ml-3"
              >
                <i className='fas fa-edit' />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
