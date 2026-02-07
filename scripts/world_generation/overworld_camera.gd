extends Camera2D

@export var zoom_step: float = 0.1
@export var min_zoom: float = 0.2
@export var max_zoom: float = 4.0
@export var move_speed: float = 600.0

const PAN_THRESHOLD: float = 3.0

var _is_panning := false
var _pan_pointer_index := -1
var _pan_start_screen := Vector2.ZERO
var _pan_start_position := Vector2.ZERO
var _pan_exceeded_threshold := false

func _unhandled_input(event: InputEvent) -> void:
	var mouse_event := event as InputEventMouseButton
	if mouse_event != null:
		if mouse_event.button_index == MOUSE_BUTTON_WHEEL_UP:
			adjust_zoom(zoom_step)
			return
		if mouse_event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			adjust_zoom(-zoom_step)
			return
		if mouse_event.button_index == MOUSE_BUTTON_LEFT:
			if mouse_event.pressed:
				_start_pan(mouse_event.position, -1)
			else:
				_end_pan()
			return

	var touch_event := event as InputEventScreenTouch
	if touch_event != null:
		if touch_event.pressed:
			_start_pan(touch_event.position, touch_event.index)
		else:
			_end_pan()
		return

	var drag_event := event as InputEventScreenDrag
	if drag_event != null:
		_update_pan(drag_event.position, drag_event.index)
		return

	var motion_event := event as InputEventMouseMotion
	if motion_event != null:
		_update_pan(motion_event.position, -1)

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

func _start_pan(screen_position: Vector2, pointer_index: int) -> void:
	_is_panning = true
	_pan_pointer_index = pointer_index
	_pan_start_screen = screen_position
	_pan_start_position = global_position
	_pan_exceeded_threshold = false

func _update_pan(screen_position: Vector2, pointer_index: int) -> void:
	if not _is_panning or _pan_pointer_index != pointer_index:
		return
	var delta := screen_position - _pan_start_screen
	if not _pan_exceeded_threshold and delta.length() > PAN_THRESHOLD:
		_pan_exceeded_threshold = true
		get_viewport().set_input_as_handled()
	if not _pan_exceeded_threshold:
		return
	var world_delta := delta / zoom
	global_position = _pan_start_position - world_delta

func _end_pan() -> void:
	if not _is_panning:
		return
	_is_panning = false
	_pan_pointer_index = -1
