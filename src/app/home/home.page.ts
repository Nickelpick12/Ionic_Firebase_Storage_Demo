import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  downloadURL: Observable<string>;
  downloadURLString: string;

  uploadVal = 0;

  constructor( private storage: AngularFireStorage ) {}

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
}
