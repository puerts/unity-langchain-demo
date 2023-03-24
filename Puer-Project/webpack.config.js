module.exports = {
    mode: 'production',

    target: 'node16',
    entry: {
        'langchain/llms': './src-for-puer/langchain.llms.js',
        'fetch-polyfill': './src-for-puer/fetch-polyfill.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist-for-puer',
        library: {
            type: 'module'
        }
    },
    experiments: { outputModule: true },
    optimization: { minimize: false },
    externals: [
        'fs',
        'fs/promises',
        "buffer",
        "process",
        "stream/web",
        "worker_threads",
        'crypto',
        'dns',
        'http',
        'http2',
        'https',
        'net',
        'os',
        'path',
        'querystring',
        'stream',
        'repl',
        'readline',
        'tls',
        'dgram',
        'url',
        'v8',
        'vm',
        'zlib',
        'util',
        'assert',
        'events',
        'tty'
    ].reduce((prev, v) => { 
        prev[v] = 'commonjs ' + v; 
        prev['node:' + v] = 'commonjs node:' + v; 
        return prev 
    }, {})
}