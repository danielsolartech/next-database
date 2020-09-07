/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { Connection } from 'mysql';
import { IQuery } from '../query';

/**
 * Truncate table.
 * 
 * @exports
 * @function
 * @returns { IQuery<boolean> }
 */
export default function truncate(
  tableName: string,
  connection: Connection,
): IQuery<boolean> {
  function toString(): string {
    return `TRUNCATE TABLE ${tableName};`;
  }

  function execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      connection.query(toString(), (error, _rows, _fields) => {
        if (error) {
          // Close the current MySQL connection.
          connection.end();

          // Reject an error.
          reject(new Error(error.sqlMessage || error.message));
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
