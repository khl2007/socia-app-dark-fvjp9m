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
import { Blogitem } from "./blogitem";

import { Userfriends } from "./userfriends";

import { Feed } from "./postfeed";
import { Commentitem } from "./comment";

import { flatMap, map } from "rxjs/operators";

import { User } from "./user";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  private snapshotChangesSubscription: any;

  blogsRef: AngularFirestoreCollection<Blogitem>;
  commsRef: AngularFirestoreCollection<any>;
  chatref: AngularFirestoreCollection<any>;
  discussref: AngularFirestoreCollection<any>;
  userfriends: Observable<Userfriends[]>;
	levelref: AngularFirestoreCollection<any>;
  levelcont: Observable<any[]>;
 
  chatfriref: AngularFirestoreCollection<any>;

  userchats: Observable<any[]>;
  userdiscuss: Observable<any[]>;
  curentuserid :any;
  feedItem: Observable<Feed[]>;
  feeditems: any[];
  commItem: Observable<Commentitem[]>;
  commitems: any[];
  islikedref = false;
  private userDoc: AngularFirestoreDocument<User>;
  private userDocc: AngularFirestoreCollection<User>;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {
    //this.userDocc = this.afs.collection("/users");
    //this.getChats();
    // this.blogsRef = this.afs.collection("/blogs");
    //this.curentuserid = firebase.auth().currentUser.uid;
  }

  getTasks() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
          this.snapshotChangesSubscription = this.afs
            .collection("people")
            .doc(currentUser.uid)
            .collection("tasks")
            .snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      });
    });
  }


   postDmsg(val) {
    let uid = firebase.auth().currentUser.uid;
    const data = {
      uid: uid
    };
    this.afs
      .collection("discuss")
      .add(val)
      .then(() => console.log("success  "));
  }  

getDisucss(levelid) {
    //get the loged in user id
    let currentUser = firebase.auth().currentUser.uid;
    this.discussref = this.afs
    .collection("discuss", ref => ref.orderBy("crtd", "desc")
    .where("userid", "==", currentUser)
    .where("levelid", "==", levelid));
    this.userdiscuss = this.discussref.valueChanges();
    return this.userdiscuss;
  }

getLevel(levelid) {
    //get the loged in user id
	//levelid = Number(levelid);
    let currentUser = firebase.auth().currentUser.uid;
   console.log(levelid);
    this.levelref = this.afs
    .collection("levelcont", ref => ref.orderBy("imgno", "asc").where("levelid", "==", levelid));
    this.levelcont = this.levelref.valueChanges();
    return this.levelcont;
  } 


  getBlogs() {

return this.afs.collection("blogs", ref =>
        ref.orderBy("crtd", "desc").limit(100)
      );
  }



