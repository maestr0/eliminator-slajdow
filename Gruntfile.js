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
                dest: 'package/js/popup.js'
            },
            dev: {
                src: ['js/jquery-2.0.3.js', 'js/contentscript.js'],
                dest: 'package/js/contentscript.js'
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
            prod: {
                options: {
                    variables: {
                        'version': '<%=pkg.version%>',
                        'min.suffix': '.min'
                    },
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['manifest.json'], dest: 'package/'},
                    {expand: true, flatten: true, src: ['html/*'], dest: 'package/html/'}
                ]
            },
            dev: {
                options: {
                    variables: {
                        'version': '<%=pkg.version%>',
                        'min.suffix': ''
                    },
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['manifest.json'], dest: 'package/'},
                    {expand: true, flatten: true, src: ['html/*'], dest: 'package/html/'}
                ]
            }

        },
        uglify: {
            options: {
                banner: '/*!\n<%= manifest.name %>\nAuthor: <%= pkg.author%>\nBuild: v<%=pkg.version %> <%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %> */\n'
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
            prod: {
                files: [
                    {expand: true, src: ['images/icon*.jpg', 'images/iphone*.png', 'images/ajax-loader.gif', 'images/icon_facebook.gif'], dest: 'package/'},
                    {expand: true, src: ['js/jquery-2.0.3.min.js'], dest: 'package/'}
                ]
            },
            dev: {
                files: [
                    {expand: true, src: ['images/icon*.jpg', 'images/iphone*.png', 'images/ajax-loader.gif', 'images/icon_facebook.gif'], dest: 'package/'},
                    {expand: true, src: ['js/jquery-2.0.3.js', 'js/contentscript.js', 'js/background.js'], dest: 'package/'}

                ]
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'scss/*', 'html/*', 'images/*','js/*'],
            tasks: ['jshint', 'concat:dev', 'replace:dev', 'compass', 'copy:dev']
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
    grunt.registerTask('package', ['jshint', 'concat', 'uglify', 'compass', 'replace:prod', 'copy:prod']);
};