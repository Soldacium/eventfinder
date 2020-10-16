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
    this.getProfileData()

  }

  getProfileData(){
    if(!this.userService.viewedUserData){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userService.getUserData(this.userService.viewedUserCollectionsIDs.userData).subscribe(data => {
          this.userData = data;
          console.log(data)
        })      
      })      
    }else{
      this.userData = this.userService.viewedUserData;
      console.log(this.userService.viewedUserData)
    }


  }

  getUserInvites(){
    this.userService.getUserInvites().subscribe(invites => {
      console.log(invites)
    })
  }

  checkIfCompanion(){

  }

}
