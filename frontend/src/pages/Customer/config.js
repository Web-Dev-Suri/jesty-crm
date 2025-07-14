export const fields = {
  name: {
    type: 'string',
    required: true,
    label: 'Name',
  },
  phone: {
    type: 'phone',
    required: false,
    label: 'Phone',
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { label: 'New Lead', value: 'New Lead' },
      { label: 'Contacted', value: 'Contacted' },
      { label: 'Did not pick', value: 'Did not pick' },
      { label: 'Consultation Scheduled', value: 'Consultation Scheduled' },
      { label: 'DND', value: 'DND' },
    ],
    default: 'New Lead',
  },
  source: {
    type: 'select',
    label: 'Source',
    options: [
      { label: 'Website', value: 'Website' },
      { label: 'Google Form', value: 'Google Form' },
      { label: 'Meta Campaign A', value: 'Meta Campaign A' },
      { label: 'Meta Campaign B', value: 'Meta Campaign B' },
    ],
  },
  // revenue: {
  //   type: 'number',
  //   label: 'Revenue Generated',
  //   required: false,
  //   disableForForm: true,
  // },
};
