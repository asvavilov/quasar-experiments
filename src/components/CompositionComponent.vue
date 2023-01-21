<template>
  <div>

    <p>{{ title }}</p>
    <q-btn @click="btnClick()">Топчи сюда</q-btn>

    <p>debug:</p>
    <textarea style="width: 100%; height: 50vh;" readonly v-text="debug"></textarea>

    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Что-то всплыло</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{alertText}}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import { Platform } from 'quasar'
import {
  defineComponent, ref
} from 'vue';
import { getCordovaFile } from './mylib.js';

export default defineComponent({
  name: 'CompositionComponent',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    let debug = ref('');
    let alert = ref(false);
    let alertText = ref('');

    let log = (data:any, linesAfter = 1) => {
      debug.value += JSON.stringify(data) + ("\n".repeat(linesAfter));
    }

    let cordovaFile = Platform.is.cordova ? getCordovaFile() : false

    let readImport = async () => {
      // можно сразу подключать данные и искать по массиву или подгружать по частям
      const {mydata} = await import('./data.js');
      log(JSON.stringify(mydata));
      return mydata;
    }

    // примеры работы с indexedDB
    let testIndexedDB = (mydata: Array<any>) => {
      const rdb = indexedDB.open('mydb', 1);
      rdb.onerror = function(event) {
        console.log("indexedDB onerror");
      };
      rdb.onsuccess = function(event) {
        console.log("indexedDB onsuccess");
        //const db = event.target.result;
        const db = this.result;

        const transaction = db.transaction(['customers'], 'readonly');
        const objectStore = transaction.objectStore("customers");

        const request = objectStore.get("wolf");
        request.onerror = function(event) {
          // Handle errors!
        };
        request.onsuccess = function(event) {
          // Do something with the request.result!
          let res = request.result;
          console.log("finded by key " + res.name + ` (${res.email})`);
        };

        let index = objectStore.index("name");
        index.get("Чих-пых").onsuccess = function(event) {
          console.log("finded by index " + this.result.email);
        };

        objectStore.openCursor().onsuccess = function(event) {
          //var cursor = event.target.result;
          let cursor = this.result;
          if (cursor) {
            console.log("1 Name for " + cursor.key + " is " + cursor.value.name);
            cursor.continue();
          }
          else {
            console.log("1 No more entries!");
          }
        };

      };
      rdb.onupgradeneeded = function(event) {
        console.log("indexedDB onupgradeneeded");
        //const db = event.target.result;
        const db = this.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique.
        var objectStore = db.createObjectStore("customers", { keyPath: "key" });

        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore.createIndex("name", "name", { unique: false });

        // Create an index to search customers by email. We want to ensure that
        // no two customers have the same email, so use a unique index.
        objectStore.createIndex("email", "email", { unique: true });

        // Store values in the newly created objectStore.
        for (var i of mydata) {
          console.log(i)
          objectStore.add(i);
        }

      };
    }

    const testMyPlugin = () => {
      if (Platform.is.cordova)
      {
        cordova.plugins.MyPlugin.coolMethod("coolMethod", function(response){
          log('myplugin success: ' + response);
        }, function(error){
          log('myplugin error: ' + error);
        });
      }
    };

    // примеры работы с sqlite
    let testSqlite = () => {
      /*
      // TODO можно попробовать копировать из дистрибутива в нужное место (см. варианты - есть ли доступ)
      cordova fileplugin can copy over your files
      Android default location: cordova.file.applicationStorageDirectory+"databases/your_database_name"
      IOS location (with location:1 parameter) cordova.file.documentsDirectory+"your_database_name"
      */
/*
оригинал базы: public/test.db
$ sqlite3 test.db
sqlite> create table tbl1(one varchar(10), two smallint);
sqlite> insert into tbl1 values('hello!',10);
sqlite> insert into tbl1 values('goodbye', 20);
sqlite> select * from tbl1;
hello!|10
goodbye|20
sqlite>
sqlite> CREATE TABLE tbl2 (
   ...>   f1 varchar(30) primary key,
   ...>   f2 text,
   ...>   f3 real
   ...> );
*/


if (Platform.is.cordova)
{
  window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/test.db", fileEntry => {
    log('test.db: ' + (fileEntry.isFile ? 'Y' : 'N'))
    log('internal url: ' + fileEntry.toInternalURL())
    log('name: ' + fileEntry.name)
    log('fullPath: ' + fileEntry.fullPath)
    log('nativeURL: ' + fileEntry.nativeURL)
    log('url: ' + fileEntry.toURL())
    //log('myTest: ' + fileEntry.myTest)
  }, e => {
    log(`readfile code ${e.code}`);
  });
}


			if (window.sqlitePlugin)
			{
        log('sqlitePlugin');
/*
        window.sqlitePlugin.myTest(s => {
          log('success myTest: ' + s);
        }, () => {
          log(' errorCallback-myTest ')
        })
*/
				window.sqlitePlugin.echoTest((s) => {
					log(' successCallback-echoTest ' + s)
				}, () => {
					log(' errorCallback-echoTest ')
				});
				window.sqlitePlugin.selfTest(() => {
					log(' successCallback-selfTest ')
				}, () => {
					log(' errorCallback-selfTest ')
        });

        try
        {
          const db = window.sqlitePlugin.openDatabase({
            name: 'test.db',
            location: 'default',
            // FIXME судя по коду плагина, тут должно что-то стандартное их iosLocationMap или dblocations
            //       похоже, надо попробовать разобраться как менять код плагина
            //       или копировать файл в нужную папку (какая-то может быть доступна на запись)
            //       или написать свой простой плагин просто для чтения
            //       или наполнять базу из файла если в ней пусто (первый запуск или сброс данных)
            //androidDatabaseLocation: cordovaFile.applicationDirectory + "www/"
          }, (db) => {
            log('success open')
          }, (err) => {
            log('error open: ' + err.message)
          });
          /*db.transaction(function(tr) {
            log('transaction')
            tr.executeSql('SELECT upper(?) AS upperString', ['Test string'], function(tr, rs) {
              log('sql result: ' + rs.rows.item(0).upperString);
            });
          }, () => {
            log('error transaction')
          }, () => {
            log('success transaction')
          });*/
        }
        catch (dberr)
        {
          log(dberr)
        }

      }

    }

    function btnClick()
    {
      alertText.value = '';
      debug.value = '';

      log(Platform.is.cordova ? cordovaFile : 'not cordova');

      testMyPlugin();

      //const mydata = readImport();

      //testIndexedDB(mydata);

      testSqlite();

      //alert.value = true;
    }

    let texts: string[] = [
      'hello',
      'world'
    ];

    return { texts, btnClick, alert, alertText, debug };
  },
});
</script>
