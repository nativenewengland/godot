extends Control

signal world_options_applied(settings: Dictionary, regenerate_realm: bool)
signal back_requested
signal embark_requested(final_settings: Dictionary)

const MAP_SIZES := ["Mini", "Small", "Medium", "Large", "Extra Large"]
const WORLD_LAYOUTS := ["Normal", "Major Continent", "Twin Continents", "Inland Sea", "Archipelago"]
const WORLD_AGES := ["Age of Myth", "Age of Heroes", "Age of Discovery", "Age of Discord", "Age of Ember"]

const TERRAIN_SLIDERS := ["forest", "mountain", "river"]

const SETTLEMENT_SLIDERS := {
	"humans": {
		"slider": NodePath("%HumansSettlementSlider"),
		"label": NodePath("%HumansSettlementValue")
	},
	"dwarves": {
		"slider": NodePath("%DwarvesSettlementSlider"),
		"label": NodePath("%DwarvesSettlementValue")
	},
	"wood_elves": {
		"slider": NodePath("%WoodElvesSettlementSlider"),
		"label": NodePath("%WoodElvesSettlementValue")
	},
	"lizardmen": {
		"slider": NodePath("%LizardmenSettlementSlider"),
		"label": NodePath("%LizardmenSettlementValue")
	}
}

var _syncing := false

@onready var map_size_options: OptionButton = %MapSizeOptions
@onready var world_layout_options: OptionButton = %WorldLayoutOptions
@onready var world_seed_options: LineEdit = %WorldSeedOptions
@onready var apply_options_button: Button = %ApplyOptionsButton
@onready var regenerate_realm_checkbox: CheckButton = %RegenerateRealmCheck

@onready var map_size_info: OptionButton = %MapSizeInfo
@onready var world_layout_info: OptionButton = %WorldLayoutInfo
@onready var world_seed_info: LineEdit = %WorldSeedInfo
@onready var year_input: SpinBox = %YearInput
@onready var age_select: OptionButton = %AgeSelect
@onready var randomise_chronology_button: Button = %RandomiseChronologyButton
@onready var world_name_input: LineEdit = %WorldNameInput
@onready var randomise_world_name_button: Button = %RandomiseWorldNameButton
@onready var embark_button: Button = %EmbarkButton
@onready var back_button: Button = %BackButton

@onready var summary_map_size: Label = %SummaryMapSize
@onready var summary_layout: Label = %SummaryLayout
@onready var summary_seed: Label = %SummarySeed
@onready var summary_chronology: Label = %SummaryChronology
@onready var summary_world_name: Label = %SummaryWorldName

var _slider_lookup := {
	"forest": {
		"slider": NodePath("%ForestFrequencySlider"),
		"label": NodePath("%ForestFrequencyValue")
	},
	"mountain": {
		"slider": NodePath("%MountainFrequencySlider"),
		"label": NodePath("%MountainFrequencyValue")
	},
	"river": {
		"slider": NodePath("%RiverFrequencySlider"),
		"label": NodePath("%RiverFrequencyValue")
	}
}

func _ready() -> void:
	randomize()
	_populate_option_buttons()
	_bind_slider_feedback()
	_bind_field_sync()
	year_input.value = 250
	age_select.select(2)
	if world_seed_options.text.is_empty():
		world_seed_options.text = _generate_seed()
	if world_name_input.text.is_empty():
		world_name_input.text = _generate_world_name()
	_sync_option_values_to_info()
	_refresh_summary()

	apply_options_button.pressed.connect(_on_apply_options_pressed)
	randomise_chronology_button.pressed.connect(_on_randomise_chronology_pressed)
	randomise_world_name_button.pressed.connect(_on_randomise_world_name_pressed)
	embark_button.pressed.connect(_on_embark_pressed)
	back_button.pressed.connect(func() -> void: back_requested.emit())

func _populate_option_buttons() -> void:
	for map_size in MAP_SIZES:
		map_size_options.add_item(map_size)
		map_size_info.add_item(map_size)

	for layout in WORLD_LAYOUTS:
		world_layout_options.add_item(layout)
		world_layout_info.add_item(layout)

	for age in WORLD_AGES:
		age_select.add_item(age)

	map_size_options.select(2)
	map_size_info.select(2)
	world_layout_options.select(0)
	world_layout_info.select(0)

func _bind_slider_feedback() -> void:
	for terrain in TERRAIN_SLIDERS:
		var slider: HSlider = get_node(_slider_lookup[terrain]["slider"])
		var label: Label = get_node(_slider_lookup[terrain]["label"])
		slider.value_changed.connect(func(value: float) -> void:
			var sanitized := int(clampf(roundf(value), 0.0, 100.0))
			slider.value = sanitized
			label.text = "%d%%" % sanitized
		)
		slider.value = 50

	for civilization in SETTLEMENT_SLIDERS.keys():
		var slider: HSlider = get_node(SETTLEMENT_SLIDERS[civilization]["slider"])
		var label: Label = get_node(SETTLEMENT_SLIDERS[civilization]["label"])
		slider.value_changed.connect(func(value: float) -> void:
			var sanitized := int(clampf(roundf(value), 0.0, 100.0))
			slider.value = sanitized
			label.text = "%d%%" % sanitized
		)
		slider.value = 50

