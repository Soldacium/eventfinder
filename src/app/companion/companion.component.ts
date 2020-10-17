import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserData } from '../models/userData.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-companion',
  templateUrl: './companion.component.html',
  styleUrls: ['./companion.component.css']
})
export class CompanionComponent implements OnInit, OnDestroy {

  userID;
  userData: UserData;
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private userService: UserService,
    public router: Router) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0

    
    this.setViewedUserID();
    this.setTitle();
    this.userService.getViewedUserCollectionsIDs(this.userID).subscribe(IDs => {
      //console.log(IDs)
    })
  }

  ngOnDestroy() {
    this.userService.clearViewedUser();
  }

  setViewedUserID(){
    this.route.params.subscribe(params => {
      this.userID= params['userID'];
      this.userService.viewedUserID = this.userID;
    });
  }

  public setTitle() {
    this.route.queryParams.subscribe(qparams => {
      this.titleService.setTitle( 'User Profile');
    })
    
  }

  setUserData(){
    
  }

  

}
