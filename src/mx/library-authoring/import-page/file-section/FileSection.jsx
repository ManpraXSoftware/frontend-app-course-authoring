import React, { useState } from 'react';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Dropzone } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import messages from './messages';
import { useNavigate } from 'react-router';
// import Loading from 'CourseAuthoring/generic/Loading';
const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
const getImportStatusApiUrl = (libraryId, fileName) => `${getApiBaseUrl()}/import_status/${libraryId}/${fileName}`;
const postImportLibraryApiUrl = (libraryId) => `${getApiBaseUrl()}/api/import_library/${libraryId}`;

const startLibraryImporting = async (libraryId, fileData, requestConfig, updateProgress) => {

  const chunkSize = 20 * 1000000; // 20 MB
  const fileSize = fileData.size || 0;
  const chunkLength = Math.ceil(fileSize / chunkSize);
  let resp;
  const upload = async (blob, start, stop, index) => {
    const contentRange = `bytes ${start}-${stop}/${fileSize}`;
    const contentDisposition = `attachment; filename="${fileData.name}"`;
    const headers = {
      'Content-Disposition': contentDisposition,
    };
    const formData = new FormData();
    formData.append('library-data', blob, fileData.name);
    const { data } = await getAuthenticatedHttpClient()
      .post(
        postImportLibraryApiUrl(libraryId),
        formData,
        { headers, ...requestConfig },
      );
    const percent = Math.trunc(((1 / chunkLength) * (index + 1)) * 100);
    updateProgress(percent);
    resp = camelCaseObject(data);
  };

  const chunkUpload = async (file, index) => {
    const start = index * chunkSize;
    const stop = start + chunkSize < fileSize ? start + chunkSize : fileSize;
    const blob = file.slice(start, stop, file.type);
    await upload(blob, start, stop - 1, index);
  };

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < chunkLength; i++) {
    await chunkUpload(fileData, i);
  }

  return resp;
}

const FileSection = ({ intl, libraryId, importTriggered, setImportTriggered }) => {
  const IMPORT_STAGES = {
    UPLOADING: 0,
    UNPACKING: 1,
    VERIFYING: 2,
    UPDATING: 3,
    SUCCESS: 4,
  };
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const [hasError, setError] = useState(false);
  const isShowedDropzone = !importTriggered || currentStage === IMPORT_STAGES.SUCCESS || hasError;
  const [progress, setProgress] = useState(0);
  const handleProcessUpload = async (libraryId, fileData, requestConfig, handleError) => {
    try {
      // setLoading(true);
      const file = fileData.get('file');
      // dispatch(reset());
      // dispatch(updateSavingStatus(RequestStatus.PENDING));
      setFileName(file.name);
      setImportTriggered(true);
      const { importStatus } = await startLibraryImporting(
        libraryId,
        file,
        requestConfig,
        (percent) => setProgress(percent),
      );
      setCurrentStage(importStatus);
      // setLoading(false);
      // setImportCookie(moment().valueOf(), importStatus === IMPORT_STAGES.SUCCESS, file.name);
      // dispatch(updateSavingStatus(RequestStatus.SUCCESSFUL));
      setImportTriggered(false);
      navigate(`/library/${libraryId}`);
    } catch (error) {
      handleError(error);
      setImportTriggered(false);
      setFileName("");
      setCurrentStage("");
      setError(true);
      // setLoading(false);
      // dispatch(updateSavingStatus(RequestStatus.FAILED));
      return false;
    }

  }


  () => {
    return async (dispatch) => {
      try {
        const file = fileData.get('file');
        setFileName(file.name);
        const { importStatus } = await startLibraryImporting(
          libraryId,
          file,
          requestConfig,
          (percent) => setProgress(percent),
        );
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    };
  }

  return (
    <Card>
      <Card.Header
        className="h3 px-3 text-black"
        title={intl.formatMessage(messages.headingTitle)}
        subtitle={fileName && intl.formatMessage(messages.fileChosen, { fileName })}
      />
      <Card.Section className="px-3 pt-2 pb-4">
        {isShowedDropzone
          && (
            <Dropzone
              onProcessUpload={
                ({ fileData, requestConfig, handleError }) => handleProcessUpload(libraryId, fileData, requestConfig, handleError,)
              }
              accept={{ 'text/csv': ['.csv'] }}
              data-testid="dropzone"
            />
          )}
      </Card.Section>
    </Card>
  );
};

FileSection.propTypes = {
  intl: intlShape.isRequired,
  libraryId: PropTypes.string.isRequired,
  importTriggered: PropTypes.func.isRequired,
  setImportTriggered: PropTypes.func.isRequired,
};

export default injectIntl(FileSection);
