import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MarkerService } from './services/marker.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UserFeedService } from './services/user-feed.service';
import { EventsService } from './services/events.service';
import { MessagesService } from './services/messages.service';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { AuthInterceptor } from './services/auth-interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { MainOptionsComponent } from './main/main-options/main-options.component';
import { MainInfoComponent } from './main/main-info/main-info.component';
import { GeneralComponent } from './main/main-info/general/general.component';
import { DescriptionComponent } from './main/main-info/description/description.component';
import { RequirementsComponent } from './main/main-info/requirements/requirements.component';
import { PlanComponent } from './main/main-info/plan/plan.component';
import { InteractionComponent } from './main/main-info/interaction/interaction.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SavedComponent } from './account/saved/saved.component';
import { MessagesComponent } from './account/messages/messages.component';

import { YourEventsComponent } from './account/your-events/your-events.component';
import { MakeEventComponent } from './account/make-event/make-event.component';

import { CKEditorModule } from 'ckeditor4-angular';
import { MarkerComponent } from './services/marker/marker.component';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionsComponent } from './account/options/options.component';
import { CompanionComponent } from './companion/companion.component';
import { InfoComponent } from './companion/info/info.component';
import { EventsGoingComponent } from './companion/events-going/events-going.component';
import { EventsOrganisingComponent } from './companion/events-organising/events-organising.component';
import { FeedComponent } from './companion/feed/feed.component';
import { CompanionsListComponent } from './companion/companions-list/companions-list.component';
import { ProfileCompanionComponent } from './companion/profile-companion/profile-companion.component';
import { YourFeedComponent } from './account/your-feed/your-feed.component';
import { YourCompanionsComponent } from './account/your-companions/your-companions.component';
import { SavedListComponent } from './account/saved/saved-list/saved-list.component';
import { SavedPlannerComponent } from './account/saved/saved-planner/saved-planner.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    LoginComponent,
    MainOptionsComponent,
    MainInfoComponent,
    GeneralComponent,
    DescriptionComponent,
    RequirementsComponent,
    PlanComponent,
    InteractionComponent,
    AccountComponent,
    ProfileComponent,
    SavedComponent,
    MessagesComponent,
    YourEventsComponent,
    MakeEventComponent,
    MarkerComponent,
    OptionsComponent,
    CompanionComponent,
    InfoComponent,
    EventsGoingComponent,
    EventsOrganisingComponent,
    FeedComponent,
    CompanionsListComponent,
    ProfileCompanionComponent,
    YourFeedComponent,
    YourCompanionsComponent,
    SavedListComponent,
    SavedPlannerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    CKEditorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'account',
        canActivate: [AuthGuardGuard],
        component: AccountComponent,
        
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'profile'
          },
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: 'messages',
            component: MessagesComponent
          },
          {
            path: 'saved',
            component: SavedComponent
          },
          {
            path: 'your-companions',
            component: YourCompanionsComponent
          },
          {
            path: 'my-events',
            component: YourEventsComponent
          },
          {
            path: 'new-event',
            component: MakeEventComponent
          },
          {
            path: 'feed',
            component: YourFeedComponent
          },
          {
            path: 'options',
            component: OptionsComponent
          }
        ]
      },
      {
        path: 'companion/:userID',
        component: CompanionComponent,
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full'
          },
          {
            path: 'profile',
            component: ProfileCompanionComponent
          },
          {
            path: 'events-made',
            component: EventsOrganisingComponent
          },
          {
            path: 'events-saved',
            component: EventsGoingComponent
          },
          {
            path: 'companions',
            component: CompanionsListComponent
          },
          {
            path: 'feed',
            component: FeedComponent
          },
        ]
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '**',
        component: MainComponent
      }
    ])
  ],
  providers: [
    MarkerService,
    AuthGuardGuard, 
    AuthService, 
    EventsService, 
    MessagesService, 
    UserService,
    UserFeedService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private injector: Injector) {
    const PopupElement = createCustomElement(MarkerComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
  }
}
