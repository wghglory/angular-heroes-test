import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Input, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { HeroService } from '../hero.service';

import { HeroesComponent } from './heroes.component';
import { HeroComponent } from './../hero/hero.component';
import { Hero } from '../hero';

describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  // mock child component
  @Component({
    selector: 'app-hero',
    template: '<div></div>',
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
  }

  beforeEach(() => {
    HEROES = [
      { id: 13, name: 'Bombasto', strength: 8 },
      { id: 14, name: 'Celeritas', strength: 15 },
      { id: 15, name: 'Magneta', strength: 22 },
    ];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, FakeHeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      // schemas: [NO_ERRORS_SCHEMA],  use FakeHeroComponent, cuz NO_ERRORS_SCHEMA hide other problems
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toEqual(3);
  });

  it('should create one li for each hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
  });
});

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 13, name: 'Bombasto', strength: 8 },
      { id: 14, name: 'Celeritas', strength: 15 },
      { id: 15, name: 'Magneta', strength: 22 },
    ];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges(); // run ngOnInit, children components will also be triggered

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentDEs.length).toEqual(3);
    expect(heroComponentDEs[0].componentInstance.hero.name).toEqual('Bombasto');
    expect(heroComponentDEs[1].componentInstance.hero.name).toEqual('Celeritas');
    expect(heroComponentDEs[2].componentInstance.hero.name).toEqual('Magneta');

    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  it(`should call heroService.deleteHero when Hero component's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete'); // watch if delete method gets called

    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));

    // heroComponentDEs[0]
    //   .query(By.css('button'))
    //   .triggerEventHandler('click', { stopPropagation: () => {} }); // dummy

    // instead of real clicking, emit event from children
    (heroComponentDEs[0].componentInstance as HeroComponent).delete.emit(undefined);

    // raise event on child directive
    heroComponentDEs[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero when add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    const name = 'Derek';

    mockHeroService.addHero.and.returnValue(of({ id: 5, name, strength: 4 }));

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', null);

    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);
  });
});
