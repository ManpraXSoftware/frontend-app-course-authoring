import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Image } from '@openedx/paragon';
import { FormattedMessage, injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import { COURSE_BLOCK_NAMES } from '../../constants';
import { getConfig } from '@edx/frontend-platform';

const CustomTab = ({
  values,
  setFieldValue,
  category,
}) => {
  const intl = useIntl();
  const visibilityTitle = COURSE_BLOCK_NAMES[category]?.name;

  const {
    displayImage,
  } = values;

  const getCustomValue = () => {
    return `${getConfig().LMS_BASE_URL}${displayImage}`;
  };

  const getCompleteUrl = (source, url) => {
    const baseUrls = {
        lms: getConfig().LMS_BASE_URL,
        cms: getConfig().STUDIO_BASE_URL
    };

    source = source.toLowerCase();
    url = url.trim();

    if (baseUrls[source] && !url.startsWith(baseUrls[source])) {
        if (!url.startsWith("/")) {
            url = "/" + url;
        }
        return baseUrls[source] + url;
    }

    return url;
};




  const handleChange = (e) => {
    setFieldValue('displayImage', e.target.value);
  };

  return (
    <Container fluid>
      <h5 className="mt-4 text-gray-700">
        {intl.formatMessage(messages.customSectionTitle, { visibilityTitle })}
      </h5>
      <hr />
      <>
        <Form.Group
          name="customConfigs"
          onChange={handleChange}
          value={getCustomValue()}
        >
          <Form.Label>
            <FormattedMessage {...messages.displayImageLabel} />
          </Form.Label>
          <br />
          <Image thumbnail src={getCompleteUrl('lms', displayImage)} style={{ maxHeight: '40vh', maxWidth: '40vw' }} fluid st alt="Image not found" />
          <br />
          <br />
          <Form.Control value={displayImage} />

          <Form.Text>
            <FormattedMessage {...messages.displayImageDescription} />
          </Form.Text>

        </Form.Group>
        {/* {showWarning && (
          <Alert className="mt-2" variant="warning">
            <FormattedMessage {...messages.subsectionVisibilityWarning} />
          </Alert>
        )} */}
      </>
    </Container>
  );
};

CustomTab.propTypes = {
  values: PropTypes.shape({
    displayImage: PropTypes.string.isRequired,
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};

export default injectIntl(CustomTab);
