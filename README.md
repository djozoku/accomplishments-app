# accomplishments-app

Application for managing common / daily tasks across many users.

PWA built with Typescript, Vue, Vuex, Vue Router, Vuetify, Firebase & Vuexfire

## Info

Pages:

- Home / Today
- Manage Tasks
- Earlier

DB Schema:

- task
  - id
  - name

- accomplishment
  - id
  - taskID
  - date
  - userID

- user
  - id
  - displayName
  - photoURL
  - email

## Project setup

Clone the project, `npm install` and put your own firebase config in `src/firebaseConfig.ts`.

## Other

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

### Lints and fixes files

```sh
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
