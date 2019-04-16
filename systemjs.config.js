(function (global) {
    // map tells the System loader where to look for things
    var map = {
        'app': 'app',
        '@angular': 'node_modules/@angular',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        'rxjs': 'node_modules/rxjs',
        'moment': 'node_modules/moment/min',
        'ng2-table': 'node_modules/ng2-table',
        'primeng': 'node_modules/primeng',
        'json': 'node_modules/systemjs-plugin-json/json.js'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'angular2-in-memory-web-api': {main: 'index.js', defaultExtension: 'js'},
        'moment': {main: 'moment.min.js', defaultExtension: 'js', type: 'cjs'},
        'ng2-table': {defaultExtension: 'js'},
        'primeng': {defaultExtension: 'js'}
    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'router-deprecated',
        'upgrade',
    ];

    // use meta configuration to reference which modules
    // should use the plugin loader
    var meta = {
        '*.json': {
            loader: 'json'
        }
    }

    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = {main: 'index.js', defaultExtension: 'js'};
    }

    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = {main: pkgName + '.umd.js', defaultExtension: 'js'};
    };

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);

    var config = {
        map: map,
        packages: packages,
        meta: meta
    };

    System.config(config);
})(this);