import { visit } from "@ember/test-helpers";
import { test } from "qunit";

import { acceptance } from "discourse/tests/helpers/qunit-helpers";

const linksFixtures = [
  {
    emoji: "📣",
    text: "Announcement",
    url: "https://meta.discourse.org/c/announcements/67",
    target: "_blank",
  },
  {
    emoji: "📚",
    text: "Documentation",
    url: "https://meta.discourse.org/c/documentation/10",
    target: "_blank",
  },
  {
    emoji: "🛠️",
    text: "Support",
    url: "https://meta.discourse.org/c/support/6",
    target: "_blank",
  },
  {
    emoji: "🎨",
    text: "Customize",
    url: "https://meta.discourse.org/t/beginners-guide-to-developing-discourse-themes/93648",
    target: "_blank",
  },
];

acceptance("Banned Featured Links", function (needs) {
  needs.settings({
    links: linksFixtures,
    plugin_outlet: "above-site-header",
  });

  test("it renders the banner", async function (assert) {
    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("The banner is present");
  });

  test("it renders the banner with the correct links", async function (assert) {
    await visit("/");

    assert
      .dom(".banner-featured-links__link")
      .exists({ count: 4 }, "The banner has 3 links");

    assert
      .dom(".banner-featured-links__link")
      .hasText("Announcement", "The first link has the correct text");

    assert
      .dom(".banner-featured-links__link")
      .hasAttribute(
        "href",
        "https://meta.discourse.org/c/announcements/67",
        "The first link has the correct URL"
      );

    assert
      .dom(".banner-featured-links__link")
      .hasAttribute(
        "target",
        "_blank",
        "The first link has the correct target"
      );
  });

  test("it renders the banner on the right route", async function (assert) {
    settings.show_on = "homepage";
    await visit("/");
    assert
      .dom(".banner-featured-links__wrapper")
      .exists("homepage / The banner is present");

    await visit("/t/internationalization-localization/280");
    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("homepage / topic / The banner is not present");

    settings.show_on = "everywhere";
    await visit("/latest");
    assert
      .dom(".banner-featured-links__wrapper")
      .exists("everywhere / The banner is present");

    settings.show_on = "top-menu";
    await visit("/categories");
    assert
      .dom(".banner-featured-links__wrapper")
      .exists("top-menu / categories / The banner is present");
  });
});
