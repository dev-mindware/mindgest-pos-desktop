
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Settings
 * 
 */
export type Settings = $Result.DefaultSelection<Prisma.$SettingsPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Item
 * 
 */
export type Item = $Result.DefaultSelection<Prisma.$ItemPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model InvoiceLine
 * 
 */
export type InvoiceLine = $Result.DefaultSelection<Prisma.$InvoiceLinePayload>
/**
 * Model CashSession
 * 
 */
export type CashSession = $Result.DefaultSelection<Prisma.$CashSessionPayload>
/**
 * Model CashMovement
 * 
 */
export type CashMovement = $Result.DefaultSelection<Prisma.$CashMovementPayload>
/**
 * Model SyncOutbox
 * 
 */
export type SyncOutbox = $Result.DefaultSelection<Prisma.$SyncOutboxPayload>
/**
 * Model DocumentSequence
 * 
 */
export type DocumentSequence = $Result.DefaultSelection<Prisma.$DocumentSequencePayload>
/**
 * Model AgtSeries
 * 
 */
export type AgtSeries = $Result.DefaultSelection<Prisma.$AgtSeriesPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.settings`: Exposes CRUD operations for the **Settings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.settings.findMany()
    * ```
    */
  get settings(): Prisma.SettingsDelegate<ExtArgs>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs>;

  /**
   * `prisma.item`: Exposes CRUD operations for the **Item** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Items
    * const items = await prisma.item.findMany()
    * ```
    */
  get item(): Prisma.ItemDelegate<ExtArgs>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs>;

  /**
   * `prisma.invoiceLine`: Exposes CRUD operations for the **InvoiceLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceLines
    * const invoiceLines = await prisma.invoiceLine.findMany()
    * ```
    */
  get invoiceLine(): Prisma.InvoiceLineDelegate<ExtArgs>;

  /**
   * `prisma.cashSession`: Exposes CRUD operations for the **CashSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CashSessions
    * const cashSessions = await prisma.cashSession.findMany()
    * ```
    */
  get cashSession(): Prisma.CashSessionDelegate<ExtArgs>;

  /**
   * `prisma.cashMovement`: Exposes CRUD operations for the **CashMovement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CashMovements
    * const cashMovements = await prisma.cashMovement.findMany()
    * ```
    */
  get cashMovement(): Prisma.CashMovementDelegate<ExtArgs>;

  /**
   * `prisma.syncOutbox`: Exposes CRUD operations for the **SyncOutbox** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncOutboxes
    * const syncOutboxes = await prisma.syncOutbox.findMany()
    * ```
    */
  get syncOutbox(): Prisma.SyncOutboxDelegate<ExtArgs>;

  /**
   * `prisma.documentSequence`: Exposes CRUD operations for the **DocumentSequence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DocumentSequences
    * const documentSequences = await prisma.documentSequence.findMany()
    * ```
    */
  get documentSequence(): Prisma.DocumentSequenceDelegate<ExtArgs>;

  /**
   * `prisma.agtSeries`: Exposes CRUD operations for the **AgtSeries** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgtSeries
    * const agtSeries = await prisma.agtSeries.findMany()
    * ```
    */
  get agtSeries(): Prisma.AgtSeriesDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Settings: 'Settings',
    Client: 'Client',
    Category: 'Category',
    Item: 'Item',
    Invoice: 'Invoice',
    InvoiceLine: 'InvoiceLine',
    CashSession: 'CashSession',
    CashMovement: 'CashMovement',
    SyncOutbox: 'SyncOutbox',
    DocumentSequence: 'DocumentSequence',
    AgtSeries: 'AgtSeries'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "settings" | "client" | "category" | "item" | "invoice" | "invoiceLine" | "cashSession" | "cashMovement" | "syncOutbox" | "documentSequence" | "agtSeries"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Settings: {
        payload: Prisma.$SettingsPayload<ExtArgs>
        fields: Prisma.SettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findFirst: {
            args: Prisma.SettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findMany: {
            args: Prisma.SettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          create: {
            args: Prisma.SettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          createMany: {
            args: Prisma.SettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          delete: {
            args: Prisma.SettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          update: {
            args: Prisma.SettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          deleteMany: {
            args: Prisma.SettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          aggregate: {
            args: Prisma.SettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettings>
          }
          groupBy: {
            args: Prisma.SettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SettingsCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Item: {
        payload: Prisma.$ItemPayload<ExtArgs>
        fields: Prisma.ItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findFirst: {
            args: Prisma.ItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findMany: {
            args: Prisma.ItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          create: {
            args: Prisma.ItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          createMany: {
            args: Prisma.ItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          delete: {
            args: Prisma.ItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          update: {
            args: Prisma.ItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          deleteMany: {
            args: Prisma.ItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          aggregate: {
            args: Prisma.ItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItem>
          }
          groupBy: {
            args: Prisma.ItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemCountArgs<ExtArgs>
            result: $Utils.Optional<ItemCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceLine: {
        payload: Prisma.$InvoiceLinePayload<ExtArgs>
        fields: Prisma.InvoiceLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          findFirst: {
            args: Prisma.InvoiceLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          findMany: {
            args: Prisma.InvoiceLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>[]
          }
          create: {
            args: Prisma.InvoiceLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          createMany: {
            args: Prisma.InvoiceLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>[]
          }
          delete: {
            args: Prisma.InvoiceLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          update: {
            args: Prisma.InvoiceLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          aggregate: {
            args: Prisma.InvoiceLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceLine>
          }
          groupBy: {
            args: Prisma.InvoiceLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceLineCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineCountAggregateOutputType> | number
          }
        }
      }
      CashSession: {
        payload: Prisma.$CashSessionPayload<ExtArgs>
        fields: Prisma.CashSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CashSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CashSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>
          }
          findFirst: {
            args: Prisma.CashSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CashSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>
          }
          findMany: {
            args: Prisma.CashSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>[]
          }
          create: {
            args: Prisma.CashSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>
          }
          createMany: {
            args: Prisma.CashSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CashSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>[]
          }
          delete: {
            args: Prisma.CashSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>
          }
          update: {
            args: Prisma.CashSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>
          }
          deleteMany: {
            args: Prisma.CashSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CashSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CashSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashSessionPayload>
          }
          aggregate: {
            args: Prisma.CashSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCashSession>
          }
          groupBy: {
            args: Prisma.CashSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CashSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CashSessionCountArgs<ExtArgs>
            result: $Utils.Optional<CashSessionCountAggregateOutputType> | number
          }
        }
      }
      CashMovement: {
        payload: Prisma.$CashMovementPayload<ExtArgs>
        fields: Prisma.CashMovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CashMovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CashMovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>
          }
          findFirst: {
            args: Prisma.CashMovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CashMovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>
          }
          findMany: {
            args: Prisma.CashMovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>[]
          }
          create: {
            args: Prisma.CashMovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>
          }
          createMany: {
            args: Prisma.CashMovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CashMovementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>[]
          }
          delete: {
            args: Prisma.CashMovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>
          }
          update: {
            args: Prisma.CashMovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>
          }
          deleteMany: {
            args: Prisma.CashMovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CashMovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CashMovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CashMovementPayload>
          }
          aggregate: {
            args: Prisma.CashMovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCashMovement>
          }
          groupBy: {
            args: Prisma.CashMovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<CashMovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.CashMovementCountArgs<ExtArgs>
            result: $Utils.Optional<CashMovementCountAggregateOutputType> | number
          }
        }
      }
      SyncOutbox: {
        payload: Prisma.$SyncOutboxPayload<ExtArgs>
        fields: Prisma.SyncOutboxFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncOutboxFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncOutboxFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>
          }
          findFirst: {
            args: Prisma.SyncOutboxFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncOutboxFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>
          }
          findMany: {
            args: Prisma.SyncOutboxFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>[]
          }
          create: {
            args: Prisma.SyncOutboxCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>
          }
          createMany: {
            args: Prisma.SyncOutboxCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncOutboxCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>[]
          }
          delete: {
            args: Prisma.SyncOutboxDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>
          }
          update: {
            args: Prisma.SyncOutboxUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>
          }
          deleteMany: {
            args: Prisma.SyncOutboxDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncOutboxUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SyncOutboxUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncOutboxPayload>
          }
          aggregate: {
            args: Prisma.SyncOutboxAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncOutbox>
          }
          groupBy: {
            args: Prisma.SyncOutboxGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncOutboxGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncOutboxCountArgs<ExtArgs>
            result: $Utils.Optional<SyncOutboxCountAggregateOutputType> | number
          }
        }
      }
      DocumentSequence: {
        payload: Prisma.$DocumentSequencePayload<ExtArgs>
        fields: Prisma.DocumentSequenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentSequenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentSequenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>
          }
          findFirst: {
            args: Prisma.DocumentSequenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentSequenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>
          }
          findMany: {
            args: Prisma.DocumentSequenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>[]
          }
          create: {
            args: Prisma.DocumentSequenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>
          }
          createMany: {
            args: Prisma.DocumentSequenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentSequenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>[]
          }
          delete: {
            args: Prisma.DocumentSequenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>
          }
          update: {
            args: Prisma.DocumentSequenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>
          }
          deleteMany: {
            args: Prisma.DocumentSequenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentSequenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DocumentSequenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentSequencePayload>
          }
          aggregate: {
            args: Prisma.DocumentSequenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocumentSequence>
          }
          groupBy: {
            args: Prisma.DocumentSequenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentSequenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentSequenceCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentSequenceCountAggregateOutputType> | number
          }
        }
      }
      AgtSeries: {
        payload: Prisma.$AgtSeriesPayload<ExtArgs>
        fields: Prisma.AgtSeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgtSeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgtSeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>
          }
          findFirst: {
            args: Prisma.AgtSeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgtSeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>
          }
          findMany: {
            args: Prisma.AgtSeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>[]
          }
          create: {
            args: Prisma.AgtSeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>
          }
          createMany: {
            args: Prisma.AgtSeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgtSeriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>[]
          }
          delete: {
            args: Prisma.AgtSeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>
          }
          update: {
            args: Prisma.AgtSeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>
          }
          deleteMany: {
            args: Prisma.AgtSeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgtSeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AgtSeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgtSeriesPayload>
          }
          aggregate: {
            args: Prisma.AgtSeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgtSeries>
          }
          groupBy: {
            args: Prisma.AgtSeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgtSeriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgtSeriesCountArgs<ExtArgs>
            result: $Utils.Optional<AgtSeriesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    invoices: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | UserCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    invoices: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | ClientCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    items: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | CategoryCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemWhereInput
  }


  /**
   * Count Type ItemCountOutputType
   */

  export type ItemCountOutputType = {
    invoiceLines: number
  }

  export type ItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceLines?: boolean | ItemCountOutputTypeCountInvoiceLinesArgs
  }

  // Custom InputTypes
  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemCountOutputType
     */
    select?: ItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountInvoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineWhereInput
  }


  /**
   * Count Type InvoiceCountOutputType
   */

  export type InvoiceCountOutputType = {
    lines: number
  }

  export type InvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | InvoiceCountOutputTypeCountLinesArgs
  }

  // Custom InputTypes
  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceCountOutputType
     */
    select?: InvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineWhereInput
  }


  /**
   * Count Type CashSessionCountOutputType
   */

  export type CashSessionCountOutputType = {
    movements: number
  }

  export type CashSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movements?: boolean | CashSessionCountOutputTypeCountMovementsArgs
  }

  // Custom InputTypes
  /**
   * CashSessionCountOutputType without action
   */
  export type CashSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSessionCountOutputType
     */
    select?: CashSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CashSessionCountOutputType without action
   */
  export type CashSessionCountOutputTypeCountMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CashMovementWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    name: string | null
    email: string | null
    role: string | null
    password: string | null
    isActive: boolean | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    name: string | null
    email: string | null
    role: string | null
    password: string | null
    isActive: boolean | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    cloudId: number
    name: number
    email: number
    role: number
    password: number
    isActive: number
    storeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    email?: true
    role?: true
    password?: true
    isActive?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    email?: true
    role?: true
    password?: true
    isActive?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    email?: true
    role?: true
    password?: true
    isActive?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    cloudId: string | null
    name: string
    email: string
    role: string
    password: string | null
    isActive: boolean
    storeId: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    isActive?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoices?: boolean | User$invoicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    isActive?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    cloudId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    isActive?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | User$invoicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      name: string
      email: string
      role: string
      password: string | null
      isActive: boolean
      storeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends User$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, User$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly cloudId: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly storeId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.invoices
   */
  export type User$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Settings
   */

  export type AggregateSettings = {
    _count: SettingsCountAggregateOutputType | null
    _avg: SettingsAvgAggregateOutputType | null
    _sum: SettingsSumAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  export type SettingsAvgAggregateOutputType = {
    fraudAttemptCount: number | null
  }

  export type SettingsSumAggregateOutputType = {
    fraudAttemptCount: number | null
  }

  export type SettingsMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    hardwareId: string | null
    offlineLicense: string | null
    lastSync: Date | null
    lastOperationTime: Date | null
    lastFraudAttempt: Date | null
    fraudAttemptCount: number | null
    terminalMode: string | null
    masterIp: string | null
    lanSecret: string | null
  }

  export type SettingsMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    hardwareId: string | null
    offlineLicense: string | null
    lastSync: Date | null
    lastOperationTime: Date | null
    lastFraudAttempt: Date | null
    fraudAttemptCount: number | null
    terminalMode: string | null
    masterIp: string | null
    lanSecret: string | null
  }

  export type SettingsCountAggregateOutputType = {
    id: number
    storeId: number
    hardwareId: number
    offlineLicense: number
    lastSync: number
    lastOperationTime: number
    lastFraudAttempt: number
    fraudAttemptCount: number
    terminalMode: number
    masterIp: number
    lanSecret: number
    _all: number
  }


  export type SettingsAvgAggregateInputType = {
    fraudAttemptCount?: true
  }

  export type SettingsSumAggregateInputType = {
    fraudAttemptCount?: true
  }

  export type SettingsMinAggregateInputType = {
    id?: true
    storeId?: true
    hardwareId?: true
    offlineLicense?: true
    lastSync?: true
    lastOperationTime?: true
    lastFraudAttempt?: true
    fraudAttemptCount?: true
    terminalMode?: true
    masterIp?: true
    lanSecret?: true
  }

  export type SettingsMaxAggregateInputType = {
    id?: true
    storeId?: true
    hardwareId?: true
    offlineLicense?: true
    lastSync?: true
    lastOperationTime?: true
    lastFraudAttempt?: true
    fraudAttemptCount?: true
    terminalMode?: true
    masterIp?: true
    lanSecret?: true
  }

  export type SettingsCountAggregateInputType = {
    id?: true
    storeId?: true
    hardwareId?: true
    offlineLicense?: true
    lastSync?: true
    lastOperationTime?: true
    lastFraudAttempt?: true
    fraudAttemptCount?: true
    terminalMode?: true
    masterIp?: true
    lanSecret?: true
    _all?: true
  }

  export type SettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to aggregate.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingsMaxAggregateInputType
  }

  export type GetSettingsAggregateType<T extends SettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettings[P]>
      : GetScalarType<T[P], AggregateSettings[P]>
  }




  export type SettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingsWhereInput
    orderBy?: SettingsOrderByWithAggregationInput | SettingsOrderByWithAggregationInput[]
    by: SettingsScalarFieldEnum[] | SettingsScalarFieldEnum
    having?: SettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingsCountAggregateInputType | true
    _avg?: SettingsAvgAggregateInputType
    _sum?: SettingsSumAggregateInputType
    _min?: SettingsMinAggregateInputType
    _max?: SettingsMaxAggregateInputType
  }

  export type SettingsGroupByOutputType = {
    id: string
    storeId: string | null
    hardwareId: string | null
    offlineLicense: string | null
    lastSync: Date
    lastOperationTime: Date | null
    lastFraudAttempt: Date | null
    fraudAttemptCount: number
    terminalMode: string
    masterIp: string | null
    lanSecret: string | null
    _count: SettingsCountAggregateOutputType | null
    _avg: SettingsAvgAggregateOutputType | null
    _sum: SettingsSumAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  type GetSettingsGroupByPayload<T extends SettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SettingsGroupByOutputType[P]>
        }
      >
    >


  export type SettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    hardwareId?: boolean
    offlineLicense?: boolean
    lastSync?: boolean
    lastOperationTime?: boolean
    lastFraudAttempt?: boolean
    fraudAttemptCount?: boolean
    terminalMode?: boolean
    masterIp?: boolean
    lanSecret?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    hardwareId?: boolean
    offlineLicense?: boolean
    lastSync?: boolean
    lastOperationTime?: boolean
    lastFraudAttempt?: boolean
    fraudAttemptCount?: boolean
    terminalMode?: boolean
    masterIp?: boolean
    lanSecret?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectScalar = {
    id?: boolean
    storeId?: boolean
    hardwareId?: boolean
    offlineLicense?: boolean
    lastSync?: boolean
    lastOperationTime?: boolean
    lastFraudAttempt?: boolean
    fraudAttemptCount?: boolean
    terminalMode?: boolean
    masterIp?: boolean
    lanSecret?: boolean
  }


  export type $SettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Settings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string | null
      hardwareId: string | null
      offlineLicense: string | null
      lastSync: Date
      lastOperationTime: Date | null
      lastFraudAttempt: Date | null
      fraudAttemptCount: number
      terminalMode: string
      masterIp: string | null
      lanSecret: string | null
    }, ExtArgs["result"]["settings"]>
    composites: {}
  }

  type SettingsGetPayload<S extends boolean | null | undefined | SettingsDefaultArgs> = $Result.GetResult<Prisma.$SettingsPayload, S>

  type SettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SettingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SettingsCountAggregateInputType | true
    }

  export interface SettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Settings'], meta: { name: 'Settings' } }
    /**
     * Find zero or one Settings that matches the filter.
     * @param {SettingsFindUniqueArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingsFindUniqueArgs>(args: SelectSubset<T, SettingsFindUniqueArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Settings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SettingsFindUniqueOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingsFindFirstArgs>(args?: SelectSubset<T, SettingsFindFirstArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Settings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.settings.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.settings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingsWithIdOnly = await prisma.settings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingsFindManyArgs>(args?: SelectSubset<T, SettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Settings.
     * @param {SettingsCreateArgs} args - Arguments to create a Settings.
     * @example
     * // Create one Settings
     * const Settings = await prisma.settings.create({
     *   data: {
     *     // ... data to create a Settings
     *   }
     * })
     * 
     */
    create<T extends SettingsCreateArgs>(args: SelectSubset<T, SettingsCreateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Settings.
     * @param {SettingsCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingsCreateManyArgs>(args?: SelectSubset<T, SettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingsCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingsWithIdOnly = await prisma.settings.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Settings.
     * @param {SettingsDeleteArgs} args - Arguments to delete one Settings.
     * @example
     * // Delete one Settings
     * const Settings = await prisma.settings.delete({
     *   where: {
     *     // ... filter to delete one Settings
     *   }
     * })
     * 
     */
    delete<T extends SettingsDeleteArgs>(args: SelectSubset<T, SettingsDeleteArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Settings.
     * @param {SettingsUpdateArgs} args - Arguments to update one Settings.
     * @example
     * // Update one Settings
     * const settings = await prisma.settings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingsUpdateArgs>(args: SelectSubset<T, SettingsUpdateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Settings.
     * @param {SettingsDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.settings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingsDeleteManyArgs>(args?: SelectSubset<T, SettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingsUpdateManyArgs>(args: SelectSubset<T, SettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Settings.
     * @param {SettingsUpsertArgs} args - Arguments to update or create a Settings.
     * @example
     * // Update or create a Settings
     * const settings = await prisma.settings.upsert({
     *   create: {
     *     // ... data to create a Settings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Settings we want to update
     *   }
     * })
     */
    upsert<T extends SettingsUpsertArgs>(args: SelectSubset<T, SettingsUpsertArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.settings.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingsCountArgs>(
      args?: Subset<T, SettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingsAggregateArgs>(args: Subset<T, SettingsAggregateArgs>): Prisma.PrismaPromise<GetSettingsAggregateType<T>>

    /**
     * Group by Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingsGroupByArgs['orderBy'] }
        : { orderBy?: SettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Settings model
   */
  readonly fields: SettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Settings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Settings model
   */ 
  interface SettingsFieldRefs {
    readonly id: FieldRef<"Settings", 'String'>
    readonly storeId: FieldRef<"Settings", 'String'>
    readonly hardwareId: FieldRef<"Settings", 'String'>
    readonly offlineLicense: FieldRef<"Settings", 'String'>
    readonly lastSync: FieldRef<"Settings", 'DateTime'>
    readonly lastOperationTime: FieldRef<"Settings", 'DateTime'>
    readonly lastFraudAttempt: FieldRef<"Settings", 'DateTime'>
    readonly fraudAttemptCount: FieldRef<"Settings", 'Int'>
    readonly terminalMode: FieldRef<"Settings", 'String'>
    readonly masterIp: FieldRef<"Settings", 'String'>
    readonly lanSecret: FieldRef<"Settings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Settings findUnique
   */
  export type SettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findUniqueOrThrow
   */
  export type SettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findFirst
   */
  export type SettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findFirstOrThrow
   */
  export type SettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findMany
   */
  export type SettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings create
   */
  export type SettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * The data needed to create a Settings.
     */
    data?: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
  }

  /**
   * Settings createMany
   */
  export type SettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
  }

  /**
   * Settings createManyAndReturn
   */
  export type SettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
  }

  /**
   * Settings update
   */
  export type SettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * The data needed to update a Settings.
     */
    data: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
    /**
     * Choose, which Settings to update.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings updateMany
   */
  export type SettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
  }

  /**
   * Settings upsert
   */
  export type SettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * The filter to search for the Settings to update in case it exists.
     */
    where: SettingsWhereUniqueInput
    /**
     * In case the Settings found by the `where` argument doesn't exist, create a new Settings with this data.
     */
    create: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
    /**
     * In case the Settings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
  }

  /**
   * Settings delete
   */
  export type SettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter which Settings to delete.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings deleteMany
   */
  export type SettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingsWhereInput
  }

  /**
   * Settings without action
   */
  export type SettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    offlineId: string | null
    name: string | null
    taxNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    offlineId: string | null
    name: string | null
    taxNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    cloudId: number
    offlineId: number
    name: number
    taxNumber: number
    email: number
    phone: number
    address: number
    storeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    cloudId?: true
    offlineId?: true
    name?: true
    taxNumber?: true
    email?: true
    phone?: true
    address?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    cloudId?: true
    offlineId?: true
    name?: true
    taxNumber?: true
    email?: true
    phone?: true
    address?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    cloudId?: true
    offlineId?: true
    name?: true
    taxNumber?: true
    email?: true
    phone?: true
    address?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    cloudId: string | null
    offlineId: string | null
    name: string
    taxNumber: string | null
    email: string | null
    phone: string | null
    address: string | null
    storeId: string
    createdAt: Date
    updatedAt: Date
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    offlineId?: boolean
    name?: boolean
    taxNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoices?: boolean | Client$invoicesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    offlineId?: boolean
    name?: boolean
    taxNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    cloudId?: boolean
    offlineId?: boolean
    name?: boolean
    taxNumber?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | Client$invoicesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      offlineId: string | null
      name: string
      taxNumber: string | null
      email: string | null
      phone: string | null
      address: string | null
      storeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends Client$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Client$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */ 
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly cloudId: FieldRef<"Client", 'String'>
    readonly offlineId: FieldRef<"Client", 'String'>
    readonly name: FieldRef<"Client", 'String'>
    readonly taxNumber: FieldRef<"Client", 'String'>
    readonly email: FieldRef<"Client", 'String'>
    readonly phone: FieldRef<"Client", 'String'>
    readonly address: FieldRef<"Client", 'String'>
    readonly storeId: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
  }

  /**
   * Client.invoices
   */
  export type Client$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    name: string | null
    description: string | null
    storeId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    name: string | null
    description: string | null
    storeId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    cloudId: number
    name: number
    description: number
    storeId: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryMinAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    description?: true
    storeId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    description?: true
    storeId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    cloudId?: true
    name?: true
    description?: true
    storeId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    cloudId: string | null
    name: string
    description: string | null
    storeId: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    storeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | Category$itemsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    storeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    cloudId?: boolean
    name?: boolean
    description?: boolean
    storeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Category$itemsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      items: Prisma.$ItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      name: string
      description: string | null
      storeId: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends Category$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Category$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */ 
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly cloudId: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly description: FieldRef<"Category", 'String'>
    readonly storeId: FieldRef<"Category", 'String'>
    readonly isActive: FieldRef<"Category", 'Boolean'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
  }

  /**
   * Category.items
   */
  export type Category$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    where?: ItemWhereInput
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    cursor?: ItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Item
   */

  export type AggregateItem = {
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  export type ItemAvgAggregateOutputType = {
    price: number | null
    taxPercent: number | null
    stock: number | null
  }

  export type ItemSumAggregateOutputType = {
    price: number | null
    taxPercent: number | null
    stock: number | null
  }

  export type ItemMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    code: string | null
    name: string | null
    description: string | null
    price: number | null
    taxPercent: number | null
    stock: number | null
    barcode: string | null
    categoryId: string | null
    storeId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    code: string | null
    name: string | null
    description: string | null
    price: number | null
    taxPercent: number | null
    stock: number | null
    barcode: string | null
    categoryId: string | null
    storeId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemCountAggregateOutputType = {
    id: number
    cloudId: number
    code: number
    name: number
    description: number
    price: number
    taxPercent: number
    stock: number
    barcode: number
    categoryId: number
    storeId: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItemAvgAggregateInputType = {
    price?: true
    taxPercent?: true
    stock?: true
  }

  export type ItemSumAggregateInputType = {
    price?: true
    taxPercent?: true
    stock?: true
  }

  export type ItemMinAggregateInputType = {
    id?: true
    cloudId?: true
    code?: true
    name?: true
    description?: true
    price?: true
    taxPercent?: true
    stock?: true
    barcode?: true
    categoryId?: true
    storeId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemMaxAggregateInputType = {
    id?: true
    cloudId?: true
    code?: true
    name?: true
    description?: true
    price?: true
    taxPercent?: true
    stock?: true
    barcode?: true
    categoryId?: true
    storeId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemCountAggregateInputType = {
    id?: true
    cloudId?: true
    code?: true
    name?: true
    description?: true
    price?: true
    taxPercent?: true
    stock?: true
    barcode?: true
    categoryId?: true
    storeId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Item to aggregate.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Items
    **/
    _count?: true | ItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemMaxAggregateInputType
  }

  export type GetItemAggregateType<T extends ItemAggregateArgs> = {
        [P in keyof T & keyof AggregateItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItem[P]>
      : GetScalarType<T[P], AggregateItem[P]>
  }




  export type ItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemWhereInput
    orderBy?: ItemOrderByWithAggregationInput | ItemOrderByWithAggregationInput[]
    by: ItemScalarFieldEnum[] | ItemScalarFieldEnum
    having?: ItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemCountAggregateInputType | true
    _avg?: ItemAvgAggregateInputType
    _sum?: ItemSumAggregateInputType
    _min?: ItemMinAggregateInputType
    _max?: ItemMaxAggregateInputType
  }

  export type ItemGroupByOutputType = {
    id: string
    cloudId: string | null
    code: string | null
    name: string
    description: string | null
    price: number
    taxPercent: number
    stock: number
    barcode: string | null
    categoryId: string | null
    storeId: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  type GetItemGroupByPayload<T extends ItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemGroupByOutputType[P]>
            : GetScalarType<T[P], ItemGroupByOutputType[P]>
        }
      >
    >


  export type ItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    taxPercent?: boolean
    stock?: boolean
    barcode?: boolean
    categoryId?: boolean
    storeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | Item$categoryArgs<ExtArgs>
    invoiceLines?: boolean | Item$invoiceLinesArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["item"]>

  export type ItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    taxPercent?: boolean
    stock?: boolean
    barcode?: boolean
    categoryId?: boolean
    storeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | Item$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["item"]>

  export type ItemSelectScalar = {
    id?: boolean
    cloudId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    taxPercent?: boolean
    stock?: boolean
    barcode?: boolean
    categoryId?: boolean
    storeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | Item$categoryArgs<ExtArgs>
    invoiceLines?: boolean | Item$invoiceLinesArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | Item$categoryArgs<ExtArgs>
  }

  export type $ItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Item"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs> | null
      invoiceLines: Prisma.$InvoiceLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      code: string | null
      name: string
      description: string | null
      price: number
      taxPercent: number
      stock: number
      barcode: string | null
      categoryId: string | null
      storeId: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["item"]>
    composites: {}
  }

  type ItemGetPayload<S extends boolean | null | undefined | ItemDefaultArgs> = $Result.GetResult<Prisma.$ItemPayload, S>

  type ItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ItemCountAggregateInputType | true
    }

  export interface ItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Item'], meta: { name: 'Item' } }
    /**
     * Find zero or one Item that matches the filter.
     * @param {ItemFindUniqueArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemFindUniqueArgs>(args: SelectSubset<T, ItemFindUniqueArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Item that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ItemFindUniqueOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Item that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemFindFirstArgs>(args?: SelectSubset<T, ItemFindFirstArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Item that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Items
     * const items = await prisma.item.findMany()
     * 
     * // Get first 10 Items
     * const items = await prisma.item.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemWithIdOnly = await prisma.item.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemFindManyArgs>(args?: SelectSubset<T, ItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Item.
     * @param {ItemCreateArgs} args - Arguments to create a Item.
     * @example
     * // Create one Item
     * const Item = await prisma.item.create({
     *   data: {
     *     // ... data to create a Item
     *   }
     * })
     * 
     */
    create<T extends ItemCreateArgs>(args: SelectSubset<T, ItemCreateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Items.
     * @param {ItemCreateManyArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemCreateManyArgs>(args?: SelectSubset<T, ItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Items and returns the data saved in the database.
     * @param {ItemCreateManyAndReturnArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Items and only return the `id`
     * const itemWithIdOnly = await prisma.item.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Item.
     * @param {ItemDeleteArgs} args - Arguments to delete one Item.
     * @example
     * // Delete one Item
     * const Item = await prisma.item.delete({
     *   where: {
     *     // ... filter to delete one Item
     *   }
     * })
     * 
     */
    delete<T extends ItemDeleteArgs>(args: SelectSubset<T, ItemDeleteArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Item.
     * @param {ItemUpdateArgs} args - Arguments to update one Item.
     * @example
     * // Update one Item
     * const item = await prisma.item.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemUpdateArgs>(args: SelectSubset<T, ItemUpdateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Items.
     * @param {ItemDeleteManyArgs} args - Arguments to filter Items to delete.
     * @example
     * // Delete a few Items
     * const { count } = await prisma.item.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemDeleteManyArgs>(args?: SelectSubset<T, ItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Items
     * const item = await prisma.item.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemUpdateManyArgs>(args: SelectSubset<T, ItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Item.
     * @param {ItemUpsertArgs} args - Arguments to update or create a Item.
     * @example
     * // Update or create a Item
     * const item = await prisma.item.upsert({
     *   create: {
     *     // ... data to create a Item
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Item we want to update
     *   }
     * })
     */
    upsert<T extends ItemUpsertArgs>(args: SelectSubset<T, ItemUpsertArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCountArgs} args - Arguments to filter Items to count.
     * @example
     * // Count the number of Items
     * const count = await prisma.item.count({
     *   where: {
     *     // ... the filter for the Items we want to count
     *   }
     * })
    **/
    count<T extends ItemCountArgs>(
      args?: Subset<T, ItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItemAggregateArgs>(args: Subset<T, ItemAggregateArgs>): Prisma.PrismaPromise<GetItemAggregateType<T>>

    /**
     * Group by Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemGroupByArgs['orderBy'] }
        : { orderBy?: ItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Item model
   */
  readonly fields: ItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Item.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends Item$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Item$categoryArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    invoiceLines<T extends Item$invoiceLinesArgs<ExtArgs> = {}>(args?: Subset<T, Item$invoiceLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Item model
   */ 
  interface ItemFieldRefs {
    readonly id: FieldRef<"Item", 'String'>
    readonly cloudId: FieldRef<"Item", 'String'>
    readonly code: FieldRef<"Item", 'String'>
    readonly name: FieldRef<"Item", 'String'>
    readonly description: FieldRef<"Item", 'String'>
    readonly price: FieldRef<"Item", 'Float'>
    readonly taxPercent: FieldRef<"Item", 'Float'>
    readonly stock: FieldRef<"Item", 'Float'>
    readonly barcode: FieldRef<"Item", 'String'>
    readonly categoryId: FieldRef<"Item", 'String'>
    readonly storeId: FieldRef<"Item", 'String'>
    readonly isActive: FieldRef<"Item", 'Boolean'>
    readonly createdAt: FieldRef<"Item", 'DateTime'>
    readonly updatedAt: FieldRef<"Item", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Item findUnique
   */
  export type ItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findUniqueOrThrow
   */
  export type ItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findFirst
   */
  export type ItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findFirstOrThrow
   */
  export type ItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findMany
   */
  export type ItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Items to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item create
   */
  export type ItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to create a Item.
     */
    data: XOR<ItemCreateInput, ItemUncheckedCreateInput>
  }

  /**
   * Item createMany
   */
  export type ItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
  }

  /**
   * Item createManyAndReturn
   */
  export type ItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Item update
   */
  export type ItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to update a Item.
     */
    data: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
    /**
     * Choose, which Item to update.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item updateMany
   */
  export type ItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Items.
     */
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyInput>
    /**
     * Filter which Items to update
     */
    where?: ItemWhereInput
  }

  /**
   * Item upsert
   */
  export type ItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The filter to search for the Item to update in case it exists.
     */
    where: ItemWhereUniqueInput
    /**
     * In case the Item found by the `where` argument doesn't exist, create a new Item with this data.
     */
    create: XOR<ItemCreateInput, ItemUncheckedCreateInput>
    /**
     * In case the Item was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
  }

  /**
   * Item delete
   */
  export type ItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter which Item to delete.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item deleteMany
   */
  export type ItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Items to delete
     */
    where?: ItemWhereInput
  }

  /**
   * Item.category
   */
  export type Item$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Item.invoiceLines
   */
  export type Item$invoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    where?: InvoiceLineWhereInput
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    cursor?: InvoiceLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * Item without action
   */
  export type ItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    netTotal: number | null
    taxTotal: number | null
    grossTotal: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    netTotal: number | null
    taxTotal: number | null
    grossTotal: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    localNo: string | null
    agtNo: string | null
    status: string | null
    issueDate: Date | null
    netTotal: number | null
    taxTotal: number | null
    grossTotal: number | null
    hash: string | null
    hashControl: string | null
    userId: string | null
    clientId: string | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    localNo: string | null
    agtNo: string | null
    status: string | null
    issueDate: Date | null
    netTotal: number | null
    taxTotal: number | null
    grossTotal: number | null
    hash: string | null
    hashControl: string | null
    userId: string | null
    clientId: string | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    localNo: number
    agtNo: number
    status: number
    issueDate: number
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash: number
    hashControl: number
    userId: number
    clientId: number
    storeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    netTotal?: true
    taxTotal?: true
    grossTotal?: true
  }

  export type InvoiceSumAggregateInputType = {
    netTotal?: true
    taxTotal?: true
    grossTotal?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    localNo?: true
    agtNo?: true
    status?: true
    issueDate?: true
    netTotal?: true
    taxTotal?: true
    grossTotal?: true
    hash?: true
    hashControl?: true
    userId?: true
    clientId?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    localNo?: true
    agtNo?: true
    status?: true
    issueDate?: true
    netTotal?: true
    taxTotal?: true
    grossTotal?: true
    hash?: true
    hashControl?: true
    userId?: true
    clientId?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    localNo?: true
    agtNo?: true
    status?: true
    issueDate?: true
    netTotal?: true
    taxTotal?: true
    grossTotal?: true
    hash?: true
    hashControl?: true
    userId?: true
    clientId?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    localNo: string
    agtNo: string | null
    status: string
    issueDate: Date
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash: string | null
    hashControl: string | null
    userId: string
    clientId: string | null
    storeId: string
    createdAt: Date
    updatedAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    localNo?: boolean
    agtNo?: boolean
    status?: boolean
    issueDate?: boolean
    netTotal?: boolean
    taxTotal?: boolean
    grossTotal?: boolean
    hash?: boolean
    hashControl?: boolean
    userId?: boolean
    clientId?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    client?: boolean | Invoice$clientArgs<ExtArgs>
    lines?: boolean | Invoice$linesArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    localNo?: boolean
    agtNo?: boolean
    status?: boolean
    issueDate?: boolean
    netTotal?: boolean
    taxTotal?: boolean
    grossTotal?: boolean
    hash?: boolean
    hashControl?: boolean
    userId?: boolean
    clientId?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    client?: boolean | Invoice$clientArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    localNo?: boolean
    agtNo?: boolean
    status?: boolean
    issueDate?: boolean
    netTotal?: boolean
    taxTotal?: boolean
    grossTotal?: boolean
    hash?: boolean
    hashControl?: boolean
    userId?: boolean
    clientId?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    client?: boolean | Invoice$clientArgs<ExtArgs>
    lines?: boolean | Invoice$linesArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    client?: boolean | Invoice$clientArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      client: Prisma.$ClientPayload<ExtArgs> | null
      lines: Prisma.$InvoiceLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      localNo: string
      agtNo: string | null
      status: string
      issueDate: Date
      netTotal: number
      taxTotal: number
      grossTotal: number
      hash: string | null
      hashControl: string | null
      userId: string
      clientId: string | null
      storeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    client<T extends Invoice$clientArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$clientArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    lines<T extends Invoice$linesArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */ 
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly localNo: FieldRef<"Invoice", 'String'>
    readonly agtNo: FieldRef<"Invoice", 'String'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly issueDate: FieldRef<"Invoice", 'DateTime'>
    readonly netTotal: FieldRef<"Invoice", 'Float'>
    readonly taxTotal: FieldRef<"Invoice", 'Float'>
    readonly grossTotal: FieldRef<"Invoice", 'Float'>
    readonly hash: FieldRef<"Invoice", 'String'>
    readonly hashControl: FieldRef<"Invoice", 'String'>
    readonly userId: FieldRef<"Invoice", 'String'>
    readonly clientId: FieldRef<"Invoice", 'String'>
    readonly storeId: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice.client
   */
  export type Invoice$clientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
  }

  /**
   * Invoice.lines
   */
  export type Invoice$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    where?: InvoiceLineWhereInput
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    cursor?: InvoiceLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceLine
   */

  export type AggregateInvoiceLine = {
    _count: InvoiceLineCountAggregateOutputType | null
    _avg: InvoiceLineAvgAggregateOutputType | null
    _sum: InvoiceLineSumAggregateOutputType | null
    _min: InvoiceLineMinAggregateOutputType | null
    _max: InvoiceLineMaxAggregateOutputType | null
  }

  export type InvoiceLineAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    taxPercent: number | null
    discount: number | null
    netTotal: number | null
    grossTotal: number | null
  }

  export type InvoiceLineSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    taxPercent: number | null
    discount: number | null
    netTotal: number | null
    grossTotal: number | null
  }

  export type InvoiceLineMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    itemId: string | null
    quantity: number | null
    unitPrice: number | null
    taxPercent: number | null
    discount: number | null
    netTotal: number | null
    grossTotal: number | null
  }

  export type InvoiceLineMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    itemId: string | null
    quantity: number | null
    unitPrice: number | null
    taxPercent: number | null
    discount: number | null
    netTotal: number | null
    grossTotal: number | null
  }

  export type InvoiceLineCountAggregateOutputType = {
    id: number
    invoiceId: number
    itemId: number
    quantity: number
    unitPrice: number
    taxPercent: number
    discount: number
    netTotal: number
    grossTotal: number
    _all: number
  }


  export type InvoiceLineAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    taxPercent?: true
    discount?: true
    netTotal?: true
    grossTotal?: true
  }

  export type InvoiceLineSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    taxPercent?: true
    discount?: true
    netTotal?: true
    grossTotal?: true
  }

  export type InvoiceLineMinAggregateInputType = {
    id?: true
    invoiceId?: true
    itemId?: true
    quantity?: true
    unitPrice?: true
    taxPercent?: true
    discount?: true
    netTotal?: true
    grossTotal?: true
  }

  export type InvoiceLineMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    itemId?: true
    quantity?: true
    unitPrice?: true
    taxPercent?: true
    discount?: true
    netTotal?: true
    grossTotal?: true
  }

  export type InvoiceLineCountAggregateInputType = {
    id?: true
    invoiceId?: true
    itemId?: true
    quantity?: true
    unitPrice?: true
    taxPercent?: true
    discount?: true
    netTotal?: true
    grossTotal?: true
    _all?: true
  }

  export type InvoiceLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLine to aggregate.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceLines
    **/
    _count?: true | InvoiceLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceLineMaxAggregateInputType
  }

  export type GetInvoiceLineAggregateType<T extends InvoiceLineAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceLine[P]>
      : GetScalarType<T[P], AggregateInvoiceLine[P]>
  }




  export type InvoiceLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineWhereInput
    orderBy?: InvoiceLineOrderByWithAggregationInput | InvoiceLineOrderByWithAggregationInput[]
    by: InvoiceLineScalarFieldEnum[] | InvoiceLineScalarFieldEnum
    having?: InvoiceLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceLineCountAggregateInputType | true
    _avg?: InvoiceLineAvgAggregateInputType
    _sum?: InvoiceLineSumAggregateInputType
    _min?: InvoiceLineMinAggregateInputType
    _max?: InvoiceLineMaxAggregateInputType
  }

  export type InvoiceLineGroupByOutputType = {
    id: string
    invoiceId: string
    itemId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount: number
    netTotal: number
    grossTotal: number
    _count: InvoiceLineCountAggregateOutputType | null
    _avg: InvoiceLineAvgAggregateOutputType | null
    _sum: InvoiceLineSumAggregateOutputType | null
    _min: InvoiceLineMinAggregateOutputType | null
    _max: InvoiceLineMaxAggregateOutputType | null
  }

  type GetInvoiceLineGroupByPayload<T extends InvoiceLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceLineGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceLineGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    itemId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    taxPercent?: boolean
    discount?: boolean
    netTotal?: boolean
    grossTotal?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLine"]>

  export type InvoiceLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    itemId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    taxPercent?: boolean
    discount?: boolean
    netTotal?: boolean
    grossTotal?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLine"]>

  export type InvoiceLineSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    itemId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    taxPercent?: boolean
    discount?: boolean
    netTotal?: boolean
    grossTotal?: boolean
  }

  export type InvoiceLineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }
  export type InvoiceLineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }

  export type $InvoiceLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceLine"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
      item: Prisma.$ItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      itemId: string
      quantity: number
      unitPrice: number
      taxPercent: number
      discount: number
      netTotal: number
      grossTotal: number
    }, ExtArgs["result"]["invoiceLine"]>
    composites: {}
  }

  type InvoiceLineGetPayload<S extends boolean | null | undefined | InvoiceLineDefaultArgs> = $Result.GetResult<Prisma.$InvoiceLinePayload, S>

  type InvoiceLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceLineCountAggregateInputType | true
    }

  export interface InvoiceLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceLine'], meta: { name: 'InvoiceLine' } }
    /**
     * Find zero or one InvoiceLine that matches the filter.
     * @param {InvoiceLineFindUniqueArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceLineFindUniqueArgs>(args: SelectSubset<T, InvoiceLineFindUniqueArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InvoiceLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceLineFindUniqueOrThrowArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceLineFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InvoiceLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineFindFirstArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceLineFindFirstArgs>(args?: SelectSubset<T, InvoiceLineFindFirstArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InvoiceLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineFindFirstOrThrowArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceLineFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InvoiceLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceLines
     * const invoiceLines = await prisma.invoiceLine.findMany()
     * 
     * // Get first 10 InvoiceLines
     * const invoiceLines = await prisma.invoiceLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceLineWithIdOnly = await prisma.invoiceLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceLineFindManyArgs>(args?: SelectSubset<T, InvoiceLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InvoiceLine.
     * @param {InvoiceLineCreateArgs} args - Arguments to create a InvoiceLine.
     * @example
     * // Create one InvoiceLine
     * const InvoiceLine = await prisma.invoiceLine.create({
     *   data: {
     *     // ... data to create a InvoiceLine
     *   }
     * })
     * 
     */
    create<T extends InvoiceLineCreateArgs>(args: SelectSubset<T, InvoiceLineCreateArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InvoiceLines.
     * @param {InvoiceLineCreateManyArgs} args - Arguments to create many InvoiceLines.
     * @example
     * // Create many InvoiceLines
     * const invoiceLine = await prisma.invoiceLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceLineCreateManyArgs>(args?: SelectSubset<T, InvoiceLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvoiceLines and returns the data saved in the database.
     * @param {InvoiceLineCreateManyAndReturnArgs} args - Arguments to create many InvoiceLines.
     * @example
     * // Create many InvoiceLines
     * const invoiceLine = await prisma.invoiceLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvoiceLines and only return the `id`
     * const invoiceLineWithIdOnly = await prisma.invoiceLine.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceLineCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InvoiceLine.
     * @param {InvoiceLineDeleteArgs} args - Arguments to delete one InvoiceLine.
     * @example
     * // Delete one InvoiceLine
     * const InvoiceLine = await prisma.invoiceLine.delete({
     *   where: {
     *     // ... filter to delete one InvoiceLine
     *   }
     * })
     * 
     */
    delete<T extends InvoiceLineDeleteArgs>(args: SelectSubset<T, InvoiceLineDeleteArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InvoiceLine.
     * @param {InvoiceLineUpdateArgs} args - Arguments to update one InvoiceLine.
     * @example
     * // Update one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceLineUpdateArgs>(args: SelectSubset<T, InvoiceLineUpdateArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InvoiceLines.
     * @param {InvoiceLineDeleteManyArgs} args - Arguments to filter InvoiceLines to delete.
     * @example
     * // Delete a few InvoiceLines
     * const { count } = await prisma.invoiceLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceLineDeleteManyArgs>(args?: SelectSubset<T, InvoiceLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceLines
     * const invoiceLine = await prisma.invoiceLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceLineUpdateManyArgs>(args: SelectSubset<T, InvoiceLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceLine.
     * @param {InvoiceLineUpsertArgs} args - Arguments to update or create a InvoiceLine.
     * @example
     * // Update or create a InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.upsert({
     *   create: {
     *     // ... data to create a InvoiceLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceLine we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceLineUpsertArgs>(args: SelectSubset<T, InvoiceLineUpsertArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InvoiceLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineCountArgs} args - Arguments to filter InvoiceLines to count.
     * @example
     * // Count the number of InvoiceLines
     * const count = await prisma.invoiceLine.count({
     *   where: {
     *     // ... the filter for the InvoiceLines we want to count
     *   }
     * })
    **/
    count<T extends InvoiceLineCountArgs>(
      args?: Subset<T, InvoiceLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceLineAggregateArgs>(args: Subset<T, InvoiceLineAggregateArgs>): Prisma.PrismaPromise<GetInvoiceLineAggregateType<T>>

    /**
     * Group by InvoiceLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceLineGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceLine model
   */
  readonly fields: InvoiceLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    item<T extends ItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemDefaultArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceLine model
   */ 
  interface InvoiceLineFieldRefs {
    readonly id: FieldRef<"InvoiceLine", 'String'>
    readonly invoiceId: FieldRef<"InvoiceLine", 'String'>
    readonly itemId: FieldRef<"InvoiceLine", 'String'>
    readonly quantity: FieldRef<"InvoiceLine", 'Float'>
    readonly unitPrice: FieldRef<"InvoiceLine", 'Float'>
    readonly taxPercent: FieldRef<"InvoiceLine", 'Float'>
    readonly discount: FieldRef<"InvoiceLine", 'Float'>
    readonly netTotal: FieldRef<"InvoiceLine", 'Float'>
    readonly grossTotal: FieldRef<"InvoiceLine", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceLine findUnique
   */
  export type InvoiceLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine findUniqueOrThrow
   */
  export type InvoiceLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine findFirst
   */
  export type InvoiceLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLines.
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLines.
     */
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * InvoiceLine findFirstOrThrow
   */
  export type InvoiceLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLines.
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLines.
     */
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * InvoiceLine findMany
   */
  export type InvoiceLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLines to fetch.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceLines.
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * InvoiceLine create
   */
  export type InvoiceLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceLine.
     */
    data: XOR<InvoiceLineCreateInput, InvoiceLineUncheckedCreateInput>
  }

  /**
   * InvoiceLine createMany
   */
  export type InvoiceLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceLines.
     */
    data: InvoiceLineCreateManyInput | InvoiceLineCreateManyInput[]
  }

  /**
   * InvoiceLine createManyAndReturn
   */
  export type InvoiceLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InvoiceLines.
     */
    data: InvoiceLineCreateManyInput | InvoiceLineCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceLine update
   */
  export type InvoiceLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceLine.
     */
    data: XOR<InvoiceLineUpdateInput, InvoiceLineUncheckedUpdateInput>
    /**
     * Choose, which InvoiceLine to update.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine updateMany
   */
  export type InvoiceLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceLines.
     */
    data: XOR<InvoiceLineUpdateManyMutationInput, InvoiceLineUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceLines to update
     */
    where?: InvoiceLineWhereInput
  }

  /**
   * InvoiceLine upsert
   */
  export type InvoiceLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceLine to update in case it exists.
     */
    where: InvoiceLineWhereUniqueInput
    /**
     * In case the InvoiceLine found by the `where` argument doesn't exist, create a new InvoiceLine with this data.
     */
    create: XOR<InvoiceLineCreateInput, InvoiceLineUncheckedCreateInput>
    /**
     * In case the InvoiceLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceLineUpdateInput, InvoiceLineUncheckedUpdateInput>
  }

  /**
   * InvoiceLine delete
   */
  export type InvoiceLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter which InvoiceLine to delete.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine deleteMany
   */
  export type InvoiceLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLines to delete
     */
    where?: InvoiceLineWhereInput
  }

  /**
   * InvoiceLine without action
   */
  export type InvoiceLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
  }


  /**
   * Model CashSession
   */

  export type AggregateCashSession = {
    _count: CashSessionCountAggregateOutputType | null
    _avg: CashSessionAvgAggregateOutputType | null
    _sum: CashSessionSumAggregateOutputType | null
    _min: CashSessionMinAggregateOutputType | null
    _max: CashSessionMaxAggregateOutputType | null
  }

  export type CashSessionAvgAggregateOutputType = {
    openingBalance: number | null
    closingBalance: number | null
    totalSales: number | null
    totalExpenses: number | null
  }

  export type CashSessionSumAggregateOutputType = {
    openingBalance: number | null
    closingBalance: number | null
    totalSales: number | null
    totalExpenses: number | null
  }

  export type CashSessionMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    openingDate: Date | null
    closingDate: Date | null
    openingBalance: number | null
    closingBalance: number | null
    totalSales: number | null
    totalExpenses: number | null
    status: string | null
    userId: string | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CashSessionMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    openingDate: Date | null
    closingDate: Date | null
    openingBalance: number | null
    closingBalance: number | null
    totalSales: number | null
    totalExpenses: number | null
    status: string | null
    userId: string | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CashSessionCountAggregateOutputType = {
    id: number
    cloudId: number
    openingDate: number
    closingDate: number
    openingBalance: number
    closingBalance: number
    totalSales: number
    totalExpenses: number
    status: number
    userId: number
    storeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CashSessionAvgAggregateInputType = {
    openingBalance?: true
    closingBalance?: true
    totalSales?: true
    totalExpenses?: true
  }

  export type CashSessionSumAggregateInputType = {
    openingBalance?: true
    closingBalance?: true
    totalSales?: true
    totalExpenses?: true
  }

  export type CashSessionMinAggregateInputType = {
    id?: true
    cloudId?: true
    openingDate?: true
    closingDate?: true
    openingBalance?: true
    closingBalance?: true
    totalSales?: true
    totalExpenses?: true
    status?: true
    userId?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CashSessionMaxAggregateInputType = {
    id?: true
    cloudId?: true
    openingDate?: true
    closingDate?: true
    openingBalance?: true
    closingBalance?: true
    totalSales?: true
    totalExpenses?: true
    status?: true
    userId?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CashSessionCountAggregateInputType = {
    id?: true
    cloudId?: true
    openingDate?: true
    closingDate?: true
    openingBalance?: true
    closingBalance?: true
    totalSales?: true
    totalExpenses?: true
    status?: true
    userId?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CashSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CashSession to aggregate.
     */
    where?: CashSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashSessions to fetch.
     */
    orderBy?: CashSessionOrderByWithRelationInput | CashSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CashSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CashSessions
    **/
    _count?: true | CashSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CashSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CashSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CashSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CashSessionMaxAggregateInputType
  }

  export type GetCashSessionAggregateType<T extends CashSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateCashSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCashSession[P]>
      : GetScalarType<T[P], AggregateCashSession[P]>
  }




  export type CashSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CashSessionWhereInput
    orderBy?: CashSessionOrderByWithAggregationInput | CashSessionOrderByWithAggregationInput[]
    by: CashSessionScalarFieldEnum[] | CashSessionScalarFieldEnum
    having?: CashSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CashSessionCountAggregateInputType | true
    _avg?: CashSessionAvgAggregateInputType
    _sum?: CashSessionSumAggregateInputType
    _min?: CashSessionMinAggregateInputType
    _max?: CashSessionMaxAggregateInputType
  }

  export type CashSessionGroupByOutputType = {
    id: string
    cloudId: string | null
    openingDate: Date
    closingDate: Date | null
    openingBalance: number
    closingBalance: number | null
    totalSales: number
    totalExpenses: number
    status: string
    userId: string
    storeId: string
    createdAt: Date
    updatedAt: Date
    _count: CashSessionCountAggregateOutputType | null
    _avg: CashSessionAvgAggregateOutputType | null
    _sum: CashSessionSumAggregateOutputType | null
    _min: CashSessionMinAggregateOutputType | null
    _max: CashSessionMaxAggregateOutputType | null
  }

  type GetCashSessionGroupByPayload<T extends CashSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CashSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CashSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CashSessionGroupByOutputType[P]>
            : GetScalarType<T[P], CashSessionGroupByOutputType[P]>
        }
      >
    >


  export type CashSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    openingDate?: boolean
    closingDate?: boolean
    openingBalance?: boolean
    closingBalance?: boolean
    totalSales?: boolean
    totalExpenses?: boolean
    status?: boolean
    userId?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    movements?: boolean | CashSession$movementsArgs<ExtArgs>
    _count?: boolean | CashSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cashSession"]>

  export type CashSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    openingDate?: boolean
    closingDate?: boolean
    openingBalance?: boolean
    closingBalance?: boolean
    totalSales?: boolean
    totalExpenses?: boolean
    status?: boolean
    userId?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cashSession"]>

  export type CashSessionSelectScalar = {
    id?: boolean
    cloudId?: boolean
    openingDate?: boolean
    closingDate?: boolean
    openingBalance?: boolean
    closingBalance?: boolean
    totalSales?: boolean
    totalExpenses?: boolean
    status?: boolean
    userId?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CashSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movements?: boolean | CashSession$movementsArgs<ExtArgs>
    _count?: boolean | CashSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CashSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CashSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CashSession"
    objects: {
      movements: Prisma.$CashMovementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      openingDate: Date
      closingDate: Date | null
      openingBalance: number
      closingBalance: number | null
      totalSales: number
      totalExpenses: number
      status: string
      userId: string
      storeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cashSession"]>
    composites: {}
  }

  type CashSessionGetPayload<S extends boolean | null | undefined | CashSessionDefaultArgs> = $Result.GetResult<Prisma.$CashSessionPayload, S>

  type CashSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CashSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CashSessionCountAggregateInputType | true
    }

  export interface CashSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CashSession'], meta: { name: 'CashSession' } }
    /**
     * Find zero or one CashSession that matches the filter.
     * @param {CashSessionFindUniqueArgs} args - Arguments to find a CashSession
     * @example
     * // Get one CashSession
     * const cashSession = await prisma.cashSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CashSessionFindUniqueArgs>(args: SelectSubset<T, CashSessionFindUniqueArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CashSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CashSessionFindUniqueOrThrowArgs} args - Arguments to find a CashSession
     * @example
     * // Get one CashSession
     * const cashSession = await prisma.cashSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CashSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, CashSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CashSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionFindFirstArgs} args - Arguments to find a CashSession
     * @example
     * // Get one CashSession
     * const cashSession = await prisma.cashSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CashSessionFindFirstArgs>(args?: SelectSubset<T, CashSessionFindFirstArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CashSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionFindFirstOrThrowArgs} args - Arguments to find a CashSession
     * @example
     * // Get one CashSession
     * const cashSession = await prisma.cashSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CashSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, CashSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CashSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CashSessions
     * const cashSessions = await prisma.cashSession.findMany()
     * 
     * // Get first 10 CashSessions
     * const cashSessions = await prisma.cashSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cashSessionWithIdOnly = await prisma.cashSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CashSessionFindManyArgs>(args?: SelectSubset<T, CashSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CashSession.
     * @param {CashSessionCreateArgs} args - Arguments to create a CashSession.
     * @example
     * // Create one CashSession
     * const CashSession = await prisma.cashSession.create({
     *   data: {
     *     // ... data to create a CashSession
     *   }
     * })
     * 
     */
    create<T extends CashSessionCreateArgs>(args: SelectSubset<T, CashSessionCreateArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CashSessions.
     * @param {CashSessionCreateManyArgs} args - Arguments to create many CashSessions.
     * @example
     * // Create many CashSessions
     * const cashSession = await prisma.cashSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CashSessionCreateManyArgs>(args?: SelectSubset<T, CashSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CashSessions and returns the data saved in the database.
     * @param {CashSessionCreateManyAndReturnArgs} args - Arguments to create many CashSessions.
     * @example
     * // Create many CashSessions
     * const cashSession = await prisma.cashSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CashSessions and only return the `id`
     * const cashSessionWithIdOnly = await prisma.cashSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CashSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, CashSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CashSession.
     * @param {CashSessionDeleteArgs} args - Arguments to delete one CashSession.
     * @example
     * // Delete one CashSession
     * const CashSession = await prisma.cashSession.delete({
     *   where: {
     *     // ... filter to delete one CashSession
     *   }
     * })
     * 
     */
    delete<T extends CashSessionDeleteArgs>(args: SelectSubset<T, CashSessionDeleteArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CashSession.
     * @param {CashSessionUpdateArgs} args - Arguments to update one CashSession.
     * @example
     * // Update one CashSession
     * const cashSession = await prisma.cashSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CashSessionUpdateArgs>(args: SelectSubset<T, CashSessionUpdateArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CashSessions.
     * @param {CashSessionDeleteManyArgs} args - Arguments to filter CashSessions to delete.
     * @example
     * // Delete a few CashSessions
     * const { count } = await prisma.cashSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CashSessionDeleteManyArgs>(args?: SelectSubset<T, CashSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CashSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CashSessions
     * const cashSession = await prisma.cashSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CashSessionUpdateManyArgs>(args: SelectSubset<T, CashSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CashSession.
     * @param {CashSessionUpsertArgs} args - Arguments to update or create a CashSession.
     * @example
     * // Update or create a CashSession
     * const cashSession = await prisma.cashSession.upsert({
     *   create: {
     *     // ... data to create a CashSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CashSession we want to update
     *   }
     * })
     */
    upsert<T extends CashSessionUpsertArgs>(args: SelectSubset<T, CashSessionUpsertArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CashSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionCountArgs} args - Arguments to filter CashSessions to count.
     * @example
     * // Count the number of CashSessions
     * const count = await prisma.cashSession.count({
     *   where: {
     *     // ... the filter for the CashSessions we want to count
     *   }
     * })
    **/
    count<T extends CashSessionCountArgs>(
      args?: Subset<T, CashSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CashSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CashSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CashSessionAggregateArgs>(args: Subset<T, CashSessionAggregateArgs>): Prisma.PrismaPromise<GetCashSessionAggregateType<T>>

    /**
     * Group by CashSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CashSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CashSessionGroupByArgs['orderBy'] }
        : { orderBy?: CashSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CashSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCashSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CashSession model
   */
  readonly fields: CashSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CashSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CashSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movements<T extends CashSession$movementsArgs<ExtArgs> = {}>(args?: Subset<T, CashSession$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CashSession model
   */ 
  interface CashSessionFieldRefs {
    readonly id: FieldRef<"CashSession", 'String'>
    readonly cloudId: FieldRef<"CashSession", 'String'>
    readonly openingDate: FieldRef<"CashSession", 'DateTime'>
    readonly closingDate: FieldRef<"CashSession", 'DateTime'>
    readonly openingBalance: FieldRef<"CashSession", 'Float'>
    readonly closingBalance: FieldRef<"CashSession", 'Float'>
    readonly totalSales: FieldRef<"CashSession", 'Float'>
    readonly totalExpenses: FieldRef<"CashSession", 'Float'>
    readonly status: FieldRef<"CashSession", 'String'>
    readonly userId: FieldRef<"CashSession", 'String'>
    readonly storeId: FieldRef<"CashSession", 'String'>
    readonly createdAt: FieldRef<"CashSession", 'DateTime'>
    readonly updatedAt: FieldRef<"CashSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CashSession findUnique
   */
  export type CashSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * Filter, which CashSession to fetch.
     */
    where: CashSessionWhereUniqueInput
  }

  /**
   * CashSession findUniqueOrThrow
   */
  export type CashSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * Filter, which CashSession to fetch.
     */
    where: CashSessionWhereUniqueInput
  }

  /**
   * CashSession findFirst
   */
  export type CashSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * Filter, which CashSession to fetch.
     */
    where?: CashSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashSessions to fetch.
     */
    orderBy?: CashSessionOrderByWithRelationInput | CashSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CashSessions.
     */
    cursor?: CashSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CashSessions.
     */
    distinct?: CashSessionScalarFieldEnum | CashSessionScalarFieldEnum[]
  }

  /**
   * CashSession findFirstOrThrow
   */
  export type CashSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * Filter, which CashSession to fetch.
     */
    where?: CashSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashSessions to fetch.
     */
    orderBy?: CashSessionOrderByWithRelationInput | CashSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CashSessions.
     */
    cursor?: CashSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CashSessions.
     */
    distinct?: CashSessionScalarFieldEnum | CashSessionScalarFieldEnum[]
  }

  /**
   * CashSession findMany
   */
  export type CashSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * Filter, which CashSessions to fetch.
     */
    where?: CashSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashSessions to fetch.
     */
    orderBy?: CashSessionOrderByWithRelationInput | CashSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CashSessions.
     */
    cursor?: CashSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashSessions.
     */
    skip?: number
    distinct?: CashSessionScalarFieldEnum | CashSessionScalarFieldEnum[]
  }

  /**
   * CashSession create
   */
  export type CashSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a CashSession.
     */
    data: XOR<CashSessionCreateInput, CashSessionUncheckedCreateInput>
  }

  /**
   * CashSession createMany
   */
  export type CashSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CashSessions.
     */
    data: CashSessionCreateManyInput | CashSessionCreateManyInput[]
  }

  /**
   * CashSession createManyAndReturn
   */
  export type CashSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CashSessions.
     */
    data: CashSessionCreateManyInput | CashSessionCreateManyInput[]
  }

  /**
   * CashSession update
   */
  export type CashSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a CashSession.
     */
    data: XOR<CashSessionUpdateInput, CashSessionUncheckedUpdateInput>
    /**
     * Choose, which CashSession to update.
     */
    where: CashSessionWhereUniqueInput
  }

  /**
   * CashSession updateMany
   */
  export type CashSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CashSessions.
     */
    data: XOR<CashSessionUpdateManyMutationInput, CashSessionUncheckedUpdateManyInput>
    /**
     * Filter which CashSessions to update
     */
    where?: CashSessionWhereInput
  }

  /**
   * CashSession upsert
   */
  export type CashSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the CashSession to update in case it exists.
     */
    where: CashSessionWhereUniqueInput
    /**
     * In case the CashSession found by the `where` argument doesn't exist, create a new CashSession with this data.
     */
    create: XOR<CashSessionCreateInput, CashSessionUncheckedCreateInput>
    /**
     * In case the CashSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CashSessionUpdateInput, CashSessionUncheckedUpdateInput>
  }

  /**
   * CashSession delete
   */
  export type CashSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
    /**
     * Filter which CashSession to delete.
     */
    where: CashSessionWhereUniqueInput
  }

  /**
   * CashSession deleteMany
   */
  export type CashSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CashSessions to delete
     */
    where?: CashSessionWhereInput
  }

  /**
   * CashSession.movements
   */
  export type CashSession$movementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    where?: CashMovementWhereInput
    orderBy?: CashMovementOrderByWithRelationInput | CashMovementOrderByWithRelationInput[]
    cursor?: CashMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CashMovementScalarFieldEnum | CashMovementScalarFieldEnum[]
  }

  /**
   * CashSession without action
   */
  export type CashSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashSession
     */
    select?: CashSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashSessionInclude<ExtArgs> | null
  }


  /**
   * Model CashMovement
   */

  export type AggregateCashMovement = {
    _count: CashMovementCountAggregateOutputType | null
    _avg: CashMovementAvgAggregateOutputType | null
    _sum: CashMovementSumAggregateOutputType | null
    _min: CashMovementMinAggregateOutputType | null
    _max: CashMovementMaxAggregateOutputType | null
  }

  export type CashMovementAvgAggregateOutputType = {
    amount: number | null
  }

  export type CashMovementSumAggregateOutputType = {
    amount: number | null
  }

  export type CashMovementMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    type: string | null
    description: string | null
    amount: number | null
    cashSessionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CashMovementMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    type: string | null
    description: string | null
    amount: number | null
    cashSessionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CashMovementCountAggregateOutputType = {
    id: number
    cloudId: number
    type: number
    description: number
    amount: number
    cashSessionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CashMovementAvgAggregateInputType = {
    amount?: true
  }

  export type CashMovementSumAggregateInputType = {
    amount?: true
  }

  export type CashMovementMinAggregateInputType = {
    id?: true
    cloudId?: true
    type?: true
    description?: true
    amount?: true
    cashSessionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CashMovementMaxAggregateInputType = {
    id?: true
    cloudId?: true
    type?: true
    description?: true
    amount?: true
    cashSessionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CashMovementCountAggregateInputType = {
    id?: true
    cloudId?: true
    type?: true
    description?: true
    amount?: true
    cashSessionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CashMovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CashMovement to aggregate.
     */
    where?: CashMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashMovements to fetch.
     */
    orderBy?: CashMovementOrderByWithRelationInput | CashMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CashMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CashMovements
    **/
    _count?: true | CashMovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CashMovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CashMovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CashMovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CashMovementMaxAggregateInputType
  }

  export type GetCashMovementAggregateType<T extends CashMovementAggregateArgs> = {
        [P in keyof T & keyof AggregateCashMovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCashMovement[P]>
      : GetScalarType<T[P], AggregateCashMovement[P]>
  }




  export type CashMovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CashMovementWhereInput
    orderBy?: CashMovementOrderByWithAggregationInput | CashMovementOrderByWithAggregationInput[]
    by: CashMovementScalarFieldEnum[] | CashMovementScalarFieldEnum
    having?: CashMovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CashMovementCountAggregateInputType | true
    _avg?: CashMovementAvgAggregateInputType
    _sum?: CashMovementSumAggregateInputType
    _min?: CashMovementMinAggregateInputType
    _max?: CashMovementMaxAggregateInputType
  }

  export type CashMovementGroupByOutputType = {
    id: string
    cloudId: string | null
    type: string
    description: string
    amount: number
    cashSessionId: string
    createdAt: Date
    updatedAt: Date
    _count: CashMovementCountAggregateOutputType | null
    _avg: CashMovementAvgAggregateOutputType | null
    _sum: CashMovementSumAggregateOutputType | null
    _min: CashMovementMinAggregateOutputType | null
    _max: CashMovementMaxAggregateOutputType | null
  }

  type GetCashMovementGroupByPayload<T extends CashMovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CashMovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CashMovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CashMovementGroupByOutputType[P]>
            : GetScalarType<T[P], CashMovementGroupByOutputType[P]>
        }
      >
    >


  export type CashMovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    type?: boolean
    description?: boolean
    amount?: boolean
    cashSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cashSession?: boolean | CashSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cashMovement"]>

  export type CashMovementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    type?: boolean
    description?: boolean
    amount?: boolean
    cashSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cashSession?: boolean | CashSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cashMovement"]>

  export type CashMovementSelectScalar = {
    id?: boolean
    cloudId?: boolean
    type?: boolean
    description?: boolean
    amount?: boolean
    cashSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CashMovementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cashSession?: boolean | CashSessionDefaultArgs<ExtArgs>
  }
  export type CashMovementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cashSession?: boolean | CashSessionDefaultArgs<ExtArgs>
  }

  export type $CashMovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CashMovement"
    objects: {
      cashSession: Prisma.$CashSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      type: string
      description: string
      amount: number
      cashSessionId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cashMovement"]>
    composites: {}
  }

  type CashMovementGetPayload<S extends boolean | null | undefined | CashMovementDefaultArgs> = $Result.GetResult<Prisma.$CashMovementPayload, S>

  type CashMovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CashMovementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CashMovementCountAggregateInputType | true
    }

  export interface CashMovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CashMovement'], meta: { name: 'CashMovement' } }
    /**
     * Find zero or one CashMovement that matches the filter.
     * @param {CashMovementFindUniqueArgs} args - Arguments to find a CashMovement
     * @example
     * // Get one CashMovement
     * const cashMovement = await prisma.cashMovement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CashMovementFindUniqueArgs>(args: SelectSubset<T, CashMovementFindUniqueArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CashMovement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CashMovementFindUniqueOrThrowArgs} args - Arguments to find a CashMovement
     * @example
     * // Get one CashMovement
     * const cashMovement = await prisma.cashMovement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CashMovementFindUniqueOrThrowArgs>(args: SelectSubset<T, CashMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CashMovement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementFindFirstArgs} args - Arguments to find a CashMovement
     * @example
     * // Get one CashMovement
     * const cashMovement = await prisma.cashMovement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CashMovementFindFirstArgs>(args?: SelectSubset<T, CashMovementFindFirstArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CashMovement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementFindFirstOrThrowArgs} args - Arguments to find a CashMovement
     * @example
     * // Get one CashMovement
     * const cashMovement = await prisma.cashMovement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CashMovementFindFirstOrThrowArgs>(args?: SelectSubset<T, CashMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CashMovements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CashMovements
     * const cashMovements = await prisma.cashMovement.findMany()
     * 
     * // Get first 10 CashMovements
     * const cashMovements = await prisma.cashMovement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cashMovementWithIdOnly = await prisma.cashMovement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CashMovementFindManyArgs>(args?: SelectSubset<T, CashMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CashMovement.
     * @param {CashMovementCreateArgs} args - Arguments to create a CashMovement.
     * @example
     * // Create one CashMovement
     * const CashMovement = await prisma.cashMovement.create({
     *   data: {
     *     // ... data to create a CashMovement
     *   }
     * })
     * 
     */
    create<T extends CashMovementCreateArgs>(args: SelectSubset<T, CashMovementCreateArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CashMovements.
     * @param {CashMovementCreateManyArgs} args - Arguments to create many CashMovements.
     * @example
     * // Create many CashMovements
     * const cashMovement = await prisma.cashMovement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CashMovementCreateManyArgs>(args?: SelectSubset<T, CashMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CashMovements and returns the data saved in the database.
     * @param {CashMovementCreateManyAndReturnArgs} args - Arguments to create many CashMovements.
     * @example
     * // Create many CashMovements
     * const cashMovement = await prisma.cashMovement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CashMovements and only return the `id`
     * const cashMovementWithIdOnly = await prisma.cashMovement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CashMovementCreateManyAndReturnArgs>(args?: SelectSubset<T, CashMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CashMovement.
     * @param {CashMovementDeleteArgs} args - Arguments to delete one CashMovement.
     * @example
     * // Delete one CashMovement
     * const CashMovement = await prisma.cashMovement.delete({
     *   where: {
     *     // ... filter to delete one CashMovement
     *   }
     * })
     * 
     */
    delete<T extends CashMovementDeleteArgs>(args: SelectSubset<T, CashMovementDeleteArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CashMovement.
     * @param {CashMovementUpdateArgs} args - Arguments to update one CashMovement.
     * @example
     * // Update one CashMovement
     * const cashMovement = await prisma.cashMovement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CashMovementUpdateArgs>(args: SelectSubset<T, CashMovementUpdateArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CashMovements.
     * @param {CashMovementDeleteManyArgs} args - Arguments to filter CashMovements to delete.
     * @example
     * // Delete a few CashMovements
     * const { count } = await prisma.cashMovement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CashMovementDeleteManyArgs>(args?: SelectSubset<T, CashMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CashMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CashMovements
     * const cashMovement = await prisma.cashMovement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CashMovementUpdateManyArgs>(args: SelectSubset<T, CashMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CashMovement.
     * @param {CashMovementUpsertArgs} args - Arguments to update or create a CashMovement.
     * @example
     * // Update or create a CashMovement
     * const cashMovement = await prisma.cashMovement.upsert({
     *   create: {
     *     // ... data to create a CashMovement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CashMovement we want to update
     *   }
     * })
     */
    upsert<T extends CashMovementUpsertArgs>(args: SelectSubset<T, CashMovementUpsertArgs<ExtArgs>>): Prisma__CashMovementClient<$Result.GetResult<Prisma.$CashMovementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CashMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementCountArgs} args - Arguments to filter CashMovements to count.
     * @example
     * // Count the number of CashMovements
     * const count = await prisma.cashMovement.count({
     *   where: {
     *     // ... the filter for the CashMovements we want to count
     *   }
     * })
    **/
    count<T extends CashMovementCountArgs>(
      args?: Subset<T, CashMovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CashMovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CashMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CashMovementAggregateArgs>(args: Subset<T, CashMovementAggregateArgs>): Prisma.PrismaPromise<GetCashMovementAggregateType<T>>

    /**
     * Group by CashMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashMovementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CashMovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CashMovementGroupByArgs['orderBy'] }
        : { orderBy?: CashMovementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CashMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCashMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CashMovement model
   */
  readonly fields: CashMovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CashMovement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CashMovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cashSession<T extends CashSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CashSessionDefaultArgs<ExtArgs>>): Prisma__CashSessionClient<$Result.GetResult<Prisma.$CashSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CashMovement model
   */ 
  interface CashMovementFieldRefs {
    readonly id: FieldRef<"CashMovement", 'String'>
    readonly cloudId: FieldRef<"CashMovement", 'String'>
    readonly type: FieldRef<"CashMovement", 'String'>
    readonly description: FieldRef<"CashMovement", 'String'>
    readonly amount: FieldRef<"CashMovement", 'Float'>
    readonly cashSessionId: FieldRef<"CashMovement", 'String'>
    readonly createdAt: FieldRef<"CashMovement", 'DateTime'>
    readonly updatedAt: FieldRef<"CashMovement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CashMovement findUnique
   */
  export type CashMovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * Filter, which CashMovement to fetch.
     */
    where: CashMovementWhereUniqueInput
  }

  /**
   * CashMovement findUniqueOrThrow
   */
  export type CashMovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * Filter, which CashMovement to fetch.
     */
    where: CashMovementWhereUniqueInput
  }

  /**
   * CashMovement findFirst
   */
  export type CashMovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * Filter, which CashMovement to fetch.
     */
    where?: CashMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashMovements to fetch.
     */
    orderBy?: CashMovementOrderByWithRelationInput | CashMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CashMovements.
     */
    cursor?: CashMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CashMovements.
     */
    distinct?: CashMovementScalarFieldEnum | CashMovementScalarFieldEnum[]
  }

  /**
   * CashMovement findFirstOrThrow
   */
  export type CashMovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * Filter, which CashMovement to fetch.
     */
    where?: CashMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashMovements to fetch.
     */
    orderBy?: CashMovementOrderByWithRelationInput | CashMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CashMovements.
     */
    cursor?: CashMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CashMovements.
     */
    distinct?: CashMovementScalarFieldEnum | CashMovementScalarFieldEnum[]
  }

  /**
   * CashMovement findMany
   */
  export type CashMovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * Filter, which CashMovements to fetch.
     */
    where?: CashMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CashMovements to fetch.
     */
    orderBy?: CashMovementOrderByWithRelationInput | CashMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CashMovements.
     */
    cursor?: CashMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CashMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CashMovements.
     */
    skip?: number
    distinct?: CashMovementScalarFieldEnum | CashMovementScalarFieldEnum[]
  }

  /**
   * CashMovement create
   */
  export type CashMovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * The data needed to create a CashMovement.
     */
    data: XOR<CashMovementCreateInput, CashMovementUncheckedCreateInput>
  }

  /**
   * CashMovement createMany
   */
  export type CashMovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CashMovements.
     */
    data: CashMovementCreateManyInput | CashMovementCreateManyInput[]
  }

  /**
   * CashMovement createManyAndReturn
   */
  export type CashMovementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CashMovements.
     */
    data: CashMovementCreateManyInput | CashMovementCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CashMovement update
   */
  export type CashMovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * The data needed to update a CashMovement.
     */
    data: XOR<CashMovementUpdateInput, CashMovementUncheckedUpdateInput>
    /**
     * Choose, which CashMovement to update.
     */
    where: CashMovementWhereUniqueInput
  }

  /**
   * CashMovement updateMany
   */
  export type CashMovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CashMovements.
     */
    data: XOR<CashMovementUpdateManyMutationInput, CashMovementUncheckedUpdateManyInput>
    /**
     * Filter which CashMovements to update
     */
    where?: CashMovementWhereInput
  }

  /**
   * CashMovement upsert
   */
  export type CashMovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * The filter to search for the CashMovement to update in case it exists.
     */
    where: CashMovementWhereUniqueInput
    /**
     * In case the CashMovement found by the `where` argument doesn't exist, create a new CashMovement with this data.
     */
    create: XOR<CashMovementCreateInput, CashMovementUncheckedCreateInput>
    /**
     * In case the CashMovement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CashMovementUpdateInput, CashMovementUncheckedUpdateInput>
  }

  /**
   * CashMovement delete
   */
  export type CashMovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
    /**
     * Filter which CashMovement to delete.
     */
    where: CashMovementWhereUniqueInput
  }

  /**
   * CashMovement deleteMany
   */
  export type CashMovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CashMovements to delete
     */
    where?: CashMovementWhereInput
  }

  /**
   * CashMovement without action
   */
  export type CashMovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashMovement
     */
    select?: CashMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CashMovementInclude<ExtArgs> | null
  }


  /**
   * Model SyncOutbox
   */

  export type AggregateSyncOutbox = {
    _count: SyncOutboxCountAggregateOutputType | null
    _avg: SyncOutboxAvgAggregateOutputType | null
    _sum: SyncOutboxSumAggregateOutputType | null
    _min: SyncOutboxMinAggregateOutputType | null
    _max: SyncOutboxMaxAggregateOutputType | null
  }

  export type SyncOutboxAvgAggregateOutputType = {
    retryCount: number | null
  }

  export type SyncOutboxSumAggregateOutputType = {
    retryCount: number | null
  }

  export type SyncOutboxMinAggregateOutputType = {
    id: string | null
    entityType: string | null
    entityId: string | null
    action: string | null
    payload: string | null
    status: string | null
    errorMsg: string | null
    storeId: string | null
    dependsOnType: string | null
    dependsOnId: string | null
    retryCount: number | null
    lastErrorTime: Date | null
    syncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncOutboxMaxAggregateOutputType = {
    id: string | null
    entityType: string | null
    entityId: string | null
    action: string | null
    payload: string | null
    status: string | null
    errorMsg: string | null
    storeId: string | null
    dependsOnType: string | null
    dependsOnId: string | null
    retryCount: number | null
    lastErrorTime: Date | null
    syncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SyncOutboxCountAggregateOutputType = {
    id: number
    entityType: number
    entityId: number
    action: number
    payload: number
    status: number
    errorMsg: number
    storeId: number
    dependsOnType: number
    dependsOnId: number
    retryCount: number
    lastErrorTime: number
    syncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SyncOutboxAvgAggregateInputType = {
    retryCount?: true
  }

  export type SyncOutboxSumAggregateInputType = {
    retryCount?: true
  }

  export type SyncOutboxMinAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    action?: true
    payload?: true
    status?: true
    errorMsg?: true
    storeId?: true
    dependsOnType?: true
    dependsOnId?: true
    retryCount?: true
    lastErrorTime?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncOutboxMaxAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    action?: true
    payload?: true
    status?: true
    errorMsg?: true
    storeId?: true
    dependsOnType?: true
    dependsOnId?: true
    retryCount?: true
    lastErrorTime?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SyncOutboxCountAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    action?: true
    payload?: true
    status?: true
    errorMsg?: true
    storeId?: true
    dependsOnType?: true
    dependsOnId?: true
    retryCount?: true
    lastErrorTime?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncOutboxAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncOutbox to aggregate.
     */
    where?: SyncOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncOutboxes to fetch.
     */
    orderBy?: SyncOutboxOrderByWithRelationInput | SyncOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncOutboxes
    **/
    _count?: true | SyncOutboxCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncOutboxAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncOutboxSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncOutboxMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncOutboxMaxAggregateInputType
  }

  export type GetSyncOutboxAggregateType<T extends SyncOutboxAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncOutbox]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncOutbox[P]>
      : GetScalarType<T[P], AggregateSyncOutbox[P]>
  }




  export type SyncOutboxGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncOutboxWhereInput
    orderBy?: SyncOutboxOrderByWithAggregationInput | SyncOutboxOrderByWithAggregationInput[]
    by: SyncOutboxScalarFieldEnum[] | SyncOutboxScalarFieldEnum
    having?: SyncOutboxScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncOutboxCountAggregateInputType | true
    _avg?: SyncOutboxAvgAggregateInputType
    _sum?: SyncOutboxSumAggregateInputType
    _min?: SyncOutboxMinAggregateInputType
    _max?: SyncOutboxMaxAggregateInputType
  }

  export type SyncOutboxGroupByOutputType = {
    id: string
    entityType: string
    entityId: string
    action: string
    payload: string
    status: string
    errorMsg: string | null
    storeId: string
    dependsOnType: string | null
    dependsOnId: string | null
    retryCount: number
    lastErrorTime: Date | null
    syncedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SyncOutboxCountAggregateOutputType | null
    _avg: SyncOutboxAvgAggregateOutputType | null
    _sum: SyncOutboxSumAggregateOutputType | null
    _min: SyncOutboxMinAggregateOutputType | null
    _max: SyncOutboxMaxAggregateOutputType | null
  }

  type GetSyncOutboxGroupByPayload<T extends SyncOutboxGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncOutboxGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncOutboxGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncOutboxGroupByOutputType[P]>
            : GetScalarType<T[P], SyncOutboxGroupByOutputType[P]>
        }
      >
    >


  export type SyncOutboxSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    errorMsg?: boolean
    storeId?: boolean
    dependsOnType?: boolean
    dependsOnId?: boolean
    retryCount?: boolean
    lastErrorTime?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncOutbox"]>

  export type SyncOutboxSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    errorMsg?: boolean
    storeId?: boolean
    dependsOnType?: boolean
    dependsOnId?: boolean
    retryCount?: boolean
    lastErrorTime?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncOutbox"]>

  export type SyncOutboxSelectScalar = {
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    action?: boolean
    payload?: boolean
    status?: boolean
    errorMsg?: boolean
    storeId?: boolean
    dependsOnType?: boolean
    dependsOnId?: boolean
    retryCount?: boolean
    lastErrorTime?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SyncOutboxPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncOutbox"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entityType: string
      entityId: string
      action: string
      payload: string
      status: string
      errorMsg: string | null
      storeId: string
      dependsOnType: string | null
      dependsOnId: string | null
      retryCount: number
      lastErrorTime: Date | null
      syncedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["syncOutbox"]>
    composites: {}
  }

  type SyncOutboxGetPayload<S extends boolean | null | undefined | SyncOutboxDefaultArgs> = $Result.GetResult<Prisma.$SyncOutboxPayload, S>

  type SyncOutboxCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SyncOutboxFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SyncOutboxCountAggregateInputType | true
    }

  export interface SyncOutboxDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncOutbox'], meta: { name: 'SyncOutbox' } }
    /**
     * Find zero or one SyncOutbox that matches the filter.
     * @param {SyncOutboxFindUniqueArgs} args - Arguments to find a SyncOutbox
     * @example
     * // Get one SyncOutbox
     * const syncOutbox = await prisma.syncOutbox.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncOutboxFindUniqueArgs>(args: SelectSubset<T, SyncOutboxFindUniqueArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SyncOutbox that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SyncOutboxFindUniqueOrThrowArgs} args - Arguments to find a SyncOutbox
     * @example
     * // Get one SyncOutbox
     * const syncOutbox = await prisma.syncOutbox.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncOutboxFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncOutboxFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SyncOutbox that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxFindFirstArgs} args - Arguments to find a SyncOutbox
     * @example
     * // Get one SyncOutbox
     * const syncOutbox = await prisma.syncOutbox.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncOutboxFindFirstArgs>(args?: SelectSubset<T, SyncOutboxFindFirstArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SyncOutbox that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxFindFirstOrThrowArgs} args - Arguments to find a SyncOutbox
     * @example
     * // Get one SyncOutbox
     * const syncOutbox = await prisma.syncOutbox.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncOutboxFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncOutboxFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SyncOutboxes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncOutboxes
     * const syncOutboxes = await prisma.syncOutbox.findMany()
     * 
     * // Get first 10 SyncOutboxes
     * const syncOutboxes = await prisma.syncOutbox.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncOutboxWithIdOnly = await prisma.syncOutbox.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncOutboxFindManyArgs>(args?: SelectSubset<T, SyncOutboxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SyncOutbox.
     * @param {SyncOutboxCreateArgs} args - Arguments to create a SyncOutbox.
     * @example
     * // Create one SyncOutbox
     * const SyncOutbox = await prisma.syncOutbox.create({
     *   data: {
     *     // ... data to create a SyncOutbox
     *   }
     * })
     * 
     */
    create<T extends SyncOutboxCreateArgs>(args: SelectSubset<T, SyncOutboxCreateArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SyncOutboxes.
     * @param {SyncOutboxCreateManyArgs} args - Arguments to create many SyncOutboxes.
     * @example
     * // Create many SyncOutboxes
     * const syncOutbox = await prisma.syncOutbox.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncOutboxCreateManyArgs>(args?: SelectSubset<T, SyncOutboxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncOutboxes and returns the data saved in the database.
     * @param {SyncOutboxCreateManyAndReturnArgs} args - Arguments to create many SyncOutboxes.
     * @example
     * // Create many SyncOutboxes
     * const syncOutbox = await prisma.syncOutbox.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncOutboxes and only return the `id`
     * const syncOutboxWithIdOnly = await prisma.syncOutbox.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncOutboxCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncOutboxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SyncOutbox.
     * @param {SyncOutboxDeleteArgs} args - Arguments to delete one SyncOutbox.
     * @example
     * // Delete one SyncOutbox
     * const SyncOutbox = await prisma.syncOutbox.delete({
     *   where: {
     *     // ... filter to delete one SyncOutbox
     *   }
     * })
     * 
     */
    delete<T extends SyncOutboxDeleteArgs>(args: SelectSubset<T, SyncOutboxDeleteArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SyncOutbox.
     * @param {SyncOutboxUpdateArgs} args - Arguments to update one SyncOutbox.
     * @example
     * // Update one SyncOutbox
     * const syncOutbox = await prisma.syncOutbox.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncOutboxUpdateArgs>(args: SelectSubset<T, SyncOutboxUpdateArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SyncOutboxes.
     * @param {SyncOutboxDeleteManyArgs} args - Arguments to filter SyncOutboxes to delete.
     * @example
     * // Delete a few SyncOutboxes
     * const { count } = await prisma.syncOutbox.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncOutboxDeleteManyArgs>(args?: SelectSubset<T, SyncOutboxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncOutboxes
     * const syncOutbox = await prisma.syncOutbox.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncOutboxUpdateManyArgs>(args: SelectSubset<T, SyncOutboxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SyncOutbox.
     * @param {SyncOutboxUpsertArgs} args - Arguments to update or create a SyncOutbox.
     * @example
     * // Update or create a SyncOutbox
     * const syncOutbox = await prisma.syncOutbox.upsert({
     *   create: {
     *     // ... data to create a SyncOutbox
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncOutbox we want to update
     *   }
     * })
     */
    upsert<T extends SyncOutboxUpsertArgs>(args: SelectSubset<T, SyncOutboxUpsertArgs<ExtArgs>>): Prisma__SyncOutboxClient<$Result.GetResult<Prisma.$SyncOutboxPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SyncOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxCountArgs} args - Arguments to filter SyncOutboxes to count.
     * @example
     * // Count the number of SyncOutboxes
     * const count = await prisma.syncOutbox.count({
     *   where: {
     *     // ... the filter for the SyncOutboxes we want to count
     *   }
     * })
    **/
    count<T extends SyncOutboxCountArgs>(
      args?: Subset<T, SyncOutboxCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncOutboxCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncOutboxAggregateArgs>(args: Subset<T, SyncOutboxAggregateArgs>): Prisma.PrismaPromise<GetSyncOutboxAggregateType<T>>

    /**
     * Group by SyncOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncOutboxGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncOutboxGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncOutboxGroupByArgs['orderBy'] }
        : { orderBy?: SyncOutboxGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncOutboxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncOutboxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncOutbox model
   */
  readonly fields: SyncOutboxFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncOutbox.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncOutboxClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncOutbox model
   */ 
  interface SyncOutboxFieldRefs {
    readonly id: FieldRef<"SyncOutbox", 'String'>
    readonly entityType: FieldRef<"SyncOutbox", 'String'>
    readonly entityId: FieldRef<"SyncOutbox", 'String'>
    readonly action: FieldRef<"SyncOutbox", 'String'>
    readonly payload: FieldRef<"SyncOutbox", 'String'>
    readonly status: FieldRef<"SyncOutbox", 'String'>
    readonly errorMsg: FieldRef<"SyncOutbox", 'String'>
    readonly storeId: FieldRef<"SyncOutbox", 'String'>
    readonly dependsOnType: FieldRef<"SyncOutbox", 'String'>
    readonly dependsOnId: FieldRef<"SyncOutbox", 'String'>
    readonly retryCount: FieldRef<"SyncOutbox", 'Int'>
    readonly lastErrorTime: FieldRef<"SyncOutbox", 'DateTime'>
    readonly syncedAt: FieldRef<"SyncOutbox", 'DateTime'>
    readonly createdAt: FieldRef<"SyncOutbox", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncOutbox", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncOutbox findUnique
   */
  export type SyncOutboxFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * Filter, which SyncOutbox to fetch.
     */
    where: SyncOutboxWhereUniqueInput
  }

  /**
   * SyncOutbox findUniqueOrThrow
   */
  export type SyncOutboxFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * Filter, which SyncOutbox to fetch.
     */
    where: SyncOutboxWhereUniqueInput
  }

  /**
   * SyncOutbox findFirst
   */
  export type SyncOutboxFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * Filter, which SyncOutbox to fetch.
     */
    where?: SyncOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncOutboxes to fetch.
     */
    orderBy?: SyncOutboxOrderByWithRelationInput | SyncOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncOutboxes.
     */
    cursor?: SyncOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncOutboxes.
     */
    distinct?: SyncOutboxScalarFieldEnum | SyncOutboxScalarFieldEnum[]
  }

  /**
   * SyncOutbox findFirstOrThrow
   */
  export type SyncOutboxFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * Filter, which SyncOutbox to fetch.
     */
    where?: SyncOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncOutboxes to fetch.
     */
    orderBy?: SyncOutboxOrderByWithRelationInput | SyncOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncOutboxes.
     */
    cursor?: SyncOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncOutboxes.
     */
    distinct?: SyncOutboxScalarFieldEnum | SyncOutboxScalarFieldEnum[]
  }

  /**
   * SyncOutbox findMany
   */
  export type SyncOutboxFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * Filter, which SyncOutboxes to fetch.
     */
    where?: SyncOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncOutboxes to fetch.
     */
    orderBy?: SyncOutboxOrderByWithRelationInput | SyncOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncOutboxes.
     */
    cursor?: SyncOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncOutboxes.
     */
    skip?: number
    distinct?: SyncOutboxScalarFieldEnum | SyncOutboxScalarFieldEnum[]
  }

  /**
   * SyncOutbox create
   */
  export type SyncOutboxCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * The data needed to create a SyncOutbox.
     */
    data: XOR<SyncOutboxCreateInput, SyncOutboxUncheckedCreateInput>
  }

  /**
   * SyncOutbox createMany
   */
  export type SyncOutboxCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncOutboxes.
     */
    data: SyncOutboxCreateManyInput | SyncOutboxCreateManyInput[]
  }

  /**
   * SyncOutbox createManyAndReturn
   */
  export type SyncOutboxCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SyncOutboxes.
     */
    data: SyncOutboxCreateManyInput | SyncOutboxCreateManyInput[]
  }

  /**
   * SyncOutbox update
   */
  export type SyncOutboxUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * The data needed to update a SyncOutbox.
     */
    data: XOR<SyncOutboxUpdateInput, SyncOutboxUncheckedUpdateInput>
    /**
     * Choose, which SyncOutbox to update.
     */
    where: SyncOutboxWhereUniqueInput
  }

  /**
   * SyncOutbox updateMany
   */
  export type SyncOutboxUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncOutboxes.
     */
    data: XOR<SyncOutboxUpdateManyMutationInput, SyncOutboxUncheckedUpdateManyInput>
    /**
     * Filter which SyncOutboxes to update
     */
    where?: SyncOutboxWhereInput
  }

  /**
   * SyncOutbox upsert
   */
  export type SyncOutboxUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * The filter to search for the SyncOutbox to update in case it exists.
     */
    where: SyncOutboxWhereUniqueInput
    /**
     * In case the SyncOutbox found by the `where` argument doesn't exist, create a new SyncOutbox with this data.
     */
    create: XOR<SyncOutboxCreateInput, SyncOutboxUncheckedCreateInput>
    /**
     * In case the SyncOutbox was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncOutboxUpdateInput, SyncOutboxUncheckedUpdateInput>
  }

  /**
   * SyncOutbox delete
   */
  export type SyncOutboxDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
    /**
     * Filter which SyncOutbox to delete.
     */
    where: SyncOutboxWhereUniqueInput
  }

  /**
   * SyncOutbox deleteMany
   */
  export type SyncOutboxDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncOutboxes to delete
     */
    where?: SyncOutboxWhereInput
  }

  /**
   * SyncOutbox without action
   */
  export type SyncOutboxDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncOutbox
     */
    select?: SyncOutboxSelect<ExtArgs> | null
  }


  /**
   * Model DocumentSequence
   */

  export type AggregateDocumentSequence = {
    _count: DocumentSequenceCountAggregateOutputType | null
    _avg: DocumentSequenceAvgAggregateOutputType | null
    _sum: DocumentSequenceSumAggregateOutputType | null
    _min: DocumentSequenceMinAggregateOutputType | null
    _max: DocumentSequenceMaxAggregateOutputType | null
  }

  export type DocumentSequenceAvgAggregateOutputType = {
    currentSequence: number | null
    lastDocumentNo: number | null
  }

  export type DocumentSequenceSumAggregateOutputType = {
    currentSequence: number | null
    lastDocumentNo: number | null
  }

  export type DocumentSequenceMinAggregateOutputType = {
    id: string | null
    cloudId: string | null
    companyCode: string | null
    storeCode: string | null
    documentType: string | null
    seriesYear: string | null
    versionCode: string | null
    seriesCode: string | null
    currentSequence: number | null
    lastDocumentNo: number | null
    isClosed: boolean | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentSequenceMaxAggregateOutputType = {
    id: string | null
    cloudId: string | null
    companyCode: string | null
    storeCode: string | null
    documentType: string | null
    seriesYear: string | null
    versionCode: string | null
    seriesCode: string | null
    currentSequence: number | null
    lastDocumentNo: number | null
    isClosed: boolean | null
    storeId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentSequenceCountAggregateOutputType = {
    id: number
    cloudId: number
    companyCode: number
    storeCode: number
    documentType: number
    seriesYear: number
    versionCode: number
    seriesCode: number
    currentSequence: number
    lastDocumentNo: number
    isClosed: number
    storeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentSequenceAvgAggregateInputType = {
    currentSequence?: true
    lastDocumentNo?: true
  }

  export type DocumentSequenceSumAggregateInputType = {
    currentSequence?: true
    lastDocumentNo?: true
  }

  export type DocumentSequenceMinAggregateInputType = {
    id?: true
    cloudId?: true
    companyCode?: true
    storeCode?: true
    documentType?: true
    seriesYear?: true
    versionCode?: true
    seriesCode?: true
    currentSequence?: true
    lastDocumentNo?: true
    isClosed?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentSequenceMaxAggregateInputType = {
    id?: true
    cloudId?: true
    companyCode?: true
    storeCode?: true
    documentType?: true
    seriesYear?: true
    versionCode?: true
    seriesCode?: true
    currentSequence?: true
    lastDocumentNo?: true
    isClosed?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentSequenceCountAggregateInputType = {
    id?: true
    cloudId?: true
    companyCode?: true
    storeCode?: true
    documentType?: true
    seriesYear?: true
    versionCode?: true
    seriesCode?: true
    currentSequence?: true
    lastDocumentNo?: true
    isClosed?: true
    storeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentSequenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentSequence to aggregate.
     */
    where?: DocumentSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentSequences to fetch.
     */
    orderBy?: DocumentSequenceOrderByWithRelationInput | DocumentSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DocumentSequences
    **/
    _count?: true | DocumentSequenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentSequenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSequenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentSequenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentSequenceMaxAggregateInputType
  }

  export type GetDocumentSequenceAggregateType<T extends DocumentSequenceAggregateArgs> = {
        [P in keyof T & keyof AggregateDocumentSequence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocumentSequence[P]>
      : GetScalarType<T[P], AggregateDocumentSequence[P]>
  }




  export type DocumentSequenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentSequenceWhereInput
    orderBy?: DocumentSequenceOrderByWithAggregationInput | DocumentSequenceOrderByWithAggregationInput[]
    by: DocumentSequenceScalarFieldEnum[] | DocumentSequenceScalarFieldEnum
    having?: DocumentSequenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentSequenceCountAggregateInputType | true
    _avg?: DocumentSequenceAvgAggregateInputType
    _sum?: DocumentSequenceSumAggregateInputType
    _min?: DocumentSequenceMinAggregateInputType
    _max?: DocumentSequenceMaxAggregateInputType
  }

  export type DocumentSequenceGroupByOutputType = {
    id: string
    cloudId: string | null
    companyCode: string
    storeCode: string
    documentType: string
    seriesYear: string
    versionCode: string
    seriesCode: string
    currentSequence: number
    lastDocumentNo: number
    isClosed: boolean
    storeId: string
    createdAt: Date
    updatedAt: Date
    _count: DocumentSequenceCountAggregateOutputType | null
    _avg: DocumentSequenceAvgAggregateOutputType | null
    _sum: DocumentSequenceSumAggregateOutputType | null
    _min: DocumentSequenceMinAggregateOutputType | null
    _max: DocumentSequenceMaxAggregateOutputType | null
  }

  type GetDocumentSequenceGroupByPayload<T extends DocumentSequenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentSequenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentSequenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentSequenceGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentSequenceGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSequenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    companyCode?: boolean
    storeCode?: boolean
    documentType?: boolean
    seriesYear?: boolean
    versionCode?: boolean
    seriesCode?: boolean
    currentSequence?: boolean
    lastDocumentNo?: boolean
    isClosed?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["documentSequence"]>

  export type DocumentSequenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cloudId?: boolean
    companyCode?: boolean
    storeCode?: boolean
    documentType?: boolean
    seriesYear?: boolean
    versionCode?: boolean
    seriesCode?: boolean
    currentSequence?: boolean
    lastDocumentNo?: boolean
    isClosed?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["documentSequence"]>

  export type DocumentSequenceSelectScalar = {
    id?: boolean
    cloudId?: boolean
    companyCode?: boolean
    storeCode?: boolean
    documentType?: boolean
    seriesYear?: boolean
    versionCode?: boolean
    seriesCode?: boolean
    currentSequence?: boolean
    lastDocumentNo?: boolean
    isClosed?: boolean
    storeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DocumentSequencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DocumentSequence"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cloudId: string | null
      companyCode: string
      storeCode: string
      documentType: string
      seriesYear: string
      versionCode: string
      seriesCode: string
      currentSequence: number
      lastDocumentNo: number
      isClosed: boolean
      storeId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["documentSequence"]>
    composites: {}
  }

  type DocumentSequenceGetPayload<S extends boolean | null | undefined | DocumentSequenceDefaultArgs> = $Result.GetResult<Prisma.$DocumentSequencePayload, S>

  type DocumentSequenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DocumentSequenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DocumentSequenceCountAggregateInputType | true
    }

  export interface DocumentSequenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DocumentSequence'], meta: { name: 'DocumentSequence' } }
    /**
     * Find zero or one DocumentSequence that matches the filter.
     * @param {DocumentSequenceFindUniqueArgs} args - Arguments to find a DocumentSequence
     * @example
     * // Get one DocumentSequence
     * const documentSequence = await prisma.documentSequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentSequenceFindUniqueArgs>(args: SelectSubset<T, DocumentSequenceFindUniqueArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DocumentSequence that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DocumentSequenceFindUniqueOrThrowArgs} args - Arguments to find a DocumentSequence
     * @example
     * // Get one DocumentSequence
     * const documentSequence = await prisma.documentSequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentSequenceFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentSequenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DocumentSequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceFindFirstArgs} args - Arguments to find a DocumentSequence
     * @example
     * // Get one DocumentSequence
     * const documentSequence = await prisma.documentSequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentSequenceFindFirstArgs>(args?: SelectSubset<T, DocumentSequenceFindFirstArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DocumentSequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceFindFirstOrThrowArgs} args - Arguments to find a DocumentSequence
     * @example
     * // Get one DocumentSequence
     * const documentSequence = await prisma.documentSequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentSequenceFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentSequenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DocumentSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DocumentSequences
     * const documentSequences = await prisma.documentSequence.findMany()
     * 
     * // Get first 10 DocumentSequences
     * const documentSequences = await prisma.documentSequence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentSequenceWithIdOnly = await prisma.documentSequence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentSequenceFindManyArgs>(args?: SelectSubset<T, DocumentSequenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DocumentSequence.
     * @param {DocumentSequenceCreateArgs} args - Arguments to create a DocumentSequence.
     * @example
     * // Create one DocumentSequence
     * const DocumentSequence = await prisma.documentSequence.create({
     *   data: {
     *     // ... data to create a DocumentSequence
     *   }
     * })
     * 
     */
    create<T extends DocumentSequenceCreateArgs>(args: SelectSubset<T, DocumentSequenceCreateArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DocumentSequences.
     * @param {DocumentSequenceCreateManyArgs} args - Arguments to create many DocumentSequences.
     * @example
     * // Create many DocumentSequences
     * const documentSequence = await prisma.documentSequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentSequenceCreateManyArgs>(args?: SelectSubset<T, DocumentSequenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DocumentSequences and returns the data saved in the database.
     * @param {DocumentSequenceCreateManyAndReturnArgs} args - Arguments to create many DocumentSequences.
     * @example
     * // Create many DocumentSequences
     * const documentSequence = await prisma.documentSequence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DocumentSequences and only return the `id`
     * const documentSequenceWithIdOnly = await prisma.documentSequence.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentSequenceCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentSequenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DocumentSequence.
     * @param {DocumentSequenceDeleteArgs} args - Arguments to delete one DocumentSequence.
     * @example
     * // Delete one DocumentSequence
     * const DocumentSequence = await prisma.documentSequence.delete({
     *   where: {
     *     // ... filter to delete one DocumentSequence
     *   }
     * })
     * 
     */
    delete<T extends DocumentSequenceDeleteArgs>(args: SelectSubset<T, DocumentSequenceDeleteArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DocumentSequence.
     * @param {DocumentSequenceUpdateArgs} args - Arguments to update one DocumentSequence.
     * @example
     * // Update one DocumentSequence
     * const documentSequence = await prisma.documentSequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentSequenceUpdateArgs>(args: SelectSubset<T, DocumentSequenceUpdateArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DocumentSequences.
     * @param {DocumentSequenceDeleteManyArgs} args - Arguments to filter DocumentSequences to delete.
     * @example
     * // Delete a few DocumentSequences
     * const { count } = await prisma.documentSequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentSequenceDeleteManyArgs>(args?: SelectSubset<T, DocumentSequenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DocumentSequences
     * const documentSequence = await prisma.documentSequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentSequenceUpdateManyArgs>(args: SelectSubset<T, DocumentSequenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DocumentSequence.
     * @param {DocumentSequenceUpsertArgs} args - Arguments to update or create a DocumentSequence.
     * @example
     * // Update or create a DocumentSequence
     * const documentSequence = await prisma.documentSequence.upsert({
     *   create: {
     *     // ... data to create a DocumentSequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DocumentSequence we want to update
     *   }
     * })
     */
    upsert<T extends DocumentSequenceUpsertArgs>(args: SelectSubset<T, DocumentSequenceUpsertArgs<ExtArgs>>): Prisma__DocumentSequenceClient<$Result.GetResult<Prisma.$DocumentSequencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DocumentSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceCountArgs} args - Arguments to filter DocumentSequences to count.
     * @example
     * // Count the number of DocumentSequences
     * const count = await prisma.documentSequence.count({
     *   where: {
     *     // ... the filter for the DocumentSequences we want to count
     *   }
     * })
    **/
    count<T extends DocumentSequenceCountArgs>(
      args?: Subset<T, DocumentSequenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentSequenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DocumentSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentSequenceAggregateArgs>(args: Subset<T, DocumentSequenceAggregateArgs>): Prisma.PrismaPromise<GetDocumentSequenceAggregateType<T>>

    /**
     * Group by DocumentSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentSequenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentSequenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentSequenceGroupByArgs['orderBy'] }
        : { orderBy?: DocumentSequenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentSequenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentSequenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DocumentSequence model
   */
  readonly fields: DocumentSequenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DocumentSequence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentSequenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DocumentSequence model
   */ 
  interface DocumentSequenceFieldRefs {
    readonly id: FieldRef<"DocumentSequence", 'String'>
    readonly cloudId: FieldRef<"DocumentSequence", 'String'>
    readonly companyCode: FieldRef<"DocumentSequence", 'String'>
    readonly storeCode: FieldRef<"DocumentSequence", 'String'>
    readonly documentType: FieldRef<"DocumentSequence", 'String'>
    readonly seriesYear: FieldRef<"DocumentSequence", 'String'>
    readonly versionCode: FieldRef<"DocumentSequence", 'String'>
    readonly seriesCode: FieldRef<"DocumentSequence", 'String'>
    readonly currentSequence: FieldRef<"DocumentSequence", 'Int'>
    readonly lastDocumentNo: FieldRef<"DocumentSequence", 'Int'>
    readonly isClosed: FieldRef<"DocumentSequence", 'Boolean'>
    readonly storeId: FieldRef<"DocumentSequence", 'String'>
    readonly createdAt: FieldRef<"DocumentSequence", 'DateTime'>
    readonly updatedAt: FieldRef<"DocumentSequence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DocumentSequence findUnique
   */
  export type DocumentSequenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * Filter, which DocumentSequence to fetch.
     */
    where: DocumentSequenceWhereUniqueInput
  }

  /**
   * DocumentSequence findUniqueOrThrow
   */
  export type DocumentSequenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * Filter, which DocumentSequence to fetch.
     */
    where: DocumentSequenceWhereUniqueInput
  }

  /**
   * DocumentSequence findFirst
   */
  export type DocumentSequenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * Filter, which DocumentSequence to fetch.
     */
    where?: DocumentSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentSequences to fetch.
     */
    orderBy?: DocumentSequenceOrderByWithRelationInput | DocumentSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentSequences.
     */
    cursor?: DocumentSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentSequences.
     */
    distinct?: DocumentSequenceScalarFieldEnum | DocumentSequenceScalarFieldEnum[]
  }

  /**
   * DocumentSequence findFirstOrThrow
   */
  export type DocumentSequenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * Filter, which DocumentSequence to fetch.
     */
    where?: DocumentSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentSequences to fetch.
     */
    orderBy?: DocumentSequenceOrderByWithRelationInput | DocumentSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentSequences.
     */
    cursor?: DocumentSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentSequences.
     */
    distinct?: DocumentSequenceScalarFieldEnum | DocumentSequenceScalarFieldEnum[]
  }

  /**
   * DocumentSequence findMany
   */
  export type DocumentSequenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * Filter, which DocumentSequences to fetch.
     */
    where?: DocumentSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentSequences to fetch.
     */
    orderBy?: DocumentSequenceOrderByWithRelationInput | DocumentSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DocumentSequences.
     */
    cursor?: DocumentSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentSequences.
     */
    skip?: number
    distinct?: DocumentSequenceScalarFieldEnum | DocumentSequenceScalarFieldEnum[]
  }

  /**
   * DocumentSequence create
   */
  export type DocumentSequenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * The data needed to create a DocumentSequence.
     */
    data: XOR<DocumentSequenceCreateInput, DocumentSequenceUncheckedCreateInput>
  }

  /**
   * DocumentSequence createMany
   */
  export type DocumentSequenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DocumentSequences.
     */
    data: DocumentSequenceCreateManyInput | DocumentSequenceCreateManyInput[]
  }

  /**
   * DocumentSequence createManyAndReturn
   */
  export type DocumentSequenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DocumentSequences.
     */
    data: DocumentSequenceCreateManyInput | DocumentSequenceCreateManyInput[]
  }

  /**
   * DocumentSequence update
   */
  export type DocumentSequenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * The data needed to update a DocumentSequence.
     */
    data: XOR<DocumentSequenceUpdateInput, DocumentSequenceUncheckedUpdateInput>
    /**
     * Choose, which DocumentSequence to update.
     */
    where: DocumentSequenceWhereUniqueInput
  }

  /**
   * DocumentSequence updateMany
   */
  export type DocumentSequenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DocumentSequences.
     */
    data: XOR<DocumentSequenceUpdateManyMutationInput, DocumentSequenceUncheckedUpdateManyInput>
    /**
     * Filter which DocumentSequences to update
     */
    where?: DocumentSequenceWhereInput
  }

  /**
   * DocumentSequence upsert
   */
  export type DocumentSequenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * The filter to search for the DocumentSequence to update in case it exists.
     */
    where: DocumentSequenceWhereUniqueInput
    /**
     * In case the DocumentSequence found by the `where` argument doesn't exist, create a new DocumentSequence with this data.
     */
    create: XOR<DocumentSequenceCreateInput, DocumentSequenceUncheckedCreateInput>
    /**
     * In case the DocumentSequence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentSequenceUpdateInput, DocumentSequenceUncheckedUpdateInput>
  }

  /**
   * DocumentSequence delete
   */
  export type DocumentSequenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
    /**
     * Filter which DocumentSequence to delete.
     */
    where: DocumentSequenceWhereUniqueInput
  }

  /**
   * DocumentSequence deleteMany
   */
  export type DocumentSequenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentSequences to delete
     */
    where?: DocumentSequenceWhereInput
  }

  /**
   * DocumentSequence without action
   */
  export type DocumentSequenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentSequence
     */
    select?: DocumentSequenceSelect<ExtArgs> | null
  }


  /**
   * Model AgtSeries
   */

  export type AggregateAgtSeries = {
    _count: AgtSeriesCountAggregateOutputType | null
    _avg: AgtSeriesAvgAggregateOutputType | null
    _sum: AgtSeriesSumAggregateOutputType | null
    _min: AgtSeriesMinAggregateOutputType | null
    _max: AgtSeriesMaxAggregateOutputType | null
  }

  export type AgtSeriesAvgAggregateOutputType = {
    currentSequence: number | null
  }

  export type AgtSeriesSumAggregateOutputType = {
    currentSequence: number | null
  }

  export type AgtSeriesMinAggregateOutputType = {
    id: string | null
    seriesCode: string | null
    documentType: string | null
    seriesYear: string | null
    companyId: string | null
    establishmentNumber: string | null
    storeId: string | null
    currentSequence: number | null
    lastDocumentNo: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgtSeriesMaxAggregateOutputType = {
    id: string | null
    seriesCode: string | null
    documentType: string | null
    seriesYear: string | null
    companyId: string | null
    establishmentNumber: string | null
    storeId: string | null
    currentSequence: number | null
    lastDocumentNo: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgtSeriesCountAggregateOutputType = {
    id: number
    seriesCode: number
    documentType: number
    seriesYear: number
    companyId: number
    establishmentNumber: number
    storeId: number
    currentSequence: number
    lastDocumentNo: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgtSeriesAvgAggregateInputType = {
    currentSequence?: true
  }

  export type AgtSeriesSumAggregateInputType = {
    currentSequence?: true
  }

  export type AgtSeriesMinAggregateInputType = {
    id?: true
    seriesCode?: true
    documentType?: true
    seriesYear?: true
    companyId?: true
    establishmentNumber?: true
    storeId?: true
    currentSequence?: true
    lastDocumentNo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgtSeriesMaxAggregateInputType = {
    id?: true
    seriesCode?: true
    documentType?: true
    seriesYear?: true
    companyId?: true
    establishmentNumber?: true
    storeId?: true
    currentSequence?: true
    lastDocumentNo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgtSeriesCountAggregateInputType = {
    id?: true
    seriesCode?: true
    documentType?: true
    seriesYear?: true
    companyId?: true
    establishmentNumber?: true
    storeId?: true
    currentSequence?: true
    lastDocumentNo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgtSeriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgtSeries to aggregate.
     */
    where?: AgtSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgtSeries to fetch.
     */
    orderBy?: AgtSeriesOrderByWithRelationInput | AgtSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgtSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgtSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgtSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgtSeries
    **/
    _count?: true | AgtSeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgtSeriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgtSeriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgtSeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgtSeriesMaxAggregateInputType
  }

  export type GetAgtSeriesAggregateType<T extends AgtSeriesAggregateArgs> = {
        [P in keyof T & keyof AggregateAgtSeries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgtSeries[P]>
      : GetScalarType<T[P], AggregateAgtSeries[P]>
  }




  export type AgtSeriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgtSeriesWhereInput
    orderBy?: AgtSeriesOrderByWithAggregationInput | AgtSeriesOrderByWithAggregationInput[]
    by: AgtSeriesScalarFieldEnum[] | AgtSeriesScalarFieldEnum
    having?: AgtSeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgtSeriesCountAggregateInputType | true
    _avg?: AgtSeriesAvgAggregateInputType
    _sum?: AgtSeriesSumAggregateInputType
    _min?: AgtSeriesMinAggregateInputType
    _max?: AgtSeriesMaxAggregateInputType
  }

  export type AgtSeriesGroupByOutputType = {
    id: string
    seriesCode: string | null
    documentType: string
    seriesYear: string
    companyId: string
    establishmentNumber: string
    storeId: string | null
    currentSequence: number
    lastDocumentNo: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: AgtSeriesCountAggregateOutputType | null
    _avg: AgtSeriesAvgAggregateOutputType | null
    _sum: AgtSeriesSumAggregateOutputType | null
    _min: AgtSeriesMinAggregateOutputType | null
    _max: AgtSeriesMaxAggregateOutputType | null
  }

  type GetAgtSeriesGroupByPayload<T extends AgtSeriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgtSeriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgtSeriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgtSeriesGroupByOutputType[P]>
            : GetScalarType<T[P], AgtSeriesGroupByOutputType[P]>
        }
      >
    >


  export type AgtSeriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seriesCode?: boolean
    documentType?: boolean
    seriesYear?: boolean
    companyId?: boolean
    establishmentNumber?: boolean
    storeId?: boolean
    currentSequence?: boolean
    lastDocumentNo?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agtSeries"]>

  export type AgtSeriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seriesCode?: boolean
    documentType?: boolean
    seriesYear?: boolean
    companyId?: boolean
    establishmentNumber?: boolean
    storeId?: boolean
    currentSequence?: boolean
    lastDocumentNo?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agtSeries"]>

  export type AgtSeriesSelectScalar = {
    id?: boolean
    seriesCode?: boolean
    documentType?: boolean
    seriesYear?: boolean
    companyId?: boolean
    establishmentNumber?: boolean
    storeId?: boolean
    currentSequence?: boolean
    lastDocumentNo?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AgtSeriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgtSeries"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seriesCode: string | null
      documentType: string
      seriesYear: string
      companyId: string
      establishmentNumber: string
      storeId: string | null
      currentSequence: number
      lastDocumentNo: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agtSeries"]>
    composites: {}
  }

  type AgtSeriesGetPayload<S extends boolean | null | undefined | AgtSeriesDefaultArgs> = $Result.GetResult<Prisma.$AgtSeriesPayload, S>

  type AgtSeriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AgtSeriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgtSeriesCountAggregateInputType | true
    }

  export interface AgtSeriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgtSeries'], meta: { name: 'AgtSeries' } }
    /**
     * Find zero or one AgtSeries that matches the filter.
     * @param {AgtSeriesFindUniqueArgs} args - Arguments to find a AgtSeries
     * @example
     * // Get one AgtSeries
     * const agtSeries = await prisma.agtSeries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgtSeriesFindUniqueArgs>(args: SelectSubset<T, AgtSeriesFindUniqueArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AgtSeries that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AgtSeriesFindUniqueOrThrowArgs} args - Arguments to find a AgtSeries
     * @example
     * // Get one AgtSeries
     * const agtSeries = await prisma.agtSeries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgtSeriesFindUniqueOrThrowArgs>(args: SelectSubset<T, AgtSeriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AgtSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesFindFirstArgs} args - Arguments to find a AgtSeries
     * @example
     * // Get one AgtSeries
     * const agtSeries = await prisma.agtSeries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgtSeriesFindFirstArgs>(args?: SelectSubset<T, AgtSeriesFindFirstArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AgtSeries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesFindFirstOrThrowArgs} args - Arguments to find a AgtSeries
     * @example
     * // Get one AgtSeries
     * const agtSeries = await prisma.agtSeries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgtSeriesFindFirstOrThrowArgs>(args?: SelectSubset<T, AgtSeriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AgtSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgtSeries
     * const agtSeries = await prisma.agtSeries.findMany()
     * 
     * // Get first 10 AgtSeries
     * const agtSeries = await prisma.agtSeries.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agtSeriesWithIdOnly = await prisma.agtSeries.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgtSeriesFindManyArgs>(args?: SelectSubset<T, AgtSeriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AgtSeries.
     * @param {AgtSeriesCreateArgs} args - Arguments to create a AgtSeries.
     * @example
     * // Create one AgtSeries
     * const AgtSeries = await prisma.agtSeries.create({
     *   data: {
     *     // ... data to create a AgtSeries
     *   }
     * })
     * 
     */
    create<T extends AgtSeriesCreateArgs>(args: SelectSubset<T, AgtSeriesCreateArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AgtSeries.
     * @param {AgtSeriesCreateManyArgs} args - Arguments to create many AgtSeries.
     * @example
     * // Create many AgtSeries
     * const agtSeries = await prisma.agtSeries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgtSeriesCreateManyArgs>(args?: SelectSubset<T, AgtSeriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgtSeries and returns the data saved in the database.
     * @param {AgtSeriesCreateManyAndReturnArgs} args - Arguments to create many AgtSeries.
     * @example
     * // Create many AgtSeries
     * const agtSeries = await prisma.agtSeries.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgtSeries and only return the `id`
     * const agtSeriesWithIdOnly = await prisma.agtSeries.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgtSeriesCreateManyAndReturnArgs>(args?: SelectSubset<T, AgtSeriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AgtSeries.
     * @param {AgtSeriesDeleteArgs} args - Arguments to delete one AgtSeries.
     * @example
     * // Delete one AgtSeries
     * const AgtSeries = await prisma.agtSeries.delete({
     *   where: {
     *     // ... filter to delete one AgtSeries
     *   }
     * })
     * 
     */
    delete<T extends AgtSeriesDeleteArgs>(args: SelectSubset<T, AgtSeriesDeleteArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AgtSeries.
     * @param {AgtSeriesUpdateArgs} args - Arguments to update one AgtSeries.
     * @example
     * // Update one AgtSeries
     * const agtSeries = await prisma.agtSeries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgtSeriesUpdateArgs>(args: SelectSubset<T, AgtSeriesUpdateArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AgtSeries.
     * @param {AgtSeriesDeleteManyArgs} args - Arguments to filter AgtSeries to delete.
     * @example
     * // Delete a few AgtSeries
     * const { count } = await prisma.agtSeries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgtSeriesDeleteManyArgs>(args?: SelectSubset<T, AgtSeriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgtSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgtSeries
     * const agtSeries = await prisma.agtSeries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgtSeriesUpdateManyArgs>(args: SelectSubset<T, AgtSeriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AgtSeries.
     * @param {AgtSeriesUpsertArgs} args - Arguments to update or create a AgtSeries.
     * @example
     * // Update or create a AgtSeries
     * const agtSeries = await prisma.agtSeries.upsert({
     *   create: {
     *     // ... data to create a AgtSeries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgtSeries we want to update
     *   }
     * })
     */
    upsert<T extends AgtSeriesUpsertArgs>(args: SelectSubset<T, AgtSeriesUpsertArgs<ExtArgs>>): Prisma__AgtSeriesClient<$Result.GetResult<Prisma.$AgtSeriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AgtSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesCountArgs} args - Arguments to filter AgtSeries to count.
     * @example
     * // Count the number of AgtSeries
     * const count = await prisma.agtSeries.count({
     *   where: {
     *     // ... the filter for the AgtSeries we want to count
     *   }
     * })
    **/
    count<T extends AgtSeriesCountArgs>(
      args?: Subset<T, AgtSeriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgtSeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgtSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgtSeriesAggregateArgs>(args: Subset<T, AgtSeriesAggregateArgs>): Prisma.PrismaPromise<GetAgtSeriesAggregateType<T>>

    /**
     * Group by AgtSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgtSeriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgtSeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgtSeriesGroupByArgs['orderBy'] }
        : { orderBy?: AgtSeriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgtSeriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgtSeriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgtSeries model
   */
  readonly fields: AgtSeriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgtSeries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgtSeriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgtSeries model
   */ 
  interface AgtSeriesFieldRefs {
    readonly id: FieldRef<"AgtSeries", 'String'>
    readonly seriesCode: FieldRef<"AgtSeries", 'String'>
    readonly documentType: FieldRef<"AgtSeries", 'String'>
    readonly seriesYear: FieldRef<"AgtSeries", 'String'>
    readonly companyId: FieldRef<"AgtSeries", 'String'>
    readonly establishmentNumber: FieldRef<"AgtSeries", 'String'>
    readonly storeId: FieldRef<"AgtSeries", 'String'>
    readonly currentSequence: FieldRef<"AgtSeries", 'Int'>
    readonly lastDocumentNo: FieldRef<"AgtSeries", 'String'>
    readonly isActive: FieldRef<"AgtSeries", 'Boolean'>
    readonly createdAt: FieldRef<"AgtSeries", 'DateTime'>
    readonly updatedAt: FieldRef<"AgtSeries", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgtSeries findUnique
   */
  export type AgtSeriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AgtSeries to fetch.
     */
    where: AgtSeriesWhereUniqueInput
  }

  /**
   * AgtSeries findUniqueOrThrow
   */
  export type AgtSeriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AgtSeries to fetch.
     */
    where: AgtSeriesWhereUniqueInput
  }

  /**
   * AgtSeries findFirst
   */
  export type AgtSeriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AgtSeries to fetch.
     */
    where?: AgtSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgtSeries to fetch.
     */
    orderBy?: AgtSeriesOrderByWithRelationInput | AgtSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgtSeries.
     */
    cursor?: AgtSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgtSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgtSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgtSeries.
     */
    distinct?: AgtSeriesScalarFieldEnum | AgtSeriesScalarFieldEnum[]
  }

  /**
   * AgtSeries findFirstOrThrow
   */
  export type AgtSeriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AgtSeries to fetch.
     */
    where?: AgtSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgtSeries to fetch.
     */
    orderBy?: AgtSeriesOrderByWithRelationInput | AgtSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgtSeries.
     */
    cursor?: AgtSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgtSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgtSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgtSeries.
     */
    distinct?: AgtSeriesScalarFieldEnum | AgtSeriesScalarFieldEnum[]
  }

  /**
   * AgtSeries findMany
   */
  export type AgtSeriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AgtSeries to fetch.
     */
    where?: AgtSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgtSeries to fetch.
     */
    orderBy?: AgtSeriesOrderByWithRelationInput | AgtSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgtSeries.
     */
    cursor?: AgtSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgtSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgtSeries.
     */
    skip?: number
    distinct?: AgtSeriesScalarFieldEnum | AgtSeriesScalarFieldEnum[]
  }

  /**
   * AgtSeries create
   */
  export type AgtSeriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * The data needed to create a AgtSeries.
     */
    data: XOR<AgtSeriesCreateInput, AgtSeriesUncheckedCreateInput>
  }

  /**
   * AgtSeries createMany
   */
  export type AgtSeriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgtSeries.
     */
    data: AgtSeriesCreateManyInput | AgtSeriesCreateManyInput[]
  }

  /**
   * AgtSeries createManyAndReturn
   */
  export type AgtSeriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AgtSeries.
     */
    data: AgtSeriesCreateManyInput | AgtSeriesCreateManyInput[]
  }

  /**
   * AgtSeries update
   */
  export type AgtSeriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * The data needed to update a AgtSeries.
     */
    data: XOR<AgtSeriesUpdateInput, AgtSeriesUncheckedUpdateInput>
    /**
     * Choose, which AgtSeries to update.
     */
    where: AgtSeriesWhereUniqueInput
  }

  /**
   * AgtSeries updateMany
   */
  export type AgtSeriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgtSeries.
     */
    data: XOR<AgtSeriesUpdateManyMutationInput, AgtSeriesUncheckedUpdateManyInput>
    /**
     * Filter which AgtSeries to update
     */
    where?: AgtSeriesWhereInput
  }

  /**
   * AgtSeries upsert
   */
  export type AgtSeriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * The filter to search for the AgtSeries to update in case it exists.
     */
    where: AgtSeriesWhereUniqueInput
    /**
     * In case the AgtSeries found by the `where` argument doesn't exist, create a new AgtSeries with this data.
     */
    create: XOR<AgtSeriesCreateInput, AgtSeriesUncheckedCreateInput>
    /**
     * In case the AgtSeries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgtSeriesUpdateInput, AgtSeriesUncheckedUpdateInput>
  }

  /**
   * AgtSeries delete
   */
  export type AgtSeriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
    /**
     * Filter which AgtSeries to delete.
     */
    where: AgtSeriesWhereUniqueInput
  }

  /**
   * AgtSeries deleteMany
   */
  export type AgtSeriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgtSeries to delete
     */
    where?: AgtSeriesWhereInput
  }

  /**
   * AgtSeries without action
   */
  export type AgtSeriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgtSeries
     */
    select?: AgtSeriesSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    name: 'name',
    email: 'email',
    role: 'role',
    password: 'password',
    isActive: 'isActive',
    storeId: 'storeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SettingsScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    hardwareId: 'hardwareId',
    offlineLicense: 'offlineLicense',
    lastSync: 'lastSync',
    lastOperationTime: 'lastOperationTime',
    lastFraudAttempt: 'lastFraudAttempt',
    fraudAttemptCount: 'fraudAttemptCount',
    terminalMode: 'terminalMode',
    masterIp: 'masterIp',
    lanSecret: 'lanSecret'
  };

  export type SettingsScalarFieldEnum = (typeof SettingsScalarFieldEnum)[keyof typeof SettingsScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    offlineId: 'offlineId',
    name: 'name',
    taxNumber: 'taxNumber',
    email: 'email',
    phone: 'phone',
    address: 'address',
    storeId: 'storeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    name: 'name',
    description: 'description',
    storeId: 'storeId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ItemScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    code: 'code',
    name: 'name',
    description: 'description',
    price: 'price',
    taxPercent: 'taxPercent',
    stock: 'stock',
    barcode: 'barcode',
    categoryId: 'categoryId',
    storeId: 'storeId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItemScalarFieldEnum = (typeof ItemScalarFieldEnum)[keyof typeof ItemScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    localNo: 'localNo',
    agtNo: 'agtNo',
    status: 'status',
    issueDate: 'issueDate',
    netTotal: 'netTotal',
    taxTotal: 'taxTotal',
    grossTotal: 'grossTotal',
    hash: 'hash',
    hashControl: 'hashControl',
    userId: 'userId',
    clientId: 'clientId',
    storeId: 'storeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const InvoiceLineScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    itemId: 'itemId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    taxPercent: 'taxPercent',
    discount: 'discount',
    netTotal: 'netTotal',
    grossTotal: 'grossTotal'
  };

  export type InvoiceLineScalarFieldEnum = (typeof InvoiceLineScalarFieldEnum)[keyof typeof InvoiceLineScalarFieldEnum]


  export const CashSessionScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    openingDate: 'openingDate',
    closingDate: 'closingDate',
    openingBalance: 'openingBalance',
    closingBalance: 'closingBalance',
    totalSales: 'totalSales',
    totalExpenses: 'totalExpenses',
    status: 'status',
    userId: 'userId',
    storeId: 'storeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CashSessionScalarFieldEnum = (typeof CashSessionScalarFieldEnum)[keyof typeof CashSessionScalarFieldEnum]


  export const CashMovementScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    type: 'type',
    description: 'description',
    amount: 'amount',
    cashSessionId: 'cashSessionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CashMovementScalarFieldEnum = (typeof CashMovementScalarFieldEnum)[keyof typeof CashMovementScalarFieldEnum]


  export const SyncOutboxScalarFieldEnum: {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    action: 'action',
    payload: 'payload',
    status: 'status',
    errorMsg: 'errorMsg',
    storeId: 'storeId',
    dependsOnType: 'dependsOnType',
    dependsOnId: 'dependsOnId',
    retryCount: 'retryCount',
    lastErrorTime: 'lastErrorTime',
    syncedAt: 'syncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SyncOutboxScalarFieldEnum = (typeof SyncOutboxScalarFieldEnum)[keyof typeof SyncOutboxScalarFieldEnum]


  export const DocumentSequenceScalarFieldEnum: {
    id: 'id',
    cloudId: 'cloudId',
    companyCode: 'companyCode',
    storeCode: 'storeCode',
    documentType: 'documentType',
    seriesYear: 'seriesYear',
    versionCode: 'versionCode',
    seriesCode: 'seriesCode',
    currentSequence: 'currentSequence',
    lastDocumentNo: 'lastDocumentNo',
    isClosed: 'isClosed',
    storeId: 'storeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentSequenceScalarFieldEnum = (typeof DocumentSequenceScalarFieldEnum)[keyof typeof DocumentSequenceScalarFieldEnum]


  export const AgtSeriesScalarFieldEnum: {
    id: 'id',
    seriesCode: 'seriesCode',
    documentType: 'documentType',
    seriesYear: 'seriesYear',
    companyId: 'companyId',
    establishmentNumber: 'establishmentNumber',
    storeId: 'storeId',
    currentSequence: 'currentSequence',
    lastDocumentNo: 'lastDocumentNo',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgtSeriesScalarFieldEnum = (typeof AgtSeriesScalarFieldEnum)[keyof typeof AgtSeriesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    cloudId?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    storeId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    invoices?: InvoiceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrderInput | SortOrder
    isActive?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoices?: InvoiceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    storeId?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    invoices?: InvoiceListRelationFilter
  }, "id" | "cloudId" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrderInput | SortOrder
    isActive?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    cloudId?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    storeId?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SettingsWhereInput = {
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    id?: StringFilter<"Settings"> | string
    storeId?: StringNullableFilter<"Settings"> | string | null
    hardwareId?: StringNullableFilter<"Settings"> | string | null
    offlineLicense?: StringNullableFilter<"Settings"> | string | null
    lastSync?: DateTimeFilter<"Settings"> | Date | string
    lastOperationTime?: DateTimeNullableFilter<"Settings"> | Date | string | null
    lastFraudAttempt?: DateTimeNullableFilter<"Settings"> | Date | string | null
    fraudAttemptCount?: IntFilter<"Settings"> | number
    terminalMode?: StringFilter<"Settings"> | string
    masterIp?: StringNullableFilter<"Settings"> | string | null
    lanSecret?: StringNullableFilter<"Settings"> | string | null
  }

  export type SettingsOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrderInput | SortOrder
    hardwareId?: SortOrderInput | SortOrder
    offlineLicense?: SortOrderInput | SortOrder
    lastSync?: SortOrder
    lastOperationTime?: SortOrderInput | SortOrder
    lastFraudAttempt?: SortOrderInput | SortOrder
    fraudAttemptCount?: SortOrder
    terminalMode?: SortOrder
    masterIp?: SortOrderInput | SortOrder
    lanSecret?: SortOrderInput | SortOrder
  }

  export type SettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    storeId?: StringNullableFilter<"Settings"> | string | null
    hardwareId?: StringNullableFilter<"Settings"> | string | null
    offlineLicense?: StringNullableFilter<"Settings"> | string | null
    lastSync?: DateTimeFilter<"Settings"> | Date | string
    lastOperationTime?: DateTimeNullableFilter<"Settings"> | Date | string | null
    lastFraudAttempt?: DateTimeNullableFilter<"Settings"> | Date | string | null
    fraudAttemptCount?: IntFilter<"Settings"> | number
    terminalMode?: StringFilter<"Settings"> | string
    masterIp?: StringNullableFilter<"Settings"> | string | null
    lanSecret?: StringNullableFilter<"Settings"> | string | null
  }, "id">

  export type SettingsOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrderInput | SortOrder
    hardwareId?: SortOrderInput | SortOrder
    offlineLicense?: SortOrderInput | SortOrder
    lastSync?: SortOrder
    lastOperationTime?: SortOrderInput | SortOrder
    lastFraudAttempt?: SortOrderInput | SortOrder
    fraudAttemptCount?: SortOrder
    terminalMode?: SortOrder
    masterIp?: SortOrderInput | SortOrder
    lanSecret?: SortOrderInput | SortOrder
    _count?: SettingsCountOrderByAggregateInput
    _avg?: SettingsAvgOrderByAggregateInput
    _max?: SettingsMaxOrderByAggregateInput
    _min?: SettingsMinOrderByAggregateInput
    _sum?: SettingsSumOrderByAggregateInput
  }

  export type SettingsScalarWhereWithAggregatesInput = {
    AND?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    OR?: SettingsScalarWhereWithAggregatesInput[]
    NOT?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Settings"> | string
    storeId?: StringNullableWithAggregatesFilter<"Settings"> | string | null
    hardwareId?: StringNullableWithAggregatesFilter<"Settings"> | string | null
    offlineLicense?: StringNullableWithAggregatesFilter<"Settings"> | string | null
    lastSync?: DateTimeWithAggregatesFilter<"Settings"> | Date | string
    lastOperationTime?: DateTimeNullableWithAggregatesFilter<"Settings"> | Date | string | null
    lastFraudAttempt?: DateTimeNullableWithAggregatesFilter<"Settings"> | Date | string | null
    fraudAttemptCount?: IntWithAggregatesFilter<"Settings"> | number
    terminalMode?: StringWithAggregatesFilter<"Settings"> | string
    masterIp?: StringNullableWithAggregatesFilter<"Settings"> | string | null
    lanSecret?: StringNullableWithAggregatesFilter<"Settings"> | string | null
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    cloudId?: StringNullableFilter<"Client"> | string | null
    offlineId?: StringNullableFilter<"Client"> | string | null
    name?: StringFilter<"Client"> | string
    taxNumber?: StringNullableFilter<"Client"> | string | null
    email?: StringNullableFilter<"Client"> | string | null
    phone?: StringNullableFilter<"Client"> | string | null
    address?: StringNullableFilter<"Client"> | string | null
    storeId?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    invoices?: InvoiceListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    offlineId?: SortOrderInput | SortOrder
    name?: SortOrder
    taxNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoices?: InvoiceOrderByRelationAggregateInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    offlineId?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    name?: StringFilter<"Client"> | string
    taxNumber?: StringNullableFilter<"Client"> | string | null
    email?: StringNullableFilter<"Client"> | string | null
    phone?: StringNullableFilter<"Client"> | string | null
    address?: StringNullableFilter<"Client"> | string | null
    storeId?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    invoices?: InvoiceListRelationFilter
  }, "id" | "cloudId" | "offlineId">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    offlineId?: SortOrderInput | SortOrder
    name?: SortOrder
    taxNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    cloudId?: StringNullableWithAggregatesFilter<"Client"> | string | null
    offlineId?: StringNullableWithAggregatesFilter<"Client"> | string | null
    name?: StringWithAggregatesFilter<"Client"> | string
    taxNumber?: StringNullableWithAggregatesFilter<"Client"> | string | null
    email?: StringNullableWithAggregatesFilter<"Client"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Client"> | string | null
    address?: StringNullableWithAggregatesFilter<"Client"> | string | null
    storeId?: StringWithAggregatesFilter<"Client"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    cloudId?: StringNullableFilter<"Category"> | string | null
    name?: StringFilter<"Category"> | string
    description?: StringNullableFilter<"Category"> | string | null
    storeId?: StringFilter<"Category"> | string
    isActive?: BoolFilter<"Category"> | boolean
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    items?: ItemListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: ItemOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    name?: StringFilter<"Category"> | string
    description?: StringNullableFilter<"Category"> | string | null
    storeId?: StringFilter<"Category"> | string
    isActive?: BoolFilter<"Category"> | boolean
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    items?: ItemListRelationFilter
  }, "id" | "cloudId">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    cloudId?: StringNullableWithAggregatesFilter<"Category"> | string | null
    name?: StringWithAggregatesFilter<"Category"> | string
    description?: StringNullableWithAggregatesFilter<"Category"> | string | null
    storeId?: StringWithAggregatesFilter<"Category"> | string
    isActive?: BoolWithAggregatesFilter<"Category"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type ItemWhereInput = {
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    id?: StringFilter<"Item"> | string
    cloudId?: StringNullableFilter<"Item"> | string | null
    code?: StringNullableFilter<"Item"> | string | null
    name?: StringFilter<"Item"> | string
    description?: StringNullableFilter<"Item"> | string | null
    price?: FloatFilter<"Item"> | number
    taxPercent?: FloatFilter<"Item"> | number
    stock?: FloatFilter<"Item"> | number
    barcode?: StringNullableFilter<"Item"> | string | null
    categoryId?: StringNullableFilter<"Item"> | string | null
    storeId?: StringFilter<"Item"> | string
    isActive?: BoolFilter<"Item"> | boolean
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
    category?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null
    invoiceLines?: InvoiceLineListRelationFilter
  }

  export type ItemOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
    barcode?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
    invoiceLines?: InvoiceLineOrderByRelationAggregateInput
  }

  export type ItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    code?: string
    barcode?: string
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    name?: StringFilter<"Item"> | string
    description?: StringNullableFilter<"Item"> | string | null
    price?: FloatFilter<"Item"> | number
    taxPercent?: FloatFilter<"Item"> | number
    stock?: FloatFilter<"Item"> | number
    categoryId?: StringNullableFilter<"Item"> | string | null
    storeId?: StringFilter<"Item"> | string
    isActive?: BoolFilter<"Item"> | boolean
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
    category?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null
    invoiceLines?: InvoiceLineListRelationFilter
  }, "id" | "cloudId" | "code" | "barcode">

  export type ItemOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
    barcode?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ItemCountOrderByAggregateInput
    _avg?: ItemAvgOrderByAggregateInput
    _max?: ItemMaxOrderByAggregateInput
    _min?: ItemMinOrderByAggregateInput
    _sum?: ItemSumOrderByAggregateInput
  }

  export type ItemScalarWhereWithAggregatesInput = {
    AND?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    OR?: ItemScalarWhereWithAggregatesInput[]
    NOT?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Item"> | string
    cloudId?: StringNullableWithAggregatesFilter<"Item"> | string | null
    code?: StringNullableWithAggregatesFilter<"Item"> | string | null
    name?: StringWithAggregatesFilter<"Item"> | string
    description?: StringNullableWithAggregatesFilter<"Item"> | string | null
    price?: FloatWithAggregatesFilter<"Item"> | number
    taxPercent?: FloatWithAggregatesFilter<"Item"> | number
    stock?: FloatWithAggregatesFilter<"Item"> | number
    barcode?: StringNullableWithAggregatesFilter<"Item"> | string | null
    categoryId?: StringNullableWithAggregatesFilter<"Item"> | string | null
    storeId?: StringWithAggregatesFilter<"Item"> | string
    isActive?: BoolWithAggregatesFilter<"Item"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Item"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Item"> | Date | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    localNo?: StringFilter<"Invoice"> | string
    agtNo?: StringNullableFilter<"Invoice"> | string | null
    status?: StringFilter<"Invoice"> | string
    issueDate?: DateTimeFilter<"Invoice"> | Date | string
    netTotal?: FloatFilter<"Invoice"> | number
    taxTotal?: FloatFilter<"Invoice"> | number
    grossTotal?: FloatFilter<"Invoice"> | number
    hash?: StringNullableFilter<"Invoice"> | string | null
    hashControl?: StringNullableFilter<"Invoice"> | string | null
    userId?: StringFilter<"Invoice"> | string
    clientId?: StringNullableFilter<"Invoice"> | string | null
    storeId?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    client?: XOR<ClientNullableRelationFilter, ClientWhereInput> | null
    lines?: InvoiceLineListRelationFilter
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    localNo?: SortOrder
    agtNo?: SortOrderInput | SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
    hash?: SortOrderInput | SortOrder
    hashControl?: SortOrderInput | SortOrder
    userId?: SortOrder
    clientId?: SortOrderInput | SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    client?: ClientOrderByWithRelationInput
    lines?: InvoiceLineOrderByRelationAggregateInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    localNo?: string
    agtNo?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    status?: StringFilter<"Invoice"> | string
    issueDate?: DateTimeFilter<"Invoice"> | Date | string
    netTotal?: FloatFilter<"Invoice"> | number
    taxTotal?: FloatFilter<"Invoice"> | number
    grossTotal?: FloatFilter<"Invoice"> | number
    hash?: StringNullableFilter<"Invoice"> | string | null
    hashControl?: StringNullableFilter<"Invoice"> | string | null
    userId?: StringFilter<"Invoice"> | string
    clientId?: StringNullableFilter<"Invoice"> | string | null
    storeId?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    client?: XOR<ClientNullableRelationFilter, ClientWhereInput> | null
    lines?: InvoiceLineListRelationFilter
  }, "id" | "localNo" | "agtNo">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    localNo?: SortOrder
    agtNo?: SortOrderInput | SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
    hash?: SortOrderInput | SortOrder
    hashControl?: SortOrderInput | SortOrder
    userId?: SortOrder
    clientId?: SortOrderInput | SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    localNo?: StringWithAggregatesFilter<"Invoice"> | string
    agtNo?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    status?: StringWithAggregatesFilter<"Invoice"> | string
    issueDate?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    netTotal?: FloatWithAggregatesFilter<"Invoice"> | number
    taxTotal?: FloatWithAggregatesFilter<"Invoice"> | number
    grossTotal?: FloatWithAggregatesFilter<"Invoice"> | number
    hash?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    hashControl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    userId?: StringWithAggregatesFilter<"Invoice"> | string
    clientId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    storeId?: StringWithAggregatesFilter<"Invoice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type InvoiceLineWhereInput = {
    AND?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    OR?: InvoiceLineWhereInput[]
    NOT?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    id?: StringFilter<"InvoiceLine"> | string
    invoiceId?: StringFilter<"InvoiceLine"> | string
    itemId?: StringFilter<"InvoiceLine"> | string
    quantity?: FloatFilter<"InvoiceLine"> | number
    unitPrice?: FloatFilter<"InvoiceLine"> | number
    taxPercent?: FloatFilter<"InvoiceLine"> | number
    discount?: FloatFilter<"InvoiceLine"> | number
    netTotal?: FloatFilter<"InvoiceLine"> | number
    grossTotal?: FloatFilter<"InvoiceLine"> | number
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
    item?: XOR<ItemRelationFilter, ItemWhereInput>
  }

  export type InvoiceLineOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
    item?: ItemOrderByWithRelationInput
  }

  export type InvoiceLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    OR?: InvoiceLineWhereInput[]
    NOT?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    invoiceId?: StringFilter<"InvoiceLine"> | string
    itemId?: StringFilter<"InvoiceLine"> | string
    quantity?: FloatFilter<"InvoiceLine"> | number
    unitPrice?: FloatFilter<"InvoiceLine"> | number
    taxPercent?: FloatFilter<"InvoiceLine"> | number
    discount?: FloatFilter<"InvoiceLine"> | number
    netTotal?: FloatFilter<"InvoiceLine"> | number
    grossTotal?: FloatFilter<"InvoiceLine"> | number
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
    item?: XOR<ItemRelationFilter, ItemWhereInput>
  }, "id">

  export type InvoiceLineOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
    _count?: InvoiceLineCountOrderByAggregateInput
    _avg?: InvoiceLineAvgOrderByAggregateInput
    _max?: InvoiceLineMaxOrderByAggregateInput
    _min?: InvoiceLineMinOrderByAggregateInput
    _sum?: InvoiceLineSumOrderByAggregateInput
  }

  export type InvoiceLineScalarWhereWithAggregatesInput = {
    AND?: InvoiceLineScalarWhereWithAggregatesInput | InvoiceLineScalarWhereWithAggregatesInput[]
    OR?: InvoiceLineScalarWhereWithAggregatesInput[]
    NOT?: InvoiceLineScalarWhereWithAggregatesInput | InvoiceLineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceLine"> | string
    invoiceId?: StringWithAggregatesFilter<"InvoiceLine"> | string
    itemId?: StringWithAggregatesFilter<"InvoiceLine"> | string
    quantity?: FloatWithAggregatesFilter<"InvoiceLine"> | number
    unitPrice?: FloatWithAggregatesFilter<"InvoiceLine"> | number
    taxPercent?: FloatWithAggregatesFilter<"InvoiceLine"> | number
    discount?: FloatWithAggregatesFilter<"InvoiceLine"> | number
    netTotal?: FloatWithAggregatesFilter<"InvoiceLine"> | number
    grossTotal?: FloatWithAggregatesFilter<"InvoiceLine"> | number
  }

  export type CashSessionWhereInput = {
    AND?: CashSessionWhereInput | CashSessionWhereInput[]
    OR?: CashSessionWhereInput[]
    NOT?: CashSessionWhereInput | CashSessionWhereInput[]
    id?: StringFilter<"CashSession"> | string
    cloudId?: StringNullableFilter<"CashSession"> | string | null
    openingDate?: DateTimeFilter<"CashSession"> | Date | string
    closingDate?: DateTimeNullableFilter<"CashSession"> | Date | string | null
    openingBalance?: FloatFilter<"CashSession"> | number
    closingBalance?: FloatNullableFilter<"CashSession"> | number | null
    totalSales?: FloatFilter<"CashSession"> | number
    totalExpenses?: FloatFilter<"CashSession"> | number
    status?: StringFilter<"CashSession"> | string
    userId?: StringFilter<"CashSession"> | string
    storeId?: StringFilter<"CashSession"> | string
    createdAt?: DateTimeFilter<"CashSession"> | Date | string
    updatedAt?: DateTimeFilter<"CashSession"> | Date | string
    movements?: CashMovementListRelationFilter
  }

  export type CashSessionOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    openingDate?: SortOrder
    closingDate?: SortOrderInput | SortOrder
    openingBalance?: SortOrder
    closingBalance?: SortOrderInput | SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    movements?: CashMovementOrderByRelationAggregateInput
  }

  export type CashSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    AND?: CashSessionWhereInput | CashSessionWhereInput[]
    OR?: CashSessionWhereInput[]
    NOT?: CashSessionWhereInput | CashSessionWhereInput[]
    openingDate?: DateTimeFilter<"CashSession"> | Date | string
    closingDate?: DateTimeNullableFilter<"CashSession"> | Date | string | null
    openingBalance?: FloatFilter<"CashSession"> | number
    closingBalance?: FloatNullableFilter<"CashSession"> | number | null
    totalSales?: FloatFilter<"CashSession"> | number
    totalExpenses?: FloatFilter<"CashSession"> | number
    status?: StringFilter<"CashSession"> | string
    userId?: StringFilter<"CashSession"> | string
    storeId?: StringFilter<"CashSession"> | string
    createdAt?: DateTimeFilter<"CashSession"> | Date | string
    updatedAt?: DateTimeFilter<"CashSession"> | Date | string
    movements?: CashMovementListRelationFilter
  }, "id" | "cloudId">

  export type CashSessionOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    openingDate?: SortOrder
    closingDate?: SortOrderInput | SortOrder
    openingBalance?: SortOrder
    closingBalance?: SortOrderInput | SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CashSessionCountOrderByAggregateInput
    _avg?: CashSessionAvgOrderByAggregateInput
    _max?: CashSessionMaxOrderByAggregateInput
    _min?: CashSessionMinOrderByAggregateInput
    _sum?: CashSessionSumOrderByAggregateInput
  }

  export type CashSessionScalarWhereWithAggregatesInput = {
    AND?: CashSessionScalarWhereWithAggregatesInput | CashSessionScalarWhereWithAggregatesInput[]
    OR?: CashSessionScalarWhereWithAggregatesInput[]
    NOT?: CashSessionScalarWhereWithAggregatesInput | CashSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CashSession"> | string
    cloudId?: StringNullableWithAggregatesFilter<"CashSession"> | string | null
    openingDate?: DateTimeWithAggregatesFilter<"CashSession"> | Date | string
    closingDate?: DateTimeNullableWithAggregatesFilter<"CashSession"> | Date | string | null
    openingBalance?: FloatWithAggregatesFilter<"CashSession"> | number
    closingBalance?: FloatNullableWithAggregatesFilter<"CashSession"> | number | null
    totalSales?: FloatWithAggregatesFilter<"CashSession"> | number
    totalExpenses?: FloatWithAggregatesFilter<"CashSession"> | number
    status?: StringWithAggregatesFilter<"CashSession"> | string
    userId?: StringWithAggregatesFilter<"CashSession"> | string
    storeId?: StringWithAggregatesFilter<"CashSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CashSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CashSession"> | Date | string
  }

  export type CashMovementWhereInput = {
    AND?: CashMovementWhereInput | CashMovementWhereInput[]
    OR?: CashMovementWhereInput[]
    NOT?: CashMovementWhereInput | CashMovementWhereInput[]
    id?: StringFilter<"CashMovement"> | string
    cloudId?: StringNullableFilter<"CashMovement"> | string | null
    type?: StringFilter<"CashMovement"> | string
    description?: StringFilter<"CashMovement"> | string
    amount?: FloatFilter<"CashMovement"> | number
    cashSessionId?: StringFilter<"CashMovement"> | string
    createdAt?: DateTimeFilter<"CashMovement"> | Date | string
    updatedAt?: DateTimeFilter<"CashMovement"> | Date | string
    cashSession?: XOR<CashSessionRelationFilter, CashSessionWhereInput>
  }

  export type CashMovementOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    type?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    cashSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cashSession?: CashSessionOrderByWithRelationInput
  }

  export type CashMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    AND?: CashMovementWhereInput | CashMovementWhereInput[]
    OR?: CashMovementWhereInput[]
    NOT?: CashMovementWhereInput | CashMovementWhereInput[]
    type?: StringFilter<"CashMovement"> | string
    description?: StringFilter<"CashMovement"> | string
    amount?: FloatFilter<"CashMovement"> | number
    cashSessionId?: StringFilter<"CashMovement"> | string
    createdAt?: DateTimeFilter<"CashMovement"> | Date | string
    updatedAt?: DateTimeFilter<"CashMovement"> | Date | string
    cashSession?: XOR<CashSessionRelationFilter, CashSessionWhereInput>
  }, "id" | "cloudId">

  export type CashMovementOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    type?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    cashSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CashMovementCountOrderByAggregateInput
    _avg?: CashMovementAvgOrderByAggregateInput
    _max?: CashMovementMaxOrderByAggregateInput
    _min?: CashMovementMinOrderByAggregateInput
    _sum?: CashMovementSumOrderByAggregateInput
  }

  export type CashMovementScalarWhereWithAggregatesInput = {
    AND?: CashMovementScalarWhereWithAggregatesInput | CashMovementScalarWhereWithAggregatesInput[]
    OR?: CashMovementScalarWhereWithAggregatesInput[]
    NOT?: CashMovementScalarWhereWithAggregatesInput | CashMovementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CashMovement"> | string
    cloudId?: StringNullableWithAggregatesFilter<"CashMovement"> | string | null
    type?: StringWithAggregatesFilter<"CashMovement"> | string
    description?: StringWithAggregatesFilter<"CashMovement"> | string
    amount?: FloatWithAggregatesFilter<"CashMovement"> | number
    cashSessionId?: StringWithAggregatesFilter<"CashMovement"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CashMovement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CashMovement"> | Date | string
  }

  export type SyncOutboxWhereInput = {
    AND?: SyncOutboxWhereInput | SyncOutboxWhereInput[]
    OR?: SyncOutboxWhereInput[]
    NOT?: SyncOutboxWhereInput | SyncOutboxWhereInput[]
    id?: StringFilter<"SyncOutbox"> | string
    entityType?: StringFilter<"SyncOutbox"> | string
    entityId?: StringFilter<"SyncOutbox"> | string
    action?: StringFilter<"SyncOutbox"> | string
    payload?: StringFilter<"SyncOutbox"> | string
    status?: StringFilter<"SyncOutbox"> | string
    errorMsg?: StringNullableFilter<"SyncOutbox"> | string | null
    storeId?: StringFilter<"SyncOutbox"> | string
    dependsOnType?: StringNullableFilter<"SyncOutbox"> | string | null
    dependsOnId?: StringNullableFilter<"SyncOutbox"> | string | null
    retryCount?: IntFilter<"SyncOutbox"> | number
    lastErrorTime?: DateTimeNullableFilter<"SyncOutbox"> | Date | string | null
    syncedAt?: DateTimeNullableFilter<"SyncOutbox"> | Date | string | null
    createdAt?: DateTimeFilter<"SyncOutbox"> | Date | string
    updatedAt?: DateTimeFilter<"SyncOutbox"> | Date | string
  }

  export type SyncOutboxOrderByWithRelationInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    errorMsg?: SortOrderInput | SortOrder
    storeId?: SortOrder
    dependsOnType?: SortOrderInput | SortOrder
    dependsOnId?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    lastErrorTime?: SortOrderInput | SortOrder
    syncedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncOutboxWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SyncOutboxWhereInput | SyncOutboxWhereInput[]
    OR?: SyncOutboxWhereInput[]
    NOT?: SyncOutboxWhereInput | SyncOutboxWhereInput[]
    entityType?: StringFilter<"SyncOutbox"> | string
    entityId?: StringFilter<"SyncOutbox"> | string
    action?: StringFilter<"SyncOutbox"> | string
    payload?: StringFilter<"SyncOutbox"> | string
    status?: StringFilter<"SyncOutbox"> | string
    errorMsg?: StringNullableFilter<"SyncOutbox"> | string | null
    storeId?: StringFilter<"SyncOutbox"> | string
    dependsOnType?: StringNullableFilter<"SyncOutbox"> | string | null
    dependsOnId?: StringNullableFilter<"SyncOutbox"> | string | null
    retryCount?: IntFilter<"SyncOutbox"> | number
    lastErrorTime?: DateTimeNullableFilter<"SyncOutbox"> | Date | string | null
    syncedAt?: DateTimeNullableFilter<"SyncOutbox"> | Date | string | null
    createdAt?: DateTimeFilter<"SyncOutbox"> | Date | string
    updatedAt?: DateTimeFilter<"SyncOutbox"> | Date | string
  }, "id">

  export type SyncOutboxOrderByWithAggregationInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    errorMsg?: SortOrderInput | SortOrder
    storeId?: SortOrder
    dependsOnType?: SortOrderInput | SortOrder
    dependsOnId?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    lastErrorTime?: SortOrderInput | SortOrder
    syncedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncOutboxCountOrderByAggregateInput
    _avg?: SyncOutboxAvgOrderByAggregateInput
    _max?: SyncOutboxMaxOrderByAggregateInput
    _min?: SyncOutboxMinOrderByAggregateInput
    _sum?: SyncOutboxSumOrderByAggregateInput
  }

  export type SyncOutboxScalarWhereWithAggregatesInput = {
    AND?: SyncOutboxScalarWhereWithAggregatesInput | SyncOutboxScalarWhereWithAggregatesInput[]
    OR?: SyncOutboxScalarWhereWithAggregatesInput[]
    NOT?: SyncOutboxScalarWhereWithAggregatesInput | SyncOutboxScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncOutbox"> | string
    entityType?: StringWithAggregatesFilter<"SyncOutbox"> | string
    entityId?: StringWithAggregatesFilter<"SyncOutbox"> | string
    action?: StringWithAggregatesFilter<"SyncOutbox"> | string
    payload?: StringWithAggregatesFilter<"SyncOutbox"> | string
    status?: StringWithAggregatesFilter<"SyncOutbox"> | string
    errorMsg?: StringNullableWithAggregatesFilter<"SyncOutbox"> | string | null
    storeId?: StringWithAggregatesFilter<"SyncOutbox"> | string
    dependsOnType?: StringNullableWithAggregatesFilter<"SyncOutbox"> | string | null
    dependsOnId?: StringNullableWithAggregatesFilter<"SyncOutbox"> | string | null
    retryCount?: IntWithAggregatesFilter<"SyncOutbox"> | number
    lastErrorTime?: DateTimeNullableWithAggregatesFilter<"SyncOutbox"> | Date | string | null
    syncedAt?: DateTimeNullableWithAggregatesFilter<"SyncOutbox"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SyncOutbox"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncOutbox"> | Date | string
  }

  export type DocumentSequenceWhereInput = {
    AND?: DocumentSequenceWhereInput | DocumentSequenceWhereInput[]
    OR?: DocumentSequenceWhereInput[]
    NOT?: DocumentSequenceWhereInput | DocumentSequenceWhereInput[]
    id?: StringFilter<"DocumentSequence"> | string
    cloudId?: StringNullableFilter<"DocumentSequence"> | string | null
    companyCode?: StringFilter<"DocumentSequence"> | string
    storeCode?: StringFilter<"DocumentSequence"> | string
    documentType?: StringFilter<"DocumentSequence"> | string
    seriesYear?: StringFilter<"DocumentSequence"> | string
    versionCode?: StringFilter<"DocumentSequence"> | string
    seriesCode?: StringFilter<"DocumentSequence"> | string
    currentSequence?: IntFilter<"DocumentSequence"> | number
    lastDocumentNo?: IntFilter<"DocumentSequence"> | number
    isClosed?: BoolFilter<"DocumentSequence"> | boolean
    storeId?: StringFilter<"DocumentSequence"> | string
    createdAt?: DateTimeFilter<"DocumentSequence"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentSequence"> | Date | string
  }

  export type DocumentSequenceOrderByWithRelationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    companyCode?: SortOrder
    storeCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    versionCode?: SortOrder
    seriesCode?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isClosed?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSequenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cloudId?: string
    seriesCode?: string
    companyCode_storeCode_documentType_seriesYear_versionCode?: DocumentSequenceCompanyCodeStoreCodeDocumentTypeSeriesYearVersionCodeCompoundUniqueInput
    AND?: DocumentSequenceWhereInput | DocumentSequenceWhereInput[]
    OR?: DocumentSequenceWhereInput[]
    NOT?: DocumentSequenceWhereInput | DocumentSequenceWhereInput[]
    companyCode?: StringFilter<"DocumentSequence"> | string
    storeCode?: StringFilter<"DocumentSequence"> | string
    documentType?: StringFilter<"DocumentSequence"> | string
    seriesYear?: StringFilter<"DocumentSequence"> | string
    versionCode?: StringFilter<"DocumentSequence"> | string
    currentSequence?: IntFilter<"DocumentSequence"> | number
    lastDocumentNo?: IntFilter<"DocumentSequence"> | number
    isClosed?: BoolFilter<"DocumentSequence"> | boolean
    storeId?: StringFilter<"DocumentSequence"> | string
    createdAt?: DateTimeFilter<"DocumentSequence"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentSequence"> | Date | string
  }, "id" | "cloudId" | "seriesCode" | "companyCode_storeCode_documentType_seriesYear_versionCode">

  export type DocumentSequenceOrderByWithAggregationInput = {
    id?: SortOrder
    cloudId?: SortOrderInput | SortOrder
    companyCode?: SortOrder
    storeCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    versionCode?: SortOrder
    seriesCode?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isClosed?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentSequenceCountOrderByAggregateInput
    _avg?: DocumentSequenceAvgOrderByAggregateInput
    _max?: DocumentSequenceMaxOrderByAggregateInput
    _min?: DocumentSequenceMinOrderByAggregateInput
    _sum?: DocumentSequenceSumOrderByAggregateInput
  }

  export type DocumentSequenceScalarWhereWithAggregatesInput = {
    AND?: DocumentSequenceScalarWhereWithAggregatesInput | DocumentSequenceScalarWhereWithAggregatesInput[]
    OR?: DocumentSequenceScalarWhereWithAggregatesInput[]
    NOT?: DocumentSequenceScalarWhereWithAggregatesInput | DocumentSequenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DocumentSequence"> | string
    cloudId?: StringNullableWithAggregatesFilter<"DocumentSequence"> | string | null
    companyCode?: StringWithAggregatesFilter<"DocumentSequence"> | string
    storeCode?: StringWithAggregatesFilter<"DocumentSequence"> | string
    documentType?: StringWithAggregatesFilter<"DocumentSequence"> | string
    seriesYear?: StringWithAggregatesFilter<"DocumentSequence"> | string
    versionCode?: StringWithAggregatesFilter<"DocumentSequence"> | string
    seriesCode?: StringWithAggregatesFilter<"DocumentSequence"> | string
    currentSequence?: IntWithAggregatesFilter<"DocumentSequence"> | number
    lastDocumentNo?: IntWithAggregatesFilter<"DocumentSequence"> | number
    isClosed?: BoolWithAggregatesFilter<"DocumentSequence"> | boolean
    storeId?: StringWithAggregatesFilter<"DocumentSequence"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DocumentSequence"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DocumentSequence"> | Date | string
  }

  export type AgtSeriesWhereInput = {
    AND?: AgtSeriesWhereInput | AgtSeriesWhereInput[]
    OR?: AgtSeriesWhereInput[]
    NOT?: AgtSeriesWhereInput | AgtSeriesWhereInput[]
    id?: StringFilter<"AgtSeries"> | string
    seriesCode?: StringNullableFilter<"AgtSeries"> | string | null
    documentType?: StringFilter<"AgtSeries"> | string
    seriesYear?: StringFilter<"AgtSeries"> | string
    companyId?: StringFilter<"AgtSeries"> | string
    establishmentNumber?: StringFilter<"AgtSeries"> | string
    storeId?: StringNullableFilter<"AgtSeries"> | string | null
    currentSequence?: IntFilter<"AgtSeries"> | number
    lastDocumentNo?: StringNullableFilter<"AgtSeries"> | string | null
    isActive?: BoolFilter<"AgtSeries"> | boolean
    createdAt?: DateTimeFilter<"AgtSeries"> | Date | string
    updatedAt?: DateTimeFilter<"AgtSeries"> | Date | string
  }

  export type AgtSeriesOrderByWithRelationInput = {
    id?: SortOrder
    seriesCode?: SortOrderInput | SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    companyId?: SortOrder
    establishmentNumber?: SortOrder
    storeId?: SortOrderInput | SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgtSeriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    seriesCode?: string
    AgtSeries_documentType_seriesYear_companyId_establishmentNumber_key?: AgtSeriesAgtSeries_documentType_seriesYear_companyId_establishmentNumber_keyCompoundUniqueInput
    AND?: AgtSeriesWhereInput | AgtSeriesWhereInput[]
    OR?: AgtSeriesWhereInput[]
    NOT?: AgtSeriesWhereInput | AgtSeriesWhereInput[]
    documentType?: StringFilter<"AgtSeries"> | string
    seriesYear?: StringFilter<"AgtSeries"> | string
    companyId?: StringFilter<"AgtSeries"> | string
    establishmentNumber?: StringFilter<"AgtSeries"> | string
    storeId?: StringNullableFilter<"AgtSeries"> | string | null
    currentSequence?: IntFilter<"AgtSeries"> | number
    lastDocumentNo?: StringNullableFilter<"AgtSeries"> | string | null
    isActive?: BoolFilter<"AgtSeries"> | boolean
    createdAt?: DateTimeFilter<"AgtSeries"> | Date | string
    updatedAt?: DateTimeFilter<"AgtSeries"> | Date | string
  }, "id" | "seriesCode" | "AgtSeries_documentType_seriesYear_companyId_establishmentNumber_key">

  export type AgtSeriesOrderByWithAggregationInput = {
    id?: SortOrder
    seriesCode?: SortOrderInput | SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    companyId?: SortOrder
    establishmentNumber?: SortOrder
    storeId?: SortOrderInput | SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgtSeriesCountOrderByAggregateInput
    _avg?: AgtSeriesAvgOrderByAggregateInput
    _max?: AgtSeriesMaxOrderByAggregateInput
    _min?: AgtSeriesMinOrderByAggregateInput
    _sum?: AgtSeriesSumOrderByAggregateInput
  }

  export type AgtSeriesScalarWhereWithAggregatesInput = {
    AND?: AgtSeriesScalarWhereWithAggregatesInput | AgtSeriesScalarWhereWithAggregatesInput[]
    OR?: AgtSeriesScalarWhereWithAggregatesInput[]
    NOT?: AgtSeriesScalarWhereWithAggregatesInput | AgtSeriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgtSeries"> | string
    seriesCode?: StringNullableWithAggregatesFilter<"AgtSeries"> | string | null
    documentType?: StringWithAggregatesFilter<"AgtSeries"> | string
    seriesYear?: StringWithAggregatesFilter<"AgtSeries"> | string
    companyId?: StringWithAggregatesFilter<"AgtSeries"> | string
    establishmentNumber?: StringWithAggregatesFilter<"AgtSeries"> | string
    storeId?: StringNullableWithAggregatesFilter<"AgtSeries"> | string | null
    currentSequence?: IntWithAggregatesFilter<"AgtSeries"> | number
    lastDocumentNo?: StringNullableWithAggregatesFilter<"AgtSeries"> | string | null
    isActive?: BoolWithAggregatesFilter<"AgtSeries"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AgtSeries"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AgtSeries"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    cloudId?: string | null
    name: string
    email: string
    role: string
    password?: string | null
    isActive?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    name: string
    email: string
    role: string
    password?: string | null
    isActive?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    cloudId?: string | null
    name: string
    email: string
    role: string
    password?: string | null
    isActive?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsCreateInput = {
    id?: string
    storeId?: string | null
    hardwareId?: string | null
    offlineLicense?: string | null
    lastSync?: Date | string
    lastOperationTime?: Date | string | null
    lastFraudAttempt?: Date | string | null
    fraudAttemptCount?: number
    terminalMode?: string
    masterIp?: string | null
    lanSecret?: string | null
  }

  export type SettingsUncheckedCreateInput = {
    id?: string
    storeId?: string | null
    hardwareId?: string | null
    offlineLicense?: string | null
    lastSync?: Date | string
    lastOperationTime?: Date | string | null
    lastFraudAttempt?: Date | string | null
    fraudAttemptCount?: number
    terminalMode?: string
    masterIp?: string | null
    lanSecret?: string | null
  }

  export type SettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    hardwareId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineLicense?: NullableStringFieldUpdateOperationsInput | string | null
    lastSync?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOperationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFraudAttempt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fraudAttemptCount?: IntFieldUpdateOperationsInput | number
    terminalMode?: StringFieldUpdateOperationsInput | string
    masterIp?: NullableStringFieldUpdateOperationsInput | string | null
    lanSecret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    hardwareId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineLicense?: NullableStringFieldUpdateOperationsInput | string | null
    lastSync?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOperationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFraudAttempt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fraudAttemptCount?: IntFieldUpdateOperationsInput | number
    terminalMode?: StringFieldUpdateOperationsInput | string
    masterIp?: NullableStringFieldUpdateOperationsInput | string | null
    lanSecret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SettingsCreateManyInput = {
    id?: string
    storeId?: string | null
    hardwareId?: string | null
    offlineLicense?: string | null
    lastSync?: Date | string
    lastOperationTime?: Date | string | null
    lastFraudAttempt?: Date | string | null
    fraudAttemptCount?: number
    terminalMode?: string
    masterIp?: string | null
    lanSecret?: string | null
  }

  export type SettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    hardwareId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineLicense?: NullableStringFieldUpdateOperationsInput | string | null
    lastSync?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOperationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFraudAttempt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fraudAttemptCount?: IntFieldUpdateOperationsInput | number
    terminalMode?: StringFieldUpdateOperationsInput | string
    masterIp?: NullableStringFieldUpdateOperationsInput | string | null
    lanSecret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    hardwareId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineLicense?: NullableStringFieldUpdateOperationsInput | string | null
    lastSync?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOperationTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFraudAttempt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fraudAttemptCount?: IntFieldUpdateOperationsInput | number
    terminalMode?: StringFieldUpdateOperationsInput | string
    masterIp?: NullableStringFieldUpdateOperationsInput | string | null
    lanSecret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClientCreateInput = {
    id?: string
    cloudId?: string | null
    offlineId?: string | null
    name: string
    taxNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    offlineId?: string | null
    name: string
    taxNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    cloudId?: string | null
    offlineId?: string | null
    name: string
    taxNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    id?: string
    cloudId?: string | null
    name: string
    description?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ItemCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    name: string
    description?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ItemUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItemUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItemUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    cloudId?: string | null
    name: string
    description?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemCreateInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutItemsInput
    invoiceLines?: InvoiceLineCreateNestedManyWithoutItemInput
  }

  export type ItemUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    categoryId?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutItemsNestedInput
    invoiceLines?: InvoiceLineUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUncheckedUpdateManyWithoutItemNestedInput
  }

  export type ItemCreateManyInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    categoryId?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutInvoicesInput
    client?: ClientCreateNestedOneWithoutInvoicesInput
    lines?: InvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    userId: string
    clientId?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInvoicesNestedInput
    client?: ClientUpdateOneWithoutInvoicesNestedInput
    lines?: InvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateManyInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    userId: string
    clientId?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineCreateInput = {
    id?: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
    invoice: InvoiceCreateNestedOneWithoutLinesInput
    item: ItemCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineUncheckedCreateInput = {
    id?: string
    invoiceId: string
    itemId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
  }

  export type InvoiceLineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    invoice?: InvoiceUpdateOneRequiredWithoutLinesNestedInput
    item?: ItemUpdateOneRequiredWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineCreateManyInput = {
    id?: string
    invoiceId: string
    itemId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
  }

  export type InvoiceLineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type CashSessionCreateInput = {
    id?: string
    cloudId?: string | null
    openingDate?: Date | string
    closingDate?: Date | string | null
    openingBalance: number
    closingBalance?: number | null
    totalSales?: number
    totalExpenses?: number
    status?: string
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: CashMovementCreateNestedManyWithoutCashSessionInput
  }

  export type CashSessionUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    openingDate?: Date | string
    closingDate?: Date | string | null
    openingBalance: number
    closingBalance?: number | null
    totalSales?: number
    totalExpenses?: number
    status?: string
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    movements?: CashMovementUncheckedCreateNestedManyWithoutCashSessionInput
  }

  export type CashSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    openingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    closingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openingBalance?: FloatFieldUpdateOperationsInput | number
    closingBalance?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSales?: FloatFieldUpdateOperationsInput | number
    totalExpenses?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: CashMovementUpdateManyWithoutCashSessionNestedInput
  }

  export type CashSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    openingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    closingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openingBalance?: FloatFieldUpdateOperationsInput | number
    closingBalance?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSales?: FloatFieldUpdateOperationsInput | number
    totalExpenses?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    movements?: CashMovementUncheckedUpdateManyWithoutCashSessionNestedInput
  }

  export type CashSessionCreateManyInput = {
    id?: string
    cloudId?: string | null
    openingDate?: Date | string
    closingDate?: Date | string | null
    openingBalance: number
    closingBalance?: number | null
    totalSales?: number
    totalExpenses?: number
    status?: string
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    openingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    closingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openingBalance?: FloatFieldUpdateOperationsInput | number
    closingBalance?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSales?: FloatFieldUpdateOperationsInput | number
    totalExpenses?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    openingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    closingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openingBalance?: FloatFieldUpdateOperationsInput | number
    closingBalance?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSales?: FloatFieldUpdateOperationsInput | number
    totalExpenses?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashMovementCreateInput = {
    id?: string
    cloudId?: string | null
    type: string
    description: string
    amount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cashSession: CashSessionCreateNestedOneWithoutMovementsInput
  }

  export type CashMovementUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    type: string
    description: string
    amount: number
    cashSessionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashMovementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cashSession?: CashSessionUpdateOneRequiredWithoutMovementsNestedInput
  }

  export type CashMovementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    cashSessionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashMovementCreateManyInput = {
    id?: string
    cloudId?: string | null
    type: string
    description: string
    amount: number
    cashSessionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashMovementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashMovementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    cashSessionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncOutboxCreateInput = {
    id?: string
    entityType: string
    entityId: string
    action: string
    payload: string
    status?: string
    errorMsg?: string | null
    storeId: string
    dependsOnType?: string | null
    dependsOnId?: string | null
    retryCount?: number
    lastErrorTime?: Date | string | null
    syncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncOutboxUncheckedCreateInput = {
    id?: string
    entityType: string
    entityId: string
    action: string
    payload: string
    status?: string
    errorMsg?: string | null
    storeId: string
    dependsOnType?: string | null
    dependsOnId?: string | null
    retryCount?: number
    lastErrorTime?: Date | string | null
    syncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncOutboxUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMsg?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    dependsOnType?: NullableStringFieldUpdateOperationsInput | string | null
    dependsOnId?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    lastErrorTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncOutboxUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMsg?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    dependsOnType?: NullableStringFieldUpdateOperationsInput | string | null
    dependsOnId?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    lastErrorTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncOutboxCreateManyInput = {
    id?: string
    entityType: string
    entityId: string
    action: string
    payload: string
    status?: string
    errorMsg?: string | null
    storeId: string
    dependsOnType?: string | null
    dependsOnId?: string | null
    retryCount?: number
    lastErrorTime?: Date | string | null
    syncedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SyncOutboxUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMsg?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    dependsOnType?: NullableStringFieldUpdateOperationsInput | string | null
    dependsOnId?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    lastErrorTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncOutboxUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMsg?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    dependsOnType?: NullableStringFieldUpdateOperationsInput | string | null
    dependsOnId?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    lastErrorTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentSequenceCreateInput = {
    id?: string
    cloudId?: string | null
    companyCode: string
    storeCode: string
    documentType?: string
    seriesYear: string
    versionCode?: string
    seriesCode: string
    currentSequence?: number
    lastDocumentNo?: number
    isClosed?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentSequenceUncheckedCreateInput = {
    id?: string
    cloudId?: string | null
    companyCode: string
    storeCode: string
    documentType?: string
    seriesYear: string
    versionCode?: string
    seriesCode: string
    currentSequence?: number
    lastDocumentNo?: number
    isClosed?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentSequenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    companyCode?: StringFieldUpdateOperationsInput | string
    storeCode?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    versionCode?: StringFieldUpdateOperationsInput | string
    seriesCode?: StringFieldUpdateOperationsInput | string
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: IntFieldUpdateOperationsInput | number
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentSequenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    companyCode?: StringFieldUpdateOperationsInput | string
    storeCode?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    versionCode?: StringFieldUpdateOperationsInput | string
    seriesCode?: StringFieldUpdateOperationsInput | string
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: IntFieldUpdateOperationsInput | number
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentSequenceCreateManyInput = {
    id?: string
    cloudId?: string | null
    companyCode: string
    storeCode: string
    documentType?: string
    seriesYear: string
    versionCode?: string
    seriesCode: string
    currentSequence?: number
    lastDocumentNo?: number
    isClosed?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentSequenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    companyCode?: StringFieldUpdateOperationsInput | string
    storeCode?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    versionCode?: StringFieldUpdateOperationsInput | string
    seriesCode?: StringFieldUpdateOperationsInput | string
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: IntFieldUpdateOperationsInput | number
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentSequenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    companyCode?: StringFieldUpdateOperationsInput | string
    storeCode?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    versionCode?: StringFieldUpdateOperationsInput | string
    seriesCode?: StringFieldUpdateOperationsInput | string
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: IntFieldUpdateOperationsInput | number
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgtSeriesCreateInput = {
    id?: string
    seriesCode?: string | null
    documentType: string
    seriesYear: string
    companyId: string
    establishmentNumber: string
    storeId?: string | null
    currentSequence?: number
    lastDocumentNo?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgtSeriesUncheckedCreateInput = {
    id?: string
    seriesCode?: string | null
    documentType: string
    seriesYear: string
    companyId: string
    establishmentNumber: string
    storeId?: string | null
    currentSequence?: number
    lastDocumentNo?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgtSeriesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesCode?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    establishmentNumber?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgtSeriesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesCode?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    establishmentNumber?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgtSeriesCreateManyInput = {
    id?: string
    seriesCode?: string | null
    documentType: string
    seriesYear: string
    companyId: string
    establishmentNumber: string
    storeId?: string | null
    currentSequence?: number
    lastDocumentNo?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgtSeriesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesCode?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    establishmentNumber?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgtSeriesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesCode?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: StringFieldUpdateOperationsInput | string
    seriesYear?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    establishmentNumber?: StringFieldUpdateOperationsInput | string
    storeId?: NullableStringFieldUpdateOperationsInput | string | null
    currentSequence?: IntFieldUpdateOperationsInput | number
    lastDocumentNo?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    isActive?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    isActive?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    isActive?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SettingsCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    hardwareId?: SortOrder
    offlineLicense?: SortOrder
    lastSync?: SortOrder
    lastOperationTime?: SortOrder
    lastFraudAttempt?: SortOrder
    fraudAttemptCount?: SortOrder
    terminalMode?: SortOrder
    masterIp?: SortOrder
    lanSecret?: SortOrder
  }

  export type SettingsAvgOrderByAggregateInput = {
    fraudAttemptCount?: SortOrder
  }

  export type SettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    hardwareId?: SortOrder
    offlineLicense?: SortOrder
    lastSync?: SortOrder
    lastOperationTime?: SortOrder
    lastFraudAttempt?: SortOrder
    fraudAttemptCount?: SortOrder
    terminalMode?: SortOrder
    masterIp?: SortOrder
    lanSecret?: SortOrder
  }

  export type SettingsMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    hardwareId?: SortOrder
    offlineLicense?: SortOrder
    lastSync?: SortOrder
    lastOperationTime?: SortOrder
    lastFraudAttempt?: SortOrder
    fraudAttemptCount?: SortOrder
    terminalMode?: SortOrder
    masterIp?: SortOrder
    lanSecret?: SortOrder
  }

  export type SettingsSumOrderByAggregateInput = {
    fraudAttemptCount?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    offlineId?: SortOrder
    name?: SortOrder
    taxNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    offlineId?: SortOrder
    name?: SortOrder
    taxNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    offlineId?: SortOrder
    name?: SortOrder
    taxNumber?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemListRelationFilter = {
    every?: ItemWhereInput
    some?: ItemWhereInput
    none?: ItemWhereInput
  }

  export type ItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CategoryNullableRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type InvoiceLineListRelationFilter = {
    every?: InvoiceLineWhereInput
    some?: InvoiceLineWhereInput
    none?: InvoiceLineWhereInput
  }

  export type InvoiceLineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItemCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
    barcode?: SortOrder
    categoryId?: SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemAvgOrderByAggregateInput = {
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
  }

  export type ItemMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
    barcode?: SortOrder
    categoryId?: SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
    barcode?: SortOrder
    categoryId?: SortOrder
    storeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemSumOrderByAggregateInput = {
    price?: SortOrder
    taxPercent?: SortOrder
    stock?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ClientNullableRelationFilter = {
    is?: ClientWhereInput | null
    isNot?: ClientWhereInput | null
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    localNo?: SortOrder
    agtNo?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
    hash?: SortOrder
    hashControl?: SortOrder
    userId?: SortOrder
    clientId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    localNo?: SortOrder
    agtNo?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
    hash?: SortOrder
    hashControl?: SortOrder
    userId?: SortOrder
    clientId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    localNo?: SortOrder
    agtNo?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
    hash?: SortOrder
    hashControl?: SortOrder
    userId?: SortOrder
    clientId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    netTotal?: SortOrder
    taxTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type InvoiceRelationFilter = {
    is?: InvoiceWhereInput
    isNot?: InvoiceWhereInput
  }

  export type ItemRelationFilter = {
    is?: ItemWhereInput
    isNot?: ItemWhereInput
  }

  export type InvoiceLineCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type InvoiceLineAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type InvoiceLineMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type InvoiceLineMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type InvoiceLineSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    taxPercent?: SortOrder
    discount?: SortOrder
    netTotal?: SortOrder
    grossTotal?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type CashMovementListRelationFilter = {
    every?: CashMovementWhereInput
    some?: CashMovementWhereInput
    none?: CashMovementWhereInput
  }

  export type CashMovementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CashSessionCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    openingDate?: SortOrder
    closingDate?: SortOrder
    openingBalance?: SortOrder
    closingBalance?: SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CashSessionAvgOrderByAggregateInput = {
    openingBalance?: SortOrder
    closingBalance?: SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
  }

  export type CashSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    openingDate?: SortOrder
    closingDate?: SortOrder
    openingBalance?: SortOrder
    closingBalance?: SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CashSessionMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    openingDate?: SortOrder
    closingDate?: SortOrder
    openingBalance?: SortOrder
    closingBalance?: SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CashSessionSumOrderByAggregateInput = {
    openingBalance?: SortOrder
    closingBalance?: SortOrder
    totalSales?: SortOrder
    totalExpenses?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type CashSessionRelationFilter = {
    is?: CashSessionWhereInput
    isNot?: CashSessionWhereInput
  }

  export type CashMovementCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    cashSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CashMovementAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type CashMovementMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    cashSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CashMovementMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    cashSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CashMovementSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type SyncOutboxCountOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    errorMsg?: SortOrder
    storeId?: SortOrder
    dependsOnType?: SortOrder
    dependsOnId?: SortOrder
    retryCount?: SortOrder
    lastErrorTime?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncOutboxAvgOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type SyncOutboxMaxOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    errorMsg?: SortOrder
    storeId?: SortOrder
    dependsOnType?: SortOrder
    dependsOnId?: SortOrder
    retryCount?: SortOrder
    lastErrorTime?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncOutboxMinOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    errorMsg?: SortOrder
    storeId?: SortOrder
    dependsOnType?: SortOrder
    dependsOnId?: SortOrder
    retryCount?: SortOrder
    lastErrorTime?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncOutboxSumOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type DocumentSequenceCompanyCodeStoreCodeDocumentTypeSeriesYearVersionCodeCompoundUniqueInput = {
    companyCode: string
    storeCode: string
    documentType: string
    seriesYear: string
    versionCode: string
  }

  export type DocumentSequenceCountOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    companyCode?: SortOrder
    storeCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    versionCode?: SortOrder
    seriesCode?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isClosed?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSequenceAvgOrderByAggregateInput = {
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
  }

  export type DocumentSequenceMaxOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    companyCode?: SortOrder
    storeCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    versionCode?: SortOrder
    seriesCode?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isClosed?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSequenceMinOrderByAggregateInput = {
    id?: SortOrder
    cloudId?: SortOrder
    companyCode?: SortOrder
    storeCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    versionCode?: SortOrder
    seriesCode?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isClosed?: SortOrder
    storeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSequenceSumOrderByAggregateInput = {
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
  }

  export type AgtSeriesAgtSeries_documentType_seriesYear_companyId_establishmentNumber_keyCompoundUniqueInput = {
    documentType: string
    seriesYear: string
    companyId: string
    establishmentNumber: string
  }

  export type AgtSeriesCountOrderByAggregateInput = {
    id?: SortOrder
    seriesCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    companyId?: SortOrder
    establishmentNumber?: SortOrder
    storeId?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgtSeriesAvgOrderByAggregateInput = {
    currentSequence?: SortOrder
  }

  export type AgtSeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    seriesCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    companyId?: SortOrder
    establishmentNumber?: SortOrder
    storeId?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgtSeriesMinOrderByAggregateInput = {
    id?: SortOrder
    seriesCode?: SortOrder
    documentType?: SortOrder
    seriesYear?: SortOrder
    companyId?: SortOrder
    establishmentNumber?: SortOrder
    storeId?: SortOrder
    currentSequence?: SortOrder
    lastDocumentNo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgtSeriesSumOrderByAggregateInput = {
    currentSequence?: SortOrder
  }

  export type InvoiceCreateNestedManyWithoutUserInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InvoiceUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutUserInput | InvoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutUserInput | InvoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutUserInput | InvoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutUserInput | InvoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutUserInput | InvoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutUserInput | InvoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InvoiceCreateNestedManyWithoutClientInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type InvoiceUpdateManyWithoutClientNestedInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutClientInput | InvoiceUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutClientInput | InvoiceUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutClientInput | InvoiceUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutClientInput | InvoiceUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutClientInput | InvoiceUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutClientInput | InvoiceUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type ItemCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ItemCreateWithoutCategoryInput, ItemUncheckedCreateWithoutCategoryInput> | ItemCreateWithoutCategoryInput[] | ItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCategoryInput | ItemCreateOrConnectWithoutCategoryInput[]
    createMany?: ItemCreateManyCategoryInputEnvelope
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
  }

  export type ItemUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ItemCreateWithoutCategoryInput, ItemUncheckedCreateWithoutCategoryInput> | ItemCreateWithoutCategoryInput[] | ItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCategoryInput | ItemCreateOrConnectWithoutCategoryInput[]
    createMany?: ItemCreateManyCategoryInputEnvelope
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
  }

  export type ItemUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ItemCreateWithoutCategoryInput, ItemUncheckedCreateWithoutCategoryInput> | ItemCreateWithoutCategoryInput[] | ItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCategoryInput | ItemCreateOrConnectWithoutCategoryInput[]
    upsert?: ItemUpsertWithWhereUniqueWithoutCategoryInput | ItemUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ItemCreateManyCategoryInputEnvelope
    set?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    disconnect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    delete?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    update?: ItemUpdateWithWhereUniqueWithoutCategoryInput | ItemUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ItemUpdateManyWithWhereWithoutCategoryInput | ItemUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ItemScalarWhereInput | ItemScalarWhereInput[]
  }

  export type ItemUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ItemCreateWithoutCategoryInput, ItemUncheckedCreateWithoutCategoryInput> | ItemCreateWithoutCategoryInput[] | ItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCategoryInput | ItemCreateOrConnectWithoutCategoryInput[]
    upsert?: ItemUpsertWithWhereUniqueWithoutCategoryInput | ItemUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ItemCreateManyCategoryInputEnvelope
    set?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    disconnect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    delete?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    update?: ItemUpdateWithWhereUniqueWithoutCategoryInput | ItemUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ItemUpdateManyWithWhereWithoutCategoryInput | ItemUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ItemScalarWhereInput | ItemScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutItemsInput = {
    create?: XOR<CategoryCreateWithoutItemsInput, CategoryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutItemsInput
    connect?: CategoryWhereUniqueInput
  }

  export type InvoiceLineCreateNestedManyWithoutItemInput = {
    create?: XOR<InvoiceLineCreateWithoutItemInput, InvoiceLineUncheckedCreateWithoutItemInput> | InvoiceLineCreateWithoutItemInput[] | InvoiceLineUncheckedCreateWithoutItemInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutItemInput | InvoiceLineCreateOrConnectWithoutItemInput[]
    createMany?: InvoiceLineCreateManyItemInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type InvoiceLineUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<InvoiceLineCreateWithoutItemInput, InvoiceLineUncheckedCreateWithoutItemInput> | InvoiceLineCreateWithoutItemInput[] | InvoiceLineUncheckedCreateWithoutItemInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutItemInput | InvoiceLineCreateOrConnectWithoutItemInput[]
    createMany?: InvoiceLineCreateManyItemInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryUpdateOneWithoutItemsNestedInput = {
    create?: XOR<CategoryCreateWithoutItemsInput, CategoryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutItemsInput
    upsert?: CategoryUpsertWithoutItemsInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutItemsInput, CategoryUpdateWithoutItemsInput>, CategoryUncheckedUpdateWithoutItemsInput>
  }

  export type InvoiceLineUpdateManyWithoutItemNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutItemInput, InvoiceLineUncheckedCreateWithoutItemInput> | InvoiceLineCreateWithoutItemInput[] | InvoiceLineUncheckedCreateWithoutItemInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutItemInput | InvoiceLineCreateOrConnectWithoutItemInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutItemInput | InvoiceLineUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: InvoiceLineCreateManyItemInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutItemInput | InvoiceLineUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutItemInput | InvoiceLineUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type InvoiceLineUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutItemInput, InvoiceLineUncheckedCreateWithoutItemInput> | InvoiceLineCreateWithoutItemInput[] | InvoiceLineUncheckedCreateWithoutItemInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutItemInput | InvoiceLineCreateOrConnectWithoutItemInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutItemInput | InvoiceLineUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: InvoiceLineCreateManyItemInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutItemInput | InvoiceLineUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutItemInput | InvoiceLineUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoicesInput
    connect?: UserWhereUniqueInput
  }

  export type ClientCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutInvoicesInput
    connect?: ClientWhereUniqueInput
  }

  export type InvoiceLineCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoicesInput
    upsert?: UserUpsertWithoutInvoicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInvoicesInput, UserUpdateWithoutInvoicesInput>, UserUncheckedUpdateWithoutInvoicesInput>
  }

  export type ClientUpdateOneWithoutInvoicesNestedInput = {
    create?: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutInvoicesInput
    upsert?: ClientUpsertWithoutInvoicesInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutInvoicesInput, ClientUpdateWithoutInvoicesInput>, ClientUncheckedUpdateWithoutInvoicesInput>
  }

  export type InvoiceLineUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type InvoiceCreateNestedOneWithoutLinesInput = {
    create?: XOR<InvoiceCreateWithoutLinesInput, InvoiceUncheckedCreateWithoutLinesInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLinesInput
    connect?: InvoiceWhereUniqueInput
  }

  export type ItemCreateNestedOneWithoutInvoiceLinesInput = {
    create?: XOR<ItemCreateWithoutInvoiceLinesInput, ItemUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: ItemCreateOrConnectWithoutInvoiceLinesInput
    connect?: ItemWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<InvoiceCreateWithoutLinesInput, InvoiceUncheckedCreateWithoutLinesInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLinesInput
    upsert?: InvoiceUpsertWithoutLinesInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutLinesInput, InvoiceUpdateWithoutLinesInput>, InvoiceUncheckedUpdateWithoutLinesInput>
  }

  export type ItemUpdateOneRequiredWithoutInvoiceLinesNestedInput = {
    create?: XOR<ItemCreateWithoutInvoiceLinesInput, ItemUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: ItemCreateOrConnectWithoutInvoiceLinesInput
    upsert?: ItemUpsertWithoutInvoiceLinesInput
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutInvoiceLinesInput, ItemUpdateWithoutInvoiceLinesInput>, ItemUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type CashMovementCreateNestedManyWithoutCashSessionInput = {
    create?: XOR<CashMovementCreateWithoutCashSessionInput, CashMovementUncheckedCreateWithoutCashSessionInput> | CashMovementCreateWithoutCashSessionInput[] | CashMovementUncheckedCreateWithoutCashSessionInput[]
    connectOrCreate?: CashMovementCreateOrConnectWithoutCashSessionInput | CashMovementCreateOrConnectWithoutCashSessionInput[]
    createMany?: CashMovementCreateManyCashSessionInputEnvelope
    connect?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
  }

  export type CashMovementUncheckedCreateNestedManyWithoutCashSessionInput = {
    create?: XOR<CashMovementCreateWithoutCashSessionInput, CashMovementUncheckedCreateWithoutCashSessionInput> | CashMovementCreateWithoutCashSessionInput[] | CashMovementUncheckedCreateWithoutCashSessionInput[]
    connectOrCreate?: CashMovementCreateOrConnectWithoutCashSessionInput | CashMovementCreateOrConnectWithoutCashSessionInput[]
    createMany?: CashMovementCreateManyCashSessionInputEnvelope
    connect?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CashMovementUpdateManyWithoutCashSessionNestedInput = {
    create?: XOR<CashMovementCreateWithoutCashSessionInput, CashMovementUncheckedCreateWithoutCashSessionInput> | CashMovementCreateWithoutCashSessionInput[] | CashMovementUncheckedCreateWithoutCashSessionInput[]
    connectOrCreate?: CashMovementCreateOrConnectWithoutCashSessionInput | CashMovementCreateOrConnectWithoutCashSessionInput[]
    upsert?: CashMovementUpsertWithWhereUniqueWithoutCashSessionInput | CashMovementUpsertWithWhereUniqueWithoutCashSessionInput[]
    createMany?: CashMovementCreateManyCashSessionInputEnvelope
    set?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    disconnect?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    delete?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    connect?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    update?: CashMovementUpdateWithWhereUniqueWithoutCashSessionInput | CashMovementUpdateWithWhereUniqueWithoutCashSessionInput[]
    updateMany?: CashMovementUpdateManyWithWhereWithoutCashSessionInput | CashMovementUpdateManyWithWhereWithoutCashSessionInput[]
    deleteMany?: CashMovementScalarWhereInput | CashMovementScalarWhereInput[]
  }

  export type CashMovementUncheckedUpdateManyWithoutCashSessionNestedInput = {
    create?: XOR<CashMovementCreateWithoutCashSessionInput, CashMovementUncheckedCreateWithoutCashSessionInput> | CashMovementCreateWithoutCashSessionInput[] | CashMovementUncheckedCreateWithoutCashSessionInput[]
    connectOrCreate?: CashMovementCreateOrConnectWithoutCashSessionInput | CashMovementCreateOrConnectWithoutCashSessionInput[]
    upsert?: CashMovementUpsertWithWhereUniqueWithoutCashSessionInput | CashMovementUpsertWithWhereUniqueWithoutCashSessionInput[]
    createMany?: CashMovementCreateManyCashSessionInputEnvelope
    set?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    disconnect?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    delete?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    connect?: CashMovementWhereUniqueInput | CashMovementWhereUniqueInput[]
    update?: CashMovementUpdateWithWhereUniqueWithoutCashSessionInput | CashMovementUpdateWithWhereUniqueWithoutCashSessionInput[]
    updateMany?: CashMovementUpdateManyWithWhereWithoutCashSessionInput | CashMovementUpdateManyWithWhereWithoutCashSessionInput[]
    deleteMany?: CashMovementScalarWhereInput | CashMovementScalarWhereInput[]
  }

  export type CashSessionCreateNestedOneWithoutMovementsInput = {
    create?: XOR<CashSessionCreateWithoutMovementsInput, CashSessionUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: CashSessionCreateOrConnectWithoutMovementsInput
    connect?: CashSessionWhereUniqueInput
  }

  export type CashSessionUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: XOR<CashSessionCreateWithoutMovementsInput, CashSessionUncheckedCreateWithoutMovementsInput>
    connectOrCreate?: CashSessionCreateOrConnectWithoutMovementsInput
    upsert?: CashSessionUpsertWithoutMovementsInput
    connect?: CashSessionWhereUniqueInput
    update?: XOR<XOR<CashSessionUpdateToOneWithWhereWithoutMovementsInput, CashSessionUpdateWithoutMovementsInput>, CashSessionUncheckedUpdateWithoutMovementsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type InvoiceCreateWithoutUserInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    client?: ClientCreateNestedOneWithoutInvoicesInput
    lines?: InvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutUserInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    clientId?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput>
  }

  export type InvoiceCreateManyUserInputEnvelope = {
    data: InvoiceCreateManyUserInput | InvoiceCreateManyUserInput[]
  }

  export type InvoiceUpsertWithWhereUniqueWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutUserInput, InvoiceUncheckedUpdateWithoutUserInput>
    create: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutUserInput, InvoiceUncheckedUpdateWithoutUserInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutUserInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutUserInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    localNo?: StringFilter<"Invoice"> | string
    agtNo?: StringNullableFilter<"Invoice"> | string | null
    status?: StringFilter<"Invoice"> | string
    issueDate?: DateTimeFilter<"Invoice"> | Date | string
    netTotal?: FloatFilter<"Invoice"> | number
    taxTotal?: FloatFilter<"Invoice"> | number
    grossTotal?: FloatFilter<"Invoice"> | number
    hash?: StringNullableFilter<"Invoice"> | string | null
    hashControl?: StringNullableFilter<"Invoice"> | string | null
    userId?: StringFilter<"Invoice"> | string
    clientId?: StringNullableFilter<"Invoice"> | string | null
    storeId?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
  }

  export type InvoiceCreateWithoutClientInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutInvoicesInput
    lines?: InvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutClientInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutClientInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput>
  }

  export type InvoiceCreateManyClientInputEnvelope = {
    data: InvoiceCreateManyClientInput | InvoiceCreateManyClientInput[]
  }

  export type InvoiceUpsertWithWhereUniqueWithoutClientInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutClientInput, InvoiceUncheckedUpdateWithoutClientInput>
    create: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutClientInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutClientInput, InvoiceUncheckedUpdateWithoutClientInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutClientInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutClientInput>
  }

  export type ItemCreateWithoutCategoryInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineCreateNestedManyWithoutItemInput
  }

  export type ItemUncheckedCreateWithoutCategoryInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemCreateOrConnectWithoutCategoryInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutCategoryInput, ItemUncheckedCreateWithoutCategoryInput>
  }

  export type ItemCreateManyCategoryInputEnvelope = {
    data: ItemCreateManyCategoryInput | ItemCreateManyCategoryInput[]
  }

  export type ItemUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ItemWhereUniqueInput
    update: XOR<ItemUpdateWithoutCategoryInput, ItemUncheckedUpdateWithoutCategoryInput>
    create: XOR<ItemCreateWithoutCategoryInput, ItemUncheckedCreateWithoutCategoryInput>
  }

  export type ItemUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ItemWhereUniqueInput
    data: XOR<ItemUpdateWithoutCategoryInput, ItemUncheckedUpdateWithoutCategoryInput>
  }

  export type ItemUpdateManyWithWhereWithoutCategoryInput = {
    where: ItemScalarWhereInput
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyWithoutCategoryInput>
  }

  export type ItemScalarWhereInput = {
    AND?: ItemScalarWhereInput | ItemScalarWhereInput[]
    OR?: ItemScalarWhereInput[]
    NOT?: ItemScalarWhereInput | ItemScalarWhereInput[]
    id?: StringFilter<"Item"> | string
    cloudId?: StringNullableFilter<"Item"> | string | null
    code?: StringNullableFilter<"Item"> | string | null
    name?: StringFilter<"Item"> | string
    description?: StringNullableFilter<"Item"> | string | null
    price?: FloatFilter<"Item"> | number
    taxPercent?: FloatFilter<"Item"> | number
    stock?: FloatFilter<"Item"> | number
    barcode?: StringNullableFilter<"Item"> | string | null
    categoryId?: StringNullableFilter<"Item"> | string | null
    storeId?: StringFilter<"Item"> | string
    isActive?: BoolFilter<"Item"> | boolean
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
  }

  export type CategoryCreateWithoutItemsInput = {
    id?: string
    cloudId?: string | null
    name: string
    description?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateWithoutItemsInput = {
    id?: string
    cloudId?: string | null
    name: string
    description?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutItemsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutItemsInput, CategoryUncheckedCreateWithoutItemsInput>
  }

  export type InvoiceLineCreateWithoutItemInput = {
    id?: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
    invoice: InvoiceCreateNestedOneWithoutLinesInput
  }

  export type InvoiceLineUncheckedCreateWithoutItemInput = {
    id?: string
    invoiceId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
  }

  export type InvoiceLineCreateOrConnectWithoutItemInput = {
    where: InvoiceLineWhereUniqueInput
    create: XOR<InvoiceLineCreateWithoutItemInput, InvoiceLineUncheckedCreateWithoutItemInput>
  }

  export type InvoiceLineCreateManyItemInputEnvelope = {
    data: InvoiceLineCreateManyItemInput | InvoiceLineCreateManyItemInput[]
  }

  export type CategoryUpsertWithoutItemsInput = {
    update: XOR<CategoryUpdateWithoutItemsInput, CategoryUncheckedUpdateWithoutItemsInput>
    create: XOR<CategoryCreateWithoutItemsInput, CategoryUncheckedCreateWithoutItemsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutItemsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutItemsInput, CategoryUncheckedUpdateWithoutItemsInput>
  }

  export type CategoryUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineUpsertWithWhereUniqueWithoutItemInput = {
    where: InvoiceLineWhereUniqueInput
    update: XOR<InvoiceLineUpdateWithoutItemInput, InvoiceLineUncheckedUpdateWithoutItemInput>
    create: XOR<InvoiceLineCreateWithoutItemInput, InvoiceLineUncheckedCreateWithoutItemInput>
  }

  export type InvoiceLineUpdateWithWhereUniqueWithoutItemInput = {
    where: InvoiceLineWhereUniqueInput
    data: XOR<InvoiceLineUpdateWithoutItemInput, InvoiceLineUncheckedUpdateWithoutItemInput>
  }

  export type InvoiceLineUpdateManyWithWhereWithoutItemInput = {
    where: InvoiceLineScalarWhereInput
    data: XOR<InvoiceLineUpdateManyMutationInput, InvoiceLineUncheckedUpdateManyWithoutItemInput>
  }

  export type InvoiceLineScalarWhereInput = {
    AND?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
    OR?: InvoiceLineScalarWhereInput[]
    NOT?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
    id?: StringFilter<"InvoiceLine"> | string
    invoiceId?: StringFilter<"InvoiceLine"> | string
    itemId?: StringFilter<"InvoiceLine"> | string
    quantity?: FloatFilter<"InvoiceLine"> | number
    unitPrice?: FloatFilter<"InvoiceLine"> | number
    taxPercent?: FloatFilter<"InvoiceLine"> | number
    discount?: FloatFilter<"InvoiceLine"> | number
    netTotal?: FloatFilter<"InvoiceLine"> | number
    grossTotal?: FloatFilter<"InvoiceLine"> | number
  }

  export type UserCreateWithoutInvoicesInput = {
    id?: string
    cloudId?: string | null
    name: string
    email: string
    role: string
    password?: string | null
    isActive?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutInvoicesInput = {
    id?: string
    cloudId?: string | null
    name: string
    email: string
    role: string
    password?: string | null
    isActive?: boolean
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutInvoicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
  }

  export type ClientCreateWithoutInvoicesInput = {
    id?: string
    cloudId?: string | null
    offlineId?: string | null
    name: string
    taxNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientUncheckedCreateWithoutInvoicesInput = {
    id?: string
    cloudId?: string | null
    offlineId?: string | null
    name: string
    taxNumber?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientCreateOrConnectWithoutInvoicesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
  }

  export type InvoiceLineCreateWithoutInvoiceInput = {
    id?: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
    item: ItemCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineUncheckedCreateWithoutInvoiceInput = {
    id?: string
    itemId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
  }

  export type InvoiceLineCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceLineWhereUniqueInput
    create: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineCreateManyInvoiceInputEnvelope = {
    data: InvoiceLineCreateManyInvoiceInput | InvoiceLineCreateManyInvoiceInput[]
  }

  export type UserUpsertWithoutInvoicesInput = {
    update: XOR<UserUpdateWithoutInvoicesInput, UserUncheckedUpdateWithoutInvoicesInput>
    create: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInvoicesInput, UserUncheckedUpdateWithoutInvoicesInput>
  }

  export type UserUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUpsertWithoutInvoicesInput = {
    update: XOR<ClientUpdateWithoutInvoicesInput, ClientUncheckedUpdateWithoutInvoicesInput>
    create: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutInvoicesInput, ClientUncheckedUpdateWithoutInvoicesInput>
  }

  export type ClientUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    offlineId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineWhereUniqueInput
    update: XOR<InvoiceLineUpdateWithoutInvoiceInput, InvoiceLineUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineWhereUniqueInput
    data: XOR<InvoiceLineUpdateWithoutInvoiceInput, InvoiceLineUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceLineUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceLineScalarWhereInput
    data: XOR<InvoiceLineUpdateManyMutationInput, InvoiceLineUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type InvoiceCreateWithoutLinesInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutInvoicesInput
    client?: ClientCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateWithoutLinesInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    userId: string
    clientId?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceCreateOrConnectWithoutLinesInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutLinesInput, InvoiceUncheckedCreateWithoutLinesInput>
  }

  export type ItemCreateWithoutInvoiceLinesInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: CategoryCreateNestedOneWithoutItemsInput
  }

  export type ItemUncheckedCreateWithoutInvoiceLinesInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    categoryId?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemCreateOrConnectWithoutInvoiceLinesInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutInvoiceLinesInput, ItemUncheckedCreateWithoutInvoiceLinesInput>
  }

  export type InvoiceUpsertWithoutLinesInput = {
    update: XOR<InvoiceUpdateWithoutLinesInput, InvoiceUncheckedUpdateWithoutLinesInput>
    create: XOR<InvoiceCreateWithoutLinesInput, InvoiceUncheckedCreateWithoutLinesInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutLinesInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutLinesInput, InvoiceUncheckedUpdateWithoutLinesInput>
  }

  export type InvoiceUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInvoicesNestedInput
    client?: ClientUpdateOneWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemUpsertWithoutInvoiceLinesInput = {
    update: XOR<ItemUpdateWithoutInvoiceLinesInput, ItemUncheckedUpdateWithoutInvoiceLinesInput>
    create: XOR<ItemCreateWithoutInvoiceLinesInput, ItemUncheckedCreateWithoutInvoiceLinesInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutInvoiceLinesInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutInvoiceLinesInput, ItemUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type ItemUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutItemsNestedInput
  }

  export type ItemUncheckedUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashMovementCreateWithoutCashSessionInput = {
    id?: string
    cloudId?: string | null
    type: string
    description: string
    amount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashMovementUncheckedCreateWithoutCashSessionInput = {
    id?: string
    cloudId?: string | null
    type: string
    description: string
    amount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashMovementCreateOrConnectWithoutCashSessionInput = {
    where: CashMovementWhereUniqueInput
    create: XOR<CashMovementCreateWithoutCashSessionInput, CashMovementUncheckedCreateWithoutCashSessionInput>
  }

  export type CashMovementCreateManyCashSessionInputEnvelope = {
    data: CashMovementCreateManyCashSessionInput | CashMovementCreateManyCashSessionInput[]
  }

  export type CashMovementUpsertWithWhereUniqueWithoutCashSessionInput = {
    where: CashMovementWhereUniqueInput
    update: XOR<CashMovementUpdateWithoutCashSessionInput, CashMovementUncheckedUpdateWithoutCashSessionInput>
    create: XOR<CashMovementCreateWithoutCashSessionInput, CashMovementUncheckedCreateWithoutCashSessionInput>
  }

  export type CashMovementUpdateWithWhereUniqueWithoutCashSessionInput = {
    where: CashMovementWhereUniqueInput
    data: XOR<CashMovementUpdateWithoutCashSessionInput, CashMovementUncheckedUpdateWithoutCashSessionInput>
  }

  export type CashMovementUpdateManyWithWhereWithoutCashSessionInput = {
    where: CashMovementScalarWhereInput
    data: XOR<CashMovementUpdateManyMutationInput, CashMovementUncheckedUpdateManyWithoutCashSessionInput>
  }

  export type CashMovementScalarWhereInput = {
    AND?: CashMovementScalarWhereInput | CashMovementScalarWhereInput[]
    OR?: CashMovementScalarWhereInput[]
    NOT?: CashMovementScalarWhereInput | CashMovementScalarWhereInput[]
    id?: StringFilter<"CashMovement"> | string
    cloudId?: StringNullableFilter<"CashMovement"> | string | null
    type?: StringFilter<"CashMovement"> | string
    description?: StringFilter<"CashMovement"> | string
    amount?: FloatFilter<"CashMovement"> | number
    cashSessionId?: StringFilter<"CashMovement"> | string
    createdAt?: DateTimeFilter<"CashMovement"> | Date | string
    updatedAt?: DateTimeFilter<"CashMovement"> | Date | string
  }

  export type CashSessionCreateWithoutMovementsInput = {
    id?: string
    cloudId?: string | null
    openingDate?: Date | string
    closingDate?: Date | string | null
    openingBalance: number
    closingBalance?: number | null
    totalSales?: number
    totalExpenses?: number
    status?: string
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashSessionUncheckedCreateWithoutMovementsInput = {
    id?: string
    cloudId?: string | null
    openingDate?: Date | string
    closingDate?: Date | string | null
    openingBalance: number
    closingBalance?: number | null
    totalSales?: number
    totalExpenses?: number
    status?: string
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashSessionCreateOrConnectWithoutMovementsInput = {
    where: CashSessionWhereUniqueInput
    create: XOR<CashSessionCreateWithoutMovementsInput, CashSessionUncheckedCreateWithoutMovementsInput>
  }

  export type CashSessionUpsertWithoutMovementsInput = {
    update: XOR<CashSessionUpdateWithoutMovementsInput, CashSessionUncheckedUpdateWithoutMovementsInput>
    create: XOR<CashSessionCreateWithoutMovementsInput, CashSessionUncheckedCreateWithoutMovementsInput>
    where?: CashSessionWhereInput
  }

  export type CashSessionUpdateToOneWithWhereWithoutMovementsInput = {
    where?: CashSessionWhereInput
    data: XOR<CashSessionUpdateWithoutMovementsInput, CashSessionUncheckedUpdateWithoutMovementsInput>
  }

  export type CashSessionUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    openingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    closingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openingBalance?: FloatFieldUpdateOperationsInput | number
    closingBalance?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSales?: FloatFieldUpdateOperationsInput | number
    totalExpenses?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashSessionUncheckedUpdateWithoutMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    openingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    closingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openingBalance?: FloatFieldUpdateOperationsInput | number
    closingBalance?: NullableFloatFieldUpdateOperationsInput | number | null
    totalSales?: FloatFieldUpdateOperationsInput | number
    totalExpenses?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyUserInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    clientId?: string | null
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneWithoutInvoicesNestedInput
    lines?: InvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyClientInput = {
    id?: string
    localNo: string
    agtNo?: string | null
    status?: string
    issueDate?: Date | string
    netTotal: number
    taxTotal: number
    grossTotal: number
    hash?: string | null
    hashControl?: string | null
    userId: string
    storeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInvoicesNestedInput
    lines?: InvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    localNo?: StringFieldUpdateOperationsInput | string
    agtNo?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    netTotal?: FloatFieldUpdateOperationsInput | number
    taxTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    hash?: NullableStringFieldUpdateOperationsInput | string | null
    hashControl?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemCreateManyCategoryInput = {
    id?: string
    cloudId?: string | null
    code?: string | null
    name: string
    description?: string | null
    price: number
    taxPercent?: number
    stock?: number
    barcode?: string | null
    storeId: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUncheckedUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    stock?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineCreateManyItemInput = {
    id?: string
    invoiceId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
  }

  export type InvoiceLineUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    invoice?: InvoiceUpdateOneRequiredWithoutLinesNestedInput
  }

  export type InvoiceLineUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineCreateManyInvoiceInput = {
    id?: string
    itemId: string
    quantity: number
    unitPrice: number
    taxPercent: number
    discount?: number
    netTotal: number
    grossTotal: number
  }

  export type InvoiceLineUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
    item?: ItemUpdateOneRequiredWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type InvoiceLineUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: FloatFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    taxPercent?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    netTotal?: FloatFieldUpdateOperationsInput | number
    grossTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type CashMovementCreateManyCashSessionInput = {
    id?: string
    cloudId?: string | null
    type: string
    description: string
    amount: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CashMovementUpdateWithoutCashSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashMovementUncheckedUpdateWithoutCashSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CashMovementUncheckedUpdateManyWithoutCashSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    cloudId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientCountOutputTypeDefaultArgs instead
     */
    export type ClientCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryCountOutputTypeDefaultArgs instead
     */
    export type CategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemCountOutputTypeDefaultArgs instead
     */
    export type ItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceCountOutputTypeDefaultArgs instead
     */
    export type InvoiceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CashSessionCountOutputTypeDefaultArgs instead
     */
    export type CashSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CashSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SettingsDefaultArgs instead
     */
    export type SettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SettingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientDefaultArgs instead
     */
    export type ClientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryDefaultArgs instead
     */
    export type CategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemDefaultArgs instead
     */
    export type ItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceDefaultArgs instead
     */
    export type InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceLineDefaultArgs instead
     */
    export type InvoiceLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CashSessionDefaultArgs instead
     */
    export type CashSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CashSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CashMovementDefaultArgs instead
     */
    export type CashMovementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CashMovementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SyncOutboxDefaultArgs instead
     */
    export type SyncOutboxArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SyncOutboxDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentSequenceDefaultArgs instead
     */
    export type DocumentSequenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentSequenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgtSeriesDefaultArgs instead
     */
    export type AgtSeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgtSeriesDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}