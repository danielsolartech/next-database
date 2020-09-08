/**
 * Copyright (c) Daniel Solarte Chaverra
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/**
 * Column options.
 * 
 * @exports
 * @interface
 */
export interface IColumnOption {
  /**
   * Name of the column.
   */
  name: string;

  /**
   * Data type of the column.
   */
  type: 'char' | 'varchar' | 'binary' | 'varbinary' | 'tinyblob' | 'tinytext' | 'text' | 'blob' | 'mediumtext' |
  'mediumblob' | 'longtext' | 'longblob' | 'enum' | 'set' | 'bit' | 'tinyint' | 'bool' | 'boolean' | 'smallint' |
  'mediumint' | 'int' | 'integer' | 'bigint' | 'float' | 'double' | 'double precision' | 'decimal' | 'dec' |
  'date' | 'datetime' | 'timestamp' | 'time' | 'year';

  /**
   * Max length of the data type.
   * 
   * **Only for:** char, varchar, binary, varbinary, text, blob, bit, tinyint,
   * smallint, mediumint, int, integer, bigint, float, double, double pecision,
   * decimal and dec.
   */
  max_length?: number;

  /**
   * Values for the enum data type.
   */
  enum?: string[];

  extra?: 'UNSIGNED' | 'ZEROFILL';

  /**
   * The value can be null. (Default: true)
   */
  null?: boolean;

  /**
   * The default value.
   */
  default_value?: string | number | boolean | null;

  /**
   * If the column value can auto increment.
   */
  auto_increment?: boolean;

  unique?: boolean;

  primary_key?: boolean;

  /**
   * Check if the column value satisfy a boolean expression.
   * 
   * ## Example
   * ```ts
   * let column: IColumnOption = {
   *  name: 'cost',
   *  type: 'int',
   *  max_length: 10,
   *  null: false,
   *  check: 'cost >= 0',
   * };
   * ```
   */
  check?: string;
}

export function column_options_to_string(
  options: IColumnOption,
  with_unique: boolean,
  with_primary_key: boolean,
): string {
  let column: string = `${options.name} ${options.type.toUpperCase()}`;

  // Add the max length
  if (options.max_length) {
    // Check if the data type can contains a max length.
    if (!['char', 'varchar', 'binary', 'varbinary', 'text', 'blob', 'bit', 'tinyint',
      'smallint', 'mediumint', 'int', 'integer', 'float', 'double', 'double precision',
      'decimal', 'dec'].includes(options.type)) {
      throw new Error(`You can not set a max length to '${options.name}'.`);
    }

    if (
      (options.max_length < 0 || options.max_length > 255) &&
      (options.type === 'char' || (options.type === 'tinyint' && options.extra === 'UNSIGNED'))
    ) {
      throw new Error(`The max length of '${options.name}' must be between 0 and 255.`);
    }

    if (
      (options.max_length < 0 || options.max_length > 65535) &&
      (options.type === 'varchar' || (options.type === 'mediumint' && options.extra === 'UNSIGNED'))
    ) {
      throw new Error(`The max length of '${options.name}' must be between 0 and 65535.`);
    }

    // Append the max length to the column string.
    column += `(${options.max_length})`;
  }

  // Append the extra value.
  column += options.extra ? ` ${options.extra}` : '';

  // Append the null type.
  column += `${options.null === false ? ' NOT' : ''} NULL`;

  // Check if the default value is not null
  if (options.default_value) {
    // Append the default value.
    column += ` DEFAULT ${options.default_value}`;
  }

  // Append the auto increment type.
  column += options.auto_increment === true ? ' AUTO_INCREMENT' : '';

  // Check if can add `unique`.
  if (with_unique && options.unique) {
    column += ' UNIQUE';
  }

  // Check if can add the primary key.
  if (with_primary_key && options.primary_key) {
    column += ' PRIMARY KEY';
  }

  // Check if the check value is not null.
  if (options.check) {
    // Append the check value.
    column += ` CHECK (${options.check})`;
  }

  return column;
}
