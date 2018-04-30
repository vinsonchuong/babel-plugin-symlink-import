/* @flow */
import test from 'ava'
import dedent from 'dedent'
import compile from 'babel-plugin-symlink-import/test/helpers/compile'
import symlinkImport from 'babel-plugin-symlink-import'

test('rewrites import paths', async t => {
  t.is(
    await compile('test/fixtures/project/index.js', {
      plugins: [symlinkImport]
    }),
    dedent`
      /* eslint-disable */
      import current from './current';
      import external from 'external';
      import local1 from './lib/local1';
      import local2 from './lib/local2';
      import anotherExternal from 'anotherExternal';
    `
  )
})

test('preserves import paths without any modifier file', async t => {
  t.is(
    await compile('test/fixtures/project-without-links/index.js', {
      plugins: [symlinkImport]
    }),
    dedent`
      /* eslint-disable */
      import current from './current';
      import external from 'external';
      import local1 from 'local1';
      import local2 from 'local2';
      import anotherExternal from 'anotherExternal';
    `
  )
})
