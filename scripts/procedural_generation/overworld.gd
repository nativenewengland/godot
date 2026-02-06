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
const LAND_COLOR := Color(0.49, 0.753, 0.404, 1.0)


const MAX_RIVER_DISTANCE := 100

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

var _noise: Image
var _orig_resized: Image
var _rng: RandomNumberGenerator
var _curr_image: Image

func _ready() -> void:
	super ()
	recreate_noise.connect(rebuild)
	recreate_paint.connect(paint)
	Seeder.instance.seed_changed.connect(rebuild)

func rebuild() -> void:
	noise.fractal_gain = fractal_detail
	noise.fractal_lacunarity = fractal_size

	_noise = generate_noise()
	_noise.convert(Image.FORMAT_RGBA8)

	recreate_paint.emit()

func curr_river(from: Vector2i, to: Vector2i) -> Array[Vector2i]:
	var curr_line := line_coords(from, to)
	if curr_line.pop_back() != water_coords:
		return []

	for line_coord in curr_line:
		if grid_map[line_coord] == water_coords:
			return []

	return curr_line

func generate_river(start: Vector2i) -> void:
	var half_river := roundi(river_max_distance)
	var curr_size := _orig_resized.get_size()
	var squared_river_size := river_max_distance * river_max_distance

	var possible_rivers: Array[Array]

	for y in curr_size.y:
		if y > river_max_distance:
			break

		for x in curr_size.x:
			if x > river_max_distance:
				break

			var curr_coord := start + Vector2i(x, y) - Vector2i(half_river, half_river)

			if !grid_map.has(curr_coord):
				continue

			if start.distance_squared_to(curr_coord) > squared_river_size:
				continue

			var line := curr_river(start, curr_coord)
			if line == []:
				continue

			possible_rivers.append(line)

	if !possible_rivers.size():
		return

	var chosen := _rng.randi_range(0, possible_rivers.size())
	var river: Array[Vector2i] = possible_rivers[chosen]

	for coord in river:
		var curr_coord := start + coord
		grid_map[curr_coord] = water_coords
		_curr_image.set_pixel(curr_coord.x, curr_coord.y, WATER_COLOR)


func generate_gridmap(to_paint: Image) -> void:
	var curr_seed := Seeder.instance.current_seed
	var curr_size := to_paint.get_size()
	_rng = RandomNumberGenerator.new()
	_rng.seed = curr_seed

	for y in curr_size.y:
		for x in curr_size.x:
			var curr_vec := Vector2i(x, y)
			var curr_pixel := _orig_resized.get_pixel(x, y)

			if curr_pixel.v < water_ocurrence:
				grid_map[curr_vec] = water_coords
				to_paint.set_pixel(x, y, WATER_COLOR)

			elif curr_pixel.v < mountain_ocurrence:
				grid_map[curr_vec] = grass_coords
				to_paint.set_pixel(x, y, LAND_COLOR)

			else:
				grid_map[curr_vec] = mountain_coords


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
