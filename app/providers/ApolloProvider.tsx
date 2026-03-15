'use client';

import { ApolloClient, InMemoryCache, HttpLink, from, gql, Observable } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const REFRESH_TOKEN = gql`mutation RefreshToken {
  refreshToken {
    accessToken
    admin {
      createdAt
      email
      firstName
      id
      isActive
      lastLogin
      lastName
      role
      twoFactorEnabled
    }
    refreshToken
    requiresTwoFactor
  }
}`

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
});

let isRefreshing = false;
let pendingRequests:(()=> void)[] =[];

const resolvedPendingRequests =()=>
{
  pendingRequests.forEach(callback => callback);
  pendingRequests=[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const doRefreshToken = async(apolloClient: any)=>
{
  const {data} = await apolloClient.mutate({mutation: REFRESH_TOKEN});
  localStorage.setItem('accessToken', data.refreshToken.accessToken);
  return data.refreshToken.accessToken;
}

const authLink = setContext((_, { headers }) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  }
  return { headers };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshLink = onError((errorHandler: any) => {
  const { graphQLErrors, networkError, operation, forward } = errorHandler;
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        if (!isRefreshing) {
          isRefreshing = true;
          return new Observable(observer => {
            doRefreshToken(client)
              .then(newAccessToken => {
                operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                }));
                resolvedPendingRequests();
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              })
              .catch(error => {
                observer.error(error);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else {
          return new Observable(observer => {
            pendingRequests.push(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            });
          });
        }
      }
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorLink = onError((errorHandler: any) => {
  const { graphQLErrors, networkError } = errorHandler;
  if (graphQLErrors) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    graphQLErrors.forEach((gqlError: any) =>
      console.error(
        `[GraphQL error]: Message: ${gqlError.message}, Location: ${gqlError.locations}, Path: ${gqlError.path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink,refreshLink,httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
