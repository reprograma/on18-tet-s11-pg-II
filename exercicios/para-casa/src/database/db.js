const db = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(require("../models/alunasModel.json"))
      }, 1500)
    })
  }
  
  module.exports = db