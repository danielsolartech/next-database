/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export interface IQuery<T> {
  /**
   * Get the query in a string.
   * 
   * @function
   * @returns { string }
   */
  toString(): string;

  /**
   * Execute the query.
   * 
   * @async
   * @function
   * @returns { Promise<T> }
   */
  execute(): Promise<T>;
}
