import React from 'react';
import bannerStaticConfigAggregator from "./configAggregator";
import { StaticShimmer } from '../Static';

export default {
    name: 'bannerpwa_static',
    configAggregator: bannerStaticConfigAggregator,
    component: React.lazy(() => import('../Static')),
    componentShimmer: StaticShimmer
}
