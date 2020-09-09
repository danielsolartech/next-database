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

export interface IInsert<T> extends IQuery<T[]> {
  /**
   * Insert one column to the table.
   * 
   * @function
   * @param { T } columns
   * @returns { IInsert<T> }
   */
  column(columns: T): IInsert<T>;

  /**
   * Insert multiple columns to the table.
   * 
   * @function
   * @param { T[] } columns
   * @returns { IInsert<T> }
   */
  columns(columns: T[]): IInsert<T>;
}

interface IInsertData {
  isMultiple: boolean;
  keys: string[];
  values: (string | number | boolean | null)[][];
}

export default function insert<T>(
  tableName: string,
  nextDatabase: IDatabase,
): IInsert<T> {
  const insert: IInsert<T> = {
    column,
    columns,
    toString,
    execute,
  };

  const data: IInsertData = {
    isMultiple: false,
    keys: [],
    values: [],
  };

  function add_column(column: T): IInsert<T> {
    let keys = Object.keys(column);
    let values = Object.values(column);

    if (!keys.length || !values.length) {
      throw new Error('The column to insert is not valid.');
    }

    if (data.keys.length > 0 && data.keys.length !== keys.length) {
      throw new Error('The column to insert does not contains valid keys.');
    }

    if (!data.keys.length) {
      data.keys = keys;
    }

    data.values.push(values);

    return insert;
  }

  function column(column: T): IInsert<T> {
    if (data.isMultiple) {
      throw new Error('You already used a multiple insert.');
    }

    add_column(column);

    return insert;
  }

  function columns(columns: T[]): IInsert<T> {
    if (data.keys.length) {
      throw new Error('You already used a single insert.');
    }

    data.isMultiple = true;

    columns.forEach((column) => {
      add_column(column);
    });

    return insert;
  }

  function toString(): string {
    if (!data.keys.length) {
      throw new Error('The insert statement is empty.');
    }

    return oneline`INSERT INTO ${tableName}(${data.keys.join(', ')})
      VALUES ${data.isMultiple ? '?' : `(${data.values.map(_ => '?').join(', ')})`};`;
  }

  function execute(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      nextDatabase.getConnection().query(
        toString(),
        data.isMultiple ? [data.values] : data.values.flat(),
        async (error, _rows, _fields) => {
          if (error) {
            // Close the current MySQL connection.
            await nextDatabase.close();

            // Reject an error.
            reject(error.sqlMessage || error.message);
            return;
          }

          // TODO: Select the new data from the database.
          resolve([]);
        });
    });
  }

  return insert;
}
