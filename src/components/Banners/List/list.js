import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { arrayOf, bool, number, oneOf, shape, string, object } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Gallery from './Gallery';
import Carousel from './Carousel/carousel';

import { useBanners } from '../../../talons/useBanners';

import defaultClasses from './list.module.css';

/**
 *  List component.
 *
 * @typedef List
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a List based on a number of products
 */
const List = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        appearance,
        position,
        displayOnPage,
        displayOnId,
        size,
        autoplay,
        autoplaySpeed,
        infinite,
        arrows,
        dots,
        draggable = false,
        carouselMode,
        centerPadding,
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
        paddingLeft,
        cssClasses = [],
        slidesToShow = 8,
        slidesToShowMedium = 4,
        slidesToShowSmall = 2,
        slidesToShowSmallCenterMode = 1
    } = props;
    
    const dynamicStyles = {
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

    const {
        banners, 
        isLoading, 
        error,
    } = useBanners({
        position,
        displayOnPage,
        displayOnId,
        pageSize: size  
    });

    if (isLoading) return null;

    if (error || banners.length === 0) {
        return null;
    }

    if (appearance === 'carousel') {
        //Settings conditions was made due to react-slick issues
        const carouselCenterMode =
            carouselMode === 'continuous' && banners.length > slidesToShow;
        const carouselSmallCenterMode =
            carouselMode === 'continuous' &&
            banners.length > slidesToShowSmallCenterMode;
  
        const carouselSettings = {
            slidesToShow,
            slidesToScroll: slidesToShow,
            draggable,
            autoplay,
            autoplaySpeed,
            arrows,
            dots,
            centerMode: carouselCenterMode,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: carouselSmallCenterMode
                            ? slidesToShowSmallCenterMode
                            : slidesToShowSmall,
                        slidesToScroll: carouselSmallCenterMode
                            ? slidesToShowSmallCenterMode
                            : slidesToShowSmall,
                        centerMode: carouselSmallCenterMode,
                        ...(carouselSmallCenterMode && { centerPadding }),
                        ...{
                            infinite:
                                banners.length > slidesToShowSmall && infinite
                        }
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: slidesToShowSmall + 1,
                        slidesToScroll: slidesToShowSmall + 1
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: slidesToShowMedium,
                        slidesToScroll: slidesToShowMedium
                    }
                }
            ],
            ...(carouselCenterMode && { centerPadding }),
            ...{ infinite: banners.length > slidesToShow && infinite }
        };

        const centerModeClass = carouselCenterMode ? classes.centerMode : null;
        const centerModeSmallClass = carouselSmallCenterMode
            ? classes.centerModeSmall
            : null;
        
        return (
            <div
                style={dynamicStyles}
                className={[
                    classes.carousel,
                    ...cssClasses,
                    centerModeClass,
                    centerModeSmallClass
                ].join(' ')}
            >
                <Carousel settings={carouselSettings} items={banners} />
            </div>
        );
    }
    
    return (
        <div
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            <Gallery items={banners} classes={{ items: classes.galleryItems }} />
        </div>
    );
};

/**
 * Props for {@link List}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the List
 * @property {String} classes.root CSS class for products
 * @property {String} classes.carousel CSS class for products carousel appearance
 * @property {String} classes.centerMode CSS class for products carousel appearance with center mode
 * @property {String} classes.centerModeSmall CSS class for products carousel appearance with center mode on small screen
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {String} appearance Sets products appearance
 * @property {String} position 
 * @property {String} displayOnPage 
 * @property {String} displayOnId 
 * @property {Number} size 
 * @property {Boolean} autoplay Whether the carousel should autoplay
 * @property {Number} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {Boolean} infinite Whether to infinitely scroll the carousel
 * @property {Boolean} arrows Whether to show arrows on the slide for navigation
 * @property {Boolean} dots Whether to show navigation dots at the bottom of the carousel
 * @property {Boolean} draggable Enable scrollable via dragging on desktop
 * @property {String} carouselMode Carousel mode
 * @property {String} centerPadding Horizontal padding in centerMode
 * @property {String} textAlign Alignment of content within the products list
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 * @property {Number} slidesToShow # of slides to show at a time
 * @property {Number} slidesToShowMedium # of slides to show at a time on medium sized screens
 * @property {Number} slidesToShowSmall # of slides to show at a time on small screen
 * @property {Number} slidesToShowSmallCenterMode # of slides to show at a time on small screen in centerMode
 */
List.propTypes = {
    classes: shape({
        root: string,
        carousel: string,
        centerMode: string,
        centerModeSmall: string,
        galleryItems: string,
        error: string
    }),
    appearance: oneOf(['grid', 'carousel']),
    id: string,
    attributeCode: string,
    size: number,
    autoplay: bool,
    autoplaySpeed: number,
    infinite: bool,
    arrows: bool,
    dots: bool,
    draggable: bool,
    carouselMode: oneOf(['default', 'continuous']),
    centerPadding: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string),
    slidesToShow: number,
    slidesToShowMedium: number,
    slidesToShowSmall: number,
    slidesToShowSmallCenterMode: number
};

export default List;
