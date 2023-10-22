import { getAdvanced, getMediaQueries } from '@magento/pagebuilder/lib/utils';

export default node => {
    const autoplaySpeed = parseInt(node.getAttribute('data-autoplay-speed'));

    return {
        positionDesktop: node.getAttribute('data-position-desktop'),
        positionMobile: node.getAttribute('data-position-mobile'),
        listType: node.getAttribute('data-list-type'),
        carouselMode: node.getAttribute('data-carousel-mode'),
        attributeCount: parseInt(node.getAttribute('data-attribute-count')),
        minHeight: node.style.minHeight,
        autoplay: node.getAttribute('data-autoplay') === 'true',
        fade: node.getAttribute('data-fade') === 'true',
        infinite: node.getAttribute('data-infinite-loop') === 'true',
        showArrows: node.getAttribute('data-show-arrows') === 'true',
        showDots: node.getAttribute('data-show-dots') === 'true',
        slidesToShow: parseInt(node.getAttribute('data-slides-to-show')),
        slidesToShowMedium: parseInt(node.getAttribute('data-slides-to-show-medium')),
        slidesToShowSmall: parseInt(node.getAttribute('data-slides-to-show-small')),
        ...(!isNaN(autoplaySpeed) && { autoplaySpeed }),
        ...getAdvanced(node),
        ...getMediaQueries(node)
    };
};
