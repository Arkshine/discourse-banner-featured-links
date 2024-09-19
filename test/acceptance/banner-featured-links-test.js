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

  test("it renders the links", async function (assert) {
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

  test("it renders the links on the homepage", async function (assert) {
    settings.display_on_homepage = true;
    settings.url_must_contain = "";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner on the homepage");
  });

  test("it doesn't render the links on the homepage", async function (assert) {
    settings.display_on_homepage = false;
    settings.url_must_contain = "";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("hides the banner on the homepage");
  });

  test("it renders the links on a set route", async function (assert) {
    settings.display_on_homepage = false;
    settings.url_must_contain = "/c/*";

    await visit("/c/1");
    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner on the /c/* route");
  });

  test("it doesn't render the links on other routes", async function (assert) {
    settings.display_on_homepage = false;
    settings.url_must_contain = "/c/*";

    await visit("/u");

    assert
      .dom(".banner-box")
      .doesNotExist("does not show the banner on the /u route");
  });
});

acceptance("Banned Featured Links - Logged out", function (needs) {
  needs.settings({
    links: linksFixtures,
    plugin_outlet: "above-site-header",
    display_on_homepage: true,
  });

  test("links can be hidden from anons", async function (assert) {
    settings.show_for_anon = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("hides the banner for anons");
  });

  test("links can be shown to anons", async function (assert) {
    settings.show_for_anon = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner for anons");
  });
});

acceptance("Banned Featured Links - Logged in", function (needs) {
  needs.user();
  needs.settings({
    links: linksFixtures,
    plugin_outlet: "above-site-header",
    display_on_homepage: true,
  });

  test("links can be hidden from members", async function (assert) {
    settings.show_for_members = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("hides the banner for members");
  });

  test("links can be shown to members", async function (assert) {
    settings.show_for_members = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner for members");
  });
});

acceptance("Banned Featured Links - Mobile", function (needs) {
  needs.mobileView();
  needs.settings({
    links: linksFixtures,
    plugin_outlet: "above-site-header",
    display_on_homepage: true,
  });

  test("links can be shown on mobile", async function (assert) {
    settings.display_on_mobile = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the links on mobile");
  });

  test("links can be hidden on mobile 1", async function (assert) {
    settings.display_on_mobile = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on mobile 1");
  });

  test("links can be hidden on mobile 2", async function (assert) {
    settings.display_on_mobile = false;
    settings.display_on_desktop = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on mobile 2");
  });
});

acceptance("Banned Featured Links - Desktop", function (needs) {
  needs.settings({
    links: linksFixtures,
    plugin_outlet: "above-site-header",
    display_on_homepage: true,
  });

  test("links can be shown on desktop", async function (assert) {
    settings.display_on_desktop = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the links on desktop");
  });

  test("links can be hidden on desktop 1", async function (assert) {
    settings.display_on_desktop = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on desktop 1");
  });

  test("links can be hidden on desktop 2", async function (assert) {
    settings.display_on_mobile = true;
    settings.display_on_desktop = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on desktop 2");
  });
});
