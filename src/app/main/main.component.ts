import { Component, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as L from 'leaflet'
import { Subject } from 'rxjs';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/events.service';
import { MarkerService } from '../services/marker.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  leafletMap: L.Map;
  leafletMapOptions: L.MapOptions = {
    layers: [
      L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 7,
    center: [46.879966, 21.726909],
    zoomControl: true,
  };

  optionsHidden = true;
  currentEventInfoIsHidden = false;

  eventMarkers = [];

  currentEventData: any;
  userSavedEvents: Array<object> = [];

  constructor(
    private eventsService: EventsService,
    private markerService: MarkerService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getSavedEvents();
    this.setupListeners();
  }

  setupListeners(){
    this.setupMarkerClickListener();
    this.setupMarkerFocusListener();
    this.setupSavedEventsListener();
    this.setupSavedEventsUpdateListener();
    this.setupSearchedMapMarkersListener();
  }

  setupMarkerClickListener(){
    this.markerService.open.subscribe(e => {
      this.currentEventData = {...e};
      this.currentEventInfoIsHidden = false;
    })
  }

  setupMarkerFocusListener(){
    this.markerService.focusOnEvent.subscribe(focus => {
      if(focus){
        const coords = JSON.parse(this.currentEventData.coords);
        const lat = coords.lat;
        const lon = coords.lon;
        this.leafletMap.setView(L.latLng(lat, lon - 6), 7);
      }
     });
  }

  setupSavedEventsListener(){
    this.authService.getUserListener().subscribe((userData: User) => {
      this.userSavedEvents = [...userData.saved];
    });
  }

  setupSavedEventsUpdateListener(){
    this.eventsService.savedEventsUpdated.subscribe((savedEvents: any) => {
      this.userSavedEvents = [...savedEvents];
    });
  }

  setupSearchedMapMarkersListener(){
    this.markerService.searchedMapMarkersUpdated.subscribe(newMarkers => {
      this.eventMarkers.forEach(marker => {
        this.leafletMap.removeLayer(marker);
      });

      this.eventMarkers = newMarkers;
      this.eventMarkers.forEach(newMarker => {
        newMarker.addTo(this.leafletMap);
      });
    });
  }



  getSavedEvents(){
    const user = this.authService.getUser();
    if(user){
      this.userSavedEvents = [...user.saved];
    }
  }

  getAllMapMarkers(){
    this.eventMarkers = this.markerService.getAllEvents(this.leafletMap);
  }

  onMapReady(map: L.Map){
    this.leafletMap = map;
    this.getAllMapMarkers();
  }


  onClose(close){
    if(close){
      this.currentEventInfoIsHidden = !this.currentEventInfoIsHidden;
    }
  }



}
