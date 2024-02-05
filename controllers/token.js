const jwt=require('jasonwebtoken');
const user=require('../models/signupModel')

const token=jwt.sign({email:user.email},'token');