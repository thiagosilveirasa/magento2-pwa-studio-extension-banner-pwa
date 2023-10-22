import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import requiredIf from 'react-required-if';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useBanners } from '../../../talons/useBanners';

import { useStyle } from '@magento/venia-ui/lib/classify';
import resolveLinkProps from '@magento/peregrine/lib/util/resolveLinkProps';
import { useIntersectionObserver } from '@magento/peregrine/lib/hooks/useIntersectionObserver';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import Image from '../Image';
import StaticBannerShimmer from './staticBanner.shimmer';

import defaultClasses from './staticBanner.module.css';

const handleDragStart = event => event.preventDefault();

/**
 * Component for static banner
 *
 * @typedef StaticBanner
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a banner image
 */
const StaticBanner = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const intersectionObserver = useIntersectionObserver();

    const {
        position,
        displayOnPage,
        displayOnId
    } = props;

    const { 
        banners, 
        isLoading, 
        error,
        handleLinkClick,
        handleBannerView
    } = useBanners({
        position,
        displayOnPage,
        displayOnId,
        pageSize: 1
    });

    const banner = banners && banners.length ? banners[0] : null;

    const bannerRef = useRef(null);
    const contextRef = useRef({
        dispatched: false,
        timeOutId: null
    });

    useEffect(() => {
        if (
            typeof intersectionObserver === 'undefined' ||
            !banner ||
            contextRef.current.dispatched
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
                    handleBannerView(banner);
                    contextRef.current.dispatched = true;
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
        banner,
        handleBannerView,
        intersectionObserver,
    ]);

    if (isLoading) {
        return <StaticBannerShimmer />;
    }

    if (error || banners.length === 0) {
        return '';
    }

    let staticBanner;
    if (banner.image) {
        staticBanner = (
            <Image
                alt={banner.title}
                classes={{
                    image: classes.banner,
                    root: classes.imageContainer
                }}
                src={resourceUrl(banner.image, {
                    type: 'image-wysiwyg',
                    quality: 85
                })}
            />
        );
    } else {
        staticBanner = (
            <Image
                classes={{
                    image: classes.banner_placeholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        );
    }
    if (banner.url) {
        const linkProps = resolveLinkProps(banner.url);
        const LinkComponent = linkProps.to ? Link : 'a';
        staticBanner = (
            <LinkComponent
                className={classes.link}
                {...linkProps}
                {...(banner.newtab ? { target: '_blank' } : '')}
                onDragStart={handleDragStart}
                onClick={() => handleLinkClick(banner)}
            >
                {staticBanner}
            </LinkComponent>
        );
    }

    return <div className={classes.root} ref={bannerRef}>{staticBanner}</div>;
};

/**
 * Props for {@link StaticBanner}
 *
 * @typedef props
 *
 * @property {string} position Position where the banners will be displayed
 * @property {string} displayOnPage Page where the banner will be displayed.
 * @property {string} displayOnId Entity ID of the page where the banner will be displayed or the keyword of custom pages.
 * @property {Object} classes An object containing the class names for the
 * StaticBanner component
 * @property {string} classes.banner classes for visible image
 * @property {string} classes.banner_placeholder classes for placeholder image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.root classes for root container
 */
StaticBanner.propTypes = {
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
        banner: string,
        banner_placeholder: string,
        imageContainer: string,
        root: string
    })
};

export default StaticBanner;
