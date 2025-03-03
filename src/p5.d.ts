declare module 'p5' {
  export default class p5 {
    constructor(sketch: (p: p5) => void, node?: HTMLElement | string);
    
    // Canvas methods
    createCanvas(w: number, h: number): { parent: (node: HTMLElement | null) => void };
    background(r: number, g: number, b: number): void;
    
    // Drawing methods
    fill(r: number, g?: number, b?: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    ellipse(x: number, y: number, w: number, h: number): void;
    beginShape(): void;
    endShape(mode?: any): void;
    vertex(x: number, y: number): void;
    
    // Text methods
    text(str: string, x: number, y: number, w?: number, h?: number): void;
    textSize(size: number): void;
    textAlign(horizAlign: any, vertAlign?: any): void;
    
    // Input methods
    keyIsDown(code: number): boolean;
    keyCode: number;
    
    // Utility methods
    random(min: number, max: number): number;
    random(choices: any[]): any;
    millis(): number;
    collideRectRect(x1: number, y1: number, w1: number, h1: number, 
                    x2: number, y2: number, w2: number, h2: number): boolean;
    
    // Constants
    ENTER: number;
    CENTER: string;
    
    // Properties
    width: number;
    height: number;
    
    // Internal methods
    _onunload?: () => void;
    _events?: {
      keydown: (e: KeyboardEvent) => void;
      keyup: (e: KeyboardEvent) => void;
      resize: (e: UIEvent) => void;
    };
    
    // Setup and draw methods (typically defined by user)
    setup?: () => void;
    draw?: () => void;
    keyPressed?: () => void;
  }
}
