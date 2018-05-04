precision highp float;

uniform vec3 color;

varying vec2 vUv;
varying vec3 L;
varying vec3 n;
varying vec3 e;
varying float vDiffuse;

	void main() {

		vec4 spec = vec4(0.0);

		float intensity = max(dot(n, L), 0.0);
		if (intensity > 0.0) {
			vec3 h = normalize(L + e);
			float intSpec = max(dot(h,n), 0.0);
			spec = vec4(.35) * pow(intSpec, .5); // Increasing vec4 will increase the brightness on the normal
		}

		gl_FragColor = max(intensity * (vec4(color, 1.0) + spec), 0.0);
	}