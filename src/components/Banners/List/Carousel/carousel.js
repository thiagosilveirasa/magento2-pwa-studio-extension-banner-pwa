import React from 'react';
import SlickSlider from 'react-slick';
import GalleryItem from '../Gallery/item';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './carousel.module.css';

const Carousel = props => {
    const { settings, items } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const galleryItems = items.map((item, index) => {
        return (
            <GalleryItem key={index} item={item} classes={{root: classes.item}} />
        );
    });

    return (
        <SlickSlider {...settings}>
            {galleryItems}
        </SlickSlider>
    );
};

export default Carousel;
