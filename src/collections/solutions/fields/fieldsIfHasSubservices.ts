import { Field } from 'payload'

export const fieldsIfHasSubservices: Field[] = [
  {
    name: 'whyServiceTitle',
    type: 'richText',
    label: 'Почему ваш сайт нуждается в',
    localized: true,
  },
  {
    name: 'whyList',
    type: 'array',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'icon',
        type: 'upload',
        relationTo: 'media',
        required: true,
        localized: true,
      },
    ],
  },
].map((field) => ({
  ...field,
  admin: {
    condition: (_, siblingData) => siblingData.hasSubservices,
  },
})) as Field[]
