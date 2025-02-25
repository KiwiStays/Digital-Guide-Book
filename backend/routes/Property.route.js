import { Router } from "express";
import upload from "../middlewares/multer.js";
import  {CreateProperty, getProperty,getPropertyName, Allcount, UpdateProperty, getname, getallPropertyInfo, deleteProperty, CreatePropertyinUpdate, } from "../controllers/property.controller.js";
import { get } from "http";

const router = Router();

const uploadFields = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]);
router.route("/property").post(uploadFields, CreateProperty);
router.route("/getproperty/:id").get( getProperty);
router.route("/property/:id").put(uploadFields, UpdateProperty);
router.route("/property/:id").post(uploadFields, CreatePropertyinUpdate);
router.route("/getproperty/name/:id").get( getPropertyName);
router.route("/getproperty").get(getallPropertyInfo);
router.route("/count").get(Allcount);
router.route("/property").get(getname);
router.route("/deleteproperty/:id").delete(deleteProperty);
// router.route("/export/google-sheets").post(handler);

export default router;