getCommentsinfo(pid) {
    return this.afs.collection("comments", ref =>
      ref
        .orderBy("crtd", "desc")
        .limit(100)
        .where("pid", "==", pid)
    ).valueChanges();
  }


  getComments(poid) {
    let currentUser = firebase.auth().currentUser.uid;
    this.commsRef = this.afs.collection("comments", ref =>
      ref
        .orderBy("crtd", "desc")
        .limit(100)
        .where("pid", "==", poid)
    );
    this.commItem = this.commsRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          // this.lastVisible = c[0].payload.doc;
          const data = c.payload.doc.data();
          const commid = c.payload.doc.id;
          const userid = data.userid;
          const poid = data.pid;
          const body = data.body;
          const crtd = data.crtd;
          //this.startq = c[0].payload.doc;

          return this.afs
            .doc("users/" + userid)
            .valueChanges()
            .pipe(
              map((userData: User) => {
                return Object.assign({
                  poid: poid,
                  userid: userid,
                  body: body,
                  useravtar: userData.avatar,
                  crtd: crtd,
                  username: userData.displayName
                });
              })
            );
        });
      }),
      flatMap(comms => combineLatest(comms))
    );
    console.log(this.commItem);
    return this.commItem;
  }

  addComment(poid, comment) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser.uid;
      let data = {
        pid: poid,
        body: comment,
        crtd: this.getTimeSamp(),
        userid: currentUser
      };
      this.afs
        .collection("comments")
        .add(data)
        .then(res => resolve(res), err => reject(err));
    });
  }

  collectionInitialization(userid) {
    if (userid) {
      this.blogsRef = this.afs.collection("blogs", ref =>
        ref
          .orderBy("crtd", "desc")
          .limit(100)
          .where("byuser", "==", userid)
      );
    } else {
      this.blogsRef = this.afs.collection("blogs", ref =>
        ref.orderBy("crtd", "desc").limit(100)
      );
    }

    this.feedItem = this.blogsRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          // this.lastVisible = c[0].payload.doc;
          const data = c.payload.doc.data();
          const blogid = c.payload.doc.id;
          const userid = data.byuser;
          const blgbody = data.body;
          const blgimg = data.imgurl;
          const bloglikes = data.likes;
          const blogcrtd = data.crtd;
          
          const heartbutton = this.setliked(blogid);
   

          return this.afs
            .doc("users/" + userid)
            .valueChanges()
            .pipe(
              map((userData: User) => {
                return Object.assign({
                  blogrefid: blogid,
                  buserid: userid,
                  user: userData.displayName,
                  useravtar: userData.avatar,
                  body: blgbody,
                  bimgurl: blgimg,
                  crtd: blogcrtd,
                  likes: bloglikes,
                  heartbutton : heartbutton
                });
              })
            );
        });
      }),
      flatMap(feeds => combineLatest(feeds))
    );
  }


setliked(blogid){

let heartbutton = "danger";

this.isLiked(blogid).subscribe(followinguser => {
            
            if (followinguser[0]) {
              heartbutton ="danger";
            
            
            }else {
                   heartbutton ="secondary";
                  }
          });
          
          return heartbutton;
}
  sellectAllNews() {
    let x = null;

    this.collectionInitialization(x);

    /*this.feedItem.forEach(value => {
  console.log(value);
  
});*/
    //console.log(this.feedItem);
    // return result;
    return this.feedItem;
  }

  sellectUserNews(userid) {
    this.collectionInitialization(userid);
    return this.feedItem;
  }

  getUserId() {
    return firebase.auth().currentUser.uid;
  }
  getTimeSamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  /*getUserInfo(userid: string): Observable<User> {
    //let currentUser = firebase.auth().currentUser;

    const userDetails = this.afs.doc<User>("users/" + userid).valueChanges();
    return userDetails;
  }*/

