import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button-render',
  standalone: true,
  imports: [],
  template: `<button class="btn btn-sm btn-danger" (click)="onClick()">Remove</button>`
})
export class ButtonRenderComponent {
  @Output() btnClick = new EventEmitter<void>();

  onClick(){
    this.btnClick.emit();
  }
}
