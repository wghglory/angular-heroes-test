import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from './../hero.service';

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute;
  let mockHeroService;
  let mockLocation;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => {
            return '3';
          },
        },
      },
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ],
    });

    fixture = TestBed.createComponent(HeroDetailComponent);
  });
});
