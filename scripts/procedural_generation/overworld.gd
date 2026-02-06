@tool
class_name Overworld
extends ProceduralGeneration

@export_group(&"Tiles")
@export var sand_coords := Vector2i(4, 1)
@export var grass_coords := Vector2i(1, 0)
@export var badlands_coords := Vector2i(2, 1)
@export var marsh_coords := Vector2i(2, 4)
@export var snow_coords := Vector2i(3, 2)
@export var water_coords := Vector2i(0, 0)
@export var mountain_coords := Vector2i(3, 0)

const WATER_COLOR := Color(0.168, 0.395, 0.976, 1.0)
const SHALLOW_WATER_COLOR := Color(0.274, 0.544, 0.972, 1.0)
const SAND_COLOR := Color(0.905, 0.823, 0.545, 1.0)
const LAND_COLOR := Color(0.49, 0.753, 0.404, 1.0)
const BADLANDS_COLOR := Color(0.729, 0.486, 0.309, 1.0)
const MARSH_COLOR := Color(0.482, 0.602, 0.337, 1.0)
const SNOW_COLOR := Color(0.91, 0.934, 0.968, 1.0)
const MOUNTAIN_COLOR := Color(0.447, 0.443, 0.427, 1.0)

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

func _ready() -> void:
	super ()
	_setup_secondary_noise()
	recreate_noise.connect(rebuild)
	recreate_paint.connect(paint)
	Seeder.instance.seed_changed.connect(rebuild)

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
	var base := _to_normalized(_height_noise.get_noise_2dv(Vector2(coord)))
	var ridges := 1.0 - absf(_height_noise.get_noise_2dv(Vector2(coord) * 1.9))
	var tectonic_uplift := lerpf(base, maxf(base, ridges), mountain_linearity)
	return tectonic_uplift - pow(radial_falloff, 2.2) * 0.35

func _get_temperature(coord: Vector2i, curr_size: Vector2i, elevation: float) -> float:
	var latitude := absf((float(coord.y) / maxf(1.0, float(curr_size.y - 1))) * 2.0 - 1.0)
	var latitudinal_cold := pow(latitude, 1.4)
	var variation := _to_normalized(_temperature_noise.get_noise_2dv(Vector2(coord)))
	return clampf((variation * 0.55 + (1.0 - latitudinal_cold) * 0.45) - maxf(0.0, elevation - mountain_ocurrence) * 0.8, 0.0, 1.0)

func _get_rainfall(coord: Vector2i, elevation: float) -> float:
	var humidity := _to_normalized(_rainfall_noise.get_noise_2dv(Vector2(coord)))
	return clampf(humidity + maxf(0.0, mountain_ocurrence - elevation) * 0.2, 0.0, 1.0)

func _find_next_river_step(from: Vector2i, curr_size: Vector2i, seen: Dictionary[Vector2i, bool]) -> Vector2i:
	var lowest := from
	var lowest_elevation := _get_elevation(from, curr_size)

	for offset in NEIGHBOR_OFFSETS:
		var next_coord := from + offset
		if !_is_within_bounds(next_coord, curr_size):
			continue
		if seen.has(next_coord):
			continue

		var next_elevation := _get_elevation(next_coord, curr_size)
		if next_elevation < lowest_elevation:
			lowest = next_coord
			lowest_elevation = next_elevation

	return lowest

func _generate_rivers(curr_size: Vector2i) -> void:
	var candidates: Array[Vector2i] = []

	for y in curr_size.y:
		for x in curr_size.x:
			var coord := Vector2i(x, y)
			if grid_map.get(coord) == mountain_coords:
				candidates.append(coord)

	if candidates.is_empty() || river_sources <= 0:
		return

	for _i in range(min(candidates.size(), river_sources)):
		var source_index := _rng.randi_range(0, candidates.size() - 1)
		var source_coord := candidates[source_index]
		var curr_coord := source_coord
		var seen: Dictionary[Vector2i, bool] = {}

		for _step in range(river_max_steps):
			if grid_map.get(curr_coord) == water_coords:
				break

			seen[curr_coord] = true
			grid_map[curr_coord] = water_coords
			_curr_image.set_pixel(curr_coord.x, curr_coord.y, SHALLOW_WATER_COLOR)

			var next_coord := _find_next_river_step(curr_coord, curr_size, seen)
			if next_coord == curr_coord:
				break

			if source_coord.distance_to(next_coord) > river_max_distance:
				break

			curr_coord = next_coord

func generate_gridmap(to_paint: Image) -> void:
	var curr_seed := Seeder.instance.current_seed
	var curr_size := to_paint.get_size()
	_rng = RandomNumberGenerator.new()
	_rng.seed = curr_seed

	for y in curr_size.y:
		for x in curr_size.x:
			var curr_vec := Vector2i(x, y)
			var elevation := _get_elevation(curr_vec, curr_size)
			var temperature := _get_temperature(curr_vec, curr_size, elevation)
			var rainfall := _get_rainfall(curr_vec, elevation)

			if elevation < water_ocurrence:
				grid_map[curr_vec] = water_coords
				to_paint.set_pixel(x, y, WATER_COLOR)
			elif elevation < water_ocurrence + coast_width:
				grid_map[curr_vec] = sand_coords
				to_paint.set_pixel(x, y, SAND_COLOR)
			elif elevation > mountain_ocurrence:
				grid_map[curr_vec] = mountain_coords
				to_paint.set_pixel(x, y, MOUNTAIN_COLOR)
			elif temperature < snow_line:
				grid_map[curr_vec] = snow_coords
				to_paint.set_pixel(x, y, SNOW_COLOR)
			elif rainfall < arid_threshold && temperature > 0.5:
				grid_map[curr_vec] = badlands_coords
				to_paint.set_pixel(x, y, BADLANDS_COLOR)
			elif rainfall > marsh_threshold && elevation < mountain_ocurrence * 0.8:
				grid_map[curr_vec] = marsh_coords
				to_paint.set_pixel(x, y, MARSH_COLOR)
			else:
				grid_map[curr_vec] = grass_coords
				to_paint.set_pixel(x, y, LAND_COLOR)

	_generate_rivers(curr_size)


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
