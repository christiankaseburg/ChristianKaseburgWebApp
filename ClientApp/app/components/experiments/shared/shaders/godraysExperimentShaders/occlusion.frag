precision highp float;

uniform vec3 color;

varying vec2 vUv;
varying vec3 L;
varying vec3 n;
varying vec3 e;
varying float vDiffuse;

	void main() {
		gl_FragColor = vec4(color, 1.0);
	}