/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { Connection } from 'mysql';
import { IQuery } from './query';
import drop from './tables/drop';
import truncate from './tables/truncate';

export interface ITables {
  /**
   * Delete a table if it exists.
   * 
   * @function
   * @param { string } name
   * @returns { IQuery<boolean> }
   */
  deleteTable(name: string): IQuery<boolean>;

  /**
   * Truncate a table if it exists.
   * 
   * @function
   * @param { string } name
   * @returns { IQuery<boolean> }
   */
  truncateTable(name: string): IQuery<boolean>;
}

export default function tables(
  connection: Connection,
): ITables {
  return {
    deleteTable: (name: string) => drop(name, connection),
    truncateTable: (name: string) => truncate(name, connection),
  };
}
