import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
      destination :function(req,file,cb){
          cb(null,'./images')
      },
      filename:function(req,file,cb){
          const uniqueSuffix = Date.now()+'_'+Math.round(Math.random()*1e9);
          cb(null,file.fieldname + '_'+uniqueSuffix+path.extname(file.originalname));
      }
})


const upload = multer({ storage: storage }).fields([
    { name: "image", maxCount: 2 },
    { name: "logo", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]);
  
export default upload;