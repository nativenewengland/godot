extends Node2D

@export var map_size: Vector2i = Vector2i(256, 256)
@export var water_level: float = 0.45
@export var falloff_strength: float = 0.55
@export var falloff_power: float = 2.4
@export var noise_frequency: float = 2.0
@export var noise_octaves: int = 4
@export var mountain_level: float = 0.72
@export var temperature_frequency: float = 1.2
@export var rainfall_frequency: float = 1.7
@export var map_seed: int = 0
@export var tile_size: int = 32

@export_group("Biomes")
@export_range(0.0, 1.0, 0.01) var tundra_threshold: float = 0.28
@export_range(0.0, 1.0, 0.01) var desert_threshold: float = 0.25
@export_range(0.0, 1.0, 0.01) var badlands_threshold: float = 0.4
@export_range(0.0, 1.0, 0.01) var forest_threshold: float = 0.6
@export_range(0.0, 1.0, 0.01) var jungle_threshold: float = 0.75
@export_range(0.0, 1.0, 0.01) var marsh_threshold: float = 0.68

const ATLAS_TEXTURE := "res://resources/images/overworld/atlas/overworld.png"
const SAND_TILE := Vector2i(0, 0)
const GRASS_TILE := Vector2i(1, 0)
const BADLANDS_TILE := Vector2i(2, 1)
const MARSH_TILE := Vector2i(2, 4)
const SNOW_TILE := Vector2i(3, 2)
const TREE_TILE := Vector2i(0, 1)
const JUNGLE_TREE_TILE := Vector2i(0, 3)
const WATER_TILE := Vector2i(4, 1)
const MOUNTAIN_TILE := Vector2i(3, 0)

@onready var map_layer: TileMapLayer = $MapLayer
@onready var regenerate_button: Button = get_node_or_null("MapUi/TopBar/RegenerateButton")

var _atlas_source_id := -1
var _temperature_noise: FastNoiseLite
var _rainfall_noise: FastNoiseLite

func _ready() -> void:
	if map_layer == null:
		push_error("Overworld map is missing a TileMapLayer named MapLayer.")
		return
	_apply_cached_world_settings()
	_configure_tileset()
	_generate_map()
	if regenerate_button == null:
		push_error("Overworld map is missing a RegenerateButton at MapUi/TopBar/RegenerateButton.")
	else:
		regenerate_button.pressed.connect(_on_regenerate_pressed)

func _unhandled_input(event: InputEvent) -> void:
	var key_event := event as InputEventKey
	if key_event == null or not key_event.pressed:
		return
	if key_event.keycode == KEY_R:
		_regenerate_map()

func _on_regenerate_pressed() -> void:
	_regenerate_map()

func _regenerate_map() -> void:
	map_seed = 0
	_generate_map()

func _generate_map() -> void:
	if map_layer == null:
		push_error("Overworld map is missing a TileMapLayer named MapLayer.")
		return
	if map_layer.tile_set == null:
		_configure_tileset()
	map_layer.clear()

	var rng := RandomNumberGenerator.new()
	if map_seed == 0:
		rng.randomize()
		map_seed = rng.randi()
	else:
		rng.seed = map_seed

	var noise := FastNoiseLite.new()
	noise.seed = map_seed
	noise.frequency = noise_frequency / float(map_size.x)
	noise.fractal_octaves = noise_octaves
	noise.fractal_lacunarity = 2.1
	noise.fractal_gain = 0.5
	noise.noise_type = FastNoiseLite.TYPE_SIMPLEX

	_temperature_noise = FastNoiseLite.new()
	_temperature_noise.seed = map_seed + 101
	_temperature_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	_temperature_noise.frequency = temperature_frequency / float(map_size.x)
	_temperature_noise.fractal_type = FastNoiseLite.FRACTAL_FBM
	_temperature_noise.fractal_octaves = 3

	_rainfall_noise = FastNoiseLite.new()
	_rainfall_noise.seed = map_seed + 211
	_rainfall_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	_rainfall_noise.frequency = rainfall_frequency / float(map_size.x)
	_rainfall_noise.fractal_type = FastNoiseLite.FRACTAL_FBM
	_rainfall_noise.fractal_octaves = 4

	for y in range(map_size.y):
		for x in range(map_size.x):
			var height := _sample_height(noise, x, y)
			var temperature := _sample_temperature(x, y, height)
			var rainfall := _sample_rainfall(x, y, height)
			var tile_coords := _biome_to_tile(height, temperature, rainfall)
			map_layer.set_cell(Vector2i(x, y), _atlas_source_id, tile_coords)

