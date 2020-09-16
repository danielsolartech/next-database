/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { IQuery } from './query';
import { IDatabase } from './settings';
import create, { ICreate } from './tables/create';
import drop from './tables/drop';
import insert, { IInsert } from './tables/insert';
import truncate from './tables/truncate';
import update, { IUpdate } from './tables/update';

export interface ITables {
  /**
   * Create a table if not exists.
   * 
   * @function
   * @param { string } name
   * @returns { ICreate }
   */
  createTable(name: string): ICreate;

  /**
   * Delete a table if it exists.
   * 
   * @function
   * @param { string } name
   * @returns { IQuery<boolean> }
   */
  deleteTable(name: string): IQuery<boolean>;

  /**
   * Insert data to a table.
   * 
   * @function
   * @param { string } name
   * @returns { IInsert<T> }
   */
  insertTable<T = any>(name: string): IInsert<T>;

  /**
   * Truncate a table if it exists.
   * 
   * @function
   * @param { string } name
   * @returns { IQuery<boolean> }
   */
  truncateTable(name: string): IQuery<boolean>;

  /**
   * Update a column of a table.
   * 
   * @param { string } name
   * @returns { IUpdate }
   */
  updateTable(name: string): IUpdate;
}

export default function tables(
  nextDatabase: IDatabase,
): ITables {
  return {
    createTable: (name: string) => create(name, nextDatabase),
    deleteTable: (name: string) => drop(name, nextDatabase),
    insertTable: (name: string) => insert(name, nextDatabase),
    truncateTable: (name: string) => truncate(name, nextDatabase),
    updateTable: (name: string) => update(name, nextDatabase),
  };
}
