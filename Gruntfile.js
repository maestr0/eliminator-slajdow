module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('manifest.json'),
        concat: {
            options: {
                separator: '\n',
                sourceMap: true,
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
            },
            main: {
                files: {
                    'package/js/jquery.js': ['js/jquery-2.0.3.js', 'js/jquery-ui-1.10.3.widget-factory.js']
                }
            },
            us: {
                files: {
                    'userscript/eliminator-slajdow.user.js': ['userscript/es.template.user.js',
                        'js/jquery-2.0.3.js', 'js/jquery-ui-1.10.3.widget-factory.js',
                        'userscript/eliminator-slajdow.jquery.widget.js',
                        'userscript/es.template.invoker.user.js'],

                    'eliminator-slajdow.safariextension/es.safari.js': ['js/jquery-2.0.3.js',
                        'js/jquery-ui-1.10.3.widget-factory.js',
                        'userscript/eliminator-slajdow.jquery.widget.js',
                        'userscript/es.template.invoker.safari.js']

                }
            },
            safari: {
                files: {
                    'eliminator-slajdow.safariextension/es.safari.js': ['js/jquery-2.0.3.js',
                        'js/jquery-ui-1.10.3.widget-factory.js',
                        'userscript/eliminator-slajdow.jquery.widget.js',
                        'userscript/es.template.invoker.safari.js']
                }
            },
            prod: {
                files: {
                    'package/js/jquery.min.js': ['js/jquery-2.0.3.min.js', 'js/jquery-ui-1.10.3.widget.factory.min.js']
                }
            }
        },
        compass: {
            main: {                   // Target
                options: {              // Target options
                    sassDir: 'scss',
                    cssDir: ['package/css'],
                    environment: 'production'
                }
            },
            us: {                    // Another target
                options: {
                    sassDir: 'scss',
                    cssDir: 'userscript',
                    environment: 'production'
                }
            }        },
        replace: {
            main: {
                options: {
                    variables: {
                        'version': '<%=pkg.version%>',
                        'min.suffix': ''
                    },
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['manifest.json'], dest: 'package/'},
                    {expand: true, flatten: true, src: ['firefox/templates/package.json'], dest: 'firefox/'},
                    {expand: true, flatten: true, src: ['html/*'], dest: 'package/html/'},
                    {expand: true, src: ['js/eliminator-slajdow.jquery.widget.js'], dest: 'package/'},
                    {expand: true, flatten: true, src: ['js/eliminator-slajdow.jquery.widget.js'], dest: 'firefox/data/'}
                ]
            },
            us: {
                options: {
                    variables: {
                        'version': '<%=pkg.version%>',
                        'min.suffix': ''
                    },
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['js/eliminator-slajdow.jquery.widget.js'], dest: 'userscript/'},
                    {expand: true, flatten: true, src: ['firefox/templates/package.json'], dest: 'firefox/'},
                    {expand: true, flatten: true, src: ['userscript-template/es.template.user.js'], dest: 'userscript/'},
                    {expand: true, flatten: true, src: ['userscript-template/es.template.invoker.user.js'], dest: 'userscript/'},
                    {expand: true, flatten: true, src: ['eliminator-slajdow.safariextension/es.template.invoker.safari.js'], dest: 'userscript/'},
                    {expand: true, flatten: true, src: ['safari-template/Info.plist'], dest: 'eliminator-slajdow.safariextension/'}
                ]
            }
        },
        jshint: {
            files: ['js/contentscript.js', 'js/background.js', 'js/popup.js', 'js/eliminator-slajdow.jquery.widget.js',
                'firefox/data/contentscript.js', 'firefox/data/panel.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    moz: true
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Wersja v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Wersja %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'v<%= pkg.version %>.zip'
                },
                files: [
                    {expand: true, cwd: './package/', src: ['./**'], dest: "./"} // includes files in path and its subdirs
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['images/icon*.png', 'images/iphone*.png', 'images/es_logo.svg', 'images/DonateBitcoin.png'], dest: 'package/'},
                    {expand: true, src: ['js/contentscript.js'], dest: 'package/'},
                    {expand: true, src: ['js/background.js'], dest: 'package/'},
                    {expand: true, src: ['js/popup.js'], dest: 'package/'},
                    {expand: true, src: ['js/jquery.iphone-switch.js'], dest: 'package/'}
                ]
            },
            us: {
                files: [
                    {expand: true, flatten: true, src: ['images/es_logo.svg'], dest: 'userscript/'}
                ]
            }
        },
        clean: {
            package_dir: ["package/*"],
            us_dir: ["userscript/*"],
            userscript: ["userscript/*invoker*", "userscript/*template*"],
            us_dir_temp: ["userscript/popup.css"]
        },
        watch: {
            files: ['<%= jshint.files %>', 'scss/*', 'html/*', 'images/*', 'js/*', 'manifest.json'],
            tasks: ['jshint', 'concat', 'replace', 'compass', 'copy']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('release', ['bump-only'], ['package'], ['bump-commit']);
    grunt.registerTask('default', ['jshint', 'concat', 'compass']);
    grunt.registerTask('package', ['clean:package_dir', 'jshint', 'concat:main', 'compass:main', 'replace:main', 'copy:main']);
    grunt.registerTask('us', ['clean:us_dir', 'jshint', 'replace:us', 'concat:us', 'concat:safari', 'compass:us', 'clean:us_dir_temp', 'copy:us', 'clean:userscript']);
    //grunt.registerTask('safari', ['clean:us_dir', 'jshint', 'replace:us', 'concat:safari', 'compass:us', 'clean:us_dir_temp', 'copy:us', 'clean:userscript']);
};