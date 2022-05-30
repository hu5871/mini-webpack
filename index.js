import {Complier} from './utils/complier.js';
import  webpackConfig from './webpack.config.js';


const complier=new Complier(webpackConfig)
complier.run()
