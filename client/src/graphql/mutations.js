import { gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      createdAt
      username
      ID
      token
    }
  }
`;

const REGISTER_USER_MUTATION = gql`
  mutation register(
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      password: $password
      confirmPassword: $confirmPassword
    ) {
      ID
      username
      createdAt
      token
    }
  }
`;

export { LOGIN_USER, REGISTER_USER_MUTATION };
