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
import oneline from 'oneline';

export interface ICreate extends IQuery<boolean> {
  characterSet(name: string): ICreate;

  collate(name: string): ICreate;
}

export default function create(
  databaseName: string,
  nextDatabase: IDatabase,
): ICreate {
  const create: ICreate = {
    toString,
    execute,
    characterSet,
    collate,
  };

  const data = {
    characterSet: '',
    collate: '',
  };

  function characterSet(name: string): ICreate {
    data.characterSet = name;
    return create;
  }

  function collate(name: string): ICreate {
    data.collate = name;
    return create;
  }

  function toString(): string {
    return oneline`
      CREATE DATABASE IF NOT EXISTS ${databaseName}
      ${data.characterSet !== '' ? ` CHARACTER SET ${data.characterSet}` : ''}
      ${data.collate !== '' ? `COLLATE ${data.collate}` : ''}
      ;
    `;
  }

  function execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nextDatabase.getConnection().query(toString(), async (error, _rows, _fields) => {
        if (error) {
          // Close the current MySQL connection.
          await nextDatabase.close();

          // Reject an error.
          reject(new Error(error.sqlMessage || error.message));
          return;
        }

        resolve(true);
      });
    });
  }

  return create;
}
