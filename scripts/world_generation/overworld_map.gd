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
@export_range(0.0, 1.0, 0.01) var hot_threshold: float = 0.7
@export_range(0.0, 1.0, 0.01) var warm_threshold: float = 0.55

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
const BIOME_WATER := "water"
const BIOME_MOUNTAIN := "mountain"
const BIOME_MARSH := "marsh"
const BIOME_TUNDRA := "tundra"
const BIOME_DESERT := "desert"
const BIOME_BADLANDS := "badlands"
const BIOME_FOREST := "forest"
const BIOME_JUNGLE := "jungle"
const BIOME_GRASSLAND := "grassland"

const TREE_BIOMES: Array[String] = [
	BIOME_FOREST,
	BIOME_JUNGLE,
	BIOME_TUNDRA
]

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

	var height_map: Dictionary = {}
	var temperature_map: Dictionary = {}
	var moisture_map: Dictionary = {}
	var biome_map: Dictionary = {}

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
			var moisture := _sample_moisture(x, y, height)
			var coord := Vector2i(x, y)
			height_map[coord] = height
			temperature_map[coord] = temperature
			moisture_map[coord] = moisture

	for y in range(map_size.y):
		for x in range(map_size.x):
			var coord := Vector2i(x, y)
			var height: float = height_map[coord]
			var temperature: float = temperature_map[coord]
			var moisture: float = moisture_map[coord]
			biome_map[coord] = _assign_base_biome(coord, height, temperature, moisture, height_map)

	_apply_tree_overlays(biome_map, temperature_map, moisture_map)
	_smooth_biomes(biome_map, 2)

	for y in range(map_size.y):
		for x in range(map_size.x):
			var coord := Vector2i(x, y)
			var tile_coords := _biome_to_tile(biome_map.get(coord, BIOME_GRASSLAND))
			map_layer.set_cell(coord, _atlas_source_id, tile_coords)

func _sample_height(noise: FastNoiseLite, x: int, y: int) -> float:
	var nx := (float(x) / float(map_size.x)) * 2.0 - 1.0
	var ny := (float(y) / float(map_size.y)) * 2.0 - 1.0
	var distance := Vector2(nx, ny).length()
	var falloff := pow(distance, falloff_power) * falloff_strength
	var noise_value := noise.get_noise_2d(float(x), float(y))
	var height := (noise_value + 1.0) * 0.5
	return clampf(height - falloff, 0.0, 1.0)


func _to_normalized(noise_sample: float) -> float:
	return clampf((noise_sample + 1.0) * 0.5, 0.0, 1.0)


func _sample_temperature(x: int, y: int, elevation: float) -> float:
	var latitude := absf((float(y) / maxf(1.0, float(map_size.y - 1))) * 2.0 - 1.0)
	var latitudinal_cold := pow(latitude, 1.4)
	var base_variation := _to_normalized(_temperature_noise.get_noise_2d(float(x), float(y)))
	var detail_variation := _to_normalized(_temperature_noise.get_noise_2d(float(x) * 2.1, float(y) * 2.1))
	var layered_noise := base_variation * 0.7 + detail_variation * 0.3
	var above_sea := maxf(0.0, elevation - water_level)
	var elevation_cooling := above_sea * 0.9
	return clampf((layered_noise * 0.55 + (1.0 - latitudinal_cold) * 0.45) - elevation_cooling, 0.0, 1.0)


func _sample_rainfall(x: int, y: int, elevation: float) -> float:
	var humidity := _to_normalized(_rainfall_noise.get_noise_2d(float(x), float(y)))
	var orographic := maxf(0.0, mountain_level - elevation) * 0.25
	return clampf(humidity + orographic, 0.0, 1.0)


func _sample_moisture(x: int, y: int, elevation: float) -> float:
	var rainfall := _sample_rainfall(x, y, elevation)
	var drainage := clampf(1.0 - elevation, 0.0, 1.0)
	var noise_variation := _to_normalized(_rainfall_noise.get_noise_2d(float(x) * 1.9, float(y) * 1.9))
	return clampf(rainfall * 0.55 + drainage * 0.3 + noise_variation * 0.15, 0.0, 1.0)


func _assign_base_biome(
	coord: Vector2i,
	height: float,
	temperature: float,
	moisture: float,
	height_map: Dictionary
) -> String:
	if height < water_level:
		return BIOME_WATER
	if height > mountain_level:
		return BIOME_MOUNTAIN
	if _is_marsh(coord, height, moisture, height_map):
		return BIOME_MARSH
	if temperature < tundra_threshold:
		return BIOME_TUNDRA
	if temperature >= hot_threshold && moisture <= desert_threshold:
		return BIOME_DESERT
	if temperature >= warm_threshold && moisture <= badlands_threshold:
		return BIOME_BADLANDS
	if moisture >= jungle_threshold:
		return _resolve_jungle_overlay(temperature, moisture)
	if moisture >= forest_threshold:
		return BIOME_GRASSLAND
	return BIOME_GRASSLAND


