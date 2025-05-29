export const fields = {
  name: {
    type: 'string',
  },
  // email: {
  //   type: 'email',
  // },
  phone: {
    type: 'phone',
  },
  status: {
    type: 'select',
    options: [
      { label: 'New Lead', value: 'New Lead' },
      { label: 'Contacted', value: 'Contacted' },
      { label: 'Did not pick', value: 'Did not pick' },
      { label: 'Consultation Scheduled', value: 'Consultation Scheduled' },
      { label: 'DND', value: 'DND' },
    ],
    default:'New Lead',
  },
    source: {
    type: 'select',
    options: [
      { label: 'Website', value: 'Website' },
      { label: 'Google Form', value: 'Google Form' },
      { label: 'Meta Campaign A', value: 'Meta Campaign A' },
      { label: 'Meta Campaign B', value: 'Meta Campaign B' },
    ],
  },
};
