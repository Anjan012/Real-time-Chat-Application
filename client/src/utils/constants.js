export const HOST = import.meta.env.VITE_SERVER_URL; // if you are using vite use import.meta.env.VITE_ to access env variables. if you are using react app use process.env.REACT_APP_ to access env variables

export const AUTH_ROUTES = "api/auth"; // all the auth related routes will be prefixed with this

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;

export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;