import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  active: boolean = false;
  authenticated: boolean = false;
  private authListenerSub: Subscription;
  
  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    
    this.authenticated = this.authService.getAuthStatus();
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.authenticated = isAuth;
    })
  }

  ngOnDestroy() {

  }

  change(){
    this.active = !this.active;
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

}
