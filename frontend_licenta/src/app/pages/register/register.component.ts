import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService} from '../../core/services/user-service.service';
import { RegisterDto } from '../../core/models/register.model';
import { validEmailDomain, mustContainAtLeastOneSpecialCharacter, emailUniqueValidator, usernameUniqueValidator} from '../utils-validators/utils-validators.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  showPassword = false;
  errorMessage = '';
  countries: string[] = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Belize",
    "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", 
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Lucia", "Samoa", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa",
    "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];
  isPublic = false;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required], [usernameUniqueValidator(this.userService)]],
      email: ['', [Validators.required, Validators.email, validEmailDomain], [emailUniqueValidator(this.userService)]],
      password: ['', [Validators.required, Validators.minLength(6), mustContainAtLeastOneSpecialCharacter]],
      confirmPassword: [''],
      country: ['', Validators.required],
      isPublic: [false]
    }, { validators: this.passwordsMatchValidator });    
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const registerData: RegisterDto = {
      Username: this.form.value.username,
      Email: this.form.value.email,
      Password: this.form.value.password,
      Country: this.form.value.country,
      IsPublic: this.form.value.isPublic
    };
  
    this.userService.registerUser(registerData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        const message = err?.message || '';
        if (message.includes('Username')) {
          this.form.controls['username'].setErrors({ usernameTaken: true });
        }
        if (message.includes('Email')) {
          this.form.controls['email'].setErrors({ emailTaken: true });
        }
      }
    });
  }
  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

}
