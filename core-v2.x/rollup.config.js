import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default [
    // ES Modules
    {
        input: 'src/jsvanillahelper-core.ts',
        output: [{
            file: 'dist/index.js', format: 'cjs',
        },
        {
            file: 'dist/index.es.js', format: 'es',
        }
        ],
        plugins: [
            typescript({ useTsconfigDeclarationDir: true }),
            babel({ extensions: ['.ts'] }),
        ],
    },

    // UMD
    /*{
        input: 'src/jsvanillahelper-core.ts',
        output: {
            file: 'dist/index.umd.min.js',
            format: 'umd',
            name: 'index',
            indent: false,
        },
        plugins: [
            typescript(),
            babel({ extensions: ['.ts'], exclude: 'node_modules/**' }),
            terser(),
        ],
    },*/
]
