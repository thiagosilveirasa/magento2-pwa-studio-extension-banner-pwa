import React from 'react';
import attributeListConfigAggregator from "./configAggregator";
import { ListShimmer } from '../List';

export default {
    name: 'bannerpwa_list',
    configAggregator: attributeListConfigAggregator,
    component: React.lazy(() => import('../List')),
    componentShimmer: ListShimmer
}
