import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const postImportLibraryApiUrl = (libraryId) => `${getApiBaseUrl()}/api/import_library/${libraryId}`;
export const getLibraryImportStatusApiUrl = (libraryId, fileName) => `${getApiBaseUrl()}/api/import_status/${libraryId}/${fileName}`;

/**
 * Start import library.
 * @param {string} libraryId
 * @param {Object} fileData
 * @param {Object} requestConfig
 * @returns {Promise<Object>}
 */
export async function startLibraryImporting(libraryId, fileData, requestConfig, updateProgress) {
  const chunkSize = 20 * 1000000; // 20 MB
  const fileSize = fileData.size || 0;
  const chunkLength = Math.ceil(fileSize / chunkSize);
  let resp;
  const upload = async (blob, start, stop, index) => {
    const contentRange = `bytes ${start}-${stop}/${fileSize}`;
    const contentDisposition = `attachment; filename="${fileData.name}"`;
    const headers = {
      'Content-Range': contentRange,
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

/**
 * Get import status.
 * @param {string} libraryId
 * @param {string} fileName
 * @returns {Promise<Object>}
 */
export async function getImportStatus(libraryId, fileName) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getLibraryImportStatusApiUrl(libraryId, fileName));
  return camelCaseObject(data);
}
