import { Component } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

export default function OurStackBlock({ component }: { component: Component }) {
  return (
    <section id="stack" className="container-class">
      {component.globals.map((block, id) => {
        if (block.blockType === 'stack') {
          return (
            <div key={id}>
              <RichText data={block.title} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 md:pt-16">
                {block.technologies.map((tech, id) => (
                  <div key={id} className="flex flex-col gap-2">
                    <p className="font-extralight text-base">{tech.direction}</p>
                    <div
                      key={id}
                      className="flex items-center justify-center gap-4 rounded-custom border-1 border-link/10 p-4 mb-5"
                    >
                      {tech.stack?.map((item, id) => (
                        <div key={id} className="h-10 w-auto flex items-center">
                          {typeof item.icon === 'object' && item.icon?.url && (
                            <Image
                              src={item.icon.url}
                              alt={item.icon.alt || ''}
                              className="h-10 w-auto object-contain"
                              width={40}
                              height={40}
                              draggable={false}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      })}
    </section>
  )
}
