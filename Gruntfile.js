/* Minimal by @kepano */
/* MIT License */

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* Get the user-defined OBSIDIAN_PATH from .env file 
           so that we can live reload the theme in the vault */ 

        env : {
            local : {
              src : ".env"
            }
        },

        /* Compile the compressed and uncompressed versions of
        the theme using Sass */ 

        sass: {
            unminified: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    'src/css/main.css' : 'src/scss/index.scss'
                }
            },
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'src/css/main.min.css' : 'src/scss/index.scss'
                }
            }
        },

        /* Minify theme */

        cssmin: {
            options: {
                advanced: false,
                aggressiveMerging: false,
                mediaMerging: false,
                restructuring: false
            },
            target: {
                files: {
                    'src/css/main.min.css' : 'src/css/main.min.css'
                }
            }
        },

        /* Concatenate theme files adding in the commented license, plugin compatibility, 
           and Style Settings that would otherwise be removed in compression.
        */

        concat_css: {
            dist: {
                files: {
                  'obsidian.css': ['src/css/license.css','src/css/main.min.css','src/css/plugin-compatibility.css','src/css/style-settings.css']
                }
            },
            unminified: {
                files: {
                  'Minimal.css': ['src/css/license.css','src/css/main.css','src/css/plugin-compatibility.css','src/css/style-settings.css']
                }
            }
        },

        /* Copy the finished file from the working directory to the vault directory
        and use correct theme name */ 

        copy: {
            local: { 
                expand: true,
                src: 'obsidian.css',
                dest: process.env.HOME + process.env.OBSIDIAN_PATH,
                rename: function(dest, src) {
                   return dest + 'Minimal.css';
                } 
            }
        },

        /* Watch for changes, and compile new changes */ 

        watch: {
            css: {
                files: ['src/**/*.scss','src/**/*.css'],
                tasks: ['env','sass:unminified','sass:dist','cssmin','concat_css','copy',]
            }
        }
    });
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('loadconst', 'Load constants', function() {
        grunt.config('OBSIDIAN_PATH', process.env.OBSIDIAN_PATH);
    });
    grunt.registerTask('default',['env:local','loadconst','watch']);
}