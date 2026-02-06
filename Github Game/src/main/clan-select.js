export function populateClanSelectFromOptions(options) {
  try {
    const select = document.getElementById('dwarf-clan-select');
    if (!select || !Array.isArray(options)) return;

    const previous = select.value || null;
    while (select.firstChild) select.removeChild(select.firstChild);

    options.forEach((opt) => {
      if (!opt || typeof opt.value !== 'string' || typeof opt.label !== 'string') return;
      const optionElement = document.createElement('option');
      optionElement.value = opt.value;
      optionElement.textContent = opt.label;
      if (opt.description && typeof opt.description === 'string') {
        optionElement.title = opt.description;
      }
      select.appendChild(optionElement);
    });

    if (previous && options.some((opt) => opt && opt.value === previous)) {
      select.value = previous;
    } else if (options.length > 0) {
      select.value = options[0].value;
    }
  } catch (_err) {
    // ignore DOM errors
  }
}

