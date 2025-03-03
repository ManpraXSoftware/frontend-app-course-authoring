import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  errorTitle: {
    id: 'library-authoring.export.modal.error.title',
    defaultMessage: 'There has been an error while exporting.',
  },
  errorDescriptionNotUnit: {
    id: 'library-authoring.export.modal.error.description.not.unit',
    defaultMessage: 'Your library could not be exported to XML. There is not enough information to identify the failed component. Inspect your library to identify any problematic components and try again. The raw error message is: {errorMessage}',
  },
  errorDescriptionUnit: {
    id: 'library-authoring.export.modal.error.description.unit',
    defaultMessage: 'There has been a failure to export to XML at least one component. It is recommended that you go to the edit page and repair the error before attempting another export. Please check that all components on the page are valid and do not display any error messages. The raw error message is: {errorMessage}',
  },
  errorCancelButtonUnit: {
    id: 'library-authoring.export.modal.error.button.cancel.unit',
    defaultMessage: 'Return to export',
  },
  errorCancelButtonNotUnit: {
    id: 'library-authoring.export.modal.error.button.cancel.not.unit',
    defaultMessage: 'Cancel',
  },
  errorActionButtonNotUnit: {
    id: 'library-authoring.export.modal.error.button.action.not.unit',
    defaultMessage: 'Take me to the main library page',
  },
  errorActionButtonUnit: {
    id: 'library-authoring.export.modal.error.button.action.unit',
    defaultMessage: 'Correct failed component',
  },
});

export default messages;
