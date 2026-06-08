# Emergency Contacts - verbatim Wix extraction

Source: live https://www.laurelwoodestates.com/emergency-contacts
fetched 2026-06-06. Contact data is byte-for-byte from the Wix page.
DO NOT reword anything; preserve phone formats exactly as shown
(inconsistent formats are on the review list, not to be normalized
silently). Accented characters (Doña Pegita) preserved.

KNOWN GAP: every contact card on Wix has a "View Website" link; the
URLs were not captured in extraction. See build prompt for handling.

---

## PAGE TITLE
LAURELWOOD CONTACT LIST

## IMMEDIATE EMERGENCY
CALL 911

---

## CATEGORY: Emergency & Public Safety

### Fire Station 108
Sub: Mulholland and Coldwater
Phone: 818-756-8608
Address: 12520 Mulholland Drive, Los Angeles, CA 90210

### Fire Station 97
Sub: Mulholland and Doña Pegita
Phone: (818) 756-8697
Address: 8021 Mulholland Dr, Los Angeles, CA 90046

### Fire Captain
Sub: Brush Clearance Unit
Phone: (818) 778-4954
Email: bryan.nassour@lacity.org
Address: 6262 Van Nuys #451, Van Nuys, CA 91401

### Fire Inspector
Sub: Brush Clearance Unit #184
Phone: (213) 932-1874
Email: shane.weaver@lacity.org
Address: 6262 Van Nuys Blvd. #451, Van Nuys, CA 91401

### Fire Station 78
Sub: Whitsett and Ventura
Phone: (818) 756-8678
Address: 4041 Whitsett Ave., Studio City, CA 91604

### Senior Lead Officer
Sub: Shawn Smith
Phone: (818) 754-8358
Email: 33751@lapd.online
Address: 11640 Burbank Blvd., North Hollywood, CA 91601

### North Hollywood Police
Phone: (818) 754-8358
Email: 33751@lapd.online
Address: 11640 Burbank Blvd., North Hollywood, CA 91601

---

## CATEGORY: Utilities & Services

### Vector Control
Sub: Mosquitos
Phone: 818-364-9589
Address: 16320 Foothill Blvd., Sylmar, CA 91342

### Dept. of Water & Power
Phone: (800) 342-5397
Address: 6550 Van Nuys Boulevard, Van Nuys, CA 91401

### Bureau of Street Services
Phone: (213)978-0333
Email: bss.boss@lacity.org
Address: 1149 S. Broadway, 4th Floor, Los Angeles, CA 90015

### Street Lighting Bureau
Phone: (213) 847-1300
Email: bsl.streetlighting@lacity.org
Address: 1149 S Broadway #200, Los Angeles, CA 90015

### Dept. of Animal Services
Phone: (213) 482-9558
Email: annette.ramirez@lacity.org
Address: 221 N. Figueroa Street, 6 th floor, Los Angeles, CA 90012
(NOTE: "6 th floor" spacing is the Wix original; preserve, review
list)

### 311 Call Center
Phone: 311 or 213-473-3231
Email: 311@lacity.org
Address: 200 N. Main Street, Los Angeles, CA 90012

---

## CATEGORY: Parks and Recreation

### Fryman Canyon Park
Phone: (323) 644-6661 or (323)-221-9944
Email: info@mrca.ca.gov
Address: 8401 Mulholland Dr., Studio City, CA 91604

### Wilacre Park
Phone: (818) 766-8445 or (818) 756-8189
Address: 12601 Mulholland Dr., Studio City, CA 91604

---

## CATEGORY: Local Neighborhood Associations

### Studio City Residents Assoc.
Phone: (818) 509-0230
Email: scraboard@studiocityresidents.org
Address: 12069 Ventura Place, Suite H, Studio City, CA 91604

### Studio City Neighborhood Cncl.
Sub: Board Meetings: 3rd Wed. at 7 p.m.
Phone: (818) 655-5400
Address: 4024 Radford Ave. Editorial Bldg. 2, Studio City, CA 91604

---

## REVIEW LIST ITEMS (do not fix silently)
- "(213)978-0333" missing space after area code (Wix original)
- "(323)-221-9944" odd hyphen after area code (Wix original)
- "6 th floor" spacing (Wix original)
- Senior Lead Officer and North Hollywood Police share identical
  phone/email (likely intentional; the SLO works from that station)
- Fire Station 108 zip 90210 on Mulholland (plausible; verify later)
- View Website URLs missing (extraction gap)
