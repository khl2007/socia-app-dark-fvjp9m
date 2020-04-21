import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserfowlowComponent } from '../comps/userfowlow/userfowlow.component';
import { UserfolowersComponent } from '../comps/userfolowers/userfolowers.component';
import { IonicModule } from '@ionic/angular';

import { PublicprofilePageRoutingModule } from './publicprofile-routing.module';

import { PublicprofilePage } from './publicprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicprofilePageRoutingModule
  ],
  exports: [UserfowlowComponent,UserfolowersComponent],
  entryComponents: [UserfowlowComponent,UserfolowersComponent],
  declarations: [PublicprofilePage,UserfowlowComponent,UserfolowersComponent]
})
export class PublicprofilePageModule {}
