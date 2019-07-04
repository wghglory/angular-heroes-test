import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick, flush, async } from '@angular/core/testing';

import { of } from 'rxjs';

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
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ],
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'Derek', strength: 100 }));
  });

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('DEREK');
  });

  // bad way
  // it('should call updateHero when save is called', (done) => {
  //   mockHeroService.updateHero.and.returnValue(of({}));

  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   setTimeout(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //     done(); // async testing
  //   }, 500); // issue: unit test should be fast
  // });

  // work both setTimeout and promise
  it('should call updateHero when save is called', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));

    fixture.detectChanges();

    fixture.componentInstance.save();
    // tick(500); // zone.js
    flush(); // look at zone and see if there is any pending test (especially when not sure about time)

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  // work only for promise
  // it('should call updateHero when save is called', async(() => {
  //   mockHeroService.updateHero.and.returnValue(of({}));

  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   // zone knows promise
  //   fixture.whenStable().then(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   });
  // }));
});
