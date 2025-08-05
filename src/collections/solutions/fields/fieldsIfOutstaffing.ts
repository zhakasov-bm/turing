import { Field } from 'payload'

export const fieldsIfOutstaffing: Field[] = [
  {
    name: 'titleOutstaff',
    type: 'richText',
    label: 'Заголовок',
    required: true,
  },
  {
    name: 'approaches',
    type: 'array',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'icon',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
    ],
  },
].map((field) => ({
  ...field,
  admin: {
    condition: (_, siblingData) => siblingData.isOutstaffing,
  },
})) as Field[]
