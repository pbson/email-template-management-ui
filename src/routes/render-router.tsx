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
    path: '/email-template-management-ui',
    element: <LayoutComponent />,
    children: [
      {
        path: '',
        element: <Navigate to="/email-template-management-ui/case-management" />,
      },
      {
        path: 'case-management',
        element: (
          <PrivateRoute>
            <CaseManagement />
          </PrivateRoute>
        ),
      },
      {
        path: 'schedule-management',
        element: (
          <PrivateRoute>
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
    path: '/email-template-management-ui/signup',
    element: (
      <PrivateRoute redirectTo="/email-template-management-ui/case-management">
        <Signup />
      </PrivateRoute>
    ),
  },
  {
    path: '/email-template-management-ui/login',
    element: (
      <PrivateRoute redirectTo="/email-template-management-ui/case-management">
        <Login />
      </PrivateRoute>
    ),
  },
  {
    path: '/email-template-management-ui/forgot-password',
    element: <ForgotPasswordForm />,
  },
  {
    path: '/email-template-management-ui/teacher-auth-success',
    element: <TeacherAuthSuccessView />,
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routes);
  return element;
};

export default RenderRouter;
