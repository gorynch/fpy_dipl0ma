import {
    API_CSRF,
    API_ERROR,
    API_ISAUTHENTICATED,
    API_MESSAGE,
    API_LOADING,
    API_USERNAME
} from './actionTypes'

export const apiCsrf = (csrf: string | null) => ({
    type: API_CSRF, payload: {csrf}
});
export const apiUsername = (username: string | null) => ({
    type: API_USERNAME, payload: {username}
});
export const apiMessage = (message: string) => ({
    type: API_MESSAGE, payload: {message}
});
export const apiError = (error: string | null) => ({
    type: API_ERROR, payload: {error}
});
export const apiIsAuthenticated = (is_authenticated: boolean) => ({
    type: API_ISAUTHENTICATED, payload: {is_authenticated}
});
export const apiLoading = (loading: boolean) => ({
    type: API_LOADING, payload: {loading}
});
