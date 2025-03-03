import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title1: {
    id: 'library-authoring.export.sidebar.title1',
    defaultMessage: 'Why export a library?',
  },
  description1: {
    id: 'library-authoring.export.sidebar.description1',
    defaultMessage: 'You may want to edit the XML in your library directly, outside of {studioShortName}. You may want to create a backup copy of your library. Or, you may want to create a copy of your library that you can later import into another library instance and customize.',
  },
  exportedContent: {
    id: 'library-authoring.export.sidebar.exportedContent',
    defaultMessage: 'What content is exported?',
  },
  exportedContentHeading: {
    id: 'library-authoring.export.sidebar.exportedContentHeading',
    defaultMessage: 'The following content is exported.',
  },
  content1: {
    id: 'library-authoring.export.sidebar.content1',
    defaultMessage: 'Library content and structure',
  },
  content2: {
    id: 'library-authoring.export.sidebar.content2',
    defaultMessage: 'Library dates',
  },
  content3: {
    id: 'library-authoring.export.sidebar.content3',
    defaultMessage: 'Grading policy',
  },
  content4: {
    id: 'library-authoring.export.sidebar.content4',
    defaultMessage: 'Any group configurations',
  },
  content5: {
    id: 'library-authoring.export.sidebar.content5',
    defaultMessage: 'Settings on the Advanced settings page, including MATLAB API keys and LTI passports',
  },
  notExportedContent: {
    id: 'library-authoring.export.sidebar.notExportedContent',
    defaultMessage: 'The following content is not exported.',
  },
  content6: {
    id: 'library-authoring.export.sidebar.content6',
    defaultMessage: 'Learner-specific content, such as learner grades and discussion forum data',
  },
  content7: {
    id: 'library-authoring.export.sidebar.content7',
    defaultMessage: 'The library team',
  },
  openDownloadFile: {
    id: 'library-authoring.export.sidebar.openDownloadFile',
    defaultMessage: 'Opening the downloaded file',
  },
  openDownloadFileDescription: {
    id: 'library-authoring.export.sidebar.openDownloadFileDescription',
    defaultMessage: 'Use an archive program to extract the data from the .tar.gz file. Extracted data includes the library.xml file, as well as subfolders that contain library content.',
  },
  learnMoreButtonTitle: {
    id: 'library-authoring.export.sidebar.learnMoreButtonTitle',
    defaultMessage: 'Learn more about exporting a library',
  },
});

export default messages;
