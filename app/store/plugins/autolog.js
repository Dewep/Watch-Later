export default store => {
  try {
    const apiKey = window.localStorage.getItem('apiKey')

    if (apiKey) {
      store.dispatch('autolog', { apiKey })
    }
  } catch (err) {}
}
