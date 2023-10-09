import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  SearchFormComponent as BaseComponent,
} from '../../../../../app/shared/search-form/search-form.component';
import {HomeNewsComponent} from '../../home-page/home-news/home-news.component';

@Component({
  selector: 'ds-search-form',
  // styleUrls: ['./search-form.component.scss'],
  styleUrls: ['../../../../../app/shared/search-form/search-form.component.scss'],
  templateUrl: './search-form.component.html'
})
export class SearchFormComponent extends BaseComponent implements OnInit{
  @ViewChild('newsSearchInput') searchInput: ElementRef<HTMLInputElement>;

  constructor(private homeNewsComponent: HomeNewsComponent) {
    // @ts-ignore
    super();
  }
  ngOnInit(): void {
    this.homeNewsComponent.collectionsLoaded.subscribe(() => {
      this.searchInput.nativeElement.focus();
      this.searchInput.nativeElement.blur();
    });
  }
}
