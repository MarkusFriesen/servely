// configure.js:
let path = require('path'),
    express = require('express'),
    routes = require('./routes'),
    middleware = require('./middleware'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(middleware.session)

module.exports = function(app, config) {
  if (config === null) { config = {} }

  app.set('port', 3300);

  app.use(middleware.session({
    secret: 'SECRETHERE',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }))

  app.set('views', __dirname + '/views')
  var hbs = middleware.exphbs.create({
    extname: '.html',
    defaultLayout: 'layout',
    layoutsDir: app.get('views') + '/layouts',
    partialsDir: [app.get('views') + '/partials']
  })
  app.engine('html', hbs.engine)
  app.set('view engine', 'html')

  app.use(middleware.morgan('dev'))
  app.use(middleware.bodyParser.urlencoded({ extended: false }))
  app.use(middleware.bodyParser.json())
  app.use(middleware.methodOverride())

  app.use(middleware.cookieParser('SECRETHERE'))

  app.use('/public/', express['static'](path.join(__dirname, './public')))
  app.use('/assets/img', express.static((path.join(__dirname, './public/OrderMe/assets/img'))))

  app.set('config', config)

  routes.initialize(app, new express.Router())

  return app
}
