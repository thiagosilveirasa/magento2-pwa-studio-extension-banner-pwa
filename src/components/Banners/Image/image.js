import React from 'react';
import {
    func,
    instanceOf,
    number,
    oneOfType,
    shape,
    string
} from 'prop-types';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';
import { DEFAULT_WIDTH_TO_HEIGHT_RATIO } from '@magento/peregrine/lib/util/imageUtils';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './image.module.css';

/**
 * The Image component 
 *
 * @param {object}   props.classes any classes to apply to this component
 * @param {number}   props.height the intrinsic height of the image & the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {function} props.onError callback for error loading image
 * @param {function} props.onLoad callback for when image loads successfully
 * @param {string}   props.src the source of the image, ready to use in an img element
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {number}   props.ratio is the image width to height ratio. Defaults to `DEFAULT_WIDTH_TO_HEIGHT_RATIO` from `util/images.js`.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 */
const Image = props => {
    const {
        alt,
        classes: propsClasses,
        height,
        onError,
        onLoad,
        src,
        width,
        widths,
        ratio,
        ...rest
    } = props;

    const talonProps = useImage({
        onError,
        onLoad,
        width,
        widths,
        height,
        ratio
    });

    const {
        handleError,
        handleImageLoad,
        isLoaded,
        resourceHeight: talonResourceHeight
    } = talonProps;

    const classes = useStyle(defaultClasses, propsClasses);
    const containerClass = `${classes.root} ${classes.container}`;
    const isLoadedClass = isLoaded ? classes.loaded : classes.notLoaded;
    const imageClass = `${classes.image} ${isLoadedClass}`;
    const dimensionAttributes = {};
    if (typeof height !== 'undefined') {
        dimensionAttributes['--height'] = height + 'px';
    }
    if (typeof width !== 'undefined') {
        dimensionAttributes['--width'] = width + 'px';
    }

    return (
        <div className={containerClass}>
            <img
                loading="lazy"
                style={dimensionAttributes}
                {...rest}
                alt={alt}
                className={imageClass}
                height={talonResourceHeight}
                onError={handleError}
                onLoad={handleImageLoad}
                src={src}
                width={width}
            />
        </div>
    );
};

Image.propTypes = {
    alt: string.isRequired,
    classes: shape({
        container: string,
        loaded: string,
        notLoaded: string,
        root: string
    }),
    height: oneOfType([number, string]),
    onError: func,
    onLoad: func,
    src: string.isRequired,
    width: oneOfType([number, string]),
    widths: instanceOf(Map),
    ratio: number
};

Image.defaultProps = {
    ratio: DEFAULT_WIDTH_TO_HEIGHT_RATIO
};

export default Image;
