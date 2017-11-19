const TorrentSearchApi = require('torrent-search-api')

class Torrents {
  constructor (config, app) {
    this.config = config
    this.app = app

    this.torrentSearch = new TorrentSearchApi()
    this.config.providers.forEach(provider => this.torrentSearch.enableProvider(provider))
  }

  async run () {
  }

  async _aggregateWithMagnets (torrents) {
    for (let i = 0; i < torrents.length; i++) {
      torrents[i].magnet = await this.torrentSearch.getMagnet(torrents[i])
    }

    return torrents
  }

  async search (query, limit) {
    const results = await this.torrentSearch.search(query, 'Movies', limit || 10)
    const torrents = []

    for (let i = 0; i < results.length; i++) {
      if (results[i]) { // if not result, search return [undefined]
        results[i].slug = `${results[i].provider}#${results[i].desc}`
        torrents.push(results[i])
      }
    }

    return torrents
  }

  async searchQueries (queries, limitPerQuery) {
    const torrents = []
    const identifiers = {}

    for (let index = 0; index < queries.length; index++) {
      try {
        const results = await this.search(queries[index], limitPerQuery)

        results.forEach(torrent => {
          if (!identifiers[torrent.slug]) {
            identifiers[torrent.slug] = true
            torrents.push(torrent)
          }
        })
      } catch (err) {
        console.warn('[torrents] ignore search error:', err)
      }
    }

    try {
      await this._aggregateWithMagnets(torrents)
    } catch (err) {
      console.warn('[torrents] ignore aggregation error:', err)
    }

    return torrents
  }
}

module.exports = Torrents
