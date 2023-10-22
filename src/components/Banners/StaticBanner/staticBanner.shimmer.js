import React from 'react';
import { shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './staticBanner.module.css';

const StaticBannerShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Image
                alt={'...'}
                classes={{
                    image: classes.currentBanner_placeholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        </div>
    );
};

/**
 * Props for {@link StaticBannerShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * StaticBannerShimmer component
 * @property {string} classes.banner classes for visible image
 * @property {string} classes.banner_placeholder classes for placeholder image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.root classes for root container
 */
StaticBannerShimmer.propTypes = {
    classes: shape({
        banner: string,
        banner_placeholder: string,
        imageContainer: string,
        root: string
    })
};

export default StaticBannerShimmer;
