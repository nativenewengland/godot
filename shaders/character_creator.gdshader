shader_type canvas_item;

#include "color_correction/hsv_shift.gdshaderinc"

#include "portrait_indexes.gdshaderinc"

uniform sampler2D images[3] : source_color, filter_nearest;

// Actually vectors filled with HSV data
uniform vec3 colors[3] : source_color;

void fragment() {
	vec3 color;
	float alpha;
	
	for(int i = 0; i < 3; i++){
		vec3 chosen_color = colors[i];
		vec4 orig_color = texture(images[i], UV);
		vec3 changed_color = vec3(recolor(orig_color.rgb, chosen_color.x * 360.0));
		changed_color = pow(changed_color, vec3(1.0 /chosen_color.z));
		color = mix(color, changed_color, orig_color.a);
		alpha = max(orig_color.a, alpha);
	}
	
	COLOR = vec4(color, alpha);
}
