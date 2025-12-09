export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Adorned by Sophia',
    description: 'Luxury fashion boutique offering RTW Boubous, Palazzos, and elegant statement pieces',
    url: 'https://adornedbysophia.com',
    logo: 'https://adornedbysophia.com/logo.png',
    image: 'https://adornedbysophia.com/og-image.jpg',
    sameAs: [
      'https://www.instagram.com/adornedbysophiaa/',
      // Add other social media links as needed
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://adornedbysophia.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
