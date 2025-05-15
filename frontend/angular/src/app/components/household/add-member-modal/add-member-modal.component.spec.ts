import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AddMemberModalComponent } from './add-member-modal.component';
import { HouseholdRole } from '../../../models/household.model';
import * as HouseholdActions from '../../../store/household/household.actions';

describe('AddMemberModalComponent', () => {
  let component: AddMemberModalComponent;
  let fixture: ComponentFixture<AddMemberModalComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const initialState = {
    household: {
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddMemberModalComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberModalComponent);
    component = fixture.componentInstance;
    component.householdId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.memberForm.get('email')?.value).toBe('');
    expect(component.memberForm.get('role')?.value).toBe(HouseholdRole.MEMBER);
  });

  it('should validate email field', () => {
    const emailControl = component.memberForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate role field', () => {
    const roleControl = component.memberForm.get('role');

    roleControl?.setValue('');
    expect(roleControl?.valid).toBeFalsy();
    expect(roleControl?.errors?.['required']).toBeTruthy();

    roleControl?.setValue(HouseholdRole.MEMBER);
    expect(roleControl?.valid).toBeTruthy();
  });

  it('should dispatch addMember action on valid form submission', () => {
    const testEmail = 'test@example.com';
    const testRole = HouseholdRole.MEMBER;

    component.memberForm.patchValue({
      email: testEmail,
      role: testRole,
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      HouseholdActions.addMember({
        householdId: '1',
        email: testEmail,
        role: testRole,
      })
    );
  });

  it('should not dispatch action on invalid form submission', () => {
    component.memberForm.patchValue({
      email: 'invalid-email',
      role: '',
    });

    component.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should emit close event on cancel', () => {
    const closeSpy = jest.spyOn(component.close, 'emit');
    component.onCancel();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit close event after successful submission', () => {
    const closeSpy = jest.spyOn(component.close, 'emit');

    component.memberForm.patchValue({
      email: 'test@example.com',
      role: HouseholdRole.MEMBER,
    });

    component.onSubmit();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should display loading state', () => {
    store.setState({
      household: {
        ...initialState.household,
        loading: true,
      },
    });

    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.textContent.trim()).toBe('Adding...');
  });

  it('should display error message', () => {
    const errorMessage = 'Test error message';
    store.setState({
      household: {
        ...initialState.household,
        error: errorMessage,
      },
    });

    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.text-red-500');
    expect(errorElement.textContent.trim()).toBe(errorMessage);
  });
});
