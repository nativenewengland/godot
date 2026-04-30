extends Node

const WorldSettings = preload("res://scripts/world_generation/world_settings.gd")

const SAVE_FILE_PATH := "user://save_game.json"
const SAVE_FORMAT_VERSION := 1

var world_settings: Dictionary = {}
var player_character: Dictionary = {}

func set_world_settings(settings: Dictionary) -> void:
	world_settings = WorldSettings.merge_with_defaults(settings)

func get_world_settings() -> Dictionary:
	return WorldSettings.merge_with_defaults(world_settings)


func set_player_character(character: Dictionary) -> void:
	player_character = character.duplicate(true)

func get_player_character() -> Dictionary:
	return player_character.duplicate(true)

func has_player_character() -> bool:
	return not player_character.is_empty()

func has_save_file(path: String = SAVE_FILE_PATH) -> bool:
	return FileAccess.file_exists(path)

func save_to_file(path: String = SAVE_FILE_PATH) -> Error:
	var payload := {
		"version": SAVE_FORMAT_VERSION,
		"world_settings": _encode_for_json(world_settings),
		"player_character": _encode_for_json(player_character)
	}
	var file := FileAccess.open(path, FileAccess.WRITE)
	if file == null:
		return FileAccess.get_open_error()
	file.store_string(JSON.stringify(payload, "\t"))
	file.close()
	return OK

func load_from_file(path: String = SAVE_FILE_PATH) -> bool:
	if not FileAccess.file_exists(path):
		return false
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return false
	var text := file.get_as_text()
	file.close()
	var parsed: Variant = JSON.parse_string(text)
	if not (parsed is Dictionary):
		return false
	var payload := parsed as Dictionary
	var version: Variant = payload.get("version", null)
	match version:
		SAVE_FORMAT_VERSION:
			pass
		_:
			# Save schema mismatch (or missing version). Migration handling can be added here.
			return false
	var raw_world_settings: Variant = payload.get("world_settings", {})
	if not (raw_world_settings is Dictionary):
		push_warning("Failed to load save: world_settings must be a Dictionary.")
		return false

	var raw_player_character: Variant = payload.get("player_character", {})
	if not (raw_player_character is Dictionary):
		push_warning("Failed to load save: player_character must be a Dictionary.")
		return false

	var loaded_settings_variant: Variant = _decode_from_json(raw_world_settings)
	if not (loaded_settings_variant is Dictionary):
		push_warning("Failed to load save: decoded world_settings must be a Dictionary.")
		return false
	var loaded_settings: Dictionary = loaded_settings_variant as Dictionary

	var loaded_character_variant: Variant = _decode_from_json(raw_player_character)
	if not (loaded_character_variant is Dictionary):
		push_warning("Failed to load save: decoded player_character must be a Dictionary.")
		return false
	var loaded_character: Dictionary = loaded_character_variant as Dictionary

	if loaded_settings.has("map_size") and not (loaded_settings["map_size"] is String):
		push_warning("Failed to load save: world_settings.map_size must be a String when present.")
		return false

	if loaded_settings.has("map_size_key"):
		var map_size_key: Variant = loaded_settings["map_size_key"]
		if not (map_size_key is String) or not WorldSettings.MAP_SIZE_DEFINITIONS.has(String(map_size_key).to_lower()):
			push_warning("Failed to load save: world_settings.map_size_key is invalid.")
			return false

	if loaded_settings.has("map_dimensions") and not (loaded_settings["map_dimensions"] is Vector2i):
		push_warning("Failed to load save: world_settings.map_dimensions must be Vector2i when present.")
		return false

	world_settings = WorldSettings.merge_with_defaults(loaded_settings)
	player_character = loaded_character
	return true

static func _encode_for_json(value: Variant) -> Variant:
	if value is Dictionary:
		var encoded: Dictionary = {}
		for key: Variant in (value as Dictionary).keys():
			encoded[str(key)] = _encode_for_json((value as Dictionary)[key])
		return encoded
	if value is Array:
		var encoded_array: Array = []
		for item: Variant in value as Array:
			encoded_array.append(_encode_for_json(item))
		return encoded_array
	if value is Vector2i:
		var vec: Vector2i = value
		return {"__type": "Vector2i", "x": vec.x, "y": vec.y}
	if value is Vector2:
		var vec2: Vector2 = value
		return {"__type": "Vector2", "x": vec2.x, "y": vec2.y}
	return value

static func _decode_from_json(value: Variant) -> Variant:
	if value is Dictionary:
		var dict := value as Dictionary
		var type_tag := str(dict.get("__type", ""))
		if type_tag == "Vector2i":
			return Vector2i(int(dict.get("x", 0)), int(dict.get("y", 0)))
		if type_tag == "Vector2":
			return Vector2(float(dict.get("x", 0.0)), float(dict.get("y", 0.0)))
		var decoded: Dictionary = {}
		for key: Variant in dict.keys():
			decoded[key] = _decode_from_json(dict[key])
		return decoded
	if value is Array:
		var decoded_array: Array = []
		for item: Variant in value as Array:
			decoded_array.append(_decode_from_json(item))
		return decoded_array
	return value
