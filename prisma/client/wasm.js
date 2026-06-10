
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
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

exports.Prisma.SettingsScalarFieldEnum = {
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

exports.Prisma.ClientScalarFieldEnum = {
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

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  cloudId: 'cloudId',
  name: 'name',
  description: 'description',
  storeId: 'storeId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemScalarFieldEnum = {
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

exports.Prisma.InvoiceScalarFieldEnum = {
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

exports.Prisma.InvoiceLineScalarFieldEnum = {
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

exports.Prisma.CashSessionScalarFieldEnum = {
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

exports.Prisma.CashMovementScalarFieldEnum = {
  id: 'id',
  cloudId: 'cloudId',
  type: 'type',
  description: 'description',
  amount: 'amount',
  cashSessionId: 'cashSessionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SyncOutboxScalarFieldEnum = {
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

exports.Prisma.DocumentSequenceScalarFieldEnum = {
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

exports.Prisma.AgtSeriesScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
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

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
