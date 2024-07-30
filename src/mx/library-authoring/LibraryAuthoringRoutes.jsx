import React, { useState } from 'react';
import {
    Routes, Route, useParams,
} from 'react-router-dom';
import { PageWrap } from '@edx/frontend-platform/react';
import LibraryAuthoringPage from './LibraryAuthoringPage';
import LibraryContents from './LibraryContents';
import LibraryImportPage from './import-page/LibraryImportPage';
import Loading from 'CourseAuthoring/generic/Loading';
import EditorContainer from './editors/EditorContainer';
// import CourseExportPage from './export-page/CourseExportPage';

/**
 * As of this writing, these routes are mounted at a path prefixed with the following:
 *
 * /library/
 *
 * Meaning that their absolute paths look like:
 *
 * /library/:courseId/library-pages
 * /library/:courseId/proctored-exam-settings
 * /library/:courseId/editor/:blockType/:blockId
 *
 * This component and LibraryAuthoringPage should maybe be combined once we no longer need to have
 * LibraryAuthoringPage split out for use in LegacyProctoringRoute.  Once that route is removed, we
 * can move the Header/Footer rendering to this component and likely pull the library detail loading
 * in as well, and it'd feel a bit better-factored and the roles would feel more clear.
 */
const LibraryAuthoringRoutes = () => {
    const { libraryId } = useParams();
    const [loading, setLoading] = useState(false);
    
    return (
        <LibraryAuthoringPage libraryId={libraryId} loadingStatus={loading}>
            <Routes>
                <Route
                    path="import"
                    element={
                        <PageWrap>
                            <LibraryImportPage libraryId={libraryId} setLoading={setLoading} />
                        </PageWrap>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PageWrap>
                            <LibraryContents setLoading={setLoading} />
                        </PageWrap>
                    }
                />
                {/* <Route
                    path="/"
                    element={
                        <PageWrap>
                            <CourseExportPage setLoading={setLoading} />
                        </PageWrap>
                    }
                /> */}
                <Route
                    path="editor/:blockType/:blockId?"
                    element={<PageWrap><EditorContainer libraryId={libraryId} /></PageWrap>}
                />
            </Routes>
        </LibraryAuthoringPage>
    );
};

export default LibraryAuthoringRoutes;
