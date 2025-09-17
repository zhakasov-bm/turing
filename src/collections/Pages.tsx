import { CompanyBlock } from '@/blocks/CompanyBlock'
import { OurMissionBlock } from '@/blocks/OurMissionBlock'
import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название страницы',
      localized: true,
    },
    {
      name: 'heading',
      type: 'richText',
      required: true,
      label: 'Заголовок',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      // keep non-localized for stable routing
    },
    {
      name: 'layout',
      type: 'blocks',
      required: false,
      minRows: 0,
      blocks: [CompanyBlock, OurMissionBlock],
    },
  ],
}
