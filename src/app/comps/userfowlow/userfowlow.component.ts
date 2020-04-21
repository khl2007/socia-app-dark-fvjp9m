import { Component, OnInit , Input} from '@angular/core';
import { UserfolowersComponent } from '../../comps/userfolowers/userfolowers.component';
import { FollowService } from "../../services/follow.service";
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-userfowlow',
  templateUrl: './userfowlow.component.html',
  styleUrls: ['./userfowlow.component.scss'],
})
export class UserfowlowComponent implements OnInit {
@Input() userid: string;
@Input() type: string;
 userFollowers;
  userFollowing;
  followers: any;
  following: any;
  //type: string;
  constructor(public moCtrl: ModalController,private followserv: FollowService) { }

  ngOnInit() {
	  
	  this.getFollowData();
	  
	  
  }
  
  getFollowData() {
    this.followserv.getFollowers(this.userid).subscribe(
      followers => {
        this.followers = followers;
		console.log(this.followers);
        this.userFollowers = followers;
      });
    this.followserv.getFollowing(this.userid).subscribe(
      following => {
        this.following = following;
        this.userFollowing = following;
      });
  }
  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.moCtrl.dismiss({
      'dismissed': true
    });
  }
  

}
