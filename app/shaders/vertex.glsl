attribute vec2 a_image_position;
attribute vec2 a_image_texcoord;

uniform vec2 u_screen_size;
uniform vec2 u_image_size;

varying vec2 v_image_texcoord;

vec2 computeCoverSize(vec2 screenSize, vec2 imageSize) {
  float screenAspectRatio = screenSize.x / screenSize.y;
  float imageAspectRatio = imageSize.x / imageSize.y;

  return imageAspectRatio < screenAspectRatio ?
    vec2(screenSize.x, screenSize.x / imageAspectRatio) :
    vec2(screenSize.y * imageAspectRatio, screenSize.y);
}

vec2 scaleImage(vec2 position, vec2 imageSize, vec2 coverSize) {
  return a_image_position * coverSize / imageSize;
}

// todo: support max / min
vec2 translateImage(vec2 scaledImage, vec2 screenSize, vec2 coverSize) {
  vec2 translationMatrix = vec2(
    screenSize.x < coverSize.x ? screenSize.x - coverSize.x : 0.0,
    screenSize.y < coverSize.y ? screenSize.y - coverSize.y : 0.0
  );

  return scaledImage + translationMatrix;
}

vec2 toClipSpace(vec2 finalSize, vec2 screenSize) {
  vec2 zeroToOne = finalSize / screenSize;
  vec2 zeroToTwo = zeroToOne * 2.0;

  return zeroToTwo - 1.0;
}

void main() {
  vec2 coverSize = computeCoverSize(u_screen_size, u_image_size);

  vec2 scaledImage = scaleImage(a_image_position, u_image_size, coverSize);
  vec2 translatedImage = translateImage(scaledImage, u_screen_size, coverSize);
  vec2 clipSpace = toClipSpace(translatedImage, u_screen_size);

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_image_texcoord = a_image_texcoord;
}
