/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, Layout,
} from '@openedx/paragon';
import Cookies from 'universal-cookie';
import { Helmet } from 'react-helmet';
import Loading from 'CourseAuthoring/generic/Loading';
import SubHeader from '../../../generic/sub-header/SubHeader';
import InternetConnectionAlert from '../../../generic/internet-connection-alert';
import { RequestStatus } from '../../../data/constants';
import { useModel } from '../../../generic/model-store';
import ImportStepper from '../../../import-page/import-stepper/ImportStepper';
import ImportSidebar from '../../../import-page/import-sidebar/ImportSidebar';
import FileSection from './file-section/FileSection';
import messages from './messages';

const LibraryImportPage = ({ intl, libraryId, setLoading }) => {
  const [fileName, setFileName] = useState("")
  const [importTriggered, _setImportTriggered] = useState(false)
  const [savingStatus, setSavingStatus] = useState("")
  const [successDate, setSuccessDate] = useState("")
  const libraryDetails = useModel('libraryDetails', libraryId);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const anyRequestFailed = savingStatus === RequestStatus.FAILED || loadingStatus === RequestStatus.FAILED;
  const anyRequestInProgress = savingStatus === RequestStatus.PENDING || loadingStatus === RequestStatus.IN_PROGRESS;
  const setImportTriggered = (v) => { setLoading(v); _setImportTriggered(v) }
  useEffect(() => {
    // const cookieData = cookies.get(LAST_IMPORT_COOKIE_NAME);
    // if (cookieData) {
    //   dispatch(setSavingStatus(RequestStatus.SUCCESSFUL));
    // setImportTriggered(true);
    //   dispatch(setFileName(cookieData.fileName));
    //   dispatch(setSuccessDate(cookieData.date));
    // }
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, {
            headingTitle: intl.formatMessage(messages.headingTitle),
            libraryName: libraryDetails?.display_name,
            siteName: process.env.SITE_NAME,
          })}
        </title>
      </Helmet>
      <Container size="xl" className="mt-4 px-4 import">
        <section className="setting-items mb-4">
          <Layout
            lg={[{ span: 9 }, { span: 3 }]}
            md={[{ span: 9 }, { span: 3 }]}
            sm={[{ span: 9 }, { span: 3 }]}
            xs={[{ span: 9 }, { span: 3 }]}
            xl={[{ span: 9 }, { span: 3 }]}
          >
            <Layout.Element>
              <article>
                <SubHeader
                  title={intl.formatMessage(messages.headingTitle)}
                  subtitle={intl.formatMessage(messages.headingSubtitle)}
                />
                <p className="small">{intl.formatMessage(messages.description1)}</p>
                <p className="small">{intl.formatMessage(messages.description2)}</p>
                <p className="small">Example csv:</p>
                <p>
                  <table>
                    <tr>
                      <th>problem_id,</th>
                      <th>display_name,</th>
                      <th>problem_type,</th>
                      <th>question,</th>
                      <th>options,</th>
                      <th>correct_options,</th>
                      <th>weight</th>
                    </tr>
                    <tr>
                      <td>,</td >
                      <td>Single Select Example,</td >
                      <td>single-select,</td >
                      <td>What is 2+2?,</td >
                      <td>2|3|4|5,</td >
                      <td>4,</td >
                      <td></td>
                    </tr>
                    <tr><td>,</td >
                      <td>Multi Select Example,</td >
                      <td>multi-select,</td >
                      <td>Select all prime numbers,</td >
                      <td>2|3|4|5,</td >
                      <td>2|3|5,</td >
                      <td></td>
                    </tr>
                  </table>
                </p>
                <p>
                  <b>Guidelines for CSV:</b>
                  <br />
                  <ol>
                    <li>Leave problem_id blank if you want to generate new hash for the problem.</li>
                    <li>problem_type can only be one of single-select or multi-select.</li>
                    <li>Leave weight empty to set it to 1.0</li>
                  </ol>
                </p>
                <p>
                  Available tags are:
                  <br />
                  http://studio.local.edly.io:8001/api/content_tagging/v1/taxonomies/?enabled=true&org=mx
                  http://studio.local.edly.io:8001/api/content_tagging/v1/taxonomies/3/tags/?page=1&full_depth_threshold=1000

                </p>
                {/* <p className="small">{intl.formatMessage(messages.description3)}</p> */}
                <FileSection libraryId={libraryId} importTriggered={importTriggered} setImportTriggered={setImportTriggered} />
                {/* {importTriggered && <ImportStepper libraryId={libraryId} />} */}
              </article>
            </Layout.Element>
            <Layout.Element>
              {/* <ImportSidebar libraryId={libraryId} /> */}
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        <InternetConnectionAlert
          isFailed={anyRequestFailed}
          isQueryPending={anyRequestInProgress}
          onInternetConnectionFailed={() => null}
        />
      </div>
    </>
  );
};

LibraryImportPage.propTypes = {
  intl: intlShape.isRequired,
  libraryId: PropTypes.string.isRequired,
  setLoading: PropTypes.func
};

LibraryImportPage.defaultProps = {};

export default injectIntl(LibraryImportPage);
