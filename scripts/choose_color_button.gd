extends Button


@export var what: PortraitCreator.Images


func _ready() -> void:
	var bound := PortraitCreator.instance.swap_color.bind(what)
	pressed.connect(bound)
