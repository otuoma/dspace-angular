import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import {SwiperOptions} from 'swiper/types';
@Directive({
  selector: '[dsHyperlinkSwiperDirective]'
})
export class HyperlinkSwiperDirective implements AfterViewInit{

  private readonly swiperElement: HTMLElement;

  @Input() config?: SwiperOptions;
  // constructor(private el: ElementRef<HTMLElement & { initialize: () => void }>) {
  constructor(private el: ElementRef<SwiperContainer>) {
    this.swiperElement = el.nativeElement;
  }

  ngAfterViewInit(): void {
    Object.assign(this.el.nativeElement, this.config);
    this.el.nativeElement.initialize();
  }

}
