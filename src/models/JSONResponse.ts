import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

class JSONResponse {
    constructor() {
    }

    static success(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, message: string, data: Object | null) {
        res.status(200).json({
            code: 200,
            message: message || 'success',
            data: data,
        });
    }

    static serverError(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, message: string, data: Object | null) {
        res.status(500).json({
            code: 500,
            message: message || 'internal server error',
            data: data,
        });
    }
}

export default JSONResponse;