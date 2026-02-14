/** Theme-aligned handcart illustration. Use viewBox for scaling; wrap in a div with max-width for size. */
const PRIMARY = '#E53935';
const PRIMARY_DARK = '#C62828';
const ACCENT = '#FFD54F';
const WHITE = '#FFFFFF';

const POSTER_INNER = { x: 202, y: 270, width: 376, height: 120, rx: 8 };

export function HandcartSVG({
  className = '',
  posterImage,
}: {
  className?: string;
  /** URL of the image to show inside the poster (e.g. /poster.jpg or a full URL). */
  posterImage?: string;
}) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block h-full max-h-full w-full object-contain ${className}`}
      aria-hidden
    >
      <g id="HandcartSVG">
        {/* Handle */}
        <g id="Handle">
          <path
            d="M 120 280 L 100 260 L 100 200 Q 100 180 120 180"
            stroke={PRIMARY_DARK}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="120" cy="180" r="12" fill={ACCENT} stroke={PRIMARY_DARK} strokeWidth="3" />
        </g>

        {/* Cart Body */}
        <g id="CartBody">
          <rect x="140" y="240" width="500" height="180" rx="20" fill={PRIMARY} />
          <rect x="140" y="240" width="500" height="40" rx="20" fill={WHITE} />
          <rect x="140" y="260" width="500" height="20" fill={WHITE} />
          <rect x="160" y="380" width="460" height="20" rx="10" fill={WHITE} opacity="0.3" />
          <rect x="560" y="290" width="60" height="110" rx="12" fill={WHITE} opacity="0.2" />
        </g>

        {/* Top Board / Sign */}
        <g id="TopBoard">
          <rect
            x="160"
            y="120"
            width="460"
            height="80"
            rx="16"
            fill={ACCENT}
            stroke={PRIMARY_DARK}
            strokeWidth="4"
          />
          <rect x="180" y="135" width="420" height="50" rx="8" fill={WHITE} />
          <g transform="translate(390, 160)">
            <text
              x="0"
              y="0"
              fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
              fontSize="22"
              fontWeight="700"
              fill={PRIMARY}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Shakthi Thattuvada Set Corner
            </text>
          </g>
          <rect x="170" y="200" width="8" height="45" rx="4" fill={PRIMARY_DARK} />
          <rect x="602" y="200" width="8" height="45" rx="4" fill={PRIMARY_DARK} />
        </g>

        {/* Serial Lights */}
        <g id="SerialLights">
          <path
            d="M 180 115 Q 250 105 320 110 Q 390 115 460 110 Q 530 105 600 115"
            stroke={PRIMARY_DARK}
            strokeWidth="2"
            fill="none"
          />
          {[
            [180, 115],
            [220, 108],
            [260, 106],
            [300, 109],
            [340, 111],
            [380, 113],
            [420, 111],
            [460, 110],
            [500, 108],
            [540, 106],
            [580, 109],
            [600, 115],
          ].map(([cx, cy], i) => (
            <circle
              key={`light-${i}`}
              cx={cx}
              cy={cy}
              r="6"
              fill={i % 2 === 0 ? ACCENT : PRIMARY}
              stroke={i % 2 === 0 ? PRIMARY_DARK : ACCENT}
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Poster */}
        <defs>
          <clipPath id="handcart-poster-clip">
            <rect
              x={POSTER_INNER.x}
              y={POSTER_INNER.y}
              width={POSTER_INNER.width}
              height={POSTER_INNER.height}
              rx={POSTER_INNER.rx}
            />
          </clipPath>
        </defs>
        <g id="Poster">
          <rect
            x="190"
            y="258"
            width="400"
            height="144"
            rx="12"
            fill={WHITE}
            stroke={ACCENT}
            strokeWidth="6"
          />
          <rect
            x={POSTER_INNER.x}
            y={POSTER_INNER.y}
            width={POSTER_INNER.width}
            height={POSTER_INNER.height}
            rx={POSTER_INNER.rx}
            fill="#FFF8E1"
          />
          {posterImage && (
            <image
              href={posterImage}
              x={POSTER_INNER.x}
              y={POSTER_INNER.y}
              width={POSTER_INNER.width}
              height={POSTER_INNER.height}
              clipPath="url(#handcart-poster-clip)"
              preserveAspectRatio="xMidYMid slice"
            />
          )}
          {/* Click here button */}
          <g aria-hidden>
            <rect
              x="315"
              y="350"
              width="150"
              height="32"
              rx="16"
              fill={ACCENT}
            />
            <text
              x="390"
              y="366"
              fontFamily='"DM Sans", system-ui, sans-serif'
              fontSize="16"
              fontWeight="600"
              fill={PRIMARY}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Click Here
            </text>
          </g>
        </g>

        {/* Wheel shadows - drawn under wheels */}
        <g id="WheelShadows">
          <ellipse
            cx="250"
            cy="478"
            rx="36"
            ry="10"
            fill="black"
            opacity="0.25"
          />
          <ellipse
            cx="530"
            cy="478"
            rx="36"
            ry="10"
            fill="black"
            opacity="0.25"
          />
        </g>

        {/* Left Wheel */}
        <g id="LeftWheel" style={{ transformOrigin: '250px 440px' }}>
          <circle cx="250" cy="440" r="40" fill={PRIMARY} stroke={WHITE} strokeWidth="4" />
          <circle cx="250" cy="440" r="28" fill={WHITE} />
          <circle cx="250" cy="440" r="12" fill={PRIMARY} />
          <line x1="250" y1="412" x2="250" y2="468" stroke={PRIMARY} strokeWidth="3" />
          <line x1="222" y1="440" x2="278" y2="440" stroke={PRIMARY} strokeWidth="3" />
          <line x1="230" y1="420" x2="270" y2="460" stroke={PRIMARY} strokeWidth="3" />
          <line x1="270" y1="420" x2="230" y2="460" stroke={PRIMARY} strokeWidth="3" />
        </g>

        {/* Right Wheel */}
        <g id="RightWheel" style={{ transformOrigin: '530px 440px' }}>
          <circle cx="530" cy="440" r="40" fill={PRIMARY} stroke={WHITE} strokeWidth="4" />
          <circle cx="530" cy="440" r="28" fill={WHITE} />
          <circle cx="530" cy="440" r="12" fill={PRIMARY} />
          <line x1="530" y1="412" x2="530" y2="468" stroke={PRIMARY} strokeWidth="3" />
          <line x1="502" y1="440" x2="558" y2="440" stroke={PRIMARY} strokeWidth="3" />
          <line x1="510" y1="420" x2="550" y2="460" stroke={PRIMARY} strokeWidth="3" />
          <line x1="550" y1="420" x2="510" y2="460" stroke={PRIMARY} strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
