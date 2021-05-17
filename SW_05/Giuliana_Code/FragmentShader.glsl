
precision mediump float;

varying vec3 fragColor;
varying vec2 vTexCoord;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

uniform sampler2D uSampler;

uniform int uEnableTexture;
uniform int uEnableLighting;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

const float ambientFactor = 0.2;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0);

void main() {
    vec3 baseColor = fragColor;
    if(uEnableTexture == 1) {
        baseColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t)).rgb;
        //baseColor = texture2D(uSampler, vTexCoord).rgb;
    }

    if(uEnableLighting == 1) {
        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);

        // diffuse lighting
        float diffuseFactor = clamp(dot(normal, lightDirectionEye), 0.0, 1.0);
        vec3 diffuseColor = diffuseFactor * baseColor.rgb;

        // specular lighting
        vec3 specularColor = vec3(1, 0, 0.13);
        if(diffuseFactor > 0.0) {
            vec3 reflectionDir = normalize(reflect(-lightDirectionEye, normal));
            vec3 eyeDir = normalize(-1.0 * vVertexPositionEye3);
            float cosPhi = pow(clamp(dot(reflectionDir, eyeDir), 0.0, 1.0), shininess);
            specularColor = cosPhi * specularMaterialColor + uLightColor * cosPhi;
        }
        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(baseColor, 1.0);
    }
}