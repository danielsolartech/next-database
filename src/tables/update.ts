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
import { ColumnValue } from '../columns/options';
import oneline from 'oneline';

export interface IUpdate extends IQuery<boolean> {
  /**
   * Update the value of a column inside the table.
   * 
   * @function
   * @param { string } name
   * @param { ColumnValue } value
   * @returns { IUpdate }
   */
  column(name: string, value: ColumnValue): IUpdate;

  /**
   * Update some column values inside the table.
   * 
   * @function
   * @param { { [name: string]: ColumnValue } } columns
   * @returns { IUpdate }
   */
  columns(columns: { [name: string]: ColumnValue }): IUpdate;
}

interface UpdateData {
  columns: { [name: string]: ColumnValue };
}

export default function update(
  tableName: string,
  nextDatabase: IDatabase,
): IUpdate {
  const update: IUpdate = {
    column,
    columns,
    toString,
    execute,
  };

  const data: UpdateData = {
    columns: {},
  };

  function column(name: string, value: ColumnValue): IUpdate {
    if (data.columns[name]) {
      throw new Error(`'${name}' column name was already added to the update statement.`);
    }

    data.columns[name] = value;

    return update;
  }

  function columns(columns: { [name: string]: ColumnValue }): IUpdate {
    Object.keys(columns).forEach((key) => {
      column(key, columns[key]);
    });

    return update;
  }

  function toString(): string {
    return oneline`
      UPDATE ${tableName} SET
      ${Object.keys(data.columns).map((key) => `${key} = ?`).join(', ')};
    `;
  }

  function execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nextDatabase.getConnection().query(
        toString(),
        Object.values(data.columns),
        async (error, _rows, _fields) => {
          if (error) {
            // Close the current MySQL connection.
            await nextDatabase.close();

            // Reject an error.
            reject(error.sqlMessage || error.message);
            return;
          }

          resolve(true);
        },
      );
    });
  }

  return update;
}
