shader_type canvas_item;

uniform sampler2D backdrop_texture : source_color, repeat_enable;
uniform float pan_speed = 0.02;
uniform float blur_strength = 1.6;
uniform vec4 tint_color : source_color = vec4(0.18, 0.24, 0.34, 0.9);

void fragment() {
	vec2 pan_uv = vec2(UV.x, fract(UV.y + (TIME * pan_speed)));
	vec2 texel = (1.0 / vec2(textureSize(backdrop_texture, 0))) * blur_strength;

	vec4 blurred = texture(backdrop_texture, pan_uv) * 0.227027;
	blurred += texture(backdrop_texture, pan_uv + vec2(texel.x, 0.0)) * 0.1945946;
	blurred += texture(backdrop_texture, pan_uv - vec2(texel.x, 0.0)) * 0.1945946;
	blurred += texture(backdrop_texture, pan_uv + vec2(0.0, texel.y)) * 0.1216216;
	blurred += texture(backdrop_texture, pan_uv - vec2(0.0, texel.y)) * 0.1216216;
	blurred += texture(backdrop_texture, pan_uv + texel) * 0.0702703;
	blurred += texture(backdrop_texture, pan_uv - texel) * 0.0702703;

	COLOR = vec4((blurred.rgb * tint_color.rgb), 1.0) * tint_color.a;
}
