import React from 'react';
import {
    arrayOf,
    bool,
    number,
    oneOf,
    shape,
    string,
    object
} from 'prop-types';

import defaultClasses from './list.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useWindowSize } from '@magento/peregrine';
import { useMediaQuery } from '@magento/peregrine/lib/hooks/useMediaQuery';

import { List as BannerList } from '@thiagosilveira/banner-pwa';

/**
 * Page Builder Banner List component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef List
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a List which contains slides.
 */
const List = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        positionDesktop,
        positionMobile,
        listType,
        carouselMode,
        attributeCount,
        minHeight,
        autoplay,
        autoplaySpeed,
        fade,
        infinite,
        showArrows,
        showDots,
        slidesToShow,
        slidesToShowMedium,
        slidesToShowSmall,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        mediaQueries,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const { styles: mediaQueryStyles } = useMediaQuery({ mediaQueries });

    const dynamicStyles = {
        minHeight,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    const bannerList = !isMobile
        ? positionDesktop
        : positionMobile;

    const pageSize = attributeCount ? attributeCount : 20;

    return (
        <div
            aria-live="polite"
            aria-busy="false"
            className={[classes.root, ...cssClasses].join(' ')}
            style={{ ...dynamicStyles, ...mediaQueryStyles }}
        >  
            <BannerList
                appearance={listType}
                position={bannerList}
                size={pageSize}
                autoplay={autoplay}
                autoplaySpeed={autoplaySpeed}
                draggable={fade}
                infinite={infinite}
                arrows={showArrows}
                dots={showDots}
                slidesToShow={slidesToShow}
                slidesToShowMedium={slidesToShowMedium}
                slidesToShowSmall={slidesToShowSmall}
                carouselMode={carouselMode}
            />
        </div>
    );
};

/**
 * Props for {@link List}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the List
 * @property {String} classes.root CSS class for the slider root element
 * @property {string} positionDesktop Position where the banners will be displayed for desktop
 * @property {string} positionMobile Position where the banners will be displayed for desktop
 * @property {string} listType
 * @property {string} carouselMode
 * @property {string} positionMobile Position where the banners will be displayed for desktop
 * @property {String} minHeight CSS minimum height property
 * @property {String} autoplay Whether the slider should autoplay
 * @property {String} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {String} fade Fade between slides
 * @property {String} infinite Whether to infinitely scroll the slider
 * @property {String} showArrows Whether to show arrows on the slide for navigation
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 * @property {String} slidesToShow
 * @property {String} slidesToShowMedium
 * @property {String} slidesToShowSmall
 * @property {String} textAlign Alignment of content within the slider
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {Array} mediaQueries List of media query rules to be applied to the component
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
List.propTypes = {
    classes: shape({
        root: string
    }),
    appearance: oneOf(['default']),
    positionDesktop: string,
    positionMobile: string,
    listType: string,
    carouselMode: string,
    attributeCount: number,
    minHeight: string,
    autoplay: bool,
    autoplaySpeed: number,
    fade: bool,
    infinite: bool,
    showArrows: bool,
    showDots: bool,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    mediaQueries: arrayOf(
        shape({
            media: string,
            style: object
        })
    ),
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default List;
