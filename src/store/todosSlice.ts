import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
export type TodoType = {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
    index: number | null;
  }

export type NewTodoType = Omit<TodoType, "id">;
// to omit multiple using pipe operation "id"|"title"
  
export type updateTodoPayloadType = {
    id: number;
    title: string;
    completed: boolean;
    index: number
}
  type TodosState = {
    todos: TodoType[];
  }
const initialState:TodosState = {
    todos: []
}

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async()=>{
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1/todos?completed=false');
    const todos = res.json();
    return todos;
});
// <returnType, parameterType> to function call
export const addTodo = createAsyncThunk<TodoType, NewTodoType>('todos/addTodo', async (data:NewTodoType)=>{
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/',{
        method: 'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    });

    const addedTodo = res.json();

    return addedTodo;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({id,title, completed, index}:TodoType)=>{
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/'+id,{
        method: 'PATCH',
        body:JSON.stringify({
            completed: completed,
            id: id,
            title:title
          }),
        headers:{
            'Content-Type': 'application/json'
        }
    });

    const updatedTodo = await res.json();
    return {...updatedTodo, index};
});

export const deleteTodo = createAsyncThunk<number, number>('todos/deleteTodo', async (todoId)=>{
    await fetch('https://jsonplaceholder.typicode.com/todos/'+todoId,{
        method: 'DELETE',
    });

    return todoId;
});

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {

        builder.addCase(fetchTodos.fulfilled, (state:TodosState, action:PayloadAction<TodoType[]>)=>{
            state.todos = action.payload.slice(0,4);
        })
        builder.addCase(addTodo.fulfilled, (state, action) =>{
            state.todos.unshift(action.payload);
        })
        builder.addCase(updateTodo.fulfilled, (state, action)=>{
                state.todos[action.payload.index] = action.payload;
        })

        builder.addCase(deleteTodo.fulfilled, (state, action)=>{
            state.todos = state.todos.filter((todo)=> todo.id !== action.payload);
        })
    }
});



export default todosSlice.reducer;