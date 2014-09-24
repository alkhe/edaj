var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	jade = require('jade');

module.exports = function(source, destination) {
	return function(req, res, next) {
        async.parallel({
            templates: function(next) {
                fs.readdir(source, next);
            },
            compiled: function(next) {
                fs.readdir(destination, next);
            }
        }, function(err, data) {
            async.each(data.templates, function(tpl, next) {
                if (path.extname(tpl) === '.jade') {
                    var newfile = path.basename(tpl, '.jade') + '.js';
                    if (data.compiled.indexOf(newfile) > -1) {
                        async.parallel({
                            source: function(next) {
                                fs.stat(path.join(source, tpl), next);
                            },
                            destination: function(next) {
                                fs.stat(path.join(destination, newfile), next);
                            }
                        }, function(err, data) {
                            if (data.source.mtime.getTime() != data.destination.mtime.getTime()) {
                                async.waterfall([
                                    function(next) {
                                        fs.readFile(path.join(source, tpl), next);
                                    },
                                    function(data, next) {
                                        fs.writeFile(path.join(destination, newfile), jade.compileClient(data), next);
                                    },
                                    function(next) {
                                        fs.utimes(path.join(source, tpl), new Date, new Date(), next);
                                    }
                                ], next);
                            }
                            else {
                                next();
                            }
                        });
                    }
                    else {
                        async.waterfall([
                            function(next) {
                                fs.readFile(path.join(source, tpl), next);
                            },
                            function(data, next) {
                                fs.writeFile(path.join(destination, newfile), jade.compileClient(data), next);
                            },
                            function(next) {
                                fs.utimes(path.join(source, tpl), new Date, new Date(), next);
                            }
                        ], next);
                    }
                }
                else {
                    next();
                }
            }, next);
        });
    }
}
