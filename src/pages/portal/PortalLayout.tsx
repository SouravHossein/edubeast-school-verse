
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RBACProvider } from '@/hooks/useRBAC';

export const PortalLayout: React.FC = () => {
  return (
    <RBACProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </RBACProvider>
  );
};
