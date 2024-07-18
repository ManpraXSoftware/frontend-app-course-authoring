import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'library-authoring.library-outline.headingTitle',
    defaultMessage: '{title}',
  },
  headingSubtitle: {
    id: 'library-authoring.library-outline.subTitle',
    defaultMessage: 'Content Library',
  },
  alertSuccessTitle: {
    id: 'library-authoring.library-outline.reindex.alert.success.title',
    defaultMessage: 'Library index',
  },
  alertSuccessDescription: {
    id: 'library-authoring.library-outline.reindex.alert.success.description',
    defaultMessage: 'Library has been successfully reindexed.',
  },
  alertSuccessAriaLabelledby: {
    id: 'library-authoring.library-outline.reindex.alert.success.aria.labelledby',
    defaultMessage: 'alert-confirmation-title',
  },
  alertSuccessAriaDescribedby: {
    id: 'library-authoring.library-outline.reindex.alert.success.aria.describedby',
    defaultMessage: 'alert-confirmation-description',
  },
  newSectionButton: {
    id: 'library-authoring.library-outline.section-list.button.new-section',
    defaultMessage: 'New section',
  },
  exportTagsCreatingToastMessage: {
    id: 'library-authoring.library-outline.export-tags.toast.creating.message',
    defaultMessage: 'Please wait. Creating export file for library tags...',
    description: 'In progress message in toast when exporting tags of a library',
  },
  exportTagsSuccessToastMessage: {
    id: 'library-authoring.library-outline.export-tags.toast.success.message',
    defaultMessage: 'Library tags exported successfully',
    description: 'Success message in toast when exporting tags of a library',
  },
  exportTagsErrorToastMessage: {
    id: 'library-authoring.library-outline.export-tags.toast.error.message',
    defaultMessage: 'An error has occurred creating the file',
    description: 'Error message in toast when exporting tags of a library',
  },
});

export default messages;
