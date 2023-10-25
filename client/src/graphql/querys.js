import { gql } from "@apollo/client";

const GET_USER = gql`
  query getUsers {
    getUsers {
      createdAt
      username
      ID
      token
    }
  }
`;

export { GET_USER };
