import { getAdvanced, getMediaQueries } from '@magento/pagebuilder/lib/utils';

export default node => {
    const autoplaySpeed = parseInt(node.getAttribute('data-autoplay-speed'));

    return {
        positionDesktop: node.getAttribute('data-position-desktop'),
        positionMobile: node.getAttribute('data-position-mobile'),
        minHeight: node.style.minHeight,
        autoplay: node.getAttribute('data-autoplay') === 'true',
        fade: node.getAttribute('data-fade') === 'true',
        infinite: node.getAttribute('data-infinite-loop') === 'true',
        showArrows: node.getAttribute('data-show-arrows') === 'true',
        showDots: node.getAttribute('data-show-dots') === 'true',
        ...(!isNaN(autoplaySpeed) && { autoplaySpeed }),
        ...getAdvanced(node),
        ...getMediaQueries(node)
    };
};
