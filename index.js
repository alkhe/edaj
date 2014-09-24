var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	jade = require('jade');

module.exports = function(options) {
    var source = options.source || './public/tpl',
        destination = options.destination || path.join(source, 'templates.js'),
        namespace = 'Templates' || options.namespace,
        write = function(templates, next) {
            var stream = fs.createWriteStream(destination);
            async.map(templates, function(tpl, next) {
                fs.readFile(path.join(source, tpl), {
                    encoding: 'utf-8'
                }, next);
            }, function(err, data) {
                stream.write('var ' + namespace + " = {" + pack(templates.splice(0, 1), data.splice(0, 1)));
                for (var i = 0; i < templates.length; i++) {
                    stream.write(',' + pack(templates[i], data[i]));
                }
                next(err);
            });
        },
        pack = function(tpl, data) {
            return path.basename(tpl, '.jade') + ': ' + jade.compileClient(data);
        };

	return function(req, res, next) {
        async.waterfall([
            function(next) {
                async.parallel({
                    templates: function(next) {
                        fs.readdir(source, next);
                    },
                    compiled: function(next) {
                        fs.exists(destination, function(exists) {
                            next(null, exists);
                        });
                    }
                }, next);
            },
            function(data, next) {
                async.filter(data.templates, function(file, next) {
                    next(path.extname(file) === '.jade');
                }, function(templates) {
                    if (data.compiled) {
                        async.waterfall([
                            function(next) {
                                fs.stat(destination, next);
                            },
                            function(stat, next) {
                                async.detect(templates, function(tpl, next) {
                                    fs.stat(path.join(source, tpl), function(err, stat) {
                                        next(stat.mtime.getTime != stat.mtime.getTime());
                                    });
                                }, function(lag) {
                                    if (lag) {
                                        write(templates, next);
                                    }
                                    else {
                                        next();
                                    }
                                });
                            }
                        ], next);
                    }
                    else {
                        write(templates, next);
                    }
                });
            }
        ], next);
    };
}
