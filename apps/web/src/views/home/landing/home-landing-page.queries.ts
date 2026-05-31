// GROQ queries for the home landing view live here (co-located, never inline).
export const homeHeroQuery = `
  *[_type == "home-layout-page" && language == $locale][0]{
    heroSection { title, description }
  }
`;
