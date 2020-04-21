import { Component, OnInit , ViewChild , Input} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LoadingController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";

//import { Animation, AnimationController  } from '@ionic/angular';

//import { IonInfiniteScroll } from '@ionic/angular';

import { Observable } from "rxjs";

import { map } from "rxjs/operators";

import { FollowService } from "../../services/follow.service";

import { FirebaseService } from "../../services/firebase.service";


@Component({
  selector: 'app-userfolowers',
  templateUrl: './userfolowers.component.html',
  styleUrls: ['./userfolowers.component.scss'],
})
export class UserfolowersComponent implements OnInit {
    

@Input() uid: string;
  @Input() type: string;
  @Input() modalRef;

  //username;
  displayname;
  photoURL;
  status;

  isCurrentUser = false;

  btnFollow = 'Follow';

  constructor(
    public loadingCtrl: LoadingController,
    private auth: AuthService,
    private route: ActivatedRoute,
    private userService: FirebaseService,
    private followService: FollowService
  ) { }

  ngOnInit() {
    this.userService.getUserInfo(this.uid).subscribe(
      user => {
        if (user) {
          //this.username = user.userName;
          this.displayname = user.displayName;
          //this.status = user.status;
          this.photoURL = user.avatar;
          this.checkFollowing();
        }
    });
  }

  checkFollowing() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        if (user.uid === this.uid) {
          this.isCurrentUser = true;
        } else {
          this.followService.isFollowing(this.uid, user.uid).subscribe(followinguser => {
            if (followinguser.length > 0) {
              this.btnFollow = 'Following';
            } else {
              this.btnFollow = 'Follow';
            }
          });
        }
      }
    });
  }

  follow() {
    if (this.btnFollow === 'Following') {
      this.followService.unfollow(this.uid);
    } else {
      this.followService.follow(this.uid);
    }
  }

}
