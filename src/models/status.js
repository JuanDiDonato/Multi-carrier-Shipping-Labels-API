const { Schema, model } = require('mongoose');

const StatusSchema = new Schema({
    shipment_id : {type: Number, required:true},
    label_status :{type: String, required:true, default:'pending'},
    url : {type:String, required:false, default:''},
    label_status_description:{type:String, required: true, default : 'Label generation pending processing'},
},
    { timestamps: true });


module.exports = model('Status', StatusSchema);