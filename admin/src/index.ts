import { prefixPluginTranslations } from './utils/prefixPluginTranslations';
import { PLUGIN_ID } from './pluginId';
import CountrySelectIcon from './components/MultiCountrySelectIcon';
import { getTranslation } from './utils/getTrad';
import countries from 'i18n-iso-countries';

export default {
    register(app: any) {
        app.customFields.register({
            name: 'countries',
            pluginId: PLUGIN_ID,
            type: 'json',
            icon: CountrySelectIcon,
            intlLabel: {
                id: getTranslation('label'),
                defaultMessage: 'Multi Countries',
            },
            intlDescription: {
                id: getTranslation('description'),
                defaultMessage: 'Select multiple countries',
            },
            components: {
                Input: async () =>
                    import('./components/MultiCountrySelect'),
            },
            options: {
                base: [
                    {
                        sectionTitle: null,
                        items: [
                            {
                                name: 'options-extra',
                                type: 'textarea-enum',
                                intlLabel: {
                                    id: getTranslation('options-extra.label'),
                                    defaultMessage: 'Add more options to the select menu',
                                },
                                intlDescription: {
                                    id: getTranslation('options-extra.description'),
                                    defaultMessage:
                                        'One option per line, in the format value:label',
                                },
                                placeholder: {
                                    id: getTranslation('options-extra.placeholder'),
                                    defaultMessage: 'Ex:\nMN:MOON\nMRS:MARS\nNEP:NEPTUNE',
                                },
                            },
                        ],
                    },
                ],
                advanced: [
                    {
                        sectionTitle: {
                            id: 'global.settings',
                            defaultMessage: 'Settings',
                        },
                        items: [
                            {
                                name: 'required',
                                type: 'checkbox',
                                intlLabel: {
                                    id: 'form.attribute.item.requiredField',
                                    defaultMessage: 'Required field',
                                },
                                description: {
                                    id: 'form.attribute.item.requiredField.description',
                                    defaultMessage: "You won't be able to create an entry if this field is empty",
                                },
                            },
                        ],
                    },
                ],
            },
        });
    },

    async registerTrads({ locales }: { locales: string[] }) {
        const importedTrads = await Promise.all(
            locales.map((locale) => {
                return Promise.all([
                    import(`./translations/${locale}.json`),
                    import(`i18n-iso-countries/langs/en.json`)
                ])
                    .then(([pluginTranslations, countryTranslations]) => {
                        countries.registerLocale(countryTranslations.default);

                        return {
                            data: {
                                ...prefixPluginTranslations(
                                    pluginTranslations.default,
                                ),
                                [`${PLUGIN_ID}.countries`]: JSON.stringify(
                                    countries.getNames(locale),
                                ),
                            },
                            locale,
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        return {
                            data: {},
                            locale,
                        };
                    });
            })
        );

        return Promise.resolve(importedTrads);
    },
};
