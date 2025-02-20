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


// Utility Functions
const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
const getImportStatusApiUrl = (libraryId, fileName) => `${getApiBaseUrl()}/api/import_status/${libraryId}/${fileName}`;
const postImportLibraryApiUrl = (libraryId) => `${getApiBaseUrl()}/api/import_library/${libraryId}`;

const startLibraryImporting = async (libraryId, fileData, requestConfig, updateProgress) => {

  const chunkSize = 20 * 1000000; // 20 MB
  const fileSize = fileData.size || 0;
  const chunkCount = Math.ceil(fileSize / chunkSize);
  let response;

  const uploadChunk = async (blob, start, stop, index) => {
    try {
    const contentRange = `bytes ${start}-${stop}/${fileSize}`;
    const headers = {
        'Content-Disposition': `attachment; filename="${fileData.name}"`,
    };
    const formData = new FormData();
    formData.append('library-data', blob, fileData.name);
    const { data } = await getAuthenticatedHttpClient()
      .post(
        postImportLibraryApiUrl(libraryId),
        formData,
        { headers, ...requestConfig },
      );
      const progressPercent = Math.trunc(((index + 1) / chunkCount) * 100);
      updateProgress(progressPercent);
      response = camelCaseObject(data);
    } catch (error) {
      console.error('Error uploading chunk:', error);
      throw new Error('Failed to upload a file chunk. Please try again.');
    }
  };

  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize;
    const stop = Math.min(start + chunkSize, fileSize);
    const blob = fileData.slice(start, stop, fileData.type);
    await uploadChunk(blob, start, stop - 1, i);
  }

  return response;
  };

const pollImportStatus = async (libraryId, fileName, updateStage, resetState, navigate) => {
  const pollInterval = 3000; // 3 seconds
  const statusApiUrl = getImportStatusApiUrl(libraryId, fileName);

  const checkStatus = async () => {
    try {
      const { data } = await getAuthenticatedHttpClient().get(statusApiUrl);
      const { importStatus } = camelCaseObject(data);
      updateStage(importStatus);
      if (importStatus === 6) {
        resetState(false)
        navigate(`/library/${libraryId}`);
      } else if (importStatus < 0) {
        resetState()
        throw new Error('Import failed. Please try again.');
      } else {
        setTimeout(checkStatus, pollInterval); // Continue polling
      }
    } catch (error) {
      console.error('Polling failed:', error);
      resetState();
  }
  };

  checkStatus();
};

// Main Component
const FileSection = ({ intl, libraryId, importTriggered, setImportTriggered }) => {
  const IMPORT_STAGES = {
    UPLOADING: 0,
    CONVERTING: 1,
    UNPACKING: 2,
    VERIFYING: 3,
    UPDATING: 4,
    TAGGING: 5,
    SUCCESS: 6,
  };
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const [hasError, setError] = useState(false);
  const isDropzoneVisible = !importTriggered || currentStage === IMPORT_STAGES.SUCCESS || hasError;
  const [progress, setProgress] = useState(0);
  const handleProcessUpload = async (libraryId, fileData, requestConfig, handleError) => {
    try {
      const file = fileData.get('file');
      setFileName(file.name);
      setImportTriggered(true);
      const response = await startLibraryImporting(
        libraryId,
        file,
        requestConfig,
        (percent) => setProgress(percent),
      );

      if (response.importStatus < 6) {
        // Begin polling for import status
        pollImportStatus(libraryId, file.name, setCurrentStage, resetState, navigate);
      } else {
        setCurrentStage(response.importStatus);
        resetState(false)
      navigate(`/library/${libraryId}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      handleError(error);
      resetState();
    }
  };

  const resetState = (error=true) => {
    setFileName('');
    setCurrentStage('');
    setError(error);
    setProgress(0);
    setImportTriggered(false);
  };

  return (
    <Card>
      <Card.Header
        className="h3 px-3 text-black"
        title={intl.formatMessage(messages.headingTitle)}
        subtitle={fileName && intl.formatMessage(messages.fileChosen, { fileName })}
      />
      <Card.Section className="px-3 pt-2 pb-4">
        {isDropzoneVisible 
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
  importTriggered: PropTypes.bool.isRequired,
  setImportTriggered: PropTypes.func.isRequired,
};

export default injectIntl(FileSection);
