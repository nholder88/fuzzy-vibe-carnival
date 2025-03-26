import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import * as UserActions from '../../../store/user/user.actions';
import * as UserSelectors from '../../../store/user/user.selectors';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;
  let mockRouter: jest.Mocked<Router>;

  const initialState = {
    user: {
      loading: false,
      error: null,
      isAuthenticated: false,
    },
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();

    const email = form.get('email');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    expect(email?.errors?.['required']).toBeTruthy();
    expect(password?.errors?.['required']).toBeTruthy();
    expect(confirmPassword?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.registerForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.errors?.['email']).toBeTruthy();

    email?.setValue('valid@email.com');
    expect(email?.errors?.['email']).toBeFalsy();
  });

  it('should validate password length', () => {
    const password = component.registerForm.get('password');
    password?.setValue('12345');
    expect(password?.errors?.['minlength']).toBeTruthy();

    password?.setValue('123456');
    expect(password?.errors?.['minlength']).toBeFalsy();
  });

  it('should validate password match', () => {
    const form = component.registerForm;
    form.get('password')?.setValue('password123');
    form.get('confirmPassword')?.setValue('password456');
    expect(form.errors?.['mismatch']).toBeTruthy();

    form.get('confirmPassword')?.setValue('password123');
    expect(form.errors?.['mismatch']).toBeFalsy();
  });

  it('should not submit if form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch register action on valid form submission', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    component.registerForm.patchValue({
      ...testUser,
      confirmPassword: testUser.password,
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserActions.register({
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      })
    );
  });

  it('should handle optional first and last name fields', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    component.registerForm.patchValue({
      ...testUser,
      confirmPassword: testUser.password,
      firstName: '',
      lastName: '',
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserActions.register({
        email: testUser.email,
        password: testUser.password,
        firstName: undefined,
        lastName: undefined,
      })
    );
  });

  it('should update loading state from store', () => {
    store.setState({
      user: {
        ...initialState.user,
        loading: true,
      },
    });
    store.refreshState();
    fixture.detectChanges();
    expect(component.loading).toBe(true);
  });

  it('should update error state from store', () => {
    const errorMessage = 'Registration failed';
    store.setState({
      user: {
        ...initialState.user,
        error: errorMessage,
      },
    });
    store.refreshState();
    fixture.detectChanges();
    expect(component.error).toBe(errorMessage);
  });

  it('should attempt to navigate when authenticated', () => {
    const mockSelectIsAuthenticated = store.overrideSelector(
      UserSelectors.selectIsAuthenticated,
      true
    );

    store.refreshState();
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('form validation', () => {
    it('should validate required fields', () => {
      const form = component.registerForm;
      expect(form.valid).toBeFalsy();

      form.controls['email'].setValue('');
      form.controls['password'].setValue('');
      form.controls['confirmPassword'].setValue('');
      expect(form.valid).toBeFalsy();
      expect(form.controls['email'].errors?.['required']).toBeTruthy();
      expect(form.controls['password'].errors?.['required']).toBeTruthy();
      expect(
        form.controls['confirmPassword'].errors?.['required']
      ).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.controls['email'];
      emailControl.setValue('invalid-email');
      expect(emailControl.errors?.['email']).toBeTruthy();

      emailControl.setValue('valid@email.com');
      expect(emailControl.errors).toBeNull();
    });

    it('should validate password length', () => {
      const passwordControl = component.registerForm.controls['password'];
      passwordControl.setValue('12345');
      expect(passwordControl.errors?.['minlength']).toBeTruthy();

      passwordControl.setValue('123456');
      expect(passwordControl.errors).toBeNull();
    });

    it('should validate password match', () => {
      const form = component.registerForm;
      form.controls['password'].setValue('password123');
      form.controls['confirmPassword'].setValue('password456');
      expect(form.errors?.['mismatch']).toBeTruthy();

      form.controls['confirmPassword'].setValue('password123');
      expect(form.errors).toBeNull();
    });

    it('should not submit if form is invalid', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onSubmit();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should submit if form is valid', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const form = component.registerForm;

      form.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserActions.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        })
      );
    });

    it('should handle optional fields correctly', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const form = component.registerForm;

      form.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserActions.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: undefined,
          lastName: undefined,
        })
      );
    });
  });
});
