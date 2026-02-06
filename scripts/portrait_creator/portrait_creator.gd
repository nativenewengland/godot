@tool
class_name PortraitCreator
extends Control

signal resend_images

## This needs to match with the indexes in the file
## portrait_indexes.gdshaderinc with identifier uid://wfjoy5r4lanh
enum Images {
	PORTRAIT,
	BEARD,
	HAIR
}
const AMOUNT_OF_IMAGES := 3

static var instance: PortraitCreator

@export var target_render: Control
@export var part_picker: PackedScene

@export_group(&"Directories")
@export var character_name: LineEdit
@export var clan_name: OptionButton

const CLAN_OPTIONS := [
	"Stonebeard",
	"Barrelbrow",
	"Oathhammer",
	"Stormshield",
	"Granitebrow",
	"Emberstone",
	"Blackdelve",
	"Hearthhammer",
	"Mithrilbeard",
	"Shieldbreaker",
	"Deepcrag",
	"Duskhollow",
	"Hammerdeep",
	"Deepmantle",
	"Ashmantle",
	"Shadowhearth",
	"Angrund",
	"Angrulok",
	"Badrikk",
	"Barruk",
	"Burrdrik",
	"Bronzebeards",
	"Bronzefist",
	"Copperback",
	"Cragbrow",
	"Craghand",
	"Cragtooth",
	"Donarkhun",
	"Dourback",
	"Dragonback",
	"Drakebeard",
	"Drazhkarak",
	"Dunrakin",
	"Firehand",
	"Firehelm",
	"Flintbeard",
	"Flinthand",
	"Flintheart",
	"Fooger",
	"Forgehand",
	"Grimhelm",
	"Grimstone",
	"Gunnarsson",
	"Gunnisson",
	"Guttrik",
	"Halgakrin",
	"Hammerback",
	"Helhein",
	"Irebeard",
	"Ironbeard",
	"Ironarm",
	"Ironback",
	"Ironfist",
	"Ironforge",
	"Ironhammer",
	"Ironpick",
	"Ironspike",
	"Izorgrung",
	"Kaznagar",
	"Magrest",
	"Norgrimlings",
	"Oakbarrel",
	"Redbeard",
	"Silverscar",
	"Skorrun",
	"Steelcrag",
	"Sternbeard",
	"Stoneback",
	"Stonebeater",
	"Stonebreakers",
	"Stonehammer",
	"Stonehand",
	"Stoneheart",
	"Stoutgirth",
	"Stoutpeak",
	"Svengeln",
	"Threkkson",
	"Thundergun",
	"Thunderheart",
	"Thunderstone",
	"Varnskan",
	"Vorgrund",
	"Yinlinsson",
	"Coppervein",
	"Graniteheart",
	"Deepdelver",
	"Amberpick",
	"Oakenshield",
	"Frosthammer",
	"Berylbraid",
	"Silverhollow",
	"Brazenaxe",
	"Stormhammer",
	"Deeprock",
	"Goldvein",
	"Runesmith",
	"Aleswiller",
	"Argent Hand",
	"Axebreaker",
	"Blackfire",
	"Bloodstone",
	"Boulderscorch",
	"Duergar",
	"Fiania",
	"Goldenforge",
	"Gordemuncher",
	"Hammerhead",
	"Ironson",
	"Kazak Uruk",
	"Orcsplitter",
	"Rockcrawler",
	"Shattered Stone",
	"Bronzebeard",
	"Stormpike",
	"Stonefist",
	"Hylar",
	"Daergar",
	"Daewar",
	"Theiwar",
	"Aghar",
	"Battlehammer",
	"Bitterroot",
	"Black Axe",
	"Boldenbar",
	"Bouldershoulder",
	"Brawnanvil",
	"Brightblade",
	"Brighthelm",
	"Broodhull",
	"Bruenghor",
	"Bukbukken",
	"Chistlesmith",
	"Eaglecleft",
	"Flameshade",
	"Muzgardt",
	"Stoneshaft",
	"Ticklebeard",
	"Dankil",
	"Daraz",
	"Forgebar",
	"Gemcrypt",
	"Girdaur",
	"Hammerhand",
	"Hardhammer",
	"Herlinga",
	"Hillborn",
	"Hillsafar",
	"Horn",
	"Icehammer",
	"Ironeater",
	"Ironstar",
	"Licehair",
	"Ludwakazar",
	"Madbeards",
	"McKnuckles",
	"McRuff",
	"Melairkyn",
	"Orcsmasher",
	"Orothiar",
	"Pwent",
	"Rockjaw",
	"Rookoath",
	"Rustfire",
	"Sandbeards",
	"Shattershield",
	"Stonebridge",
	"Stoneshoulder",
	"Stouthammer",
	"Sunblight",
	"Undurr",
	"Grimlock",
	"MacCloud",
	"Thundermore",
	"Enogtorad",
	"Drummond",
	"Tolorr",
	"Vanderholl",
	"Aringeld",
	"Firecask",
	"Gelderon",
	"Grimmark",
	"Molgrade",
	"Runebinder",
	"Orridus",
	"Shalefoot",
	"Silverhair",
	"Copperlung",
	"Stonescar",
	"Flintbristle",
	"Stonehollow",
	"Silverpick",
	"Ironheart",
	"Weoughld",
	"Llyrnillach",
	"Highhelm"
]

