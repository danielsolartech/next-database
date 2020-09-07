/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import nextDatabase from '../src/index';

(async () => {
  try {
    console.log('Connecting to the database...');

    const database = await nextDatabase({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'nextDatabase',
    }, {
      createDatabaseIfNotExists: true,
    });

    console.log('Connected to the database');

    console.log('Truncating `test` table');

    await database.truncateTable('test').execute();
    console.log('`test` table truncated');

    await database.close();
    console.log('Connection closed');
  } catch (error) {
    console.log(error);
  }
})();
