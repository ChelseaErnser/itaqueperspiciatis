/**
 * ReadFile options interface
 */
export interface ReadOptions {

  /**
   * When `true` or `undefined`, when the file is not found an exception is
   * thrown. When `false`, no exception is thrown and `undefined` is returned.
   *
   * **@defaultValue** - True or undefined
   */
  required?: boolean
}

/**
 * RequiredOptions options interface
 */
export interface RequiredOptions {

  /**
   * When `true` or `undefined`, when the file is not found an exception is
   * thrown. When `false`, no exception is thrown and `undefined` is returned.
   *
   * **@defaultValue** - True or undefined
   */
  required?: boolean
}
