extends Camera2D

@export var zoom_step: float = 0.1
@export var min_zoom: float = 0.2
@export var max_zoom: float = 2.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP:
			adjust_zoom(-zoom_step)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			adjust_zoom(zoom_step)

func adjust_zoom(delta: float) -> void:
	var next_zoom := clampf(zoom.x + delta, min_zoom, max_zoom)
	zoom = Vector2(next_zoom, next_zoom)
