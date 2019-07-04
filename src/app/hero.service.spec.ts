import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MessageService } from './message.service';
import { HeroService } from './hero.service';

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let heroSvc: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService, { provide: MessageService, useValue: mockMessageService }],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    heroSvc = TestBed.get(HeroService); // get instance
  });

  describe('getHero', () => {
    it('should call get with the correct URL', () => {
      heroSvc.getHero(1).subscribe();
    });

    // other way
    it('should call get with the correct URL', inject(
      [HeroService, HttpTestingController],
      (service: HeroService, controller: HttpTestingController) => {
        service.getHero(11).subscribe(() => {
          console.log('fulfilled');
        });
        // service.getHero(3).subscribe();

        const req = httpTestingController.expectOne('api/heroes/11');
        req.flush({ id: 11, name: 'Mr. Nice', strength: 10 });

        httpTestingController.verify();
      },
    ));
  });
});
