extends Control

const RESOLUTIONS: Array[Vector2i] = [
	Vector2i(1280, 720),
	Vector2i(1600, 900),
	Vector2i(1920, 1080)
]

@onready var fullscreen_check_box: CheckBox = $Panel/MarginContainer/VBoxContainer/FullscreenCheckBox
@onready var vsync_check_box: CheckBox = $Panel/MarginContainer/VBoxContainer/VsyncCheckBox
@onready var resolution_option_button: OptionButton = $Panel/MarginContainer/VBoxContainer/ResolutionRow/ResolutionOptionButton
@onready var master_volume_slider: HSlider = $Panel/MarginContainer/VBoxContainer/MasterVolumeRow/MasterVolumeSlider
@onready var music_volume_slider: HSlider = $Panel/MarginContainer/VBoxContainer/MusicVolumeRow/MusicVolumeSlider
@onready var sfx_volume_slider: HSlider = $Panel/MarginContainer/VBoxContainer/SfxVolumeRow/SfxVolumeSlider
@onready var state_toggle_check_box: CheckBox = $Panel/MarginContainer/VBoxContainer/StateToggleCheckBox
@onready var back_button: Button = $Panel/MarginContainer/VBoxContainer/BackButton

var state_toggle_enabled: bool = false

func _ready() -> void:
	var settings: Dictionary = GameSession.get_settings()
	fullscreen_check_box.set_pressed_no_signal(bool(settings.get("fullscreen", false)))
	vsync_check_box.set_pressed_no_signal(bool(settings.get("vsync", true)))
	master_volume_slider.set_value_no_signal(float(settings.get("master_volume", 100.0)))
	music_volume_slider.set_value_no_signal(float(settings.get("music_volume", 80.0)))
	sfx_volume_slider.set_value_no_signal(float(settings.get("sfx_volume", 80.0)))
	state_toggle_enabled = bool(settings.get("state_toggle_enabled", false))
	state_toggle_check_box.set_pressed_no_signal(state_toggle_enabled)

	var resolution: Vector2i = settings.get("resolution", Vector2i(1920, 1080))
	var resolution_index: int = RESOLUTIONS.find(resolution)
	resolution_option_button.select(resolution_index if resolution_index >= 0 else RESOLUTIONS.size() - 1)

	back_button.pressed.connect(_on_back_button_pressed)
	fullscreen_check_box.toggled.connect(_on_fullscreen_toggled)
	vsync_check_box.toggled.connect(_on_vsync_toggled)
	resolution_option_button.item_selected.connect(_on_resolution_item_selected)
	master_volume_slider.value_changed.connect(_on_master_volume_value_changed)
	music_volume_slider.value_changed.connect(_on_music_volume_value_changed)
	sfx_volume_slider.value_changed.connect(_on_sfx_volume_value_changed)
	state_toggle_check_box.toggled.connect(_on_state_toggle_toggled)


func _on_back_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/mainmenu.tscn")


func _on_fullscreen_toggled(toggled_on: bool) -> void:
	GameSession.update_settings({"fullscreen": toggled_on})


func _on_master_volume_value_changed(value: float) -> void:
	GameSession.update_settings({"master_volume": value})


func _on_music_volume_value_changed(value: float) -> void:
	GameSession.update_settings({"music_volume": value})


func _on_sfx_volume_value_changed(value: float) -> void:
	GameSession.update_settings({"sfx_volume": value})


func _on_resolution_item_selected(index: int) -> void:
	if index < 0 or index >= RESOLUTIONS.size():
		return
	GameSession.update_settings({"resolution": RESOLUTIONS[index]})


func _on_vsync_toggled(toggled_on: bool) -> void:
	GameSession.update_settings({"vsync": toggled_on})


func _on_state_toggle_toggled(toggled_on: bool) -> void:
	state_toggle_enabled = toggled_on
	GameSession.update_settings({"state_toggle_enabled": toggled_on})
