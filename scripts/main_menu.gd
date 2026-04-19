extends Control

@onready var load_game_button: Button = %LoadGameButton

func _ready() -> void:
	_refresh_load_button()

func _refresh_load_button() -> void:
	if load_game_button == null:
		return
	var game_session := get_node_or_null("/root/GameSession")
	var has_save := game_session != null and game_session.has_method("has_save_file") and bool(game_session.call("has_save_file"))
	load_game_button.disabled = not has_save

func _on_start_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/character_creator.tscn")


func _on_options_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/options_menu.tscn")


func _on_shattered_pixel_dungeon_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/shattered_pixel_dungeon_windows.tscn")


func _on_load_game_button_pressed() -> void:
	var game_session := get_node_or_null("/root/GameSession")
	if game_session == null or not game_session.has_method("load_from_file"):
		return
	if not bool(game_session.call("load_from_file")):
		return
	get_tree().change_scene_to_file("res://scenes/overworld.tscn")


func _on_return_button_pressed() -> void:
	get_tree().quit()
