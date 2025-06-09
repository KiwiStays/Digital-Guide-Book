import {Router} from 'express';
import { getRentalwiseGuestById, getRentalwiseGuests } from '../controllers/RentalwiseGuest.controller.js';


const router = Router();
router.route('/guestData').get(getRentalwiseGuests);
router.route('/guest/:guestId/:propertyid').get(getRentalwiseGuestById);



export default router;
