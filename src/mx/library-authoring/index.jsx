// @ts-check
import React, { useEffect, useState } from "react";
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useParams } from "react-router";
import { useIntl } from '@edx/frontend-platform/i18n';
import getPageHeadTitle from "../../generic/utils";
import messages from "./messages";
import { getConfig } from '@edx/frontend-platform';
import { Helmet } from 'react-helmet';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import PropTypes from 'prop-types';
import {
    Button,
    Container,
    Layout,
    Card,
} from '@openedx/paragon';
import {
    Delete,
    Download,
    FileDownload,
    ImportExport,
    Upload,
} from '@openedx/paragon/icons';
import SubHeader from '../../generic/sub-header/SubHeader';
import OutlineSideBar from '../../course-outline/outline-sidebar/OutlineSidebar';
import { Link } from "react-router-dom";
import AddComponentButton from "../../course-unit/add-component/add-component-btn";
import { useNavigate } from 'react-router-dom';
import TagsSidebar from "./tags-modal";
import ProblemCard from "./problem-card";

const LibraryContents = ({ setLoading }) => {
    const navigate = useNavigate();
    const client = getAuthenticatedHttpClient();
    const intl = useIntl();
    const { libraryId } = useParams(); /** @type {string} */
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ 'outlineIndexApi': '' });
    const [libraryData, setLibraryData] = useState({
        "display_name": "",
        "library_id": "",
        "version": "",
        "previous_version": "",
        "blocks": []
    });
    const [blocksData, setBlocksData] = useState([]);

    const outlineIndexApi = `${getConfig().STUDIO_BASE_URL}/library/${libraryId}?format=json`
    useEffect(() => {
        setIsLoading(true);
        client.get(outlineIndexApi).then(res => res.data).then(data => setLibraryData(data)).then(() => setIsLoading(false));
    }, [])
    // useEffect(() => {
    //     const fetchBlocks = async () => {
    //         let blocks = [];
    //         for (const value of libraryData.blocks) {
    //             const res = await client.get(`${getConfig().STUDIO_BASE_URL}/xblock/container/${value}`);
    //             blocks.push(res.data);
    //         }
    //         setBlocksData(blocks);
    //     };
    //     fetchBlocks();
    // }, [libraryData]);

    const getDeleteFunction = (blockId) => {
        return () => {
            setLoading(true);
            client.delete(`${getConfig().STUDIO_BASE_URL}/xblock/${blockId}`)
                .then(res => {
                    const index = libraryData.blocks.indexOf(blockId);
                    let blocks = libraryData.blocks;
                    if (index > -1) {
                        blocks.splice(index, 1);
                        setLibraryData({ ...libraryData, blocks: blocks });

                    }
                })
                .catch(e => console.log(e)).finally(e => setLoading(false));

            // http://studio.local.edly.io:8001/xblock/
        }
    }
    const getAddProblemFunction = (type) => {
        return () => {
            setLoading(true);
            const data = { "category": "problem", "type": type, "parent_locator": `lib-block-v1:${libraryId.split(':')[1]}+type@library+block@library` }
            client.post(`${getConfig().STUDIO_BASE_URL}/xblock/`, data).then(res => res.data).then(data => navigate(`/course/${libraryId}/editor/problem/${data.locator}`)).finally(e=>setLoading(false))
        }
    }
    return (
        <>
            <Helmet>
                <title>{getPageHeadTitle(libraryData.display_name, intl.formatMessage(messages.headingTitle, { title: libraryData.display_name }))}</title>
            </Helmet>
            <Container size="xl" className="px-4">
                <section className="course-outline-container mb-4 mt-5">
                    {/* <PageAlerts
                        courseId={libraryData.library_id}
                        notificationDismissUrl={"/"}
                        handleDismissNotification={()=>{}}
                        discussionsSettings={discussionsSettings}
                        discussionsIncontextFeedbackUrl={discussionsIncontextFeedbackUrl}
                        discussionsIncontextLearnmoreUrl={discussionsIncontextLearnmoreUrl}
                        deprecatedBlocksInfo={deprecatedBlocksInfo}
                        proctoringErrors={proctoringErrors}
                        mfeProctoredExamSettingsUrl={mfeProctoredExamSettingsUrl}
                        advanceSettingsUrl={advanceSettingsUrl}
                        savingStatus={savingStatus}
                        errors={errors}
                    /> */}
                    {/* <TransitionReplace>
                        {showSuccessAlert ? (
                            <AlertMessage
                                key={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
                                show={showSuccessAlert}
                                variant="success"
                                icon={CheckCircleIcon}
                                title={intl.formatMessage(messages.alertSuccessTitle)}
                                description={intl.formatMessage(messages.alertSuccessDescription)}
                                aria-hidden="true"
                                aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
                                aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
                            />
                        ) : null}
                    </TransitionReplace> */}

                    <SubHeader
                        title={intl.formatMessage(messages.headingTitle, { title: libraryData.display_name })}
                        subtitle={intl.formatMessage(messages.headingSubtitle)}
                        headerActions={(
                            <>
                                <Button onClick={() => navigate(`/library/${libraryId}/import`)} >
                                    <Download />
                                    Import
                                </Button>
                                <Button>
                                    <Upload />
                                    Export
                                </Button>
                            </>
                        )}
                    />
                    <Layout
                        lg={[{ span: 9 }, { span: 3 }]}
                        md={[{ span: 9 }, { span: 3 }]}
                        sm={[{ span: 12 }, { span: 12 }]}
                        xs={[{ span: 12 }, { span: 12 }]}
                        xl={[{ span: 9 }, { span: 3 }]}
                    >
                        <Layout.Element>
                            <article>
                                <div>
                                    <section className="course-outline-section">
                                        {/* <StatusBar
                                            courseId={libraryId}
                                            isLoading={isLoading}
                                            statusBarData={statusBarData}
                                            openEnableHighlightsModal={openEnableHighlightsModal}
                                            handleVideoSharingOptionChange={handleVideoSharingOptionChange}
                                        /> */}
                                        {!errors?.outlineIndexApi && (
                                            <div className="pt-4">
                                                {libraryData.blocks ? (
                                                    <>
                                                        {/* <SortableContext
                                                            id="root"
                                                            items={blocksData}
                                                            strategy={verticalListSortingStrategy}
                                                        > */}
                                                        {libraryData.blocks.map((blockId, index) => (
                                                            // <Card >
                                                            //     <Card.Header actions={
                                                            //         <TagsSidebar objectId={blockId} client={client} org={libraryId.split(":")[1].split("+", 1)} />
                                                            //     } />
                                                            //     <Link to={`/course/${libraryId}/editor/problem/${blockId}`}>
                                                            //         {blockId}
                                                            //     </Link>
                                                            //     <Card.Footer >
                                                            //         <Button size="sm" onClick={getDeleteFunction(blockId)}>
                                                            //             <Delete />
                                                            //         </Button>
                                                            //     </Card.Footer>

                                                            // </Card>
                                                            <ProblemCard blockId={blockId} libraryId={libraryId} client={client} onDelete={getDeleteFunction(blockId)} />
                                                        ))}
                                                        {/* </SortableContext> */}
                                                        {/* {courseActions.childAddable && (
                                                            <Button
                                                                data-testid="new-section-button"
                                                                className="mt-4"
                                                                variant="outline-primary"
                                                                onClick={handleNewSectionSubmit}
                                                                iconBefore={IconAdd}
                                                                block
                                                            >
                                                                {intl.formatMessage(messages.newSectionButton)}
                                                            </Button>
                                                        )} */}
                                                    </>
                                                ) : (
                                                    <></>
                                                    // <EmptyPlaceholder
                                                    //     onCreateNewSection={handleNewSectionSubmit}
                                                    //     childAddable={courseActions.childAddable}
                                                    // />
                                                )}
                                            </div>
                                        )}
                                        <div className="pt-4">
                                            <Card>
                                                <AddComponentButton type="problem" displayName="Add Problem" onClick={getAddProblemFunction("problem")} />
                                            </Card>
                                        </div>
                                    </section>
                                </div>
                            </article>
                        </Layout.Element>
                        {/* <Layout.Element> */}
                        {/* <OutlineSideBar courseId={libraryData.library_id} /> */}
                        {/* </Layout.Element> */}
                    </Layout>
                    {/* <EnableHighlightsModal
                        isOpen={isEnableHighlightsModalOpen}
                        close={closeEnableHighlightsModal}
                        onEnableHighlightsSubmit={handleEnableHighlightsSubmit}
                    /> */}
                </section>
                {/* <HighlightsModal
                    isOpen={isHighlightsModalOpen}
                    onClose={closeHighlightsModal}
                    onSubmit={handleHighlightsFormSubmit}
                />
                <PublishModal
                    isOpen={isPublishModalOpen}
                    onClose={closePublishModal}
                    onPublishSubmit={handlePublishItemSubmit}
                />
                <ConfigureModal
                    isOpen={isConfigureModalOpen}
                    onClose={handleConfigureModalClose}
                    onConfigureSubmit={handleConfigureItemSubmit}
                    currentItemData={currentItemData}
                    enableProctoredExams={enableProctoredExams}
                />
                <DeleteModal
                    category={deleteCategory}
                    isOpen={isDeleteModalOpen}
                    close={closeDeleteModal}
                    onDeleteSubmit={handleDeleteItemSubmit}
                /> */}
            </Container>
            <div className="alert-toast">
                {/* <ProcessingNotification
                    isShow={isShowProcessingNotification}
                    title={processingNotificationTitle}
                />
                <InternetConnectionAlert
                    isFailed={isInternetConnectionAlertFailed}
                    isQueryPending={savingStatus === RequestStatus.PENDING}
                    onInternetConnectionFailed={handleInternetConnectionFailed}
                /> */}
            </div>
            {/* {toastMessage && (
                <Toast
                    show
                    onClose={() => setToastMessage(null)}
                    data-testid="taxonomy-toast"
                >
                    {toastMessage}
                </Toast>
            )} */}
        </>
    );
}


LibraryContents.propTypes = {
    // intl: intlShape.isRequired,
    setLoading: PropTypes.func
};

export default injectIntl(LibraryContents);
