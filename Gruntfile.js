module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('manifest.json'),
        concat: {
            options: {
                separator: ';'
            },
            popup: {
                src: ['js/jquery.iphone-switch.js', 'js/popup.js'],
                dest: 'package/js/popup.min.js'
            }
        },
        compass: {
            dist: {                   // Target
                options: {              // Target options
                    sassDir: 'scss',
                    cssDir: 'package/css',
                    environment: 'production'
                }
            },
            dev: {                    // Another target
                options: {
                    sassDir: 'scss',
                    cssDir: 'package/css',
                    environment: 'production'
                }
            }        },
        replace: {
            dist: {
                options: {
                    variables: {
                        'version': '<%=pkg.version%>'
                    },
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['manifest.json'], dest: 'package/'}
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*!\n<%= manifest.name %> v<%=pkg.version %>\nAuthor: <%= pkg.author%>\nBuild: <%= grunt.template.today("dd-mm-yyyy hh:MM:ss") %> */\n'
            },
            dist: {
                files: {
                    'package/js/contentscript.min.js': ['js/contentscript.js'],
                    'package/js/popup.min.js': ['package/js/popup.js'],
                    'package/js/background.min.js': ['js/background.js']
                }
            }
        },
        jshint: {
            files: ['js/contentscript.js', 'js/background.js', 'js/popup.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['html/background.html', 'html/popup.html'], dest: 'package/'},
                    {expand: true, src: ['icon*.jpg', 'iphone*.png', 'ajax-loader.gif', 'icon_facebook.gif'], dest: 'package/images'}
                ]
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'scss/es.scss', '*.html'],
            tasks: ['jshint', 'concat', 'uglify', 'compass','copy']
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

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'compass']);
    grunt.registerTask('package', ['jshint', 'concat', 'uglify', 'compass', 'replace', 'copy']);

};