import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserServiceService } from '../../core/services/user-service.service';
import { Component } from '@angular/core';

export function mustContainAtLeastOneSpecialCharacter(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  return hasSpecial ? null : { doesNotContainSpecialCharacter: true };
}

export function validEmailDomain(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toLowerCase();
  if (!value) return null;

  const allowedDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@gmail.ro', '@yahoo.ro','@hotmail.ro'];
  const isValid = allowedDomains.some(domain => value.endsWith(domain));

  return isValid ? null : { invalidDomain: true };
}

export function usernameUniqueValidator(userService: UserServiceService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return userService.getAllUsers().pipe(
      map(users => {
        const exists = users.some(u => u.username.toLowerCase() === control.value.toLowerCase());
        return exists ? { usernameTaken: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}

export function emailUniqueValidator(userService: UserServiceService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return userService.getAllUsers().pipe(
      map(users => {
        const exists = users.some(u => u.email?.toLowerCase() === control.value.toLowerCase());
        return exists ? { emailTaken: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}

