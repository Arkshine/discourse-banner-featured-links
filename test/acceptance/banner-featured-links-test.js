import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";

const linksFixtures = [
  {
    icon: "gear",
    text: "Announcement",
    url: "https://meta.discourse.org/c/announcements/67",
    target: "_blank",
  },
  {
    text: "About",
    url: "https://meta.discourse.org/about",
    target: "_blank",
  },
  {
    icon: "📚",
    text: "Documentation",
    url: "https://meta.discourse.org/c/documentation/10",
    target: "_blank",
  },
  {
    icon: "🛠️",
    text: "Support",
    url: "https://meta.discourse.org/c/support/6",
    target: "_blank",
  },
  {
    icon: "🎨",
    text: "Customize",
    url: "https://meta.discourse.org/t/beginners-guide-to-developing-discourse-themes/93648",
    target: "_blank",
  },
];

acceptance("Banner Featured Links", function () {
  test("it renders the links", async function (assert) {
    settings.links = linksFixtures;
    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("The banner is present");
  });

  test("it renders the banner with the correct links", async function (assert) {
    settings.links = linksFixtures;
    await visit("/");

    assert
      .dom(".banner-featured-links__link")
      .exists({ count: 5 }, "The banner has 5 links");

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
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.url_must_contain = "";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner on the homepage");
  });

  test("it doesn't render the links on the homepage", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = false;
    settings.url_must_contain = "";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("hides the banner on the homepage");
  });

  test("it renders the links on a set route", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = false;
    settings.url_must_contain = "/c/*";

    await visit("/c/1");
    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner on the /c/* route");
  });

  test("it doesn't render the links on other routes", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = false;
    settings.url_must_contain = "/c/*";

    await visit("/u");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("does not show the banner on the /u route");
  });

  test("it renders the links with multiple pipe-separated paths", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = false;
    settings.url_must_contain = "/latest|/c/*";

    await visit("/c/1");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner on /c/* route from pipe-separated paths");
  });

  test("it renders on an exact url_must_contain match", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = false;
    settings.url_must_contain = "/u";

    await visit("/u");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner on exact /u match");
  });

  test("it does not render when links array is empty", async function (assert) {
    settings.links = [];

    await visit("/");

    assert
      .dom(".banner-featured-links__link")
      .doesNotExist("no link elements are rendered");
  });

  test("it applies plugin_outlet as a class on the wrapper", async function (assert) {
    settings.links = linksFixtures;
    settings.plugin_outlet = "above-site-header";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper.above-site-header")
      .exists("the wrapper has the plugin_outlet class");
  });
});

acceptance("Banner Featured Links - Logged out", function () {
  test("links can be hidden from anons", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.show_for_anon = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("hides the banner for anons");
  });

  test("links can be shown to anons", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.show_for_anon = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner for anons");
  });
});

acceptance("Banner Featured Links - Logged in", function (needs) {
  needs.user();

  test("links can be hidden from members", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.show_for_members = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("hides the banner for members");
  });

  test("links can be shown to members", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.show_for_members = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the banner for members");
  });
});

acceptance("Banner Featured Links - Mobile", function (needs) {
  needs.mobileView();

  test("links can be shown on mobile", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.display_on_mobile = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the links on mobile");
  });

  test("links can be hidden on mobile 1", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.display_on_mobile = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on mobile 1");
  });

  test("links can be hidden on mobile 2", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.display_on_mobile = false;
    settings.display_on_desktop = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on mobile 2");
  });
});

acceptance("Banner Featured Links - Desktop", function () {
  test("links can be shown on desktop", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.display_on_mobile = true;
    settings.display_on_desktop = true;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .exists("shows the links on desktop");
  });

  test("links can be hidden on desktop 1", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.display_on_desktop = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on desktop 1");
  });

  test("links can be hidden on desktop 2", async function (assert) {
    settings.links = linksFixtures;
    settings.display_on_homepage = true;
    settings.display_on_mobile = true;
    settings.display_on_desktop = false;

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper")
      .doesNotExist("doesn't show the links on desktop 2");
  });
});

acceptance("Banner Featured Links - Icon", function () {
  test("it renders the SVG icon", async function (assert) {
    settings.links = linksFixtures;
    settings.plugin_outlet = "above-site-header";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper-links > a:first-child > svg")
      .exists("The svg icon is present");
  });

  test("it renders the emoji", async function (assert) {
    settings.links = linksFixtures;
    settings.plugin_outlet = "above-site-header";

    await visit("/");

    assert
      .dom(".banner-featured-links__wrapper-links > a:last-child > img.emoji")
      .exists("The emoji image is present");
  });

  test("it does not render an icon for a link without one", async function (assert) {
    settings.links = linksFixtures;

    await visit("/");

    const secondLink = document.querySelectorAll(
      ".banner-featured-links__link"
    )[1];

    assert.dom("svg", secondLink).doesNotExist("no SVG icon is rendered");
    assert
      .dom("img.emoji", secondLink)
      .doesNotExist("no emoji is rendered");
  });

  test("it applies button_identifier as a CSS class", async function (assert) {
    settings.links = [
      {
        icon: "gear",
        text: "Custom",
        url: "https://example.com",
        target: "_blank",
        button_identifier: "my-custom-link",
      },
    ];

    await visit("/");

    assert
      .dom(".banner-featured-links__link.my-custom-link")
      .exists("the link has the button_identifier class");
  });
});
