#!/usr/bin/env node

import esbuild from 'esbuild';

const isWatchMode = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  outdir: 'app/assets/builds',
  publicPath: '/assets/',
  format: 'esm',
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.tiff': 'file',
    '.ico': 'file',
    '.eot': 'file',
    '.otf': 'file',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.scss': 'css',
    '.css': 'css',
  },
  sourcemap: true
};

const runBuild = async () => {
  try {
    if (isWatchMode) {
      console.log('Running in watch mode...');
      let ctx = await esbuild.context(buildOptions);
      await ctx.watch();
    } else {
      console.log('Running build...');
      await esbuild.build(buildOptions);
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

runBuild();
