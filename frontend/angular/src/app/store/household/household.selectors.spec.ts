import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  selectHouseholdState,
  selectAllHouseholds,
  selectSelectedHousehold,
  selectHouseholdActivities,
  selectHouseholdLoading,
  selectHouseholdError,
  selectHouseholdMembers,
  selectIsHouseholdAdmin,
  selectHouseholdById,
} from './household.selectors';
import { Household, HouseholdRole } from '../../models/household.model';

describe('Household Selectors', () => {
  let store: MockStore;
  const initialState = {
    household: {
      households: [],
      selectedHousehold: null,
      activities: [],
      loading: false,
      error: null,
    },
  };

  const mockHousehold: Household = {
    id: '1',
    name: 'Test Household',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      {
        id: '1',
        userId: '1',
        householdId: '1',
        role: HouseholdRole.ADMIN,
        joinedAt: new Date(),
        user: {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    ],
    activities: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the household state', () => {
    const result = selectHouseholdState.projector(initialState.household);
    expect(result).toEqual(initialState.household);
  });

  it('should select all households', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        households: [mockHousehold],
      },
    };
    const result = selectAllHouseholds.projector(state.household);
    expect(result).toEqual([mockHousehold]);
  });

  it('should select the selected household', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        selectedHousehold: mockHousehold,
      },
    };
    const result = selectSelectedHousehold.projector(state.household);
    expect(result).toEqual(mockHousehold);
  });

  it('should select household activities', () => {
    const activities = [
      {
        id: '1',
        description: 'Test Activity',
        createdAt: new Date(),
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      },
    ];
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        activities,
      },
    };
    const result = selectHouseholdActivities.projector(state.household);
    expect(result).toEqual(activities);
  });

  it('should select loading state', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        loading: true,
      },
    };
    const result = selectHouseholdLoading.projector(state.household);
    expect(result).toBe(true);
  });

  it('should select error state', () => {
    const error = 'Test Error';
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        error,
      },
    };
    const result = selectHouseholdError.projector(state.household);
    expect(result).toBe(error);
  });

  it('should select household members', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        selectedHousehold: mockHousehold,
      },
    };
    const result = selectHouseholdMembers.projector(
      state.household.selectedHousehold
    );
    expect(result).toEqual(mockHousehold.members);
  });

  it('should select is admin state', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        selectedHousehold: mockHousehold,
      },
    };
    const result = selectIsHouseholdAdmin.projector(
      state.household.selectedHousehold
    );
    expect(result('1')).toBe(true);
  });

  it('should select household by id', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        households: [mockHousehold],
      },
    };
    const result = selectHouseholdById('1').projector(
      state.household.households
    );
    expect(result).toEqual(mockHousehold);
  });

  it('should return null when household not found by id', () => {
    const state = {
      ...initialState,
      household: {
        ...initialState.household,
        households: [mockHousehold],
      },
    };
    const result = selectHouseholdById('2').projector(
      state.household.households
    );
    expect(result).toBeNull();
  });
});
