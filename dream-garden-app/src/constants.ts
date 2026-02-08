export const DREAM_GARDEN_PACKAGE_ID = "0xfac5be3df28f5374ebfb7aa5032a81c91be9ebd17ec4e67a8d677878a2230dc5"; // Real published address
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
