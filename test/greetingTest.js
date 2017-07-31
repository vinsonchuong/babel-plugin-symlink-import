/* @flow */
import test from 'ava'
import greeting from 'babel-plugin-symlink-import/src/greeting'

test('is the correct string', t => {
  t.is(greeting, 'Hello World!')
})
