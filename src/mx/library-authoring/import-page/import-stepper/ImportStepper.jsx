import React, { useEffect } from 'react';
import {
  FormattedDate,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@openedx/paragon';
import { useNavigate } from 'react-router';

import { RequestStatus } from '../../../../data/constants';
import LibraryStepper from '../../library-stepper';
import { IMPORT_STAGES } from '../data/constants';
import { fetchImportStatus } from '../data/thunks';
import {
  getCurrentStage, getError, getFileName, getLoadingStatus, getProgress, getSavingStatus, getSuccessDate,
} from '../data/selectors';
import messages from './messages';

const ImportStepper = ({ intl, libraryId }) => {
  const currentStage = useSelector(getCurrentStage);
  const fileName = useSelector(getFileName);
  const { hasError, message: errorMessage } = useSelector(getError);
  const progress = useSelector(getProgress);
  const dispatch = useDispatch();
  const loadingStatus = useSelector(getLoadingStatus);
  const savingStatus = useSelector(getSavingStatus);
  const successDate = useSelector(getSuccessDate);
  const isStopFetching = currentStage === IMPORT_STAGES.SUCCESS
    || loadingStatus === RequestStatus.FAILED
    || savingStatus === RequestStatus.FAILED
    || hasError;
  const formattedErrorMessage = hasError ? errorMessage || intl.formatMessage(messages.defaultErrorMessage) : '';

  useEffect(() => {
    const id = setInterval(() => {
      if (isStopFetching) {
        clearInterval(id);
      } else if (fileName) {
        dispatch(fetchImportStatus(libraryId, fileName));
      }
    }, 3000);
    return () => clearInterval(id);
  });

  let successTitle = intl.formatMessage(messages.stepperSuccessTitle);
  const localizedSuccessDate = successDate ? (
    <FormattedDate
      value={successDate}
      year="2-digit"
      month="2-digit"
      day="2-digit"
      hour="numeric"
      minute="numeric"
    />
  ) : null;
  if (localizedSuccessDate && currentStage === IMPORT_STAGES.SUCCESS) {
    const successWithDate = (
      <>
        {successTitle} ({localizedSuccessDate})
      </>
    );
    successTitle = successWithDate;
  }
 
  const navigate = useNavigate();
  const handleRedirectLibraryOutline = () => navigate(`/library/${libraryId}`);

  const steps = [
    {
      title: intl.formatMessage(messages.stepperUploadingTitle),
      description: intl.formatMessage(messages.stepperUploadingDescription),
      key: IMPORT_STAGES.UPLOADING,
    }, {
      title: intl.formatMessage(messages.stepperConvertingTitle),
      description: intl.formatMessage(messages.stepperConvertingDescription),
      key: IMPORT_STAGES.CONVERTING,
    }, {
      title: intl.formatMessage(messages.stepperUnpackingTitle),
      description: intl.formatMessage(messages.stepperUnpackingDescription),
      key: IMPORT_STAGES.UNPACKING,
    }, {
      title: intl.formatMessage(messages.stepperVerifyingTitle),
      description: intl.formatMessage(messages.stepperVerifyingDescription),
      key: IMPORT_STAGES.VERIFYING,
    }, {
      title: intl.formatMessage(messages.stepperUpdatingTitle),
      description: intl.formatMessage(messages.stepperUpdatingDescription),
      key: IMPORT_STAGES.UPDATING,
    }, {
      title: intl.formatMessage(messages.stepperTaggingTitle),
      description: intl.formatMessage(messages.stepperTaggingDescription),
      key: IMPORT_STAGES.TAGGING,
    }, {
      title: successTitle,
      description: intl.formatMessage(messages.stepperSuccessDescription),
      key: IMPORT_STAGES.SUCCESS,
    },
  ];

  return (
    <section>
      <h3 className="mt-4">{intl.formatMessage(messages.stepperHeaderTitle)}</h3>
      <LibraryStepper
        libraryId={libraryId}
        percent={currentStage === IMPORT_STAGES.UPLOADING ? progress : null}
        steps={steps}
        activeKey={currentStage}
        hasError={hasError}
        errorMessage={formattedErrorMessage}
      />
      {currentStage === IMPORT_STAGES.SUCCESS && (
        <Button className="ml-5.5 mt-n2.5" onClick={handleRedirectLibraryOutline}>{intl.formatMessage(messages.viewOutlineButton)}</Button>
      )}
    </section>
  );
};

ImportStepper.propTypes = {
  intl: intlShape.isRequired,
  libraryId: PropTypes.string.isRequired,
};

export default injectIntl(ImportStepper);
