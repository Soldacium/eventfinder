import { Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import * as C from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { UserData } from 'src/app/models/userData.model';
import { Canvas } from 'leaflet';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  userProfileIsEdited = true;
  /* image + async check if posted */
  public imagePath;
  previousImageUrl = 'assets/images/BGs/festival.jpg';
  imageURL: any = 'assets/images/BGs/festival.jpg';

  imageFile;

  public backgroundImagePath;
  previousBackgroundImageUrl = 'assets/images/BGs/festival.jpg';
  backgroundImageURL: any = 'assets/images/BGs/festival.jpg';

  backgroundImageFile;


  posted = false;
  auth; authSub;

  user: UserData;

  userProfileInfo = {
    username: '',
    phone: '',
    address: '',

    website1: '',
    website2: '',

    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    email: '',

    activities: []

  };

  options = {
    profileVisible: false,
    savedEventsVisible: false,
    companionsVisible: false,
    madeEventsVisible: false,
    feedVisible: false,
    emailSpecsVisible: false,
    userHashCodeAllow: false
  };


  public desc = {
    title: 'a post',
    editorData: '<p>Your own description, click to change!</p>'
  };

  possibleActivities = [
    'Canoe' , 'Swimming', 'Fishing', 'Cycling', 'Walking', 'Hiking', 'Camping', 'Nature',
  'Winning', 'Reading', 'Knowledge', 'Meditation', 'Peace', 'Connection', 'Travel',
  'Meeting', 'Horseriding', 'Tinkering', 'Gaming'];
  chosenActivities = []


  /* dummy data to be changed */
  typeStats = [
    {
      type: 'Party',
      value: 34
    },
    {
      type: 'Meeting',
      value: 12
    },
    {
      type: 'Concert',
      value: 7
    },
  ];






  constructor(
    private authService: AuthService,
    private userService: UserService,
    private sanatizer: DomSanitizer) { }

  ngOnInit(): void {
    this.makeCharts();
    this.getUserProfileInfo();
  }





  getUserProfileInfo(){
    this.getUserData();

    this.setupUserImageListener();
    this.setupUserListener();
  }



  /* IMAGES */


  setupUserImageListener(){
    this.authService.getUserImageListener().subscribe(newImageUrl => {
      this.imageURL = newImageUrl;
    });
  }
  previewImage(files) {

    if (files.length === 0) { return; }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) { return; }

    const reader = new FileReader();
    this.imageFile = files[0];
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imageURL = reader.result;
    };
  }
  previewBackgroundImage(files){
    if (files.length === 0) { return; }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) { return; }

    const reader = new FileReader();
    this.backgroundImageFile = files[0];
    this.backgroundImagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.backgroundImageURL = reader.result;
    };
  }
  clickImage(){
    document.getElementById('selectedFile').click();
  }
  clickBackgroundImage(){
    document.getElementById('selectedBackgroundFile').click();
  }

  updateUserImage(){
    this.userService.updateUserImage(this.imageFile).subscribe(user => {
      this.imageURL = user.image;
      this.imagePath = undefined;
    });
  }

  cancelUpdatingUserImage(){
    this.imageURL = this.previousImageUrl;
    this.imagePath = undefined;
  }

  updateUserBackgroundImage(){
    this.userService.updateUserBackgroundImage(this.backgroundImageFile).subscribe(user => {
      this.backgroundImageURL = user.backgroundImage;
      this.backgroundImagePath = undefined;
    });
  }
  cancelUpdatingUserBackgroundImage(){
    this.backgroundImageURL = this.previousBackgroundImageUrl;
    this.backgroundImagePath = undefined;
  }






  /* USER INFO */
  /* Activities */
  pickActivity(activity) {
    const isTag = this.chosenActivities.includes(activity);
    if (isTag == false) {
      this.chosenActivities.push(activity);
    } else {
      this.chosenActivities.splice(this.chosenActivities.indexOf(activity), 1);
    }
  }

  setupUserListener(){
    this.authService.getUserListener()
    .subscribe((user: any) => {

      this.getUserData();

    });
  }

  getUserData(){
    console.log(this.user, '1')
    console.log(this.userService.getCurrentUserID())
    if (this.userService.getCurrentUserID() && !this.userService.getCurrentUserData()){
      this.userService.getUserData(this.userService.getCurrentUserID(), true).subscribe(userData => {
        this.user = userData;
        console.log(this.user, '2')
        if (this.user){
          this.setUserData(this.user);
        }
      });
    }else if (this.userService.getCurrentUserID()){
      console.log('yass')
      this.user = this.userService.getCurrentUserData();
      console.log(this.user, '3')
      this.setUserData(this.user);
    }
    
  }

  setUserData(user: UserData){
    this.user = user;
    this.desc.editorData = this.user.desc;
    console.log(user);
    this.chosenActivities = user.activities || [];
    this.userProfileInfo  = {
      username: this.user.username,
      phone: this.user.phone,
      address: this.user.address,

      website1: this.user.website1,
      website2: this.user.website2,

      instagram: this.user.instagram,
      facebook: this.user.facebook,
      linkedin: this.user.linkedin,
      twitter: this.user.twitter,
      email: this.user.email,
      activities: this.user.activities || []
    };
    if (this.user.image && this.user.image !== ''){
      this.imageURL = this.user.image;
      this.previousImageUrl = this.imageURL;

      this.backgroundImageURL = this.user.backgroundImage;
      this.previousBackgroundImageUrl = this.backgroundImageURL;
    }
  }

  editUserProfileInfo(){
    if (this.userProfileIsEdited){
      this.desc.editorData = this.sanatizer.sanitize(SecurityContext.HTML, this.desc.editorData);
      this.userProfileInfo.activities = this.chosenActivities;
      this.userService.updateUserData(

        this.userProfileInfo, this.desc.editorData).subscribe();
    }
    this.userProfileIsEdited = !this.userProfileIsEdited;
  }






  /**
   * STATS CHARTS
   *
   */
  makeCharts(){
    const ctx: any = document.querySelector('.stats-types');
    ctx.getContext('2d');

    const ctx2: any = document.querySelector('.stats-activity');
    ctx2.getContext('2d');

    const labels = [];
    const data = [];
    const labelBGs = [];
    this.typeStats.forEach(stat => {
      labels.push(stat.type);
      data.push(stat.value);
      labelBGs.push(`hsl(${230 + stat.value * 3},100%,50%)`);
    });

    this.makeEventTypesChart(ctx, labels, labelBGs, data);
    this.makeUserActivityChart(ctx2, labels, labelBGs, data);
  }

  makeEventTypesChart(ctx: CanvasRenderingContext2D, labels, labelBGs, data){
    const chart = new C.Chart(ctx, {
      type: 'pie',
      data: {
          labels,
          datasets: [{
            backgroundColor: labelBGs,
            data
          }]
      },
      options: {}
    });
  }

  makeUserActivityChart(ctx: CanvasRenderingContext2D, labels, labelBGs, data){
    const chart2 = new C.Chart(ctx, {
      type: 'line',
      data: {
          labels,
          datasets: [{
              label: 'Activity', // Name the series
              data, // Specify the data values array
              fill: false,
              borderColor: '#2196f3', // Add custom color border (Line)
              backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
          }]},
      options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
      }
    });
  }

}
