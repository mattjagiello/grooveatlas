import { GraphQLClient } from 'graphql-request';

const domain = process.env.EXPO_PUBLIC_DOMAIN;
const BASE = domain ? `https://${domain}` : 'http://localhost:8080';
export const GQL_URL = `${BASE}/graphql`;

export const gqlClient = new GraphQLClient(GQL_URL, {
  headers: { 'Content-Type': 'application/json' },
});
