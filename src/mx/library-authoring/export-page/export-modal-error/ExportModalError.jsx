import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { Error as ErrorIcon } from '@openedx/paragon/icons';

import ModalNotification from '../../../../generic/modal-notification';
import { getError, getIsErrorModalOpen } from '../data/selectors';
import { updateIsErrorModalOpen } from '../data/slice';
import messages from './messages';

const ExportModalError = ({
  intl,
  libraryId,
}) => {
  const dispatch = useDispatch();
  const isErrorModalOpen = useSelector(getIsErrorModalOpen);
  const { msg: errorMessage, unitUrl: unitErrorUrl } = useSelector(getError);

  const handleUnitRedirect = () => { window.location.assign(unitErrorUrl); };
  const handleRedirectLibraryHome = () => { window.location.assign(`${getConfig().STUDIO_BASE_URL}/course/${libraryId}`); };
  return (
    <ModalNotification
      isOpen={isErrorModalOpen}
      title={intl.formatMessage(messages.errorTitle)}
      message={
        intl.formatMessage(
          unitErrorUrl
            ? messages.errorDescriptionUnit
            : messages.errorDescriptionNotUnit,
          { errorMessage },
        )
      }
      cancelButtonText={
        intl.formatMessage(unitErrorUrl ? messages.errorCancelButtonUnit : messages.errorCancelButtonNotUnit)
      }
      actionButtonText={
        intl.formatMessage(unitErrorUrl ? messages.errorActionButtonUnit : messages.errorActionButtonNotUnit)
      }
      handleCancel={() => dispatch(updateIsErrorModalOpen(false))}
      handleAction={unitErrorUrl ? handleUnitRedirect : handleRedirectLibraryHome}
      variant="danger"
      icon={ErrorIcon}
    />
  );
};

ExportModalError.propTypes = {
  intl: intlShape.isRequired,
  libraryId: PropTypes.string.isRequired,
};

ExportModalError.defaultProps = {};

export default injectIntl(ExportModalError);
