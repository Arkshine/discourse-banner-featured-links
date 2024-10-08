const migrateSetting = (settings, oldKey, newKey, transform = (v) => v) => {
  if (settings.has(oldKey)) {
    settings.set(newKey, transform(settings.get(oldKey)));
    settings.delete(oldKey);
  }
  return settings;
};

export default function migrate(settings) {
  migrateSetting(settings, "buttons_font_size", "buttons_font");
  migrateSetting(settings, "mobile_buttons_font_size", "mobile_buttons_font");
  migrateSetting(
    settings,
    "button_shadow_color",
    "button_shadow",
    (value) => `inset 0 0 0 2px ${value}`
  );

  const links = settings.get("links");
  if (links) {
    settings.set(
      "links",
      links.map((link) => {
        return Object.fromEntries(
          migrateSetting(
            new Map(Object.entries(link)),
            "button_shadow_color",
            "button_shadow",
            (value) => `inset 0 0 0 2px ${value}`
          ).entries()
        );
      })
    );
  }

  return settings;
}
