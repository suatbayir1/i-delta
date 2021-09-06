import { IconFont } from '@influxdata/clockface'


export const hierarchy = [
    // {
    //     id: 'settings',
    //     testID: 'nav-item-settings',
    //     icon: IconFont.WrenchNav,
    //     label: 'Settings',
    //     link: {
    //         type: 'link',
    //         location: `/settings/variables`,
    //     },
    //     activeKeywords: ['settings'],
    //     menu: [
    //         {
    //             id: 'variables',
    //             testID: 'nav-subitem-variables',
    //             label: 'Variables',
    //             link: {
    //                 type: 'link',
    //                 location: `/settings/variables`,
    //             },
    //         },
    //         {
    //             id: 'templates',
    //             testID: 'nav-subitem-templates',
    //             label: 'Templates',
    //             link: {
    //                 type: 'link',
    //                 location: `/settings/templates`,
    //             },
    //         },
    //         {
    //             id: 'labels',
    //             testID: 'nav-subitem-labels',
    //             label: 'Labels',
    //             link: {
    //                 type: 'link',
    //                 location: `/settings/labels`,
    //             },
    //         },
    //     ],
    // },
    {
        id: 'my-projects',
        icon: IconFont.Star,
        label: 'Projects',
        link: {
            type: 'link',
            location: `/my-projects`,
        },
        activeKeywords: ['my-projects', 'project'],
        permitted: ['member', 'admin', 'editor'],
    },
    {
        id: 'did',
        icon: IconFont.Link,
        label: 'DID',
        link: {
            type: 'link',
            location: `/did`,
        },
        activeKeywords: ['did'],
        permitted: ['member', 'admin', 'editor'],
    },
    {
        id: 'example',
        icon: IconFont.Pulse,
        label: 'Example',
        link: {
            type: 'link',
            location: `/example`,
        },
        activeKeywords: ['', 'example'],
        permitted: ['member', 'admin', 'editor'],
    },
]