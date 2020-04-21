import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotficationPage } from './notfication.page';

describe('NotficationPage', () => {
  let component: NotficationPage;
  let fixture: ComponentFixture<NotficationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotficationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotficationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
