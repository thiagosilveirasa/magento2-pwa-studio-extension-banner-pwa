import React from 'react';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import { useGalleryItem } from '../../../../talons/Gallery/useGalleryItem';
import resolveLinkProps from '@magento/peregrine/lib/util/resolveLinkProps';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '../../Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './item.module.css';

const handleDragStart = event => event.preventDefault();

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        itemRef
    } = useGalleryItem(props);

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    let itemBanner;
    if (item.image) {
        itemBanner = (
            <Image
                alt={item.title}
                classes={{
                    image: classes.banner,
                    root: classes.imageContainer
                }}
                src={resourceUrl(item.image, {
                    type: 'image-wysiwyg',
                    quality: 85
                })}
            />
        );
    } else {
        itemBanner = (
            <Image
                classes={{
                    image: classes.banner_placeholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        );
    }
    if (item.url) {
        const linkProps = resolveLinkProps(item.url);
        const LinkComponent = linkProps.to ? Link : 'a';
        itemBanner = (
            <LinkComponent
                className={classes.link}
                {...linkProps}
                {...(item.newtab ? { target: '_blank' } : '')}
                onDragStart={handleDragStart}
                onClick={() => handleLinkClick(item)}
            >
                {itemBanner}
            </LinkComponent>
        );
    }

    return (
        <div data-cy="GalleryItem-root" className={classes.root} ref={itemRef}>
            {itemBanner}
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string,
        name: string.isRequired,
        image: string.isRequired,
        __typename: string.isRequired,
        url: string.isRequired
    })
};

export default GalleryItem;
