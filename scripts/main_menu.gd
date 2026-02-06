extends Control

func _on_start_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/world_generation_display.tscn")


func _on_options_button_pressed() -> void:
	push_warning("Options menu is not implemented yet.")


func _on_return_button_pressed() -> void:
	get_tree().quit()
