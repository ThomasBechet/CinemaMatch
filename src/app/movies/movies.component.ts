import { Component, OnInit, Output } from '@angular/core';
import { MoviesService } from '../movies.service';
import { Router } from '@angular/router';
import { __values } from 'tslib';
import { Movie } from '../metier/movie';
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movies: Array<Movie>;
  p: number = 1;
  displaymodal: boolean;
  showVar: boolean = false;
  selectedMovie : Movie;

  @Output() movie: Movie;

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    this.moviesService.getMovies(10, 15)
      .then((value) => {
        this.movies = this.moviesService.avgRating(value['movies']);
      });
  }

  showModal(movie) {
    this.showVar = true;
    this.selectedMovie = movie;
  }

}