func _bind_field_sync() -> void:
	map_size_options.item_selected.connect(func(index: int) -> void:
		if _syncing:
			return
		_syncing = true
		map_size_info.select(index)
		_syncing = false
		_refresh_summary()
	)
	map_size_info.item_selected.connect(func(index: int) -> void:
		if _syncing:
			return
		_syncing = true
		map_size_options.select(index)
		_syncing = false
		_refresh_summary()
	)
	world_layout_options.item_selected.connect(func(index: int) -> void:
		if _syncing:
			return
		_syncing = true
		world_layout_info.select(index)
		_syncing = false
		_refresh_summary()
	)
	world_layout_info.item_selected.connect(func(index: int) -> void:
		if _syncing:
			return
		_syncing = true
		world_layout_options.select(index)
		_syncing = false
		_refresh_summary()
	)
	world_seed_options.text_changed.connect(func(new_text: String) -> void:
		if _syncing:
			return
		_syncing = true
		world_seed_info.text = new_text.strip_edges()
		_syncing = false
		_refresh_summary()
	)
	world_seed_info.text_changed.connect(func(new_text: String) -> void:
		if _syncing:
			return
		_syncing = true
		world_seed_options.text = new_text.strip_edges()
		_syncing = false
		_refresh_summary()
	)
	year_input.value_changed.connect(func(_value: float) -> void: _refresh_summary())
	age_select.item_selected.connect(func(_index: int) -> void: _refresh_summary())
	world_name_input.text_changed.connect(func(_value: String) -> void: _refresh_summary())

func _sync_option_values_to_info() -> void:
	_syncing = true
	map_size_info.select(map_size_options.selected)
	world_layout_info.select(world_layout_options.selected)
	world_seed_info.text = world_seed_options.text.strip_edges()
	_syncing = false

func _on_apply_options_pressed() -> void:
	if world_seed_options.text.strip_edges().is_empty():
		world_seed_options.text = _generate_seed()
	_sync_option_values_to_info()
	_refresh_summary()
	world_options_applied.emit(_build_settings_payload(), regenerate_realm_checkbox.button_pressed)

func _on_randomise_chronology_pressed() -> void:
	year_input.value = randi_range(50, 1250)
	age_select.select(randi_range(0, WORLD_AGES.size() - 1))
	_refresh_summary()

func _on_randomise_world_name_pressed() -> void:
	world_name_input.text = _generate_world_name()
	_refresh_summary()

func _on_embark_pressed() -> void:
	_sync_option_values_to_info()
	if world_seed_info.text.strip_edges().is_empty():
		world_seed_info.text = _generate_seed()
		world_seed_options.text = world_seed_info.text
	if world_name_input.text.strip_edges().is_empty():
		world_name_input.text = _generate_world_name()
	_refresh_summary()
	embark_requested.emit(_build_settings_payload())

func _build_settings_payload() -> Dictionary:
	var settings := {
		"map_size": map_size_info.get_item_text(map_size_info.selected),
		"world_layout": world_layout_info.get_item_text(world_layout_info.selected),
		"world_seed": world_seed_info.text.strip_edges(),
		"world_name": world_name_input.text.strip_edges(),
		"chronology": {
			"year": int(year_input.value),
			"age": age_select.get_item_text(age_select.selected)
		},
		"terrain": {},
		"settlements": {}
	}

	for terrain in TERRAIN_SLIDERS:
		var slider: HSlider = get_node(_slider_lookup[terrain]["slider"])
		settings["terrain"][terrain] = int(slider.value)

	for civilization in SETTLEMENT_SLIDERS.keys():
		var slider: HSlider = get_node(SETTLEMENT_SLIDERS[civilization]["slider"])
		settings["settlements"][civilization] = int(slider.value)

	return settings

func _refresh_summary() -> void:
	summary_map_size.text = map_size_info.get_item_text(map_size_info.selected)
	summary_layout.text = world_layout_info.get_item_text(world_layout_info.selected)
	summary_seed.text = world_seed_info.text.strip_edges()
	summary_world_name.text = world_name_input.text.strip_edges()
	summary_chronology.text = "Year %d · %s" % [int(year_input.value), age_select.get_item_text(age_select.selected)]

func _generate_seed() -> String:
	return str(randi())

func _generate_world_name() -> String:
	var prefixes := ["Stone", "Ember", "Mist", "Verdant", "Iron", "Silver", "Dawn", "Night", "Storm", "Sun"]
	var suffixes := ["reach", "vale", "hollow", "keep", "wilds", "march", "coast", "ridge", "realm", "expanse"]
	return "%s%s" % [prefixes.pick_random(), suffixes.pick_random()]
