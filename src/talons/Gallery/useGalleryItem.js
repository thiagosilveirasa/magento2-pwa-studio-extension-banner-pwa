import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { useCallback, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@magento/peregrine/lib/hooks/useIntersectionObserver';

export const useGalleryItem = (props = {}) => {
    const [, { dispatch }] = useEventingContext();
    const intersectionObserver = useIntersectionObserver();
    const { item } = props;

    const handleLinkClick = useCallback(() => {
        dispatch({
            type: 'BANNER_CLICK',
            payload: {
                id: item.id,
                name: item.name,
                position: item.position,
                title: item.title,
                image: item.image,
                url: item.url
            }
        });
    }, [dispatch, item]);

    const itemRef = useRef(null);
    const contextRef = useRef({
        dispatched: false,
        timeOutId: null
    });
    useEffect(() => {
        if (
            typeof intersectionObserver === 'undefined' ||
            !item ||
            contextRef.current.dispatched
        ) {
            return;
        }
        const htmlElement = itemRef.current;
        const onIntersection = entries => {
            if (entries[0].isIntersecting) {
                contextRef.current.timeOutId = setTimeout(() => {
                    observer.unobserve(htmlElement);
                    dispatch({
                        type: 'BANNER_IMPRESSION',
                        payload: {
                            id: item.id,
                            name: item.name,
                            position: item.position,
                            title: item.title,
                            image: item.image,
                            url: item.url
                        }
                    });
                    contextRef.current.dispatched = true;
                }, 500);
            } else {
                clearTimeout(contextRef.current.timeOutId);
            }
        };
        const observer = new intersectionObserver(onIntersection, {
            threshold: 0.9
        });
        observer.observe(htmlElement);
        return () => {
            if (htmlElement) {
                observer.unobserve(htmlElement);
            }
        };
    }, [
        dispatch,
        intersectionObserver,
        item
    ]);

    const productType = item ? item.__typename : null;

    const isSupportedProductType = isSupported(productType);

    return {
        ...props,
        itemRef,
        handleLinkClick,
        isSupportedProductType
    };
};
