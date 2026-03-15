import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0002-migrate-others-settings";

module(
  "Banner Featured Links | Unit | Migrations | Settings | 0002-migrate-others-settings",
  function () {
    test("migrate", function (assert) {
      const settings = {
        buttons_font_size: "16px",
        mobile_buttons_font_size: "16px",
        button_shadow_color: "red",
        links: [
          {
            button_shadow_color: "blue",
          },
        ],
      };

      const newSettings = {
        buttons_font: "16px",
        mobile_buttons_font: "16px",
        button_shadow: "inset 0 0 0 2px red",
        links: [
          {
            button_shadow: "inset 0 0 0 2px blue",
          },
        ],
      };

      const result = migrate(new Map(Object.entries(settings)));
      const expectedResult = new Map(Object.entries(newSettings));

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(expectedResult.entries())
      );
    });

    test("does nothing when old keys are absent", function (assert) {
      const settings = new Map(
        Object.entries({
          buttons_font: "14px",
        })
      );
      const result = migrate(settings);

      assert.deepEqual(Object.fromEntries(result.entries()), {
        buttons_font: "14px",
      });
    });

    test("does nothing when links is absent", function (assert) {
      const settings = new Map(
        Object.entries({
          buttons_font_size: "16px",
        })
      );
      const result = migrate(settings);

      assert.deepEqual(Object.fromEntries(result.entries()), {
        buttons_font: "16px",
      });
    });

    test("does nothing when link has no button_shadow_color", function (assert) {
      const settings = new Map(
        Object.entries({
          links: [
            {
              text: "Hello",
            },
          ],
        })
      );
      const result = migrate(settings);

      assert.deepEqual(Object.fromEntries(result.entries()), {
        links: [
          {
            text: "Hello",
          },
        ],
      });
    });
  }
);
