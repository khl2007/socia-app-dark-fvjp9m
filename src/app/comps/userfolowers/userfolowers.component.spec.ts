import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserfolowersComponent } from './userfolowers.component';

describe('UserfolowersComponent', () => {
  let component: UserfolowersComponent;
  let fixture: ComponentFixture<UserfolowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserfolowersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserfolowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
