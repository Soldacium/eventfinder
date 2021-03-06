import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/userData.model';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  userData: UserData;

  invitations;
  invateState = '';
  constructor(private userService: UserService,
              private messagesService: MessagesService) { }

  ngOnInit(): void {
    this.getProfileData();


  }

  getProfileData(){
    if (!this.userService.viewedUserData){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userService.getUserData(this.userService.viewedUserCollectionsIDs.userData).subscribe(data => {
          this.userData = data;
        });

        this.checkIfCompanion();
      });
    }else{
      this.userData = this.userService.viewedUserData;
      this.checkIfCompanion();
    }


  }



  searchForUserInvite(){
    const viewedUserID = this.userService.viewedUserID;

    this.invitations.to ? this.invitations.to.forEach(toInvite => {
      if (toInvite.ID === viewedUserID){
        this.invateState = 'toInvite';
      }
    }) : '';

    this.invitations.from ? this.invitations.from.forEach(fromInvite => {
      if (fromInvite.ID === viewedUserID){
        this.invateState = 'fromInvite';
      }
    }) : '';
  }

  checkIfCompanion(){
    this.userService.getCompanion(this.userService.getCurrentUserID(), false).subscribe(companion => {

      if (companion){
        console.log(companion);
      }
    });
  }


  acceptCompanionInvite(){
    this.userService.acceptUserCompanionInvite().subscribe(res => {
      console.log(res);
      this.messagesService.createNewUserConversation(this.userService.getViewedUserID(), this.userService.getCurrentUserID());
    });
  }

  deleteFromCompanions(){
    this.userService.deleteUserCompanion(this.userService.getViewedUserCollectionsIDs()).subscribe(res => {
      this.messagesService.deleteUserConversation();
    });
  }

  sendCompanionInvite(){
    this.userService.sendUserCompanionInvite().subscribe(invite => {
      console.log(invite);
      this.invateState = 'toInvite';
    });
  }

  cancelCompanionInvite(){
    this.userService.cancelUserCompanionInvite(this.userService.getViewedUserID()).subscribe(invite => {
      console.log(invite);
      this.invateState = '';
    });
  }


}
