import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-companion',
  templateUrl: './companion.component.html',
  styleUrls: ['./companion.component.css']
})
export class CompanionComponent implements OnInit {

  userID;
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private userService: UserService,
    public router: Router) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0
    this.route.queryParams.subscribe(params => {
      this.userID= params['userID'];
      

    });
    console.log(this.userID)
    this.setTitle(this.route.snapshot.paramMap.get('title'))
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  setUserData(){
    
  }

  

}
