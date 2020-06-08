/// <reference types="vuetify/types" />
import '@mdi/font/css/materialdesignicons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import colors from 'vuetify/src/util/colors';

const theme = {
  primary: colors.indigo.base,
  secondary: colors.pink.base,
  accent: colors.teal.base,
  error: colors.red.base,
  warning: colors.amber.base,
  info: colors.blue.base,
  success: colors.green.base,
};

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: theme,
    },
  },
});
