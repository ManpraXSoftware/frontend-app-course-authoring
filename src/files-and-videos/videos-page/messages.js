import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  heading: {
    id: 'course-authoring.video-uploads.heading',
    defaultMessage: 'Videos',
  },
  transcriptSettingsButtonLabel: {
    id: 'course-authoring.video-uploads.transcript-settings.button.toggle',
    defaultMessage: 'Transcript settings',
  },
  thumbnailAltMessage: {
    id: 'course-authoring.video-uploads.thumbnail.alt',
    defaultMessage: '{displayName} video thumbnail',
  },
  activeCheckboxLabel: {
    id: 'course-authoring.files-and-videos.sort-and-filter.modal.filter.activeCheckbox.label',
    defaultMessage: 'Active',
  },
  inactiveCheckboxLabel: {
    id: 'course-authoring.files-and-videos.sort-and-filter.modal.filter.inactiveCheckbox.label',
    defaultMessage: 'Inactive',
  },
  transcribedCheckboxLabel: {
    id: 'course-authoring.files-and-videos.sort-and-filter.modal.filter.transcribedCheckbox.label',
    defaultMessage: 'Transcribed',
  },
  notTranscribedCheckboxLabel: {
    id: 'course-authoring.files-and-videos.sort-and-filter.modal.filter.notTranscribedCheckbox.label',
    defaultMessage: 'Not transcribed',
  },
  processingCheckboxLabel: {
    id: 'course-authoring.files-and-videos.sort-and-filter.modal.filter.processingCheckbox.label',
    defaultMessage: 'Processing',
  },
  failedCheckboxLabel: {
    id: 'course-authoring.files-and-videos.sort-and-filter.modal.filter.failedCheckbox.label',
    defaultMessage: 'Failed',
  },
  videoUploadProgressBarLabel: {
    id: 'course-authoring.files-and-videos.add-video-progress-bar.progress-bar.label',
    defaultMessage: 'Video upload progress:',
  },
  videoUploadAlertLabel: {
    id: 'course-authoring.files-and-videos.video-upload-alert',
    defaultMessage: 'Upload in progress. Please wait for the upload to complete before navigating away from this page.',
  },
});

export default messages;
