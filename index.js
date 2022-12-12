const envConfig = require('./config');
const PORT = process.env.PORT || 8080;

const DATASOURCE_BY_ENV = {
  file: require('./models/containers/container.file'),
  localMongo: require('./models/containers/container.mongo'),
  remoteMongo: require('./models/containers/container.mongo'),
  firebase: require('./models/containers/container.firebase')
};

const dataSource = DATASOURCE_BY_ENV[envConfig.DATASOURCE];

if(envConfig.DATASOURCE == 'firebase'){
  const admin = require("firebase-admin");
  const serviceAccount = require("./databases/firebase/firebase.config.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const app = require("./app");

app.listen(PORT, () => {
  if(envConfig.DATASOURCE == 'localMongo' || envConfig.DATASOURCE == 'remoteMongo'){
    dataSource.connect().then(() => {
      console.log(`Server is up and running on port ${PORT}.`);
      console.log(`Data persistence provided via ${envConfig.DATASOURCE}.`);
    })
  }
  else{
    console.log(`Server is up and running on port ${PORT}.`);
    console.log(`Data persistence provided via ${envConfig.DATASOURCE}.`);
  }
});