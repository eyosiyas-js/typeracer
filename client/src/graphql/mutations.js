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

const CREATE_ROOM_MUTATION = gql`
  mutation createRoom($name: String!, $password: String!) {
    createRoom(name: $name, password: $password) {
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

const JOIN_ROOM_MUTATION = gql`
  mutation joinRoom($name: String!, $password: String!) {
    joinRoom(name: $name, password: $password) {
      ID
      members {
        ID
        username
      }
      name
      owner
      status
    }
  }
`;

const SEND_RANK = gql`
  mutation sendRank($rankInfo: RankInfo) {
    sendRank(rankInfo: $rankInfo) {
      rank: String
      ID: String
      roomId: String
    }
  }
`;

export {
  LOGIN_USER,
  REGISTER_USER_MUTATION,
  CREATE_ROOM_MUTATION,
  JOIN_ROOM_MUTATION,
  SEND_RANK,
};
