import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../store/user/user.state';
import { Observable } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let userSubject: BehaviorSubject<User | null>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    isAuthenticated: true,
  };

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);
    const authServiceSpy = {
      user$: userSubject.asObservable(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', async () => {
    userSubject.next(mockUser);

    const result = await firstValueFrom(
      guard.canActivate() as Observable<boolean | UrlTree>
    );
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', async () => {
    userSubject.next(null);
    const urlTree = router.createUrlTree(['/login']);

    const result = await firstValueFrom(
      guard.canActivate() as Observable<boolean | UrlTree>
    );
    expect(result).toEqual(urlTree);
  });

  it('should take only one value from the user$ stream', async () => {
    let emissionCount = 0;
    userSubject.next(mockUser);

    const canActivate$ = guard.canActivate() as Observable<boolean | UrlTree>;
    canActivate$.subscribe(() => {
      emissionCount++;
    });

    await firstValueFrom(canActivate$);
    userSubject.next(null);

    // Wait a bit to ensure no more emissions
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(emissionCount).toBe(1);
  });
});
