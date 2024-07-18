import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import {
    useLocation,
    useParams,
} from 'react-router-dom';
import { StudioFooter } from '@edx/frontend-component-footer';
import Header from '../../header';
import NotFoundAlert from '../../generic/NotFoundAlert';
import PermissionDeniedAlert from '../../generic/PermissionDeniedAlert';
import { getCourseAppsApiStatus } from '../../pages-and-resources/data/selectors';
import { RequestStatus } from '../../data/constants';
import Loading from '../../generic/Loading';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { StudioHeader } from '@edx/frontend-component-header';

const AppHeader = ({
    libraryNumber, libraryOrg, libraryTitle, libraryId,
}) => {
    // const studioBaseUrl = getConfig().STUDIO_BASE_URL;
    const outlineLink = `/course-authoring/library/${libraryId}`;
    const mainMenuDropdowns = [
        // {
        //   id: `${intl.formatMessage(messages['header.links.content'])}-dropdown-menu`,
        //   buttonTitle: intl.formatMessage(messages['header.links.content']),
        //   items: getContentMenuItems({ studioBaseUrl, courseId, intl }),
        // },
        // {
        //   id: `${intl.formatMessage(messages['header.links.settings'])}-dropdown-menu`,
        //   buttonTitle: intl.formatMessage(messages['header.links.settings']),
        //   items: getSettingMenuItems({ studioBaseUrl, courseId, intl }),
        // },
        // {
        //   id: `${intl.formatMessage(messages['header.links.tools'])}-dropdown-menu`,
        //   buttonTitle: intl.formatMessage(messages['header.links.tools']),
        //   items: getToolsMenuItems({ studioBaseUrl, courseId, intl }),
        // },
    ];
    return <StudioHeader
        org={libraryOrg}
        number={libraryNumber}
        title={libraryTitle}
        isHiddenMainMenu={false}
        mainMenuDropdowns={mainMenuDropdowns}
        outlineLink={outlineLink}
        searchButtonAction={false}
    />
}

AppHeader.propTypes = {
    libraryId: PropTypes.string,
    libraryNumber: PropTypes.string,
    libraryOrg: PropTypes.string,
    libraryTitle: PropTypes.string,
};

AppHeader.defaultProps = {
    libraryNumber: null,
    libraryOrg: null,
};

const LibraryAuthoringPage = ({ libraryId, children, loadingStatus }) => {
    function renderLoading() {
        return (
            <Loading />
        );
    }
    const client = getAuthenticatedHttpClient();

    // const { libraryId } = useParams();
    const [libraryData, setLibraryData] = useState({
        "display_name": "",
        "library_id": "",
        "version": "",
        "previous_version": "",
        "blocks": []
    });
    const [libraryOrg, libraryNumber] = libraryId ? libraryId.split(":")[1].split("+") : ["", ""];
    const libraryTitle = libraryData ? libraryData.display_name : "";
    const [inProgress, setInProgress] = useState(false);
    const { pathname } = useLocation();
    const isEditor = pathname.includes('/editor');
    const outlineIndexApi = `${getConfig().STUDIO_BASE_URL}/library/${libraryId}?format=json`
    useEffect(() => {
        if (libraryId) {
            setInProgress(true);
            client.get(outlineIndexApi).then(res => res.data).then(data => setLibraryData(data)).then(() => setInProgress(false));
        }
    }, [])
    return (
        <div className={pathname.includes('/editor/') ? '' : 'bg-light-200'}>
            {/* While V2 Editors are temporarily served from their own pages
      using url pattern containing /editor/,
      we shouldn't have the header and footer on these pages.
      This functionality will be removed in TNL-9591 */}
            {inProgress ? !isEditor && <Loading />
                : (!isEditor && (
                    <AppHeader
                        libraryNumber={libraryNumber}
                        libraryOrg={libraryOrg}
                        libraryTitle={libraryTitle}
                        libraryId={libraryId}
                    />
                )
                )}
            {loadingStatus ? renderLoading() : children}
            {!inProgress && !isEditor && <StudioFooter />}
        </div>
    );
};

LibraryAuthoringPage.propTypes = {
    children: PropTypes.node,
    courseId: PropTypes.string,
    loadingStatus: PropTypes.bool
};

LibraryAuthoringPage.defaultProps = {
    children: null,
};

export default LibraryAuthoringPage;
