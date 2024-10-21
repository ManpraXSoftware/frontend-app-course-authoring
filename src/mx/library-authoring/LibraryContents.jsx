// @ts-check
import React, { useEffect, useState } from "react";
import { injectIntl } from '@edx/frontend-platform/i18n';
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
    Pagination,
} from '@openedx/paragon';
import {
    Download,
    Upload,
} from '@openedx/paragon/icons';
import SubHeader from '../../generic/sub-header/SubHeader';
import AddComponentButton from "../../course-unit/add-component/add-component-btn";
import { useNavigate } from 'react-router-dom';
import ProblemCard from "./problem-card";
import FiltersBar from "./filters-bar";

const LibraryContents = ({ setLoading }) => {
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const client = getAuthenticatedHttpClient();
    const intl = useIntl();
    const { libraryId } = useParams(); /** @type {string} */
    const [isLoading, setIsLoading] = useState(false);
    const [taxonomies, setTaxonomies] = useState({ competencies: { id: 0, depthThreshold: 0 }, complexities: { id: 0, depthThreshold: 0 } });
    const [errors, setErrors] = useState({ 'outlineIndexApi': '' });
    const [libraryData, setLibraryData] = useState({
        "display_name": "",
        "library_id": "",
        "version": "",
        "previous_version": "",
        "blocks": []
    });
    const [showBlocks, setShowBlocks] = useState([]);

    const outlineIndexApi = `${getConfig().STUDIO_BASE_URL}/api/library_content/${libraryId}`;
    useEffect(() => {
        client.get(`${getConfig().STUDIO_BASE_URL}/api/content_tagging/v1/taxonomies/`)
            .then(res => {
                let t = { competencies: { id: 0, depthThreshold: 0 }, complexities: { id: 0, depthThreshold: 0 } };
                res.data.results.forEach((v) => {
                    if (v.name === "Competencies") {
                        t.competencies.id = v.id;
                        t.competencies.depthThreshold = v.tags_count;
                    } else if (v.name === "Complexities") {
                        t.complexities.id = v.id;
                        t.complexities.depthThreshold = v.tags_count;
                    }
                });
                setTaxonomies(t);
            })
    }, [])

    const getOutlineIndex = (filters = {}) => {
        setIsLoading(true);
        client.get(outlineIndexApi, { params: filters }).then(res => res.data).then(data => {
            setLibraryData(data);
            setPage(1);
        }).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        getOutlineIndex()
    }, [outlineIndexApi, client]);

    useEffect(() => {
        setPageCount(Math.ceil(libraryData.blocks.length / pageSize));
        const start = (page - 1) * pageSize;
        const end = Math.min(pageSize * page, libraryData.blocks.length);
        setShowBlocks(libraryData.blocks.slice(start, end));
    }, [page, libraryData, pageSize]);

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
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }

    const getAddProblemFunction = (type) => {
        return () => {
            setLoading(true);
            const data = { "category": "problem", "type": type, "parent_locator": `lib-block-v1:${libraryId.split(':')[1]}+type@library+block@library` };
            client.post(`${getConfig().STUDIO_BASE_URL}/xblock/`, data)
                .then(res => res.data)
                .then(data => navigate(`/library/${libraryId}/editor/problem/${data.locator}`))
                .finally(() => setLoading(false));
        }
    }

    const exportFunction = async () => {
        setLoading(true);
        try {
            let status = await client.post(`${getConfig().STUDIO_BASE_URL}/export/${libraryId}`);
            if (status.data.ExportStatus === 1) {
                status = await client.get(`${getConfig().STUDIO_BASE_URL}/export_status/${libraryId}`);
            }
            if (status.data.ExportStatus === 3) {
                // Perform the file download
                const response = await client.get(`${getConfig().STUDIO_BASE_URL}/api/export_library/${libraryId}`, {
                    responseType: 'blob', // Important: This ensures the response is treated as a blob
                });

                // Create a URL for the blob object
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));

                // Create a link element and trigger the download
                const link = document.createElement('a');
                link.href = url;
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);

                // Clean up the URL object
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Helmet>
                <title>{getPageHeadTitle(libraryData.display_name, intl.formatMessage(messages.headingTitle, { title: libraryData.display_name }))}</title>
            </Helmet>
            <Container size="xl" className="px-4">
                <section className="course-outline-container mb-4 mt-5">
                    <SubHeader
                        title={intl.formatMessage(messages.headingTitle, { title: libraryData.display_name })}
                        subtitle={intl.formatMessage(messages.headingSubtitle)}
                        headerActions={(
                            <>
                                <Button onClick={() => navigate(`/library/${libraryId}/import`)}>
                                    <Download />
                                    Import
                                </Button>
                                <Button onClick={exportFunction}>
                                    <Upload />
                                    Export
                                </Button>
                            </>
                        )}
                    />

                    <FiltersBar taxonomies={taxonomies} client={client} libraryId={libraryId} onApply={getOutlineIndex} />

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
                                        {!errors?.outlineIndexApi && (
                                            <div className="pt-4">
                                                {showBlocks.length > 0 ? (
                                                    showBlocks.map((blockId) => (
                                                        <ProblemCard
                                                            key={blockId}
                                                            blockId={blockId}
                                                            libraryId={libraryId}
                                                            client={client}
                                                            taxonomies={taxonomies}
                                                            onDelete={getDeleteFunction(blockId)}
                                                        />
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        )}
                                        <Pagination
                                            currentPage={page}
                                            paginationLabel="pagination navigation"
                                            pageCount={pageCount}
                                            variant="reduced"
                                            onPageSelect={(page) => setPage(page)}
                                        />

                                        <div className="pt-4">
                                            <Card>
                                                <AddComponentButton type="problem" displayName="Add Problem" onClick={getAddProblemFunction("problem")} />
                                            </Card>
                                        </div>
                                    </section>
                                </div>
                            </article>
                        </Layout.Element>
                    </Layout>
                </section>
            </Container>
        </>
    );
}

LibraryContents.propTypes = {
    setLoading: PropTypes.func
};

export default injectIntl(LibraryContents);
