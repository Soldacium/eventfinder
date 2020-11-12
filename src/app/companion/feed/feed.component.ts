import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserFeedService } from 'src/app/services/user-feed.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  feed = [];
  viewFeed = true;
  moreVisible = false;

  expandedPosts = [];

  activities = ['Canoe', 'Cycling', 'Tinkering', 'Horseriding', 'Fishing'];
  constructor(
    private userService: UserService,
    private userFeedService: UserFeedService,
    private authService: AuthService) { }




  ngOnInit(): void {
    this.getUserFeed();
  }





  expandPost(i){
    this.expandedPosts.push(i);
  }

  getUserFeed(){
    if (this.userFeedService.viewedUserFeed.length === 0){
      this.userService.viewedUserCollectionsIDsReady.subscribe(ready => {
        this.userFeedService.getUserFeed(this.userService.viewedUserCollectionsIDs.userFeed, false).subscribe(feed => {
          this.feed = feed;
        });
      });
    }else{
      this.feed = this.userFeedService.viewedUserFeed;
    }
  }




}
