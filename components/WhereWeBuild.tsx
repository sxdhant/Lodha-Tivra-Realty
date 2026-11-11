'use client';

import { useState } from 'react';
import { useResidenceUI } from '@/components/ResidenceProvider';
import { residences } from '@/lib/residences';

// Schematic map: MG Road at the centre, distance compressed by a square root so the
// outer residences fit. Coordinates are rounded so server and client render the same values.
const CENTRE = 300;
const SCALE = 45;
const RINGS_KM = [35, 15, 5];

const round = (value: number) => Math.round(value * 10) / 10;
const radius = (km: number) => SCALE * Math.sqrt(km);
const place = (km: number, bearing: number) => {
  const angle = (bearing * Math.PI) / 180;
  return {
    x: round(CENTRE + radius(km) * Math.sin(angle)),
    y: round(CENTRE - radius(km) * Math.cos(angle)),
  };
};

const pins = residences.map((r) => ({ residence: r, ...place(r.map.km, r.map.bearing) }));
const byDistance = [...residences].sort((a, b) => a.map.km - b.map.km);

export function WhereWeBuild() {
  const { openResidence } = useResidenceUI();
  const [highlighted, setHighlighted] = useState<string | null>(null);

  return (
    <section className="where" id="where" aria-labelledby="where-title">
      <div className="wrap grid">
        <div className="where__head">
          <h2 className="where__title" id="where-title">
            Locations
          </h2>
          <p className="where__intro">
            Lodha Haven is on Hosa Road, off Sarjapur Road, to the south-east of MG Road. Lodha Elanza is further out on
            Sarjapur Road, and Lodha Azure is at Begur, on Bannerghatta Road to the south.
          </p>
        </div>

        <figure className="where__map">
          <svg className="map" viewBox="0 0 600 600" role="img" aria-labelledby="map-title map-desc">
            <title id="map-title">Schematic map of residences around Bengaluru</title>
            <desc id="map-desc">
              Each residence is placed by its direction and distance from MG Road, with rings at 5, 15 and 35
              kilometres. Distances are compressed toward the edge so the outer residences fit.
            </desc>
            <g className="map__rings">
              {RINGS_KM.map((km) => (
                <circle key={km} cx={CENTRE} cy={CENTRE} r={round(radius(km))} />
              ))}
            </g>
            <g className="map__ring-labels">
              {RINGS_KM.map((km) => (
                <text key={km} x={CENTRE} y={round(CENTRE + radius(km) - 9.6)}>
                  {km} km
                </text>
              ))}
            </g>
            <g className="map__north">
              <path d="M560 78V44M554 52l6-8 6 8" />
              <text x="560" y="96">
                N
              </text>
            </g>
            <g className="map__centre">
              <path d="M293 300h14M300 293v14" />
              <text x="312" y="320">
                MG Road
              </text>
            </g>
            {pins.map(({ residence: r, x, y }) => {
              const left = r.map.label === 'left';
              return (
                <g
                  key={r.id}
                  className={`map__pin${highlighted === r.id ? ' is-active' : ''}`}
                  onPointerEnter={() => setHighlighted(r.id)}
                  onPointerLeave={() => setHighlighted(null)}
                  onClick={() => openResidence(r.id)}
                >
                  <circle className="map__halo" cx={x} cy={y} r="13" />
                  <circle className="map__dot" cx={x} cy={y} r="5" />
                  <text x={round(left ? x - 13.5 : x + 13.5)} y={round(y + 5)} textAnchor={left ? 'end' : undefined}>
                    {r.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </figure>

        <div className="where__places">
          <ul className="where__list">
            {byDistance.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={highlighted === r.id ? 'is-active' : undefined}
                  aria-haspopup="dialog"
                  onPointerEnter={() => setHighlighted(r.id)}
                  onPointerLeave={() => setHighlighted(null)}
                  onFocus={() => setHighlighted(r.id)}
                  onBlur={() => setHighlighted(null)}
                  onClick={(event) => openResidence(r.id, event.currentTarget)}
                >
                  <span className="where__name">{r.name}</span>
                  <span className="where__area">{r.area}</span>
                  <span className="where__distance">{r.map.km}&nbsp;km</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="where__note">Straight-line distances from MG Road.</p>
        </div>
      </div>
    </section>
  );
}
