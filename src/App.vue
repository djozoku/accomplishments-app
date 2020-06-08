<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item v-if="user">
          <v-list-item-avatar>
            <img :src="user.photoURL" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="user.displayName"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>User</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/manage">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Manage</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/earlier">
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Earlier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user" link @click="signOut()">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else link @click="signIn()">
          <v-list-item-icon>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign In</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="ml-0 pl-4">
        <span>Accomplishments App</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <v-snackbar v-model="snack" timeout="20000">
      App Updated, Relaunch to See New Version
      <v-btn icon color="pink" @click="snack = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { watch, onMounted, onUnmounted, ref } from '@vue/composition-api';
import { useUser, signOut, signIn, isNewUser, db } from '@/firebase';

export default Vue.extend({
  name: 'App',

  setup() {
    const user = useUser();
    const snack = ref(false);

    const appUpdated = (event: MessageEvent) => {
      if (event.data === 'app_updated') {
        setTimeout(() => {
          snack.value = true;
        }, 500);
      }
    };

    onMounted(() => {
      window.addEventListener('message', appUpdated);
    });

    onUnmounted(() => {
      window.removeEventListener('message', appUpdated);
    });

    // check if currently logged in user is new, if so add to database
    watch(user, async (u) => {
      if (u && isNewUser(u.uid)) {
        await db
          .collection('users')
          .doc(u.uid)
          .set({
            photoURL: u.photoURL,
            email: u.email,
            displayName: u.displayName,
          });
      }
    });

    return { drawer: false, user, signOut, signIn, snack };
  },
});
</script>

<style>
html {
  overflow-y: auto !important;
}
</style>
