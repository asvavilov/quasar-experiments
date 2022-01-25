<template>
  <q-page class="">
    <q-btn @click="music()">test audio</q-btn>
    <example-component
      :title="title"
    ></example-component>
  </q-page>
</template>

<script lang="ts">
//import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/CompositionComponent.vue';
import { defineComponent, ref } from 'vue';

// можно через webpack из assets подключать:
//let sound = require('../assets/worms.mp3');
// или из папки public:
let sound = 'my/worms.mp3';
function music()
{
  let audio = new Audio(sound);
  audio.play();
}

export default defineComponent({
  name: 'PageIndex',
  components: { ExampleComponent },
  setup() {
    const title = 'Нажми на кнопку';

    // так тоже работает сразу при старте приложения и при переходе на страницу
    //music();

    return { title, music };
  }
});
</script>
