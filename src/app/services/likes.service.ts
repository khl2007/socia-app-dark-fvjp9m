import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, combineLatest } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LikesService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getLikes(pid) {
    return this.afs.collection('posts/' + pid + '/likes').valueChanges();
  }

  getUserLikes(uid) {
    return this.afs.collection('users/' + uid + '/likes', ref => ref.orderBy('date', 'desc')).valueChanges();
  }

  addLike(pid, uid) {
    const data = {
      uid: uid
    };
    this.afs.doc('posts/' + pid + '/likes/' + uid).set(data)
    .then(() => console.log('post ', pid, ' liked by user ', uid));
  }

  removeLike(pid, uid) {
    this.afs.doc('posts/' + pid + '/likes/' + uid).delete()
    .then(() => console.log('post ', pid, ' unliked by user ', uid));
  }
}
