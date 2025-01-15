import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DrawingCanvasComponent } from './drawing-canvas/drawing-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DrawingCanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'Nmist-draw-app';
}
