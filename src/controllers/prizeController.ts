import { Router, Request, Response } from "express";
import LuckyDrawService from "../services/LuckyDrawService";
const router = Router();

router.post("/draw", async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const data = await LuckyDrawService.draw(username);
    res.send({
      success: true,
      data,
    });
  } catch (e: any) {
    res.send({
      success: false,
      error: e.message,
    });
  }
});

// router.get("/refresh", async (req: Request, res: Response) => {
//   try {
//     const data = await LuckyDrawService.refreshQuotas();
//     res.send({
//       success: true,
//       data,
//     });
//   } catch (e: any) {
//     res.send({
//       success: false,
//       error: e.message,
//     });
//   }
// });

router.post("/redeem", async (req: Request, res: Response) => {
  try {
    const data = await LuckyDrawService.redeem(
      req.body.id,
      req.body.phoneNumber
    );

    res.send({
      success: true,
      data,
    });
  } catch (e: any) {
    res.send({
      success: false,
      error: e.message,
    });
  }
});

export default router;
