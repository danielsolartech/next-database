/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { Connection, ConnectionConfig, createConnection } from 'mysql';
import databases, { IDatabases } from './databases';
import tables, { ITables } from './tables';

interface DatabaseOptions {
  createDatabaseIfNotExists?: boolean;
}

interface IDatabase extends IDatabases, ITables {
  /**
   * Close the current MySQL connection.
   * 
   * @async
   * @function
   * @returns { Promise<void> }
   */
  close(): Promise<void>;
}

/**
 * Next Database.
 * 
 * @exports
 * @function
 * @param { ConnectionConfig } settings
 * @param { DatabaseOptions | undefined } options
 * @returns { IDatabase }
 */
export = function database(
  settings: ConnectionConfig,
  options?: DatabaseOptions,
): Promise<IDatabase> {
  // Verify if the database name is valid.
  if (settings.database && settings.database.includes('-')) {
    throw new Error(`'${settings.database}' is not a valid database name.`);
  }

  // Create the MySQL connection.
  const connection: Connection = createConnection(settings);

  return new Promise((resolve, reject) => {
    // Connect to the database.
    connection.connect(async (error) => {
      if (error) {
        // Get the error message.
        const message: string = error.sqlMessage || error.message;
        const dbName = settings.database;

        // Close the current MySQL connection.
        connection.end();

        // Create the database if not exists.
        if (
          options &&
          options.createDatabaseIfNotExists === true &&
          typeof dbName === 'string' &&
          message === `Unknown database '${dbName}'`
        ) {
          // Delete the database name.
          delete settings.database;

          try {
            // Create the new connection without the database.
            const newConnection = await database(settings, options);

            // Create the database.
            await newConnection.createDatabase(dbName).execute();

            // Close the new connection.
            await newConnection.close();

            // Set the database name.
            settings.database = dbName;

            // Get the connection.
            resolve(await database(settings, options));
          } catch (error) {
            reject(error);
          }

          return;
        } else {
          reject(new Error(message));
          return;
        }
      }

      function close(): Promise<void> {
        return new Promise((resolve, reject) => {
          connection.end((error) => {
            if (error) {
              reject(error.sqlMessage || error.message);
              return;
            }

            resolve();
          });
        });
      }

      resolve({
        ...databases(connection),
        ...tables(connection),
        close,
      });
    });
  });
}
