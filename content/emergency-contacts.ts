// content/emergency-contacts.ts
//
// VERBATIM contact data from content/source/emergency-contacts-wix-extraction.md.
// Phone formats, the "6 th floor" spacing, the "(213)978-0333" missing space,
// the "(323)-221-9944" odd hyphen, and the accented "Doña Pegita" are preserved
// EXACTLY (they are on the Wix review list; do not normalize).
//
// `website` is NOT from the source. The Wix cards had "View Website" links whose
// URLs were not captured; these are official URLs added during the rebuild and
// are listed in the build report for Jack's verification. Where the official URL
// is ambiguous, `website` is omitted (and flagged in the report).

export type EmergencyContact = {
  name: string;
  sub?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
};

export type EmergencyCategory = { name: string; contacts: EmergencyContact[] };

export const emergencyContacts: {
  pageTitle: string;
  immediate: { eyebrow: string; call: string };
  categories: EmergencyCategory[];
} = {
  pageTitle: "LAURELWOOD CONTACT LIST",
  immediate: { eyebrow: "Immediate Emergency", call: "CALL 911" },
  categories: [
    {
      name: "Emergency & Public Safety",
      contacts: [
        {
          name: "Fire Station 108",
          sub: "Mulholland and Coldwater",
          phone: "818-756-8608",
          address: "12520 Mulholland Drive, Los Angeles, CA 90210",
          website: "https://www.lafd.org/fire-stations/fs-108",
        },
        {
          name: "Fire Station 97",
          sub: "Mulholland and Doña Pegita",
          phone: "(818) 756-8697",
          address: "8021 Mulholland Dr, Los Angeles, CA 90046",
          website: "https://www.lafd.org/fire-stations/fs-97",
        },
        {
          name: "Fire Captain",
          sub: "Brush Clearance Unit",
          phone: "(818) 778-4954",
          email: "bryan.nassour@lacity.org",
          address: "6262 Van Nuys #451, Van Nuys, CA 91401",
        },
        {
          name: "Fire Inspector",
          sub: "Brush Clearance Unit #184",
          phone: "(213) 932-1874",
          email: "shane.weaver@lacity.org",
          address: "6262 Van Nuys Blvd. #451, Van Nuys, CA 91401",
        },
        {
          name: "Fire Station 78",
          sub: "Whitsett and Ventura",
          phone: "(818) 756-8678",
          address: "4041 Whitsett Ave., Studio City, CA 91604",
          website: "https://www.lafd.org/fire-stations/fs-78",
        },
        {
          name: "Senior Lead Officer",
          sub: "Shawn Smith",
          phone: "(818) 754-8358",
          email: "33751@lapd.online",
          address: "11640 Burbank Blvd., North Hollywood, CA 91601",
        },
        {
          name: "North Hollywood Police",
          phone: "(818) 754-8358",
          email: "33751@lapd.online",
          address: "11640 Burbank Blvd., North Hollywood, CA 91601",
        },
      ],
    },
    {
      name: "Utilities & Services",
      contacts: [
        {
          name: "Vector Control",
          sub: "Mosquitos",
          phone: "818-364-9589",
          address: "16320 Foothill Blvd., Sylmar, CA 91342",
        },
        {
          name: "Dept. of Water & Power",
          phone: "(800) 342-5397",
          address: "6550 Van Nuys Boulevard, Van Nuys, CA 91401",
          website: "https://www.ladwp.com",
        },
        {
          name: "Bureau of Street Services",
          phone: "(213)978-0333",
          email: "bss.boss@lacity.org",
          address: "1149 S. Broadway, 4th Floor, Los Angeles, CA 90015",
          website: "https://streetsla.lacity.org",
        },
        {
          name: "Street Lighting Bureau",
          phone: "(213) 847-1300",
          email: "bsl.streetlighting@lacity.org",
          address: "1149 S Broadway #200, Los Angeles, CA 90015",
          website: "https://bsl.lacity.org",
        },
        {
          name: "Dept. of Animal Services",
          phone: "(213) 482-9558",
          email: "annette.ramirez@lacity.org",
          address: "221 N. Figueroa Street, 6 th floor, Los Angeles, CA 90012",
          website: "https://www.laanimalservices.com",
        },
        {
          name: "311 Call Center",
          phone: "311 or 213-473-3231",
          email: "311@lacity.org",
          address: "200 N. Main Street, Los Angeles, CA 90012",
          website: "https://myla311.lacity.org",
        },
      ],
    },
    {
      name: "Parks and Recreation",
      contacts: [
        {
          name: "Fryman Canyon Park",
          phone: "(323) 644-6661 or (323)-221-9944",
          email: "info@mrca.ca.gov",
          address: "8401 Mulholland Dr., Studio City, CA 91604",
          website: "https://mrca.ca.gov",
        },
        {
          name: "Wilacre Park",
          phone: "(818) 766-8445 or (818) 756-8189",
          address: "12601 Mulholland Dr., Studio City, CA 91604",
          website: "https://mrca.ca.gov",
        },
      ],
    },
    {
      name: "Local Neighborhood Associations",
      contacts: [
        {
          name: "Studio City Residents Assoc.",
          phone: "(818) 509-0230",
          email: "scraboard@studiocityresidents.org",
          address: "12069 Ventura Place, Suite H, Studio City, CA 91604",
          website: "https://www.studiocityresidents.org",
        },
        {
          name: "Studio City Neighborhood Cncl.",
          sub: "Board Meetings: 3rd Wed. at 7 p.m.",
          phone: "(818) 655-5400",
          address: "4024 Radford Ave. Editorial Bldg. 2, Studio City, CA 91604",
          website: "https://studiocitync.org",
        },
      ],
    },
  ],
};
