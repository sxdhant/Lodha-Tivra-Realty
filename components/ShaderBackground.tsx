'use client';

import { useEffect, useRef } from 'react';

const VERTEX = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAGMENT = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[4];
uniform vec3 u_scene; // resolution.xy, time
uniform vec3 u_pointer; // x, y (0..1, y up), presence (0..1)

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

// Blend through the four palette colours; x is 0..1 (WebGL1 needs a constant loop)
vec3 palette(float x) {
  float f = clamp(x, 0.0, 1.0) * 3.0;
  vec3 col = u_colors[0];
  for (int i = 0; i < 3; i++) {
    col = mix(col, u_colors[i + 1], smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

void main() {
  vec2 res = u_scene.xy;
  float t = u_scene.z;
  vec2 uv = gl_FragCoord.xy / res;
  vec2 p = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y);

  // Cursor twirl: spin the space around the pointer, strongest at its centre (strength 0.65, radius 0.46)
  vec2 pt = (u_pointer.xy * res - 0.5 * res) / min(res.x, res.y);
  float swirl = 0.65 * smoothstep(0.46, 0.0, length(p - pt)) * u_pointer.z * 4.0;
  vec2 d = p - pt;
  p = pt + vec2(cos(swirl) * d.x - sin(swirl) * d.y, sin(swirl) * d.x + cos(swirl) * d.y);
  uv = p * min(res.x, res.y) / res + 0.5;

  p *= 2.0;                                              // scale
  p += 0.12 * vec2(sin(t * 0.31), cos(t * 0.23));        // slow drift
  p += 0.04 * (vec2(fbm(p * 1.54 + 4012.0), fbm(p * 1.54 + vec2(5.2, 1.3))) - 0.5); // warp

  float y = uv.y
    + sin(uv.x * (3.0 + 0.54 * 9.0) + t * 0.8) * 0.08
    + (fbm(p * 2.0 + t * 0.1) - 0.5) * 0.54 * 0.6;
  vec3 col = palette(y);

  col = (col - 0.5) * 1.16 + 0.5;                        // contrast
  float vd = length(uv - 0.5) * 1.41421356;
  col *= 1.0 - 0.21 * smoothstep(0.35, 1.0, vd);         // vignette
  col += (grainHash(gl_FragCoord.xy) - 0.5) * 0.1;       // grain
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// #624B31, #9B7657, #DFBA96, #F9F1E7 as 0..1 RGB
const COLORS = new Float32Array([0.384, 0.294, 0.192, 0.608, 0.463, 0.341, 0.875, 0.729, 0.588, 0.976, 0.945, 0.906]);

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[shader-background] compile failed', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * Fixed, page-wide waves backdrop. The canvas carries a CSS gradient until the shader starts,
 * and a drifting-gradient fallback (see globals.css) when WebGL is unavailable.
 */
export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) {
      canvas.dataset.state = 'no-webgl';
      return;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.dataset.state = 'compile-failed';
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.dataset.state = 'link-failed';
      return;
    }
    gl.useProgram(prog);

    // One fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(gl.getUniformLocation(prog, 'u_colors'), COLORS);
    const uScene = gl.getUniformLocation(prog, 'u_scene');
    const uPointer = gl.getUniformLocation(prog, 'u_pointer');
    const ptr = { x: 0.5, y: 0.5, on: 0 };
    const target = { x: 0.5, y: 0.5, on: 0 };

    const MAX_PIXELS = 2.5e6;
    let w = 0;
    let h = 0;
    const draw = (seconds: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const area = Math.max(1, canvas.clientWidth * canvas.clientHeight);
      const k = Math.max(0.35, Math.min(dpr, Math.sqrt(MAX_PIXELS / area)));
      const nw = Math.max(1, Math.round(canvas.clientWidth * k));
      const nh = Math.max(1, Math.round(canvas.clientHeight * k));
      if (nw !== w || nh !== h) {
        w = canvas.width = nw;
        h = canvas.height = nh;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform3f(uScene, w, h, seconds * -0.73);
      gl.uniform3f(uPointer, ptr.x, ptr.y, ptr.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = performance.now();
    const FRAME_MS = 1000 / 30;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS - 2) return;
      last = now;
      ptr.x += (target.x - ptr.x) * 0.2;
      ptr.y += (target.y - ptr.y) * 0.2;
      ptr.on += (target.on - ptr.on) * 0.12;
      draw((now - start) / 1000);
    };
    const move = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
      target.on = 1;
    };
    const leave = () => {
      target.on = 0;
    };
    const run = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.dataset.state = 'live';
      if (calm.matches) draw(6); // one still frame
      else if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      if (!raf) draw(calm.matches ? 6 : (performance.now() - start) / 1000);
    });
    ro.observe(canvas);
    document.addEventListener('visibilitychange', run);
    calm.addEventListener('change', run);
    // The twirl follows the pointer; with reduced motion the single still frame never reads it.
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    // Wait a moment so the page can load first; the CSS gradient shows meanwhile
    const timer = window.setTimeout(run, 600);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', run);
      calm.removeEventListener('change', run);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} aria-hidden="true" className="shader-bg" />
      <div aria-hidden="true" className="shader-veil" />
    </>
  );
}
