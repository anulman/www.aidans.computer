import Ember from 'ember';

import { cover } from '../../../utils/intrinsic-scale';
import { randomNumber } from '../../../utils/random';

const {
  Component,
  computed,
  isBlank
} = Ember;

const MAX_HORIZONTAL_OFFSET = 20;

export default Component.extend({
  tagName: 'canvas',

  imageUrl: null,
  maxHorizontalOffset: MAX_HORIZONTAL_OFFSET,

  context: computed('element', function() {
    let canvas = this.get('element');

    return isBlank(canvas) ? null : canvas.getContext('2d');
  }),

  didInsertElement() {
    this.image = new Image();
    this.image.src = this.get('imageUrl');
    this.image.onload = start.bind(this);
  },

  draw(numRemaining) {
    resetCanvasDimensions(this.element);

    let { context, image } = this.getProperties('context', 'image');
    let { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    let { width: imageWidth, height: imageHeight } = image;

    let destination = cover(windowWidth, windowHeight, imageWidth, imageHeight);
    let scale = image.height / destination.height;
    let source = {
      x: scale * destination.x * -1,
      y: Math.min(scale * destination.y * -2, 100),
      width: imageWidth,
      height: imageHeight
    };

    destination.x = 0;
    destination.y = 0;

    if (isBlank(numRemaining) || numRemaining === 0) {
      numRemaining = randomNumber(2, 5);

      drawRaw(context, image, source, destination);
      setTimeout(this.draw.bind(this, numRemaining), randomNumber(1500, 5000));
    } else {
      // todo: better glitch handling -- use shader?
      let baseX = source.x;
      let numVerticalSlices;
      let offset = this.get('maxHorizontalOffset');

      destination.height = randomNumber(20, 50);
      source.height = destination.height * scale;

      numVerticalSlices = Math.round(windowHeight / destination.height);

      while (numVerticalSlices > 0) {
        source.x = baseX + randomNumber(-Math.abs(offset), offset);

        drawRaw(context, image, source, destination);

        source.y += source.height;
        destination.y += destination.height;

        numVerticalSlices -= 1;
      }

      setTimeout(this.draw.bind(this, numRemaining - 1), randomNumber(30, 150));
    }
  }
});

function start() {
  this.draw();
  document.querySelector('body').style.background = 'unset';
}

function resetCanvasDimensions(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawRaw(ctx, image, source, destination) {
  ctx.drawImage(...[
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    destination.x,
    destination.y,
    destination.width,
    destination.height
  ]);
}
