@tool
class_name Overworld
extends ProceduralGeneration

const DWARFHOLD_LOGIC := preload("res://scripts/world_generation/dwarfhold_logic.gd")

@export_group(&"Tiles")
@export var land_source_id := 0
@export var water_source_id := 1
@export var land_atlas_coords := Vector2i.ZERO
@export var water_atlas_coords := Vector2i.ZERO

const WATER_COLOR := Color(0.168, 0.395, 0.976, 1.0)
const LAND_COLOR := Color(0.49, 0.753, 0.404, 1.0)

const NEIGHBOR_OFFSETS: Array[Vector2i] = [
	Vector2i.LEFT,
	Vector2i.RIGHT,
	Vector2i.UP,
	Vector2i.DOWN,
	Vector2i(-1, -1),
	Vector2i(1, -1),
	Vector2i(-1, 1),
	Vector2i(1, 1)
]
const CARDINAL_OFFSETS: Array[Vector2i] = [
	Vector2i.LEFT,
	Vector2i.RIGHT,
	Vector2i.UP,
	Vector2i.DOWN
]

@export var debug_sprite: TextureRect
@export_group(&"Noise")
@export var fractal_detail: float:
	set(value):
		fractal_detail = value
		if is_node_ready():
			recreate_noise.emit()

@export var fractal_size: float:
	set(value):
		fractal_size = value
		if is_node_ready():
			recreate_noise.emit()

@export_group(&"Paint")
@export_range(0.0, 1.0, 0.01) var water_ocurrence: float:
	set(value):
		water_ocurrence = value
		if is_node_ready():
			recreate_paint.emit()

@export_range(0.0, 1.0, 0.01) var mountain_ocurrence: float:
	set(value):
		assert(value > water_ocurrence)
		mountain_ocurrence = value
		if is_node_ready():
			recreate_paint.emit()

@export_range(0.0, 1.0, 0.01) var river_ocurrence: float:
	set(value):
		river_ocurrence = value
		if is_node_ready():
			recreate_paint.emit()

@export_range(0.0, 100, 0.01) var river_max_distance: float:
	set(value):
		river_max_distance = value
		if is_node_ready():
			recreate_paint.emit()

@export_tool_button("Regenerate", "Callable") var regenerate_action := recreate_noise.emit
@export_tool_button("Generate Tilemap", "Callable") var build_tilemap := recreate_tilemap.emit

@export_group(&"Continents")
@export_range(0.1, 5.0, 0.1) var continental_frequency := 1.4
@export_range(0.0, 1.0, 0.01) var coast_width := 0.06
@export_range(0.0, 1.0, 0.01) var mountain_linearity := 0.5

@export_group(&"Climate")
@export_range(0.1, 5.0, 0.1) var temperature_frequency := 1.2
@export_range(0.1, 5.0, 0.1) var rainfall_frequency := 1.7
@export_range(0.0, 1.0, 0.01) var arid_threshold := 0.34
@export_range(0.0, 1.0, 0.01) var marsh_threshold := 0.64
@export_range(0.0, 1.0, 0.01) var snow_line := 0.29

@export_group(&"Rivers")
@export_range(0, 64, 1) var river_sources := 20
@export_range(8, 1024, 1) var river_max_steps := 300

var _noise: Image
var _orig_resized: Image
var _rng: RandomNumberGenerator
var _curr_image: Image
var _height_noise: FastNoiseLite
var _temperature_noise: FastNoiseLite
var _rainfall_noise: FastNoiseLite
var _biome_map: Dictionary[Vector2i, String] = {}
var _landmass_masks: Dictionary = {}
var settlement_map: Dictionary[Vector2i, Dictionary] = {}

