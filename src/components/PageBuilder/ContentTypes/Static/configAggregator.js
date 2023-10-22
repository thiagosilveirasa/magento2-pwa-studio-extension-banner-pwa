import { getAdvanced, getMediaQueries } from '@magento/pagebuilder/lib/utils';

export default node => {

    return {
        positionDesktop: node.getAttribute('data-position-desktop'),
        positionMobile: node.getAttribute('data-position-mobile'),
        minHeight: node.style.minHeight,
        ...getAdvanced(node),
        ...getMediaQueries(node)
    };
};
