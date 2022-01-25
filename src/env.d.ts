declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}


declare namespace MyPlugin {
  type success = (msg:string) => void;
  type error = (err:string) => void;
  interface MyImpl {
    coolMethod(arg0: string, success: success, error: error): void;
  }
}

interface CordovaPlugins {
  MyPlugin: MyPlugin.MyImpl
}


// для плагина cordova-plugin-tts
declare namespace TTS {
  interface IOptions {
      /** text to speak */
      text: string;
      /** a string like 'en-US', 'zh-CN', etc */
      locale?: string;
      /** speed rate, 0 ~ 1 */
      rate?: number;
      /** ambient(iOS) */
      category?: string;
  }

  function speak(options: IOptions): Promise<void>;
  function speak(text: string): Promise<void>;
  function stop(): Promise<void>;
  function checkLanguage(): Promise<string>;
  function openInstallTts(): Promise<void>;
}


// Type definitions for cordova-sqlite-storage 1.5
// Project: https://github.com/xpbrew/cordova-sqlite-storage
// Definitions by: rafw87 <https://github.com/rafw87>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface Window {
  sqlitePlugin: SQLitePlugin.SQLite;
}

declare var sqlitePlugin: SQLitePlugin.SQLite;

declare namespace SQLitePlugin {
  type TransactionFunction = (tx: Transaction) => void;

  type SuccessCallback = () => void;
  type DatabaseSuccessCallback = (db: Database) => void;
  type StatementSuccessCallback = (results: Results) => void;
  type TransactionStatementSuccessCallback = (tx: Transaction, results: Results) => void;

  type ErrorCallback = (err: Error) => void;
  type TransactionStatementErrorCallback = (tx: Transaction, err: Error) => boolean | void;

  interface OpenArgs {
      name: string;
      location?: string;
      iosDatabaseLocation?: string;
      androidDatabaseImplementation?: number;
      androidLockWorkaround?: number;
      createFromLocation?: number;
      [key: string]: any;
  }
  interface DeleteArgs {
      name: string;
      location?: string;
      iosDatabaseLocation?: string;
  }

  interface Results {
      rowsAffected: number;
      insertId?: number;
      rows: {
          length: number;
          item(i: number): any;
      };
  }

  interface Transaction {
      executeSql(statement: string, params?: any[], success?: TransactionStatementSuccessCallback, error?: TransactionStatementErrorCallback): void;
  }

  interface Database {
      transaction(fn: TransactionFunction, error?: ErrorCallback, success?: SuccessCallback): void;
      readTransaction(fn: TransactionFunction, error?: ErrorCallback, success?: SuccessCallback): void;

      executeSql(statement: string, params?: any[], success?: StatementSuccessCallback, error?: ErrorCallback): void;
      sqlBatch(sqlStatements: Array<string|[string, any[]]>, success?: SuccessCallback, error?: ErrorCallback): void;

      close(success?: SuccessCallback, error?: ErrorCallback): void;
  }

  interface SQLite {
      openDatabase(args: OpenArgs, success?: DatabaseSuccessCallback, error?: ErrorCallback): Database;
      deleteDatabase(args: DeleteArgs, success?: SuccessCallback, error?: ErrorCallback): void;
      selfTest(success?: SuccessCallback, error?: ErrorCallback): void;
      echoTest(ok?: (value: string) => void, error?: (msg: string) => void): void;
      myTest(ok?: (value: string) => void, error?: (msg: string) => void): void;
  }
}
