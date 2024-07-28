import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));

const SignUp = lazy(() => import('@/pages/signup'));

export { Home, SignUp };
