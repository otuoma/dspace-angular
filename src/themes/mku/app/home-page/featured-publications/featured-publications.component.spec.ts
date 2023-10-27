import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedPublicationsComponent } from './featured-publications.component';

describe('FeaturedPublicationsComponent', () => {
  let component: FeaturedPublicationsComponent;
  let fixture: ComponentFixture<FeaturedPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedPublicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
