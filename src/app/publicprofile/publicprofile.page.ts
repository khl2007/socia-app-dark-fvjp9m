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
  selector: "app-publicprofile",
  templateUrl: "./publicprofile.page.html",
  styleUrls: ["./publicprofile.page.scss"]
})
export class PublicprofilePage implements OnInit {
  userid: string;
  curentuserid: string;
  showToolbar = false;
  userFollowers;
  userFollowing;
  useravtar;
  followers: any;
  following: any;
  totalFollowers;
  totalFollowing;
  userData: User = new User();
	isFollowing: boolean;
  postfeed: any;
  ismyprofile = false;
  public like_btn = {
    color: "primary",
    icon_name: "heart-outline"
  };

  public tap: number = 0;

  constructor(
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private followserv: FollowService,
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth, public moCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
     private imagePicker: ImagePicker,
     private webview: WebView,
     public toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.curentuserid = this.firebaseService.getUserId();
    if (this.route.snapshot.params["buserid"]) {
      this.userid = this.route.snapshot.params["buserid"];
			  if (this.userid === this.curentuserid) {
				this.ismyprofile = true;
				
			  } else {
          this.followserv.isFollowing(this.userid, this.curentuserid).subscribe(
              followinguser => {
                if (followinguser[0]) {
                  this.isFollowing = true;
                 
                }
            });
				//this.router.navigate(["/login"]);
			  }
      
	 
		
      this.getuserdata(this.userid);

      this.getBlogPosts(this.userid);
      this.getFollowData();
    } else {
        //this.router.navigate(["/login"]);
		this.userid = this.curentuserid;
		 this.ismyprofile = true;
		 this.getuserdata(this.userid);

      this.getBlogPosts(this.userid);
       this.getFollowData();
      }

    //getUserInfo
  }
  
  async presentcommtsModal(userid) {
  const modal = await this.moCtrl.create({
    component: UserfowlowComponent,
    swipeToClose: true,
    componentProps: {
      'userid': userid,
	  'type': 'seg1'
    },
    presentingElement: this.routerOutlet.nativeEl
  });
  return await modal.present();
}

async presentcommtsModalf(userid) {
  const modal = await this.moCtrl.create({
    component: UserfowlowComponent,
    swipeToClose: true,
    componentProps: {
      'userid': userid,
	  'type': 'seg2'
    },
    presentingElement: this.routerOutlet.nativeEl
  });
  return await modal.present();
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

  onScroll($event) {
if ($event && $event.detail && $event.detail.scrollTop) {
const scrollTop = $event.detail.scrollTop;
this.showToolbar = scrollTop >= 225;
}
} 

  getuserdata(userid) {
    this.firebaseService.getUserInfo(userid).subscribe((result: User) => {
      this.userData = result;
      this.useravtar = this.userData.avatar;
    });

   // console.log(this.userData);
  }
follow(profileuid) {
    if (this.isFollowing) {
      this.isFollowing = false;
      this.followserv.unfollow(profileuid);
    } else {
      this.isFollowing = true;
      this.followserv.follow(profileuid);
    }
  }
  

getFollowData() {
    this.followserv.getFollowers(this.userid).subscribe(
      followers => {
        this.followers = followers;
        this.userFollowers = followers;
        this.totalFollowers= followers.length;
        
        
      });
    this.followserv.getFollowing(this.userid).subscribe(
      following => {
        this.following = following;
        this.userFollowing = following;
        this.totalFollowing= following.length;
      });
  }

checkFollowing(){

/*this.followserv.isFollowing(this.userid, this.curentuserid).subscribe(
              followinguser => {
                if (followinguser[0]) {
                  this.isFollowing = true;
                 
                }
            });
*/
if (this.isFollowing) {
      return 'Unfollow';
    } else {
      return 'Follow';
    }

}

  getBlogPosts(userid) {
    this.firebaseService.sellectUserNews(userid).subscribe(res => {
     // console.log(res);
      this.postfeed = res;
    });
    //console.log(this.blogPost);
  }

  likeButton() {
    if (this.like_btn.icon_name === "heart-outline") {
      this.like_btn.icon_name = "heart";
      this.like_btn.color = "danger";
      // Do some API job in here for real!
    } else {
      this.like_btn.icon_name = "heart-outline";
      this.like_btn.color = "black";
    }
  }

  tapPhotoLike(times) {
    // If we click double times, it will trigger like the post
    this.tap++;
    if (this.tap % 2 === 0) {
      this.likeButton();
    }
  }

  swipePage(event) {
    if (event.direction === 1) {
      // Swipe Left
     // console.log("Swap Camera");
    }

    if (event.direction === 2) {
      // Swipe Right
      //this.goMessages();
    }
  }

  scrollToTop() {
    //this.content.scrollToTop();
  }
}
