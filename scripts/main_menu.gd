extends Control

@onready var load_game_button: Button = %LoadGameButton
@onready var continue_button: Button = %ContinueButton
@onready var load_error_dialog: AcceptDialog = %LoadErrorDialog

func _ready() -> void:
	_refresh_load_button()

func _refresh_load_button() -> void:
	if load_game_button == null or continue_button == null:
		return
	var game_session := get_node_or_null("/root/GameSession")
	var has_save := false
	if game_session != null and game_session.has_method("has_save_file"):
		has_save = bool(game_session.call("has_save_file"))
		if has_save and game_session.has_method("can_continue_from_save"):
			has_save = bool(game_session.call("can_continue_from_save"))
	load_game_button.disabled = not has_save
	continue_button.disabled = not has_save

func _show_load_error(message: String) -> void:
	if load_error_dialog == null:
		push_warning(message)
		return
	load_error_dialog.dialog_text = message
	load_error_dialog.popup_centered()

func _try_load_latest_save() -> bool:
	var game_session := get_node_or_null("/root/GameSession")
	if game_session == null or not game_session.has_method("load_from_file"):
		_show_load_error("Unable to access game session data.")
		return false
	if not bool(game_session.call("load_from_file")):
		_show_load_error("Failed to load save data. The save file may be missing or corrupted.")
		_refresh_load_button()
		return false
	return true

func _on_start_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/character_creator.tscn")


func _on_options_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/options_menu.tscn")


func _on_load_game_button_pressed() -> void:
	if not _try_load_latest_save():
		return
	get_tree().change_scene_to_file("res://scenes/overworld.tscn")


func _on_continue_button_pressed() -> void:
	if not _try_load_latest_save():
		return
	get_tree().change_scene_to_file("res://scenes/overworld.tscn")


func _on_return_button_pressed() -> void:
	get_tree().quit()
