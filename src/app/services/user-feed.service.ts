import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserFeedService {

  userFeed = [];
  viewedUserFeed = [];

  constructor(private userService: UserService, private http: HttpClient) { }

  getSavedFeed(){
    return this.userFeed;
  }
  updateSavedFeed(post){
    this.userFeed.push(post)
  }
  getUserFeed(userFeedID, save?: boolean){
    const currentUser = this.userService.getCurrentUser();
    const viewedUser = this.userService.viewedUserCollectionsIDs;
    const feedID = userFeedID;
    console.log(feedID)
    return this.http.get('http://localhost:3000/api/user-feed/' + feedID).pipe(
      map((res: any) => {
        // this.userData.image = res.imageUrl;
        console.log(res)
        if(save){
          this.userFeed = res.userFeed.posts;
        }
        return res.userFeed.posts;
      })
    );
  }
  postToUserFeed(post: Post, img: File){// ,  yourFeed?: boolean
    // const post = this.makePost();
    const currentUser = this.userService.getCurrentUser();
    const viewedUser = this.userService.viewedUserCollectionsIDs;


    const newPost = new FormData();

    newPost.append('image', img, currentUser._id);
    for (const key in post){
      newPost.append(key, post[key]);
    }
    const feedID = currentUser.userFeedID;


    return this.http.post('http://localhost:3000/api/user-feed/' + feedID, newPost).pipe(
      map((res: any) => {
        // this.userData.image = res.imageUrl;
        console.log(res);
        return res.addedPost;
      })
    );


  }
  commentOnUserFeed(userID: string, comment){

  }
  respondToCommentOnUserFeed(userID: string, comment){

  }

  private makePost(){
    return {

    };
  }
}
