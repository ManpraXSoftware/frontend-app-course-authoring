import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title1: {
    id: 'library-authoring.import.sidebar.title1',
    defaultMessage: 'Why import a library?',
  },
  description1: {
    id: 'library-authoring.import.sidebar.description1',
    defaultMessage: 'You may want to run a new version of an existing library, or replace an existing library altogether. Or, you may have developed a library outside {studioShortName}.',
  },
  importedContent: {
    id: 'library-authoring.import.sidebar.importedContent',
    defaultMessage: 'What content is imported?',
  },
  importedContentHeading: {
    id: 'library-authoring.import.sidebar.importedContentHeading',
    defaultMessage: 'The following content is imported.',
  },
  content1: {
    id: 'library-authoring.import.sidebar.content1',
    defaultMessage: 'Library content and structure',
  },
  content2: {
    id: 'library-authoring.import.sidebar.content2',
    defaultMessage: 'Library dates',
  },
  content3: {
    id: 'library-authoring.import.sidebar.content3',
    defaultMessage: 'Grading policy',
  },
  content4: {
    id: 'library-authoring.import.sidebar.content4',
    defaultMessage: 'Any group configurations',
  },
  content5: {
    id: 'library-authoring.import.sidebar.content5',
    defaultMessage: 'Settings on the advanced settings page, including MATLAB API keys and LTI passports',
  },
  notImportedContent: {
    id: 'library-authoring.import.sidebar.notImportedContent',
    defaultMessage: 'The following content is not exported.',
  },
  content6: {
    id: 'library-authoring.import.sidebar.content6',
    defaultMessage: 'Learner-specific content, such as learner grades and discussion forum data',
  },
  content7: {
    id: 'library-authoring.import.sidebar.content7',
    defaultMessage: 'The library team',
  },
  warningTitle: {
    id: 'library-authoring.import.sidebar.warningTitle',
    defaultMessage: 'Warning: importing while a library is running',
  },
  warningDescription: {
    id: 'library-authoring.import.sidebar.warningDescription',
    defaultMessage: 'If you perform an import while your library is running, and you change the URL names (or url_name nodes) of any problem components, the student data associated with those problem components may be lost. This data includes students\' problem scores.',
  },
  learnMoreButtonTitle: {
    id: 'library-authoring.import.sidebar.learnMoreButtonTitle',
    defaultMessage: 'Learn more about importing a library',
  },
});

export default messages;
