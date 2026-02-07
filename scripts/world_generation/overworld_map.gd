extends Node2D

@export var map_size: Vector2i = Vector2i(256, 256)
@export var pixel_scale: int = 4
@export var water_level: float = 0.45
@export var falloff_strength: float = 0.55
@export var falloff_power: float = 2.4
@export var noise_frequency: float = 2.0
@export var noise_octaves: int = 4
@export var seed: int = 0

@onready var map_sprite: Sprite2D = %MapSprite

func _ready() -> void:
	_generate_map()

func _unhandled_input(event: InputEvent) -> void:
	var key_event := event as InputEventKey
	if key_event == null or not key_event.pressed:
		return
	if key_event.keycode == KEY_R:
		_generate_map()

func _generate_map() -> void:
	var rng := RandomNumberGenerator.new()
	if seed == 0:
		rng.randomize()
		seed = rng.randi()
	else:
		rng.seed = seed

	var noise := FastNoiseLite.new()
	noise.seed = seed
	noise.frequency = noise_frequency / float(map_size.x)
	noise.fractal_octaves = noise_octaves
	noise.fractal_lacunarity = 2.1
	noise.fractal_gain = 0.5
	noise.noise_type = FastNoiseLite.TYPE_SIMPLEX

	var image := Image.create(map_size.x, map_size.y, false, Image.FORMAT_RGBA8)
	for y in range(map_size.y):
		for x in range(map_size.x):
			var height := _sample_height(noise, x, y)
			var color := _height_to_color(height)
			image.set_pixel(x, y, color)

	var texture := ImageTexture.create_from_image(image)
	map_sprite.texture = texture
	map_sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	map_sprite.position = Vector2.ZERO
	map_sprite.centered = false
	map_sprite.scale = Vector2(pixel_scale, pixel_scale)

func _sample_height(noise: FastNoiseLite, x: int, y: int) -> float:
	var nx := (float(x) / float(map_size.x)) * 2.0 - 1.0
	var ny := (float(y) / float(map_size.y)) * 2.0 - 1.0
	var distance := Vector2(nx, ny).length()
	var falloff := pow(distance, falloff_power) * falloff_strength
	var noise_value := noise.get_noise_2d(float(x), float(y))
	var height := (noise_value + 1.0) * 0.5
	return clampf(height - falloff, 0.0, 1.0)

func _height_to_color(height: float) -> Color:
	if height < water_level * 0.6:
		return Color8(10, 20, 60)
	if height < water_level:
		return Color8(20, 60, 120)
	if height < water_level + 0.08:
		return Color8(180, 170, 110)
	if height < water_level + 0.25:
		return Color8(50, 110, 60)
	if height < water_level + 0.45:
		return Color8(40, 80, 50)
	if height < water_level + 0.65:
		return Color8(110, 110, 110)
	return Color8(230, 230, 230)
