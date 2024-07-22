import { FC, lazy } from 'react';

import { Navigate, useRoutes } from 'react-router-dom';

import PrivateRoute from './private-route';
import { routeList } from '@/data/constant/navs';
import LayoutComponent from '@/layout';
import TeacherAuthSuccessView from '@/layout/teacher-extension';
import CaseManagement from '@/pages/case-management';
import AdviceManagement from '@/pages/advice-management';
import ForgotPasswordForm from '@/pages/forgot-password';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import ScheduleManagement from '@/pages/schedule-management';

const NotFound = lazy(() => import('@/pages/not-found'));

const routes = [
  {
    path: '/',
    element: <LayoutComponent />,
    children: [
      {
        path: '',
        element: <Navigate to="case-management" />,
      },
      {
        path: 'case-management',
        element: (
          <PrivateRoute redirectTo="">
            <CaseManagement />
          </PrivateRoute>
        ),
      },
      {
        path: 'schedule-management',
        element: (
          <PrivateRoute redirectTo="">
            <ScheduleManagement />
          </PrivateRoute>
        ),
      },
      {
        path: 'advice-management/:caseId',
        element: (
          <PrivateRoute redirectTo="">
            <AdviceManagement />
          </PrivateRoute>
        ),
      },
      ...routeList,
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/signup',
    element: (
      <PrivateRoute redirectTo="/case-management">
        <Signup />
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PrivateRoute redirectTo="/case-management">
        <Login />
      </PrivateRoute>
    ),
  },
  {
    path: 'forgot-password',
    element: <ForgotPasswordForm />,
  },
  {
    path: 'teacher-auth-success',
    element: <TeacherAuthSuccessView />,
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routes);

  return element;
};

export default RenderRouter;
