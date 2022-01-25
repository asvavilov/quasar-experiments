<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          MyApp
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Какие-то ссылки
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'главная',
    caption: '',
    icon: 'home',
    link: '/'
  },
  {
    title: 'дополнительные эксперименты',
    caption: '',
    icon: 'science',
    link: '/mypage'
  },
  {
    title: 'еще другая страница',
    caption: '',
    icon: 'navigate_next',
    link: '/mynewpage'
  },
  {
    title: 'Сайт 1',
    caption: 'yasla.net',
    icon: 'public',
    link: 'https://yasla.net',
    target: '_blank'
  },
  {
    title: 'Сайт 2',
    caption: 'profi-studio.ru',
    icon: 'public',
    link: 'https://profi-studio.ru',
    target: '_blank'
  }
];

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  setup() {
    const leftDrawerOpen = ref(false);
    const essentialLinks = ref(linksData);

    return {leftDrawerOpen, essentialLinks}
  }
});
</script>
