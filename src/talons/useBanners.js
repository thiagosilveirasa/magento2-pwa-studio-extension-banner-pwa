import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

// GraphQL query to fetch a list of banners
const GET_BANNERS = gql`
    query banners(
        $filters: BannerFilterInput!,
        $pageSize: Int!
    ) {
        banners(
            filters: $filters,
            pageSize: $pageSize,
            currentPage: 1
        ) {
            items {
                id
                name
                position
                display_on_page
                display_on_id
                title
                image
                url
                newtab
                sort_order
            }
        }
    }
`;

export const useBanners = props => {
    const { 
        position, 
        displayOnPage, 
        displayOnId,
        pageSize = 20
    } = props;

    const [, { dispatch }] = useEventingContext();

    const handleLinkClick = (banner) => {
        dispatch({
            type: 'BANNER_CLICK',
            payload: {
                id: banner.id,
                name: banner.name,
                position: banner.position,
                title: banner.title,
                image: banner.image,
                url: banner.url
            }
        });
    };

    const handleBannerView = (banner) => {
        dispatch({
            type: 'BANNER_VIEW',
            payload: {
                id: banner.id,
                name: banner.name,
                position: banner.position,
                title: banner.title,
                image: banner.image,
                url: banner.url
            }
        });
    };

    const filters = {
        ...(position ? { position } : null),
        ...(displayOnPage && displayOnId
            ? {
                  display_on: {
                      page: displayOnPage,
                      id: displayOnId
                  }
              }
            : null)
    };

    const { error, loading, data } = useQuery(GET_BANNERS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            filters: filters,
            pageSize: pageSize
        }
    });

    const banners = useMemo(() => {
        if (data && data.banners && data.banners.items.length) {
            return data.banners.items;
        }
        return [];
    }, [data]);

    return {
        error,
        isLoading: loading,
        banners, 
        handleLinkClick,
        handleBannerView
    };
};
