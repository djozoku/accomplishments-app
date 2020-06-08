import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { db } from '@/firebase';
import { User, Accomplishment, Task } from '@/types';
import { currentDay } from '@/utils/currentDay';

Vue.use(Vuex);

export interface State {
  users: User[];
  today: Accomplishment[];
  tasks: Task[];
  accomplishments: Accomplishment[];
}

export default new Vuex.Store<State>({
  state: {
    users: [],
    today: [],
    tasks: [],
    accomplishments: [],
  },
  mutations: { ...vuexfireMutations },
  actions: {
    bindToday: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        'today',
        db.collection('accomplishments').where('date', '==', currentDay()),
      );
    }),
    bindTasks: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('tasks', db.collection('tasks'));
    }),
    bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('users', db.collection('users'));
    }),
    bindDay: firestoreAction(({ bindFirestoreRef }, date: Date) => {
      return bindFirestoreRef(
        'accomplishments',
        db.collection('accomplishments').where('date', '==', date),
      );
    }),
  },
  modules: {},
});
