(function () {
  if (typeof document === 'undefined') {
    return;
  }

  function loadScript(src, type, onError) {
    var script = document.createElement('script');
    if (type) {
      script.type = type;
    }
    script.defer = true;
    script.src = src;
    script.addEventListener('error', function () {
      console.error('Failed to load the script for Dwarfhold:', src);
      if (typeof onError === 'function') {
        onError();
      }
    });
    document.head.appendChild(script);
    return script;
  }

  var legacyLoaded = false;
  function loadLegacyBundle() {
    if (legacyLoaded) {
      return;
    }
    legacyLoaded = true;
    loadScript('./bundle.js');
  }

  if (!('noModule' in document.createElement('script'))) {
    loadLegacyBundle();
    return;
  }

  loadScript('./main.js', 'module', loadLegacyBundle);
})();
