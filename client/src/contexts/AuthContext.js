import { createContext, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { isValidToken, setSession } from "../utils/jwt";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { LOGIN_USER, REGISTER_USER_MUTATION } from "../graphql/mutations";
import { GET_USER } from "../graphql/querys";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: "jwt",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [error, setError] = useState(null);

  const [LogMe] = useLazyQuery(GET_USER);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("typeracer_token");

        if (accessToken) {
          // setSession(accessToken);

          // Perform GraphQL query to fetch user data
          // const { data } = await client.query({
          //   query: GET_USER_QUERY,
          // });

          // const user = data.user;

          const result = await LogMe();
          // console.log(result.data.getUsers[0]);

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: result.data.getUsers[0],
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const [loginUser, { loading, data, error }] = useMutation(LOGIN_USER);

  const login = async (username, password) => {
    try {
      const result = await loginUser({ variables: { username, password } });
      console.log(result.data.login);
      localStorage.setItem("typeracer_token", result.data.login.token);
      dispatch({
        type: "LOGIN",
        payload: {
          user: result.data.login,
        },
      });
      return { data: result.data, error: null };
    } catch (err) {
      console.log(err);
      // 'error' variable now contains the error message if there is an error.
      return { data: null, error: err.message };
    }
  };

  const [registerUser] = useMutation(REGISTER_USER_MUTATION);

  const register = async (username, password, confirmPassword) => {
    try {
      const result = await registerUser({
        variables: { username, password, confirmPassword },
      });
      localStorage.setItem("typeracer_token", result.data.register.token);
      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  const resetPassword = () => {};

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
