'use client';

import ApolloProviderWrapper from './ApolloProvider';
import QueryProvider from './QueryProvider';
import { AuthProvider } from '../context/AuthContext';
import ToastContainer from '../components/core/ui/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ApolloProviderWrapper>
        <AuthProvider>
          <ToastContainer/>
 {children}
        </AuthProvider>
       
      </ApolloProviderWrapper>
    </QueryProvider>
  );
}
