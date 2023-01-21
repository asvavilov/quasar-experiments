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
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
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

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'главная',
    caption: '',
    icon: 'home',
    link: '/'
  },
  {
    title: 'главная оригинальная',
    caption: '',
    icon: 'index-origin',
    link: '/index-origin'
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

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
