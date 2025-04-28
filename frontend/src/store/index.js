import { combineReducers, applyMiddleware, compose } from "redux"
import { legacy_createStore as createStore} from 'redux'
import createSagaMiddleware from "redux-saga"
import apiReducer from "../reducers/api"


const reducer = combineReducers({
                                api: apiReducer,
                              })

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

export default store