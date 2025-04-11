import { Router } from "express";
import  upload  from "../middlewares/multer.js";
const router = Router()

import {  CreateGuest, getCloudinarySignature, guestinfo, GuestinfoById,updateGuest, UpdateGuestDocuments } from "../controllers/guest.controller.js";


// router.route("/verify/:id").post(upload.array('documents'),VerifyGuest)
router.route("/guestinfo").get(guestinfo)
router.route("/guestinfo/:id").get(GuestinfoById);
router.route("/updateguset/:id").put(upload.array('documents'),updateGuest);
router.route('/create/:id').post(CreateGuest);
router.route('/update-documents/:guestId').patch(UpdateGuestDocuments);
router.route('/cloudinary/signature').get(getCloudinarySignature);



router.route("/download-file/:url").get((req, res) => {
    const fileUrl = req.query.url;
    // console.log(fileUrl);

    // if (!fileUrl) {
    //     return res.status(400).json({ success: false, message: 'No URL provided.' });
    // }

    // try {
    //     const filename = 'downloaded-file.pdf';
    //     const localPath = await downloadFile(fileUrl, filename);
    //     res.json({ success: true, localPath });
    // } catch (error) {
    //     console.error('Error in download-file route:', error.message);
    //     res.status(500).json({ success: false, message: error.message });
    // }
});

export default router