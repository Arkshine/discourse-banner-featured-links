import { apiInitializer } from "discourse/lib/api";
import BannerFeaturedLinks from "../components/banner-featured-links";

export default apiInitializer((api) => {
  api.renderInOutlet(settings.plugin_outlet, BannerFeaturedLinks);
});
