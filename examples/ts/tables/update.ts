/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import connection from '../connection';
import { createTestTable } from './create';
import { insertToTestTable } from './insert';

// Only execute on update-table command.
if (process.env.example === 'update-table') {
  (async () => {
    try {
      const database = await connection();

      await createTestTable(database);
      await insertToTestTable(database);

      console.log('Updating all usernames.');

      await database
        .updateTable('test')
        .column('username', 'nextDatabase')
        .execute();

      console.log('Updated all usernames.');

      await database.close();
      console.log('Connection closed');
    } catch (error) {
      console.log(error);
    }
  })();
}