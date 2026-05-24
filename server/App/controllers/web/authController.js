const user= require("../models/UserModel")

//register user
exports.registerUser= async(req,res)=>{
   
        const {name,email,password}= req.body;
        let userExists= await user.findOne({email})
        if(userExists){
            return res.status(400).json({message: "User already exists"})
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);
try{
    const user= new user({
        name,
        email,
        password: hashedPassword
    })
    await user.save();
    res.status(201).json({message: "User registered successfully"});

    //otp generation and sending logic will go here
    const otp= Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`otp for ${email} is ${otp}`);
    
} catch(error){
    res.status(500).json({message: "Error registering user", error: error.message})
}}
