import { CollectionConfig } from 'payload'
import { fieldsIfHasSubservices } from './fields/fieldsIfHasSubservices'
import { commonFieldsIfNoSubservices } from './fields/commonFieldsIfNoSubservices'
import { fieldsIfOutstaffing } from './fields/fieldsIfOutstaffing'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: {
    singular: 'Услуга',
    plural: 'Услуги',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название услуги',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'details',
      type: 'array',
      label: 'Details',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'servicesTitle',
      type: 'text',
      defaultValue: 'Какие услуги можно заказать у нас?',
      required: false,
      localized: true,
    },
    {
      name: 'hasSubservices',
      type: 'checkbox',
      label: 'Подуслуги',
    },
    ...fieldsIfHasSubservices,
    ...commonFieldsIfNoSubservices,
    {
      name: 'isOutstaffing',
      type: 'checkbox',
      label: 'Аутстаффинг',
    },
    ...fieldsIfOutstaffing,
    {
      name: 'titleWhy',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'problem',
      type: 'array',
      label: 'Проблемы',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
      required: false,
    },
    {
      name: 'titleQA',
      type: 'text',
      // defaultValue: 'Частые вопросы',
      required: true,
      localized: true,
    },
    {
      name: 'questions',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', localized: true },
        { name: 'answer', type: 'text', localized: true },
      ],
      required: true,
    },
    {
      name: 'lead',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
