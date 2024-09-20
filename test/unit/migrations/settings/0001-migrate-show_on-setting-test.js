import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0001-migrate-show_on-setting";

module(
  "Banner Featured Links | Unit | Migrations | Settings | 0001-migrate-show_on-setting",
  function () {
    test("migrate when old setting is a blank string", function (assert) {
      const settings = new Map(Object.entries({ show_on: "" }));
      const result = migrate(settings);

      const expectedResult = new Map(
        Object.entries({
          display_on_homepage: true,
          url_must_contain: "",
        })
      );

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(expectedResult.entries())
      );
    });

    test("migrate", function (assert) {
      const settings = [
        { show_on: "homepage" },
        { show_on: "everywhere" },
        { show_on: "top-menu" },
        { show_on: "top" },
        { show_on: "latest" },
        { show_on: "categories" },
      ];

      const newSettings = {
        homepage: { display_on_homepage: true, url_must_contain: "" },
        everywhere: { display_on_homepage: true, url_must_contain: "/*" },
        "top-menu": {
          display_on_homepage: false,
          url_must_contain: "/latest|/categories|/new|/unread|/hot",
        },
        top: { display_on_homepage: false, url_must_contain: "/top" },
        latest: { display_on_homepage: false, url_must_contain: "/latest" },
        categories: {
          display_on_homepage: false,
          url_must_contain: "/categories",
        },
      };

      settings.forEach((setting) => {
        const result = migrate(new Map(Object.entries(setting)));
        const expectedResult = new Map(
          Object.entries(newSettings[setting.show_on])
        );

        assert.deepEqual(
          Object.fromEntries(result.entries()),
          Object.fromEntries(expectedResult.entries())
        );
      });
    });
  }
);
