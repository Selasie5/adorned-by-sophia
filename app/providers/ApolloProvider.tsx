'use client';

import { ApolloClient, InMemoryCache, HttpLink, from, gql, Observable } from '@apollo/client';
import { ApolloProvider, useMutation } from '@apollo/client/react';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const REFRESH_TOKEN = gql`mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
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

// const [refreshToken] = useMutation(REFRESH_TOKEN);

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

const refreshToken = async(client:any)=>
{
  const {data} = client.mutation({mutation: REFRESH_TOKEN});
  localStorage.setItem('accessToken', data.refreshToken.accessToken);
  return data.refreshToken.accessToken;
}
const refreshLink = onError(({ graphQLErrors, networkError, operation, forward }: any) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        if (!isRefreshing) {
          isRefreshing = true;
          return new Observable(observer => {
            refreshToken(client)
              .then(newAccessToken => {
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                }));
                resolvedPendingRequests();
                observer.next(forward(operation));
                observer.complete();
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
              observer.next(forward(operation));
              observer.complete();
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

const errorLink = onError((error: any) => {
  if (error.graphQLErrors) {
    error.graphQLErrors.forEach(({ message, locations, path }: any) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (error.networkError) {
    console.error(`[Network error]: ${error.networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink, refreshLink]),
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
