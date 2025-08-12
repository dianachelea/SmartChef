import { Component, OnInit } from '@angular/core';
import { UserServiceService, UserCredentials } from '../../core/services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: false,
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  users: UserCredentials[] = [];
  countries: string[] = [];
  selectedCountry = '';
  subscriberCount: number = 0;
  constructor(private userService: UserServiceService, private router: Router) {}

  subscriberCounts: { [key: string]: number } = {};

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const currentEmail = localStorage.getItem('email');
    this.userService.getPublicUsers(this.selectedCountry).subscribe(users => {
      this.users = users.filter(u => u.email !== currentEmail);
      this.extractCountries(this.users);
      
      this.users.forEach(u => {
        this.userService.getSubscribersCount(u.id).subscribe(count => {
          this.subscriberCounts[u.id] = count;
        });
      });
    });
  }

  onCountryChange() {
    this.loadUsers();
  }

  viewUser(user: UserCredentials) {
    if (!user?.id) {
      console.error('Invalid user passed to viewUser()', user);
      return;
    }
    this.router.navigate(['/community', user.id]);
  }
  extractCountries(users: UserCredentials[]) {
    this.countries = Array.from(new Set(users.map(u => u.country))).sort();
  }
}
