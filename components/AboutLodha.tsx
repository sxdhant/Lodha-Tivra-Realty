import Image from 'next/image';
import { BuilderFacts, type Fact } from '@/components/BuilderFacts';

// Facts about the developer, as Lodha publishes them, as of March 2026. Sources:
// lodhagroup.com/our-story (legacy, area delivered and in the pipeline, presence) and Lodha
// Developers Limited's March 2026 corporate presentation (scale, general contracting, green
// certification, Bengaluru projects). Update them when Lodha publishes new figures.
const FACTS: Fact[] = [
  { value: 40, suffix: '+', label: 'Years in real estate' },
  { value: 112, label: 'Million sq ft delivered' },
  { value: 132, label: 'Million sq ft in the pipeline' },
  { value: 7, label: 'Projects signed in Bengaluru' },
];

export function AboutLodha() {
  return (
    <section className="builder" id="lodha" aria-labelledby="lodha-title">
      <div className="wrap grid">
        <p className="builder__eyebrow">The developer</p>
        <h2 className="builder__title" id="lodha-title">
          About Lodha
        </h2>
        {/* A still from Lodha-intro-hero.mp4 (3.8s), cropped to 4:3. Swap in an official photograph from
            Lodha's partner kit when you have one. */}
        <figure className="builder__media">
          <Image
            src="/about/lodha-entrance.jpg"
            alt="A marble entrance with tall glass doors and a chandelier beyond, between frangipani trees"
            width={960}
            height={720}
            sizes="(min-width: 64rem) 36vw, 100vw"
          />
          <figcaption>Artist’s impression.</figcaption>
        </figure>
        <div className="builder__text">
          <p className="builder__lead">
            For more than four decades, Lodha has been building homes and offices. Today it works across Mumbai, Pune,
            Bengaluru, Delhi NCR and London.
          </p>
          <p className="builder__body">
            It is amongst India’s largest housing developers, and acts as its own general contractor, with in-house
            engineering and design teams. Green building certifications cover about 60 million sq ft of its portfolio. In
            Bengaluru, Lodha has signed seven projects across the north-east and south-east of the city.
          </p>
          <a className="text-link" href="https://www.lodhagroup.com/our-story" target="_blank" rel="noopener">
            Lodha’s story, on lodhagroup.com<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
        <BuilderFacts facts={FACTS} />
        <p className="builder__note">Figures published by Lodha Developers Limited, as of March 2026.</p>
      </div>
    </section>
  );
}
