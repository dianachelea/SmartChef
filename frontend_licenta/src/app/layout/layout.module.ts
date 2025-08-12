import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, MainLayoutComponent,],
  imports: [CommonModule, RouterModule,FormsModule],
  exports: [MainLayoutComponent]          
})
export class LayoutModule {}
