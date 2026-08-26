const REF = "?ref=olive-ears-obey";
const BASE = "https://freename.io/discover/";

export const CATEGORIES = [
  {
    id: "01",
    title: "Money Transfer",
    kicker: "The rails of digital value",
    manifesto:
      "Every day, billions move across borders. Whoever owns the name owns the toll booth. These TLDs are the vocabulary of remittance itself — claim the language before the market does.",
    chain: "Polygon",
    domains: [
      {
        name: ".transfermoney",
        slug: "transfermoney",
        pitch: "The ultimate generic for global remittance. Two words, zero ambiguity, infinite market.",
      },
      {
        name: ".transfercoin",
        slug: "transfercoin",
        pitch: "Bridge fiat and crypto seamlessly. Built for wallets, ramps and payment protocols.",
      },
      {
        name: ".cointransfer",
        slug: "cointransfer",
        pitch: "The standard for token exchange. A name any DEX or swap engine would kill for.",
      },
      {
        name: ".transfercash",
        slug: "transfercash",
        pitch: "Instant liquidity, instantly recognized. Say it once and the product explains itself.",
      },
      {
        name: ".cashtransfer",
        slug: "cashtransfer",
        pitch: "The definitive Web3 payment gateway name. Cash is king — this is its crown.",
      },
    ],
  },
  {
    id: "02",
    title: "AI & Technology",
    kicker: "The intelligence economy",
    manifesto:
      "AI is not a feature, it is the new industrial revolution. The companies that win it will be named for it. These domains put you on the right side of history — on Solana speed.",
    chain: "Solana",
    domains: [
      {
        name: ".ai-tools",
        slug: "ai-tools",
        pitch: "The hub for next-gen AI utilities. Category-defining, hyphenated for exact-match search.",
      },
      {
        name: ".aiwebtools",
        slug: "aiwebtools",
        pitch: "Your brand's home for AI-driven web apps. The toolbox of the new internet.",
      },
      {
        name: ".aimainframe",
        slug: "aimainframe",
        pitch: "The core infrastructure for AI processing. Heavy iron naming for heavy compute.",
      },
      {
        name: ".aitoolscompany",
        slug: "aitoolscompany",
        pitch: "Establish instant authority in the AI corporate space. It reads like a Fortune 500 ticker.",
      },
    ],
  },
  {
    id: "03",
    title: "Robotics & Automation",
    kicker: "The machine marketplace",
    manifesto:
      "Robots are leaving the factory floor and entering every home. When the mass market arrives, it will search for one thing: a place to buy. Own the storefront before the shelves are built.",
    chain: "Polygon",
    domains: [
      {
        name: ".robotsales",
        slug: "robotsales",
        pitch: "The premier marketplace for automation hardware. B2B, B2C, humanoid — one TLD sells it all.",
      },
      {
        name: ".robotshop",
        slug: "robotshop",
        pitch: "The consumer storefront for personal robotics. Friendly, memorable, checkout-ready.",
      },
      {
        name: ".robotstore",
        slug: "robotstore",
        pitch: "The go-to retail hub for androids and parts. The mall anchor of the machine age.",
      },
    ],
  },
  {
    id: "04",
    title: "Global & World",
    kicker: "The planetary namespace",
    manifesto:
      "Some names are bigger than a business. They are movements, markets, and ambitions at world scale. Three TLDs for those who think in continents, not zip codes.",
    chain: "Mixed",
    domains: [
      {
        name: ".worldpeace",
        slug: "worldpeace",
        pitch: "Unite communities with a purpose-driven TLD. The most mission-aligned name on-chain.",
        chain: "Polygon",
      },
      {
        name: ".worldtrade",
        slug: "worldtrade",
        pitch: "The foundation for global decentralized commerce. Ports, tariffs, tokens — all welcome.",
        chain: "Solana",
      },
      {
        name: ".worldtrader",
        slug: "worldtrader",
        pitch: "For the elite international crypto merchant. Verified live and trading today.",
        chain: "Polygon",
        verified: true,
      },
    ],
  },
];

export const buyUrl = (slug) => `${BASE}${slug}${REF}`;
