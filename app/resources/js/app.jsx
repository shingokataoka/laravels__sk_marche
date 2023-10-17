import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        // ヘルパー関数を登録（lang/内の言語の単語を呼び出せる）
        window.__ = window.trans = (key = null, replace = {}, locale = null) => {
            const {currentLocale, localeData} = props.initialPage.props.locale;

            if(locale === null) {
                locale = currentLocale;
            }

            let translatedText = localeData[locale][key] || key;

            for(let key in replace) {
                const replacingValue = replace[key];
                translatedText = translatedText.replace(`:${key}`, replacingValue);
            }
            return translatedText;
        };
        // ここまでヘルパー関数を登録（lang/内の言語の単語を呼び出せる）
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
