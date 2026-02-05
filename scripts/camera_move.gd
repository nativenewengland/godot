extends Camera2D

var max_offset_x: float
var max_offset_y: float

func _ready() -> void:
	position = position.round()
	set_max_offset()

func _physics_process(_delta: float) -> void:
	update_camera_position()


func set_max_offset() -> void:
	var window_size := DisplayServer.window_get_size()
	max_offset_x = window_size.x * 0.5
	max_offset_y = window_size.y * 0.5

func update_camera_position() -> void:
	var mouse_pos := get_local_mouse_position()

	mouse_pos.x = clamp(mouse_pos.x, -max_offset_x, max_offset_x)
	mouse_pos.y = clamp(mouse_pos.y, -max_offset_y, max_offset_y)

	set_position(mouse_pos)
	print(mouse_pos)
