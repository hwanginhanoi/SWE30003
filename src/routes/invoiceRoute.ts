import JSONResponse from "../models/JSONResponse";
import router from "./bookingRoute";
import Invoice from "../models/Invoice";

router.get('/getByUId/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'User ID is required', null);
        return;
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
        JSONResponse.serverError(req, res, 'User booking ID', null);
        return;
    }
    const invoices = await Invoice.getInvoiceByUId(userId)
    if (invoices) {
        JSONResponse.success(req, res, 'Invoice list:', invoices);
    } else {
        JSONResponse.serverError(req, res, 'Error update booking version 2', null);
    }
});

export default router;