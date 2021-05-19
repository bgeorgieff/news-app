const { body } = require('express-validator')

module.exports = [
    body('directions')
        .custom((value) => {
            if(!value.includes(' - ')) {
                throw new Error('The input fields should include " - " between start and end point')
            }
            return true
        }),
    body('dateTime')
        .custom((value) => {
            if(!value.includes('-')) {
                throw new Error('The date/time fields should include " - " between start and end point')
            }
            return true
        })
]