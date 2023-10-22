import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'react-feather';
import requiredIf from 'react-required-if';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import { useStyle } from '@magento/venia-ui/lib/classify';
import resolveLinkProps from '@magento/peregrine/lib/util/resolveLinkProps';
import { useIntersectionObserver } from '@magento/peregrine/lib/hooks/useIntersectionObserver';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import AriaButton from '@magento/venia-ui/lib/components/AriaButton';
import Icon from '@magento/venia-ui/lib/components/Icon';

import { useBanners } from '../../../talons/useBanners';
import { useBannersCarousel } from '../../../talons/FullBannersCarousel/useBannersCarousel';

import Image from '../Image';
import FullBannersCarouselShimmer from './fullBannersCarousel.shimmer';

import defaultClasses from './fullBannersCarousel.module.css';

const handleDragStart = event => event.preventDefault();

const IMAGE_WIDTH = 1300;

/**
 * @typedef FullBannersCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a banner image
 */
const FullBannersCarousel = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const intersectionObserver = useIntersectionObserver();

    const { 
        banners, 
        isLoading, 
        error,
        handleLinkClick,
        handleBannerView
    } = useBanners(props);

    const {
        currentBanner,
        altText,
        handleNext,
        handlePrevious
    } = useBannersCarousel({
        banners,
        imageWidth: IMAGE_WIDTH
    });

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
        return <FullBannersCarouselShimmer />;
    }

    if (error || banners.length === 0) {
        return '';
    }

    let banner;
    if (currentBanner.image) {
        banner = (
            <Image
                alt={altText}
                classes={{
                    image: classes.currentBanner,
                    root: classes.imageContainer
                }}
                src={resourceUrl(currentBanner.image, {
                    type: 'image-wysiwyg',
                    quality: 85
                })}
                width={IMAGE_WIDTH}
            />
        );
    } else {
        banner = (
            <Image
                alt={altText}
                classes={{
                    image: classes.currentBanner_placeholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        );
    }

    if (currentBanner.url) {
        const linkProps = resolveLinkProps(currentBanner.url);
        const LinkComponent = linkProps.to ? Link : 'a';
        banner = (
            <LinkComponent
                className={classes.currentLink}
                {...linkProps}
                {...(currentBanner.newtab ? { target: '_blank' } : '')}
                onDragStart={handleDragStart}
                onClick={() => handleLinkClick(currentBanner)}
            >
                {banner}
            </LinkComponent>
        );
    }

    const previousButton = formatMessage({
        id: 'FullBannersCarousel.previousButtonAriaLabel',
        defaultMessage: 'Previous Image'
    });

    const nextButton = formatMessage({
        id: 'FullBannersCarousel.nextButtonAriaLabel',
        defaultMessage: 'Next Image'
    });

    const chevronClasses = { root: classes.chevron };
    return (
        <div className={classes.root}>
            <div className={classes.carouselContainer} ref={bannerRef}>
                <AriaButton
                    className={classes.previousButton}
                    onPress={handlePrevious}
                    aria-label={previousButton}
                    type="button"
                >
                    <Icon
                        classes={chevronClasses}
                        src={ChevronLeftIcon}
                        size={40}
                    />
                </AriaButton>
                {banner}
                <AriaButton
                    className={classes.nextButton}
                    onPress={handleNext}
                    aria-label={nextButton}
                    type="button"
                >
                    <Icon
                        classes={chevronClasses}
                        src={ChevronRightIcon}
                        size={40}
                    />
                </AriaButton>
            </div>
        </div>
    );
};

/**
 * Props for {@link FullBannersCarousel}
 *
 * @typedef props
 *
 * @property {string} position Position where the banners will be displayed
 * @property {string} displayOnPage Page where the banner will be displayed.
 * @property {string} displayOnId Entity ID of the page where the banner will be displayed or the keyword of custom pages.
 * @property {Object} classes An object containing the class names for the
 * FullBannersCarousel component
 * @property {string} classes.carouselContainer classes for carousel container
 * @property {string} classes.currentBanner classes for visible image
 * @property {string} classes.currentBanner_placeholder classes for placeholder image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.nextButton classes for next button
 * @property {string} classes.previousButton classes for previous button
 * @property {string} classes.root classes for root container
 */
FullBannersCarousel.propTypes = {
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
        carouselContainer: string,
        currentBanner: string,
        currentBanner_placeholder: string,
        imageContainer: string,
        nextButton: string,
        previousButton: string,
        root: string
    })
};

export default FullBannersCarousel;
