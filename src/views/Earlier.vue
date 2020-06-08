<template>
  <div>
    <v-list>
      <v-list-item-group :value="completed" multiple>
        <template v-for="task in tasks">
          <v-list-item
            :key="task.id"
            :value="task.id"
            :active-class="
              task.userID ? 'deep-purple--text text--accent-4' : ''
            "
            @click.capture.stop.prevent
          >
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox
                  :input-value="active"
                  :true-value="task.id"
                  color="deep-purple accent-4"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="task.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-avatar v-if="task.userPhoto">
                <img :src="task.userPhoto" />
              </v-list-item-avatar>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="secondary"
      @click.stop="dialog = true"
    >
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="300">
      <v-date-picker
        v-model="date"
        first-day-of-week="1"
        reactive
      ></v-date-picker>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { auth } from '../firebase';
import { TodayTask, Task, Accomplishment, User } from '../types';

interface EarlierData {
  date: string;
  dialog: boolean;
  unsubUserUpdates: (() => void) | null;
  user: firebase.User | null;
}

interface EarlierComputed {
  completed(): string[];
  tasks(): TodayTask[];
}

export default Vue.extend<EarlierData, {}, EarlierComputed>({
  name: 'Earlier',
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      dialog: false,
      unsubUserUpdates: null,
      user: null,
    };
  },
  computed: {
    completed() {
      return this.$store.state.accomplishments.map(
        (acc: Accomplishment) => acc.taskID,
      );
    },
    tasks() {
      return this.$store.state.tasks
        .map((task: Task) => {
          const accomplishment = this.$store.state.accomplishments.find(
            (acc: Accomplishment) => acc.taskID == task.id,
          );
          const user = this.$store.state.users.find(
            (user: User) => user.id === accomplishment?.userID,
          );
          return {
            id: task.id,
            name: task.name,
            userID: user?.id,
            userPhoto: user?.photoURL,
            accID: accomplishment?.id,
          };
        })
        .sort((a: TodayTask, b: TodayTask) => {
          return a.name.localeCompare(b.name);
        });
    },
  },
  watch: {
    user() {
      this.$store.dispatch('bindDay', new Date(this.date));
      this.$store.dispatch('bindUsers');
      this.$store.dispatch('bindTasks');
    },
    date() {
      this.$store.dispatch('bindDay', new Date(this.date));
    },
  },
  created() {
    this.unsubUserUpdates = auth.onAuthStateChanged((user) => {
      this.user = user;
    });
  },
  destroyed() {
    this.unsubUserUpdates && this.unsubUserUpdates();
  },
});
</script>
