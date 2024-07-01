import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  libraryDisplayNameLabel: {
    id: 'library-authoring.create-library.display-name.label',
    defaultMessage: 'Library name',
  },
  libraryDisplayNamePlaceholder: {
    id: 'library-authoring.create-library.display-name.placeholder',
    defaultMessage: 'e.g. Computer Science Problems',
  },
  libraryDisplayNameCreateHelpText: {
    id: 'library-authoring.create-library.create.display-name.help-text',
    defaultMessage: 'The public display name for your library. This cannot be changed, but you can set a different display name in advanced settings later.',
  },
  libraryOrgLabel: {
    id: 'library-authoring.create-library.org.label',
    defaultMessage: 'Organization',
  },
  libraryOrgPlaceholder: {
    id: 'library-authoring.create-library.org.placeholder',
    defaultMessage: 'e.g. UniversityX or OrganizationX',
  },
  libraryOrgNoOptions: {
    id: 'library-authoring.create-library.org.no-options',
    defaultMessage: 'No options',
  },
  libraryOrgCreateHelpText: {
    id: 'library-authoring.create-library.create.org.help-text',
    defaultMessage: 'The name of the organization sponsoring the library. {strong} This cannot be changed, but you can set a different display name in advanced settings later.',
  },
  libraryNoteNoSpaceAllowedStrong: {
    id: 'library-authoring.create-library.no-space-allowed.strong',
    defaultMessage: 'Note: No spaces or special characters are allowed.',
  },
  libraryNoteOrgNameIsPartStrong: {
    id: 'library-authoring.create-library.org.help-text.strong',
    defaultMessage: 'Note: The organization name is part of the library URL.',
  },
  libraryCodeLabel: {
    id: 'library-authoring.create-library.number.label',
    defaultMessage: 'Library Code',
  },
  libraryCodePlaceholder: {
    id: 'library-authoring.create-library.number.placeholder',
    defaultMessage: 'e.g. CSPROB',
  },
  libraryCodeCreateHelpText: {
    id: 'library-authoring.create-library.create.number.help-text',
    defaultMessage: 'The unique code that identifies this library. {strong}',
  },
  libraryNotePartLibraryURLRequireStrong: {
    id: 'library-authoring.create-library.number.help-text.strong',
    defaultMessage: 'Note: This is part of your library URL, so no spaces or special characters are allowed.',
  },
  defaultPlaceholder: {
    id: 'library-authoring.create-library.default-placeholder',
    defaultMessage: 'Label',
  },
  createButton: {
    id: 'library-authoring.create-library.create.button.create',
    defaultMessage: 'Create',
  },
  creatingButton: {
    id: 'library-authoring.create-library.button.creating',
    defaultMessage: 'Creating',
  },
  cancelButton: {
    id: 'library-authoring.create-library.button.cancel',
    defaultMessage: 'Cancel',
  },
  requiredFieldError: {
    id: 'library-authoring.create-library.required.error',
    defaultMessage: 'Required field.',
  },
  disallowedCharsError: {
    id: 'library-authoring.create-library.disallowed-chars.error',
    defaultMessage: 'Please do not use any spaces or special characters in this field.',
  },
  noSpaceError: {
    id: 'library-authoring.create-library.no-space.error',
    defaultMessage: 'Please do not use any spaces in this field.',
  },
  alertErrorExistsAriaLabelledBy: {
    id: 'library-authoring.create-library.error.already-exists.labelledBy',
    defaultMessage: 'alert-already-exists-title',
  },
  alertErrorExistsAriaDescribedBy: {
    id: 'library-authoring.create-library.error.already-exists.aria.describedBy',
    defaultMessage: 'alert-confirmation-description',
  },
});

export default messages;
