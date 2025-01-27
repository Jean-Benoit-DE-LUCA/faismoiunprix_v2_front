import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyofferComponent } from './myoffer.component';

describe('MyofferComponent', () => {
  let component: MyofferComponent;
  let fixture: ComponentFixture<MyofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyofferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
