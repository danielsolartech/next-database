/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { IQuery } from './query';
import { Connection } from 'mysql';
import create, { ICreate } from './databases/create';
import drop from './databases/drop';

export interface IDatabases {
  /**
   * Create a new database.
   * 
   * @function
   * @param { string } name
   * @returns { ICreate }
   */
  createDatabase(name: string): ICreate;

  /**
   * Delete an existing database.
   * 
   * @function
   * @param { string } name
   * @returns { IQuery<boolean> }
   */
  deleteDatabase(name: string): IQuery<boolean>;
}

export default function databases(
  connection: Connection,
): IDatabases {
  return {
    createDatabase: (name: string) => create(name, connection),
    deleteDatabase: (name: string) => drop(name, connection),
  };
}
