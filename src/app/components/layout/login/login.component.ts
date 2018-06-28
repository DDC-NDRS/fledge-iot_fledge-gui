import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';

import { AlertService, AuthService, PingService, UserService } from '../../../services';
import { SharedService } from '../../../services/shared.service';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private sharedService: SharedService,
    private userService: UserService,
    private ping: PingService,
    public ngProgress: NgProgress) {
    this.sharedService.isUserLoggedIn.next({
      'loggedIn': false
    });
  }

  ngOnInit() {
    // clear session
    this.resetSession();
  }

  /**
   *  login user into system
   */
  login() {
    this.ngProgress.start();
    this.authService.login(this.model.username, this.model.password).
      subscribe(
        (data) => {
          const pingInterval = JSON.parse(localStorage.getItem('PING_INTERVAL'));
          this.ping.pingIntervalChanged.next(pingInterval);
          this.ngProgress.done();
          sessionStorage.setItem('token', data['token']);
          sessionStorage.setItem('uid', data['uid']);
          sessionStorage.setItem('isAdmin', JSON.stringify(data['admin']));
          this.getUser(data['uid']);
          this.router.navigate([''],  {replaceUrl : true});
        },
        error => {
          this.ngProgress.done();
          if (error.status === 0) {
            console.log('service down', error);
          } else if (error.status === 401) {
            // to open reset password screen
            if (error.statusText.toUpperCase().indexOf('PASSWORD') >= 0
              && error.statusText.toUpperCase().indexOf('EXPIRED') >= 0) {
              this.router.navigate(['/user/reset-password'], { queryParams: { username: this.model.username } });
            }
            this.alertService.error(error.statusText, true);
          } else {
            this.alertService.error(error.statusText, true);
          }
        });
  }

  public setupInstance() {
    this.router.navigate(['/setting'], { queryParams: { id: '1' } });
  }

  getUser(id) {
    // Get SignedIn user details
    this.userService.getUser(id)
      .subscribe(
        (userData) => {
          this.sharedService.isUserLoggedIn.next({
            'loggedIn': true,
            'userName': userData['userName']
          });
          sessionStorage.setItem('userName', userData['userName']);
        },
        error => {
          if (error.status === 0) {
            console.log('service down ', error);
          } else {
            this.alertService.error(error.statusText);
          }
        });
  }

  public resetSession() {
    sessionStorage.clear();
  }

  public forgotPassword() {
    this.alertService.warning('Please ask the administrator to reset your password.');
  }
}
