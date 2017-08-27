import apiApp from '../../api/app'

export default store => {
  apiApp.sync(store)
}
