import { Component, OnInit } from '@angular/core';
import * as C from 'chart.js'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model'
import { Canvas } from 'leaflet';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfileIsEdited = true;
  /* image + async check if posted */
  public imagePath;
  previousImgUrl = 'assets/images/BGs/festival.jpg';
  imgURL: any = 'assets/images/BGs/festival.jpg';

  file;
  posted = false;
  auth; authSub;

  user : User;

  userProfileInfo = {
    name: '',
    phone: '',
    address: '',

    website1: '',
    website2: '',

    instagram: '',
    facebook: '',
    linkedin: '',
    email: '',

  }


  public desc = {
    title: 'a post',
    editorData: '<p>Your own description, click to change!</p>'
  };


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
  ]


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.makeCharts();
    this.getUserProfileInfo();


  }

  getUserProfileInfo(){


    this.getUser();

    this.setupUserImageListener();
    this.setupUserListener();
  }

  getUser(){
    this.user = this.authService.getUser();
    if(this.user){
      this.desc.editorData = this.user.desc;
      this.userProfileInfo = {
        name: this.user.name,
        phone: '',
        address: '',
    
        website1: '',
        website2: '',
    
        instagram: '',
        facebook: '',
        linkedin: '',
        email: this.user.email,
      }
      if(this.user.image){
        this.imgURL = this.user.image;
        this.previousImgUrl = this.imgURL;
      }
    }

  }

  setupUserImageListener(){
    this.authService.getUserImageListener().subscribe(newImageUrl => {
      this.imgURL = newImageUrl;
    })
  }

  setupUserListener(){
    this.authService.getUserListener()
    .subscribe((user: any) => {
      this.user = user;
      this.desc.editorData = this.user.desc;
      this.userProfileInfo  = {
        name: this.user.name,
        phone: '',
        address: '',

        website1: '',
        website2: '',

        instagram: '',
        facebook: '',
        linkedin: '',
        email: this.user.email,
      }
      if(this.user.image){
        this.imgURL = this.user.image;
        this.previousImgUrl = this.imgURL;
      }
      

    })
  }

  editUserProfileInfo(){
    if(this.userProfileIsEdited){
      this.authService.changeAccInfo(
        this.userProfileInfo.name,
        this.userProfileInfo.phone,
        this.userProfileInfo.address,
        this.userProfileInfo.website1,
        this.desc.editorData)
    }
    this.userProfileIsEdited = !this.userProfileIsEdited;
  }


  previewImage(files) {

    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    this.file = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }


  clickImage(){
    document.getElementById('selectedFile').click();
  }

  updateUserImage(){
    this.authService.changeAccImage(this.file)
  }

  cancelUpdatingUserImage(){
    this.imgURL = this.previousImgUrl;
    this.imagePath = undefined;
  }


  makeCharts(){
    let ctx: any = document.querySelector('.stats-types');
    ctx.getContext('2d');

    let ctx2: any = document.querySelector('.stats-activity');
    ctx2.getContext('2d');

    const labels= [];
    const data = []
    const labelBGs = []
    this.typeStats.forEach(stat => {
      labels.push(stat.type)
      data.push(stat.value)
      labelBGs.push(`hsl(${230 + stat.value *3},100%,50%)`)
    });

    this.makeEventTypesChart(ctx, labels, labelBGs, data);
    this.makeUserActivityChart(ctx2, labels, labelBGs, data);
  }

  makeEventTypesChart(ctx: CanvasRenderingContext2D, labels, labelBGs, data){
    const chart = new C.Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
            backgroundColor: labelBGs,
            data: data
          }]
      },
      options: {}
    });
  }

  makeUserActivityChart(ctx: CanvasRenderingContext2D, labels, labelBGs, data){
    const chart2 = new C.Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Activity', // Name the series
              data: data, // Specify the data values array
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
