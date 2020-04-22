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

  constructor() { }

  ngOnInit() {
  }

}
