import * as babel from 'babel-core'

export default async function(filePath, { plugins }) {
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
