module.exports = {
  exphbs:         require('express-handlebars'),
  bodyParser:     require('body-parser'),
  cookieParser:   require('cookie-parser'),
  morgan:         require('morgan'),
  methodOverride: require('method-override'),
  errorHandler:   require('errorhandler'),
  sanitizer:      require('./sanitizer'),
  session:        require('express-session'),
  multer:         require('multer')
}
