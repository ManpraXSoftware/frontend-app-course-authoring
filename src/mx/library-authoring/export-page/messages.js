import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'library-authoring.export.page.title',
    defaultMessage: '{headingTitle} | {libraryName} | {siteName}',
  },
  headingTitle: {
    id: 'library-authoring.export.heading.title',
    defaultMessage: 'Library export',
  },
  headingSubtitle: {
    id: 'library-authoring.export.heading.subtitle',
    defaultMessage: 'Tools',
  },
  description1: {
    id: 'library-authoring.export.description1',
    defaultMessage: 'You can export libraries and edit them outside of {studioShortName}. The exported file is a .tar.gz file (that is, a .tar file compressed with GNU Zip) that contains the library structure and content. You can also re-import libraries that you\'ve exported.',
  },
  description2: {
    id: 'library-authoring.export.description2',
    defaultMessage: 'Caution: When you export a library, information such as MATLAB API keys, LTI passports, annotation secret token strings, and annotation storage URLs are included in the exported data. If you share your exported files, you may also be sharing sensitive or license-specific information.',
  },
  titleUnderButton: {
    id: 'library-authoring.export.title-under-button',
    defaultMessage: 'Export my library content',
  },
  buttonTitle: {
    id: 'library-authoring.export.button.title',
    defaultMessage: 'Export library content',
  },
});

export default messages;
