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

export const FROM_PRICES = {
  transfermoney: 9.98,
  transfercoin: 9.98,
  cointransfer: 9.98,
  transfercash: 9.98,
  cashtransfer: 9.98,
  "ai-tools": 4.99,
  aiwebtools: 4.99,
  aimainframe: 7.49,
  aitoolscompany: 7.49,
  robotsales: 9.98,
  robotshop: 9.98,
  robotstore: 9.98,
  worldpeace: 4.99,
  worldtrade: 9.98,
  worldtrader: 7.49,
};

export const EXAMPLES = {
  transfermoney: ["mike.transfermoney", "send.transfermoney", "family.transfermoney"],
  transfercoin: ["pay.transfercoin", "swap.transfercoin", "wallet.transfercoin"],
  cointransfer: ["move.cointransfer", "dex.cointransfer", "bridge.cointransfer"],
  transfercash: ["cashout.transfercash", "atm.transfercash", "payday.transfercash"],
  cashtransfer: ["mike.cashtransfer", "remit.cashtransfer", "instant.cashtransfer"],
  "ai-tools": ["write.ai-tools", "image.ai-tools", "code.ai-tools"],
  aiwebtools: ["studio.aiwebtools", "build.aiwebtools", "launch.aiwebtools"],
  aimainframe: ["core.aimainframe", "compute.aimainframe", "node.aimainframe"],
  aitoolscompany: ["hq.aitoolscompany", "pro.aitoolscompany", "shop.aitoolscompany"],
  robotsales: ["deals.robotsales", "units.robotsales", "pro.robotsales"],
  robotshop: ["buy.robotshop", "toys.robotshop", "home.robotshop"],
  robotstore: ["parts.robotstore", "droids.robotstore", "mega.robotstore"],
  worldpeace: ["hope.worldpeace", "unite.worldpeace", "give.worldpeace"],
  worldtrade: ["export.worldtrade", "ports.worldtrade", "deals.worldtrade"],
  worldtrader: ["pro.worldtrader", "fx.worldtrader", "whale.worldtrader"],
};

export const UTILITIES = {
  transfermoney: [
    ["wallet", "Get paid in crypto to a name people can actually type"],
    ["globe", "Point it at your money-transfer website"],
    ["plug", "Plug it into your remittance app as a payment handle"],
  ],
  transfercoin: [
    ["send", "Send and receive tokens with a human-readable name"],
    ["plug", "Use it as your app's deposit address"],
    ["globe", "Attach it to your exchange or swap site"],
  ],
  cointransfer: [
    ["wallet", "Receive any coin to one simple name"],
    ["plug", "Power your DEX or bridge with a trusted handle"],
    ["tag", "Resell it later — you own it outright"],
  ],
  transfercash: [
    ["send", "Cash out crypto to a name customers remember"],
    ["store", "Brand your payment kiosk or checkout"],
    ["globe", "Link it straight to your landing page"],
  ],
  cashtransfer: [
    ["send", "Send money home to a name, not a hex code"],
    ["wallet", "Receive payments from any Web3 wallet"],
    ["plug", "Drop it into your fintech app in minutes"],
  ],
  "ai-tools": [
    ["globe", "Your AI tools hub at a self-describing address"],
    ["plug", "Plug it into your app as its public identity"],
    ["tag", "Own it forever — no renewal fees"],
  ],
  aiwebtools: [
    ["globe", "Point your SaaS landing page at it today"],
    ["store", "The natural home for an AI app store"],
    ["wallet", "Get paid for your tools to the same name"],
  ],
  aimainframe: [
    ["plug", "Name your AI infra endpoint something clients trust"],
    ["globe", "The front door to your API and docs"],
    ["wallet", "Get paid for compute to a memorable name"],
  ],
  aitoolscompany: [
    ["store", "Instant corporate credibility for your AI brand"],
    ["globe", "One address for site, wallet and identity"],
    ["tag", "A digital asset you can resell anytime"],
  ],
  robotsales: [
    ["store", "Your robot showroom on a name buyers trust"],
    ["wallet", "Take crypto payment for hardware instantly"],
    ["plug", "Connect it to your sales platform or CRM"],
  ],
  robotshop: [
    ["store", "A ready-made brand for a consumer robot shop"],
    ["globe", "Shoppers type your name — no search needed"],
    ["send", "Checkout in crypto with the same name"],
  ],
  robotstore: [
    ["store", "Retail hub for androids, parts and kits"],
    ["plug", "Plug into your existing storefront software"],
    ["tag", "Premium names appreciate — flip it later"],
  ],
  worldpeace: [
    ["send", "Collect donations to a name with a mission"],
    ["globe", "Rally your movement at one unforgettable address"],
    ["wallet", "A transparent on-chain treasury handle"],
  ],
  worldtrade: [
    ["globe", "The address for a borderless marketplace"],
    ["wallet", "Settle international invoices in crypto"],
    ["plug", "Wire it into your trade platform"],
  ],
  worldtrader: [
    ["wallet", "Your trading alias that also receives funds"],
    ["send", "Move capital worldwide in minutes"],
    ["tag", "Verified live — a name with a track record"],
  ],
};

export const CATEGORY_IMAGES = {
  "01": {
    url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    alt: "Financial trading charts glowing on dark screens",
  },
  "02": {
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    alt: "Abstract artificial intelligence render",
  },
  "03": {
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    alt: "Robotic hand reaching into light",
  },
  "04": {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    alt: "Earth at night seen from orbit",
  },
};
