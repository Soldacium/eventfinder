import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import * as L from 'leaflet';
import { EventsService } from 'src/app/services/events.service';


@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.css']
})
export class YourFeedComponent implements OnInit {
  /* map stuff */
  marker;
  adressInfo;
  adressLatLon;
  leafletMap: L.Map;
  options = {
    layers: [
      L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: L.latLng(46.879966, -121.726909),
    zoomControl: false,
  };

  /** description */
  public desc = {
    title: 'a post',
    editorData: '<p>Click on <b>this text</b> to edit your post description!</p>'
  };

  /** post data */
  postData: Post;
  viewFeed = false;
  moreVisible = true;
  feed = [];
  activities = ['Canoe', 'Swimming'];
  possibleActivities = [
    'Canoe' , 'Swimming', 'Fishing', 'Cycling', 'Walking', 'Hiking', 'Camping', 'Nature',
  'Winning', 'Reading', 'Knowledge', 'Meditation', 'Peace', 'Connection', 'Travel',
  'Meeting', 'Horseriding', 'Tinkering', 'Gaming'];
  chosenActivities = []

  /* files */
  public imagePath;
  imgURL: any;
  public message: string;

  file;

  searchQuery = '';
  searchedEvents = [];

  relatedEvent;






  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.setEmptyPost();
    
  }




  /* MAP */
  onMapReady(map: L.Map){
    this.leafletMap = map; 
  }
  checkMap(adress){
    fetch(`https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${adress}`, {
    'method': 'GET',
    'headers': {
      'x-rapidapi-host': 'google-maps-geocoding.p.rapidapi.com',
      'x-rapidapi-key': '45679e5923mshcee5ececde58af4p140c23jsn2b5fef76a776'
    }
    })
    .then(res => res.json())
    .then((data) => {
      this.adressInfo = data.results[0];
      this.adressLatLon = data.results[0].geometry.location;

      if(this.marker !== undefined && this.marker !== null){
        this.leafletMap.removeLayer(this.marker)
      }

      this.marker = new L.Marker(this.adressLatLon).addTo(this.leafletMap)
      this.leafletMap.setView([this.adressLatLon.lat,this.adressLatLon.lng],5)

      this.postData.relatedPlace = this.adressInfo.formatted_address;




    })
    .catch(err => {
      console.log(err);
    });
  }



  /* post content */
  setEmptyPost(){
    this.postData = {
      title: '',
      desc: '',
      relatedCompanions: [''],
      relatedPlace: '',
      relatedPlaceCoords: '',
      image: '',
      relatedEvent: '',
      images: [''],
      date: '',
      comments: [],

      timeline: true,
      isEvent: false,
    };
  }
  savePost(){

  }

  /* bonus content */

  searchYourEvents(){
    this.searchedEvents = this.eventsService.getSearchedSavedEvents(this.searchQuery)
  }

  chooseRelatedEvent(event){
    this.relatedEvent = event;
    console.log(this.relatedEvent)
  }



  /* Activities */
  pickActivity(activity) {
    const isTag = this.chosenActivities.includes(activity);
    if (isTag == false) {
      this.chosenActivities.push(activity);
    } else {
      this.chosenActivities.splice(this.chosenActivities.indexOf(activity), 1);
    }
  }




  /* Files */
  preview(files) {

    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };

    this.file = files[0]
  }
  clickImage(){
    document.getElementById('selectedFile').click();
  }

}
