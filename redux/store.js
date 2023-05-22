import {combineReducers, createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import storeReducer from "./reducers"
export const store = createStore(storeReducer, applyMiddleware(thunk));