import {Component, Injector, OnInit} from '@angular/core';
import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import {MenuService} from '../../../../app/shared/menu/menu.service';
import {HostWindowService} from '../../../../app/shared/host-window.service';
import {BrowseService} from '../../../../app/core/browse/browse.service';
import {AuthorizationDataService} from '../../../../app/core/data/feature-authorization/authorization-data.service';
import {ActivatedRoute} from '@angular/router';
import {ThemeService} from '../../../../app/shared/theme-support/theme.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app/app.reducer';
import {HeaderComponent} from '../header/header.component';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav],
  providers: [HeaderComponent]
})
export class NavbarComponent extends BaseComponent implements OnInit{
  isMenuVisible = false;
  constructor(menuService: MenuService,
              injector: Injector,
              windowService: HostWindowService,
              browseService: BrowseService,
              authorizationService: AuthorizationDataService,
              route: ActivatedRoute,
              themeService: ThemeService,
              store: Store<AppState>,
              private headerComponent: HeaderComponent
              ) {
    super(menuService,injector,windowService,browseService,authorizationService, route, themeService,store);
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(`-----------${this.menuID}------`);
    this.headerComponent.toggleNavBarEvent.subscribe(()=>{
      console.log(`---EV Consumed-----`);
    });
  }
}
