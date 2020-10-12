import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgElement, WithProperties } from '@angular/elements';
import * as L from 'leaflet';
import { MarkerComponent } from './marker/marker.component';
import { Event } from '../models/event.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  capitals = '/assets/files/usa-state-capitals.geojson';
  @Output() open = new EventEmitter<any>();

  focusOnEvent = new Subject();
  searchedMapMarkersUpdated = new Subject<Array<object>>();

  greenIcon = L.icon({
    iconUrl: '/assets/icons/tags/drink.svg',
    shadowUrl: '/assets/icons/general/circle.svg',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [40, 40], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [5, 5],  // the same for the shadow
    popupAnchor:  [15, -10] // point from which the popup should open relative to the iconAnchor
  });

  private allEvents: Array<Event>;
  private searchEvents: Array<Event>;
  private allMarkers: Array<object>;
  private searchMarkers: Array<object>;

  constructor(private http: HttpClient) { }

  getAllEvents(map: L.Map){
    let events: Array<object>;
    const markers = [];
    this.http.get('http://localhost:3000/api/events/')
    .subscribe((res: any) => {
      this.allEvents = res.events;
      events = res.events;
      events.forEach((event: any) => {
        const coords = JSON.parse(event.coords);
        const lat = coords.lat;
        const lon = coords.lon;

        const circle = L.marker([lat, lon], {icon: this.greenIcon});
        circle.bindPopup(fl => this.createPopupComponentWithMessage(event));
        circle.addTo(map);

        markers.push(circle);

      });
    });
    this.allMarkers = markers;
    return markers;
  }

  getMarkersFromEvents(events: Array<object>): Array<object>{

    const markers = [];
    events.forEach((event: any) => {
      const coords = JSON.parse(event.coords);
      const lat = coords.lat;
      const lon = coords.lon;

      const circle = L.marker([lat, lon], {icon: this.greenIcon});
      circle.bindPopup(fl => this.createPopupComponentWithMessage(event));

      markers.push(circle);

    });

    return markers;
  }

  /**
   *
   *
   */

  getSearchedEvents(options: any){
    const searchEvents = [];

    this.allEvents.forEach((event: any) => {
      const eventTime: {start: string, end: string} = JSON.parse(event.time);

      if (  event.title.toLowerCase().includes(options.name)
        && event.organisator.toLowerCase().includes(options.organisator)
        && (event.type === options.type || options.type === '')
        && event.price <= options.maxPrice
        && Date.parse(eventTime.start) >= Date.parse(options.start)
        && Date.parse(eventTime.end) <= Date.parse(options.end)  ){
          if (options.tags.length > 0){
            options.tags.forEach(tag => {
              if (!event.tags.includes(tag)){
                return false;
              }
              return searchEvents.push(event);
            });
          }else{
            return searchEvents.push(event);
          }
      }else{
        this.searchEvents = this.allEvents;
      }
    });
    const newMarkers = this.getMarkersFromEvents(searchEvents);
    this.searchedMapMarkersUpdated.next(newMarkers);


    this.searchEvents = searchEvents;
    this.searchMarkers = newMarkers;

  }

  public createPopupComponentWithMessage(data: any) { // & WithProperties<PopupComponent>
    const popupEl: NgElement & WithProperties<MarkerComponent>  = document.createElement('popup-element') as any;
    // Listen to the close event
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.data = data;
    // Add to the DOM
    document.body.appendChild(popupEl);
    return popupEl;
  }

  public openEvent(event){
    this.open.emit(event);
  }

  public focusOnCurrentEvent(){
    this.focusOnEvent.next(true);
  }
}
