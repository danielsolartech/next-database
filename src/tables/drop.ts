/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { IDatabase } from '../settings';
import { IQuery } from '../query';

export default function drop(
  tableName: string,
  nextDatabase: IDatabase,
): IQuery<boolean> {
  function toString(): string {
    return `DROP TABLE IF EXISTS ${tableName};`;
  }

  function execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nextDatabase.getConnection().query(toString(), async (error, _rows, _fields) => {
        if (error) {
          // Close the current MySQL connection.
          await nextDatabase.close();

          // Reject and error.
          reject(error.sqlMessage || error.message);
          return;
        }

        resolve(true);
      });
    });
  }

  return {
    toString,
    execute,
  };
}
