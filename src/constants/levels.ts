// Centralized level thresholds and deltas
export const SILVER_TO_GOLD = 10_000; // points from Silver start to Gold start
// GOLD_TO_DIAMOND kept for reference but compute diamondStart explicitly below
export const GOLD_TO_DIAMOND = 90_000; // points from Gold start to Diamond start (derived)
export const DIAMOND_TOP = 1_000_000; // top cap for diamond progress (optional)

export const LEVELS = {
  silverStart: 0,
  goldStart: SILVER_TO_GOLD,
  // explicit diamond start per request: 100,000
  diamondStart: 100_000,
  diamondTop: DIAMOND_TOP,
};
