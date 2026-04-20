import { Client } from '@elastic/elasticsearch';

const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
const apiKey = process.env.ELASTICSEARCH_API_KEY;
const username = process.env.ELASTICSEARCH_USERNAME;
const password = process.env.ELASTICSEARCH_PASSWORD;

let client: Client | null = null;

export function getESClient() {
  if (!client) {
    const auth = apiKey 
      ? { apiKey } 
      : (username && password) 
        ? { username, password } 
        : undefined;

    client = new Client({
      node,
      auth,
      // Disable TLS verification for local dev if needed, 
      // but we're starting with plain HTTP in docker-compose
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return client;
}
