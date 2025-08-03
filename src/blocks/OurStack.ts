import { Block } from 'payload'

export const OurStackBlock: Block = {
  slug: 'stack',
  fields: [
    {
      name: 'title',
      label: 'Наши технологии',
      type: 'richText',
      required: true,
    },
    {
      name: 'technologies',
      label: 'Технологии',
      type: 'array',
      required: true,
      fields: [
        { name: 'direction', type: 'text', required: true },
        {
          name: 'stack',
          type: 'array',
          fields: [{ name: 'icon', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },
  ],
}
