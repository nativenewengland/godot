extends Button


@export var what: PortraitCreator.Images


func _ready() -> void:
	var creator := PortraitCreator.instance
	if creator == null:
		return
	var bound: Callable = creator.swap_color.bind(what)
	pressed.connect(bound)