func _sample_height(noise: FastNoiseLite, x: int, y: int) -> float:
	var nx := (float(x) / float(map_size.x)) * 2.0 - 1.0
	var ny := (float(y) / float(map_size.y)) * 2.0 - 1.0
	var distance := Vector2(nx, ny).length()
	var falloff := pow(distance, falloff_power) * falloff_strength
	var noise_value := noise.get_noise_2d(float(x), float(y))
	var height := (noise_value + 1.0) * 0.5
	return clampf(height - falloff, 0.0, 1.0)


func _sample_temperature(x: int, y: int, elevation: float) -> float:
	var latitude := absf((float(y) / maxf(1.0, float(map_size.y - 1))) * 2.0 - 1.0)
	var latitudinal_cold := pow(latitude, 1.4)
	var variation := (_temperature_noise.get_noise_2d(float(x), float(y)) + 1.0) * 0.5
	return clampf((variation * 0.55 + (1.0 - latitudinal_cold) * 0.45) - maxf(0.0, elevation - mountain_level) * 0.8, 0.0, 1.0)


func _sample_rainfall(x: int, y: int, elevation: float) -> float:
	var humidity := (_rainfall_noise.get_noise_2d(float(x), float(y)) + 1.0) * 0.5
	return clampf(humidity + maxf(0.0, mountain_level - elevation) * 0.2, 0.0, 1.0)


func _biome_to_tile(height: float, temperature: float, rainfall: float) -> Vector2i:
	if height < water_level:
		return WATER_TILE
	if height > mountain_level:
		return MOUNTAIN_TILE
	if temperature < tundra_threshold:
		return SNOW_TILE
	if rainfall > marsh_threshold:
		return MARSH_TILE
	if rainfall < desert_threshold:
		return SAND_TILE
	if rainfall < badlands_threshold:
		return BADLANDS_TILE
	if rainfall > jungle_threshold && temperature > 0.6:
		return JUNGLE_TREE_TILE
	if rainfall > forest_threshold:
		return TREE_TILE
	return GRASS_TILE

func _configure_tileset() -> void:
	var tile_set := TileSet.new()
	tile_set.tile_size = Vector2i(tile_size, tile_size)
	var overworld_atlas := TileSetAtlasSource.new()
	overworld_atlas.texture = load(ATLAS_TEXTURE)
	overworld_atlas.texture_region_size = Vector2i(tile_size, tile_size)
	for tile_coords: Vector2i in [
		SAND_TILE,
		GRASS_TILE,
		BADLANDS_TILE,
		MARSH_TILE,
		SNOW_TILE,
		TREE_TILE,
		JUNGLE_TREE_TILE,
		WATER_TILE,
		MOUNTAIN_TILE
	]:
		overworld_atlas.create_tile(tile_coords)
	_atlas_source_id = tile_set.add_source(overworld_atlas)
	map_layer.tile_set = tile_set
	map_layer.position = Vector2.ZERO

func _apply_cached_world_settings() -> void:
	var game_session := get_node_or_null("/root/GameSession")
	if game_session == null:
		return
	if game_session.has_method("get_world_settings"):
		var settings: Dictionary = game_session.call("get_world_settings")
		if settings.has("map_dimensions"):
			map_size = settings["map_dimensions"]
