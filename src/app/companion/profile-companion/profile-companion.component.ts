import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/userData.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-companion',
  templateUrl: './profile-companion.component.html',
  styleUrls: ['./profile-companion.component.css']
})
export class ProfileCompanionComponent implements OnInit {

  userData: UserData;
  activities = ['Canoe','Cycling', 'Tinkering','Horseriding', 'Fishing']
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if(!this.userService.viewedUserData){
      this.userService.viewedUserDataUpdated.subscribe((userData: any) => {
        this.userData = userData;
        console.log(userData)
      })      
    }else{
      this.userData = this.userService.viewedUserData;
    }

  }

}
