export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Task {
  id: string;
  name: string;
}

export interface Accomplishment {
  id: string;
  taskID: string;
  userID: string;
  date: import('firebase/app').firestore.Timestamp;
}

export interface TodayTask extends Task {
  userPhoto?: string;
  userID?: string;
  accID?: string;
}

export interface EarlierTask extends Task {
  userName: string;
  userPhoto: string;
}
