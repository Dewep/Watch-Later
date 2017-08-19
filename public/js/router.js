var routes = [
  {
    path: '',
    component: window.MainComponent,
    children: [
      { name: 'home', path: '', redirect: 'auth' },
      { name: 'auth', path: '/auth', component: window.AuthComponent },
      { name: 'profile', path: '/profile', component: window.ProfileComponent },
      { name: 'news', path: '/news', component: window.NewsComponent },
      { name: 'movies', path: '/movies', component: window.MoviesComponent }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

window.router = new window.VueRouter({
  routes: routes,
  linkActiveClass: 'active'
})
