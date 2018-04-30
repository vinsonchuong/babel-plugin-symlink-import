/* eslint-disable flowtype/no-weak-types */
/* @flow */
import * as babel from 'babel-core'

export default async function(filePath: string, { plugins }: { plugins: any }) {
  const { code } = await new Promise((resolve, reject) => {
    babel.transformFile(
      filePath,
      {
        babelrc: false,
        plugins
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  })
  return code
}
