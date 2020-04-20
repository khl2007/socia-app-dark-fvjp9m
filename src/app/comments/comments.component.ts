import { Component, OnInit , Input} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from "../services/firebase.service";
import { Observable } from "rxjs";

import { map } from "rxjs/operators";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  

  @Input() poid: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

comment : any;

comments : any;

commentLen = 0;

  constructor(public moCtrl: ModalController,private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getComments(this.poid); 
  }

 dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.moCtrl.dismiss({
      'dismissed': true
    });
  }
  

getComments(pid) {
    this.firebaseService.getComments(pid).subscribe(res => {
  // console.log(res);
   
   this.comments = res;
   });
  }
  
addcomm(){

   this.firebaseService.addComment(this.poid ,this.comment);
this.comment ='';
}
  
}
