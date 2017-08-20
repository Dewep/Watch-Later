const mongodb = require('mongodb')

class Mongo {
  constructor (config, app) {
    this.config = config
    this.app = app
    this.dbPromise = null
  }

  async run () {
    return await this._instance()
  }

  formatID (id) {
    try {
      return mongodb.ObjectID(id)
    } catch (err) {
      throw new Error('Identifier not found')
    }
  }

  async _instance (collectionName) {
    if (!this.dbPromise) {
      const url = `mongodb://${this.config.host}:${this.config.port}/${this.config.database}`
      this.dbPromise = mongodb.MongoClient.connect(url, { reconnectTries: 5 })
    }

    if (!collectionName) {
      return await this.dbPromise
    }

    const db = await this.dbPromise
    return await db.collection(collectionName)
  }
}

module.exports = Mongo
