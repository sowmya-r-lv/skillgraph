import neo4j from 'neo4j-driver';
import { env, validateEnv } from '../config/env.js';

validateEnv();
export const driver = neo4j.driver(env.uri, neo4j.auth.basic(env.username, env.password));

export async function verifyConnection() {
  await driver.verifyConnectivity();
  return true;
}

export async function closeConnection() {
  await driver.close();
}
