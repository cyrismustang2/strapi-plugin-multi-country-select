import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../admin/src/pluginId'

const register = ({ strapi }: { strapi: Core.Strapi }) => {
    strapi.customFields.register({
        name: 'countries',
        plugin: PLUGIN_ID,
        type: 'json',
    });
};

export default register;