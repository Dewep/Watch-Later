const TorrentSearchApi = require('torrent-search-api')

class Torrents {
  constructor (config, app) {
    this.config = config
    this.app = app

    this.torrentSearch = new TorrentSearchApi()
    this.config.providers.forEach(provider => this.torrentSearch.enableProvider(provider))
  }

  async run () {
    this.search('Avatar').then(console.log).catch(err => console.error('error-search', err))
  }

  async search (query) {
    const torrents = await this.torrentSearch.search(query, 'Movies', 20)

    for (let i = 0; i < torrents.length; i++) {
      torrents[i].magnet = await this.torrentSearch.getMagnet(torrents[i])
    }

    return torrents
  }
}

module.exports = Torrents
