const app = {
  store: null
}

app.sync = store => {
  app.store = store
}

export default app
