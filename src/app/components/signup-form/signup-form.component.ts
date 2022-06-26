import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent {
  form = new FormGroup({
    fullName: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    }),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      this.passwordValidator(),
    ]),
  });

  successfulSubmit = false;

  get firstName(): AbstractControl | null | undefined {
    return this.form.get('fullName')?.get('firstName');
  }
  get lastName(): AbstractControl | null | undefined {
    return this.form.get('fullName')?.get('lastName');
  }

  get email(): AbstractControl | null {
    return this.form.get('email');
  }

  get password(): AbstractControl | null {
    return this.form.get('password');
  }

  constructor(private usersService: UsersService) {}

  validate(): void {
    const passLowerCase = this.password?.value?.toLowerCase() || '';
    if (
      passLowerCase.includes(this.firstName?.value?.toLowerCase()) ||
      passLowerCase.includes(this.lastName?.value?.toLowerCase())
    ) {
      this.password?.setErrors({
        ...this.password.errors,
        includesNames: true,
      });
    } else {
      const passErrors = Object.assign({}, this.password?.errors);
      delete passErrors['includesNames'];
      this.password?.setErrors(
        Object.keys(passErrors).length ? { ...passErrors } : null
      );
    }

    if (this.form.invalid) return;

    this.usersService
      .createUser({
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        email: this.email?.value,
      })
      .subscribe({
        next: () => {
          this.successfulSubmit = true;
        },
        error: (err) => {
          console.error(err);
          this.successfulSubmit = false;
        },
      });
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        if (control.value.length < 8) return { minLength: true };
        if (!control.value.match(/(?=.*[a-z])(?=.*[A-Z]).*/g))
          return { lowerUpper: true };
      }

      return null;
    };
  }
}
