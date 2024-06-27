import { Component } from '@angular/core';
// import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ThemedComponent} from '../../../../shared/theme-support/themed.component';
// import { NavbarComponent } from './navbar.component';
import {PersonComponent} from './person.component';

/**
 * Themed wrapper for NavbarComponent
 */
@Component({
  selector: 'ds-themed-person',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedPersonComponent  extends ThemedComponent<PersonComponent> {
  protected getComponentName(): string {
    return 'PersonComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    // return import(`../../themes/${themeName}/app/entity-groups/research-entities/item-pages/person/person.component`);
    return import(`../../../../../themes/mku/app/entity-groups/research-entities/item-pages/person/person.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./person.component`);
  }
}
