const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String
    createdAt: String
    token: String
    ID: String
  }
  type member {
    ID: String
  }

  type Rank {
    ID: String
    Rank: String
    roomId: String
  }
  type SRank {
    Rank: String
  }
  type Room {
    name: String!
    password: String
    ID: String!
    status: Boolean!
    owner: String!
    members: [member]!
  }
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
    reactions: [Reaction]
  }
  type Reaction {
    uuid: String!
    content: String!
    createdAt: String!
    message: Message!
    user: User!
  }
  type Response {
    rank: String!
    ID: String!
    roomId: String!
  }

  type RParagraph {
    Paragraph: String
  }
  input RankInfo {
    rank: String!
    ID: String!
    roomId: String!
  }
  type Query {
    getUsers: [User]!
    getMessages(from: String!): [Message]!
    startRoom: Room
  }
  type Mutation {
    register(
      username: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendRank(rankInfo: RankInfo!): Response!
    login(username: String!, password: String!): User!
    createRoom(name: String!, password: String!): Room!
    joinRoom(name: String!, password: String!): Room!
    detachRoom(roomId: String!): String!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(uuid: String!, content: String!): Reaction!
  }
  type Subscription {
    newRank(roomId: String!): Response!
    newParagraph(roomId: String!): RParagraph
    newUser(roomId: String!): {ID:String!,username:String!}
  }
`;
