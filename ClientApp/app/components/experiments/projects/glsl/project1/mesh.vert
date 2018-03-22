precision highp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform vec3 color;
 
uniform sampler2D curPos;
uniform sampler2D prevPos;
uniform vec3 lightPos;
uniform vec3 scale;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 lookup;

varying vec2 vUv;
varying float vDiffuse;
varying vec3 L;
varying vec3 n;
varying vec3 e;

	mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
		vec3 rr = vec3(sin(roll), cos(roll), 0.0);
		vec3 ww = normalize(target - origin);
		vec3 uu = normalize(cross(ww, rr));
		vec3 vv = normalize(cross(uu, ww));

	return mat3(uu, vv, ww);
	}

	void main() {
		vec2 luv = lookup;
		vec4 i = texture2D( curPos, luv );
		float life = i.w / 80.0;
		vec4 p = texture2D( prevPos, luv );
		vec3 orientation = i.xyz - p.xyz;
		mat3 rot = calcLookAtMatrix( p.xyz, i.xyz, 0.0 ); // p.xyz, i.xyz
		vec3 vPosition = rot * life * (position * scale); // life to have object shrink as it dies off.
		vPosition += mix(p.xyz, i.xyz, .5);
		vUv = uv;
            
		// Stops flickering objects
		if( i.w == 100. || p.w == 100. ) {
			vPosition.x += 100000.;
		}
            
		vec4 mvp = modelViewMatrix * vec4( vPosition, 1.0 );

		L = normalize(lightPos - vPosition.xyz);
		n = normalize( rot * normal);
		e = normalize(-vPosition.xyz);
            
		//vDiffuse = max( .0, dot( L, n ) );

		gl_Position = projectionMatrix * mvp;

	}