getUserInfo(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }


  getUserBlogs(userid: string): Observable<Blogitem[]> {
    const blogs = this.afs
      .collection<Blogitem>("blogs", ref => ref.orderBy("crtd", "desc"))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(c => ({
            key: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
        })
      );
    return blogs;
  }
  getChats(receverid) {
    //get the loged in user id
    let currentUser = firebase.auth().currentUser.uid;
    //this.afs.collection("people").doc(currentUser.uid).collection("tasks").snapshotChanges();
    let chats: any;
    //let receverid = "qjrcTo4JIXX9j8X7541rSBlowu73";
    this.chatref = this.afs
      .collection("chats")
      .doc(currentUser)
      .collection("friends")
      .doc(receverid)
      .collection("msgs", ref => ref.orderBy("createdat", "desc"));
    this.userchats = this.chatref.valueChanges();
    return this.userchats;
  }

  getChatsFri() {
    //get the loged in user id
    let currentUser = firebase.auth().currentUser.uid;
    //this.afs.collection("people").doc(currentUser.uid).collection("tasks").snapshotChanges();
    let chats: any;
    //let receverid = "qjrcTo4JIXX9j8X7541rSBlowu73";
    this.chatfriref = this.afs
      .collection("chats")
      .doc(currentUser)
      .collection("friends");
    this.userfriends = this.chatfriref.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          // this.lastVisible = c[0].payload.doc;
          const data = c.payload.doc.data();
          const userid = c.payload.doc.id;
          const lastmsgg = data.lastmsg;
          console.log("hi", userid);
          return this.afs
            .doc("users/" + userid)
            .valueChanges()
            .pipe(
              map((userData: User) => {
                return Object.assign({
                  fuserid: userid,
                  user: userData.displayName,
                  useravtar: userData.avatar,
                  lastmsg: lastmsgg
                });
              })
            );
        });
      }),
      flatMap(userfeeds => combineLatest(userfeeds))
    );
  }

  InitChatfri() {
    this.getChatsFri();

    return this.userfriends;
  }

  addChat(msg, receverid) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser.uid;
      let data = {
        msg: msg,
        sender: currentUser,
        createdat: this.getTimeSamp()
      };
      let cur = {
        frid: currentUser,
        lastmsg: msg
      };
      let rec = {
        frid: receverid,
        lastmsg: msg
      };

      this.afs
        .collection("chats")
        .doc(currentUser)
        .collection("friends")
        .doc(receverid)
        .collection("msgs")
        .add(data)
        .then(res => resolve(res), err => reject(err));

      this.afs
        .collection("chats")
        .doc(currentUser)
        .collection("friends")
        .doc(receverid)
        .set(rec)
        .then(res => resolve(res), err => reject(err));

      this.afs
        .collection("chats")
        .doc(receverid)
        .collection("friends")
        .doc(currentUser)
        .collection("msgs")
        .add(data)
        .then(res => resolve(res), err => reject(err));

      this.afs
        .collection("chats")
        .doc(receverid)
        .collection("friends")
        .doc(currentUser)
        .set(cur)
        .then(res => resolve(res), err => reject(err));
    });
  }

  getTask(taskId) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
          this.snapshotChangesSubscription = this.afs
            .doc<any>("blogs/" + taskId)
            .valueChanges()
            .subscribe(
              snapshots => {
                resolve(snapshots);
              },
              err => {
                reject(err);
              }
            );
        }
      });
    });
  }

 public getPost(pid) {
    return this.afs.doc<any>('blogs/' + pid).valueChanges();
  }

  // Delete post
  public deletePost (pid) {
    this.afs.doc<any>('blogs/' + pid).delete();
  }



  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateTask(taskKey, value) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs
        .collection("blogs")

        .doc(taskKey)
        .set(value)
        .then(res => resolve(res), err => reject(err));
    });
  }

  deleteTask(taskKey) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs
        .collection("people")
        .doc(currentUser.uid)
        .collection("tasks")
        .doc(taskKey)
        .delete()
        .then(res => resolve(res), err => reject(err));
    });
  }

  createTask(value) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs
        .collection("blogs")
        .add(value)
        .then(res => resolve(res), err => reject(err));
    });
  }
  isLiked(pid) {
    let currentUser = firebase.auth().currentUser.uid;
    return this.afs
      .collection<any>("/blogs/" + pid + "/likesc", ref =>
        ref.where("uid", "==", currentUser)
      )
      .valueChanges();
  }

  getLikes(pid) {
    return this.afs.collection("blogs/" + pid + "/likesc").valueChanges();
  }

  getUserLikes(uid) {
    return this.afs
      .collection("users/" + uid + "/likes", ref => ref.orderBy("date", "desc"))
      .valueChanges();
  }

  addLike(pid) {
    let uid = firebase.auth().currentUser.uid;
    const data = {
      uid: uid
    };
    this.afs
      .doc("blogs/" + pid + "/likesc/" + uid)
      .set(data)
      .then(() => console.log("post ", pid, " liked by user ", uid));
  }

  removeLike(pid) {
    let uid = firebase.auth().currentUser.uid;
    this.afs
      .doc("blogs/" + pid + "/likesc/" + uid)
      .delete()
      .then(() => console.log("post ", pid, " unliked by user ", uid));
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function() {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  }
updateuserdata(userid ,data){
return new Promise<any>((resolve, reject) => {
    
      this.afs
        .collection("users")
        .doc(userid)
        .update(data)
        .then(res => resolve(res), err => reject(err));
    });

}

  uploadImage(imageURI, randomId) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child("image").child(randomId);
      this.encodeImageUri(imageURI, function(image64) {
        imageRef.putString(image64, "data_url").then(
          snapshot => {
            snapshot.ref.getDownloadURL().then(res => resolve(res));
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }
}
