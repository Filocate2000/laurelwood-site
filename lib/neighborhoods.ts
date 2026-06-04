// lib/neighborhoods.ts
// Editorial narrative copy for each origin city in the commute widget.
// Keyed by the same slug used in lib/commute/origins.ts so the join is one lookup.
//
// Each entry has 3 narrative paragraphs (lede, body, close) plus a listings CTA
// destination. The commute widget renders these between the dropdown and the
// commute matrix when a city is selected.

export type DiningGroup =
  | "Local Favorites"
  | "Night Out"
  | "Brunch & Casual"
  | "Hidden Gems";

export type AttractionGroup = "Outdoors" | "Culture" | "Landmarks";

export type DiningEntry = {
  name: string;
  group: DiningGroup;
  note: string;
  lat?: number;
  lng?: number;
  accolade?: string;
};

export type AttractionEntry = {
  name: string;
  group: AttractionGroup;
  note: string;
  lat?: number;
  lng?: number;
};

export type Neighborhood = {
  narrative: [string, string, string];
  listingsHref: string;
  // --- Optional Communities-page curation (added 2026-06-04, populated later) ---
  // Extra ZIP codes whose schools belong to this community even when the school's
  // stored city is "Los Angeles" (the neighborhood-labeling problem). Matched
  // against school.zip in the schools query, case-insensitively.
  schoolZips?: string[];
  // School names or CDS codes that are zoned/assigned to this community. Surfaces
  // a navy "Zoned" pill (or "Nearby" when the school sits in another city).
  zonedSchools?: string[];
  // Exact stored school names to DROP from this community after zip expansion
  // (e.g. a school in a shared ZIP that belongs to a neighbor). Per-city only;
  // global non-traditional types are handled by isNonTraditionalSchool().
  excludeSchools?: string[];
  // Curated dining picks, grouped; optional lat/lng place them on the Overview map.
  dining?: DiningEntry[];
  // Curated attractions, grouped; optional lat/lng place them on the Overview map.
  attractions?: AttractionEntry[];
};

