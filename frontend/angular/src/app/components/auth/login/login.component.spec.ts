import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';
import * as UserActions from '../../../store/user/user.actions';
import * as UserSelectors from '../../../store/user/user.selectors';
import { UserState, initialUserState } from '../../../store/user/user.state';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  const initialState = { user: initialUserState };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should show validation errors when form is submitted with empty fields', () => {
    component.onSubmit();
    expect(component.loginForm.get('email')?.errors?.['required']).toBeTruthy();
    expect(
      component.loginForm.get('password')?.errors?.['required']
    ).toBeTruthy();
  });

  it('should show email validation error for invalid email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should show password validation error for short password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should dispatch login action when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const testCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    component.loginForm.setValue(testCredentials);
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserActions.login(testCredentials)
    );
  });

  it('should show loading state', () => {
    store.overrideSelector(UserSelectors.selectUserLoading, true);
    store.refreshState();
    fixture.detectChanges();

    expect(component.loading).toBe(true);
  });

  it('should show error message', () => {
    const errorMessage = 'Invalid credentials';
    store.overrideSelector(UserSelectors.selectUserError, errorMessage);
    store.refreshState();
    fixture.detectChanges();

    expect(component.error).toBe(errorMessage);
  });

  it('should navigate on successful authentication', () => {
    store.overrideSelector(UserSelectors.selectIsAuthenticated, true);
    store.refreshState();
    fixture.detectChanges();

    // Navigation will be tested in E2E tests
  });

  it('should cleanup subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
