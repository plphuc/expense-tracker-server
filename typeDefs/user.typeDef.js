const userTypeDef = `#graphql
  type User {
    _id: ID!,
    username: String!,
    name: String!,
    password: String!,
    profilePicture: String,
    gender: String!
  }

  type Query {
    users: [User!],
    authUser: User # it may return null if user is not authenticated
    user(userID: ID!): User
  }
  
  type LogoutResponse {
      message: String!
    }

  type Mutation {
    signUp(input: SignUpInput!): User,
    login(input: LoginInput!): User,
    logout: LogoutResponse
  }

  input SignUpInput {
    username: String!,
    name: String!,
    password: String!, 
    gender: String!
  }

  input LoginInput {
    username: String!,
    password: String!
  }
`

export default userTypeDef;