export const NEIGHBORHOODS: Record<string, Neighborhood> = {
  "beverly-hills": {
    schoolZips: ["90210", "90211", "90212"],
    zonedSchools: [
      "Horace Mann Elementary",
      "Beverly Vista Middle",
      "Beverly Hills High",
    ],
    dining: [
      { name: "Spago Beverly Hills", group: "Night Out", note: "Wolfgang Puck's flagship, a fine-dining landmark.", lat: 34.06765, lng: -118.39757 },
      { name: "The Polo Lounge", group: "Night Out", note: "Old-Hollywood glamour at the Beverly Hills Hotel.", lat: 34.06767, lng: -118.40087 },
      { name: "Il Pastaio", group: "Night Out", note: "Bustling Italian for handmade pasta on Canon.", lat: 34.07084, lng: -118.40088 },
      { name: "Mr Chow", group: "Night Out", note: "Theatrical Chinese, a longtime power-dinner spot.", lat: 34.0681, lng: -118.40323 },
      { name: "Funke", group: "Night Out", note: "Evan Funke's grand Italian, a recent destination.", lat: 34.07175, lng: -118.40151 },
      { name: "Crustacean", group: "Night Out", note: "Famous garlic noodles and roasted crab.", lat: 34.06915, lng: -118.40603 },
      { name: "Nate'n Al", group: "Local Favorites", note: "The classic deli, a Beverly Hills institution.", lat: 34.07307, lng: -118.40163 },
      { name: "La Scala", group: "Local Favorites", note: "Home of the chopped salad, a longtime favorite.", lat: 34.07137, lng: -118.40129 },
      { name: "Urth Caffe", group: "Brunch & Casual", note: "Organic coffee and cafe fare with a big patio.", lat: 34.06267, lng: -118.3994 },
    ],
    attractions: [
      { name: "Rodeo Drive", group: "Landmarks", note: "The world-famous luxury shopping street.", lat: 34.06779, lng: -118.40163 },
      { name: "Greystone Mansion and Gardens", group: "Culture", note: "Tudor estate and public gardens above the city.", lat: 34.09206, lng: -118.40153 },
      { name: "The Wallis Annenberg Center for the Performing Arts", group: "Culture", note: "Theater and performance in the former post office.", lat: 34.07247, lng: -118.40174 },
      { name: "Beverly Gardens Park", group: "Outdoors", note: "The lily pond and the Beverly Hills sign on Santa Monica Boulevard.", lat: 34.07233, lng: -118.40345 },
      { name: "Will Rogers Memorial Park", group: "Outdoors", note: "The triangle park across from the Beverly Hills Hotel.", lat: 34.08048, lng: -118.41229 },
    ],
    narrative: [
      "Beverly Hills represents the pinnacle of Los Angeles luxury living, where iconic estates, world class dining, and globally recognized shopping create one of the most prestigious addresses in the world.",
      "From the designer boutiques of Rodeo Drive to discreet residential streets lined with architectural estates, Beverly Hills offers a lifestyle defined by elegance, privacy, and convenience. Residents enjoy effortless access to premier restaurants, luxury hotels, private clubs, and some of Southern California's most sought after real estate.",
      "For those seeking timeless prestige in the heart of Los Angeles, few neighborhoods compare.",
    ],
    listingsHref: "/properties",
  },

  brentwood: {
    dining: [
      { name: "Vincenti Ristorante", group: "Local Favorites", note: "Refined Italian on San Vicente.", lat: 34.05220, lng: -118.47118 },
      { name: "Baltaire", group: "Night Out", note: "Modern steakhouse and patio on San Vicente.", lat: 34.05426, lng: -118.46400 },
      { name: "Pizzicotto", group: "Local Favorites", note: "The neighborhood Italian regulars keep full.", lat: 34.05299, lng: -118.46775 },
      { name: "Farmshop", group: "Brunch & Casual", note: "Market and cafe at the Brentwood Country Mart.", lat: 34.04744, lng: -118.49045 },
      { name: "Katsuya Brentwood", group: "Hidden Gems", note: "Longtime sushi staple on San Vicente.", lat: 34.05335, lng: -118.46839 },
    ],
    attractions: [
      { name: "Getty Center", group: "Culture", note: "The hilltop museum and gardens above the 405.", lat: 34.07734, lng: -118.47326 },
      { name: "Brentwood Country Mart", group: "Landmarks", note: "The 1948 shingled market and courtyard.", lat: 34.04756, lng: -118.49045 },
      { name: "San Vicente Boulevard", group: "Outdoors", note: "The coral-tree median jogging path.", lat: 34.05173, lng: -118.47567 },
    ],
    schoolZips: ["90049"],
    zonedSchools: [
      "Kenter Canyon Elementary Charter",
      "Paul Revere Charter Middle",
    ],
    narrative: [
      "Nestled between the Santa Monica Mountains and the Pacific coastline, Brentwood offers a refined balance of tranquility, sophistication, and Westside convenience.",
      "Known for its tree lined streets, understated luxury, and vibrant local culture, Brentwood attracts residents seeking privacy without sacrificing connectivity. From morning coffee at the Brentwood Country Mart to afternoons at the Getty Center, the neighborhood delivers a lifestyle that feels both elevated and relaxed.",
      "Its central location provides seamless access to Santa Monica, Beverly Hills, and Century City, making Brentwood one of Los Angeles' most desirable residential communities.",
    ],
    listingsHref: "/properties",
  },

  burbank: {
    dining: [
      { name: "Bob's Big Boy Burbank", group: "Local Favorites", note: "The original 1949 drive-in, a Googie landmark.", lat: 34.15248, lng: -118.34610 },
      { name: "Porto's Bakery", group: "Local Favorites", note: "The beloved Cuban bakery and cafe.", lat: 34.16771, lng: -118.34653 },
      { name: "Olive & Thyme", group: "Night Out", note: "Cafe and market on Riverside Drive.", lat: 34.15259, lng: -118.34172 },
      { name: "Granville", group: "Brunch & Casual", note: "Californian comfort food downtown.", lat: 34.18113, lng: -118.30933 },
    ],
    attractions: [
      { name: "Warner Bros. Studio Tour", group: "Landmarks", note: "The working-lot tour off Hollywood Way.", lat: 34.15118, lng: -118.33580 },
      { name: "Magnolia Park", group: "Landmarks", note: "The vintage-shopping stretch of Magnolia Boulevard.", lat: 34.16827, lng: -118.33889 },
      { name: "Stough Canyon", group: "Outdoors", note: "The foothill trailhead above the city.", lat: 34.19806, lng: -118.30424 },
      { name: "Johnny Carson Park", group: "Outdoors", note: "The creekside park beside the studios.", lat: 34.15428, lng: -118.32992 },
    ],
    schoolZips: ["91501", "91502", "91504", "91505", "91506"],
    zonedSchools: [
      "Walt Disney Elementary",
      "John Muir Middle",
      "Burbank High",
    ],
    narrative: [
      "Burbank blends entertainment industry roots with a strong sense of community, creating one of Los Angeles' most established and livable neighborhoods.",
      "Home to major studios, charming residential streets, and an expanding dining and retail scene, Burbank offers a lifestyle that feels connected yet approachable. Residents enjoy convenient access to both the San Fernando Valley and central Los Angeles while benefiting from a quieter, neighborhood oriented atmosphere.",
      "For buyers seeking convenience, character, and long term appeal, Burbank continues to stand out.",
    ],
    listingsHref: "/properties",
  },

  calabasas: {
    schoolZips: ["91302"],
    zonedSchools: [
      "Lupin Hill Elementary",
      "Alice C. Stelle Middle",
      "Calabasas High",
    ],
    dining: [
      { name: "Saddle Peak Lodge", group: "Night Out", note: "Rustic game and fine dining tucked in the canyon." },
      { name: "The Old Place", group: "Night Out", note: "Historic Cornell roadhouse for oak-grilled fare." },
      { name: "King's Fish House", group: "Night Out", note: "Seafood and a raw bar at the Commons.", lat: 34.15542, lng: -118.64336 },
      { name: "Toscanova", group: "Local Favorites", note: "Italian dining and cafe at the Commons.", lat: 34.1533, lng: -118.64654 },
      { name: "Marmalade Cafe", group: "Brunch & Casual", note: "Californian cafe, a reliable Commons stop.", lat: 34.15327, lng: -118.64627 },
      { name: "Pedalers Fork", group: "Brunch & Casual", note: "Farm-to-table cafe and coffee in Old Town.", lat: 34.15725, lng: -118.63878 },
    ],
    attractions: [
      { name: "The Commons at Calabasas", group: "Landmarks", note: "The Mediterranean-style shopping and dining center.", lat: 34.15365, lng: -118.64579 },
      { name: "Calabasas Old Town", group: "Landmarks", note: "The historic stretch of Calabasas Road.", lat: 34.1569, lng: -118.63978 },
      { name: "Leonis Adobe Museum", group: "Culture", note: "Restored 1844 adobe and a working historic ranch.", lat: 34.15767, lng: -118.63982 },
      { name: "Malibu Creek State Park", group: "Outdoors", note: "Sweeping trails and the former filming canyon." },
    ],
    narrative: [
      "Calabasas offers a private and resort inspired lifestyle surrounded by rolling hills, gated communities, and scenic natural beauty.",
      "Known for its luxury estates, exclusive neighborhoods, and relaxed atmosphere, Calabasas attracts residents seeking privacy without sacrificing accessibility. From upscale shopping and dining to nearby hiking trails and open space, the community delivers a refined balance of comfort and sophistication.",
      "For those looking for luxury living with a more secluded feel, Calabasas remains one of Southern California's most desirable destinations.",
    ],
    listingsHref: "/properties",
  },

  "century-city": {
    dining: [
      { name: "Eataly LA", group: "Night Out", note: "The Italian marketplace and restaurants at Westfield.", lat: 34.06043, lng: -118.41873 },
      { name: "Javier's", group: "Night Out", note: "Upscale Mexican and margaritas at the center.", lat: 34.05909, lng: -118.42075 },
      { name: "Clementine", group: "Brunch & Casual", note: "The beloved cafe and bakery off Santa Monica Boulevard.", lat: 34.06025, lng: -118.42085 },
    ],
    attractions: [
      { name: "Westfield Century City", group: "Landmarks", note: "The open-air shopping and dining center.", lat: 34.05866, lng: -118.41903 },
    ],
    schoolZips: ["90067"],
    narrative: [
      "Century City combines luxury high rise living with world class business, shopping, and entertainment in the center of the Westside.",
      "Defined by sleek residential towers, modern architecture, and premier destinations like Westfield Century City, the neighborhood attracts professionals and residents seeking convenience and sophistication. With Beverly Hills, Westwood, and Santa Monica just minutes away, Century City offers an elevated urban lifestyle in one of Los Angeles' most connected locations.",
      "For buyers seeking modern luxury in the heart of the city, Century City delivers unmatched accessibility and energy.",
    ],
    listingsHref: "/properties",
  },

  "culver-city": {
    dining: [
      { name: "Father's Office", group: "Night Out", note: "The famed burger and beer, at Helms Bakery.", lat: 34.03041, lng: -118.38482 },
      { name: "Tito's Tacos", group: "Local Favorites", note: "The cash-only taco institution since 1959.", lat: 34.00812, lng: -118.41449 },
      { name: "Pasta Sisters", group: "Local Favorites", note: "Handmade pasta from the counter.", lat: 34.02992, lng: -118.38400 },
      { name: "Versailles", group: "Local Favorites", note: "The Cuban classic on Venice Boulevard.", lat: 34.02114, lng: -118.39680 },
      { name: "Cognoscenti Coffee", group: "Hidden Gems", note: "The quietly serious coffee bar.", lat: 34.03111, lng: -118.37779 },
    ],
    attractions: [
      { name: "Sony Pictures Studio Tour", group: "Landmarks", note: "The historic MGM lot in the heart of town.", lat: 34.01551, lng: -118.40328 },
      { name: "The Museum of Jurassic Technology", group: "Culture", note: "The cult Venice Boulevard curiosity museum.", lat: 34.02588, lng: -118.39506 },
      { name: "Baldwin Hills Scenic Overlook", group: "Outdoors", note: "The stair climb with sweeping city views.", lat: 34.01820, lng: -118.38191 },
      { name: "Culver Hotel", group: "Landmarks", note: "The 1924 flatiron hotel downtown.", lat: 34.02385, lng: -118.39419 },
    ],
    schoolZips: ["90230", "90232"],
    zonedSchools: [
      "La Ballona Elementary",
      "Culver City Middle",
      "Culver City High",
    ],
    narrative: [
      "Culver City blends historic character with modern creativity, creating one of Los Angeles' most dynamic and rapidly evolving communities.",
      "Known for its thriving restaurant scene, entertainment industry roots, and growing technology presence, Culver City offers a vibrant lifestyle with strong neighborhood appeal. Walkable streets, contemporary developments, and convenient Westside access continue to attract residents seeking a connected and energetic environment.",
      "For those looking for culture, convenience, and long term growth, Culver City continues to gain attention across Los Angeles.",
    ],
    listingsHref: "/properties",
  },

  "downtown-la": {
    dining: [
      { name: "Bestia", group: "Night Out", note: "The Arts District Italian that defined the scene.", lat: 34.03383, lng: -118.22933 },
      { name: "Bavel", group: "Night Out", note: "Middle Eastern sibling to Bestia, just as booked.", lat: 34.04149, lng: -118.23293 },
      { name: "Damian", group: "Night Out", note: "Enrique Olvera's modern Mexican in the Arts District.", lat: 34.03347, lng: -118.22895 },
      { name: "Grand Central Market", group: "Local Favorites", note: "The 1917 food hall, end to end.", lat: 34.05105, lng: -118.24933 },
      { name: "Philippe the Original", group: "Local Favorites", note: "Home of the French dip since 1908.", lat: 34.05969, lng: -118.23705 },
      { name: "Cole's", group: "Local Favorites", note: "The other French dip claim, with a hidden bar.", lat: 34.04479, lng: -118.24951 },
      { name: "Sonoratown", group: "Hidden Gems", note: "Sonoran-style tacos and flour tortillas.", lat: 34.04162, lng: -118.25218 },
    ],
    attractions: [
      { name: "The Broad", group: "Culture", note: "Contemporary art museum on Grand Avenue.", lat: 34.05450, lng: -118.25018 },
      { name: "Walt Disney Concert Hall", group: "Culture", note: "Gehry's landmark home of the LA Phil.", lat: 34.05535, lng: -118.24984 },
      { name: "Bradbury Building", group: "Landmarks", note: "The 1893 atrium famous on film.", lat: 34.05060, lng: -118.24786 },
      { name: "Union Station", group: "Landmarks", note: "The grand 1939 rail terminal.", lat: 34.05603, lng: -118.23477 },
      { name: "Grand Park", group: "Outdoors", note: "The civic green between the Music Center and City Hall.", lat: 34.05633, lng: -118.24677 },
    ],
    schoolZips: ["90012", "90013", "90014", "90015", "90017", "90021", "90071"],
    zonedSchools: [
      "Ninth Street Elementary",
      "Castelar Street Elementary",
    ],
    narrative: [
      "Downtown Los Angeles offers a fast paced urban lifestyle surrounded by iconic architecture, luxury high rises, and world class entertainment.",
      "From the Arts District to South Park, Downtown LA combines culture, nightlife, and modern residential living in one of the city's most energetic environments. Residents enjoy acclaimed restaurants, rooftop lounges, major sports venues, and convenient access to business and creative hubs throughout Los Angeles.",
      "For buyers seeking a true metropolitan experience, Downtown LA delivers unmatched energy and connectivity.",
    ],
    listingsHref: "/properties",
  },

  "el-segundo": {
    dining: [
      { name: "Richmond Bar & Grill", group: "Local Favorites", note: "The downtown El Segundo tavern.", lat: 33.91771, lng: -118.41732 },
      { name: "Blue Butterfly Coffee Co.", group: "Brunch & Casual", note: "The Main Street coffee stop.", lat: 33.92054, lng: -118.41612 },
    ],
    attractions: [
      { name: "Old Town Music Hall", group: "Culture", note: "The 1921 silent-film and Mighty Wurlitzer theater.", lat: 33.91759, lng: -118.41696 },
      { name: "El Segundo Beach", group: "Outdoors", note: "The wide beach along the Strand south of the airport.", lat: 33.91352, lng: -118.42781 },
    ],
    schoolZips: ["90245"],
    zonedSchools: [
      "Center Street Elementary",
      "El Segundo Middle",
      "El Segundo High",
    ],
    narrative: [
      "El Segundo combines a relaxed coastal atmosphere with a growing innovation and technology presence near Silicon Beach.",
      "Known for its small town charm, walkable streets, and close proximity to the ocean, El Segundo offers a lifestyle that feels both connected and community driven. Residents enjoy excellent schools, local restaurants, outdoor recreation, and convenient access to Playa Vista, Manhattan Beach, and LAX.",
      "For those seeking coastal convenience with a more residential feel, El Segundo offers a unique balance rarely found in Los Angeles.",
    ],
    listingsHref: "/properties",
  },

  encino: {
    schoolZips: ["91316", "91436"],
    zonedSchools: [
      "Encino Charter Elementary",
      "Gaspar De Portola Charter Middle",
      "Birmingham Community Charter High",
    ],
    dining: [
      { name: "Versailles", group: "Local Favorites", note: "Cuban classic famous for its garlic chicken.", lat: 34.16085, lng: -118.51214 },
      { name: "Delmonico's Lobster House", group: "Night Out", note: "Old-school seafood house, an Encino mainstay.", lat: 34.15703, lng: -118.48985 },
      { name: "Maria's Italian Kitchen", group: "Local Favorites", note: "Family Italian, a dependable Valley staple.", lat: 34.15774, lng: -118.49493 },
      { name: "More Than Waffles", group: "Brunch & Casual", note: "Longtime breakfast favorite just off Ventura.", lat: 34.1596, lng: -118.50761 },
      { name: "Coral Tree Cafe", group: "Brunch & Casual", note: "Casual Californian cafe for coffee and lunch.", lat: 34.16188, lng: -118.51396 },
    ],
    attractions: [
      { name: "Los Encinos State Historic Park", group: "Culture", note: "Adobe and natural springs marking the original Valley rancho.", lat: 34.1603, lng: -118.49858 },
      { name: "Sepulveda Basin Wildlife Reserve", group: "Outdoors", note: "Lakeside trails and birdwatching in the Basin.", lat: 34.17981, lng: -118.4748 },
      { name: "Balboa Sports Complex", group: "Outdoors", note: "Sprawling fields and golf at the edge of the Basin.", lat: 34.17834, lng: -118.50464 },
      { name: "Ventura Boulevard", group: "Landmarks", note: "Encino's shopping and dining corridor.", lat: 34.15887, lng: -118.49941 },
    ],
    narrative: [
      "Encino is known for its spacious homes, tree lined streets, and relaxed residential atmosphere in the heart of the San Fernando Valley.",
      "Offering a strong sense of privacy while remaining conveniently connected to the Westside and Studio City, Encino attracts residents seeking comfort, convenience, and long term livability. From upscale dining and shopping along Ventura Boulevard to nearby parks and recreational spaces, the neighborhood delivers a balanced and family friendly lifestyle.",
      "For buyers looking for space and accessibility without sacrificing comfort, Encino continues to be a highly desirable Valley community.",
    ],
    listingsHref: "/properties",
  },

  glendale: {
    dining: [
      { name: "Raffi's Place", group: "Local Favorites", note: "The beloved Persian-Armenian kebab garden.", lat: 34.14656, lng: -118.25345 },
      { name: "Carousel", group: "Local Favorites", note: "The Lebanese-Armenian mezze institution.", lat: 34.15022, lng: -118.25463 },
      { name: "Mini Kabob", group: "Hidden Gems", note: "The tiny family Armenian kebab counter.", lat: 34.14094, lng: -118.25859 },
      { name: "Porto's Bakery", group: "Brunch & Casual", note: "The Cuban bakery flagship.", lat: 34.15041, lng: -118.25551 },
      { name: "Far Niente", group: "Night Out", note: "Longtime Italian on Brand Boulevard.", lat: 34.14838, lng: -118.25464 },
    ],
    attractions: [
      { name: "The Americana at Brand", group: "Landmarks", note: "Caruso's outdoor shopping and dining.", lat: 34.14482, lng: -118.25646 },
      { name: "Forest Lawn Memorial Park", group: "Culture", note: "The famous hillside cemetery with art and views.", lat: 34.12463, lng: -118.25143 },
      { name: "Brand Library & Art Center", group: "Culture", note: "The 1904 'El Miradero' mansion and gardens.", lat: 34.18252, lng: -118.27638 },
      { name: "Deukmejian Wilderness Park", group: "Outdoors", note: "Foothill trails at the top of the city." },
    ],
    schoolZips: ["91201", "91202", "91203", "91204", "91205", "91206", "91207", "91208"],
    zonedSchools: [
      "Balboa Elementary",
      "Theodore Roosevelt Middle",
      "Glendale High",
    ],
    narrative: [
      "Glendale combines urban convenience with hillside charm, creating one of Los Angeles' most diverse and well connected communities.",
      "Known for its vibrant shopping districts, growing dining scene, and established residential neighborhoods, Glendale offers a lifestyle that feels both energetic and family oriented. Residents enjoy close proximity to Downtown Los Angeles, Pasadena, and Burbank while benefiting from a strong sense of community and local character.",
      "For buyers seeking convenience, culture, and accessibility, Glendale continues to attract attention across Southern California.",
    ],
    listingsHref: "/properties",
  },

  hollywood: {
    dining: [
      { name: "Musso & Frank Grill", group: "Night Out", note: "The 1919 grill, the oldest in Hollywood.", lat: 34.10175, lng: -118.33536 },
      { name: "Petit Trois", group: "Local Favorites", note: "Ludo Lefebvre's bistro counter.", lat: 34.08416, lng: -118.33819 },
      { name: "Jitlada", group: "Local Favorites", note: "The cult Southern Thai on Sunset.", lat: 34.09857, lng: -118.30408 },
      { name: "Mother Wolf", group: "Night Out", note: "Evan Funke's grand Roman pastas.", lat: 34.09942, lng: -118.33131 },
      { name: "Square One Dining", group: "Brunch & Casual", note: "The Sunset breakfast staple.", lat: 34.09527, lng: -118.29503 },
      { name: "Yamashiro", group: "Hidden Gems", note: "Hilltop Japanese with skyline views.", lat: 34.10576, lng: -118.34209 },
    ],
    attractions: [
      { name: "TCL Chinese Theatre", group: "Landmarks", note: "The handprint forecourt on Hollywood Boulevard.", lat: 34.10202, lng: -118.34097 },
      { name: "Hollywood Walk of Fame", group: "Landmarks", note: "The star-studded sidewalk.", lat: 34.09853, lng: -118.32556 },
      { name: "Hollywood Bowl", group: "Culture", note: "The iconic outdoor amphitheater.", lat: 34.11222, lng: -118.33913 },
      { name: "Runyon Canyon", group: "Outdoors", note: "The city's favorite hillside hike.", lat: 34.10524, lng: -118.34897 },
      { name: "Dolby Theatre", group: "Landmarks", note: "Home of the Academy Awards.", lat: 34.10269, lng: -118.34042 },
    ],
    schoolZips: ["90068", "90028", "90046"],
    zonedSchools: [
      "Cheremoya Avenue Elementary",
      "Joseph Le Conte Middle",
      "Hollywood Senior High",
    ],
    narrative: [
      "Hollywood remains one of Los Angeles' most iconic neighborhoods, blending entertainment history with modern luxury and creative energy.",
      "From legendary theaters and rooftop lounges to contemporary residential developments and nightlife destinations, Hollywood offers a lifestyle centered around culture and excitement. Residents enjoy immediate access to some of the city's most recognizable landmarks while remaining connected to nearby West Hollywood, Downtown LA, and the Valley.",
      "For those seeking a vibrant urban lifestyle in the center of Los Angeles, Hollywood continues to deliver unmatched character and energy.",
    ],
    listingsHref: "/properties",
  },

  "los-feliz": {
    dining: [
      { name: "Little Dom's", group: "Local Favorites", note: "The red-sauce neighborhood Italian institution.", lat: 34.11093, lng: -118.28722 },
      { name: "Alcove", group: "Brunch & Casual", note: "The Hillhurst patio brunch landmark.", lat: 34.10623, lng: -118.28776 },
      { name: "Figaro Bistrot", group: "Local Favorites", note: "The French cafe on Vermont Avenue.", lat: 34.10378, lng: -118.29164 },
      { name: "HOME", group: "Brunch & Casual", note: "The garden-patio comfort spot on Hillhurst.", lat: 34.10308, lng: -118.28719 },
      { name: "The Dresden", group: "Hidden Gems", note: "The retro lounge of 'Marty and Elayne' fame.", lat: 34.10309, lng: -118.29155 },
    ],
    attractions: [
      { name: "Griffith Observatory", group: "Outdoors", note: "The landmark observatory and city views.", lat: 34.11843, lng: -118.30039 },
      { name: "Griffith Park", group: "Outdoors", note: "Trails, the Greek, and the LA Zoo.", lat: 34.11190, lng: -118.28746 },
      { name: "The Greek Theatre", group: "Culture", note: "The open-air concert venue in the park.", lat: 34.11953, lng: -118.29629 },
      { name: "Vista Theatre", group: "Landmarks", note: "The 1923 single-screen movie palace.", lat: 34.09828, lng: -118.28695 },
      { name: "Barnsdall Art Park", group: "Culture", note: "Frank Lloyd Wright's Hollyhock House on the hill.", lat: 34.10040, lng: -118.29439 },
    ],
    schoolZips: ["90027", "90039"],
    zonedSchools: [
      "Franklin Avenue Elementary",
      "Thomas Starr King Middle School Film and Media Magnet",
      "John Marshall Senior High",
    ],
    narrative: [
      "Los Feliz sits at the base of Griffith Park, where early twentieth century architecture, tree lined hillside streets, and a long standing creative identity define one of Los Angeles' most distinctive residential neighborhoods.",
      "The neighborhood's central corridor along Vermont Avenue and Los Feliz Boulevard offers an eclectic mix of restaurants, independent cinemas, and shops that reflect the area's cultural character. Nearby Griffith Park provides immediate access to hiking trails, the Griffith Observatory, and some of the most expansive open space within city limits.",
      "Its central location connects residents to Silver Lake, Hollywood, and Downtown Los Angeles, while the neighborhood itself retains a scale and density that feels grounded and distinctly its own.",
    ],
    listingsHref: "/past-transactions?city=Los+Feliz",
  },

  malibu: {
    dining: [
      { name: "Nobu Malibu", group: "Night Out", note: "Star-studded Japanese on the bluff above Carbon Beach.", lat: 34.03904, lng: -118.66965 },
      { name: "Geoffrey's Malibu", group: "Night Out", note: "Oceanfront fine dining for the nights that matter.", lat: 34.02535, lng: -118.76982 },
      { name: "Malibu Seafood", group: "Local Favorites", note: "The roadside fish shack locals swear by.", lat: 34.03381, lng: -118.73508 },
      { name: "Broad Street Oyster Co.", group: "Local Favorites", note: "Lobster rolls and oysters at the Country Mart.", lat: 34.03551, lng: -118.68392 },
      { name: "Malibu Farm Pier Cafe", group: "Brunch & Casual", note: "Farm-to-table at the end of the pier.", lat: 34.03712, lng: -118.67670 },
      { name: "John's Garden", group: "Brunch & Casual", note: "The longtime Country Mart sandwich counter.", lat: 34.03597, lng: -118.68570 },
      { name: "Cafe Habana Malibu", group: "Hidden Gems", note: "Cuban-Mexican with a cult brunch off PCH.", lat: 34.03457, lng: -118.68563 },
    ],
    attractions: [
      { name: "Zuma Beach", group: "Outdoors", note: "The wide classic Malibu beach for surf and sand.", lat: 34.02180, lng: -118.83119 },
      { name: "Point Dume State Beach", group: "Outdoors", note: "Headland trail and coves with whale-watching views.", lat: 34.01109, lng: -118.81660 },
      { name: "Surfrider Beach", group: "Outdoors", note: "The legendary point break beside the pier.", lat: 34.03357, lng: -118.68043 },
      { name: "Malibu Pier", group: "Landmarks", note: "The historic pier anchoring central Malibu.", lat: 34.03653, lng: -118.67617 },
      { name: "Adamson House", group: "Culture", note: "Spanish-Colonial tile landmark at Malibu Lagoon.", lat: 34.03453, lng: -118.68052 },
    ],
    schoolZips: ["90265"],
    zonedSchools: [
      "Webster Elementary",
      "Malibu Middle",
      "Malibu High",
    ],
    narrative: [
      "Malibu offers an unparalleled coastal lifestyle defined by oceanfront estates, scenic beauty, and complete tranquility.",
      "Known for its private beaches, breathtaking views, and relaxed luxury, Malibu attracts residents seeking a retreat from city life without sacrificing access to Los Angeles. From seaside dining and scenic canyon roads to exclusive residential enclaves, the community delivers a level of privacy and natural beauty found nowhere else in Southern California.",
      "For buyers seeking coastal elegance and timeless exclusivity, Malibu stands in a class of its own.",
    ],
    listingsHref: "/properties",
  },

  "marina-del-rey": {
    dining: [
      { name: "Cafe Del Rey", group: "Night Out", note: "Waterfront fine dining on the main channel.", lat: 33.98354, lng: -118.44697 },
      { name: "Killer Cafe", group: "Local Favorites", note: "The harborside breakfast spot.", lat: 33.98350, lng: -118.45646 },
      { name: "Tony P's Dockside Grill", group: "Local Favorites", note: "The dependable grill on the water.", lat: 33.98374, lng: -118.44784 },
      { name: "The Warehouse", group: "Brunch & Casual", note: "The tiki-leaning marina classic.", lat: 33.98339, lng: -118.44492 },
    ],
    attractions: [
      { name: "Mother's Beach", group: "Outdoors", note: "The calm-water beach inside the marina.", lat: 33.98161, lng: -118.45811 },
      { name: "Marvin Braude Bike Trail", group: "Outdoors", note: "The beach bike path along the sand.", lat: 33.97455, lng: -118.44443 },
      { name: "Ballona Wetlands", group: "Outdoors", note: "The coastal wetland reserve.", lat: 33.96557, lng: -118.44508 },
      { name: "Fisherman's Village", group: "Landmarks", note: "The boardwalk of shops and harbor cruises.", lat: 33.97290, lng: -118.44596 },
    ],
    schoolZips: ["90292"],
    narrative: [
      "Marina del Rey combines waterfront living with modern convenience, offering one of the most relaxed and connected coastal lifestyles on the Westside.",
      "Centered around the marina and surrounded by luxury residences, walkable dining, and outdoor recreation, the neighborhood attracts residents seeking an active yet effortless atmosphere. With Venice, Playa Vista, and Santa Monica just minutes away, Marina del Rey provides exceptional access to both coastal living and city convenience.",
      "For those looking to embrace a more balanced and outdoor oriented lifestyle, Marina del Rey offers a unique waterfront experience in Los Angeles.",
    ],
    listingsHref: "/properties",
  },

  "north-hollywood": {
    dining: [
      { name: "The Front Yard", group: "Local Favorites", note: "Patio dining at the Garland hotel.", lat: 34.14537, lng: -118.36978 },
      { name: "Republic of Pie", group: "Local Favorites", note: "The NoHo Arts District coffee-and-pie hub.", lat: 34.16473, lng: -118.37313 },
      { name: "Federal Bar", group: "Hidden Gems", note: "Gastropub in a grand former bank.", lat: 34.16712, lng: -118.37621 },
    ],
    attractions: [
      { name: "NoHo Arts District", group: "Culture", note: "The walkable theater and gallery district.", lat: 34.16500, lng: -118.37470 },
      { name: "Television Academy", group: "Landmarks", note: "The Emmy statue plaza off Lankershim.", lat: 34.16632, lng: -118.37448 },
      { name: "North Hollywood Park", group: "Outdoors", note: "The big park beside the Academy.", lat: 34.16284, lng: -118.38042 },
    ],
    schoolZips: ["91601", "91602", "91605", "91606", "91607"],
    zonedSchools: [
      "Colfax Charter Elementary",
      "Walter Reed Middle",
      "North Hollywood Senior High",
    ],
    narrative: [
      "North Hollywood blends creative energy with a rapidly evolving arts and entertainment scene in the heart of the San Fernando Valley.",
      "Known for the NoHo Arts District, modern residential developments, and a growing collection of restaurants, cafés, and theaters, the neighborhood continues to attract artists, professionals, and creatives alike. Residents enjoy convenient Metro access and close proximity to Hollywood, Studio City, and Burbank.",
      "For buyers seeking an energetic and evolving community with strong cultural identity, North Hollywood continues to gain momentum.",
    ],
    listingsHref: "/properties",
  },

  "pacific-palisades": {
    // Dining omitted: heavy losses in the January 2025 Palisades fire leave too
    // much uncertainty about what is open. Only durable, confirmed-open sites are
    // listed (Getty Villa was defended and survived; the beach is unaffected).
    attractions: [
      { name: "Getty Villa", group: "Culture", note: "The Roman-villa antiquities museum above PCH.", lat: 34.04589, lng: -118.56486 },
      { name: "Will Rogers State Beach", group: "Outdoors", note: "The long beach at the base of the canyon.", lat: 34.03506, lng: -118.53666 },
    ],
    schoolZips: ["90272"],
    zonedSchools: [
      "Palisades Charter Elementary",
      "Palisades Charter High",
    ],
    narrative: [
      "Pacific Palisades offers a rare combination of coastal beauty, privacy, and upscale residential living along the Pacific coastline.",
      "Surrounded by the Santa Monica Mountains and ocean views, the neighborhood delivers a lifestyle centered around tranquility, outdoor recreation, and understated luxury. Residents enjoy scenic hiking trails, charming local boutiques, and elegant homes tucked into quiet residential streets.",
      "For those seeking a refined coastal lifestyle with a strong sense of community, Pacific Palisades remains one of Los Angeles' most coveted neighborhoods.",
    ],
    listingsHref: "/properties",
  },

  pasadena: {
    dining: [
      { name: "The Raymond 1886", group: "Night Out", note: "Craftsman-bungalow dining and cocktails.", lat: 34.12449, lng: -118.14997 },
      { name: "Pie 'n Burger", group: "Local Favorites", note: "The 1963 counter institution.", lat: 34.13601, lng: -118.13148 },
      { name: "Union", group: "Local Favorites", note: "Acclaimed Italian on Union Street.", lat: 34.14674, lng: -118.15325 },
      { name: "Marston's", group: "Brunch & Casual", note: "The craft-breakfast cottage.", lat: 34.14971, lng: -118.14734 },
      { name: "Lincoln", group: "Hidden Gems", note: "Garden cafe and bakery on the north side.", lat: 34.17995, lng: -118.15925 },
    ],
    attractions: [
      { name: "The Huntington", group: "Culture", note: "Library, art, and botanical gardens in San Marino.", lat: 34.13157, lng: -118.07273 },
      { name: "Norton Simon Museum", group: "Culture", note: "The world-class art collection at the parade route.", lat: 34.14635, lng: -118.15926 },
      { name: "Old Pasadena", group: "Landmarks", note: "The historic shopping and dining district.", lat: 34.14589, lng: -118.15177 },
      { name: "Rose Bowl", group: "Landmarks", note: "The historic stadium and monthly flea market.", lat: 34.16133, lng: -118.16763 },
      { name: "Gamble House", group: "Culture", note: "The 1908 Greene & Greene Craftsman masterwork.", lat: 34.15165, lng: -118.16096 },
    ],
    schoolZips: ["91101", "91103", "91104", "91105", "91106", "91107"],
    zonedSchools: [
      "Pasadena High",
      "John Muir High",
      "McKinley",
    ],
    narrative: [
      "Pasadena combines historic charm with cultural sophistication, offering timeless architecture, tree lined streets, and a vibrant local lifestyle.",
      "Known for its beautiful residential neighborhoods, acclaimed dining scene, and iconic landmarks, Pasadena attracts residents seeking character and community within a more refined setting. From Old Town Pasadena to the city's museums, gardens, and cultural institutions, the area delivers a lifestyle rich in history and accessibility.",
      "For buyers looking for elegance, charm, and a strong sense of place, Pasadena continues to stand apart in Southern California.",
    ],
    listingsHref: "/properties",
  },

  "playa-vista": {
    dining: [
      { name: "Bristol Farms", group: "Brunch & Casual", note: "The market and prepared-foods cafe at Runway.", lat: 33.97922, lng: -118.41384 },
    ],
    attractions: [
      { name: "Runway Playa Vista", group: "Landmarks", note: "The open-air shopping and dining center.", lat: 33.97665, lng: -118.41684 },
      { name: "Ballona Wetlands", group: "Outdoors", note: "The protected coastal wetland beside the bluffs.", lat: 33.96557, lng: -118.44508 },
      { name: "Playa Vista Central Park", group: "Outdoors", note: "The community green and playgrounds.", lat: 33.98139, lng: -118.40577 },
    ],
    schoolZips: ["90094"],
    zonedSchools: [
      "Playa Vista Elementary",
    ],
    // Stored as city=Compton (lat/lng in Compton) but mis-filed under ZIP 90094,
    // so it matched Playa Vista by ZIP. Not a Playa Vista school.
    excludeSchools: ["Compton Performing Arts Academy"],
    narrative: [
      "Playa Vista has emerged as one of Los Angeles' leading hubs for technology, innovation, and modern urban living.",
      "Defined by contemporary residences, walkable amenities, and a strong connection to Silicon Beach, the neighborhood offers a highly convenient and community focused lifestyle. Residents enjoy parks, restaurants, fitness studios, and easy access to nearby coastal destinations including Marina del Rey and Playa del Rey.",
      "For those seeking modern convenience with a connected and forward thinking atmosphere, Playa Vista continues to attract professionals and creatives alike.",
    ],
    listingsHref: "/properties",
  },

  "san-fernando": {
    // Dining omitted: no independent restaurant met the confidence bar for this
    // small city (see REPORT note).
    attractions: [
      { name: "San Fernando Mall", group: "Landmarks", note: "The walkable Paseo shopping promenade.", lat: 34.28398, lng: -118.44299 },
      { name: "Lopez Adobe", group: "Culture", note: "The 1882 historic adobe home.", lat: 34.28201, lng: -118.44330 },
      { name: "Mission San Fernando Rey de Espana", group: "Culture", note: "The 1797 mission and gardens nearby.", lat: 34.27309, lng: -118.46164 },
    ],
    schoolZips: ["91340"],
    zonedSchools: [
      "San Fernando Elementary",
      "San Fernando Middle",
      "San Fernando Senior High",
    ],
    narrative: [
      "San Fernando offers a strong sense of community rooted in culture, tradition, and neighborhood identity within the northern San Fernando Valley.",
      "Known for its local businesses, established residential streets, and family oriented atmosphere, the area provides a more grounded and approachable lifestyle while remaining connected to greater Los Angeles. Residents appreciate the neighborhood's authenticity, accessibility, and long standing community character.",
      "For buyers seeking value, convenience, and a true neighborhood feel, San Fernando offers a unique opportunity within Los Angeles County.",
    ],
    listingsHref: "/properties",
  },

  "santa-monica": {
    schoolZips: ["90401", "90402", "90403", "90404", "90405"],
    zonedSchools: [
      "Roosevelt Elementary",
      "Lincoln Middle",
      "Santa Monica High",
    ],
    dining: [
      { name: "Rustic Canyon", group: "Night Out", note: "Wine bar and market-driven cooking, a local benchmark.", lat: 34.04125, lng: -118.51826 },
      { name: "Cassia", group: "Night Out", note: "Southeast Asian brasserie, a destination on 7th.", lat: 34.01945, lng: -118.49361 },
      { name: "Birdie G's", group: "Night Out", note: "Jeremy Fox's nostalgic Americana in the Bergamot area.", lat: 34.0271, lng: -118.46865 },
      { name: "The Lobster", group: "Night Out", note: "Seafood with a pier-side view beside the carousel.", lat: 34.01106, lng: -118.495 },
      { name: "Father's Office", group: "Local Favorites", note: "The famed burger and craft beer, no substitutions.", lat: 34.02938, lng: -118.49844 },
      { name: "Santa Monica Seafood", group: "Local Favorites", note: "Market and cafe for the day's catch.", lat: 34.02369, lng: -118.49233 },
      { name: "Bay Cities Italian Deli", group: "Local Favorites", note: "The Godmother sandwich, a Santa Monica rite.", lat: 34.01798, lng: -118.4892 },
      { name: "Huckleberry", group: "Brunch & Casual", note: "Bakery and cafe, a Wilshire breakfast staple.", lat: 34.02387, lng: -118.49206 },
      { name: "Blue Plate Oysterette", group: "Brunch & Casual", note: "Ocean Avenue seafood and oysters.", lat: 34.01447, lng: -118.49821 },
      { name: "Tacos Por Favor", group: "Hidden Gems", note: "Cash-only taqueria locals swear by.", lat: 34.01969, lng: -118.4802 },
    ],
    attractions: [
      { name: "Santa Monica Pier", group: "Landmarks", note: "The iconic pier and Pacific Park Ferris wheel.", lat: 34.00828, lng: -118.49876 },
      { name: "Third Street Promenade", group: "Landmarks", note: "The open-air shopping and street-performer strip.", lat: 34.0164, lng: -118.49689 },
      { name: "Palisades Park", group: "Outdoors", note: "Bluff-top park with ocean views along Ocean Avenue.", lat: 34.02302, lng: -118.50946 },
      { name: "Santa Monica State Beach", group: "Outdoors", note: "Wide sand and the start of the beach bike path.", lat: 34.0129, lng: -118.50172 },
      { name: "Bergamot Station", group: "Culture", note: "Gallery complex in a former rail-yard.", lat: 34.02803, lng: -118.46826 },
    ],
    narrative: [
      "Santa Monica combines coastal living with urban sophistication, offering one of the most desirable lifestyles in Southern California.",
      "Known for its iconic beaches, upscale shopping, and vibrant dining scene, Santa Monica attracts residents seeking a balance of relaxation and connectivity. From oceanfront bike paths and luxury residences to walkable streets and wellness focused living, the neighborhood embodies the best of the California coastal lifestyle.",
      "For buyers looking for beachside luxury with city convenience, Santa Monica continues to set the standard on the Westside.",
    ],
    listingsHref: "/properties",
  },

  "sherman-oaks": {
    schoolZips: ["91403", "91423"],
    // The zoned middle is Louis Armstrong Middle (the former Millikan Middle,
    // since renamed; it is the affiliated charter now stored under that name in
    // 91423). It sits inside Sherman Oaks, so it renders with a Zoned pill.
    zonedSchools: [
      "Sherman Oaks Elementary Charter",
      "Louis Armstrong Middle",
      "Ulysses S. Grant Senior High",
    ],
    dining: [
      { name: "Mistral", group: "Night Out", note: "French bistro that has anchored Ventura Boulevard for years.", lat: 34.14697, lng: -118.42575 },
      { name: "Petit Trois le Valley", group: "Night Out", note: "Ludo Lefebvre's bistro, the Valley sibling of the Hollywood original.", lat: 34.1483, lng: -118.4315 },
      { name: "Cafe Bizou", group: "Night Out", note: "Approachable French, a longtime Valley standby.", lat: 34.14892, lng: -118.43796 },
      { name: "The Local Peasant", group: "Night Out", note: "Gastropub with a deep beer list and a busy patio.", lat: 34.14914, lng: -118.4392 },
      { name: "Sweet Butter Kitchen", group: "Brunch & Casual", note: "Market cafe known for breakfast and weekend lunch.", lat: 34.14826, lng: -118.43395 },
      { name: "Granville", group: "Brunch & Casual", note: "Californian comfort food, reliable for any meal.", lat: 34.1431, lng: -118.40285 },
      { name: "Hugo's Tacos", group: "Local Favorites", note: "Casual taqueria with a loyal neighborhood following.", lat: 34.15732, lng: -118.41399 },
      { name: "Augustine Wine Bar", group: "Hidden Gems", note: "Intimate wine bar with a serious, eclectic list.", lat: 34.14707, lng: -118.42686 },
    ],
    attractions: [
      { name: "Sherman Oaks Castle Park", group: "Outdoors", note: "Mini-golf and batting cages, a family institution.", lat: 34.16213, lng: -118.46835 },
      { name: "Sherman Oaks Recreation Center", group: "Outdoors", note: "Neighborhood park with a pool, tennis, and ball fields.", lat: 34.16002, lng: -118.44202 },
      { name: "Sherman Oaks Galleria", group: "Landmarks", note: "The dining-and-shopping complex made famous on film.", lat: 34.15493, lng: -118.46655 },
      { name: "Westfield Fashion Square", group: "Landmarks", note: "Indoor mall just off Ventura Boulevard.", lat: 34.15697, lng: -118.43741 },
      { name: "Ventura Boulevard", group: "Landmarks", note: "The Valley's restaurant-and-shopping spine.", lat: 34.15054, lng: -118.44631 },
    ],
    narrative: [
      "Sherman Oaks offers a sophisticated Valley lifestyle defined by spacious homes, tree lined streets, and convenient access to both the Westside and central Los Angeles.",
      "Centered around Ventura Boulevard's popular restaurants, boutiques, and cafés, the neighborhood blends suburban comfort with urban accessibility. Residents enjoy a relaxed atmosphere while remaining closely connected to Studio City, Beverly Hills, and nearby business districts.",
      "For buyers seeking comfort, convenience, and long term desirability, Sherman Oaks remains one of the Valley's most sought after communities.",
    ],
    listingsHref: "/properties",
  },

  "studio-city": {
    schoolZips: ["91604", "91602"],
    zonedSchools: [
      "Carpenter Community Charter",
      "Walter Reed Middle",
      "North Hollywood Senior High",
    ],
    // Schools in the shared 91602 ZIP that belong to neighbors, not Studio City,
    // plus the Oakwood Elementary (K-6) record, Oakwood is a two-campus K-12
    // school whose K-6 record alone is misleading, so both campuses are excluded
    // (the 7-12 "Oakwood Secondary" sits in 91601, already outside these ZIPs).
    // (Berenece Carlson Home Hospital is removed globally by isNonTraditionalSchool.)
    // Rio Vista Elementary (91602) sits on the Toluca Lake seam; its attendance
    // zone doesn't serve Studio City, so it's excluded here (only).
    excludeSchools: ["St. Charles Borromeo", "M R M Academy", "Oakwood Elementary", "Rio Vista Elementary"],
    dining: [
      { name: "Daichan", group: "Local Favorites", note: "Japanese comfort food the Valley keeps coming back to.", lat: 34.14019, lng: -118.37573 },
      { name: "Easy Street Burgers", group: "Local Favorites", note: "The smash burger with a line that proves it.", lat: 34.14529, lng: -118.36306 },
      { name: "UOVO", group: "Local Favorites", note: "Fresh pasta, polished but unfussy.", lat: 34.14535, lng: -118.41274 },
      { name: "Firefly", group: "Night Out", note: "Garden-room dinners for the nights that matter.", lat: 34.14134, lng: -118.38845 },
      { name: "Verse", group: "Night Out", note: "Seafood, steaks, and live jazz in an intimate room.", lat: 34.14629, lng: -118.36317 },
      { name: "Black Market Liquor Bar", group: "Night Out", note: "Creative small plates, lively late.", lat: 34.14309, lng: -118.39131 },
      { name: "The Front Yard", group: "Brunch & Casual", note: "The Valley's patio brunch of record.", lat: 34.14537, lng: -118.36978 },
      { name: "Granville", group: "Brunch & Casual", note: "The reliable healthy-lunch standby.", lat: 34.14310, lng: -118.40285 },
      { name: "Oy Bar", group: "Hidden Gems", note: "Elevated cooking in a room locals keep quiet about.", lat: 34.15014, lng: -118.40473 },
      { name: "Sushi Note", group: "Hidden Gems", note: "Omakase-level fish with sommelier pairings.", lat: 34.14359, lng: -118.39527 },
    ],
    attractions: [
      { name: "Fryman Canyon", group: "Outdoors", note: "The trailhead locals start their weekends on.", lat: 34.13163, lng: -118.40200 },
      { name: "Wilacre Park", group: "Outdoors", note: "Canyon loop with skyline views.", lat: 34.13375, lng: -118.39292 },
      { name: "Studio City Farmers Market", group: "Culture", note: "The Sunday ritual on Ventura Place.", lat: 34.14434, lng: -118.39480 },
      { name: "CBS Radford Studios", group: "Landmarks", note: "The industry anchor since 1928.", lat: 34.14460, lng: -118.39235 },
      { name: "Ventura Boulevard", group: "Landmarks", note: "Sushi row to neighborhood institutions, end to end.", lat: 34.14285, lng: -118.39125 },
    ],
    narrative: [
      "Studio City blends hillside privacy, upscale living, and creative energy in one of the San Fernando Valley's most desirable neighborhoods.",
      "Known for its charming residential streets, trendy dining scene, and close ties to the entertainment industry, Studio City offers a lifestyle that feels both connected and relaxed. Residents enjoy easy access to major studios, scenic hiking trails, boutique shopping, and some of the Valley's most popular restaurants and cafés.",
      "For buyers seeking character, convenience, and a strong sense of neighborhood identity, Studio City continues to stand out.",
    ],
    listingsHref: "/properties",
  },

  "toluca-lake": {
    schoolZips: ["91602"],
    zonedSchools: [
      "Toluca Lake Elementary",
      "Walter Reed Middle",
      "North Hollywood Senior High",
    ],
    dining: [
      { name: "Patys Restaurant", group: "Brunch & Casual", note: "Classic diner, a Toluca Lake institution.", lat: 34.15243, lng: -118.34964 },
      { name: "Prosecco Trattoria", group: "Night Out", note: "Intimate northern Italian on Riverside Drive.", lat: 34.15199, lng: -118.35226 },
      { name: "Forman's Whiskey Tavern", group: "Night Out", note: "Neighborhood tavern with a long whiskey list.", lat: 34.1524, lng: -118.35233 },
      { name: "Bob's Big Boy", group: "Local Favorites", note: "The original 1949 drive-in, a short hop into Burbank.", lat: 34.15248, lng: -118.3461 },
    ],
    attractions: [
      { name: "Lakeside Golf Club", group: "Landmarks", note: "The private club the neighborhood grew up around.", lat: 34.14406, lng: -118.35131 },
      { name: "Toluca Lake Village", group: "Landmarks", note: "The walkable Riverside Drive shopping stretch.", lat: 34.14856, lng: -118.34967 },
      { name: "Warner Bros. Studios", group: "Landmarks", note: "The studio lot bordering the neighborhood.", lat: 34.15222, lng: -118.36147 },
      { name: "Griffith Park", group: "Outdoors", note: "The vast park and trails just across the river." },
    ],
    narrative: [
      "Toluca Lake is known for its quiet residential charm, timeless homes, and close proximity to major entertainment studios.",
      "With tree lined streets, a strong sense of privacy, and a more understated atmosphere, the neighborhood attracts residents seeking comfort and exclusivity without sacrificing accessibility. Local cafés, boutique shops, and nearby Studio City and Burbank add to the area's appeal.",
      "For buyers seeking classic Los Angeles character with a more intimate neighborhood feel, Toluca Lake remains a hidden gem within the city.",
    ],
    listingsHref: "/properties",
  },

  "van-nuys": {
    // Thin by design: only Dr. Hogly Wogly's cleared the confidence bar (see
    // REPORT note).
    dining: [
      { name: "Dr. Hogly Wogly's Tyler Texas BBQ", group: "Local Favorites", note: "The legendary Valley barbecue.", lat: 34.21897, lng: -118.46651 },
    ],
    attractions: [
      { name: "Lake Balboa", group: "Outdoors", note: "The lake and cherry-blossom loop at Anthony Beilenson Park.", lat: 34.20118, lng: -118.50112 },
      { name: "Sepulveda Basin Recreation Area", group: "Outdoors", note: "Trails and the wildlife reserve.", lat: 34.18293, lng: -118.47700 },
      { name: "The Japanese Garden (SuihoEn)", group: "Culture", note: "The serene garden at the Tillman plant.", lat: 34.18293, lng: -118.48081 },
    ],
    schoolZips: ["91401", "91405", "91406", "91411"],
    zonedSchools: [
      "Van Nuys Elementary",
      "Van Nuys Middle",
      "Van Nuys Senior High",
    ],
    narrative: [
      "Van Nuys offers central Valley accessibility with a diverse mix of residential neighborhoods, local businesses, and growing development.",
      "Known for its convenient location and strong community foundation, Van Nuys continues to evolve while remaining one of the most connected areas in the San Fernando Valley. Residents benefit from easy freeway access, nearby shopping and dining, and close proximity to Sherman Oaks, Studio City, and Encino.",
      "For buyers seeking accessibility, value, and long term potential, Van Nuys continues to present new opportunities within Los Angeles.",
    ],
    listingsHref: "/properties",
  },

  venice: {
    dining: [
      { name: "Gjelina", group: "Night Out", note: "The Abbot Kinney benchmark.", lat: 33.99409, lng: -118.45273 },
      { name: "Gjusta", group: "Local Favorites", note: "The cult bakery and deli off Rose.", lat: 33.99521, lng: -118.47448 },
      { name: "Felix Trattoria", group: "Night Out", note: "Evan Funke's pasta on Abbot Kinney.", lat: 33.99224, lng: -118.47187 },
      { name: "The Butcher's Daughter", group: "Brunch & Casual", note: "The plant-forward corner cafe.", lat: 33.99166, lng: -118.46921 },
      { name: "Hama Sushi", group: "Hidden Gems", note: "The longtime Venice sushi bar.", lat: 33.98859, lng: -118.47076 },
    ],
    attractions: [
      { name: "Venice Beach Boardwalk", group: "Outdoors", note: "The carnival of the Ocean Front Walk.", lat: 33.99093, lng: -118.47744 },
      { name: "Venice Canals", group: "Outdoors", note: "The historic canal footpaths.", lat: 33.98346, lng: -118.46669 },
      { name: "Abbot Kinney Boulevard", group: "Landmarks", note: "The boutique-and-restaurant street.", lat: 33.98904, lng: -118.46245 },
      { name: "Muscle Beach Venice", group: "Outdoors", note: "The famous outdoor gym.", lat: 33.98537, lng: -118.47252 },
    ],
    // 90066 (Mar Vista) was a workaround so the zoned Venice Senior High and
    // Mark Twain Middle would render; they now render via zonedSchools directly,
    // so 90066 is removed to stop pulling in the whole Mar Vista school set.
    schoolZips: ["90291", "90292"],
    zonedSchools: [
      "Westminster Avenue Elementary",
      "Mark Twain Middle",
      "Venice Senior High",
    ],
    narrative: [
      "Venice is where luxury coastal living meets creative culture, delivering one of Los Angeles' most vibrant and design forward lifestyles.",
      "Known for its iconic beachfront, modern architectural homes, and energetic atmosphere, Venice attracts residents seeking individuality, walkability, and coastal convenience. From Abbot Kinney's acclaimed boutiques and restaurants to the canals and oceanfront paths, the neighborhood offers a uniquely inspired way of life.",
      "For buyers seeking creativity, culture, and beachside living, Venice remains one of Southern California's most recognizable communities.",
    ],
    listingsHref: "/properties",
  },

  "west-hollywood": {
    schoolZips: ["90069", "90046", "90048"],
    zonedSchools: [
      "West Hollywood Elementary",
      "Hubert Howe Bancroft Middle",
      "Fairfax Senior High",
    ],
    dining: [
      { name: "Catch LA", group: "Night Out", note: "Rooftop seafood and scene above Melrose.", lat: 34.08145, lng: -118.38368 },
      { name: "Craig's", group: "Night Out", note: "Celebrity-favorite American on Melrose.", lat: 34.08062, lng: -118.38647 },
      { name: "Cecconi's", group: "Night Out", note: "Italian, a Melrose-Robertson fixture.", lat: 34.08051, lng: -118.38504 },
      { name: "Dan Tana's", group: "Night Out", note: "The classic red-sauce Italian beside the Troubadour.", lat: 34.08178, lng: -118.38911 },
      { name: "Gracias Madre", group: "Night Out", note: "Plant-based Mexican with a buzzy patio.", lat: 34.08102, lng: -118.38697 },
      { name: "Norah", group: "Night Out", note: "Stylish New American on Melrose.", lat: 34.09088, lng: -118.36975 },
      { name: "Joan's on Third", group: "Brunch & Casual", note: "Cafe and market beloved for lunch.", lat: 34.07264, lng: -118.37183 },
      { name: "Toast Bakery Cafe", group: "Brunch & Casual", note: "Third Street brunch standby.", lat: 34.07268, lng: -118.36884 },
      { name: "Carney's", group: "Local Favorites", note: "Hot dogs and burgers served from a train car on Sunset.", lat: 34.09593, lng: -118.3719 },
      { name: "Employees Only", group: "Hidden Gems", note: "Cocktail bar with a late kitchen.", lat: 34.09096, lng: -118.36321 },
    ],
    attractions: [
      { name: "Sunset Strip", group: "Landmarks", note: "The legendary stretch of clubs and billboards.", lat: 34.09129, lng: -118.37943 },
      { name: "Pacific Design Center", group: "Culture", note: "The blue-and-green design landmark.", lat: 34.08221, lng: -118.38235 },
      { name: "The Comedy Store", group: "Culture", note: "The storied Sunset Boulevard stand-up club.", lat: 34.09515, lng: -118.37389 },
      { name: "Plummer Park", group: "Outdoors", note: "Neighborhood park with courts and community space.", lat: 34.09262, lng: -118.3514 },
      { name: "Santa Monica Boulevard", group: "Landmarks", note: "The heart of WeHo nightlife and Pride.", lat: 34.09074, lng: -118.36595 },
    ],
    narrative: [
      "West Hollywood blends luxury living, world class dining, and iconic nightlife in one of Los Angeles' most vibrant and trend setting neighborhoods.",
      "From the Sunset Strip to designer boutiques and acclaimed restaurants, West Hollywood offers a lifestyle centered around creativity, entertainment, and elevated city living. Residents enjoy walkable streets, contemporary residences, and immediate access to Beverly Hills, Hollywood, and central Los Angeles.",
      "For buyers seeking energy, style, and modern sophistication, West Hollywood continues to define luxury urban living in Los Angeles.",
    ],
    listingsHref: "/properties",
  },

  westwood: {
    dining: [
      { name: "Diddy Riese", group: "Local Favorites", note: "The dollar ice-cream-cookie-sandwich line in the Village.", lat: 34.06306, lng: -118.44686 },
      { name: "Lamonica's NY Pizza", group: "Local Favorites", note: "The Village's New York slice.", lat: 34.06090, lng: -118.44684 },
    ],
    attractions: [
      { name: "Hammer Museum", group: "Culture", note: "The contemporary art museum at the Village's edge.", lat: 34.05912, lng: -118.44367 },
      { name: "UCLA (Royce Hall)", group: "Culture", note: "The historic campus quad.", lat: 34.07286, lng: -118.44218 },
      { name: "Fox Village Theatre", group: "Landmarks", note: "The 1931 art-deco movie palace and tower.", lat: 34.06268, lng: -118.44725 },
      { name: "Fowler Museum", group: "Culture", note: "UCLA's museum of world cultures.", lat: 34.07296, lng: -118.44309 },
    ],
    schoolZips: ["90024"],
    zonedSchools: [
      "Fairburn Avenue Elementary",
      "Warner Avenue Elementary",
      "Emerson Community Charter",
      // The zoned comprehensive high school, in West LA (90025), so it renders
      // with a Nearby pill. Exact stored name resolved via ILIKE.
      "University High School Charter",
    ],
    narrative: [
      "Westwood combines classic Los Angeles charm with academic prestige and modern Westside convenience.",
      "Home to UCLA, luxury residential towers, and a vibrant cultural scene, the neighborhood offers a dynamic lifestyle that balances sophistication with accessibility. Residents enjoy upscale dining, theaters, museums, and close proximity to Beverly Hills, Century City, and Santa Monica.",
      "For buyers seeking an established Westside community with strong long term appeal, Westwood continues to attract residents across every stage of life.",
    ],
    listingsHref: "/properties",
  },

  "woodland-hills": {
    dining: [
      { name: "Maria's Italian Kitchen", group: "Local Favorites", note: "The Valley Italian original.", lat: 34.15717, lng: -118.63420 },
    ],
    attractions: [
      { name: "Westfield Topanga & The Village", group: "Landmarks", note: "The major shopping-and-dining complex.", lat: 34.18573, lng: -118.60308 },
      { name: "Warner Center Park", group: "Outdoors", note: "The concert-lawn park in the business district.", lat: 34.17556, lng: -118.60548 },
      { name: "Serrania Park", group: "Outdoors", note: "The neighborhood hillside trailhead.", lat: 34.15702, lng: -118.58629 },
    ],
    schoolZips: ["91364", "91367"],
    zonedSchools: [
      "Serrania Avenue Charter for Enriched Studies",
      "George Ellery Hale Charter Academy",
      "El Camino Real Charter High",
    ],
    narrative: [
      "Woodland Hills offers spacious homes, scenic hillside surroundings, and a relaxed suburban atmosphere within the western San Fernando Valley.",
      "Known for its balance of privacy, convenience, and outdoor living, the neighborhood attracts residents seeking a quieter lifestyle without sacrificing accessibility. Residents enjoy nearby hiking trails, upscale shopping at Westfield Topanga, and convenient access to both Calabasas and Malibu.",
      "For buyers looking for comfort, space, and a more laid back Southern California lifestyle, Woodland Hills continues to stand out as one of the Valley's most desirable communities.",
    ],
    listingsHref: "/properties",
  },
};

// Fallback for any origin without a narrative entry. Should never fire if this
// file stays in sync with origins.ts, but defensive coding avoids broken layouts.
export const NEIGHBORHOOD_FALLBACK: Neighborhood = {
  narrative: [
    "A distinctive Los Angeles neighborhood with its own character, rhythm, and sense of place.",
    "Each Southern California community offers its own balance of lifestyle, convenience, and long term value, and the right fit depends on how you want to live.",
    "Let us help you find the neighborhood that aligns with the way you live, work, and move through Los Angeles.",
  ],
  listingsHref: "/properties",
};
