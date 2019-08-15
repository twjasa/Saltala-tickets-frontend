import { createStore, applyMiddleware } from 'redux';
import {combineReducers} from 'redux';
import authReducer from './reducers/authReducer';
import promiseMiddleware from 'redux-promise-middleware';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';


const appCombineReducer = combineReducers({
    authReducer,
});

// middlewares includes
const middlewares = [
    thunk,
    reduxImmutableStateInvariant(),
    promiseMiddleware({
        promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR']
    })
];

const initiateStore = () => createStore( appCombineReducer, {}, applyMiddleware(...middlewares) );

export const SUFFIXLOADING = '_LOADING';
export const SUFFIXSUCCESS = '_SUCCESS';
export const SUFFIXERROR = '_ERROR';


export default initiateStore; 
