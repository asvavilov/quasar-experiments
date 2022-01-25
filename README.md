## todo/fixme
...

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Build the app for production
```bash
quasar build
```

Открытие проекта в Android Studio (путь к которой указан в quasar.conf.js в linuxAndroidStudio).
Запуск сборки вручную из Android Studio, после ее открытия.
```bash
quasar build --mode android --target android --ide
```

Отсюда же можно запускать отладку.

"--ide" можно запускать и с quasar dev, в этом случае будет висеть процесс и в chrome в remote devices будет нормальная dev-версия для отладки

"--devtools" открывает Vue Devtools

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## sqlite
1. установить плагин (например, cordova-sqlite-storage отсюда https://github.com/storesafe/cordova-sqlite-storage (см. варианты https://cordova.apache.org/docs/en/latest/cordova/storage/storage.html#sqlite-plugin))
UPD этот поддерживает подключение базы с указанием пути: https://github.com/storesafe/cordova-sqlite-evcore-extbuild-free
2. для использования в typescript объявить types в каком-нибудь доступном *.d.ts (например, можно взять отсюда @types/cordova-sqlite-storage)

## свои плагины
plugman: после создания плагина формируется неправильные неймспейсы, нужно проверять plugin.xml и исходные java-файлы и задавать правильно

при изменении кода плагина, требуется переустановка:
```bash
plugman uninstall --platform android --project platforms/android --plugin ../MyPlugin/
plugman install --platform android --project platforms/android --plugin ../MyPlugin/
```
еще плагины можно устанавливать прямо с гитхаба
