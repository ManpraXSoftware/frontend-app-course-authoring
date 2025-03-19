import {
    useState,
    useRef,
    useEffect,
} from 'react';
import { actions as editorActions } from '@edx/frontend-lib-content-components/dist/editors/data/redux';
import { RequestKeys } from '@edx/frontend-lib-content-components/dist/editors/data/constants/requests';
import { loadImages } from '@edx/frontend-lib-content-components/dist/editors/data/services/cms/api';
import { StrictDict } from '@edx/frontend-lib-content-components/dist/editors/utils';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export const state = StrictDict({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    isImageModalOpen: (val) => useState(val),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    imageSelection: (val) => useState(val),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    refReady: (val) => useState(val),
});


export const networkRequest = ({
    requestKey,
    promise,
    onSuccess,
    onFailure,
}) => (dispatch) => {
    dispatch(actions.requests.startRequest(requestKey));
    return promise
        .then((response) => {
            if (onSuccess) {
                onSuccess(response);
            }
            dispatch(actions.requests.completeRequest({ requestKey, response }));
        })
        .catch((error) => {
            if (onFailure) {
                onFailure(error);
            }
            dispatch(actions.requests.failRequest({ requestKey, error }));
        });
};

export const courseAssetsUrl = ({ studioEndpointUrl, learningContextId }) => (
    `${studioEndpointUrl}/assets/${learningContextId}/`
);

export const get = (...args) => getAuthenticatedHttpClient().get(...args);

export const fetchImagesApi = ({ learningContextId, studioEndpointUrl, pageNumber }) => {
    const params = {
        asset_type: 'Images',
        page: pageNumber,
    };
    return get(
        `${courseAssetsUrl({ studioEndpointUrl, learningContextId })}`,
        { params },
    );
}


export const fetchImagesRequest = ({ pageNumber, courseId, studioEndpointUrl, ...rest }) => (dispatch, getState) => {
    dispatch(networkRequest({
        requestKey: RequestKeys.fetchAssets,
        promise: fetchImagesApi({
            pageNumber,
            studioEndpointUrl: studioEndpointUrl,
            learningContextId: courseId, //Course ID
        })
            .then(({ data }) => ({ images: loadImages(data.assets), imageCount: data.totalCount })),
        ...rest,
    }));
};

export const fetchImages = ({ pageNumber, courseId, studioEndpointUrl }) => (dispatch) => {
    dispatch(fetchImagesRequest({
        pageNumber,
        courseId,
        studioEndpointUrl,
        onSuccess: ({ images, imageCount }) => {
            dispatch(actions.app.setAssets({ images, imageCount }))
        },
        onFailure: (error) => {
            dispatch(editorActions.requests.failRequest({
                requestKey: 'fetchAssets',
                error,
            }))
        },
    }));

};

export const initialize = (data) => (dispatch) => {
    // originalInitialize(data)
    dispatch(editorActions.app.initialize(data));
    dispatch(fetchImages({ pageNumber: 0, courseId: data.learningContextId, studioEndpointUrl: data.studioEndpointUrl }));
};

export const stringToFragment = (htmlString) => document.createRange().createContextualFragment(htmlString);
export const imageMatchRegex = /asset-v1.(.*).type.(.*).block.(.*)/;

export const matchImageStringsByIdentifiers = (a, b) => {
    if (!a || !b || typeof a !== 'string' || typeof b !== 'string') return null;
    const matchA = JSON.stringify(a.match(imageMatchRegex)?.slice?.(1));
    const matchB = JSON.stringify(b.match(imageMatchRegex)?.slice?.(1));
    return matchA && matchA === matchB;
};

export const filterAssets = ({ assets }) => {
    let images = [];
    const assetsList = Object.values(assets);
    if (assetsList.length > 0) {
        images = assetsList.filter(asset => asset?.contentType?.startsWith('image/'));
    }
    return images;
};

export const getImageFromHtmlString = (htmlString, imageSrc) => {
    const images = stringToFragment(htmlString)?.querySelectorAll('img') || [];

    return Array.from(images).find((img) => matchImageStringsByIdentifiers(img.src || '', imageSrc));
};

export const addImagesAndDimensionsToRef = ({ imagesRef, assets, editorContentHtml }) => {
    const imagesWithDimensions = filterAssets({ assets }).map((image) => {
        const imageFragment = getImageFromHtmlString(editorContentHtml, image.url);
        return { ...image, width: imageFragment?.width, height: imageFragment?.height };
    });

    imagesRef.current = imagesWithDimensions;
};

export const useImages = ({ assets, editorContentHtml }) => {
    const imagesRef = useRef([]);
    useEffect(() => {
        addImagesAndDimensionsToRef({ imagesRef, assets, editorContentHtml });
    }, []);

    const [refReady, setRefReady] = state.refReady(false);
    useEffect(() => setRefReady(true), []);
    return { imagesRef, refReady };
};

