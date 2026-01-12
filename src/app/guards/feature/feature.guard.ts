import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import type { Feature } from '../../../features';
import { inject } from '@angular/core';
import { FeatureService } from '../../services/feature/feature.service';

/**
 * Creates a route guard that checks if a specific feature is enabled.
 *
 * implementsFeature - The feature to check for availability
 */
export const featureGuard: (implementsFeature: Feature) => CanActivateFn =
  (implementsFeature: Feature) => async () => {
    const featureService = inject(FeatureService);
    const router = inject(Router);

    const featureEnabled =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (await featureService.ready())[implementsFeature] ?? false;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return featureEnabled || new RedirectCommand(router.parseUrl('/404'));
  };
