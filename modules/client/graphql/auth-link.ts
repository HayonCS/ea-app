import { getAuthToken } from "client/auth";
import { ApolloLink } from "@apollo/client";

export const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthToken();
  // if (token) {
  //   operation.setContext({
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});
