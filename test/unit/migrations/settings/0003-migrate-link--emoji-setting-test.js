import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0003-migrate-link--emoji-setting";

module(
  "Banner Featured Links | Unit | Migrations | Settings | 0003-migrate-link--emoji-setting",
  function () {
    test("migrate", function (assert) {
      const settings = {
        links: [
          {
            emoji: "smile",
          },
        ],
      };

      const newSettings = {
        links: [
          {
            icon: "smile",
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

    test("does nothing when links is absent", function (assert) {
      const settings = new Map(Object.entries({ other_setting: "value" }));
      const result = migrate(settings);

      assert.deepEqual(Object.fromEntries(result.entries()), {
        other_setting: "value",
      });
    });

    test("does nothing when link has no emoji key", function (assert) {
      const settings = new Map(
        Object.entries({
          links: [
            {
              icon: "gear",
              text: "Hello",
            },
          ],
        })
      );
      const result = migrate(settings);

      assert.deepEqual(Object.fromEntries(result.entries()), {
        links: [
          {
            icon: "gear",
            text: "Hello",
          },
        ],
      });
    });
  }
);
