import path from 'path'
import CucumberAdapterFactory, { CucumberAdapter } from '../src'
import { NOOP } from '../src/constants'

process.send(NOOP)

const wdioReporter = {
    write: jest.fn(),
    emit: jest.fn(),
    on: jest.fn()
}


const conf = {
    cucumberOpts: {
        compiler: [],
        require: [path.join(__dirname, '/fixtures/es6-definition.js')]
    }
}
const feature = [path.join(__dirname, '/fixtures/es6.feature')]

global.browser = {
    config: {},
    options: {},
    capabilities: {
        device: '',
        os: 'OS X',
        os_version: 'Sierra',
        browserName: 'chrome'
    }
}

describe('adapter',  () => {
    it('comes with a factory', async () => {
        await expect(typeof CucumberAdapterFactory.run).toBe('function')
        const result = await CucumberAdapterFactory.run(
            '0-2',
            conf,
            feature,
            {})
        expect(result).toBe(0)
    })

    describe('should use the compiler as defined in the options', () => {

        it('should not run when no compiler is defined', async () => {
            await expect(CucumberAdapterFactory.run(0, conf, feature, {}))
                .rejects.toThrow('foobar')
        })

        it('should run if the compiler is defined', async () => {
            conf.cucumberOpts.compiler.push('js:@babel/register')

            await expect(CucumberAdapterFactory.run(0, conf, feature, {}))
                .resolves.toBe(0)
        })
    })
    describe('should use the required files as defined in the options', () => {
        it('should allow globs in required files', async () => {
            conf.cucumberOpts.compiler.push('js:@babel/register')
            conf.cucumberOpts.require = [path.join(__dirname, 'fixtures/es*-definition.js')]


            await expect(CucumberAdapterFactory.run(0, conf, feature, {}))
                .resolves.toBe(0)
        })
    })
})
