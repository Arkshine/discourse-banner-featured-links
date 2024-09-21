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
  }
);
