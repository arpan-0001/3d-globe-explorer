import countryInfo from "../data/countryInfo.json";

export async function getCountryInfo(name) {
  // Try exact match first
  let country = countryInfo.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  // Handle common name differences
  if (!country) {
    const aliases = {
      "United States of America": "United States",
      "Russian Federation": "Russia",
      "Czech Republic": "Czechia",
      "Republic of the Congo": "Congo",
      "Democratic Republic of the Congo": "DR Congo",
      "Ivory Coast": "Côte d'Ivoire",
      "South Korea": "Korea",
      "North Korea": "Korea",
    };

    const mappedName = aliases[name];

    if (mappedName) {
      country = countryInfo.find(
        (c) => c.name.toLowerCase() === mappedName.toLowerCase()
      );
    }
  }

  if (!country) {
    throw new Error(`Country "${name}" not found`);
  }

  return country;
}