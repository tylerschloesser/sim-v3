#version 300 es

precision mediump float;

uniform mat4 uTransform;

in vec2 aVertex;
in mat4 aMatrix;
in vec4 aColor;

out vec4 vColor;

void main() {
  gl_Position = uTransform * aMatrix * vec4(aVertex, 0, 1);
  vColor = aColor;
}
