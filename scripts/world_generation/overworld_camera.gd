extends Camera2D

@export var zoom_step: float = 0.1
@export var min_zoom: float = 0.2
@export var max_zoom: float = 4.0
@export var move_speed: float = 600.0

func _unhandled_input(event: InputEvent) -> void:
	var mouse_event := event as InputEventMouseButton
	if mouse_event == null or not mouse_event.pressed:
		return
	if mouse_event.button_index == MOUSE_BUTTON_WHEEL_UP:
		adjust_zoom(-zoom_step)
	elif mouse_event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
		adjust_zoom(zoom_step)

func _physics_process(delta: float) -> void:
	var direction := Vector2.ZERO
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		direction.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		direction.y += 1.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		direction.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		direction.x += 1.0

	if direction != Vector2.ZERO:
		global_position += direction.normalized() * move_speed * delta

func adjust_zoom(delta: float) -> void:
	var next_zoom := clampf(zoom.x + delta, min_zoom, max_zoom)
	if is_equal_approx(next_zoom, zoom.x):
		return
	var mouse_world_before := get_global_mouse_position()
	zoom = Vector2(next_zoom, next_zoom)
	var mouse_world_after := get_global_mouse_position()
	global_position += mouse_world_before - mouse_world_after
