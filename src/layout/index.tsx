import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import fallbackRender from './error-boundary/fallbackRender';
import SidebarComponent from './sidebar';

const LayoutComponent = () => {
  return (
    <div className="font-sans flex h-screen bg-gray-100">
      <SidebarComponent />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <ErrorBoundary fallbackRender={fallbackRender}>
              <Suspense
                fallback={
                  <div className="w-full h-full flex justify-center items-center">
                    <span>Loading...</span>
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutComponent;
