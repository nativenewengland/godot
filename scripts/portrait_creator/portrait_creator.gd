@tool
class_name PortraitCreator
extends Control

signal resend_images

## This needs to match with the indexes in the file
## portrait_indexes.gdshaderinc with identifier uid://wfjoy5r4lanh
enum Images {
	PORTRAIT,
	BEARD,
	HAIR
}
const AMOUNT_OF_IMAGES := 3

static var instance: PortraitCreator

@export var target_render: Control
@export var part_picker: PackedScene

@export_group(&"Directories")
@export var character_name: LineEdit
@export var clan_name: LineEdit

@export_group(&"Directories")
@export_dir var portrait_dir: String
@export_dir var beard_dir: String
@export_dir var hair_dir: String

@export_group(&"Sliders")
@export var skin_color: HSlider
@export var hair_color: HSlider
@export var beard_color: HSlider

@export_group(&"Default images")
@export var portrait: CompressedTexture2D:
	set(value):
		portrait = value
		resend_images.emit()

@export var beard: CompressedTexture2D:
	set(value):
		beard = value
		resend_images.emit()

@export var hair: CompressedTexture2D:
	set(value):
		hair = value
		resend_images.emit()

var _images: Array[CompressedTexture2D]
var _colors: Array[Vector3]

var _selected := Images.PORTRAIT

var _available_beards: Array[CompressedTexture2D]

func _enter_tree() -> void:
	instance = self

func _ready() -> void:
	skin_color.value_changed.connect(_on_color_changed.bind(Images.PORTRAIT))
	hair_color.value_changed.connect(_on_color_changed.bind(Images.HAIR))
	beard_color.value_changed.connect(_on_color_changed.bind(Images.BEARD))

	character_name.text_changed.connect(_on_name_changed)

	resend_images.connect(_on_resend_images)

	_images.resize(3)
	_colors.resize(3)

func _on_name_changed(new_text: String) -> void:
	var split := new_text.rsplit(" ")
	split.remove_at(0)
	clan_name.text = " ".join(split)

	for curr_idx in AMOUNT_OF_IMAGES:
		_colors[curr_idx].z = 1

	var dir := DirAccess.open(beard_dir)
	for curr_file in dir.get_files():
		if !curr_file.ends_with(".png"): return
		_available_beards.append(load(beard_dir + curr_file))

func _on_resend_images() -> void:
	_images[Images.PORTRAIT] = portrait
	_images[Images.BEARD] = beard
	_images[Images.HAIR] = hair

	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"images", _images)

func _on_color_changed(value: float, type: Images) -> void:
	_colors[type].x = value
	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"colors", _colors)

func _on_gamma_changed(value: float) -> void:
	_colors[_selected].z = value
	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"colors", _colors)

func _on_return_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/mainmenu.tscn")
