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

  async insert (collection, document) {
    const db = await this._instance(collection)
    return await db.insertOne(document)
  }

  async insertMany (collection, documents) {
    const db = await this._instance(collection)
    return await db.insertMany(documents)
  }

  async update (collection, query, document) {
    const db = await this._instance(collection)
    return await db.updateOne(document)
  }

  async remove (collection, query) {
    const db = await this._instance(collection)
    return await db.deleteOne(query)
  }

  async removeMany (collection, query) {
    const db = await this._instance(collection)
    return await db.deleteMany(query)
  }
}

module.exports = Mongo
