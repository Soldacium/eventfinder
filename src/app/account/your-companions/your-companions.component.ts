import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-your-companions',
  templateUrl: './your-companions.component.html',
  styleUrls: ['./your-companions.component.css']
})
export class YourCompanionsComponent implements OnInit {

  companionsRefs = [];
  companionsInfoArray;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  getUserCompanions(){
    this.userService.getUserCompanions(true).subscribe(companions => {
      this.companionsRefs = companions;
      this.companionsInfoArray = Array(this.companionsRefs.length)
      
      this.companionsRefs.forEach((companionRef,i) => {
        this.companionsInfoArray[i] = this.userService.getBasicUserInfo(companionRef.userDataID).subscribe(userInfo => {
          return userInfo;
        })
      })
    })
  }

  checkIfReady(){

  }

}
