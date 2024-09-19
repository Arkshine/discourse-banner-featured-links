export default function migrate(settings) {
  const oldSetting = settings.get("show_on");

  const mappings = {
    homepage: { homepage: true, url: "" },
    everywhere: { homepage: true, url: "/*" },
    "top-menu": {
      homepage: false,
      url: "/latest|/categories|/new|/unread|/hot",
    },
    top: { homepage: false, url: "/top" },
    latest: { homepage: false, url: "/latest" },
    categories: { homepage: false, url: "/categories" },
  };

  if (typeof oldSetting === "string") {
    if (mappings[oldSetting]) {
      const { homepage, url } = mappings[oldSetting];

      settings.set("display_on_homepage", homepage);
      settings.set("url_must_contain", url);
    } else {
      settings.set("display_on_homepage", true);
      settings.set("url_must_contain", "");
    }

    settings.delete("show_on");
  }

  return settings;
}
