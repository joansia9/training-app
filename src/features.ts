/**
 * This file holds all of the features in development
 * of this app. The actual flags are set as env vars.
 */
export const FEATURES = [] as const;

/**
 * Generates an object of feature flags based on environment variables.
 */
export function generateFeatureFlags<F extends string>(
  features: readonly F[]
): Record<F, boolean> {
  const obj: Partial<Record<F, boolean>> = {};
  features.forEach(
    feature => (obj[feature] = process.env[feature]?.toLowerCase() === 'true')
  );
  return obj as Record<F, boolean>;
}

/**
 * Generated feature flags configuration object.
 *
 * Contains all available feature flags for the
 * application, pulled from env vars.
 */
export const FEATURE_FLAGS = generateFeatureFlags(FEATURES);

/**
 * Represents a single feature from the available features collection.
 * This is a union type of all possible feature values extracted from the FEATURES constant.
 */
export type Feature = (typeof FEATURES)[number];

/**
 * Type representing the shape of the feature flags configuration.
 */
export type FeatureFlags = typeof FEATURE_FLAGS;
