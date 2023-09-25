import {Component, OnInit} from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';

@Component({
  selector: 'ds-home-news',
  styleUrls: ['../../../../../app/home-page/home-news/home-news.component.scss'],
  templateUrl: './home-news.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent implements OnInit{
  randomClass = 'background-image background-image-1';
  ngOnInit() {
    let image_classes = [
      'background-image background-image-1',
      'background-image background-image-3',
      'background-image background-image-5',
      'background-image background-image-6',
      'background-image background-image-7'
    ];

    let randomNum = Math.floor(Math.random() * image_classes.length);
    this.randomClass = image_classes[randomNum];

  }

}

