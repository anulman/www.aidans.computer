import Ember from 'ember';

import { createProgram } from 'ember-cli-webgl/utils';
import vertexShader from './vertex';
import fragmentShader from './fragment';

const {
  Component,
  computed,
  isBlank,
  isPresent
} = Ember;

const MAX_HORIZONTAL_OFFSET = 20;
const CLOCK_START_MARK_NAME = 'ember-cli-webgl:clockStart';

export default Component.extend({
  tagName: 'canvas',

  imageUrl: null,
  maxHorizontalOffset: MAX_HORIZONTAL_OFFSET,

  gl: computed('element', function() {
    let canvas = this.get('element');

    return isBlank(canvas) ? null : canvas.getContext('webgl');
  }),

  program: computed('gl', function() {
    let gl = this.get('gl');

    return createProgram(gl, vertexShader, fragmentShader);
  }),

  didInsertElement() {
    let { gl, program } = this.getProperties('gl', 'program');

    if (isPresent(program)) {
      let image = new Image();
      let element = this.element;

      image.src = this.getWithDefault('imageSrc', getBackgroundImage(element));
      image.onload = startProgram.bind(this, image, gl, program);
    }
  }
});

function getBackgroundImage(element) {
  let string = getComputedStyle(element)['background-image'] || '';

  return string
    .replace('url("', '')
    .replace('")', '');
}

function startProgram(image, gl, program) {
  // n.b. in future iterations:
  // - use GLSL AST to auto-extract variables
  // - how can we identify multiple fragments?
  let pointers = {
    aImagePosition: {
      location: gl.getAttribLocation(program, "a_image_position"),
      buffer: gl.createBuffer()
    },
    aImageTexcoord: {
      location: gl.getAttribLocation(program, "a_image_texcoord"),
      buffer: gl.createBuffer()
    },
    iTime: {
      location: gl.getUniformLocation(program, "iTime")
    },
    uScreenSize: {
      location: gl.getUniformLocation(program, "u_screen_size")
    },
    uImageSize: {
      location: gl.getUniformLocation(program, "u_image_size")
    }
  };

  gl.useProgram(program);
  performance.mark(CLOCK_START_MARK_NAME);

  loadTextureFor(gl, image, pointers);
  resizeCanvas(gl, image, pointers);
  drawScene(gl, pointers);
  this.element.style.setProperty('background', 'none');

  window.addEventListener('resize', resizeCanvas.bind(this, ...[
    gl,
    image,
    pointers
  ]));
}

function resizeCanvas(gl, image, { aImagePosition, aImageTexcoord }) {
  gl.canvas.width = window.innerWidth;
  gl.canvas.height = window.innerHeight;

  bufferRectData(gl, aImagePosition, 0, 0, image.width, image.height);
  bufferRectData(gl, aImageTexcoord);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function loadTextureFor(gl, image, pointers) {
  let { uImageSize } = pointers;
  let texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.uniform2f(uImageSize.location, image.width, image.height);

  return texture;
}

function drawScene(gl, pointers) {
  let [marker] = performance.getEntriesByName(CLOCK_START_MARK_NAME)
  let { aImagePosition, aImageTexcoord, iTime, uScreenSize } = pointers;
  let iTimeValue = (performance.now() - marker.startTime) / 1000;

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enableVertexAttribArray(aImagePosition.location);
  gl.bindBuffer(gl.ARRAY_BUFFER, aImagePosition.buffer);
  gl.vertexAttribPointer(aImagePosition.location, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(aImageTexcoord.location);
  gl.bindBuffer(gl.ARRAY_BUFFER, aImageTexcoord.buffer);
  gl.vertexAttribPointer(aImageTexcoord.location, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(uScreenSize.location, window.innerWidth, window.innerHeight);
  gl.uniform1f(iTime.location, iTimeValue);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(drawScene.bind(this, gl, pointers, marker));
}

function bufferRectData(gl, { buffer }, x = 0, y = 0, width = 1, height = 1) {
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2
  ]), gl.STATIC_DRAW);
}
