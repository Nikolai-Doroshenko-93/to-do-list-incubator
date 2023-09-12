import { todolistsAPI, TodolistType } from "api/todolists-api";
import { appActions, RequestStatusType } from "app/app.reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "../../utils/create-app-async-thunk";



const slice = createSlice({
  name: "todo",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.entityStatus;
      }
    },
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      // return action.payload.forEach(t => ({...t, filter: 'active', entityStatus: 'idle'}))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
            const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
            state.unshift(newTodolist);
        })
      .addCase(changeTodolistTitle.fulfilled, (state, action) =>{
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
            }
        })
      .addCase(clearTasksAndTodolists, (state, action) => {
        return action.payload.todolists;
      });
  },
});

// thunks

export const fetchTodolists = createAppAsyncThunk(
  "todolists/fetchTodolist",
  async (param, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    try {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistsActions.setTodolists({ todolists: res.data }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};

export const removeTodolist = createAppAsyncThunk<any, any>(
  "todolists/removeTodolist",
  async (todolistId: string, { dispatch, rejectWithValue }) => {
      dispatch(appActions.setAppStatus({status: "loading"}));
      dispatch(todolistsActions.changeTodolistEntityStatus({id: todolistId, entityStatus: "loading"}));
      const res = await todolistsAPI.deleteTodolist(todolistId);
      // dispatch(todolistsActions.removeTodolist({ id: todolistId }));
      try {
          dispatch(appActions.setAppStatus({status: "succeeded"}));
          return {id: todolistId};
      }
      catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
      }
  }
);

export const addTodolist = createAppAsyncThunk < any, any>(
  "todolists/addTodolist",
  async (arg: any, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
    const res = await todolistsAPI.createTodolist(arg.title)
    if(res.data.resultCode === 0) {
      const todolist = { todolist: res.data.data };
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return todolist
    }
    else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    }
  catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
)
const changeTodolistTitle = createAppAsyncThunk < any, any>(
    "todolists/changeTodolistTitle",
    async (arg: {id: string, title: string}, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;
        try {
            await todolistsAPI.updateTodolist(arg.id, arg.title)
            return({ id: arg.id, title: arg.title });
        }
        catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
)


// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle};
