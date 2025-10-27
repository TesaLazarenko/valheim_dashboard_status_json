import React from 'react';
import reactDOM from 'react-dom/client';
import ValheimServerDashboard from './dashboard';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

window.addEventListener('load', () => {
  const root = reactDOM.createRoot(document.querySelector('#root'));
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ValheimServerDashboard/>
      </QueryClientProvider>
    </React.StrictMode>
  )
})