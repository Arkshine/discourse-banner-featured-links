import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat } from "@ember/helper";
import { service } from "@ember/service";
import concatClass from "discourse/helpers/concat-class";
import htmlSafe from "discourse/helpers/html-safe";
import replaceEmoji from "discourse/helpers/replace-emoji";
import { iconHTML } from "discourse/lib/icon-library";
import { defaultHomepage } from "discourse/lib/utilities";

export default class BannerFeaturedLinks extends Component {
  @service currentUser;
  @service router;
  @service siteSettings;
  @service site;

  @tracked featuredLinks = settings.links;

  get showOnRoute() {
    if (
      settings.display_on_homepage &&
      this.router.currentRouteName === `discovery.${defaultHomepage()}`
    ) {
      return true;
    }

    if (settings.url_must_contain.length) {
      const path = this.router.currentURL;
      const allowedPaths = settings.url_must_contain.split("|");

      return allowedPaths.some((allowedPath) => {
        if (allowedPath.slice(-1) === "*") {
          return path.indexOf(allowedPath.slice(0, -1)) === 0;
        }
        return path === allowedPath;
      });
    }

    return false;
  }

  get displayForUser() {
    return (
      (settings.show_for_members && this.currentUser) ||
      (settings.show_for_anon && !this.currentUser)
    );
  }

  get displayOnDevice() {
    return (
      (settings.display_on_desktop && this.site.desktopView) ||
      (settings.display_on_mobile && this.site.mobileView)
    );
  }

  get shoudlDisplay() {
    return this.displayForUser && this.displayOnDevice && this.showOnRoute;
  }

  get links() {
    return this.featuredLinks.map((link) => {
      if (link?.icon?.length) {
        link.iconHtml = /[\w-]+/.test(link.icon)
          ? iconHTML(link.icon)
          : replaceEmoji(link.icon);
      }

      return link;
    });
  }

  <template>
    {{#if this.shoudlDisplay}}
      <aside class="banner-featured-links__wrapper {{settings.plugin_outlet}}">
        <nav class="banner-featured-links__wrapper-links">
          {{#each this.links as |link index|}}
            <a
              class={{concatClass
                "banner-featured-links__link"
                (concat "bfl-link-" index)
                (if link.button_identifier link.button_identifier)
              }}
              href={{link.url}}
              target={{link.target}}
              alt={{htmlSafe link.text}}
            >
              {{#if link.iconHtml}}
                {{htmlSafe link.iconHtml}}
              {{/if}}
              {{htmlSafe link.text}}
            </a>
          {{/each}}
        </nav>
      </aside>
    {{/if}}
  </template>
}
