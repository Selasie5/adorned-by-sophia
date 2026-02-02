// Example: Using TanStack Query
import { useQuery as useTanstackQuery, useMutation as useTanstackMutation, useQueryClient } from '@tanstack/react-query';

// Example REST API call with TanStack Query
export function useProducts() {
  return useTanstackQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });
}

// Example mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useTanstackMutation({
    mutationFn: async (product: any) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Example: Using Apollo Client
import { gql } from '@apollo/client';
import { useQuery as useApolloQuery, useMutation as useApolloMutation } from '@apollo/client/react';

const GET_ADMIN = gql`
  query GetAdmin($id: ID!) {
    admin(id: $id) {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $twoFactorCode: String) {
    login(email: $email, password: $password, twoFactorCode: $twoFactorCode) {
      accessToken
      refreshToken
      requiresTwoFactor
      admin {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export function useAdmin(id: string) {
  return useApolloQuery(GET_ADMIN, {
    variables: { id },
  });
}

export function useLogin() {
  return useApolloMutation(LOGIN);
}
