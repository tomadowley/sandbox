/**
 * Minimal 3D rendering engine using WebGL for use in React apps.
 * Supports basic mesh, camera, and rendering loop.
 */

export class Renderer3D {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private positionBuffer: WebGLBuffer;
  private colorBuffer: WebGLBuffer;
  private animationFrame: number | null = null;
  private angle: number = 0;

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

    // Cube vertex positions
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

    // Cube vertex colors
    const colors = new Float32Array([
      // Front face (red)
      1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
      // Back face (green)
      0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
      // Top face (blue)
      0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
      // Bottom face (yellow)
      1, 1, 0,  1, 1, 0,  1, 1, 0,  1, 1, 0,
      // Right face (magenta)
      1, 0, 1,  1, 0, 1,  1, 0, 1,  1, 0, 1,
      // Left face (cyan)
      0, 1, 1,  0, 1, 1,  0, 1, 1,  0, 1, 1,
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
    // Position buffer
    this.positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Color buffer
    this.colorBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Index buffer
    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.07, 0.09, 0.14, 1);

    this.draw = this.draw.bind(this);
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

  private draw = () => {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Attribute: position
    const posLoc = gl.getAttribLocation(this.program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);

    // Attribute: color
    const colorLoc = gl.getAttribLocation(this.program, "aColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // MVP matrices
    const aspect = this.canvas.width / this.canvas.height;
    const projection = Renderer3D.perspectiveMatrix(Math.PI / 4, aspect, 0.1, 100);
    const modelView = new Float32Array([
      Math.cos(this.angle), 0, Math.sin(this.angle), 0,
      0, 1, 0, 0,
      -Math.sin(this.angle), 0, Math.cos(this.angle), 0,
      0, 0, -6, 1,
    ]);
    const uProj = gl.getUniformLocation(this.program, "uProjectionMatrix");
    const uMV = gl.getUniformLocation(this.program, "uModelViewMatrix");
    gl.uniformMatrix4fv(uProj, false, projection);
    gl.uniformMatrix4fv(uMV, false, modelView);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    this.angle += 0.01;
    this.animationFrame = requestAnimationFrame(this.draw);
  };
}