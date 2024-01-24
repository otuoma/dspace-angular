import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HyperlinkSwiperDirective} from './hyperlink-swiper.directive';
import {SwiperOptions} from 'swiper/types';
import {SwiperContainer} from 'swiper/element';

interface Card {
  title: string;
  description: string;
  url: string;
}

@Component({
  selector: 'ds-hyperlink-featured-publications',
  templateUrl: './featured-publications.component.html',
  styleUrls: ['./featured-publications.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, HyperlinkSwiperDirective, LazyThemeModule, LazyThemeModule, LazyThemeModule]
})
export class FeaturedPublicationsComponent implements AfterViewInit{
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  @ViewChild('swiperThumbs') swiperThumbs!: ElementRef<SwiperContainer>;

  contents: Card[] = [
    {
      title: 'Computer',
      description: 'Description about computer...',
      url: 'https://picsum.photos/id/1/640/480',
    },
    {
      title: 'Building',
      description: 'Building description...',
      url: 'https://picsum.photos/id/101/640/480',
    }];

  index = 0;
  // Swiper
  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
  };
  swiperThumbsConfig: SwiperOptions = {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  };

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
    this.swiperThumbs.nativeElement.swiper.activeIndex = this.index;
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }
}
