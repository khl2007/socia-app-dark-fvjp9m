import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import {
  ToastController,
  AlertController
} from "@ionic/angular";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { User } from "../services/user";
import { UserfowlowComponent } from '../comps/userfowlow/userfowlow.component';
import { UserfolowersComponent } from '../comps/userfolowers/userfolowers.component';
import { flatMap, map } from "rxjs/operators";
       
import { FirebaseService } from "../services/firebase.service";
//import { Animation, AnimationController } from '@ionic/angular';
import { FollowService } from "../services/follow.service";
import { AuthService } from "../services/auth.service";
import { LoadingController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { IonRouterOutlet } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
})
export class MyprofilePage implements OnInit {
  displayName;
  useravtar;
  userid;

  constructor( public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private followserv: FollowService,
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth, public moCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
     private imagePicker: ImagePicker,
     private webview: WebView,
     public toastCtrl: ToastController,) { }

  ngOnInit() { 
this.userid = this.firebaseService.getUserId();
this.getuserdata(this.userid);
  }

getuserdata(userid) {
    this.firebaseService.getUserInfo(userid).subscribe((result: User) => {
      this.userData = result;
      this.displayName= this.userData.displayName;
      // this.instigram = this.userData.instigram;
      this.useravtar = this.userData.avatar;
    });

   // console.log(this.userData);
  }

updateUserdata(){

let data = {
      displayName : this.displayName,
      avatar: this.useravtar,
    };

this.firebaseService.updateuserdata(this.userid,data);

}

changepic(){
this.imagePicker.hasReadPermission().then(
      result => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        } else if (result == true) {
          this.imagePicker
            .getPictures({
              maximumImagesCount: 1
            })
            .then(
              results => {
                for (var i = 0; i < results.length; i++) {
                  this.uploadImageToFirebase(results[i]);
                }
              },
              err => console.log(err)
            );
        }
      },
      err => {
        console.log(err);
      }
    );

}
async uploadImageToFirebase(image) {
    const loading = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    const toast = await this.toastCtrl.create({
      message: "Image was updated successfully",
      duration: 3000
    });
    this.presentLoading(loading);
    // let image_to_convert = 'http://localhost:8080/_file_' + image;
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random()
      .toString(36)
      .substr(2, 5);

    //uploads img to firebase storage
    this.firebaseService.uploadImage(image_src, randomId).then(
      photoURL => {
        this.useravtar = photoURL;
        this.firebaseService.updateuseravatar(this.curentuserid,photoURL);
        loading.dismiss();
        toast.present();
      },
      err => {
        console.log(err);
      }
    );
  }

}
