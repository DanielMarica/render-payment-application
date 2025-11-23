import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const API_HOST = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:3000/graphql";

const client = new ApolloClient({
  link: new HttpLink({ uri: API_HOST }),
  cache: new InMemoryCache(),
});

export default client;