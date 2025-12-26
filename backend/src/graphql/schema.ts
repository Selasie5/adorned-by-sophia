import gql from 'graphql-tag';

export const typeDefs = gql`
  enum AdminRole {
    SUPER_ADMIN
    ADMIN
    MANAGER
  }

  type Admin {
    id: ID!
    email: String!
    role: AdminRole!
    firstName: String!
    lastName: String!
    isActive: Boolean!
    twoFactorEnabled: Boolean!
    lastLogin: String
    createdAt: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    admin: Admin!
    requiresTwoFactor: Boolean!
  }

  type TwoFactorSetup {
    secret: String!
    qrCode: String!
  }

  type LoginActivity {
    id: ID!
    email: String!
    ipAddress: String!
    userAgent: String!
    status: String!
    reason: String
    timestamp: String!
  }

  type Query {
    me: Admin
    getAdmins(role: AdminRole): [Admin!]!
    getLoginActivity(limit: Int): [LoginActivity!]!
  }

  type Mutation {
    login(email: String!, password: String!, twoFactorCode: String): AuthPayload!
    refreshToken(refreshToken: String): AuthPayload!
    logout: Boolean!
    
    createAdmin(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      role: AdminRole!
    ): Admin!
    
    updateAdmin(
      id: ID!
      firstName: String
      lastName: String
      role: AdminRole
      isActive: Boolean
    ): Admin!
    
    deleteAdmin(id: ID!): Boolean!
    
    setupTwoFactor: TwoFactorSetup!
    enableTwoFactor(code: String!): Boolean!
    disableTwoFactor(password: String!): Boolean!
    
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): Boolean!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
  }
`;
