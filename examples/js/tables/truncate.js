/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const connection = require('../connection');
const { createTestTable } = require('./create');
const { insertToTestTable } = require('./insert');

// Only execute on truncate-table command.
if (process.env.example === 'truncate-table') {
  (async () => {
    try {
      const database = await connection();

      await createTestTable(database);
      await insertToTestTable(database);

      console.log('Truncating `test` table');
      await database.truncateTable('test').execute();
      console.log('`test` table truncated');

      await database.close();
      console.log('Connection closed');
    } catch (error) {
      console.log(error);
    }
  })();
}
