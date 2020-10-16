import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  mobileNavOpen = false;
  constructor(
    public router: Router,
    private titleService: Title) { }

  ngOnInit(): void {
    this.setTitle()
  }

  public setTitle() {

    this.titleService.setTitle( 'Voyda - User profile');

  }

}
