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
import { IColumnOption, column_options_to_string } from '../columns/options';
import oneline from 'oneline';

export interface ICreate extends IQuery<boolean> {
  column(options: IColumnOption): ICreate;

  columns(options: IColumnOption[]): ICreate;
}

interface ICreateData {
  columns: IColumnOption[];
}

export default function create(
  tableName: string,
  nextDatabase: IDatabase,
): ICreate {
  const create: ICreate = {
    column,
    columns,
    toString,
    execute,
  };

  const data: ICreateData = {
    columns: [],
  };

  function column(options: IColumnOption): ICreate {
    if (data.columns.find((column) => column.name === options.name)) {
      throw new Error(`'${options.name}' column already exists.`);
    }

    data.columns.push(options);

    return create;
  }

  function columns(options: IColumnOption[]): ICreate {
    options.forEach((option) => {
      column(option);
    });

    return create;
  }

  function toString(): string {
    if (!data.columns.length) {
      throw new Error('You must add columns to the new table.');
    }

    let uniques: string[] = data.columns.filter((column) => column.unique).map((column) => column.name);
    let primary_keys: string[] = data.columns.filter((column) => column.auto_increment).map((column) => column.name);

    return oneline`CREATE TABLE IF NOT EXISTS ${tableName} (
      ${data.columns.map((column) => column_options_to_string(column, uniques.length === 1, primary_keys.length === 1)).join(',\n')}
      ${uniques.length > 1 ? `, UNIQUE(${uniques.join(', ')})` : ''}
      ${primary_keys.length > 1 ? `, PRIMARY KEY(${primary_keys.join(', ')})` : ''}
    );`;
  }

  function execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nextDatabase.getConnection().query(toString(), async (error, _rows, _fields) => {
        if (error) {
          // Close the current MySQL connection.
          await nextDatabase.close();

          // Reject an error.
          reject(error.sqlMessage || error.message);
          return;
        }

        resolve(true);
      });
    });
  }

  return create;
}
