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

/**
 * Create a test table with an `id` and `username` columns.
 * 
 * @exports
 * @async
 * @function
 * @param { INextDatabase } database
 * @returns { Promise<void> }
 */
export async function createTestTable(
  database: INextDatabase,
): Promise<void> {
  console.log('Creating the `test` table');

  await database
    .createTable('test')
    .columns([
      {
        name: 'id',
        type: 'int',
        max_length: 11,
        null: false,
        auto_increment: true,
        primary_key: true,
      },
      {
        name: 'username',
        type: 'varchar',
        max_length: 100,
        null: false,
      },
    ])
    .execute();

  console.log('`test` table was created');
}

// Only execute on create-table command.
if (process.env.example === 'create-table') {
  (async () => {
    try {
      const database = await connection();

      await createTestTable(database);

      await database.close();
      console.log('Connection closed');
    } catch (error) {
      console.log(error);
    }
  })();
}