@export_group(&"Directories")
@export_dir var portrait_dir: String
@export_dir var beard_dir: String
@export_dir var hair_dir: String

@export_group(&"Sliders")
@export var skin_color: HSlider
@export var hair_color: HSlider
@export var beard_color: HSlider

@export_group(&"Default images")
@export var portrait: CompressedTexture2D:
	set(value):
		portrait = value
		resend_images.emit()

@export var beard: CompressedTexture2D:
	set(value):
		beard = value
		resend_images.emit()

@export var hair: CompressedTexture2D:
	set(value):
		hair = value
		resend_images.emit()

var _images: Array[CompressedTexture2D]
var _colors: Array[Vector3]

var _selected := Images.PORTRAIT

var _available_beards: Array[CompressedTexture2D]

func _enter_tree() -> void:
	instance = self

func _ready() -> void:
	skin_color.value_changed.connect(_on_color_changed.bind(Images.PORTRAIT))
	hair_color.value_changed.connect(_on_color_changed.bind(Images.HAIR))
	beard_color.value_changed.connect(_on_color_changed.bind(Images.BEARD))

	character_name.text_changed.connect(_on_name_changed)

	clan_name.clear()
	for clan: String in CLAN_OPTIONS:
		clan_name.add_item(clan)

	resend_images.connect(_on_resend_images)

	_images.resize(3)
	_colors.resize(3)

func _on_name_changed(_new_text: String) -> void:
	for curr_idx in AMOUNT_OF_IMAGES:
		_colors[curr_idx].z = 1

	var dir := DirAccess.open(beard_dir)
	for curr_file in dir.get_files():
		if !curr_file.ends_with(".png"): return
		_available_beards.append(load(beard_dir + curr_file))

func _on_resend_images() -> void:
	_images[Images.PORTRAIT] = portrait
	_images[Images.BEARD] = beard
	_images[Images.HAIR] = hair

	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"images", _images)

func _on_color_changed(value: float, type: Images) -> void:
	_colors[type].x = value
	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"colors", _colors)

func swap_color(type: Images) -> void:
	_selected = type
	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"colors", _colors)

func _on_gamma_changed(value: float) -> void:
	_colors[_selected].z = value
	var shader: ShaderMaterial = target_render.material
	shader.set_shader_parameter(&"colors", _colors)

func _on_return_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/mainmenu.tscn")

func _on_create_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/overworld_root.tscn")
