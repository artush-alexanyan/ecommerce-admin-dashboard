import { defineStore } from 'pinia'
import BASE_URL from '@/backand/api'

export const useUploadImageStore = defineStore('UploadImageStore', {
  state: () => ({
    uploadMessages: [],
    uploading: false
  }),

  actions: {
    resetMessages() {
      setTimeout(() => {
        this.uploadMessages = []
      }, 2500)
    },

    async novoMercatoUpload(image, folderName) {
      if (!(image instanceof Blob)) {
        console.error('The provided image is not a Blob or File.')
        return
      }
      if (!image) {
        this.uploadMessages.push({
          message: 'Please select an image',
          type: 'Warning'
        })
        this.resetMessages()
        return
      }

      this.uploading = true
      const formData = new FormData()
      formData.append('imageData', image) // Append the file here

      try {
        const response = await BASE_URL.post('/upload', formData, {
          headers: {
            'X-Folder-Name': folderName // Only set the custom header
          }
        })

        if (response.status === 200) {
          this.uploading = false
          return response.data.imageUrl
        } else {
          this.uploading = false
          console.error('Image upload failed:', response.data.error)
          const message = response.data.error
          this.uploadMessages.push({
            message,
            type: 'Error'
          })
          this.resetMessages()
        }
      } catch (error) {
        this.uploading = false
        console.error('Error uploading image:', error)
        const message = error.message
        this.uploadMessages.push({
          message,
          type: 'Error'
        })
        this.resetMessages()
      }
    },

    async uploadImage(image, folderName) {
      if (!image) {
        this.uploadMessages.push({
          message: 'Please select image',
          type: 'Warning'
        })
        this.resetMessages()
        return
      }
      this.uploading = true
      const formData = new FormData()
      formData.append('imageData', image)

      try {
        const response = await BASE_URL.post(`/upload-image/${folderName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.status === 200) {
          this.uploading = false
          return response.data.imageUrl
        } else {
          this.uploading = false
          console.error('Image upload failed:', response.data.error)
          const message = response.data.error
          this.uploadMessages.push({
            message,
            type: 'Error'
          })
          this.resetMessages()
        }
      } catch (error) {
        this.uploading = false
        console.error('Error uploading image:', error)
        const message = error.message
        this.uploadMessages.push({
          message,
          type: 'Error'
        })
        this.resetMessages()
      }
    },
    async novoMercatoUpload(image, folderName) {
      if (!(image instanceof Blob)) {
        console.error('The provided image is not a Blob or File.')
        return
      }
      if (!image) {
        this.uploadMessages.push({
          message: 'Please select an image',
          type: 'Warning'
        })
        this.resetMessages()
        return
      }

      this.uploading = true
      const formData = new FormData()
      formData.append('imageData', image) // Append the file here

      try {
        const response = await BASE_URL.post('/upload', formData, {
          headers: {
            'X-Folder-Name': folderName // Only set the custom header
          }
        })

        if (response.status === 200) {
          this.uploading = false
          return response.data.imageUrl
        } else {
          this.uploading = false
          console.error('Image upload failed:', response.data.error)
          const message = response.data.error
          this.uploadMessages.push({
            message,
            type: 'Error'
          })
          this.resetMessages()
        }
      } catch (error) {
        this.uploading = false
        console.error('Error uploading image:', error)
        const message = error.message
        this.uploadMessages.push({
          message,
          type: 'Error'
        })
        this.resetMessages()
      }
    }
  }
})
