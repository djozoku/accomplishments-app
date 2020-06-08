<template>
  <v-list v-if="user">
    <v-list-item-group v-model="completed" multiple>
      <template v-for="task in items">
        <v-list-item
          :key="task.id"
          :value="task.id"
          :disabled="!!task.userID && !ownedByCurrentUser(task)"
          :active-class="
            !ownedByCurrentUser(task) ? '' : 'deep-purple--text text--accent-4'
          "
          @click.capture.stop="toggleTask(task)"
        >
          <template v-slot:default="{ active, toggle }">
            <v-list-item-action>
              <v-checkbox
                :input-value="active"
                :true-value="task.id"
                :disabled="active && !ownedByCurrentUser(task)"
                color="deep-purple accent-4"
                @click="toggle"
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
</template>

<script lang="ts">
import { onMounted, ref, Ref, watch } from '@vue/composition-api';
import { useStore, useState } from '@u3u/vue-hooks';
import { Accomplishment, Task, TodayTask, User } from '../types';
import { useUser, db } from '../firebase';
import { currentDay } from '@/utils/currentDay';

export default {
  name: 'Home',

  setup() {
    const userRef = useUser();
    const completed = ref<string[]>([]);
    const items = ref<TodayTask[]>([]);
    const store = useStore();
    const state = useState(['today', 'users', 'tasks']);
    const todayRef = state.today as Ref<Accomplishment[]>;
    const usersRef = state.users as Ref<User[]>;
    const tasksRef = state.tasks as Ref<Task[]>;

    watch<[Ref<Accomplishment[]>, Ref<User[]>, Ref<Task[]>]>(
      [todayRef, usersRef, tasksRef],
      ([today, users, tasks]) => {
        completed.value = today.map((v) => v.taskID);
        items.value = tasks
          .map((t) => {
            const acc = today.find((a) => a.taskID === t.id);
            const task: TodayTask = {
              id: t.id,
              name: t.name,
            };
            if (acc) {
              const user = users.find((user) => user.id === acc.userID);
              if (user) {
                task.userID = user.id;
                task.userPhoto = user.photoURL;
                task.accID = acc.id;
              }
            }
            return task;
          })
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
      },
    );

    watch(userRef, () => {
      store.value.dispatch('bindTasks');
      store.value.dispatch('bindToday');
      store.value.dispatch('bindUsers');
    });

    onMounted(() => {
      store.value.dispatch('bindTasks');
      store.value.dispatch('bindToday');
      store.value.dispatch('bindUsers');
    });

    const toggleTask = (task: TodayTask) => {
      const index = completed.value.indexOf(task.id);
      if (index === -1) {
        db.collection('accomplishments').add({
          date: currentDay(),
          taskID: task.id,
          userID: userRef.value?.uid,
        });
      } else if (userRef.value?.uid === task.userID) {
        db.collection('accomplishments')
          .doc(task.accID)
          .delete();
      }
    };

    const ownedByCurrentUser = (task: TodayTask) => {
      return !!userRef.value && userRef.value.uid === task?.userID;
    };

    return {
      items,
      completed,
      toggleTask,
      user: userRef,
      ownedByCurrentUser,
    };
  },
};
</script>
