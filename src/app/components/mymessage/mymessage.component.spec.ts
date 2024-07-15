import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MymessageComponent } from './mymessage.component';

describe('MymessageComponent', () => {
  let component: MymessageComponent;
  let fixture: ComponentFixture<MymessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MymessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MymessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
