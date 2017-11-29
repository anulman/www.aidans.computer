precision mediump float;

uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = texture2D(iChannel0, v_texCoord);
}
