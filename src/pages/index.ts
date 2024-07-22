import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));

const Todos = lazy(() => import('@/pages/todos'));

const SignUp = lazy(() => import('@/pages/signup'));

export { Home, SignUp, Todos };
