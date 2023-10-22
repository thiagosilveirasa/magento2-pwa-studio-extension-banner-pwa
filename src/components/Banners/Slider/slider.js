import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    bool,
    number,
    shape,
    string,
} from 'prop-types';
import SlickSlider from 'react-slick';
import { jarallax } from 'jarallax';
import requiredIf from 'react-required-if';

import { useStyle } from '@magento/venia-ui/lib/classify';
import resolveLinkProps from '@magento/peregrine/lib/util/resolveLinkProps';
import { useIntersectionObserver } from '@magento/peregrine/lib/hooks/useIntersectionObserver';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useBanners } from '../../../talons/useBanners';

import Image from '../Image';
import SliderShimmer from './slider.shimmer';

import defaultClasses from './slider.module.css';

const handleDragStart = event => event.preventDefault();

/**
 * Slider component.
 *
 * @typedef Slider
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Slider which contains slides.
 */
const Slider = props => {
    const {
        position,
        displayOnPage,
        displayOnId,
        autoplay,
        autoplaySpeed,
        fade,
        infinite,
        showArrows,
        showDots
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const intersectionObserver = useIntersectionObserver();

    const {
        banners, 
        isLoading, 
        error,
        handleLinkClick,
        handleBannerView
    } = useBanners({
        position,
        displayOnPage,
        displayOnId    
    });

    const [ currentBanner, setCurrentBanner ] = useState(banners && banners.length ? banners[0] : null);

    const bannerRef = useRef(null);
    const contextRef = useRef({
        dispatchedBannerIds: [],
        timeOutId: null
    });

    useEffect(() => {
        if (
            typeof intersectionObserver === 'undefined' ||
            !currentBanner ||
            contextRef.current.dispatchedBannerIds.includes(currentBanner.id)
        ) {
            return;
        }
        const htmlElement = bannerRef.current;
        if (!bannerRef.current || !(bannerRef.current instanceof HTMLElement)) {
            return;
        }
        const onIntersection = entries => {
            if (entries[0].isIntersecting) {
                contextRef.current.timeOutId = setTimeout(() => {
                    observer.unobserve(htmlElement);
                    handleBannerView(currentBanner);
                    contextRef.current.dispatchedBannerIds.push(currentBanner.id);
                }, 500);
            } else {
                clearTimeout(contextRef.current.timeOutId);
            }
        };
        const observer = new intersectionObserver(onIntersection, {
            threshold: 0.8
        });
        observer.observe(htmlElement);
        return () => {
            if (htmlElement) {
                observer.unobserve(htmlElement);
            }
        };
    }, [
        currentBanner,
        handleBannerView,
        intersectionObserver,
    ]);

    if (isLoading) {
        return <SliderShimmer />;
    }

    if (error || banners.length === 0) {
        return '';
    }

    const children = banners.map(banner => {
        let currentBanner = 
            <Image
                alt={banner.title}
                classes={{
                    image: classes.bannerWrapper
                }}
                src={resourceUrl(banner.image, {
                    type: 'image-wysiwyg',
                    quality: 85
                })}
            />

        if (banner.url) {
            const linkProps = resolveLinkProps(banner.url);
            const LinkComponent = linkProps.to ? Link : 'a';
            currentBanner = (
                <LinkComponent
                    className={classes.bannerLink}
                    {...linkProps}
                    {...(banner.newtab ? { target: '_blank' } : '')}
                    onDragStart={handleDragStart}
                    onClick={() => handleLinkClick(banner)}
                >
                    {currentBanner}
                </LinkComponent>
            );
        }

        return <div key={banner.id} className={classes.bannerRoot}>
            {currentBanner}
        </div>;
    });
    
    const jarallaxInstances = {};
    const sliderSettings = {
        dots: showDots,
        arrows: showArrows,
        lazyLoad: 'ondemand',
        afterChange: (currentSlide) => {
            setCurrentBanner(banners[currentSlide]);
            Object.keys(jarallaxInstances).map(key => {
                jarallax(jarallaxInstances[key].element, 'onScroll');
            });
        },
        infinite,
        autoplay,
        autoplaySpeed,
        fade
    };

    return (
        <div
            aria-live="polite"
            aria-busy="false"
            className={classes.root}
            ref={bannerRef}
        >
            <SlickSlider {...sliderSettings}>{children}</SlickSlider>
        </div>
    );
};

/**
 * Props for {@link Slider}
 *
 * @typedef props
 *
 * @property {string} position Position where the banners will be displayed
 * @property {string} displayOnPage Page where the banner will be displayed.
 * @property {string} displayOnId Entity ID of the page where the banner will be displayed or the keyword of custom pages.
 * @property {Object} classes An object containing the class names for the Slider
 * @property {String} classes.root CSS class for the slider root element
 * @property {String} classes.bannerRoot CSS class for the child banner item
 * @property {String} classes.bannerLink CSS class for the child banner item
 * @property {String} classes.bannerWrapper CSS class for the child banner item
 * @property {String} autoplay Whether the slider should autoplay
 * @property {String} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {String} fade Fade between slides
 * @property {String} infinite Whether to infinitely scroll the slider
 * @property {String} showArrows Whether to show arrows on the slide for navigation
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 */
Slider.propTypes = {
    position: requiredIf(
        string,
        props => !props.displayOnPage && !props.displayOnId
    ),
    displayOnPage: requiredIf(
        string,
        props =>
            (!props.position && !props.displayOnId) ||
            (!props.displayOnPage && props.displayOnId)
    ),
    displayOnId: requiredIf(
        string,
        props =>
            (!props.position && !props.displayOnPage) ||
            (!props.displayOnId && props.displayOnPage)
    ),
    classes: shape({
        root: string,
        bannerRoot: string,
        bannerLink: string,
        bannerWrapper: string
    }),
    autoplay: bool,
    autoplaySpeed: number,
    fade: bool,
    infinite: bool,
    showArrows: bool,
    showDots: bool
};

export default Slider;
