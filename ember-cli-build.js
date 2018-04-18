'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const shim = require('@html-next/flexi-layouts/lib/pod-templates-shim');

shim(EmberApp);

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    brotli: {
      extensions: ['js', 'css', 'svg'],
      appendSuffix: false
    },
    'asset-cache': {
      include: [
        'assets/**/*',
        'favicons/**/*',
        'fonts/**/*',
        'img/**/*'
      ],
      version: '44'
    },
    'esw-cache-fallback': {
      patterns: [
        '/github-repos'
      ]
    },
    'esw-prember': {
      version: '44'
    },
    emberCliConcat: {
      js: {
        concat: process.env.EMBER_ENV === 'production',
        useAsync: process.env.EMBER_ENV === 'production'
      },
      css: {
        concat: false
      }
    },
    'ember-prism': {
      'components': ['markup-templating', 'scss', 'javascript', 'handlebars', 'http', 'json'],
      'plugins': ['normalize-whitespace', 'show-language']
    },
    fingerprint: {
      extensions: ['js', 'css', 'map']
    },
    inlineContent: {
      app: 'inline/styles/app.css',
      blog: 'inline/styles/blog.css',
      contact: 'inline/styles/contact.css',
      fonts: 'inline/styles/fonts.css',
      'google-analytics': {
        file: 'inline/ga.js',
        enabled: process.env.EMBER_ENV === 'production'
      },
      'loading-indicator': {
        file: 'inline/loading-indicator.html',
        enabled: false
      },
      'open-source': 'inline/styles/open-source.css'
    },
    prember: {
      baseRoot: 'https://shipshape.io',
      urls: buildPremberUrls()
    },
    rssFeed: require('./config/rss-feed'),
    SRI: {
      enabled: false
    },
    vendorFiles: { 'jquery.js': null }
  });

  return app.toTree();
};

/**
 * Builds the prember urls for the blog and static pages
 * @returns {string[]} The urls for prember
 */
function buildPremberUrls() {
  // Build prember urls
  const urls = [
    '/',
    '/ember-consulting/',
    '/open-source/',
    '/contact/',
    '/blog/',
    '/blog/author/rwwagner90/'
  ];

  const { extname } = require('path');
  const walkSync = require('walk-sync');

  const paths = walkSync('blog');

  const mdFiles = paths.filter(path => extname(path) === '.md')
    .map((path) => {
      const stripMD = path.replace(/\.md/, '');
      return `/blog/${stripMD}/`;
    });

  mdFiles.forEach((file) => {
    urls.push(file);
  });

  return urls;
}
