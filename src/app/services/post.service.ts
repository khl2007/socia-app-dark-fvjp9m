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

import { AuthService } from "./auth.service";
import { flatMap, map } from "rxjs/operators";
import { User } from "./user";

 

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    
  ) { }

public getPost(pid) {
    return this.afs.doc<any>('blogs/' + pid).valueChanges();
  }

public deletePost (pid) {
    this.afs.doc<any>('posts/' + pid).delete();
  }



}
