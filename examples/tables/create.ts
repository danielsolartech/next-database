/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import nextDatabase from '../../lib/index';

(async () => {
  try {
    console.log('Connecting to the database...');

    const database = await nextDatabase({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'daniel1',
      database: 'nextDatabase',
    }, {
      createDatabaseIfNotExists: true,
      destroyDatabaseAfterClose: true,
    });

    console.log('Connected to the database');

    console.log('Creating the `test` table');

    await database
      .createTable('test')
      .column({
        name: 'id',
        type: 'int',
        max_length: 11,
        null: false,
        auto_increment: true,
        primary_key: true,
      })
      .execute();

    console.log('`test` table was created');

    await database.close();
    console.log('Connection closed');
  } catch (error) {
    console.log(error);
  }
})();
