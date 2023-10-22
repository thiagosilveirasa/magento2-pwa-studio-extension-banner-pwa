import React from 'react';
import bannerSliderConfigAggregator from "./configAggregator";
import { SliderShimmer } from '../Slider';

export default {
    name: 'bannerpwa_slider',
    configAggregator: bannerSliderConfigAggregator,
    component: React.lazy(() => import('../Slider')),
    componentShimmer: SliderShimmer
}
