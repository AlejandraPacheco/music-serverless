import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import axios from 'axios';

Amplify.configure(awsconfig);

const createAudioPlayer = track => {
  Storage.get(track.key).then(result => {
    const audio = document.createElement('audio');
    const source = document.createElement('source');
    audio.appendChild(source);
    audio.setAttribute('controls', '');
    source.setAttribute('src', result);
    source.setAttribute('type', 'audio/mpeg');
    document.querySelector('.tracks').appendChild(audio);
  });
};

document.getElementById('upload-form').addEventListener('submit', e => {
  e.preventDefault();
  const file = document.getElementById('file-upload').files[0];
  Storage.put(file.name, file)
    .then(result => {
      const songDetails = {
        name: file.name,
        url: result.key,
      };

      console.log('songDetails:', songDetails); // Verifica que songDetails tenga los datos de la canción correctamente

      axios.post('https://yib9mdofvj.execute-api.us-east-1.amazonaws.com/prod/songs', songDetails)
        .then(response => {
          console.log('Song details saved in DynamoDB:', response.data);
        })
        .catch(error => {
          console.error(error);
        });

      createAudioPlayer(result);
    })
    .catch(err => console.error(err));
});

Storage.list('')
  .then(result => {
    result.forEach(item => createAudioPlayer(item));
  })
  .catch(err => console.error(err));


/* 
  import Amplify, { Storage } from 'aws-amplify';
  import awsconfig from './aws-exports';
  import AWS from 'aws-sdk';
  
  AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:c054c581-44f1-4d90-953f-da7415371f7b'
    })
  });
  
  Amplify.configure(awsconfig);
  
  const createAudioPlayer = track => {
    Storage.get(track.key).then(result => {
      const audio = document.createElement('audio');
      const source = document.createElement('source');
      audio.appendChild(source);
      audio.setAttribute('controls', '');
      source.setAttribute('src', result);
      source.setAttribute('type', 'audio/mpeg');
      document.querySelector('.tracks').appendChild(audio);
    });
  };
  
  document.getElementById('upload-form').addEventListener('submit', e => {
    e.preventDefault();
    const file = document.getElementById('file-upload').files[0];
    Storage.put(file.name, file)
      .then(result => {
        const songDetails = {
          name: file.name,
          url: result,
        };
  
        const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
          endpoint: 'https://yib9mdofvj.execute-api.us-east-1.amazonaws.com/prod',
          region: 'us-east-1',
          credentials: new AWS.Credentials({
            accessKeyId: 'AKIAWGBSB4QCBTEQOQMN',
            secretAccessKey: 'MsGUMYGODN+GqJhsiteYj9q83miKRR8BystpGB3y',
          }),
        });
  
        const params = {
          ConnectionId: 'YOUR_CONNECTION_ID',
          Data: JSON.stringify(songDetails),
        };
  
        // Enviar solicitud HTTP POST a tu API Gateway utilizando el servicio ApiGatewayManagementApi
        apiGatewayManagementApi.postToConnection(params, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Song details saved in DynamoDB:', data);
          }
        });
  
        createAudioPlayer(result);
      })
      .catch(err => console.error(err));
  });
  
  Storage.list('')
    .then(result => {
      result.forEach(item => createAudioPlayer(item));
    })
    .catch(err => console.error(err));
   */