func apply_world_settings(settings: Dictionary) -> void:
	if settings.is_empty():
		return

	if settings.has("map_dimensions"):
		var dims: Vector2i = settings["map_dimensions"]
		tile_map_size = dims
		size = dims * 2

	var terrain: Dictionary = settings.get("terrain_ratios", {}) as Dictionary
	water_ocurrence = clampf(0.20 + float(terrain.get("river", 0.5)) * 0.2, 0.2, 0.55)
	mountain_ocurrence = clampf(0.55 + float(terrain.get("mountain", 0.5)) * 0.35, water_ocurrence + 0.05, 0.92)
	river_sources = int(roundi(6 + float(terrain.get("river", 0.5)) * 26))
	river_max_distance = 25.0 + float(terrain.get("river", 0.5)) * 90.0
	marsh_threshold = clampf(0.55 + float(terrain.get("forest", 0.5)) * 0.2, 0.45, 0.9)
	arid_threshold = clampf(0.2 + (1.0 - float(terrain.get("forest", 0.5))) * 0.4, 0.1, 0.7)

func _apply_cached_world_settings() -> void:
	var game_session := get_node_or_null("/root/GameSession") as GameSession
	if game_session:
		apply_world_settings(game_session.get_world_settings())

func _ready() -> void:
	_apply_cached_world_settings()
	super ()
	_setup_secondary_noise()
	recreate_noise.connect(rebuild)
	recreate_paint.connect(paint)
	Seeder.instance.seed_changed.connect(rebuild)
	rebuild()

func _setup_secondary_noise() -> void:
	var curr_seed := Seeder.instance.current_seed

	_height_noise = FastNoiseLite.new()
	_height_noise.seed = curr_seed
	_height_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX_SMOOTH
	_height_noise.frequency = continental_frequency / maxf(1.0, float(size.x))
	_height_noise.fractal_type = FastNoiseLite.FRACTAL_FBM
	_height_noise.fractal_octaves = 5
	_height_noise.fractal_gain = 0.5
	_height_noise.fractal_lacunarity = 2.1

	_temperature_noise = FastNoiseLite.new()
	_temperature_noise.seed = curr_seed + 101
	_temperature_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	_temperature_noise.frequency = temperature_frequency / maxf(1.0, float(size.x))
	_temperature_noise.fractal_type = FastNoiseLite.FRACTAL_FBM
	_temperature_noise.fractal_octaves = 3

	_rainfall_noise = FastNoiseLite.new()
	_rainfall_noise.seed = curr_seed + 211
	_rainfall_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	_rainfall_noise.frequency = rainfall_frequency / maxf(1.0, float(size.x))
	_rainfall_noise.fractal_type = FastNoiseLite.FRACTAL_FBM
	_rainfall_noise.fractal_octaves = 4

func rebuild() -> void:
	_setup_secondary_noise()
	noise.fractal_gain = fractal_detail
	noise.fractal_lacunarity = fractal_size

	_noise = generate_noise()
	_noise.convert(Image.FORMAT_RGBA8)

	recreate_paint.emit()
func _is_within_bounds(coord: Vector2i, curr_size: Vector2i) -> bool:
	return coord.x >= 0 && coord.y >= 0 && coord.x < curr_size.x && coord.y < curr_size.y

func _to_normalized(noise_sample: float) -> float:
	return clampf((noise_sample + 1.0) * 0.5, 0.0, 1.0)

func _get_elevation(coord: Vector2i, curr_size: Vector2i) -> float:
	var centered := (Vector2(coord) / Vector2(curr_size) - Vector2(0.5, 0.5)) * 2.0
	var radial_falloff := clampf(centered.length(), 0.0, 1.0)
	var warp_strength := maxf(1.0, float(curr_size.x)) * 0.015
	var warp := Vector2(
		_temperature_noise.get_noise_2dv(Vector2(coord) * 0.8),
		_rainfall_noise.get_noise_2dv(Vector2(coord) * 0.8)
	) * warp_strength
	var warped_coord := Vector2(coord) + warp
	var continent := _to_normalized(_height_noise.get_noise_2dv(warped_coord * 0.45))
	var detail := _to_normalized(_height_noise.get_noise_2dv(warped_coord * 1.6))
	var ridges := 1.0 - absf(_height_noise.get_noise_2dv(warped_coord * 2.4))
	var tectonic_uplift := lerpf(continent, detail, 0.35)
	tectonic_uplift = lerpf(tectonic_uplift, maxf(tectonic_uplift, ridges), mountain_linearity * 0.6)
	var coast_variation := _height_noise.get_noise_2dv(warped_coord * 3.2) * coast_width
	var edge_falloff := pow(radial_falloff, 2.8) * 0.18
	return clampf(tectonic_uplift + coast_variation - edge_falloff, 0.0, 1.0)

