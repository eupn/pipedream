import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-order",
  name: "Get Order",
  description: "Get a order. [See the docs here](https://developers.webflow.com/#get-order)",
  version: "0.0.1",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    orderId: {
      propDefinition: [
        webflow,
        "orders",
      ],
    },
  },
  async run() {
    return this.webflow.getOrder({
      siteId: this.siteId,
      orderId: this.orderId,
    });
  },
};
