import { fakeAsync, tick } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { IdObject } from 'src/app/core/services/interfaces/id-object.interface';
import { UsersService } from 'src/app/core/services/users.service';
import { SignupFormComponent } from './signup-form.component';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let usersService: jasmine.SpyObj<UsersService>;
  let $usersServiceCreate = new Subject<IdObject>();

  beforeEach(() => {
    usersService = jasmine.createSpyObj<UsersService>({
      createUser: $usersServiceCreate.asObservable(),
    });

    component = new SignupFormComponent(usersService);
  });

  it('should create comopnent', () => {
    expect(component).toBeTruthy();
    expect(component.successfulSubmit).toBeFalsy();
  });

  it('should require all fields', () => {
    // given
    const errorObj = {
      firstName: component.firstName?.errors,
      lastName: component.firstName?.errors,
      email: component.firstName?.errors,
      password: component.firstName?.errors,
    };

    // then
    expect(errorObj).toEqual({
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true },
      password: { required: true },
    });
  });

  it('should validate password min length', () => {
    // given
    component.password?.setValue('1234');

    // then
    expect(component.password?.errors).toEqual({ minLength: true });
  });

  it('should validate password missing uppercase', () => {
    // given
    component.password?.setValue('abcdefgh');

    // then
    expect(component.password?.errors).toEqual({ lowerUpper: true });
  });

  it('should validate password missing lowercase', () => {
    // given
    component.password?.setValue('ABCDEFGH');

    // then
    expect(component.password?.errors).toEqual({ lowerUpper: true });
  });

  it('should validate password containing first name', () => {
    // given
    component.firstName?.setValue('Jon');
    component.password?.setValue('ABCDEjoNFGH');

    // when
    component.validate();

    // then
    expect(component.password?.errors).toEqual({ includesNames: true });
  });

  it('should validate valid email', () => {
    // given
    component.email?.setValue('abc.com');

    // then
    expect(component.email?.errors).toEqual({ email: true });
  });

  it('should accept valid form', fakeAsync(() => {
    // given
    component.firstName?.setValue('Jon');
    component.lastName?.setValue('Doe');
    component.email?.setValue('abc@def.com');
    component.password?.setValue('aBCdEfgH');

    const errorObj = {
      firstName: component.firstName?.errors,
      lastName: component.firstName?.errors,
      email: component.firstName?.errors,
      password: component.firstName?.errors,
    };

    // when
    component.validate();
    $usersServiceCreate.next({ _id: 'id_123456' });
    tick();

    // then
    expect(errorObj).toEqual({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    });
    expect(component.form.valid).toBeTruthy();
    expect(component.successfulSubmit).toBeTruthy();
  }));

  it('should catch service error', fakeAsync(() => {
    // given
    component.firstName?.setValue('Jon');
    component.lastName?.setValue('Doe');
    component.email?.setValue('abc@def.com');
    component.password?.setValue('aBCdEfgH');

    const errorObj = {
      firstName: component.firstName?.errors,
      lastName: component.firstName?.errors,
      email: component.firstName?.errors,
      password: component.firstName?.errors,
    };

    // when
    component.validate();
    $usersServiceCreate.error(new Error('service error'));
    tick();

    // then
    expect(errorObj).toEqual({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    });
    expect(component.form.valid).toBeTruthy();
    expect(component.successfulSubmit).toBeFalsy();
  }));
});
