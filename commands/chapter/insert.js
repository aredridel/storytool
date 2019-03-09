exports.command = 'insert <pos> <chapter>'

exports.desc = 'Insert a chapter before or after another and link it'

exports.builder = yargs => {
  yargs.positional('pos', {
    describe: 'Where to put the new chapter',
    choices: ['before', 'after']

  }).positional('chapter', {
    describe: 'Chapter to precede or follow'
  })
}

exports.handler = argv => {
  const run = require('async-main').default

  const {promisify} = require('util')

  const writeFile = promisify(require('fs').writeFile)

  const {load, links, store, id} = require('../../storyweb.js')

  const {resolve, pathToFileURL} = require('url')
  const relative = require('url-relative')

  const u = require('unist-builder')

  run(async function main() {
    const {pos, chapter} = argv
    const before = []
    const after = []
    const url = String(pathToFileURL(chapter));

    (pos == 'before' ? after : before).push(await load(url))

    for (const node of ( pos == 'before' ? after : before)) {
      for (const link of links(node.url, node.ast)) {
        if ((pos == 'before' ? /Prev/ : /Next/).test(link.children[0].value)) {
          (pos == 'before' ? before : after).push(Object.assign(await load(resolve(url, link.url)), {
            relText: link.text,
            rel: (pos == "before" ? "previous" : "next"),
          }))
        }
      }
    }

    const filename = `Chapter-${id()}.md`
    const newurl = pathToFileURL(filename).toString()

    for (const n1 of before) {
      for (const l1 of links(n1.url, n1.ast)) {
        console.log(l1)
        for (const n2 of after) {
          if (resolve(url, l1.url) == n2.url) {
            l1.url = relative(url, newurl)
          }
        }
      }
    }

    for (const n1 of after) {
      for (const l1 of links(n1.url, n1.ast)) {
        for (const n2 of before) {
          if (resolve(url, l1.url) == n2.url) {
            l1.url = relative(url, newurl)
          }
        }
      }
    }

    const mid = {
      url: newurl,
      ast: u('root', [
        u('yaml'),
        ...(before.map(e => u('paragraph', [
          u('link', {
            url: e.url
          }, [
            u('text', 'Previous')
          ])
        ]))),
        u('thematicBreak'),
        ...(after.map(e => u('paragraph', [
          u('link', {
            url: e.url
          }, [
            u('text', 'Next')
          ])
        ])))
      ])
    }

    for (const file of before.concat(mid).concat(after)) {
      await store(file)
    }
    console.log(filename)
  })
}

