/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import connection from '../connection';
import { INextDatabase } from '../../../lib/settings';
import { createTestTable } from './create';

export interface TestColumn {
  id?: number;
  username: string;
}

/**
 * Insert 3 usernames to the test table.
 * 
 * @exports
 * @async
 * @function
 * @param { INextDatabase } database
 * @returns { Promise<void> }
 */
export async function insertToTestTable(
  database: INextDatabase,
): Promise<void> {
  console.log('Inserting data to `test` table');

  const data = await database
    .insertTable<TestColumn>('test')
    .columns([
      { username: 'daniel' },
      { username: 'next' },
      { username: 'database' },
    ])
    .execute();

  if (data.length && data[data.length - 1]) {
    console.log(`Last ID: ${data[data.length - 1].id}`);
  }

  console.log('Data insertered to `test` table');
}

// Only execute on insert-table command.
if (process.env.example === 'insert-table') {
  (async () => {
    try {
      const database = await connection();

      await createTestTable(database);
      await insertToTestTable(database);

      await database.close();
      console.log('Connection closed');
    } catch (error) {
      console.log(error);
    }
  })();
}
