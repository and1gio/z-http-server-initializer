'use strict';

module.exports = {
    run: function (app, next) {
        var http = require('http');

        /**
         * Create HTTP server.
         */
        app.httpServer = http.createServer(app.express);

        /**
         * Listen on provided port, on all network interfaces.
         */
        app.httpServer.listen(app.config.zApp.port || process.env.PORT || 5000);

        app.httpServer.on('error', onError);
        app.httpServer.on('listening', onListening);

        /**
         * Event listener for HTTP server "error" event.
         */
        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof app.config.zApp.port === 'string'
                ? 'Pipe ' + app.config.zApp.port
                : 'Port ' + app.config.zApp.port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    app.logger.warn('requires elevated privileges', bind);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    app.logger.warn('port already in use', bind);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        /**
         * Event listener for HTTP server "listening" event.
         */
        function onListening() {
            var addr = app.httpServer.address();
            var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
            app.logger.info('server started listening on', bind);
        }

        /**
         * Event listener for HTTP server "uncaught exception" event handler.
         */
        process.on('uncaughtException', function (error) {
            console.log("!!!!!!!!!!!!!!!!!! UNHANDLED EXCEPTION !!!!!!!!!!!!!!!!!!");
            app.logger.warn(error.stack);
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        });

        next();
    }
};
