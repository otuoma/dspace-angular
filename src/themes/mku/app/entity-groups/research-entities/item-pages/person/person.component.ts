import { Component } from '@angular/core';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import {PersonComponent as BaseComponent} from '../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component';

@listableObjectComponent('Person', ViewMode.StandalonePage)
@Component({
  selector: 'ds-themed-person',
  styleUrls: ['./person.component.scss'],
  templateUrl: './person.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Person
 */
export class PersonComponent extends BaseComponent {
}
