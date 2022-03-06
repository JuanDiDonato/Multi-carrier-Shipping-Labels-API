const { Schema, model } = require('mongoose');

const StatusSchema = new Schema({
    url : {type:String, required:false, default:''},
    label_status :{type: String, required:true, default:'pending'},
    label_status_description:{type:String, required: true, default : 'Label generation pending processing'},
},
    { timestamps: true });


module.exports = model('Status', StatusSchema);