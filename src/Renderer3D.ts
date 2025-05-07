/**
 * Interactive 3D rendering engine with animated gorillas.
 * Supports scene, camera, gorilla animation, and mouse interaction for camera rotation.
 */

type Mat4 = Float32Array;

function identity(): Mat4 {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}
function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      out[i * 4 + j] =
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
  return out;
}
function translate(m: Mat4, x: number, y: number, z: number): Mat4 {
  const t = identity();
  t[12] = x; t[13] = y; t[14] = z;
  return multiply(m, t);
}
function scale(m: Mat4, x: number, y: number, z: number): Mat4 {
  const s = identity();
  s[0] = x; s[5] = y; s[10] = z;
  return multiply(m, s);
}
function rotateY(m: Mat4, rad: number): Mat4 {
  const r = identity();
  const c = Math.cos(rad), s = Math.sin(rad);
  r[0] = c; r[2] = s;
  r[8] = -s; r[10] = c;
  return multiply(m, r);
}
function rotateX(m: Mat4, rad: number): Mat4 {
  const r = identity();
  const c = Math.cos(rad), s = Math.sin(rad);
  r[5] = c; r[6] = s;
  r[9] = -s; r[10] = c;
  return multiply(m, r);
}
function rotateZ(m: Mat4, rad: number): Mat4 {
  const r = identity();
  const c = Math.cos(rad), s = Math.sin(rad);
  r[0] = c; r[1] = -s;
  r[4] = s; r[5] = c;
  return multiply(m, r);
}

type GorillaInstance = {
  x: number, y: number, z: number,
  walkPhase: number,
  color: [number, number, number]
};

export class Renderer3D {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private positionBuffer: WebGLBuffer;
  private colorBuffer: WebGLBuffer;
  private animationFrame: number | null = null;

  // Camera controls
  private cameraYaw: number = 0.7;
  private cameraPitch: number = 0.4;
  private cameraDist: number = 18;

  // Gorillas
  private gorillas: GorillaInstance[] = [];
  private time: number = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl");
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;

