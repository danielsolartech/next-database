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

export default function drop(
  databaseName: string,
  connection: Connection,
): IQuery<boolean> {
  function toString(): string {
    return `DROP DATABASE IF EXISTS ${databaseName};`;
  }

  function execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      connection.query(toString(), (error, _rows, _fields) => {
        if (error) {
          // Close the current MySQL connection.
          connection.end();

          // Reject an error.
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
