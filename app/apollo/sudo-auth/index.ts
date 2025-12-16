import { gql } from "@apollo/client";

export const SUDO_AUTH_LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    admin {
      createdAt
      email
      firstName
      id
      isActive
      lastName
      role
      twoFactorEnabled
    }
    refreshToken
    requiresTwoFactor
  }
}`
