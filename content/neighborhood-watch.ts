// content/neighborhood-watch.ts
//
// VERBATIM copy from content/source/neighborhood-watch-wix-extraction.md.
// Byte-for-byte; curly apostrophes preserved. Internal Wix links convert to
// internal routes (Community News -> /homeowners/community-news), stored as
// {pre, linkText, href, post} so the surrounding text stays exact.

export type LinkedLine = { pre: string; linkText: string; href: string; post: string };
export type Bullet = { lead: string; rest: string };

export const neighborhoodWatchContent = {
  pageTitle: "NEIGHBORHOOD WATCH",

  police: {
    heading: "Police and Local Authorities Contacts",
    emergencyLine: "For any emergencies, always dial 911 immediately.",
    nonEmergencySubhead:
      "For non-emergency situations or to report suspicious activity, you can contact our Lead Officer for the neighborhood:",
    officerParagraph:
      "Officer Smith is our dedicated liaison to the LAPD and works closely with our community to ensure safety and address concerns. Feel free to reach out to him for non-urgent matters, neighborhood issues, or to discuss safety improvements for the area.",
    communityNewsLine: {
      pre: "For more information or updates from local authorities, visit our ",
      linkText: "Community News section",
      href: "/homeowners/community-news",
      post: ".",
    } as LinkedLine,
  },

  officer: {
    name: "Officer Shawn Smith",
    department: ["Los Angeles Police Department", "Community Relations Division"],
    phone: "818-754-8358",
    email: "33751@lapd.online",
  },

  guidelines: {
    heading: "Neighborhood Watch Guidelines",
    intro:
      "Our Neighborhood Watch program is built on the idea that a safe community is an engaged community. Below are a few key guidelines to help ensure we all play our part in keeping the neighborhood safe:",
    bullets: [
      {
        lead: "Be Observant:",
        rest: "Take note of any unusual activity, such as unfamiliar vehicles or individuals acting suspiciously. Keep an eye on your neighbors’ homes, especially when they are away.",
      },
      {
        lead: "Do Not Confront:",
        rest: "If you observe suspicious behavior, do not engage or confront the individuals involved. Instead, safely observe from a distance and report the activity to the authorities.",
      },
      {
        lead: "Report Suspicious Activity:",
        rest: "For non-emergency situations, contact Lead Officer Shawn Smith at 818-754-8358 or via email at 33751@lapd.online. In case of emergencies, always call 911.",
      },
      {
        lead: "Use Your Security System:",
        rest: "Ensure your home’s security cameras and alarms are working properly. Share any relevant footage with law enforcement if an incident occurs.",
      },
      {
        lead: "Stay Connected:",
        rest: "Keep in touch with your neighbors and be aware of any community updates. Regular communication helps us stay informed about any potential issues.",
      },
    ] as Bullet[],
    closing:
      "By following these simple guidelines, we can work together to maintain a safe and secure environment for all residents.",
  },

  patrol: {
    heading: "Patrol Services and Neighborhood Presence",
    paragraphs: [
      "While we don’t have a set patrol schedule for the neighborhood, there are a few security services that can be seen periodically in our area. These services add an extra layer of security, ensuring a regular presence to deter potential criminal activity.",
      "Even without formal patrols, you can still help keep the community safe by:",
    ],
    bullets: [
      {
        lead: "Being Aware:",
        rest: "Stay alert for any unusual activity in the neighborhood and report it promptly to authorities or through our community channels.",
      },
      {
        lead: "Home Monitoring:",
        rest: "When neighbors are away, consider keeping an eye on their property, collecting packages, and notifying them of any unusual occurrences.",
      },
      {
        lead: "Security Systems:",
        rest: "Ensure your home security systems, including cameras and alarms, are in good working order. If you notice these patrol services passing by, take note of any patterns that might align with when homes are typically unoccupied.",
      },
    ] as Bullet[],
    closing:
      "While we rely on periodic professional patrols, the strength of our community’s safety also comes from individual awareness and cooperation.",
  },

  stayInformed: {
    heading: "Stay Informed",
    paragraph1: {
      pre: "To keep up to date on recent break-in activity in Laurelwood or to access the latest security and safety tips, visit our ",
      linkText: "Community News",
      href: "/homeowners/community-news",
      post: " section. Here, you’ll find detailed reports on local incidents, as well as advice on how to improve your home’s security and protect your property.",
    } as LinkedLine,
    paragraph2:
      "By staying informed, you can better understand potential risks in the area and take proactive steps to ensure the safety of your home and loved ones.",
  },
};
