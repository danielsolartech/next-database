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
import truncate from './tables/truncate';

export interface ITables {
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
    truncateTable: (name: string) => truncate(name, connection),
  };
}
