<template>
  <q-page padding>
    <p>{{title}}</p>

    <q-separator spaced inset />
    <div>
      <p>синтез речи</p>

      <q-select v-if="tts.voiceIds" v-model="tts.voiceId" :options="tts.voiceIds" label="Голос" />

      <q-input v-model="tts.text" label="Текст" />
      <q-btn color="white" text-color="black" label="Сказать" @click="tts.speak()" />
    </div>
    <q-separator spaced inset />

    <q-separator spaced inset />
    <div>
      <p>Web NFC</p>
      <p>
        Web NFC aims to provide sites the ability to read and write to NFC tags when
        they are brought in close proximity to the user’s device (usually 5-10 cm, 2-4
        inches). The current scope is limited to NDEF, a lightweight binary message
        format. Low-level I/O operations (e.g. ISO-DEP, NFC-A/B, NFC-F) and Host-based
        Card Emulation (HCE) are not supported within the current scope.
      </p>

      <button @click="scanButton()">Scan</button>
      <button @click="writeButton()">Write</button>

      <p>debug:</p>
      <textarea style="width: 100%; height: 50vh;" readonly v-text="debug"></textarea>
    </div>
    <q-separator spaced inset />

    <p><router-link to="/">back</router-link></p>
  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

let debug = ref('');
function log(data, linesAfter = 1)
{
  debug.value += JSON.stringify(data) + ("\n".repeat(linesAfter));
}

function initTTS()
{
  const tts = {};
  tts.text = ref('Привет!');

  if ('speechSynthesis' in self) // web
  {
    const synth = self.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance();
    // FIXME не сразу может инициализироваться, правильней отслеживать событие voiceschanged
    tts.voices = synth.getVoices().filter(v => v.lang === 'ru-RU');

    tts.voiceIds = tts.voices.map((v, i) => ({
      label: v.name,
      value: i
    }));
    tts.voiceId = ref(tts.voiceIds.length === 1 ? tts.voiceIds[0] : null);

    watch(tts.voiceId, voiceId => {
      if (voiceId)
      {
        utterThis.voice = tts.voices[voiceId.value];
      }
    }, {immediate: true});
    watch(tts.text, text => {
      utterThis.text = text;
    }, {immediate: true});

    tts.speak = () => {
      synth.speak(utterThis);
    };
  }
  else if ('TTS' in self) // cordova
  {
    tts.speak = () => {
      TTS
        .speak({
          text: tts.text.value,
          locale: 'ru-RU',
          //rate: 0.75
        }).then(function () {
          //alert('success');
        }, function (reason) {
          //alert(reason);
        });
    };
  }

  return tts;
}

/*
// FIXME разобраться с правами на Web NFC
//       NDEFReader есть, но команды возвращают ошибку:
//       NotAllowedError: NFC permission request denied.
//       возможно, в этом проблема:
//       Web NFC is only available to top-level frames and secure browsing contexts (HTTPS only). Origins must first request the "nfc" permission while handling a user gesture (e.g a button click). The NDEFReader scan() and write() methods trigger a user prompt, if access was not previously granted.
// в config.xml в platform (по примерам из плагинов):
// было в двух плагинах:
<edit-config file="AndroidManifest.xml" mode="merge" target="/manifest/uses-permission" xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.NFC" />
    <uses-feature android:name="android.hardware.nfc" android:required="false" />
</edit-config>
// было в одном плагине:
<edit-config file="AndroidManifest.xml" mode="merge" target="/manifest/application/activity[@android:name='MainActivity']" xmlns:android="http://schemas.android.com/apk/res/android">
    <intent-filter>
        <action android:name="android.nfc.action.NDEF_DISCOVERED" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="application/$PACKAGE_NAME" />
    </intent-filter>
</edit-config>
*/
function initNFC()
{
  let nfc = {};

  nfc.support = ("NDEFReader" in window);
  if (!nfc.support)
  {
    log('Web NFC is not available. Please make sure the "Experimental Web Platform features" flag is enabled on Android.');
  }

  return nfc;
}
async function scanButton()
{
  log("User clicked scan button");

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    log("> Scan started");

    ndef.addEventListener("readingerror", () => {
      log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length})`);
    });
  } catch (error) {
    log("Argh! " + error);
  }
}
async function writeButton()
{
  log("User clicked write button");

  try {
    const ndef = new NDEFReader();
    await ndef.write("Hello world!");
    log("> Message written");
  } catch (error) {
    log("Argh! " + error);
  }
}

export default defineComponent({
  name: 'MyPage',
  setup() {
    const title = 'дополнительные эксперименты';

    let tts = initTTS();
    let nfc = initNFC();

    return { title, debug, tts, nfc, scanButton, writeButton };
  }
});
</script>
