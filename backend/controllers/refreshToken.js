import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        console.log({refreshToken})
        if(!refreshToken) return res.sendStatus(401);
        console.log("sudah lewat 401 di authcontroller")
        const admin = await Admin.findOne({
            where:{
                refresh_token:refreshToken
            }
        });
        if(!admin.refresh_token) return res.sendStatus(403);
        else jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err, decoded)=>{
            if(err) return res.sendStatus(403);
            console.log("sudah lewat 403 ke dua di controller")
            const adminPlain = admin.toJSON();
            const { pass: _, refresh_token: __, ...safeAdminData } = adminPlain;
            const accessToken = jwt.sign(safeAdminData,   process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '5m'
            });
            res.json({accessToken});
        });
    }catch(error){
        console.log(error);
    }
}