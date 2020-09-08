/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { IDatabases } from './databases';
import { ITables } from './tables';
import { Connection } from 'mysql';

/**
 * Database options interface.
 * 
 * @exports
 * @interface
 */
export interface DatabaseOptions {
  createDatabaseIfNotExists?: boolean;
  destroyDatabaseAfterClose?: boolean;
}

/**
 * nextDatabase interface.
 * 
 * @exports
 * @interface
 */
export interface IDatabase {
  /**
   * Get the current MySQL connection.
   * 
   * **Only use this when you can not do a SQL using the methods**
   * 
   * @function
   * @returns { Connection }
   */
  getConnection(): Connection;

  /**
   * Close the current MySQL connection.
   * 
   * @async
   * @function
   * @returns { Promise<void> }
   */
  close(): Promise<void>;
}

export interface INextDatabase extends IDatabase, IDatabases, ITables { }
