import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const isTokenInvalid = (token: string) => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const isTeacherRole = (token: string) => {
  try {
    const decoded: { role: string } = jwtDecode(token);
    return decoded.role === 'teacher';
  } catch (error) {
    return false;
  }
};

const PrivateRoute = ({
  children,
  redirectTo,
}: {
  children: JSX.Element;
  redirectTo?: string;
}) => {
  const token = localStorage.getItem('jwt');

  if (token && !isTokenInvalid(token)) {
    if (isTeacherRole(token)) {
      const extensionId = 'aohajaelhipbamnilfnehkcpecpeacmd';

      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        chrome.runtime.sendMessage(
          extensionId,
          { type: 'SET_JWT', token: jwt },
          (response) => {
            console.log('Response from background:', response);
          },
        );
      } else {
        window.location.reload();
        chrome.runtime.sendMessage(
          extensionId,
          { type: 'SET_JWT', token: jwt },
          (response) => {
            console.log('Response from background:', response);
          },
        );
      }
      return <Navigate to="/teacher-auth-success" />;
    }
    // If the user is authenticated, either render the protected component or redirect them
    if (redirectTo) {
      console.log('Redirecting to', redirectTo);
      return <Navigate to={redirectTo} />;
    }
    return children;
  } else if (!redirectTo) {
    console.log('Redirecting to login');
    // If the user is not authenticated and trying to access a protected route, redirect to login
    return <Navigate to="/login" />;
  }

  // If no specific condition matches, render the children (for public routes)
  return children;
};

export default PrivateRoute;