func _get_farcical_continent_value(coord: Vector2i, curr_size: Vector2i) -> float:
	var base := _get_elevation(coord, curr_size)
	var wobble_scale := maxf(1.0, float(curr_size.x)) * 0.35
	var wobble := sin(float(coord.x) / wobble_scale * TAU) * cos(float(coord.y) / (wobble_scale * 0.8) * TAU)
	var swirl := sin((float(coord.x + coord.y) / (wobble_scale * 0.6)) * TAU)
	return clampf(base + wobble * 0.18 + swirl * 0.12, 0.0, 1.0)

func _get_temperature(coord: Vector2i, curr_size: Vector2i, elevation: float) -> float:
	var latitude := absf((float(coord.y) / maxf(1.0, float(curr_size.y - 1))) * 2.0 - 1.0)
	var latitudinal_cold := pow(latitude, 1.4)
	var variation := _to_normalized(_temperature_noise.get_noise_2dv(Vector2(coord)))
	return clampf((variation * 0.55 + (1.0 - latitudinal_cold) * 0.45) - maxf(0.0, elevation - mountain_ocurrence) * 0.8, 0.0, 1.0)

func _get_rainfall(coord: Vector2i, elevation: float) -> float:
	var humidity := _to_normalized(_rainfall_noise.get_noise_2dv(Vector2(coord)))
	return clampf(humidity + maxf(0.0, mountain_ocurrence - elevation) * 0.2, 0.0, 1.0)

func generate_gridmap(to_paint: Image) -> void:
	var curr_seed := Seeder.instance.current_seed
	var curr_size := to_paint.get_size()
	grid_map.clear()
	_biome_map.clear()
	settlement_map.clear()
	_rng = RandomNumberGenerator.new()
	_rng.seed = curr_seed

	for y in curr_size.y:
		for x in curr_size.x:
			var curr_vec := Vector2i(x, y)
			var elevation := _get_farcical_continent_value(curr_vec, curr_size)

			if elevation < water_ocurrence:
				grid_map[curr_vec] = {
					"source": water_source_id,
					"atlas": water_atlas_coords
				}
				_biome_map[curr_vec] = "water"
				to_paint.set_pixel(x, y, WATER_COLOR)
			else:
				grid_map[curr_vec] = {
					"source": land_source_id,
					"atlas": land_atlas_coords
				}
				_biome_map[curr_vec] = "grass"
				to_paint.set_pixel(x, y, LAND_COLOR)

	_build_landmass_masks(curr_size)
	_generate_settlements(curr_size)

