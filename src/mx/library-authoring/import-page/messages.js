import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'library-authoring.import.page.title',
    defaultMessage: '{headingTitle} | {libraryName} | {siteName}',
  },
  headingTitle: {
    id: 'library-authoring.import.heading.title',
    defaultMessage: 'Library import',
  },
  headingSubtitle: {
    id: 'library-authoring.import.heading.subtitle',
    defaultMessage: 'Tools',
  },
  description1: {
    id: 'library-authoring.import.description1',
    defaultMessage: 'Be sure you want to import a library before continuing. The contents of the imported library will replace the contents of the existing library. You cannot undo a library import. Before you proceed, we recommend that you export the current library, so that you have a backup copy of it.',
  },
  description2: {
    id: 'library-authoring.import.description2',
    defaultMessage: 'The library that you import must be in a .csv file. This file name must be "{libraryDisplayName}.csv".',
  },
  description3: {
    id: 'library-authoring.import.description3',
    defaultMessage: 'The import process has five stages. During the first two stages, you must stay on this page. You can leave this page after the unpacking stage has completed. We recommend, however, that you don\'t make important changes to your library until the import operation has completed.',
  },
});

export default messages;
