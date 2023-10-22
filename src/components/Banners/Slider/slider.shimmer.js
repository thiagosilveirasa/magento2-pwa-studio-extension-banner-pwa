import React from 'react';
import { bool, shape, string } from 'prop-types';
import defaultClasses from './slider.shimmer.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

/**
 * Slider Shimmer component.
 *
 * @typedef SliderShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Slider Shimmer.
 */
const SliderShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { showDots } = props;
    const dotsContainer = showDots ? <div className="slick-dots" /> : null;

    return (
        <Shimmer
            aria-live="polite"
            aria-busy="true"
            classes={{
                root_rectangle: [
                    classes.root,
                    classes.shimmerRoot
                ].join(' ')
            }}
        >
            <div className="slick-slider">
                <div className="slick-list" />
                {dotsContainer}
            </div>
        </Shimmer>
    );
};

/**
 * Props for {@link SliderShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Slider
 * @property {String} classes.root CSS class for the slider root element
 * @property {String} classes.shimmerRoot CSS class for the slider shimmer
 * root_rectangle element
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 */
SliderShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string
    }),
    showDots: bool,
};

export default SliderShimmer;
