import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { UserState } from '../../store/user/user.state';
import { selectIsAuthenticated } from '../../store/user/user.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
})
export class HomeComponent {
  authService: any;
  selectIsAuthenticated: any;
  constructor() {
    this.selectIsAuthenticated = selectIsAuthenticated;
  }
}
