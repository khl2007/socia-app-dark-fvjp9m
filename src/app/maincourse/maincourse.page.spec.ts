import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaincoursePage } from './maincourse.page';

describe('MaincoursePage', () => {
  let component: MaincoursePage;
  let fixture: ComponentFixture<MaincoursePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaincoursePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaincoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
