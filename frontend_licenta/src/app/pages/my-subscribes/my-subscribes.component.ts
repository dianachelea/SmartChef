import { Component } from '@angular/core';
import { UserServiceService } from '../../core/services/user-service.service';
import { UserCredentials } from '../../core/services/user-service.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-subscribes',
  standalone: false,
  templateUrl: './my-subscribes.component.html',
  styleUrl: './my-subscribes.component.scss'
})
export class MySubscribesComponent {
  subs: UserCredentials[] = [];

  constructor(private userService: UserServiceService,private subService: SubscriptionService, private router: Router ) {}

  ngOnInit() {
    this.loadSubscribedUsers();
  }

  loadSubscribedUsers() {
    this.userService.getSubscribedUsers().subscribe(u => (this.subs = u));
  }

  toggleSub(userId: string) {
    this.subService.toggleSubscribe(userId).subscribe(() => {
      this.subs = this.subs.filter(u => u.id !== userId);
    });
  }

  viewProfile(userId: string) {
    this.router.navigate([`/community/${userId}`], {
    });
  }
}
