import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaincoursePageRoutingModule } from './maincourse-routing.module';

import { MaincoursePage } from './maincourse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaincoursePageRoutingModule
  ],
  declarations: [MaincoursePage]
})
export class MaincoursePageModule {}
