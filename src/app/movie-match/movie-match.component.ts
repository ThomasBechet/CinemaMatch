import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import * as kf from './keyframes';
import { Subject } from 'rxjs';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'movie-match',
  templateUrl: './movie-match.component.html',
  styleUrls: ['./movie-match.component.scss'], 
  animations: [
    trigger('cardAnimator', [
      transition('* => dislike', animate(750, keyframes(kf.dislike))),
      transition('* => like', animate(750, keyframes(kf.like))),
      transition('* => unseen', animate(750, keyframes(kf.unseen)))
    ])
  ],
  encapsulation: ViewEncapsulation.None,
})

export class MovieMatchComponent implements OnInit {

  public templates: string[] = [
    "5dcfb536fb30a6da7a682658", // Titanic (Drama Romance)
    "5dcfb540fb30a6da7a6831e6", // Avatar (Sci-Fi)
    "5dcfb67bfb30a6da7a689410", // Forrest Gump (Drama Romance)
    "5dcfb543fb30a6da7a68343f", // Toy Story (Animation)
    "5dcfb534fb30a6da7a6821f0", // Rocky (Sport)
    "5dcfb58bfb30a6da7a6854fc", // Braveheart (History)
    "5dcfb530fb30a6da7a6813e5", // Star Wars (Sci-fi)
    "5dcfbefffb30a6da7a695843", // The Shining (Horror)
    "5dcfb532fb30a6da7a681dda", // Raiders of the Lost Ark (Action Adventure)
    "5dcfb6b3fb30a6da7a689ebe", // Grease (Musical Romance)
    "5dcfb54efb30a6da7a683c85", // Back to the Future (Adventure Comedy Sci-fi)
    "5dcfb532fb30a6da7a681d5b", // The Good, the Bad and the Ugly (Western)
  ];

  public title: string;
  public poster: string;
  public genre: string;

  public index = 0;
  private votes: { [id: string]: string; } = {};

  @Input() parentSubject: Subject<any>;

  animationState: string;

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    this.votes = {}
    this.loadFilm(this.templates[0]);
    this.parentSubject.subscribe(status => {
      this.startAnimation(status);
      this.votes[this.templates[this.index]] = status;
      this.index++;
      if (this.index >= this.templates.length) {
        this.index = 0;
        this.saveInformation();
      }
      this.loadFilm(this.templates[this.index]);
    });
  }

  private async loadFilm(id) {
    try {
      const movie = await this.moviesService.getMovie(id);
      this.title = movie['movie']['title'];
      this.genre = movie['movie']['genres']; //'temp'
      this.poster = movie['movie']['poster'];
    } catch (error) {
    }
  }

  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }

  async saveInformation() {
    for (let [id, status] of Object.entries(this.votes)) {
      try {
        let movie = await  this.moviesService.getIsLikedMovie(id);
        let viewed = movie['viewed'];
        let liked = movie['liked'];

        if (status === 'like') {
          if (!viewed) await this.moviesService.swapView(id);
          if (!liked) await this.moviesService.swapLike(id);
        } else if (status === 'dislike') {
          if (!viewed) await this.moviesService.swapView(id);
          if (liked) await this.moviesService.swapLike(id);
        } else if (status === 'unseen') {
          if (viewed) await this.moviesService.swapView(id);
          if (liked) await this.moviesService.swapLike(id);
        }

      } catch (error) {
      }
    }

    this.votes = {}
  }

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState(state) {
    this.animationState = '';
    this.index++;
  }

}
