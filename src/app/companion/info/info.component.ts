import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/userData.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  userData: UserData;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  getProfileData(){
    this.userService.getUserData(this.userService.getViewedUserID()).subscribe(data => {
      this.userData = data;
    })
  }

}
