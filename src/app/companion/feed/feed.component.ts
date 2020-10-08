import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  feed = []
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  getUserFeed(){
    this.userService.getUserFeed(this.userService.viewedUserID).subscribe(feed => {
      
    })
  }

}
