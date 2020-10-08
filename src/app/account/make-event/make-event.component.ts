import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import * as L from 'leaflet'
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-make-event',
  templateUrl: './make-event.component.html',
  styleUrls: ['./make-event.component.css']
})
export class MakeEventComponent implements OnInit {

  /**
   * Stuff
   */

   /* image + async check if posted */
  public imagePath;
  imgURL: any;
  public message: string;

  file;
  posted = false;

  /* map config */
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

  currentSection = 1;
  sectionNames = [
    'General',
    'Specification',
    'Description',
    'Plan',
    'Ready'
  ]
  windowWidth = 1;



  /* forms */
  public desc = {
    title: 'a post',
    editorData: '<p>Click on <b>this text</b> to edit your post description!</p>'
  };

  public timelineEvent = {
    title: '',
    time: '',
    desc: ''
  };

  public info = {
    name: '',
    start: '',
    end: '',
    address: '',
    organisator: '',
    type: '',
    chosenTags: [],
    price: 0,
    ticketsLink: '',

    website1: '',
    website2: '',
    phone: '',
    email: '',


  };


  eventTypes = ['Party', 'Meeting', 'Concert', 'Happening', 'Opening', ];
  eventTags = [
    'Huge place','Small place', 'Free drinks', 'Charity', 
    'Dancing', 'Drinking', 'Gastronomy', 'Open space', 
    'Closed space', 'Sponsored', 'Pay-as-you-go', 'Need invite',
    'Science', 'Culture', 'Religion', 'Sport', 'Weird', 'Innovative' ];

  chosenTags = [];
  chosenType = '';

  additionalRequirement = '';
  additionalRequirements = [];

  timelineEvents = [];

  constructor(private eventsService: EventsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.setupWindowWidthListener()

  }

  setupWindowWidthListener(){
    this.windowWidth =  window.innerWidth * 0.9 - 150;
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth * 0.9 - 150;
    })
  }

  nextSection(){
    this.currentSection += 1;
  }
  prevSection(){
    this.currentSection -= 1;
  }



  /* INFO SECTION */
  /* map and place search */
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

      // console.log(this.adressInfo, this.adressLatLon)

      if(this.marker !== undefined && this.marker !== null){
        this.leafletMap.removeLayer(this.marker)
      }

      this.marker = new L.Marker(this.adressLatLon).addTo(this.leafletMap)
      this.leafletMap.setView([this.adressLatLon.lat,this.adressLatLon.lng],5)

      this.info.address = this.adressInfo.formatted_address;




    })
    .catch(err => {
      console.log(err);
    });
  }
  onMapReady(map: L.Map){
    this.leafletMap = map; 
  }

  /* files */
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

  /*requirements */
  addRequirement(req){
    if(this.additionalRequirement !== ''){
      this.additionalRequirements.push(req);
      this.additionalRequirement = '';      
    }

  }
  deleteRequirement(req){
    this.additionalRequirements.splice(this.additionalRequirements.indexOf(req), 1);
  }


  /* types and tags */
  pickType(type){
    this.chosenType === type ? this.chosenType = '' : this.chosenType = type;
    console.log(this.chosenType);
  }
  pickTag(tag) {
    const isTag = this.chosenTags.includes(tag);
    if (isTag == false) {
      this.chosenTags.push(tag);
    } else {
      this.chosenTags.splice(this.chosenTags.indexOf(tag), 1);
    }
  }




  /* TIMELINE SECTION */
  addTimeline(){
    this.timelineEvents.push(this.timelineEvent);
    this.timelineEvent = {
      title: '',
      time: '',
      desc: ''
    };
  }

  deleteTimeline(event){
    this.timelineEvents.splice(this.timelineEvents.indexOf(event), 1);
  }

  post(){
    const user = this.authService.getUser()
    const event: Event  = {
      title: this.info.name,
      organisator: this.info.organisator,
      address: this.info.address,
      time: {
        start: this.info.start,
        end: this.info.end
      },
      coords: {
        lat: this.adressLatLon.lat, 
        lon:this.adressLatLon.lng
      },

      website1: this.info.website1,
      website2: this.info.website2,
      phone: this.info.phone,
      email: this.info.email,
      
      iconImg: '',
      type: this.chosenType,
      tags: this.chosenTags,

      price: this.info.price,
      ticketsLink: this.info.ticketsLink,

      additional: this.additionalRequirements,

      desc: this.desc.editorData,

      plan: this.timelineEvents,

      
      userID: user._id,
    }

    this.eventsService.postEvent(event, this.file)
  }



}
