import { TestBed } from '@angular/core/testing';
import { householdReducer, initialState } from './household.reducer';
import * as HouseholdActions from './household.actions';
import { Household, HouseholdRole } from '../../models/household.model';

describe('Household Reducer', () => {
  const mockHousehold: Household = {
    id: '1',
    name: 'Test Household',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
    activities: [],
  };

  it('should return the initial state', () => {
    const action = { type: 'NOOP' };
    const result = householdReducer(undefined, action);
    expect(result).toBe(initialState);
  });

  it('should handle loadHouseholds', () => {
    const action = HouseholdActions.loadHouseholds();
    const result = householdReducer(initialState, action);
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loadHouseholdsSuccess', () => {
    const households = [mockHousehold];
    const action = HouseholdActions.loadHouseholdsSuccess({ households });
    const result = householdReducer(initialState, action);
    expect(result.households).toEqual(households);
    expect(result.loading).toBe(false);
  });

  it('should handle loadHouseholdsFailure', () => {
    const error = 'Error loading households';
    const action = HouseholdActions.loadHouseholdsFailure({ error });
    const result = householdReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should handle createHousehold', () => {
    const action = HouseholdActions.createHousehold({
      name: 'New Household',
      description: 'New Description',
    });
    const result = householdReducer(initialState, action);
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle createHouseholdSuccess', () => {
    const action = HouseholdActions.createHouseholdSuccess({
      household: mockHousehold,
    });
    const result = householdReducer(initialState, action);
    expect(result.households).toContain(mockHousehold);
    expect(result.loading).toBe(false);
  });

  it('should handle createHouseholdFailure', () => {
    const error = 'Error creating household';
    const action = HouseholdActions.createHouseholdFailure({ error });
    const result = householdReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should handle updateHousehold', () => {
    const action = HouseholdActions.updateHousehold({
      id: '1',
      name: 'Updated Household',
      description: 'Updated Description',
    });
    const result = householdReducer(initialState, action);
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle updateHouseholdSuccess', () => {
    const updatedHousehold = { ...mockHousehold, name: 'Updated Name' };
    const state = { ...initialState, households: [mockHousehold] };
    const action = HouseholdActions.updateHouseholdSuccess({
      household: updatedHousehold,
    });
    const result = householdReducer(state, action);
    expect(result.households[0].name).toBe('Updated Name');
    expect(result.loading).toBe(false);
  });

  it('should handle updateHouseholdFailure', () => {
    const error = 'Error updating household';
    const action = HouseholdActions.updateHouseholdFailure({ error });
    const result = householdReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should handle deleteHousehold', () => {
    const action = HouseholdActions.deleteHousehold({ id: '1' });
    const result = householdReducer(initialState, action);
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle deleteHouseholdSuccess', () => {
    const state = { ...initialState, households: [mockHousehold] };
    const action = HouseholdActions.deleteHouseholdSuccess({ id: '1' });
    const result = householdReducer(state, action);
    expect(result.households).not.toContain(mockHousehold);
    expect(result.loading).toBe(false);
  });

  it('should handle deleteHouseholdFailure', () => {
    const error = 'Error deleting household';
    const action = HouseholdActions.deleteHouseholdFailure({ error });
    const result = householdReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should handle addMember', () => {
    const action = HouseholdActions.addMember({
      householdId: '1',
      email: 'test@example.com',
      role: HouseholdRole.MEMBER,
    });
    const result = householdReducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should handle addMemberSuccess', () => {
    const member = {
      id: '1',
      userId: '1',
      householdId: '1',
      role: HouseholdRole.MEMBER,
      joinedAt: new Date(),
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
    };
    const state = { ...initialState, selectedHousehold: mockHousehold };
    const action = HouseholdActions.addMemberSuccess({ member });
    const result = householdReducer(state, action);
    expect(result.selectedHousehold?.members).toContain(member);
    expect(result.loading).toBe(false);
  });

  it('should handle addMemberFailure', () => {
    const error = 'Error adding member';
    const action = HouseholdActions.addMemberFailure({ error });
    const result = householdReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });

  it('should handle removeMember', () => {
    const action = HouseholdActions.removeMember({
      householdId: '1',
      memberId: '1',
    });
    const result = householdReducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should handle removeMemberSuccess', () => {
    const member = {
      id: '1',
      userId: '1',
      householdId: '1',
      role: HouseholdRole.MEMBER,
      joinedAt: new Date(),
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
    };
    const state = {
      ...initialState,
      selectedHousehold: { ...mockHousehold, members: [member] },
    };
    const action = HouseholdActions.removeMemberSuccess({
      householdId: '1',
      memberId: '1',
    });
    const result = householdReducer(state, action);
    expect(result.selectedHousehold?.members).not.toContain(member);
    expect(result.loading).toBe(false);
  });

  it('should handle removeMemberFailure', () => {
    const error = 'Error removing member';
    const action = HouseholdActions.removeMemberFailure({ error });
    const result = householdReducer(initialState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });
});
