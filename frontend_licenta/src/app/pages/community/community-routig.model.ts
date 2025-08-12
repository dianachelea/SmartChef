// src/app/pages/community/community-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './community.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: CommunityComponent },
  { path: ':id', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule {}