    // Vertex shader
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec3 vColor;
      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
        vColor = aColor;
      }
    `;

    // Fragment shader
    const fsSource = `
      precision mediump float;
      varying vec3 vColor;
      void main(void) {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;

    this.program = this.createProgram(vsSource, fsSource);

    // Cube vertex positions (centered at origin, size 2x2x2)
    const positions = new Float32Array([
      // Front face
      -1, -1,  1,
       1, -1,  1,
       1,  1,  1,
      -1,  1,  1,
      // Back face
      -1, -1, -1,
      -1,  1, -1,
       1,  1, -1,
       1, -1, -1,
      // Top face
      -1,  1, -1,
      -1,  1,  1,
       1,  1,  1,
       1,  1, -1,
      // Bottom face
      -1, -1, -1,
       1, -1, -1,
       1, -1,  1,
      -1, -1,  1,
      // Right face
       1, -1, -1,
       1,  1, -1,
       1,  1,  1,
       1, -1,  1,
      // Left face
      -1, -1, -1,
      -1, -1,  1,
      -1,  1,  1,
      -1,  1, -1,
    ]);
    // Colors: only used for fallback, typically overridden per-instance
    const colors = new Float32Array([
      0.4, 0.4, 0.4,  0.5, 0.5, 0.5,  0.7, 0.7, 0.7,  0.3, 0.3, 0.3,
      0.3, 0.6, 0.3,  0.3, 0.6, 0.3,  0.3, 0.6, 0.3,  0.3, 0.6, 0.3,
      0.1, 0.1, 0.7,  0.1, 0.1, 0.7,  0.1, 0.1, 0.7,  0.1, 0.1, 0.7,
      0.7, 0.7, 0.1,  0.7, 0.7, 0.1,  0.7, 0.7, 0.1,  0.7, 0.7, 0.1,
      0.8, 0.2, 0.2,  0.8, 0.2, 0.2,  0.8, 0.2, 0.2,  0.8, 0.2, 0.2,
      0.2, 0.8, 0.8,  0.2, 0.8, 0.8,  0.2, 0.8, 0.8,  0.2, 0.8, 0.8,
    ]);
    // Indices for cube faces
    const indices = new Uint16Array([
      0, 1, 2,  0, 2, 3,    // front
      4, 5, 6,  4, 6, 7,    // back
      8, 9,10,  8,10,11,    // top
     12,13,14, 12,14,15,    // bottom
     16,17,18, 16,18,19,    // right
     20,21,22, 20,22,23,    // left
    ]);

    this.positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Index buffer
    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.07, 0.09, 0.14, 1);

    // Fill gorillas in a grid
    const N = 5, SPACING = 5;
    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < N; ++j) {
        this.gorillas.push({
          x: (i - N / 2) * SPACING,
          y: 0,
          z: (j - N / 2) * SPACING,
          walkPhase: Math.random() * Math.PI * 2,
          color: [
            0.25 + 0.3 * Math.random(),
            0.15 + 0.3 * Math.random(),
            0.1 + 0.05 * Math.random()
          ]
        });
      }
    }

    this.draw = this.draw.bind(this);
  }

  // Camera controls
  public setCameraRotation(yaw: number, pitch: number) {
    this.cameraYaw = yaw;
    this.cameraPitch = Math.max(-1.2, Math.min(1.2, pitch));
  }
  public setCameraDistance(dist: number) {
    this.cameraDist = Math.max(8, Math.min(60, dist));
  }
  public getCameraRotation() {
    return [this.cameraYaw, this.cameraPitch] as [number, number];
  }
  public getCameraDistance() {
    return this.cameraDist;
  }

  private createShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(shader) || "Shader error");
    }
    return shader;
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram {
    const vs = this.createShader(vsSource, this.gl.VERTEX_SHADER);
    const fs = this.createShader(fsSource, this.gl.FRAGMENT_SHADER);
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(program) || "Program error");
    }
    return program;
  }

  // Mat4 helper for MVP
  private static perspectiveMatrix(fovy: number, aspect: number, near: number, far: number): Float32Array {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0,
    ]);
  }
  private static lookAtMatrix(eye: [number, number, number], center: [number, number, number], up: [number, number, number]): Float32Array {
    const [ex, ey, ez] = eye;
    const [cx, cy, cz] = center;
    const [ux, uy, uz] = up;

    let zx = ex - cx, zy = ey - cy, zz = ez - cz;
    let len = Math.hypot(zx, zy, zz);
    zx /= len; zy /= len; zz /= len;

    let xx = uy * zz - uz * zy;
    let xy = uz * zx - ux * zz;
    let xz = ux * zy - uy * zx;
    len = Math.hypot(xx, xy, xz);
    xx /= len; xy /= len; xz /= len;

    let yx = zy * xz - zz * xy;
    let yy = zz * xx - zx * xz;
    let yz = zx * xy - zy * xx;

    return new Float32Array([
      xx, yx, zx, 0,
      xy, yy, zy, 0,
      xz, yz, zz, 0,
      -(xx * ex + xy * ey + xz * ez),
      -(yx * ex + yy * ey + yz * ez),
      -(zx * ex + zy * ey + zz * ez),
      1,
    ]);
  }

  public start() {
    this.animationFrame = requestAnimationFrame(this.draw);
  }
  public stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  // Draw a colored cube at a given transformation
  private drawCube(modelView: Mat4, color: [number, number, number]) {
    const gl = this.gl;
    gl.useProgram(this.program);

    const posLoc = gl.getAttribLocation(this.program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);

    // Per-instance color
    const colorArray = new Float32Array(24 * 3);
    for (let i = 0; i < 24; ++i) {
      colorArray.set(color, i * 3);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.DYNAMIC_DRAW);
    const colorLoc = gl.getAttribLocation(this.program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    const aspect = this.canvas.width / this.canvas.height;
    const projection = Renderer3D.perspectiveMatrix(Math.PI / 4, aspect, 0.1, 200);
    const uProj = gl.getUniformLocation(this.program, "uProjectionMatrix");
    const uMV = gl.getUniformLocation(this.program, "uModelViewMatrix");

    gl.uniformMatrix4fv(uProj, false, projection);
    gl.uniformMatrix4fv(uMV, false, modelView);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }

  // Draw a "gorilla" at position, with animation phase
  private drawGorilla(g: GorillaInstance, t: number, view: Mat4) {
    // Gorillas are made of simple cubes: body, head, arms, legs
    // Animation: simple walk (limbs swing)
    // Body
    let m = translate(view, g.x, g.y + 2, g.z);
    m = scale(m, 1.2, 2, 0.8);
    this.drawCube(m, g.color);

    // Head
    let mh = translate(view, g.x, g.y + 4.2, g.z);
    mh = scale(mh, 0.9, 0.9, 0.9);
    this.drawCube(mh, [0.8, 0.7, 0.5]); // lighter brown

    // Limbs animation
    const walk = Math.sin(t + g.walkPhase) * 0.7;
    // Left Arm
    let mla = translate(view, g.x - 1.25, g.y + 2.8, g.z);
    mla = rotateZ(mla, walk);
    mla = scale(mla, 0.5, 1.5, 0.5);
    this.drawCube(mla, g.color);

    // Right Arm
    let mra = translate(view, g.x + 1.25, g.y + 2.8, g.z);
    mra = rotateZ(mra, -walk);
    mra = scale(mra, 0.5, 1.5, 0.5);
    this.drawCube(mra, g.color);

    // Left Leg
    let mll = translate(view, g.x - 0.6, g.y + 0.1, g.z);
    mll = rotateZ(mll, -walk);
    mll = scale(mll, 0.5, 1.4, 0.5);
    this.drawCube(mll, g.color);

    // Right Leg
    let mrl = translate(view, g.x + 0.6, g.y + 0.1, g.z);
    mrl = rotateZ(mrl, walk);
    mrl = scale(mrl, 0.5, 1.4, 0.5);
    this.drawCube(mrl, g.color);

    // Optional: belly (lighter color)
    let mb = translate(view, g.x, g.y + 1.3, g.z + 0.41);
    mb = scale(mb, 0.8, 0.8, 0.1);
    this.drawCube(mb, [0.9, 0.85, 0.6]);
  }

  private draw = () => {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera positioning (orbit)
    const yaw = this.cameraYaw, pitch = this.cameraPitch, dist = this.cameraDist;
    const cx = Math.cos(pitch) * Math.sin(yaw) * dist;
    const cy = Math.sin(pitch) * dist;
    const cz = Math.cos(pitch) * Math.cos(yaw) * dist;
    const eye: [number, number, number] = [cx, cy + 6, cz];
    const center: [number, number, number] = [0, 2, 0];
    const up: [number, number, number] = [0, 1, 0];
    const view = Renderer3D.lookAtMatrix(eye, center, up);

    this.time += 0.045;

    // Draw all gorillas
    for (const g of this.gorillas) {
      this.drawGorilla(g, this.time, view);
    }

    this.animationFrame = requestAnimationFrame(this.draw);
  };
}