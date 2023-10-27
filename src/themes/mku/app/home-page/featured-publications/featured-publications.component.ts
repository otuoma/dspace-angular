import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'ds-featured-publications',
  templateUrl: './featured-publications.component.html',
  styleUrls: ['./featured-publications.component.scss']
})
export class FeaturedPublicationsComponent implements OnInit{
  @ViewChild('swiperRef', { static: true })
  protected _swiperRef: ElementRef;
  srcPhotos: any[] = [];
  ngOnInit(): void {
    console.log(`===============`);
  }

  initSwiper() {
    const swiperEl: any = document.querySelector('swiper-container');

    const swiperParams = {
      slidesPerView: 1,
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      on: {
        init() {
          console.log(`=============`);
        },
      },
    };
    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();
  }
}
