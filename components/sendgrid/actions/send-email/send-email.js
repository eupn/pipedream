const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-send-an-email",
  name: "Send an Email",
  description: "Sends an email.",
  version: "0.0.35",
  type: "action",
  props: {
    sendgrid,
    personalizations: {
      type: "string",
      label: "Personalizations",
      description:
        'A JSON-based array of messages and their metadata. Each object within personalizations can be thought of as an envelope - it defines who should receive an individual message and how that message should be handled. See our [Personalizations documentation](https://sendgrid.com/docs/for-developers/sending-email/personalizations/) for details. maxItems: 1000. Example: `[{"to":[{"email":"email@email.com","name":"Example"}],"subject":"Mail Personalization Sample"}]`',
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description:
        "The 'From' email address used to deliver the message. This address should be a verified sender in your Twilio SendGrid account.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "A name or title associated with the sending email address.",
      optional: true,
    },
    replyToEmail: {
      type: "string",
      label: "Reply To Email",
      description:
        "The email address where any replies or bounces will be returned.",
      optional: true,
    },
    replyToName: {
      type: "string",
      label: "Reply To Name",
      description:
        "A name or title associated with the `reply_to` email address.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description:
        "The global or `message level` subject of your email. This may be overridden by subject lines set in personalizations.",
    },
    content: {
      type: "string",
      label: "Content",
      description:
        'A JSON-based array where you can specify the content of your email. You can include multiple  of content, but you must specify at least one [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types). To include more than one MIME type, add another object to the array containing the type and value parameters. Example: `[{"type":"text/plain","value":"Plain text content."}]`',
    },
    attachments: {
      type: "string",
      label: "Attachments",
      description:
        'A JSON-based array of objects where you can specify any attachments you want to include. The fields `content` and `filename` are required. `content` must be base64 encoded. Example: `[{"content":"aGV5","type":"text/plain","filename":"sample.txt"}]`',
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description:
        "An email template ID. A template that contains a subject and content — either text or html — will override any subject and content values specified at the personalizations or message level.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description:
        "An array of objects where you can specify any attachments you want to include.",
      optional: true,
    },
    categories: {
      type: "string",
      label: "Categories",
      description:
        'A JSON-based array of category names for this message. Each category name may not exceed 255 characters. Example: `["category1","category2"]`',
      optional: true,
    },
    customArgs: {
      type: "string",
      label: "Custom Args",
      description:
        "Values that are specific to the entire send that will be carried along with the email and its activity data. Key/value pairs must be strings. Substitutions will not be made on custom arguments, so any string that is entered into this parameter will be assumed to be the custom argument that you would like to be used. This parameter is overridden by `custom_args` set at the personalizations level. Total `custom_args` size may not exceed 10,000 bytes.",
      optional: true,
    },
    sendAt: {
      type: "integer",
      label: "Send At",
      description:
        "A unix timestamp allowing you to specify when you want your email to be delivered. This may be overridden by the `send_at` parameter set at the personalizations level. Delivery cannot be scheduled more than 72 hours in advance. If you have the flexibility, it's better to schedule mail for off-peak times. Most emails are scheduled and sent at the top of the hour or half hour. Scheduling email to avoid peak times — for example, scheduling at 10:53 — can result in lower deferral rates due to the reduced traffic during off-peak times.",
      optional: true,
    },
    batchId: {
      type: "integer",
      label: "Batch Id",
      description:
        "An ID representing a batch of emails to be sent at the same time. Including a batch_id in your request allows you include this email in that batch. It also enables you to cancel or pause the delivery of that batch. For more information, see the [Cancel Scheduled Sends API](https://sendgrid.com/docs/api-reference/).",
      optional: true,
    },
    asm: {
      type: "object",
      label: "ASM",
      description:
        "Advanced Suppression Manager. An object allowing you to specify how to handle unsubscribes.",
      optional: true,
    },
    ipPoolName: {
      type: "string",
      label: "Ip Pool Name",
      description: "The IP Pool that you would like to send this email from.",
      optional: true,
    },
    mailSettings: {
      type: "object",
      label: "Mail Settings",
      description:
        "A collection of different mail settings that you can use to specify how you would like this email to be handled.",
      optional: true,
    },
    trackingSettings: {
      type: "object",
      label: "Tracking Settings",
      description:
        "Settings to determine how you would like to track the metrics of how your recipients interact with your email.",
      optional: true,
    },
  },
  async run() {
    if (
      !this.personalizations ||
      !this.fromEmail ||
      !this.subject ||
      !this.content
    ) {
      throw new Error(
        "Must provide personalizations, fromEmail, subject, and content parameters."
      );
    }
    const personalizations = JSON.parse(this.personalizations);
    const content = JSON.parse(this.content);
    const attachments = this.attachments ? JSON.parse(this.attachments) : null;
    const categories = this.categories ? JSON.parse(this.categories) : null;
    const replyTo = this.replyToEmail
      ? { email: this.replyToEmail, name: this.replyToName }
      : null;
    const config = {
      personalizations,
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      reply_to: replyTo,
      subject: this.subject,
      content,
      attachments,
      template_id: this.templateId,
      headers: this.headers,
      categories,
      custom_args: this.customArgs,
      send_at: this.sendAt,
      batch_id: this.batchId,
      asm: this.asm,
      ip_pool_name: this.ipPoolName,
      mail_settings: this.mailSettings,
      tracking_settings: this.trackingSettings,
    };
    return await this.sendgrid.sendEmail(config);
  },
};
