import { HeroesComponent } from './heroes.component';
import { of } from 'rxjs';

describe('HeroesComponent', () => {
  let HEROES;
  let component: HeroesComponent;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      { id: 13, name: 'Bombasto', strength: 8 },
      { id: 14, name: 'Celeritas', strength: 15 },
      { id: 15, name: 'Magneta', strength: 22 },
    ];

    // mock service, add its methods into array
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroService);
  });

  describe('delete hero', () => {
    it('should remove the indicated hero', () => {
      /* fix TypeError: Cannot read property 'subscribe' of undefined,
        cuz deleteHero should return an Observable,
        then `component.delete(HEROES[2])` can call subscribe()
       */
      mockHeroService.deleteHero.and.returnValue(of(true));

      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);

      // can expect more
    });
  });
});
