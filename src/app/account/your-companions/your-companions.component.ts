import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-your-companions',
  templateUrl: './your-companions.component.html',
  styleUrls: ['./your-companions.component.css']
})
export class YourCompanionsComponent implements OnInit {

  viewedCompanion = '';
  companionsRefs;
  companionsInfoArray = [];

  searchedCompanions;

  searchQuery = '';

  invites = {
    to: [],
    from: []
  };
  invitesInfoArray = {
    to: [],
    from: []
  };


  invitesShown = false;
  invitesTypeShown = true;
  userData;
  constructor(
    private userService: UserService,
    private messagesService: MessagesService) { }

  ngOnInit(): void {
    this.getUserCompanions();
    this.getProfileData();
    this.getUserInvites();
  }

  getProfileData(){
    if (!this.userService.viewedUserData){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userService.getUserData(this.userService.viewedUserCollectionsIDs.userData).subscribe(data => {
          this.userData = data;
        });
      });
    }else{
      this.userData = this.userService.viewedUserData;
    }


  }

  getUserInvites(){
    console.log(this.userService.getCurrentUserID(), this.userService.currentUserInvites);
    if (!this.userService.getCurrentUserID() && !this.userService.currentUserInvites){
      this.userService.currentUserUpdated.subscribe(update => {
        this.userService.getUserInvites().subscribe(invites => {
          this.invites = invites;
          console.log(this.invites);
          this.getUserInvitesBasicInfo();
        });
      });
    }else if(!this.userService.currentUserInvites){
      this.userService.getUserInvites().subscribe(invites => {
        this.invites = invites;
        console.log(this.invites);
        this.getUserInvitesBasicInfo();
      });
    }else{
      console.log(this.userService.currentUserInvites);
      this.invites = this.userService.currentUserInvites;
    }
  }

  getUserInvitesBasicInfo(){
    this.invites.from.forEach(inviteFrom => {
      this.invitesInfoArray.from.push(this.getUserBasicInfo(inviteFrom.dataID));
    });

    this.invites.to.forEach(inviteTo => {
      this.invitesInfoArray.to.push(this.getUserBasicInfo(inviteTo.dataID));
    });

    console.log(this.invitesInfoArray);
  }


  acceptCompanionInvite(companion){

    this.userService.acceptUserCompanionInvite(companion).subscribe(res => {
      this.messagesService.createNewUserConversation(companion.ID,this.userService.getCurrentUserID())
    });
  }

  deleteFromCompanions(companion){
    this.userService.deleteUserCompanion(companion).subscribe(res => {
      console.log(res)
    })
  }
  cancelCompanionInvite(invitesArray, invitesInfoArray, index: number){
    const userIDs = invitesArray[index];
    const userID = userIDs.ID;
    const userCompanionsID = userIDs.companionsID;
    this.userService.cancelUserCompanionInvite(userID, userCompanionsID).subscribe(invite => {
      invitesArray.splice(index, 1);
      invitesInfoArray.splice(index, 1);
      console.log(invite);

    });
  }

  getUserCompanions(){
    if (!this.userService.getCurrentUser() && !this.userService.currentUserCompanions){
      this.userService.currentUserUpdated.subscribe(ready => {
        this.userService.getUserCompanions(true).subscribe(companionsRefs => {
          this.companionsRefs = companionsRefs;

          this.getCompanionsBasicInfo();

        })
      });
    }else if (!this.userService.currentUserCompanions){
      this.userService.getUserCompanions(true).subscribe(companionsRefs => {
        this.companionsRefs = companionsRefs;

        this.getCompanionsBasicInfo();

      });
    }else{
      this.companionsRefs = this.userService.currentUserCompanions;
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

  searchCompanions(){

  }

  checkIfReady(){

  }


  checkIfCompanion(){
    this.userService.getCompanion(this.userService.getViewedUserID()).subscribe(companion => {
      if (companion){
        console.log(companion);
      }
    });
  }

  sendCompanionInvite(){
    this.userService.sendUserCompanionInvite().subscribe(invite => {
      console.log(invite);
    });
  }

  nextPage(){

  }

  prevPage(){

  }

  openOptions(companion, event){
    this.viewedCompanion = companion;
    console.log(this.companionsRefs, this.viewedCompanion, this.companionsRefs[0] == this.viewedCompanion)
    event.stopPropagation();
  }

  deleteCompanion(){
    this.userService.deleteUserCompanion(this.viewedCompanion).subscribe(res => {
      console.log(res)
    })
  }

  blockCompanion(){
    console.log('not implemented')
  }

}
