import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserServiceService } from '../../core/services/user-service.service';
import { SubscriptionService } from '../../core/services/subscription.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userEmail = '';
  userCountry = '';
  subscriberCount = 0;

  constructor(
    private userService: UserServiceService,
    private subService: SubscriptionService
  ) {}
  
  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (!email) return;
  
    this.userEmail = email;
  
    this.userService.getPublicUsers().subscribe(users => {
      const currentUser = users.find(u => u.email === email);
      if (!currentUser) return;
  
      this.userCountry = currentUser.country;
      this.subService.getSubscriberCount(currentUser.id).subscribe((count: number) => {
        this.subscriberCount = count;
      });
    });
  }
  
  
}
