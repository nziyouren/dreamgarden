export const DREAM_GARDEN_PACKAGE_ID = "0xf4737932367c6f9bc52268e0db605c7db2fbe60c9390444649cc9d269c0299b8"; // Real published address
export const DREAM_GARDEN_MODULE = "seed";

export const USDC_TYPE = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
export const BTC_USD_TYPE = "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";

// Seed Status Constants
export const SEED_STATUS = {
    CREATED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    ABANDONED: 4,
} as const;
export const LP_TOKEN_TYPE = BTC_USD_TYPE; // Default yield-bearing token

// Seed Type Constants
export const SEED_TYPES = {
    TOY: { id: "toy", icon: "smart_toy", label: "Toy" },
    FOOD: { id: "food", icon: "restaurant", label: "Food" },
    TRIP: { id: "trip", icon: "flight", label: "Trip" },
    CLOTHES: { id: "clothes", icon: "checkroom", label: "Clothes" },
} as const;

export const SEED_TYPE_LIST = Object.values(SEED_TYPES);

export const TRANSACTION_STATUS_AUTO_CLOSE_DELAY = 8000; // 8 seconds
