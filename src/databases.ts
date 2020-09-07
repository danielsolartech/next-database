/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { IQuery } from './query';
import { Connection } from 'mysql';
import create from './databases/create';

export interface IDatabases {
  createDatabase(name: string): IQuery<boolean>;
}

export default function databases(
  connection: Connection,
): IDatabases {
  return {
    createDatabase: (name: string) => create(name, connection),
  };
}
