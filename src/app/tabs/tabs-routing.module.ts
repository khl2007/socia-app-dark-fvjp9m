import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';


const routes: Routes = [


  {path: '',  component: TabsPage,  children : [
  
  {
    path: 'feed',
    loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'maincourse',
    loadChildren: () => import('../maincourse/maincourse.module').then( m => m.MaincoursePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../publicprofile/publicprofile.module').then( m => m.PublicprofilePageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('../chats/chats.module').then( m => m.ChatsPageModule)
  },{

    path:'', 
    redirectTo: '/tabs/feed',
    pathMatch: 'full'
    
  }
 
    ]}, {
      path:'**', redirectTo: '/tabs/feed', pathMatch: 'full'
    } 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
