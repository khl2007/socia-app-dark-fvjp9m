import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotficationPageRoutingModule } from './notfication-routing.module';

import { NotficationPage } from './notfication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotficationPageRoutingModule
  ],
  declarations: [NotficationPage]
})
export class NotficationPageModule {}
