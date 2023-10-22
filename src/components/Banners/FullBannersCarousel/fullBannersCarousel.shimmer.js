import React from 'react';
import { shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './fullBannersCarousel.module.css';

/**
 * Carousel component for banners
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef FullBannersCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a banner image
 */
const FullBannersCarouselShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <div className={classes.carouselContainer}>
                <Image
                    alt={'...'}
                    classes={{
                        image: classes.currentBanner_placeholder,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </div>
        </div>
    );
};

/**
 * Props for {@link FullBannersCarouselShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * FullBannersCarouselShimmer component
 * @property {string} classes.carouselContainer classes for carousel container
 * @property {string} classes.currentBanner classes for visible image
 * @property {string} classes.currentBanner_placeholder classes for placeholder image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.nextButton classes for next button
 * @property {string} classes.previousButton classes for previous button
 * @property {string} classes.root classes for root container
 */
FullBannersCarouselShimmer.propTypes = {
    classes: shape({
        carouselContainer: string,
        currentBanner: string,
        currentBanner_placeholder: string,
        imageContainer: string,
        nextButton: string,
        previousButton: string,
        root: string
    })
};
FullBannersCarouselShimmer.defaultProps = {
    classes: {}
};

export default FullBannersCarouselShimmer;
