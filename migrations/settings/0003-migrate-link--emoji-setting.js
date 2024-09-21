const migrateSetting = (settings, oldKey, newKey, transform = (v) => v) => {
  if (settings.has(oldKey)) {
    settings.set(newKey, transform(settings.get(oldKey)));
    settings.delete(oldKey);
  }
  return settings;
};

export default function migrate(settings) {
  const links = settings.get("links");

  if (links) {
    settings.set(
      "links",
      links.map((link) => {
        return Object.fromEntries(
          migrateSetting(
            new Map(Object.entries(link)),
            "emoji",
            "icon"
          ).entries()
        );
      })
    );
  }

  return settings;
}
