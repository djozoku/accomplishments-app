<template>
  <div v-if="user">
    <v-list>
      <template v-for="task in items">
        <v-list-item :key="task.id" :value="task.id">
          <v-list-item-content>
            <v-list-item-title v-text="task.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon color="info" @click="editTask(task.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon color="error" @click="deleteTask(task.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="secondary"
      @click.stop="openTaskEditor()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="deleteConfirmation" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Confirm to delete</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDeleteTask()"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="confirmDeleteTask()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editor" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{
            taskid === '' ? 'New Task' : 'Edit Task'
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="name" label="Name" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelTask()">Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="taskid === '' ? createTask() : saveTask()"
            >{{ taskid === '' ? 'Create' : 'Save' }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, Ref } from '@vue/composition-api';
import { useStore, useState } from '@u3u/vue-hooks';
import { db, useUser } from '../firebase';
import { Task } from '@/types';

export default {
  name: 'Manage',
  setup() {
    const user = useUser();
    const editor = ref(false);
    const deleteConfirmation = ref(false);
    const name = ref('');
    const taskid = ref('');
    const items = ref<Task[]>([]);
    const store = useStore();
    const state = useState(['tasks']);
    const tasks = state.tasks as Ref<Task[]>;

    onMounted(() => {
      store.value.dispatch('bindTasks');
    });

    watch(user, () => {
      store.value.dispatch('bindTasks');
    });

    watch(tasks, (t) => {
      items.value = t
        .map((a) => a)
        .sort((a, b) => a.name.localeCompare(b.name));
    });

    const openTaskEditor = () => {
      editor.value = true;
    };

    const closeTaskEditor = () => {
      editor.value = false;
    };

    const openDeleteConfirmation = () => {
      deleteConfirmation.value = true;
    };

    const closeDeleteConfirmation = () => {
      deleteConfirmation.value = false;
    };

    const cancelTask = () => {
      closeTaskEditor();
      name.value = '';
    };

    const createTask = () => {
      closeTaskEditor();
      db.collection('tasks')
        .add({ name: name.value })
        .then(() => {
          name.value = '';
        });
    };

    const saveTask = () => {
      closeTaskEditor();
      db.collection('tasks')
        .doc(taskid.value)
        .update({ name: name.value });
      name.value = '';
      taskid.value = '';
    };

    const editTask = (id: string) => {
      taskid.value = id;
      const task = tasks.value.find((task) => task.id === id);
      name.value = task?.name ?? '';
      openTaskEditor();
    };

    const deleteTask = (id: string) => {
      taskid.value = id;
      openDeleteConfirmation();
    };

    const confirmDeleteTask = () => {
      db.collection('tasks')
        .doc(taskid.value)
        .delete();
      closeDeleteConfirmation();
      taskid.value = '';
    };

    const cancelDeleteTask = () => {
      closeDeleteConfirmation();
      taskid.value = '';
    };

    return {
      user,
      cancelTask,
      createTask,
      editTask,
      saveTask,
      openTaskEditor,
      cancelDeleteTask,
      confirmDeleteTask,
      deleteTask,
      items,
      tasks,
      name,
      editor,
      deleteConfirmation,
      taskid,
    };
  },
};
</script>
