import { AfterViewInit, Component } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-drawing-canvas',
  standalone: true,
  imports: [],
  templateUrl: './drawing-canvas.component.html',
  styleUrl: './drawing-canvas.component.less'
})
export class DrawingCanvasComponent implements AfterViewInit {
  /**
   *
   */
  constructor() {
    this.loadModel();
  }

  mouseDownState: boolean = false;
  canvasCtx: CanvasRenderingContext2D | null = null;
  canvasElement: HTMLCanvasElement | null = null;
  model: tf.LayersModel | null = null;
  lastX: number = 0;
  lastY: number = 0;

  PredictedValue: number | null = null;
  ngAfterViewInit() {
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
      this.PredictedValue = null;
    }
  }

  preprocessImage(imageData: ImageData) {
    const tensor = tf.browser.fromPixels(imageData).resizeNearestNeighbor([28, 28]).mean(2).toFloat().div(tf.scalar(255.0)).expandDims(0);
    return tensor.reshape([1, 784]);
  }

  predict() {
    if (!this.model) {
      console.error("Model not loaded");
      return;
    }

    const canvas = document.getElementById("mnist-canvas-id") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imgData) {
      console.error("No image data");
      return;
    }

    let tensor = this.preprocessImage(imgData);

    const predictValue = this.model.predict(tensor) as tf.Tensor;
    this.PredictedValue = predictValue.argMax(1).dataSync()[0];
    }

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel("../../assets/model.json");
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }
}
