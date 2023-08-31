import { Component, OnInit } from '@angular/core';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent extends BaseComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  ngOnInit(): void {
    this.galleryOptions = [
      {
          width: '600px',
          height: '400px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
  ];

  this.galleryImages = [
    {
      small: 'assets/mku/images/mku-logo.png',
      medium: 'assets/mku/images/mku_php_award.jpg',
      big: 'assets/mku/images/mku_phd_award.jpg'
  },{
      small: 'assets/mku/images/mku-logo.png',
      medium: 'assets/mku/images/mku_nutrition_group.jpg',
      big: 'assets/mku/images/mku_nutrition_group.jpg'
    },
    {
        small: 'assets/mku/images/mku-logo.png',
        medium: 'assets/mku/images/mku_dancers_1.jpg',
        big: 'assets/mku/images/mku_dancers_1.jpg'
    }    
  ];

  }

}
