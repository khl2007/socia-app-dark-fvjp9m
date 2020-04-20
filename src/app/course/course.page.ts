import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from "@angular/router";
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';


@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {
  
  type: string;
  discussMsg: string;
  discusPic:string;
  image='';
  userid:any;
  discusstions:any;
  levelcont:any;
  lectureid:any;
  constructor(private imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private webview: WebView) { 



}

  ngOnInit() {
if (this.route.snapshot.params["lecturid"]) {
	this.lectureid= Number(this.route.snapshot.params["lecturid"]);
	
}

this.type = 'seg1';
this.getDiscusstions();
this.getLevel(this.lectureid);
  }

getLevel(levelid){
	
	this.firebaseService.getLevel(levelid).subscribe(res => {
         console.log(res);
         this.levelcont = res;
          }); 
}
  
  
getDiscusstions(){

  this.firebaseService.getDisucss(1).subscribe(res => {
         //console.log(res);
         this.discusstions = res;
          }); 
}
postDmsg(){

let data = {
      msg: this.discussMsg,
      imgurl: this.image,
      levelid:1,
      crtd: this.firebaseService.getTimeSamp(),
      userid: this.firebaseService.getUserId()
    };
    this.firebaseService.postDmsg(data);

this.discussMsg='';
}
  
 
openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1,
          width: 800,
          height: 800,
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    const toast = await this.toastCtrl.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.presentLoading(loading);
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    //uploads img to firebase storage
    this.firebaseService.uploadImage(image_src, randomId)
    .then(photoURL => {
      this.image = photoURL;
      loading.dismiss();
      toast.present();
    }, err =>{
      console.log(err);
    })
  }
 async presentLoading(loading) {
    return await loading.present();
  }

}
