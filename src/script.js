import Amplify, { Storage } from 'aws-amplify'
import awsconfig from './aws-exports'

Amplify.configure(awsconfig)

// Storage.configure({ level: 'public' })

const createAudioPlayer = track => {
  Storage.get(track.key).then(result => {
    const audio = document.createElement('audio')
    const source = document.createElement('source')
    audio.appendChild(source)
    audio.setAttribute('controls', '')
    source.setAttribute('src', result)
    source.setAttribute('type', 'audio/mpeg')
    document.querySelector('.tracks').appendChild(audio)
  })
}

document.getElementById('upload-form').addEventListener('submit', e => {
  e.preventDefault()
  const file = document.getElementById('file-upload').files[0]
  Storage.put(file.name, file)
    .then(result => {
      createAudioPlayer(result)
    })
    .catch(err => console.error(err))
})

Storage.list('')
  .then(result => {
    result.forEach(item => createAudioPlayer(item))
  })
  .catch(err => console.error(err))
