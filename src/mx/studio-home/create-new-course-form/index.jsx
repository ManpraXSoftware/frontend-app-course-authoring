import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { CreateOrRerunCourseForm } from '../../../generic/create-or-rerun-course';
import messages from './messages';

const CreateNewCourseForm = ({ handleOnClickCancel, content_type }) => {
  const intl = useIntl();
  const initialNewCourseData = {
    displayName: '',
    org: '',
    number: '',
    run: '',
  };

  return (
    <div className="mb-4.5" data-testid="create-course-form">
      <CreateOrRerunCourseForm
        title={intl.formatMessage(messages.createNewCourse, { content_type: content_type })}
        initialValues={initialNewCourseData}
        onClickCancel={handleOnClickCancel}
        content_type = {content_type}
        isCreateNewCourse
      />
    </div>
  );
};

CreateNewCourseForm.propTypes = {
  handleOnClickCancel: PropTypes.func.isRequired,
  content_type: PropTypes.string.isRequired,
};

export default CreateNewCourseForm;
