import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  stepperPreparingTitle: {
    id: 'library-authoring.export.stepper.title.preparing',
    defaultMessage: 'Preparing',
  },
  stepperExportingTitle: {
    id: 'library-authoring.export.stepper.title.exporting',
    defaultMessage: 'Exporting',
  },
  stepperCompressingTitle: {
    id: 'library-authoring.export.stepper.title.compressing',
    defaultMessage: 'Compressing',
  },
  stepperConvertingTitle: {
    id: 'library-authoring.export.stepper.title.converting',
    defaultMessage: 'Converting',
  },
  stepperSuccessTitle: {
    id: 'library-authoring.export.stepper.title.success',
    defaultMessage: 'Success',
  },
  stepperPreparingDescription: {
    id: 'library-authoring.export.stepper.description.preparing',
    defaultMessage: 'Preparing to start the export',
  },
  stepperExportingDescription: {
    id: 'library-authoring.export.stepper.description.exporting',
    defaultMessage: 'Creating the export data files (You can now leave this page safely, but avoid making drastic changes to content until this export is complete)',
  },
  stepperCompressingDescription: {
    id: 'library-authoring.export.stepper.description.compressing',
    defaultMessage: 'Compressing the exported data',
  },
  stepperConvertingDescription: {
    id: 'library-authoring.export.stepper.description.converting',
    defaultMessage: 'converting the compresses data and preparing it for download',
  },
  stepperSuccessDescription: {
    id: 'library-authoring.export.stepper.description.success',
    defaultMessage: 'Your exported library can now be downloaded',
  },
  downloadLibraryButtonTitle: {
    id: 'library-authoring.export.stepper.download.button.title',
    defaultMessage: 'Download exported library',
  },
  stepperHeaderTitle: {
    id: 'library-authoring.export.stepper.header.title',
    defaultMessage: 'Library export status',
  },
});

export default messages;
