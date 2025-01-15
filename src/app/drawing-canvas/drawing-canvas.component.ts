import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-drawing-canvas',
  standalone: true,
  imports: [],
  templateUrl: './drawing-canvas.component.html',
  styleUrl: './drawing-canvas.component.less'
})
export class DrawingCanvasComponent implements AfterViewInit {
  mouseDownState: boolean = false;
  canvasCtx: CanvasRenderingContext2D | null = null;
  canvasElement: HTMLCanvasElement | null = null;
  lastX: number = 0;
  lastY: number = 0;
  ngAfterViewInit(): void {
    console.log("AfterView innit");
    this.canvasElement = document.getElementById("mnist-canvas-id") as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement?.getContext("2d");
    this.canvasElement?.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvasElement?.addEventListener("mouseup", this.mouseUp.bind(this));
    this.canvasElement?.addEventListener("mouseleave", this.mouseUp.bind(this));
  }

  mouseDown(event: MouseEvent) {
    this.mouseDownState = true;
    this.lastX = event.clientX - this.canvasElement?.offsetLeft!;
    this.lastY = event.clientY - this.canvasElement?.offsetTop!;
    this.canvasElement?.addEventListener("mousemove", this.mouseMove.bind(this));
  }

  mouseUp(event: MouseEvent) {
    this.mouseDownState = false;
  }

  throttledMouseMove(event: MouseEvent) {
    if (this.mouseDownState && this.canvasCtx) {
      requestAnimationFrame(() => this.mouseMove(event));
    }
  }

  mouseMove(event: MouseEvent) {
    const x = event.clientX - this.canvasElement?.offsetLeft!;
    const y = event.clientY - this.canvasElement?.offsetTop!;
    if (this.mouseDownState && this.canvasCtx) {
      this.canvasCtx.strokeStyle = "white";
      this.canvasCtx.lineWidth = 10;
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(this.lastX, this.lastY);
      this.canvasCtx.lineTo(x, y);
      this.canvasCtx.stroke();
      this.canvasCtx.closePath();

      this.lastX = x;
      this.lastY = y;
    }
  }

  clear() {
    if (this.canvasCtx) {
      this.canvasCtx.fillStyle = "black";
      this.canvasCtx?.fillRect(0, 0, 280, 280);
    }
  }
}
