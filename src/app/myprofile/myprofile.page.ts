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
userid = this.firebaseService.getUserId();
this.getuserdata(userid);
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

}
