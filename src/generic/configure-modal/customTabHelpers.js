import {
    useState,
    useRef,
    useEffect,
} from 'react';
import { actions } from '@edx/frontend-lib-content-components/dist/editors/data/redux';
import { RequestKeys } from '@edx/frontend-lib-content-components/dist/editors/data/constants/requests';
import { loadImages } from '@edx/frontend-lib-content-components/dist/editors/data/services/cms/api';
import { StrictDict } from '@edx/frontend-lib-content-components/dist/editors/utils';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

// Define a state dictionary using StrictDict
export const state = StrictDict({
    // State for tracking image modal open/close status
    isImageModalOpen: (val) => useState(val),
    // State for storing selected image
    imageSelection: (val) => useState(val),
    // State for tracking if ref is ready
    refReady: (val) => useState(val),
});

// Function to handle network requests
export const networkRequest = ({
    requestKey,
    promise,
    onSuccess,
    onFailure,
}) => (dispatch) => {
    dispatch(actions.requests.startRequest(requestKey)); // Start request
    return promise
        .then((response) => {
            if (onSuccess) {
                onSuccess(response);
            }
            dispatch(actions.requests.completeRequest({ requestKey, response })); // Mark request as complete
        })
        .catch((error) => {
            if (onFailure) {
                onFailure(error);
            }
            dispatch(actions.requests.failRequest({ requestKey, error })); // Mark request as failed
        });
};

// Construct course assets URL
export const courseAssetsUrl = ({ studioEndpointUrl, learningContextId }) => (
    `${studioEndpointUrl}/assets/${learningContextId}/`
);

// Fetch data using an authenticated HTTP client
export const get = (...args) => getAuthenticatedHttpClient().get(...args);

// API call to fetch images
export const fetchImagesApi = ({ learningContextId, studioEndpointUrl, pageNumber }) => {
    const params = {
        asset_type: 'Images',
        page: pageNumber,
    };
    return get(
        `${courseAssetsUrl({ studioEndpointUrl, learningContextId })}`,
        { params },
    );
};

// Redux action to request fetching images
export const fetchImagesRequest = ({ pageNumber, courseId, studioEndpointUrl, ...rest }) => (dispatch, getState) => {
    dispatch(networkRequest({
        requestKey: RequestKeys.fetchAssets,
        promise: fetchImagesApi({
            pageNumber,
            studioEndpointUrl: studioEndpointUrl,
            learningContextId: courseId, // Course ID
        })
            .then(({ data }) => ({ images: loadImages(data.assets), imageCount: data.totalCount })),
        ...rest,
    }));
};

// Function to fetch images and dispatch results to Redux store
export const fetchImages = ({ pageNumber, courseId, studioEndpointUrl }) => (dispatch) => {
    dispatch(fetchImagesRequest({
        pageNumber,
        courseId,
        studioEndpointUrl,
        onSuccess: ({ images, imageCount }) => {
            dispatch(actions.app.setAssets({ images, imageCount }));
        },
        onFailure: (error) => {
            dispatch(actions.requests.failRequest({
                requestKey: 'fetchAssets',
                error,
            }));
        },
    }));
};

// Initialize function to set up app state and fetch images
export const initialize = (data) => (dispatch) => {
    dispatch(actions.app.initialize(data)); // Initialize app state
    dispatch(fetchImages({ pageNumber: 0, courseId: data.learningContextId, studioEndpointUrl: data.studioEndpointUrl }));
};

// Convert a string to an HTML fragment
export const stringToFragment = (htmlString) => document.createRange().createContextualFragment(htmlString);

// Regular expression to match image asset strings
export const imageMatchRegex = /asset-v1.(.*).type.(.*).block.(.*)/;

// Compare two image asset strings by identifiers
export const matchImageStringsByIdentifiers = (a, b) => {
    if (!a || !b || typeof a !== 'string' || typeof b !== 'string') return null;
    const matchA = JSON.stringify(a.match(imageMatchRegex)?.slice?.(1));
    const matchB = JSON.stringify(b.match(imageMatchRegex)?.slice?.(1));
    return matchA && matchA === matchB;
};

// Filter assets to include only image types
export const filterAssets = ({ assets }) => {
    let images = [];
    const assetsList = Object.values(assets);
    if (assetsList.length > 0) {
        images = assetsList.filter(asset => asset?.contentType?.startsWith('image/'));
    }
    return images;
};

// Extract an image element from an HTML string by its source URL
export const getImageFromHtmlString = (htmlString, imageSrc) => {
    const images = stringToFragment(htmlString)?.querySelectorAll('img') || [];
    return Array.from(images).find((img) => matchImageStringsByIdentifiers(img.src || '', imageSrc));
};

// Populate a reference with images and their dimensions
export const addImagesAndDimensionsToRef = ({ imagesRef, assets, editorContentHtml }) => {
    const imagesWithDimensions = filterAssets({ assets }).map((image) => {
        const imageFragment = getImageFromHtmlString(editorContentHtml, image.url);
        return { ...image, width: imageFragment?.width, height: imageFragment?.height };
    });
    imagesRef.current = imagesWithDimensions;
};

// Custom hook to manage images
export const useImages = ({ assets, editorContentHtml }) => {
    const imagesRef = useRef([]); // Create a ref for images
    useEffect(() => {
        addImagesAndDimensionsToRef({ imagesRef, assets, editorContentHtml }); // Update ref on mount
    }, []);

    const [refReady, setRefReady] = state.refReady(false); // Track readiness state
    useEffect(() => setRefReady(true), []); // Set ready state after mount
    return { imagesRef, refReady };
};
