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

const START_ROOM = gql`
  query startRoom {
    startRoom {
      ID
      members {
        ID
      }
      name
      owner
      status
    }
  }
`;

export { GET_USER, START_ROOM };
