import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Image, useToggle, Stack } from '@openedx/paragon';
import { FormattedMessage, injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import SelectImageModal from '@edx/frontend-lib-content-components/dist/editors/sharedComponents/ImageUploadModal/SelectImageModal';
import { connect } from 'react-redux';
import * as helpers from './customTabHelpers'
import { getConfig } from '@edx/frontend-platform';
import { renderToStaticMarkup } from "react-dom/server";
import { selectors } from '@edx/frontend-lib-content-components/dist/editors/data/redux'


const CustomTab = (
  {
    values,
    setFieldValue,
    category,
    // from redux
    assets,
  }
) => {
  const intl = useIntl();
  const lmsEndpointUrl = getConfig().LMS_BASE_URL;
  const studioEndpointUrl = getConfig().STUDIO_BASE_URL;

  const [isDisplayImageModalOpen, openSelectImageModal, closeDisplayImageModal] = useToggle(false);

  const setDisplayImageModalSelection = (val) => {
    setFieldValue('displayImage', val.url);
    setEditorContentHtml(getEditorContentHtml(val.url));
    closeDisplayImageModal();
  }
  const clearDisplayImageModalSelection = () => setDisplayImageModalSelection({ url: "" });
  const getCompleteUrl = (source, url) => {
    const baseUrls = { lms: lmsEndpointUrl, cms: studioEndpointUrl };
    return baseUrls[source.toLowerCase()] && !url.startsWith(baseUrls[source.toLowerCase()])
      ? `${baseUrls[source.toLowerCase()]}${url.startsWith('/') ? '' : '/'}${url}`
      : url;
  };
  const { displayImage } = values;
  const getEditorContentHtml = (val) => renderToStaticMarkup(
    <Container id="selected-image">
      <Image
        thumbnail
        src={getCompleteUrl("lms", val)}
        style={{ maxHeight: "40vh", maxWidth: "40vw" }}
        fluid
        alt="Image not found"
      />
    </Container>
  );
  const initialEditorContentHtml = getEditorContentHtml(displayImage);
  const [editorContentHtml, setEditorContentHtml] = useState(initialEditorContentHtml);
  const { imagesRef, refReady } = helpers.useImages({ assets: assets.images ? assets.images : {}, editorContentHtml });


  const handleChange = (e) => setFieldValue('displayImage', e.target.value);
  if (!refReady) {
    return null;
  }
  return (
    <Container fluid>
      <h5 className="mt-4 text-gray-700">
        {intl.formatMessage(messages.customSectionTitle)}
      </h5>
      <hr />
      <Form.Group name="customConfigs" onChange={handleChange} value={displayImage}>
        <Form.Label>
          <FormattedMessage {...messages.displayImageLabel} />
        </Form.Label>
        <br />
        {displayImage && <div dangerouslySetInnerHTML={{ __html: editorContentHtml }} />}
        {!displayImage && <div>{intl.formatMessage(messages.noDisplayImageSelectedMessage)}</div>}
        <br /><br />
        <Form.Row>
          <Form.Control value={displayImage} readOnly={true} />
          <Stack gap={2} direction="horizontal">
            <Button onClick={openSelectImageModal}>{intl.formatMessage(messages.pickDisplayImageButton)}</Button>
            <Button onClick={clearDisplayImageModalSelection}>{intl.formatMessage(messages.clearDisplayImageButton)}</Button>
          </Stack>
        </Form.Row>
        <Form.Text>
          <FormattedMessage {...messages.displayImageDescription} />
        </Form.Text>
      </Form.Group>

      <SelectImageModal
        isOpen={isDisplayImageModalOpen}
        close={closeDisplayImageModal}
        setSelection={setDisplayImageModalSelection}
        clearSelection={clearDisplayImageModalSelection}
        images={imagesRef}
      />
    </Container>
  );
};


CustomTab.defaultProps = {
  values: {
    displayImage: "",
  },
  setFieldValue: () => { },
  category: "",
  assets: null,
};


CustomTab.propTypes = {
  values: PropTypes.shape({
    displayImage: PropTypes.string.isRequired,
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  assets: PropTypes.shape({}),
};


export const mapStateToProps = (state) => ({
  assets: selectors.app.assets(state),
});

export default (connect(mapStateToProps)(injectIntl(CustomTab)));
// export default injectIntl(CustomTab);