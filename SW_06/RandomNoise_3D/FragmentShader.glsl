precision mediump float;

uniform bool uEnableTexture;
uniform bool uEnableLighting;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform sampler2D uSampler;

varying vec3 vColor;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
varying vec2 vTextureCoord;
varying float vTimeMap;
varying float vScale;

const float ambientFactor = 0.2;
const float shinyness = 200.0;
const vec3 specularMaterialColor = vec3(1);

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(22.9898,78.233)))*
        43.543123);
}

void main() {
    vec3 baseColor = vColor;
    if(uEnableTexture) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
    }

    if(uEnableLighting) {
        vec2 st = vTextureCoord.xy * vTimeMap * 10.0  * vScale;       
        st = floor(st);
        float rnd = random(st);
        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor;

        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);


        // diffuse lighting
        float diffuseFactor = clamp(dot(normal, lightDirectionEye), 0.0, 1.0);
        vec3 diffuseColor = diffuseFactor * baseColor;

        // specular lighting
        vec3 specularColor = vec3(rnd,rnd,0);
        if(diffuseFactor > 0.0) {
            vec3 reflectionDir = normalize(reflect(-lightDirectionEye, normal));
            vec3 eyeDir = normalize(-1.0 * vVertexPositionEye3);
            float cosPhi = pow(clamp(dot(reflectionDir, eyeDir), 0.0, 1.0), shinyness);
            specularColor = cosPhi * specularMaterialColor + uLightColor * cosPhi;
        }


     

        vec3 color = ambientColor + vec3(vTimeMap, 0, 0)  + diffuseColor * vec3(rnd) + specularColor  + vTimeMap * rnd;

        gl_FragColor =  vec4(color, 1.0) ;
    }else{
        gl_FragColor = vec4(baseColor, 1.0);
    }
}