func _build_landmass_masks(curr_size: Vector2i) -> void:
	var land_mask: Dictionary[Vector2i, bool] = {}
	var water_mask: Dictionary[Vector2i, bool] = {}
	var visited: Dictionary[Vector2i, bool] = {}
	var ocean_cells: Dictionary[Vector2i, bool] = {}
	var lake_cells: Dictionary[Vector2i, bool] = {}

	for y in curr_size.y:
		for x in curr_size.x:
			var coord := Vector2i(x, y)
			if _biome_map.get(coord, "") == "water":
				water_mask[coord] = true
			else:
				land_mask[coord] = true

	for coord: Vector2i in water_mask.keys():
		if visited.has(coord):
			continue
		var queue: Array[Vector2i] = [coord]
		var component: Array[Vector2i] = []
		var touches_edge := false

		while !queue.is_empty():
			var current: Vector2i = queue.pop_back()
			if visited.has(current):
				continue
			visited[current] = true
			component.append(current)
			if current.x == 0 || current.y == 0 || current.x == curr_size.x - 1 || current.y == curr_size.y - 1:
				touches_edge = true
			for offset: Vector2i in CARDINAL_OFFSETS:
				var neighbor: Vector2i = current + offset
				if _is_within_bounds(neighbor, curr_size) && water_mask.has(neighbor) && !visited.has(neighbor):
					queue.append(neighbor)

		for cell in component:
			if touches_edge:
				ocean_cells[cell] = true
			else:
				lake_cells[cell] = true

	var coastline_groups := {
		"sea_island": [],
		"lake_island": []
	}

	for coord: Vector2i in land_mask.keys():
		var adjacent_ocean := false
		var adjacent_lake := false
		for offset: Vector2i in CARDINAL_OFFSETS:
			var neighbor: Vector2i = coord + offset
			if !water_mask.has(neighbor):
				continue
			if lake_cells.has(neighbor):
				adjacent_lake = true
			else:
				adjacent_ocean = true
		if adjacent_lake || adjacent_ocean:
			if adjacent_lake && !adjacent_ocean:
				coastline_groups["lake_island"].append(coord)
			else:
				coastline_groups["sea_island"].append(coord)

	_landmass_masks = {
		"paths": [],
		"land_mask": land_mask,
		"water_mask": water_mask,
		"coastline": coastline_groups,
		"lakes": {"freshwater": lake_cells.keys()}
	}

func _generate_settlements(curr_size: Vector2i) -> void:
	var settings: Dictionary = {}
	var game_session := get_node_or_null("/root/GameSession") as GameSession
	if game_session:
		settings = game_session.get_world_settings()
	var settlement_ratios: Dictionary = settings.get("settlement_ratios", {}) as Dictionary
	if settlement_ratios.is_empty():
		settlement_ratios = {"humans": 0.5, "dwarves": 0.5, "wood_elves": 0.5, "lizardmen": 0.5}

	var candidates: Array = []
	for y in curr_size.y:
		for x in curr_size.x:
			var c := Vector2i(x, y)
			if _biome_map.get(c, "") == "water":
				continue
			candidates.append({"coord": c, "biome": _biome_map.get(c, "grass")})

	for faction_key: String in DWARFHOLD_LOGIC.SETTLEMENT_TYPES.keys():
		var ratio := float(settlement_ratios.get(faction_key, 0.5))
		var target_count := int(roundi(1 + ratio * 4))
		var faction_type: String = DWARFHOLD_LOGIC.SETTLEMENT_TYPES[faction_key]
		for _i in range(target_count):
			var coord := DWARFHOLD_LOGIC.choose_tile_for_capital(faction_type, candidates, _rng)
			if coord.x < 0:
				continue
			if settlement_map.has(coord):
				continue
			settlement_map[coord] = {"faction": faction_key, "type": faction_type}
			_debug_colorize_settlement(coord, faction_key)

func _debug_colorize_settlement(coord: Vector2i, faction_key: String) -> void:
	if !_curr_image:
		return
	var color := Color.WHITE
	match faction_key:
		"humans":
			color = Color(0.96, 0.91, 0.52)
		"dwarves":
			color = Color(0.95, 0.59, 0.22)
		"wood_elves":
			color = Color(0.35, 0.9, 0.45)
		"lizardmen":
			color = Color(0.25, 0.82, 0.73)
	_curr_image.set_pixel(coord.x, coord.y, color)

func paint() -> void:
	if !_noise:
		recreate_noise.emit()
		return

	_curr_image = _noise.duplicate()
	if tile_map_size != size:
		_curr_image.resize(tile_map_size.x, tile_map_size.y, Image.INTERPOLATE_NEAREST)

	_orig_resized = _curr_image.duplicate()

	generate_gridmap(_curr_image)
	if debug_sprite:
		debug_sprite.texture = ImageTexture.create_from_image(_curr_image)
	recreate_tilemap.emit()
