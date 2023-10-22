module.exports = targets => {
    const { Targetables } = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);
    targetables.setSpecialFeatures('esModules', 'cssModules');

    targets.of('@magento/pagebuilder').customContentTypes.tap(
        contentTypes => contentTypes.add({
            contentType: 'bannerpwa_slider',
            importPath: '@thiagosilveira/banner-pwa/src/components/PageBuilder/ContentTypes/Slider/config.js'
        })
    );

    targets.of('@magento/pagebuilder').customContentTypes.tap(
        contentTypes => contentTypes.add({
            contentType: 'bannerpwa_static',
            importPath: '@thiagosilveira/banner-pwa/src/components/PageBuilder/ContentTypes/Static/config.js'
        })
    );

    targets.of('@magento/pagebuilder').customContentTypes.tap(
        contentTypes => contentTypes.add({
            contentType: 'bannerpwa_list',
            importPath: '@thiagosilveira/banner-pwa/src/components/PageBuilder/ContentTypes/List/config.js'
        })
    );
};
