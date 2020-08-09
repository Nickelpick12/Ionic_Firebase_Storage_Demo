# Ionic_Firebase_Storage_Demo

## Steps:
1) Install AngularFire by running the following command in the project directory.

```ng add @angular/fire```



2)  On the [Firebase Console](https://console.firebase.google.com/u/0/),
create a new project, add a new web app, and set up storage with the following rules.
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```



3) Get the firebase config info from your firebase settings and add it to your environment.ts.

```
// environment.ts:
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "Your apiKey",
    authDomain: "Your authDomain",
    databaseURL: "Your databaseURL",
    projectId: "Your projectId",
    storageBucket: "Your storageBucket",
    messagingSenderId: "Your messagingSenderId",
    appId: "Your appId"
  }
};
```



4) Set up your add module by adding the following import statements and adding the into the imports array.

```
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from '../environments/environment';
```
```
imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
],
```



5) Import and inject AngularFire Storage into a Page/Component/Service. Add the following import and constructor.

```
import { AngularFireStorage } from '@angular/fire/storage';
```
```
constructor( private storage: AngularFireStorage ) {}
```



6) Add the following tag to the HTML and function to your typescript. This is the base code for uploading to firebase.

```
<input type="file" (change)="uploadFile($event)">
```
```
uploadFile(event) {
    const file = event.target.files[0];
    var filePath = 'The file name or path you want in firebase (this part works like how you name new pages with the ionic cli)';

    const fileRef = this.storage.ref(filePath);
    var task = fileRef.put(file);
}
```



7) You can monitor upload progress with a ion-progress-bar and the percentageChanges() method by adding the following HTML tag and updating the uploadFile function.

```
<ion-progress-bar value="{{ uploadVal }}"></ion-progress-bar>
```
```
uploadVal = 0;

uploadFile(event) {
  const file = event.target.files[0];
  var filePath = 'image';

  const fileRef = this.storage.ref(filePath);
  var task = fileRef.put(file);

  this.uploadVal = 0;
  task.percentageChanges().subscribe(value => {
    this.uploadVal = value;
  });
}
```



8) You can also get the upload URL once it's uploaded. Update the uploadFile function with the following code.

```
downloadURL: Observable<string>;
downloadURLString: string;

uploadVal = 0;

uploadFile(event) {
  const file = event.target.files[0];
  var filePath = 'image';

  const fileRef = this.storage.ref(filePath);
  var task = fileRef.put(file);

  this.uploadVal = 0;
  task.percentageChanges().subscribe(value => {
    this.uploadVal = value;
  });

  task.snapshotChanges().pipe(
    finalize(() => {
      this.downloadURL = fileRef.getDownloadURL();
      this.downloadURL.subscribe(val => {
        this.downloadURLString = val;
        console.log(this.downloadURLString);
      });
    })
 )
.subscribe()
}
```
