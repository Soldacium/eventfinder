import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-companions-list',
  templateUrl: './companions-list.component.html',
  styleUrls: ['./companions-list.component.css']
})
export class CompanionsListComponent implements OnInit {

  companionsRefs;
  companionsInfoArray = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserCompanions()
  }

  getUserCompanions(){
    if (!this.userService.viewedUserCollectionsIDs 
      && (!this.userService.viewedUserCompanions || this.userService.viewedUserCompanions.length === 0)){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userService.getUserCompanions(false).subscribe(companionsRefs => {
          this.companionsRefs = companionsRefs;
          this.getCompanionsBasicInfo();

        })
      });
    }else if (!this.userService.viewedUserCompanions){
      this.userService.getUserCompanions(false).subscribe(companionsRefs => {
        this.companionsRefs = companionsRefs;


        this.getCompanionsBasicInfo();

      });
    }else{
      this.companionsRefs = this.userService.viewedUserCompanions;

      this.getCompanionsBasicInfo();

    }
  }

  getCompanionsBasicInfo(){
    this.companionsRefs.forEach((companionRef) => {
      console.log(companionRef);
      this.companionsInfoArray.push(this.getUserBasicInfo(companionRef.dataID));
    });
  }

  getUserBasicInfo(userDataID){
    return this.userService.getBasicUserInfo(userDataID);
  }


}
