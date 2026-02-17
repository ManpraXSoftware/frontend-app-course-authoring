import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { Quiz as QuizIcon } from '@openedx/paragon/icons';  // assuming you want QuizIcon

const MXProgressThreshold = ({
  progressThreshold = 0,
  useProgramThreshold = false,
}) => {
  const intl = useIntl();

  // Nothing to show
  if (progressThreshold <= 0 && !useProgramThreshold) {
    return null;
  }

  const showCourseThreshold = progressThreshold > 0;
  const showProgramThreshold = useProgramThreshold;


  return (
    <div
      className="text-secondary-400 mt-1"
      data-testid="mx-progress-threshold"
    >
      {/* Course-level threshold */}
      {showCourseThreshold && !showProgramThreshold && (
        <div className="d-flex align-items-start mb-1">
          <Icon
            src={QuizIcon}
            size="sm"
            className="mt-1 mr-2"
          />
          <div className="d-flex flex-column">
            <span className="fw-semibold">
              Progress Threshold
            </span>
            {progressThreshold && (
              <small className="text-muted">
                {progressThreshold}% of this course required
              </small>
            )}
          </div>
        </div>
      )}

      {/* Program-level threshold */}
      {showProgramThreshold && (
        <div className="d-flex align-items-start">
          <Icon
            src={QuizIcon}   // ← or use a different icon, e.g. GroupWork, Language, etc.
            size="sm"
            className="mt-1 mr-2"
          />
          <div className="d-flex flex-column">
            <span className="fw-semibold">
              Program Threshold
            </span>
            <small className="text-muted">
              All linked courses must meet their progress requirements
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

MXProgressThreshold.propTypes = {
  progressThreshold: PropTypes.number,
  useProgramThreshold: PropTypes.bool,
};

MXProgressThreshold.defaultProps = {
  progressThreshold: 0,
  useProgramThreshold: false,
};

export default MXProgressThreshold;