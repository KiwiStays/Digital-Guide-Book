import { Router } from "express";
import upload from "../middlewares/multer.js";
import { CreateProperty, getProperty,getPropertyName, Allcount } from "../controllers/property.controller.js";
import { get } from "http";

const router = Router();

router.route("/property").post(upload.array('images'), CreateProperty);
router.route("/getproperty/:id").get( getProperty);
router.route("/getproperty/name/:id").get( getPropertyName);
router.route("/count").get(Allcount);

export default router;
