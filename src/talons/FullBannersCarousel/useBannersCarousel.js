import { useCallback, useEffect } from 'react';
import { useCarousel } from '@magento/peregrine';
import { generateUrlFromContainerWidth } from '@magento/peregrine/lib/util/imageUtils';
import {
    MESSAGE_TYPES,
    VALID_SERVICE_WORKER_ENVIRONMENT,
    sendMessageToSW
} from '@magento/peregrine/lib/util/swUtils';

export const useBannersCarousel = props => {
    const { banners, type, imageWidth } = props;
    const [carouselState, carouselApi] = useCarousel(banners);
    const { activeItemIndex, sortedImages: sortedBanners } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleImageClick = useCallback(
        index => {
            setActiveItemIndex(index);
        },
        [setActiveItemIndex]
    );

    // Whenever the incoming banners changes reset the active item to the first.
    useEffect(() => {
        setActiveItemIndex(0);
    }, [banners, setActiveItemIndex]);

    useEffect(() => {
        if (VALID_SERVICE_WORKER_ENVIRONMENT) {
            const urls = banners.map(
                ({ image }) =>
                    new URL(
                        generateUrlFromContainerWidth(image, imageWidth, type),
                        location.origin
                    ).href
            );
            sendMessageToSW(MESSAGE_TYPES.PREFETCH_IMAGES, {
                urls
            }).catch(err => {
                console.error(
                    'Unable to send PREFETCH_IMAGES message to SW',
                    err
                );
            });
        }
    }, [banners, imageWidth, type]);

    const currentBanner = sortedBanners[activeItemIndex] || {};
    const altText = currentBanner.title || 'image-banner';

    return {
        currentBanner,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleImageClick,
        sortedBanners
    };
};
