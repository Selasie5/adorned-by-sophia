'use client';

import ApolloProviderWrapper from './ApolloProvider';
import QueryProvider from './QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ApolloProviderWrapper>
        {children}
      </ApolloProviderWrapper>
    </QueryProvider>
  );
}