func _resolve_jungle_overlay(temperature: float, moisture: float) -> String:
	if moisture >= jungle_threshold && temperature >= hot_threshold:
		return BIOME_JUNGLE
	if temperature < tundra_threshold:
		return BIOME_TUNDRA
	return BIOME_FOREST


func _tree_overlay_biome(temperature: float) -> String:
	if temperature < tundra_threshold:
		return BIOME_TUNDRA
	return BIOME_FOREST


func _apply_tree_overlays(
	biome_map: Dictionary,
	temperature_map: Dictionary,
	moisture_map: Dictionary
) -> void:
	var next_map := biome_map.duplicate()
	for coord: Vector2i in biome_map.keys():
		if biome_map[coord] != BIOME_GRASSLAND:
			continue
		var moisture: float = moisture_map.get(coord, 0.0)
		if moisture < forest_threshold:
			continue
		if _has_tree_neighbor(coord, biome_map):
			var temperature: float = temperature_map.get(coord, 0.0)
			next_map[coord] = _tree_overlay_biome(temperature)
	biome_map.clear()
	for coord: Vector2i in next_map.keys():
		biome_map[coord] = next_map[coord]


func _has_tree_neighbor(coord: Vector2i, biome_map: Dictionary) -> bool:
	for offset: Vector2i in [
		Vector2i.LEFT,
		Vector2i.RIGHT,
		Vector2i.UP,
		Vector2i.DOWN,
		Vector2i(-1, -1),
		Vector2i(1, -1),
		Vector2i(-1, 1),
		Vector2i(1, 1)
	]:
		var neighbor := coord + offset
		if TREE_BIOMES.has(biome_map.get(neighbor, "")):
			return true
	return false


func _is_marsh(coord: Vector2i, height: float, moisture: float, height_map: Dictionary) -> bool:
	if moisture < marsh_threshold:
		return false
	if height <= water_level + 0.08:
		return true
	for offset: Vector2i in [
		Vector2i.LEFT,
		Vector2i.RIGHT,
		Vector2i.UP,
		Vector2i.DOWN,
		Vector2i(-1, -1),
		Vector2i(1, -1),
		Vector2i(-1, 1),
		Vector2i(1, 1)
	]:
		var neighbor := coord + offset
		var neighbor_height: float = height_map.get(neighbor, 1.0)
		if neighbor_height < water_level:
			return true
	return false


func _smooth_biomes(biome_map: Dictionary, passes: int) -> void:
	for pass_index in range(passes):
		var next_map := biome_map.duplicate()
		for coord: Vector2i in biome_map.keys():
			var current: String = biome_map.get(coord, BIOME_GRASSLAND)
			if current == BIOME_WATER || current == BIOME_MOUNTAIN:
				continue
			var neighbor_counts: Dictionary = {}
			for offset: Vector2i in [
				Vector2i.LEFT,
				Vector2i.RIGHT,
				Vector2i.UP,
				Vector2i.DOWN,
				Vector2i(-1, -1),
				Vector2i(1, -1),
				Vector2i(-1, 1),
				Vector2i(1, 1)
			]:
				var neighbor := coord + offset
				var neighbor_biome: String = biome_map.get(neighbor, current)
				if neighbor_biome == BIOME_WATER || neighbor_biome == BIOME_MOUNTAIN:
					continue
				neighbor_counts[neighbor_biome] = int(neighbor_counts.get(neighbor_biome, 0)) + 1
			var most_common: String = current
			var most_common_count := -1
			for biome: String in neighbor_counts.keys():
				var count: int = neighbor_counts[biome]
				if count > most_common_count:
					most_common = biome
					most_common_count = count
			if most_common != current and most_common_count >= 0:
				next_map[coord] = most_common
		biome_map.clear()
		for coord: Vector2i in next_map.keys():
			biome_map[coord] = next_map[coord]


func _biome_to_tile(biome: String) -> Vector2i:
	match biome:
		BIOME_WATER:
			return WATER_TILE
		BIOME_MOUNTAIN:
			return MOUNTAIN_TILE
		BIOME_MARSH:
			return MARSH_TILE
		BIOME_TUNDRA:
			return SNOW_TILE
		BIOME_DESERT:
			return SAND_TILE
		BIOME_BADLANDS:
			return BADLANDS_TILE
		BIOME_FOREST:
			return TREE_TILE
		BIOME_JUNGLE:
			return JUNGLE_TREE_TILE
		_:
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
