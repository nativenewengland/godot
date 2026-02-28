extends Control

@onready var message_log: RichTextLabel = $MainMargin/MainLayout/RightColumn/ActionWindow/ActionContent/ActionVBox/MessageLog
@onready var journal_tabs: TabContainer = $MainMargin/MainLayout/LeftColumn/JournalWindow/JournalContent/JournalTabs
@onready var hero_window: PanelContainer = $MainMargin/MainLayout/LeftColumn/HeroWindow
@onready var journal_window: PanelContainer = $MainMargin/MainLayout/LeftColumn/JournalWindow
@onready var inventory_window: PanelContainer = $MainMargin/MainLayout/RightColumn/InventoryWindow
@onready var action_window: PanelContainer = $MainMargin/MainLayout/RightColumn/ActionWindow

func _ready() -> void:
	_apply_pixel_window_theme()
	_set_tab_titles()


func _set_tab_titles() -> void:
	journal_tabs.set_tab_title(0, "Quests")
	journal_tabs.set_tab_title(1, "Lore")


func _apply_pixel_window_theme() -> void:
	var panel_style := StyleBoxFlat.new()
	panel_style.bg_color = Color("1a1f2f")
	panel_style.border_color = Color("6f87a5")
	panel_style.set_border_width_all(3)

	for panel in [hero_window, journal_window, inventory_window, action_window]:
		panel.add_theme_stylebox_override("panel", panel_style)

	var button_normal := StyleBoxFlat.new()
	button_normal.bg_color = Color("273247")
	button_normal.border_color = Color("88a4c9")
	button_normal.set_border_width_all(2)

	var button_pressed := StyleBoxFlat.new()
	button_pressed.bg_color = Color("3a4a67")
	button_pressed.border_color = Color("b0caf0")
	button_pressed.set_border_width_all(2)

	var button_hover := button_normal.duplicate()
	button_hover.bg_color = Color("32415d")

	for button: Button in [
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryGrid/Slot1,
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryGrid/Slot2,
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryGrid/Slot3,
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryGrid/Slot4,
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryGrid/Slot5,
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryGrid/Slot6,
		$MainMargin/MainLayout/RightColumn/ActionWindow/ActionContent/ActionVBox/ActionButtons/SearchButton,
		$MainMargin/MainLayout/RightColumn/ActionWindow/ActionContent/ActionVBox/ActionButtons/WaitButton,
		$MainMargin/MainLayout/RightColumn/ActionWindow/ActionContent/ActionVBox/ActionButtons/ZapButton,
	]:
		button.add_theme_stylebox_override("normal", button_normal)
		button.add_theme_stylebox_override("pressed", button_pressed)
		button.add_theme_stylebox_override("hover", button_hover)
		button.add_theme_color_override("font_color", Color("e9f2ff"))

	for label: Label in [
		$MainMargin/MainLayout/LeftColumn/HeroWindow/HeroContent/HeroVBox/HeroTitle,
		$MainMargin/MainLayout/LeftColumn/HeroWindow/HeroContent/HeroVBox/HeroStats,
		$MainMargin/MainLayout/RightColumn/InventoryWindow/InventoryContent/InventoryVBox/InventoryTitle,
		$MainMargin/MainLayout/RightColumn/ActionWindow/ActionContent/ActionVBox/ActionTitle,
	]:
		label.add_theme_color_override("font_color", Color("f6f8ff"))

	$MainMargin/MainLayout/LeftColumn/JournalWindow/JournalContent/JournalTabs/QuestTab/QuestBody.add_theme_color_override("default_color", Color("d2dcf0"))
	$MainMargin/MainLayout/LeftColumn/JournalWindow/JournalContent/JournalTabs/LoreTab/LoreBody.add_theme_color_override("default_color", Color("d2dcf0"))
	message_log.add_theme_color_override("default_color", Color("cfe0ff"))

	var health_fill := StyleBoxFlat.new()
	health_fill.bg_color = Color("cf5353")
	$MainMargin/MainLayout/LeftColumn/HeroWindow/HeroContent/HeroVBox/HealthBar.add_theme_stylebox_override("fill", health_fill)
	$MainMargin/MainLayout/LeftColumn/HeroWindow/HeroContent/HeroVBox/HealthBar.add_theme_stylebox_override("background", button_normal)

	var shield_fill := StyleBoxFlat.new()
	shield_fill.bg_color = Color("4a87cf")
	$MainMargin/MainLayout/LeftColumn/HeroWindow/HeroContent/HeroVBox/ShieldBar.add_theme_stylebox_override("fill", shield_fill)
	$MainMargin/MainLayout/LeftColumn/HeroWindow/HeroContent/HeroVBox/ShieldBar.add_theme_stylebox_override("background", button_normal)


func _on_search_button_pressed() -> void:
	_append_log("[color=#ffe49a]You search the surrounding area for hidden doors.[/color]")


func _on_wait_button_pressed() -> void:
	_append_log("[color=#b3d6ff]You wait and listen... distant chains rattle in the dark.[/color]")


func _on_zap_button_pressed() -> void:
	_append_log("[color=#cdb7ff]You channel your wand: a violet spark cracks across the room.[/color]")


func _append_log(entry: String) -> void:
	if message_log.text.length() > 0:
		message_log.append_text("\n")
	message_log.append_text(entry)
