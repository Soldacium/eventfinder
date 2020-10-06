import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MarkerService } from './services/marker.service';
import { AuthService } from './services/auth.service';
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
import { PlannerComponent } from './account/planner/planner.component';
import { YourEventsComponent } from './account/your-events/your-events.component';
import { MakeEventComponent } from './account/make-event/make-event.component';

import { CKEditorModule } from 'ckeditor4-angular';
import { MarkerComponent } from './services/marker/marker.component';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionsComponent } from './account/options/options.component';
import { PoliciesComponent } from './account/policies/policies.component';



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
    PlannerComponent,
    YourEventsComponent,
    MakeEventComponent,
    MarkerComponent,
    OptionsComponent,
    PoliciesComponent

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
            path: 'planner',
            component: PlannerComponent
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
            path: 'options',
            component: OptionsComponent
          },
          {
            path: 'policies',
            component: PoliciesComponent
          }
        ]
      },
      {
        path: 'login',
        component: LoginComponent
      },
    ])
  ],
  providers: [
    MarkerService,AuthGuardGuard, AuthService, EventsService, MessagesService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
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
