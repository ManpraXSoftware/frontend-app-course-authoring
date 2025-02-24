import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  stepperUploadingTitle: {
    id: 'library-authoring.import.stepper.title.uploading',
    defaultMessage: 'Uploading',
  },
  stepperConvertingTitle: {
    id: 'library-authoring.import.stepper.title.converting',
    defaultMessage: 'Converting',
  },
  stepperUnpackingTitle: {
    id: 'library-authoring.import.stepper.title.unpacking',
    defaultMessage: 'Unpacking',
  },
  stepperVerifyingTitle: {
    id: 'library-authoring.import.stepper.title.verifying',
    defaultMessage: 'Verifying',
  },
  stepperUpdatingTitle: {
    id: 'library-authoring.import.stepper.title.updating',
    defaultMessage: 'Updating library',
  },
  stepperTaggingTitle: {
    id: 'library-authoring.import.stepper.title.tagging',
    defaultMessage: 'Tagging library',
  },
  stepperSuccessTitle: {
    id: 'library-authoring.import.stepper.title.success',
    defaultMessage: 'Success',
  },
  stepperUploadingDescription: {
    id: 'library-authoring.import.stepper.description.uploading',
    defaultMessage: 'Transferring your file to our servers',
  },
  stepperConvertingDescription: {
    id: 'library-authoring.import.stepper.description.converting',
    defaultMessage: 'Converting the uploaded csv to olx for processing.',
  },
  stepperUnpackingDescription: {
    id: 'library-authoring.import.stepper.description.unpacking',
    defaultMessage: 'Expanding and preparing folder/file structure (You can now leave this page safely, but avoid making drastic changes to content until this import is complete)',
  },
  stepperVerifyingDescription: {
    id: 'library-authoring.import.stepper.description.verifying',
    defaultMessage: 'Reviewing semantics, syntax, and required data',
  },
  stepperUpdatingDescription: {
    id: 'library-authoring.import.stepper.description.updating',
    defaultMessage: 'Integrating your imported content into this library. This process might take longer with larger libraries.',
  },
  stepperTaggingDescription: {
    id: 'library-authoring.import.stepper.description.tagging',
    defaultMessage: 'Applying tags to the contents of this library.',
  },
  stepperSuccessDescription: {
    id: 'library-authoring.import.stepper.description.success',
    defaultMessage: 'Your imported content has now been integrated into this library',
  },
  viewOutlineButton: {
    id: 'library-authoring.import.stepper.button.outline',
    defaultMessage: 'View updated outline',
  },
  defaultErrorMessage: {
    id: 'library-authoring.import.stepper.error.default',
    defaultMessage: 'Error importing library',
  },
  stepperHeaderTitle: {
    id: 'library-authoring.export.stepper.header.title',
    defaultMessage: 'Library import status',
  },
});

export default messages;
