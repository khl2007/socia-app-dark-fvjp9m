import { Component, OnInit , ViewChild , Input} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LoadingController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalController } from '@ionic/angular';
import { CommentsComponent } from '../../comments/comments.component';
import { Animation, AnimationController  } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';

import { Observable } from "rxjs";

import { map } from "rxjs/operators";


import { FirebaseService } from "../../services/firebase.service";

import { LikesService } from "../../services/likes.service";



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
   

  @Input() inputPost;
  @Input() inputPostID;
  @Input() parentPid;
  
public tap: number = 0;
  currentuser;
  currentuid;
  showContext = true;
	postuserid;
  isLoggedIn = false;
  isSingle = false;
  isCurrentUser = false;
  isInvalid;
  isLoaded = false;
  showLoader = false;
  closeResult: string;
  isLiked;
  likeStyle = 'primary';
  likeicon = 'heart-outline';
  likeLen = 0;
  commentLen = 0;

  pid;
  displayName;
  userName;
  photoURL = '../../assets/images/default-profile.jpg';
  body;
  date;
  likes;
  type;
  comments;
  postPhotoURL;

  parentUsername;
  parentUID;

  gname;
  gid;




  constructor(public loadingCtrl: LoadingController,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private postService: FirebaseService,
    private animationCtrl: AnimationController,
    private likeService: LikesService,
    public moCtrl: ModalController,
    private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {

if (this.inputPostID) {
      this.postService.getPost(this.inputPostID).subscribe(
        post => {
          if (post) {
            this.inputPost = post;
            //this.inputPostID = null;
            this.isInvalid = false;
            this.body = this.inputPost.body;
            this.date = this.inputPost.crtd;
			this.postuserid = this.inputPost.byuser;
           // this.pid = this.inputPost.pid;
            // this.type = this.inputPost.type;
            this.postPhotoURL = this.inputPost.imgurl;
			this.auth.getAuthState().subscribe(
				user => {
					if (user) {
						if (this.inputPost.byuser === user.uid) {
							this.currentuser = user.uid;
							this.isCurrentUser = true;
				}
			  }
			});
			
            this.postService.getUserInfo(this.inputPost.byuser).subscribe(
              user => {
                if (user) {
                  this.displayName = user.displayName;
                  //this.userName = user.userName;
                  this.photoURL = user.avatar;
                 this.isLoaded = true;
                }
              }
              );
             
             } else {
            this.isInvalid = true;
          }
        });

			
        this.getLikes(this.inputPostID);
        this.getComments(this.inputPostID);

       
    }


  }
  
  async presentcommtsModal(poid) {
  const modal = await this.moCtrl.create({
    component: CommentsComponent,
    swipeToClose: true,
    componentProps: {
      'poid': poid,
      'lastName': 'Adams',
      'middleInitial': 'N'
    },
    presentingElement: this.routerOutlet.nativeEl
  });
  return await modal.present();
}

tapPhotoLike(times) {
    // If we click double times, it will trigger like the post
    this.tap++;
    if (this.tap % 2 === 0) {
      //this.likeButton();
    }
  }
  
  
 getComments(pid) {
    this.postService.getCommentsinfo(pid).subscribe(comments => {
      if (comments) {
        this.commentLen = comments.length;
        this.comments = comments;
      }
    });
  }

  getLikes(pid) {
    this.likeService.getLikes(pid).subscribe(likes => {
      this.likes = likes;
      this.likeLen = likes.length; 
      this.auth.getAuthState().subscribe(
        user => {
          if (user) {
            this.currentuser = user;
            this.likes.forEach(like => {
              if (like.uid === user.uid) {
                this.isLiked = true;
                this.likeStyle = 'danger';
				this.likeicon = 'heart-circle';
              }
            });
          }
        });
    });
  }

  clickLike() {
    if (this.currentuser) {
      if (!this.isLiked) {
        this.likeStyle = 'danger';
		this.likeicon = 'heart-circle';
        this.likeService.addLike(this.inputPostID, this.currentuser.uid);
        this.isLiked = true;
      } else {
        this.likeStyle = 'primary';
		this.likeicon = 'heart-outline';
        this.likeService.removeLike(this.inputPostID, this.currentuser.uid);
        this.isLiked = false;
      }
    }
  }


delete() {
   // this.postService.deletePost(this.pid);
  }

 

 /* retrieveDate(date, type?) {
    if (date) {
      if (type === 'long') {
        return this.dateFormat.transform(date, type);
      } else {
        const prevDate = date;
        const newDate = new Date();
        const ms = newDate.getTime() - prevDate.getTime();
        const min = Math.trunc(ms / 60000);
        let hours;
        if (min < 59) {
          if (min < 1) {
            return 'just now';
          }
          return min + 'm';
        } else {
          hours = Math.trunc(min / 60);
          if (hours >= 1 && hours < 24) {
            return hours + 'h';
          } else {
            //return this.dateFormat.transform(prevDate);
          }
        }
      }
    }
  }*/





}
