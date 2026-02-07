extends Node2D

@export var map_size: Vector2i = Vector2i(256, 256)
@export var water_level: float = 0.45
@export var falloff_strength: float = 0.55
@export var falloff_power: float = 2.4
@export var noise_frequency: float = 2.0
@export var noise_octaves: int = 4
@export var map_seed: int = 0
@export var tile_size: int = 16

const GRASS_ATLAS_COORDS := Vector2i(1, 0)
const WATER_ATLAS_COORDS := Vector2i(4, 1)

@onready var map_layer: TileMapLayer = $MapLayer

var _tile_source_id := -1

func _ready() -> void:
	if map_layer == null:
		push_error("Overworld map is missing a TileMapLayer named MapLayer.")
		return
	_configure_tileset()
	_generate_map()

func _unhandled_input(event: InputEvent) -> void:
	var key_event := event as InputEventKey
	if key_event == null or not key_event.pressed:
		return
	if key_event.keycode == KEY_R:
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

	var image := Image.create(map_size.x, map_size.y, false, Image.FORMAT_RGBA8)
	for y in range(map_size.y):
		for x in range(map_size.x):
			var height := _sample_height(noise, x, y)
			var atlas_coords := _height_to_tile(height)
			map_layer.set_cell(Vector2i(x, y), _tile_source_id, atlas_coords)

func _sample_height(noise: FastNoiseLite, x: int, y: int) -> float:
	var nx := (float(x) / float(map_size.x)) * 2.0 - 1.0
	var ny := (float(y) / float(map_size.y)) * 2.0 - 1.0
	var distance := Vector2(nx, ny).length()
	var falloff := pow(distance, falloff_power) * falloff_strength
	var noise_value := noise.get_noise_2d(float(x), float(y))
	var height := (noise_value + 1.0) * 0.5
	return clampf(height - falloff, 0.0, 1.0)

func _height_to_tile(height: float) -> Vector2i:
	if height < water_level:
		return WATER_ATLAS_COORDS
	return GRASS_ATLAS_COORDS

func _configure_tileset() -> void:
	var tile_set := TileSet.new()
	tile_set.tile_size = Vector2i(tile_size, tile_size)
	var atlas := TileSetAtlasSource.new()
	atlas.texture = load("res://resources/images/overworld/atlas/overworld.png")
	atlas.texture_region_size = Vector2i(tile_size, tile_size)
	atlas.create_tile(GRASS_ATLAS_COORDS)
	atlas.create_tile(WATER_ATLAS_COORDS)
	_tile_source_id = tile_set.add_source(atlas)
	map_layer.tile_set = tile_set
	map_layer.position = Vector2.ZERO
