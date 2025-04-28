import { API_CSRF, API_ERROR, API_ISAUTHENTICATED, API_MESSAGE, API_LOADING, API_USERNAME } from "../actions/actionTypes";

const initialState = { username: null, error: null, message: null, is_authenticated: false, csrf: null, loading: false };

export default function apiReducer(state = initialState, action) {
    switch(action.type) {
        case API_CSRF:
            return {...state, csrf: action.payload.csrf }
        case API_ISAUTHENTICATED:
            return {...state, is_authenticated: action.payload.is_authenticated, }
        case API_ERROR:
            return { ...state, error: action.payload.error }
        case API_MESSAGE:
            return { ...state, message: action.payload.message }
        case API_USERNAME:
            return { ...state, username: action.payload.username}
        case API_LOADING:
            return {...state, loading: action.payload.loading }
        default: return state
    }
};